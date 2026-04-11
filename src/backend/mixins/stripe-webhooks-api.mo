import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import PaymentTypes "../types/payments";
import TierTypes "../types/tiers";
import NotifTypes "../types/notifications";
import ProfileTypes "../types/userprofile";
import NotifLib "../lib/notifications";
import AppConfigTypes "../types/app-config";

mixin (
  accessControlState : AccessControl.AccessControlState,
  appConfig : Map.Map<Text, AppConfigTypes.ConfigEntry>,
  subscriptions : Map.Map<Common.UserId, TierTypes.UserTierSubscription>,
  profiles : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
  notifications : Map.Map<Common.UserId, List.List<NotifTypes.InAppNotification>>,
  notifCounter : { var value : Nat },
  processedStripeEvents : Map.Map<Text, Int>,
  webhookEventLog : List.List<PaymentTypes.WebhookEvent>,
  failedWebhookEvents : Map.Map<Text, PaymentTypes.FailedWebhookEvent>,
  paymentBanners : Map.Map<Text, PaymentTypes.PaymentBannerState>,
) {
  // ── appConfig helpers ─────────────────────────────────────────────────────

  /// Read a value from the stable appConfig Map. Returns "" if key not found.
  func webhooksGetConfig(key : Text) : Text {
    switch (appConfig.get(key)) {
      case (?entry) { entry.value };
      case null { "" };
    };
  };

  // ── Helpers ───────────────────────────────────────────────────────────────

  /// Find a user by their stripeCustomerId stored in their profile.
  func findUserByStripeCustomerId(customerId : Text) : ?Common.UserId {
    switch (profiles.values().find(func(p : ProfileTypes.UserProfile) : Bool {
      p.stripeCustomerId == ?customerId
    })) {
      case null { null };
      case (?p) { ?p.userId };
    };
  };

  /// Determine tier and days from a priceId using appConfig (stable, survives upgrades).
  func resolveTierFromPriceId(priceId : Text) : ?(Nat, Nat) {
    let walkerPriceId  = webhooksGetConfig("stripe_price_walker");
    let travelerPriceId = webhooksGetConfig("stripe_price_traveler");
    let lordPriceId    = webhooksGetConfig("stripe_price_lord");
    if (walkerPriceId != "" and walkerPriceId == priceId) { return ?(1, 30) };
    if (travelerPriceId != "" and travelerPriceId == priceId) { return ?(2, 90) };
    if (lordPriceId != "" and lordPriceId == priceId) { return ?(3, 180) };
    null;
  };

  /// Check whether a priceId is the configured backup price.
  func isBackupPriceId(priceId : Text) : Bool {
    let backupPriceId = webhooksGetConfig("stripe_price_backup");
    backupPriceId != "" and backupPriceId == priceId;
  };

  /// Append a WebhookEvent to the log, keeping only the last 50 entries.
  func logWebhookEvent(event : PaymentTypes.WebhookEvent) {
    webhookEventLog.add(event);
    let size = webhookEventLog.size();
    if (size > 50) {
      let arr = webhookEventLog.sliceToArray(size.toInt() - 50, size.toInt());
      webhookEventLog.clear();
      for (e in arr.values()) {
        webhookEventLog.add(e);
      };
    };
  };

  /// Set a payment banner for a user, keyed by userId+bannerType.
  func setPaymentBanner(userId : Common.UserId, bannerType : Text, message : Text, expiresAt : ?Int, now : Int) {
    let key = userId.toText() # ":" # bannerType;
    paymentBanners.add(key, {
      userId;
      bannerType;
      message;
      expiresAt;
      createdAt = now;
    });
  };

  // ── Core webhook processor ────────────────────────────────────────────────

  /// Process a Stripe webhook event. Called by the frontend relay after signature verification.
  public shared func processStripeWebhookEvent(
    eventId : Text,
    eventType : Text,
    payload : Text,
    stripeCustomerId : ?Text,
    userId : ?Text,
    priceId : ?Text,
    amountTotal : ?Nat,
    subscriptionStatus : ?Text,
    currentPeriodEnd : ?Int,
  ) : async { #ok : Text; #alreadyProcessed; #err : Text } {
    let now = Time.now();
    let DAY_NS : Int = 86_400_000_000_000;

    // Idempotency check
    if (processedStripeEvents.containsKey(eventId)) {
      logWebhookEvent({
        id = eventId;
        eventType;
        stripeCustomerId;
        userId;
        amount = amountTotal;
        status = "duplicate";
        processedAt = now;
        error = null;
      });
      return #alreadyProcessed;
    };

    // Mark as processed immediately
    processedStripeEvents.add(eventId, now);

    // Process by event type
    let result : { #ok : Text; #err : Text } = switch (eventType) {
      case "checkout.session.completed" {
        let targetUserId : ?Common.UserId = switch (stripeCustomerId) {
          case (?cid) { findUserByStripeCustomerId(cid) };
          case null {
            switch (userId) {
              case (?uid) {
                switch (profiles.values().find(func(p : ProfileTypes.UserProfile) : Bool {
                  p.userId.toText() == uid
                })) {
                  case null { null };
                  case (?p) { ?p.userId };
                };
              };
              case null { null };
            };
          };
        };

        switch (targetUserId) {
          case null { #err("User not found for checkout.session.completed") };
          case (?uid) {
            // Determine if this is a backup purchase — reads from appConfig
            let isBackup = switch (priceId) {
              case (?pid) { isBackupPriceId(pid) };
              case null { false };
            };

            if (isBackup) {
              #ok("backup_purchase_acknowledged");
            } else {
              // Resolve tier and days — reads from appConfig
              let tierDays = switch (priceId) {
                case (?pid) { resolveTierFromPriceId(pid) };
                case null { null };
              };

              switch (tierDays) {
                case null { #err("Unknown priceId: " # (switch (priceId) { case (?p) p; case null "null" })) };
                case (?(tierId, days)) {
                  // Amount verification
                  let expectedAmount : Nat = switch (tierId) {
                    case 1 { 699 };
                    case 2 { 999 };
                    case 3 { 1999 };
                    case _ { 0 };
                  };
                  switch (amountTotal) {
                    case (?amt) {
                      if (expectedAmount > 0 and amt != expectedAmount) {
                        logWebhookEvent({
                          id = eventId;
                          eventType;
                          stripeCustomerId;
                          userId = ?uid.toText();
                          amount = amountTotal;
                          status = "failed";
                          processedAt = now;
                          error = ?("FRAUD_ALERT: amount mismatch expected=" # expectedAmount.toText() # " got=" # amt.toText());
                        });
                        return #err("Amount verification failed");
                      };
                    };
                    case null {};
                  };

                  // Extend subscription
                  let daysNs : Int = days.toInt() * DAY_NS;
                  let currentSub = subscriptions.get(uid);
                  let base : Int = switch (currentSub) {
                    case (?sub) { if (sub.expirationDate > now) { sub.expirationDate } else { now } };
                    case null { now };
                  };
                  let newExpiration = base + daysNs;

                  subscriptions.add(uid, {
                    userId = uid;
                    tier = tierId;
                    expirationDate = newExpiration;
                    autoRenewal = switch (currentSub) { case (?s) s.autoRenewal; case null false };
                    stripeSubscriptionId = stripeCustomerId;
                    updatedAt = now;
                  });

                  // Save stripeCustomerId to profile
                  switch (stripeCustomerId) {
                    case (?cid) {
                      switch (profiles.get(uid)) {
                        case (?p) { profiles.add(uid, { p with stripeCustomerId = ?cid }) };
                        case null {};
                      };
                    };
                    case null {};
                  };

                  // Create refuel success notification
                  ignore NotifLib.createNotification(
                    notifications, notifCounter, uid,
                    #refuelSuccess,
                    "DeLorean Refueled! ⚡",
                    "Your DeLorean has been refueled! " # days.toText() # " days added.",
                    now,
                  );

                  // Set success banner (24 hours)
                  setPaymentBanner(uid, "success", "⚡ DeLorean refueled! " # days.toText() # " days added to your subscription.", ?(now + 24 * DAY_NS), now);

                  #ok("checkout_completed_tier_" # tierId.toText() # "_days_" # days.toText());
                };
              };
            };
          };
        };
      };

      case "invoice.paid" {
        let targetUserId = switch (stripeCustomerId) {
          case (?cid) { findUserByStripeCustomerId(cid) };
          case null { null };
        };
        switch (targetUserId) {
          case null { #err("User not found for invoice.paid") };
          case (?uid) {
            switch (subscriptions.get(uid)) {
              case (?sub) {
                let newPeriodEnd = switch (currentPeriodEnd) {
                  case (?t) { t };
                  case null { sub.expirationDate };
                };
                subscriptions.add(uid, { sub with expirationDate = newPeriodEnd; updatedAt = now });
              };
              case null {};
            };
            #ok("invoice_paid");
          };
        };
      };

      case "invoice.payment_failed" {
        let targetUserId = switch (stripeCustomerId) {
          case (?cid) { findUserByStripeCustomerId(cid) };
          case null { null };
        };
        switch (targetUserId) {
          case null { #err("User not found for invoice.payment_failed") };
          case (?uid) {
            ignore NotifLib.createNotification(
              notifications, notifCounter, uid,
              #paymentFailed,
              "Payment Failed ⚠️",
              "Payment failed. Please update your payment method to keep your listings active.",
              now,
            );
            setPaymentBanner(uid, "failure", "⚠ Payment failed. Update your payment method to avoid losing your listings.", null, now);
            #ok("payment_failed_notified");
          };
        };
      };

      case "customer.subscription.deleted" {
        let targetUserId = switch (stripeCustomerId) {
          case (?cid) { findUserByStripeCustomerId(cid) };
          case null { null };
        };
        switch (targetUserId) {
          case null { #err("User not found for customer.subscription.deleted") };
          case (?uid) {
            let gracePeriodEnd = switch (currentPeriodEnd) {
              case (?t) { t };
              case null { now + 30 * DAY_NS };
            };
            switch (subscriptions.get(uid)) {
              case (?sub) {
                subscriptions.add(uid, { sub with expirationDate = gracePeriodEnd; updatedAt = now });
              };
              case null {};
            };
            ignore NotifLib.createNotification(
              notifications, notifCounter, uid,
              #subscriptionCancelled,
              "Subscription Cancelled",
              "Your subscription has been cancelled. You have until your current period ends before your listings are archived.",
              now,
            );
            #ok("subscription_cancelled_grace_period_set");
          };
        };
      };

      case "customer.subscription.updated" {
        let targetUserId = switch (stripeCustomerId) {
          case (?cid) { findUserByStripeCustomerId(cid) };
          case null { null };
        };
        switch (targetUserId) {
          case null { #err("User not found for customer.subscription.updated") };
          case (?uid) {
            switch (subscriptions.get(uid)) {
              case (?sub) {
                let newPeriodEnd = switch (currentPeriodEnd) {
                  case (?t) { t };
                  case null { sub.expirationDate };
                };
                subscriptions.add(uid, { sub with expirationDate = newPeriodEnd; updatedAt = now });
              };
              case null {};
            };
            #ok("subscription_updated");
          };
        };
      };

      case _ { #ok("event_ignored_" # eventType) };
    };

    // Log the event
    let (status, errorMsg) = switch (result) {
      case (#ok _) { ("success", null) };
      case (#err msg) { ("failed", ?msg) };
    };

    logWebhookEvent({
      id = eventId;
      eventType;
      stripeCustomerId;
      userId;
      amount = amountTotal;
      status;
      processedAt = now;
      error = errorMsg;
    });

    // On error, also store in failedWebhookEvents for admin retry
    switch (result) {
      case (#err msg) {
        failedWebhookEvents.add(eventId, {
          id = eventId;
          stripeEventId = eventId;
          eventType;
          payload;
          errorMessage = msg;
          retryCount = 0;
          createdAt = now;
        });
        return #err(msg);
      };
      case (#ok txt) { #ok(txt) };
    };
  };

  /// Admin: retry a failed webhook event by re-processing with stored payload.
  public shared ({ caller }) func adminRetryFailedWebhookEvent(
    eventId : Text,
  ) : async { #ok; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized");
    };
    let event = switch (failedWebhookEvents.get(eventId)) {
      case null { return #err("Event not found: " # eventId) };
      case (?e) { e };
    };

    processedStripeEvents.remove(eventId);
    failedWebhookEvents.add(eventId, { event with retryCount = event.retryCount + 1 });

    let retryResult = await processStripeWebhookEvent(
      event.stripeEventId,
      event.eventType,
      event.payload,
      null,
      null,
      null,
      null,
      null,
      null,
    );

    switch (retryResult) {
      case (#ok _) {
        failedWebhookEvents.remove(eventId);
        #ok;
      };
      case (#alreadyProcessed) {
        failedWebhookEvents.remove(eventId);
        #ok;
      };
      case (#err msg) { #err("Retry failed: " # msg) };
    };
  };

  /// Admin: get the last 50 webhook events.
  public query ({ caller }) func getWebhookLog() : async [PaymentTypes.WebhookEvent] {
    if (not AccessControl.isAdmin(accessControlState, caller)) { return [] };
    webhookEventLog.toArray();
  };

  /// Admin: get all failed webhook events awaiting retry.
  public query ({ caller }) func getFailedWebhookEvents() : async [PaymentTypes.FailedWebhookEvent] {
    if (not AccessControl.isAdmin(accessControlState, caller)) { return [] };
    failedWebhookEvents.values().toArray();
  };

  /// Get the caller's current payment banner (success or failure).
  public shared ({ caller }) func getPaymentBanner() : async ?PaymentTypes.PaymentBannerState {
    let now = Time.now();
    for (bannerType in ["success", "failure"].values()) {
      let key = caller.toText() # ":" # bannerType;
      switch (paymentBanners.get(key)) {
        case null {};
        case (?banner) {
          switch (banner.expiresAt) {
            case (?exp) {
              if (exp < now) {
                paymentBanners.remove(key);
              } else {
                return ?banner;
              };
            };
            case null { return ?banner };
          };
        };
      };
    };
    null;
  };

  /// Dismiss the caller's payment banner.
  public shared ({ caller }) func dismissPaymentBanner() : async () {
    for (bannerType in ["success", "failure"].values()) {
      let key = caller.toText() # ":" # bannerType;
      paymentBanners.remove(key);
    };
  };
};

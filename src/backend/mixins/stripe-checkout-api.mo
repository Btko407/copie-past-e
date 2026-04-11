import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Int "mo:core/Int";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import PaymentTypes "../types/payments";
import TierTypes "../types/tiers";
import ProfileTypes "../types/userprofile";
import AppConfigTypes "../types/app-config";

mixin (
  accessControlState : AccessControl.AccessControlState,
  appConfig : Map.Map<Text, AppConfigTypes.ConfigEntry>,
  profiles : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
  subscriptions : Map.Map<Common.UserId, TierTypes.UserTierSubscription>,
  stripeCheckoutRateLimit : Map.Map<Text, List.List<Int>>,
  webhookEventLog : List.List<PaymentTypes.WebhookEvent>,
) {
  // Management canister reference for HTTP outcalls
  let IC_MANAGEMENT_STRIPE : actor {
    http_request : ({
      url : Text;
      max_response_bytes : ?Nat64;
      method : { #get; #head; #post };
      headers : [{ name : Text; value : Text }];
      body : ?Blob;
      is_replicated : ?Bool;
    }) -> async {
      status : Nat;
      headers : [{ name : Text; value : Text }];
      body : Blob;
    };
  } = actor "aaaaa-aa";

  // ── appConfig helpers ─────────────────────────────────────────────────────

  /// Read a value from the stable appConfig Map. Returns "" if key not found.
  func checkoutGetConfig(key : Text) : Text {
    switch (appConfig.get(key)) {
      case (?entry) { entry.value };
      case null { "" };
    };
  };

  // ── Helpers ───────────────────────────────────────────────────────────────

  /// Get the active Stripe secret key from appConfig (stable, survives upgrades).
  func stripeCheckoutSecretKey() : ?Text {
    let key = checkoutGetConfig("stripe_secret_key");
    if (key == "") null else ?key;
  };

  /// Parse a JSON string field value from a simple flat JSON object.
  func stripeParseJsonStringField(json : Text, field : Text) : ?Text {
    let marker = "\"" # field # "\":\"";
    let parts = json.split(#text marker);
    ignore parts.next();
    switch (parts.next()) {
      case null { null };
      case (?afterMarker) {
        let valueParts = afterMarker.split(#char '\"');
        valueParts.next();
      };
    };
  };

  /// Check rate limit: max 5 checkout attempts per user per hour.
  func checkAndUpdateRateLimit(userId : Text, nowNs : Int) : Bool {
    let windowNs : Int = 3_600_000_000_000;
    let cutoff = nowNs - windowNs;

    let timestamps = switch (stripeCheckoutRateLimit.get(userId)) {
      case null { List.empty<Int>() };
      case (?ts) { ts };
    };

    let recent = timestamps.filter(func(t : Int) : Bool { t > cutoff });

    if (recent.size() >= 5) {
      return false;
    };

    recent.add(nowNs);
    stripeCheckoutRateLimit.add(userId, recent);
    true;
  };

  /// Validate that the priceId is a known configured price — reads from appConfig.
  func isValidPriceId(priceId : Text) : Bool {
    let walkerPriceId = checkoutGetConfig("stripe_price_walker");
    let travelerPriceId = checkoutGetConfig("stripe_price_traveler");
    let lordPriceId = checkoutGetConfig("stripe_price_lord");
    let backupPriceId = checkoutGetConfig("stripe_price_backup");
    (walkerPriceId != "" and walkerPriceId == priceId)
      or (travelerPriceId != "" and travelerPriceId == priceId)
      or (lordPriceId != "" and lordPriceId == priceId)
      or (backupPriceId != "" and backupPriceId == priceId);
  };

  /// Resolve the tier name from a priceId using appConfig.
  func resolveTierNameFromPriceId(priceId : Text) : Text {
    let walkerPriceId = checkoutGetConfig("stripe_price_walker");
    let travelerPriceId = checkoutGetConfig("stripe_price_traveler");
    let lordPriceId = checkoutGetConfig("stripe_price_lord");
    let backupPriceId = checkoutGetConfig("stripe_price_backup");
    if (walkerPriceId == priceId) { "walker" }
    else if (travelerPriceId == priceId) { "traveler" }
    else if (lordPriceId == priceId) { "lord" }
    else if (backupPriceId == priceId) { "backup" }
    else { "unknown" };
  };

  /// Get or create a Stripe customer for the given user. Returns the customer ID.
  func getOrCreateStripeCustomer(uid : Common.UserId, secretKey : Text) : async { #ok : Text; #err : Text } {
    switch (profiles.get(uid)) {
      case (?p) {
        switch (p.stripeCustomerId) {
          case (?cid) { return #ok(cid) };
          case null {
            let email = p.email;
            let body = "email=" # email # "&metadata[userId]=" # uid.toText();
            try {
              let response = await (with cycles = 500_000_000) IC_MANAGEMENT_STRIPE.http_request({
                url = "https://api.stripe.com/v1/customers";
                method = #post;
                body = ?body.encodeUtf8();
                headers = [
                  { name = "Authorization"; value = "Bearer " # secretKey },
                  { name = "Content-Type"; value = "application/x-www-form-urlencoded" },
                  { name = "Stripe-Version"; value = "2023-10-16" },
                ];
                max_response_bytes = ?4_096;
                is_replicated = null;
              });
              if (response.status >= 200 and response.status < 300) {
                switch (response.body.decodeUtf8()) {
                  case (?responseText) {
                    switch (stripeParseJsonStringField(responseText, "id")) {
                      case (?customerId) {
                        profiles.add(uid, { p with stripeCustomerId = ?customerId });
                        #ok(customerId);
                      };
                      case null { #err("Failed to parse Stripe customer ID from response") };
                    };
                  };
                  case null { #err("Failed to decode Stripe API response") };
                };
              } else {
                #err("Stripe API error: status " # response.status.toText());
              };
            } catch (e) {
              #err("HTTP outcall failed: " # e.message());
            };
          };
        };
      };
      case null { #err("User profile not found") };
    };
  };

  // ── Public API ────────────────────────────────────────────────────────────

  /// Create a Stripe Checkout Session for the given priceId.
  /// Reads the secret key and price IDs from appConfig at call time.
  public shared ({ caller }) func createStripeCheckoutSession(
    priceId : Text,
    userId : Text,
  ) : async { #ok : Text; #err : Text } {
    let secretKey = switch (stripeCheckoutSecretKey()) {
      case null { return #err("Stripe not configured. Add your secret key in admin > Payments.") };
      case (?k) { k };
    };

    let now = Time.now();

    // Rate limiting
    if (not checkAndUpdateRateLimit(caller.toText(), now)) {
      return #err("RATE_LIMITED");
    };

    // Price validation against appConfig
    if (not isValidPriceId(priceId)) {
      return #err("INVALID_PRICE_ID");
    };

    // Get or create Stripe customer
    let stripeCustomerId = switch (await getOrCreateStripeCustomer(caller, secretKey)) {
      case (#ok cid) { cid };
      case (#err msg) { return #err(msg) };
    };

    // Resolve tier name for Radar metadata
    let tierName = resolveTierNameFromPriceId(priceId);

    // Build checkout session request body
    let body = "mode=payment"
      # "&customer=" # stripeCustomerId
      # "&line_items[0][price]=" # priceId
      # "&line_items[0][quantity]=1"
      # "&payment_method_types[0]=card"
      # "&allow_promotion_codes=true"
      # "&metadata[userId]=" # userId
      # "&payment_intent_data[description]=Copie%20Past-e%20subscription%20fuel"
      # "&payment_intent_data[metadata][userId]=" # userId
      # "&payment_intent_data[metadata][tier]=" # tierName
      # "&success_url=https://past-e-jev.caffeine.xyz/payment-success"
      # "&cancel_url=https://past-e-jev.caffeine.xyz/payment-cancel";

    try {
      let response = await (with cycles = 500_000_000) IC_MANAGEMENT_STRIPE.http_request({
        url = "https://api.stripe.com/v1/checkout/sessions";
        method = #post;
        body = ?body.encodeUtf8();
        headers = [
          { name = "Authorization"; value = "Bearer " # secretKey },
          { name = "Content-Type"; value = "application/x-www-form-urlencoded" },
          { name = "Stripe-Version"; value = "2023-10-16" },
        ];
        max_response_bytes = ?10_000;
        is_replicated = null;
      });
      if (response.status >= 200 and response.status < 300) {
        switch (response.body.decodeUtf8()) {
          case (?responseText) {
            switch (stripeParseJsonStringField(responseText, "url")) {
              case (?url) { #ok(url) };
              case null { #err("Failed to parse checkout session URL") };
            };
          };
          case null { #err("Failed to decode Stripe response") };
        };
      } else {
        let errMsg = switch (response.body.decodeUtf8()) {
          case (?t) { "Stripe error " # response.status.toText() # ": " # t };
          case null { "Stripe error: status " # response.status.toText() };
        };
        #err(errMsg);
      };
    } catch (e) {
      #err("HTTP outcall failed: " # e.message());
    };
  };

  /// Create a Stripe Billing Portal session for the caller.
  public shared ({ caller }) func createStripePortalSession() : async { #ok : Text; #err : Text } {
    let secretKey = switch (stripeCheckoutSecretKey()) {
      case null { return #err("Stripe not configured") };
      case (?k) { k };
    };

    let stripeCustomerId = switch (profiles.get(caller)) {
      case null { return #err("Profile not found") };
      case (?p) {
        switch (p.stripeCustomerId) {
          case null { return #err("No Stripe customer on file. Please make a payment first.") };
          case (?cid) { cid };
        };
      };
    };

    let body = "customer=" # stripeCustomerId
      # "&return_url=https://past-e-jev.caffeine.xyz/wallet";

    try {
      let response = await (with cycles = 500_000_000) IC_MANAGEMENT_STRIPE.http_request({
        url = "https://api.stripe.com/v1/billing_portal/sessions";
        method = #post;
        body = ?body.encodeUtf8();
        headers = [
          { name = "Authorization"; value = "Bearer " # secretKey },
          { name = "Content-Type"; value = "application/x-www-form-urlencoded" },
          { name = "Stripe-Version"; value = "2023-10-16" },
        ];
        max_response_bytes = ?4_096;
        is_replicated = null;
      });
      if (response.status >= 200 and response.status < 300) {
        switch (response.body.decodeUtf8()) {
          case (?responseText) {
            switch (stripeParseJsonStringField(responseText, "url")) {
              case (?url) { #ok(url) };
              case null { #err("Failed to parse portal session URL") };
            };
          };
          case null { #err("Failed to decode Stripe response") };
        };
      } else {
        let errMsg = switch (response.body.decodeUtf8()) {
          case (?t) { "Stripe portal error " # response.status.toText() # ": " # t };
          case null { "Stripe portal error: status " # response.status.toText() };
        };
        #err(errMsg);
      };
    } catch (e) {
      #err("HTTP outcall failed: " # e.message());
    };
  };

  /// Get the Stripe integration health status — reads from appConfig.
  public query func getStripeHealthStatus() : async {
    status : Text;
    keysConfigured : Bool;
    webhookConfigured : Bool;
    lastWebhookReceived : ?Int;
  } {
    let secretKey = checkoutGetConfig("stripe_secret_key");
    let keysConfigured = secretKey != "";

    let webhookTest = checkoutGetConfig("stripe_webhook_secret_test");
    let webhookLive = checkoutGetConfig("stripe_webhook_secret_live");
    let webhookConfigured = webhookTest != "" or webhookLive != "";

    let lastWebhookReceived : ?Int = switch (webhookEventLog.last()) {
      case null { null };
      case (?e) { ?e.processedAt };
    };

    {
      status = if (keysConfigured) { "ok" } else { "not_configured" };
      keysConfigured;
      webhookConfigured;
      lastWebhookReceived;
    };
  };

  /// Admin: get revenue stats (completed payments grouped by period).
  public query ({ caller }) func getRevenueStats() : async {
    today : Nat;
    week : Nat;
    month : Nat;
    activeSubscribers : Nat;
  } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return { today = 0; week = 0; month = 0; activeSubscribers = 0 };
    };

    let now = Time.now();
    let DAY_NS : Int = 86_400_000_000_000;
    let todayCutoff = now - DAY_NS;
    let weekCutoff = now - 7 * DAY_NS;
    let monthCutoff = now - 30 * DAY_NS;

    var todayCount : Nat = 0;
    var weekCount : Nat = 0;
    var monthCount : Nat = 0;

    for (entry in webhookEventLog.values()) {
      if (entry.eventType == "checkout.session.completed" and entry.status == "success") {
        if (entry.processedAt >= todayCutoff) { todayCount += 1 };
        if (entry.processedAt >= weekCutoff) { weekCount += 1 };
        if (entry.processedAt >= monthCutoff) { monthCount += 1 };
      };
    };

    var activeSubscribers : Nat = 0;
    for ((_, sub) in subscriptions.entries()) {
      if (sub.tier > 0 and sub.expirationDate > now) {
        activeSubscribers += 1;
      };
    };

    { today = todayCount; week = weekCount; month = monthCount; activeSubscribers };
  };
};

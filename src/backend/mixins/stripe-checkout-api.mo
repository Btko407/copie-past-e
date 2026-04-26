import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Blob "mo:core/Blob";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import PaymentTypes "../types/payments";
import TierTypes "../types/tiers";
import ProfileTypes "../types/userprofile";
import AppConfigTypes "../types/app-config";
import NotifTypes "../types/notifications";
import NotifLib "../lib/notifications";
import MonitoringLib "../lib/monitoring";

mixin (
  accessControlState : AccessControl.AccessControlState,
  appConfig : Map.Map<Text, AppConfigTypes.ConfigEntry>,
  profiles : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
  subscriptions : Map.Map<Common.UserId, TierTypes.UserTierSubscription>,
  stripeCheckoutRateLimit : Map.Map<Text, List.List<Int>>,
  webhookEventLog : List.List<PaymentTypes.WebhookEvent>,
  pendingSessions : Map.Map<Text, PaymentTypes.PendingSession>,
  notifications : Map.Map<Common.UserId, List.List<NotifTypes.InAppNotification>>,
  notifCounter : { var value : Nat },
  paymentBanners : Map.Map<Text, PaymentTypes.PaymentBannerState>,
  verifiedStripeSessionIds : Set.Set<Text>,
  monLogs        : Map.Map<Nat, MonitoringLib.MonitoringLogEntry>,
  monNextIndex   : { var value : Nat },
  monTotalLogged : { var value : Nat },
) {
  // Management canister reference factory — instantiated locally per call to avoid
  // stable type compatibility issues on upgrade (actor refs at mixin scope are stable state).
  func icManagementStripe() : actor {
    http_request : ({
      url : Text;
      max_response_bytes : ?Nat64;
      method : { #get; #head; #post };
      headers : [{ name : Text; value : Text }];
      body : ?Blob;
      is_replicated : ?Bool;
      transform : ?{
        function : shared query ({
          response : {
            status : Nat;
            headers : [{ name : Text; value : Text }];
            body : Blob;
          };
          context : Blob;
        }) -> async {
          status : Nat;
          headers : [{ name : Text; value : Text }];
          body : Blob;
        };
        context : Blob;
      };
    }) -> async {
      status : Nat;
      headers : [{ name : Text; value : Text }];
      body : Blob;
    };
  } {
    actor "aaaaa-aa"
  };

  // ── Transform functions for ICP consensus ────────────────────────────────
  // All Stripe responses include non-deterministic fields (timestamps, request IDs,
  // livemode, created). These transform functions keep only the stable fields needed
  // so every replica returns identical data for ICP consensus.

  /// Transform for Stripe customer create — keeps only: id, email, object.
  public query func transformStripeCustomerResponse(raw : {
    response : {
      status : Nat;
      headers : [{ name : Text; value : Text }];
      body : Blob;
    };
    context : Blob;
  }) : async {
    status : Nat;
    headers : [{ name : Text; value : Text }];
    body : Blob;
  } {
    let stableBody : Blob = switch (raw.response.body.decodeUtf8()) {
      case null { "{}".encodeUtf8() };
      case (?bodyText) {
        let id    = extractJsonStringField(bodyText, "id");
        let email = extractJsonStringField(bodyText, "email");
        let obj   = extractJsonStringField(bodyText, "object");
        let stableJson = "{\"id\":\"" # id # "\",\"email\":\"" # email # "\",\"object\":\"" # obj # "\"}";
        stableJson.encodeUtf8()
      };
    };
    {
      status = raw.response.status;
      headers = []; // strip all headers
      body = stableBody;
    }
  };

  /// Transform for Stripe checkout session — keeps only: id, url, status, payment_status.
  public query func transformStripeCheckoutResponse(raw : {
    response : {
      status : Nat;
      headers : [{ name : Text; value : Text }];
      body : Blob;
    };
    context : Blob;
  }) : async {
    status : Nat;
    headers : [{ name : Text; value : Text }];
    body : Blob;
  } {
    let stableBody : Blob = switch (raw.response.body.decodeUtf8()) {
      case null { "{}".encodeUtf8() };
      case (?bodyText) {
        let id             = extractJsonStringField(bodyText, "id");
        let url            = extractJsonStringField(bodyText, "url");
        let status         = extractJsonStringField(bodyText, "status");
        let paymentStatus  = extractJsonStringField(bodyText, "payment_status");
        let stableJson = "{\"id\":\"" # id # "\",\"url\":\"" # url # "\",\"status\":\"" # status # "\",\"payment_status\":\"" # paymentStatus # "\"}";
        stableJson.encodeUtf8()
      };
    };
    {
      status = raw.response.status;
      headers = []; // strip all headers
      body = stableBody;
    }
  };

  /// Transform for Stripe portal session — keeps only: id, url.
  public query func transformStripePortalResponse(raw : {
    response : {
      status : Nat;
      headers : [{ name : Text; value : Text }];
      body : Blob;
    };
    context : Blob;
  }) : async {
    status : Nat;
    headers : [{ name : Text; value : Text }];
    body : Blob;
  } {
    let stableBody : Blob = switch (raw.response.body.decodeUtf8()) {
      case null { "{}".encodeUtf8() };
      case (?bodyText) {
        let id  = extractJsonStringField(bodyText, "id");
        let url = extractJsonStringField(bodyText, "url");
        let stableJson = "{\"id\":\"" # id # "\",\"url\":\"" # url # "\"}";
        stableJson.encodeUtf8()
      };
    };
    {
      status = raw.response.status;
      headers = [];
      body = stableBody;
    }
  };

  /// Transform for Stripe verify session — keeps only: payment_status.
  public query func transformStripeVerifyResponse(raw : {
    response : {
      status : Nat;
      headers : [{ name : Text; value : Text }];
      body : Blob;
    };
    context : Blob;
  }) : async {
    status : Nat;
    headers : [{ name : Text; value : Text }];
    body : Blob;
  } {
    let stableBody : Blob = switch (raw.response.body.decodeUtf8()) {
      case null { "{}".encodeUtf8() };
      case (?bodyText) {
        let paymentStatus = extractJsonStringField(bodyText, "payment_status");
        let stableJson = "{\"payment_status\":\"" # paymentStatus # "\"}";
        stableJson.encodeUtf8()
      };
    };
    {
      status = raw.response.status;
      headers = [];
      body = stableBody;
    }
  };

  /// Transform for Stripe /v1/account — keeps only: id, charges_enabled.
  /// Returns structured JSON with status code so error handling is deterministic.
  public query func transformStripeAccountResponse(raw : {
    response : {
      status : Nat;
      headers : [{ name : Text; value : Text }];
      body : Blob;
    };
    context : Blob;
  }) : async {
    status : Nat;
    headers : [{ name : Text; value : Text }];
    body : Blob;
  } {
    let stableBody : Blob = switch (raw.response.body.decodeUtf8()) {
      case null { ("{\"status\":" # raw.response.status.toText() # ",\"error\":\"Empty response\"}").encodeUtf8() };
      case (?bodyText) {
        if (raw.response.status >= 200 and raw.response.status < 300) {
          let id             = extractJsonStringField(bodyText, "id");
          let chargesEnabled = if (bodyText.contains(#text "\"charges_enabled\":true")) "true" else "false";
          ("{\"status\":" # raw.response.status.toText() # ",\"id\":\"" # id # "\",\"charges_enabled\":" # chargesEnabled # "}").encodeUtf8()
        } else if (raw.response.status == 401) {
          "{\"status\":401,\"error\":\"Invalid API key\"}".encodeUtf8()
        } else {
          let errorMsg = extractJsonStringField(bodyText, "message");
          let msg = if (errorMsg != "") { errorMsg } else { "Unknown error" };
          ("{\"status\":" # raw.response.status.toText() # ",\"error\":\"" # msg # "\"}").encodeUtf8()
        };
      };
    };
    {
      status = raw.response.status;
      headers = [];
      body = stableBody;
    }
  };

  // ── appConfig helpers ─────────────────────────────────────────────────────

  /// Read a value from the stable appConfig Map. Returns "" if key not found.
  func checkoutGetConfig(key : Text) : Text {
    switch (appConfig.get(key)) {
      case (?entry) { entry.value };
      case null { "" };
    };
  };

  /// Config validation gate: traps if Stripe secret key is not configured.
  /// Call at the start of every function that makes Stripe API calls.
  func assertStripeConfig() {
    let key = checkoutGetConfig("stripe_secret_key");
    if (key == "") {
      Runtime.trap("CONFIG_INVALID: Missing required API keys");
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
    let v = extractJsonStringField(json, field);
    if (v == "") null else ?v;
  };

  /// Extract a JSON string field — returns "" if not found. Used by transform functions too.
  func extractJsonStringField(json : Text, field : Text) : Text {
    let marker = "\"" # field # "\":\"";
    let parts = json.split(#text marker);
    ignore parts.next();
    switch (parts.next()) {
      case null { "" };
      case (?afterMarker) {
        let valueParts = afterMarker.split(#char '\"');
        switch (valueParts.next()) {
          case null { "" };
          case (?v) { v };
        };
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

  /// Resolve the tier ID and days from a priceId using appConfig.
  func resolveTierFromPriceId(priceId : Text) : ?(Nat, Nat) {
    let walkerPriceId   = checkoutGetConfig("stripe_price_walker");
    let travelerPriceId = checkoutGetConfig("stripe_price_traveler");
    let lordPriceId     = checkoutGetConfig("stripe_price_lord");
    if (walkerPriceId != "" and walkerPriceId == priceId)     { return ?(1, 30) };
    if (travelerPriceId != "" and travelerPriceId == priceId) { return ?(2, 90) };
    if (lordPriceId != "" and lordPriceId == priceId)         { return ?(3, 180) };
    null;
  };

  /// Resolve the tier name from a priceId using appConfig.
  func resolveTierNameFromPriceId(priceId : Text) : Text {
    let walkerPriceId   = checkoutGetConfig("stripe_price_walker");
    let travelerPriceId = checkoutGetConfig("stripe_price_traveler");
    let lordPriceId     = checkoutGetConfig("stripe_price_lord");
    let backupPriceId   = checkoutGetConfig("stripe_price_backup");
    if (walkerPriceId == priceId)   { "walker" }
    else if (travelerPriceId == priceId) { "traveler" }
    else if (lordPriceId == priceId)     { "lord" }
    else if (backupPriceId == priceId)   { "backup" }
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
              // 49_140_000_000 cycles for POST request.
              // transform: strips timestamps, request IDs, livemode — keeps only id, email, object.
              let response = await (with cycles = 49_140_000_000) icManagementStripe().http_request({
                url = "https://api.stripe.com/v1/customers";
                method = #post;
                body = ?body.encodeUtf8();
                headers = [
                  { name = "Authorization"; value = "Bearer " # secretKey },
                  { name = "Content-Type"; value = "application/x-www-form-urlencoded" },
                  { name = "Stripe-Version"; value = "2023-10-16" },
                ];
                max_response_bytes = ?4_096;
                is_replicated = ?false;
                transform = ?{
                  function = transformStripeCustomerResponse;
                  context = Blob.fromArray([]);
                };
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
  /// Stores a pending session record so verifyAndGrantPayment can confirm it later.
  /// Reads the secret key and price IDs from appConfig at call time.
  public shared ({ caller }) func createStripeCheckoutSession(
    priceId : Text,
    userId : Text,
  ) : async { #ok : Text; #err : Text } {
    MonitoringLib.logEvent(monLogs, monNextIndex, monTotalLogged, "info", "Stripe", "createStripeCheckoutSession called");
    assertStripeConfig();
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

    // Determine tier days from priceId
    let (tierId, tierDays) = switch (resolveTierFromPriceId(priceId)) {
      case (?(tid, days)) { (tid, days) };
      case null { (0, 0) }; // backup purchase — no subscription days
    };

    // Get or create Stripe customer
    let stripeCustomerId = switch (await getOrCreateStripeCustomer(caller, secretKey)) {
      case (#ok cid) { cid };
      case (#err msg) { return #err(msg) };
    };

    // Resolve tier name for Radar metadata
    let tierName = resolveTierNameFromPriceId(priceId);

    // Build checkout session request body
    let baseUrl = do { let u = checkoutGetConfig("site_base_url"); if (u == "") "https://past-e-jev.caffeine.xyz" else u };
    let body = "mode=payment"
      # "&customer=" # stripeCustomerId
      # "&line_items[0][price]=" # priceId
      # "&line_items[0][quantity]=1"
      # "&payment_method_types[0]=card"
      # "&allow_promotion_codes=true"
      # "&metadata[userId]=" # userId
      # "&metadata[tierDays]=" # tierDays.toText()
      # "&payment_intent_data[description]=Copie%20Past-e%20subscription%20fuel"
      # "&payment_intent_data[metadata][userId]=" # userId
      # "&payment_intent_data[metadata][tier]=" # tierName
      # "&success_url=" # baseUrl # "/payment-success?session_id={CHECKOUT_SESSION_ID}"
      # "&cancel_url=" # baseUrl # "/payment-cancel";

    var createAttempt : Nat = 0;
    var createSuccess : Bool = false;
    var createResponseText : Text = "";
    var createHttpError : ?Text = null;

    label createLoop loop {
      createAttempt += 1;
      if (createAttempt > 3) break createLoop;

      try {
        // 49_140_000_000 cycles — minimum for a POST outcall.
        // transform: strips timestamps, request IDs, livemode — keeps id, url, status, payment_status.
        let response = await (with cycles = 49_140_000_000) icManagementStripe().http_request({
          url = "https://api.stripe.com/v1/checkout/sessions";
          method = #post;
          body = ?body.encodeUtf8();
          headers = [
            { name = "Authorization"; value = "Bearer " # secretKey },
            { name = "Content-Type"; value = "application/x-www-form-urlencoded" },
            { name = "Stripe-Version"; value = "2023-10-16" },
          ];
          max_response_bytes = ?10_000;
          is_replicated = ?false;
          transform = ?{
            function = transformStripeCheckoutResponse;
            context = Blob.fromArray([]);
          };
        });

        createResponseText := switch (response.body.decodeUtf8()) {
          case null {
            createHttpError := ?"Could not read Stripe response";
            ""
          };
          case (?t) { t };
        };

        if (response.status >= 200 and response.status < 300) {
          createSuccess := true;
          break createLoop;
        } else {
          createHttpError := ?("Stripe error: status " # response.status.toText());
        };
      } catch (e) {
        createHttpError := ?("Network error (attempt " # createAttempt.toText() # "/3): " # e.message());
      };
    };

    if (not createSuccess) {
      let errDetail = switch (createHttpError) {
        case (?err) { err };
        case null { "Unknown error" };
      };
      MonitoringLib.logEvent(monLogs, monNextIndex, monTotalLogged, "error", "Stripe", "Session creation failed: " # errDetail);
      return #err("Checkout session creation failed after 3 attempts: " # errDetail);
    };

    switch (createResponseText) {
      case "" { return #err("Failed to decode Stripe response") };
      case _ {};
    };

    let sessionUrl = switch (stripeParseJsonStringField(createResponseText, "url")) {
      case (?u) { u };
      case null { return #err("Failed to parse checkout session URL") };
    };
    let sessionId = switch (stripeParseJsonStringField(createResponseText, "id")) {
      case (?i) { i };
      case null { return #err("Failed to parse checkout session ID") };
    };
    // Store pending session so verifyAndGrantPayment can confirm it
    pendingSessions.add(caller.toText(), {
      sessionId;
      priceId;
      tierDays;
      tierId;
      createdAt = now;
    });
    #ok(sessionUrl);
  };

  /// Verify a completed Stripe checkout session and grant subscription days ADDITIVELY.
  /// Automatically retries failed verification up to 3 times.
  /// Once verified, session is marked as complete (idempotent).
  public shared ({ caller }) func verifyAndGrantPayment(
    sessionId : Text,
  ) : async { #ok : Text; #err : Text } {
    assertStripeConfig();
    let secretKey = switch (stripeCheckoutSecretKey()) {
      case null { return #err("Stripe not configured. Add your secret key in admin > Payments.") };
      case (?k) { k };
    };

    let userId = caller.toText();

    let pending = switch (pendingSessions.get(userId)) {
      case null { return #err("No pending payment found. Please start checkout again.") };
      case (?s) { s };
    };

    if (pending.sessionId != sessionId) {
      return #err("Session ID mismatch. Please do not modify the URL.");
    };

    if (verifiedStripeSessionIds.contains(sessionId)) {
      return #ok("Payment already verified. Your subscription days have been applied. You can close this window.");
    };

    var attempt : Nat = 0;
    var verified : Bool = false;
    var responseText : Text = "";
    var httpError : ?Text = null;

    label attemptLoop loop {
      attempt += 1;
      if (attempt > 3) break attemptLoop;

      try {
        let response = await (with cycles = 20_949_972_000) icManagementStripe().http_request({
          url = "https://api.stripe.com/v1/checkout/sessions/" # sessionId;
          method = #get;
          body = null;
          headers = [
            { name = "Authorization"; value = "Bearer " # secretKey },
            { name = "Stripe-Version"; value = "2023-10-16" },
          ];
          max_response_bytes = ?5_000;
          is_replicated = ?false;
          transform = ?{
            function = transformStripeVerifyResponse;
            context = Blob.fromArray([]);
          };
        });

        responseText := switch (response.body.decodeUtf8()) {
          case null {
            httpError := ?"Could not read Stripe response";
            ""
          };
          case (?t) { t };
        };

        if (response.status >= 200 and response.status < 300) {
          verified := true;
          break attemptLoop;
        } else {
          httpError := ?("Stripe error: status " # response.status.toText());
        };
      } catch (e) {
        httpError := ?("Network error (attempt " # attempt.toText() # "/3): " # e.message());
      };
    };

    if (not verified) {
      let errDetail = switch (httpError) {
        case (?err) { err };
        case null { "Unknown error" };
      };
      return #err("Payment verification failed after 3 attempts: " # errDetail);
    };

    let paymentStatus = extractJsonStringField(responseText, "payment_status");

    if (paymentStatus == "paid") {
      let now = Time.now();
      let DAY_NS : Int = 86_400_000_000_000;
      let daysNs : Int = pending.tierDays.toInt() * DAY_NS;

      // ADDITIVE: add new days on top of existing subscription time (never replace)
      let currentSub = subscriptions.get(caller);
      let base : Int = switch (currentSub) {
        case (?sub) { if (sub.expirationDate > now) { sub.expirationDate } else { now } };
        case null { now };
      };
      let newExpiration = base + daysNs;

      // Delete the pending session BEFORE granting days.
      // This prevents double-grant even if verifyAndGrantPayment is called concurrently:
      // a second call will find no pending session and return #err("No pending payment found").
      pendingSessions.remove(userId);

      subscriptions.add(caller, {
        userId = caller;
        tier = pending.tierId;
        expirationDate = newExpiration;
        autoRenewal = switch (currentSub) { case (?s) s.autoRenewal; case null false };
        stripeSubscriptionId = null;
        updatedAt = now;
      });

      ignore NotifLib.createNotification(
        notifications, notifCounter, caller,
        #refuelSuccess,
        "DeLorean Refueled!",
        "Your DeLorean has been refueled! " # pending.tierDays.toText() # " days added to your subscription.",
        now,
      );

      // Record this session as verified — prevents double-grant on any future call.
      verifiedStripeSessionIds.add(sessionId);

      #ok("Payment verified successfully! " # pending.tierDays.toText() # " days added to your subscription. Your DeLorean is fueled!")
    } else {
      #err("Payment not completed on Stripe. Status: " # paymentStatus # ". Please complete payment to activate your subscription.")
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

    let portalBaseUrl = do { let u = checkoutGetConfig("site_base_url"); if (u == "") "https://past-e-jev.caffeine.xyz" else u };
    let body = "customer=" # stripeCustomerId
      # "&return_url=" # portalBaseUrl # "/wallet";

    try {
      let response = await (with cycles = 49_140_000_000) icManagementStripe().http_request({
        url = "https://api.stripe.com/v1/billing_portal/sessions";
        method = #post;
        body = ?body.encodeUtf8();
        headers = [
          { name = "Authorization"; value = "Bearer " # secretKey },
          { name = "Content-Type"; value = "application/x-www-form-urlencoded" },
          { name = "Stripe-Version"; value = "2023-10-16" },
        ];
        max_response_bytes = ?4_096;
        is_replicated = ?false;
        transform = ?{
          function = transformStripePortalResponse;
          context = Blob.fromArray([]);
        };
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

  /// Admin: test the Stripe connection by calling GET /v1/account.
  /// Shows actual error message if key is invalid.
  public shared ({ caller }) func adminTestStripeConnection() : async {
    success : Bool;
    message : Text;
  } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return { success = false; message = "Unauthorized" };
    };

    let secretKey = switch (stripeCheckoutSecretKey()) {
      case null {
        return { success = false; message = "Secret key not configured. Add it in admin > Payments." };
      };
      case (?k) { k };
    };

    try {
      let response = await (with cycles = 20_949_972_000) icManagementStripe().http_request({
        url = "https://api.stripe.com/v1/account";
        method = #get;
        body = null;
        headers = [
          { name = "Authorization"; value = "Bearer " # secretKey },
          { name = "Stripe-Version"; value = "2023-10-16" },
        ];
        max_response_bytes = ?3_000;
        is_replicated = ?false;
        transform = ?{
          function = transformStripeAccountResponse;
          context = Blob.fromArray([]);
        };
      });

      let responseText = switch (response.body.decodeUtf8()) {
        case null { return { success = false; message = "Empty response from Stripe" } };
        case (?t) { t };
      };

      if (response.status >= 200 and response.status < 300) {
        let chargesEnabled = responseText.contains(#text "\"charges_enabled\":true");
        let id = extractJsonStringField(responseText, "id");
        let mode = if (checkoutGetConfig("stripe_mode") == "live") "Live" else "Test";
        {
          success = true;
          message = "Connected (" # mode # " Mode) — Account: " # id # " — charges_enabled: " # (if chargesEnabled "true" else "false")
        }
      } else if (response.status == 401) {
        { success = false; message = "HTTP 401: Invalid API key" }
      } else {
        let errMsg = extractJsonStringField(responseText, "error");
        let detail = if (errMsg != "") { "HTTP " # response.status.toText() # ": " # errMsg }
                     else { "HTTP " # response.status.toText() # ": Connection failed" };
        { success = false; message = detail }
      };
    } catch (e) {
      { success = false; message = "Connection failed: " # e.message() }
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

    // ICP-compat: webhooks are architecturally impossible on ICP.
    // Fields kept for DID stability only.
    let webhookConfigured = false;
    let lastWebhookReceived : ?Int = null;

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
    var activeSubscribers : Nat = 0;

    for ((_, sub) in subscriptions.entries()) {
      // Count active subscribers
      if (sub.tier > 0 and sub.expirationDate > now) {
        activeSubscribers += 1;
      };
      // Count paid subscription grants by updatedAt timestamp (tier > 0 = paid tier)
      if (sub.tier > 0) {
        if (sub.updatedAt >= todayCutoff) { todayCount += 1 };
        if (sub.updatedAt >= weekCutoff)  { weekCount  += 1 };
        if (sub.updatedAt >= monthCutoff) { monthCount += 1 };
      };
    };

    { today = todayCount; week = weekCount; month = monthCount; activeSubscribers };
  };

  /// Get the caller's pending session info (for UI to know if payment is pending).
  public shared ({ caller }) func getPendingSession() : async ?{ sessionId : Text; tierId : Nat; tierDays : Nat } {
    switch (pendingSessions.get(caller.toText())) {
      case null { null };
      case (?s) { ?{ sessionId = s.sessionId; tierId = s.tierId; tierDays = s.tierDays } };
    };
  };

  /// Clear the caller's pending session (e.g., if user cancels payment).
  public shared ({ caller }) func clearPendingSession() : async () {
    pendingSessions.remove(caller.toText());
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

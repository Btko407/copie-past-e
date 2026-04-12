import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Float "mo:core/Float";
import Blob "mo:core/Blob";
import Nat8 "mo:core/Nat8";
import Error "mo:core/Error";
import AccessControl "mo:caffeineai-authorization/access-control";
import PaymentTypes "../types/payments";
import TierTypes "../types/tiers";
import ListingTypes "../types/listings";
import Common "../types/common";
import PaymentsLib "../lib/payments";
import BackupTypes "../types/backup";
import ProfileTypes "../types/userprofile";
import NotifTypes "../types/notifications";
import AdminTypes "../types/admin";
import BackupLib "../lib/backup";
import AppConfigTypes "../types/app-config";

mixin (
  accessControlState : AccessControl.AccessControlState,
  payments : Map.Map<Nat, PaymentTypes.PaymentRecord>,
  discounts : Map.Map<Nat, PaymentTypes.DiscountCode>,
  subscriptions : Map.Map<Common.UserId, TierTypes.UserTierSubscription>,
  tiers : Map.Map<Nat, TierTypes.TierConfig>,
  listings : Map.Map<Common.ListingId, ListingTypes.Listing>,
  paymentCounter : { var value : Nat },
  discountCounter : { var value : Nat },
  paymentConfig : { var current : ?PaymentTypes.PaymentConfig },
  profiles : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
  notifications : Map.Map<Common.UserId, List.List<NotifTypes.InAppNotification>>,
  siteSettings : { var current : ?AdminTypes.SiteSettings },
  appVersions : List.List<AdminTypes.AppVersion>,
  versionBackups : List.List<BackupTypes.VersionBackup>,
  appConfig : Map.Map<Text, AppConfigTypes.ConfigEntry>,
) {
  let DAYS_NS : Int = 86_400_000_000_000;

  // ── appConfig helpers ─────────────────────────────────────────────────────

  /// Read a value from the stable appConfig Map. Returns "" if key not found.
  func paymentsGetConfig(key : Text) : Text {
    switch (appConfig.get(key)) {
      case (?entry) { entry.value };
      case null { "" };
    };
  };

  /// Write a key/value pair to the stable appConfig Map.
  func setConfigValue(key : Text, value : Text, encrypted : Bool, category : Text, updatedBy : Text) {
    let now = Time.now();
    appConfig.add(key, {
      key;
      value;
      encrypted;
      category;
      updatedAt = now;
      updatedBy;
    });
  };

  // Build a PaymentConfig record from appConfig entries (for admin read).
  func buildPaymentConfigFromAppConfig() : PaymentTypes.PaymentConfig {
    let stripePublishableKey = paymentsGetConfig("stripe_publishable_key");
    let stripeSecretKey = paymentsGetConfig("stripe_secret_key");
    let stripeWebhookSecretTest = paymentsGetConfig("stripe_webhook_secret_test");
    let stripeWebhookSecretLive = paymentsGetConfig("stripe_webhook_secret_live");
    let walkerPriceId = paymentsGetConfig("stripe_price_walker");
    let travelerPriceId = paymentsGetConfig("stripe_price_traveler");
    let lordPriceId = paymentsGetConfig("stripe_price_lord");
    let backupPriceId = paymentsGetConfig("stripe_price_backup");
    let gasWalkerPriceId = paymentsGetConfig("stripe_price_gas_walker");
    let gasTravelerPriceId = paymentsGetConfig("stripe_price_gas_traveler");
    let gasLordPriceId = paymentsGetConfig("stripe_price_gas_lord");
    let stripeMode = paymentsGetConfig("stripe_mode");
    let paypalClientId = paymentsGetConfig("paypal_client_id");
    let paypalClientSecret = paymentsGetConfig("paypal_client_secret");
    let paypalMode = paymentsGetConfig("paypal_mode");

    {
      stripePublishableKey = if (stripePublishableKey == "") null else ?stripePublishableKey;
      stripeSecretKey = if (stripeSecretKey == "") null else ?stripeSecretKey;
      stripeWebhookSecret = null; // legacy field — unused
      stripeWebhookSecretTest = if (stripeWebhookSecretTest == "") null else ?stripeWebhookSecretTest;
      stripeWebhookSecretLive = if (stripeWebhookSecretLive == "") null else ?stripeWebhookSecretLive;
      stripeWalkerPriceId = if (walkerPriceId == "") null else ?walkerPriceId;
      stripeProPriceId = if (travelerPriceId == "") null else ?travelerPriceId;
      stripeMaxPriceId = if (lordPriceId == "") null else ?lordPriceId;
      stripeBackupPriceId = if (backupPriceId == "") null else ?backupPriceId;
      stripeMode = if (stripeMode == "") "test" else stripeMode;
      paypalClientId = if (paypalClientId == "") null else ?paypalClientId;
      paypalClientSecret = if (paypalClientSecret == "") null else ?paypalClientSecret;
      paypalMode = if (paypalMode == "") "sandbox" else paypalMode;
    };
  };

  // Management canister reference factory — instantiated locally per call to avoid
  // stable type compatibility issues on upgrade (actor refs at mixin scope are stable state).
  func icManagement() : actor {
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
  // Stripe responses include non-deterministic fields (request IDs, timestamps,
  // livemode). These transforms keep only stable fields needed for consensus.

  /// Transform for Stripe payment intent — keeps only: id, client_secret, status.
  public query func transformStripePaymentIntentResponse(raw : {
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
        let id           = paymentsExtractJsonStringField(bodyText, "id");
        let clientSecret = paymentsExtractJsonStringField(bodyText, "client_secret");
        let status       = paymentsExtractJsonStringField(bodyText, "status");
        let stableJson = "{\"id\":\"" # id # "\",\"client_secret\":\"" # clientSecret # "\",\"status\":\"" # status # "\"}";
        stableJson.encodeUtf8()
      };
    };
    {
      status = raw.response.status;
      headers = [];
      body = stableBody;
    }
  };

  /// Transform for PayPal OAuth token — keeps only: token_type, scope (stable fields).
  public query func transformPaypalTokenResponse(raw : {
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
    // For PayPal OAuth test, we only need to know the call succeeded.
    // Return just the status code result — no body fields needed.
    let stableBody : Blob = if (raw.response.status >= 200 and raw.response.status < 300) {
      "{\"connected\":true}".encodeUtf8()
    } else {
      "{\"connected\":false}".encodeUtf8()
    };
    {
      status = raw.response.status;
      headers = [];
      body = stableBody;
    }
  };

  // ── Helper: extract a JSON string field ──────────────────────────────────

  func paymentsExtractJsonStringField(json : Text, field : Text) : Text {
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

  // Read the active Stripe secret key from appConfig only.
  func activeStripeSecretKey() : Text {
    paymentsGetConfig("stripe_secret_key");
  };

  /// Extract a JSON string field value by splitting on the key pattern.
  func parseJsonStringField(json : Text, field : Text) : ?Text {
    let v = paymentsExtractJsonStringField(json, field);
    if (v == "") null else ?v;
  };

  /// Create a Stripe PaymentIntent via HTTP outcall; returns client_secret or null on failure
  func createStripePaymentIntent(
    amountCents : Nat,
    paymentRecordId : Nat,
  ) : async ?Text {
    let body = "amount=" # debug_show(amountCents)
      # "&currency=usd"
      # "&metadata[paymentRecordId]=" # debug_show(paymentRecordId)
      # "&automatic_payment_methods[enabled]=true";

    try {
      // Cycles: 49_140_000_000 for Stripe POST calls (required by ICP for outbound POST).
      // is_replicated = ?false: only one replica makes the call — bypasses ICP consensus for non-deterministic Stripe responses.
      // transform: strips non-deterministic fields (created, livemode, etc.).
      let response = await (with cycles = 49_140_000_000) icManagement().http_request({
        url = "https://api.stripe.com/v1/payment_intents";
        method = #post;
        body = ?body.encodeUtf8();
        headers = [
          { name = "Authorization"; value = "Bearer " # activeStripeSecretKey() },
          { name = "Content-Type"; value = "application/x-www-form-urlencoded" },
          { name = "Stripe-Version"; value = "2023-10-16" },
        ];
        max_response_bytes = ?10_000;
        is_replicated = ?false;
        transform = ?{
          function = transformStripePaymentIntentResponse;
          context = Blob.fromArray([]);
        };
      });
      if (response.status >= 200 and response.status < 300) {
        switch (response.body.decodeUtf8()) {
          case (?responseText) { parseJsonStringField(responseText, "client_secret") };
          case null { null };
        };
      } else {
        null;
      };
    } catch (_) {
      null;
    };
  };

  /// Initiate a Stripe checkout for a tier upgrade
  public shared ({ caller }) func initiateTierUpgrade(
    tierId : Nat,
    discountCode : ?Text,
  ) : async {
    paymentRecordId : Nat;
    finalAmountUSD : Float;
    tierDurationDays : Nat;
    discountApplied : Bool;
    stripeClientSecret : ?Text;
  } {
    let tierConfig = switch (tiers.get(tierId)) {
      case (?t) t;
      case null {
        return {
          paymentRecordId = 0;
          finalAmountUSD = 0.0;
          tierDurationDays = 0;
          discountApplied = false;
          stripeClientSecret = null;
        }
      };
    };

    let now = Time.now();
    var finalAmount = tierConfig.priceUSD;
    var discountApplied = false;
    var appliedDiscountId : ?Nat = null;

    switch (discountCode) {
      case (?code) {
        switch (PaymentsLib.validateDiscountCode(discounts, code, tierId, now)) {
          case (?discount) {
            finalAmount := PaymentsLib.applyDiscountToPrice(finalAmount, discount);
            discountApplied := true;
            appliedDiscountId := ?discount.id;
          };
          case null {};
        };
      };
      case null {};
    };

    let record = PaymentsLib.createPaymentRecord(
      payments,
      paymentCounter,
      caller,
      tierId,
      finalAmount,
      #stripe,
      null,
      null,
      now,
    );

    switch (appliedDiscountId) {
      case (?dId) { PaymentsLib.applyDiscount(discounts, dId) };
      case null {};
    };

    // Only create a Stripe PaymentIntent for paid tiers (free tier has priceUSD == 0)
    let stripeClientSecret : ?Text = if (finalAmount > 0.0) {
      let amountCents = (finalAmount * 100.0).toInt().toNat();
      await createStripePaymentIntent(amountCents, record.id);
    } else {
      null;
    };

    {
      paymentRecordId = record.id;
      finalAmountUSD = finalAmount;
      tierDurationDays = tierConfig.durationDays;
      discountApplied;
      stripeClientSecret;
    };
  };

  /// Stripe webhook: confirm a completed payment and activate subscription
  public shared ({ caller }) func confirmStripePayment(
    paymentRecordId : Nat,
    stripePaymentIntentId : Text,
  ) : async () {
    let record = switch (payments.get(paymentRecordId)) {
      case (?r) r;
      case null { return };
    };

    payments.add(paymentRecordId, { record with status = #completed; stripePaymentIntentId = ?stripePaymentIntentId });

    let tierConfig = switch (tiers.get(record.tierId)) {
      case (?t) t;
      case null { return };
    };

    let now = Time.now();
    let durationNs : Int = tierConfig.durationDays.toInt() * DAYS_NS;

    let newExpiration : Int = switch (subscriptions.get(record.userId)) {
      case (?sub) {
        let base = if (sub.expirationDate > now) { sub.expirationDate } else { now };
        base + durationNs;
      };
      case null { now + durationNs };
    };

    subscriptions.add(
      record.userId,
      {
        userId = record.userId;
        tier = record.tierId;
        expirationDate = newExpiration;
        autoRenewal = false;
        stripeSubscriptionId = ?stripePaymentIntentId;
        updatedAt = now;
      },
    );

    for ((listingId, listing) in listings.entries()) {
      if (Principal.equal(listing.userId, record.userId) and listing.status == #active) {
        listings.add(listingId, { listing with expirationDate = listing.expirationDate + durationNs });
      };
    };
  };

  /// Stripe webhook: mark a payment as failed
  public shared ({ caller }) func failStripePayment(
    paymentRecordId : Nat,
  ) : async () {
    PaymentsLib.updatePaymentStatus(payments, paymentRecordId, #failed);
  };

  /// Initiate a PayPal payment for a tier upgrade.
  public shared ({ caller }) func initiatePayPalPayment(
    tierId : Nat,
    discountCode : ?Text,
  ) : async { #ok : PaymentTypes.PaymentRecord; #err : Text } {
    let tierConfig = switch (tiers.get(tierId)) {
      case (?t) t;
      case null { return #err("Tier not found") };
    };
    let now = Time.now();
    var finalAmount = tierConfig.priceUSD;
    switch (discountCode) {
      case (?code) {
        switch (PaymentsLib.validateDiscountCode(discounts, code, tierId, now)) {
          case (?discount) {
            finalAmount := PaymentsLib.applyDiscountToPrice(finalAmount, discount);
          };
          case null {};
        };
      };
      case null {};
    };
    let record = PaymentsLib.initiatePayPalPaymentRecord(
      payments, paymentCounter, caller, tierId, finalAmount, now
    );
    #ok(record);
  };

  /// Confirm a PayPal payment by external orderId.
  public shared ({ caller }) func confirmPayPalPayment(
    _paymentId : Nat,
    _paypalOrderId : Text,
  ) : async { #ok; #err : Text } {
    #err("PayPal integration coming soon");
  };

  /// Initiate a crypto payment for a tier upgrade.
  public shared ({ caller }) func initiateCryptoPayment(
    tierId : Nat,
    discountCode : ?Text,
  ) : async { #ok : PaymentTypes.PaymentRecord; #err : Text } {
    let tierConfig = switch (tiers.get(tierId)) {
      case (?t) t;
      case null { return #err("Tier not found") };
    };
    let now = Time.now();
    var finalAmount = tierConfig.priceUSD;
    switch (discountCode) {
      case (?code) {
        switch (PaymentsLib.validateDiscountCode(discounts, code, tierId, now)) {
          case (?discount) {
            finalAmount := PaymentsLib.applyDiscountToPrice(finalAmount, discount);
          };
          case null {};
        };
      };
      case null {};
    };
    let record = PaymentsLib.initiateCryptoPaymentRecord(
      payments, paymentCounter, caller, tierId, finalAmount, now
    );
    #ok(record);
  };

  /// Confirm a crypto payment by transaction hash.
  public shared ({ caller }) func confirmCryptoPayment(
    _paymentId : Nat,
    _txHash : Text,
  ) : async { #ok; #err : Text } {
    #err("Crypto payment integration coming soon");
  };

  /// Get the caller's payment history
  public query ({ caller }) func getMyPayments() : async [PaymentTypes.PaymentRecord] {
    payments.values()
      .filter(func(r) { Principal.equal(r.userId, caller) })
      .toArray();
  };

  /// Admin: get all payments
  public query ({ caller }) func adminListPayments() : async [PaymentTypes.PaymentRecord] {
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    if (not isAdmin) { return [] };
    payments.values().toArray();
  };

  /// Admin: create a discount code
  public shared ({ caller }) func adminCreateDiscountCode(
    code : Text,
    discountType : PaymentTypes.DiscountType,
    discountValue : Float,
    expirationDate : Int,
    maxUses : Nat,
    tierRestriction : ?Nat,
  ) : async PaymentTypes.DiscountCode {
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    if (not isAdmin) { Runtime.trap("Unauthorized") };
    PaymentsLib.createDiscountCode(
      discounts,
      discountCounter,
      code,
      discountType,
      discountValue,
      expirationDate,
      maxUses,
      tierRestriction,
    );
  };

  /// Admin: deactivate a discount code
  public shared ({ caller }) func adminDeactivateDiscountCode(discountId : Nat) : async () {
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    if (not isAdmin) { Runtime.trap("Unauthorized") };
    PaymentsLib.deactivateDiscountCode(discounts, discountId);
  };

  /// List all discount codes (admin only)
  public query ({ caller }) func adminListDiscountCodes() : async [PaymentTypes.DiscountCode] {
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    if (not isAdmin) { return [] };
    discounts.values().toArray();
  };

  /// Validate a discount code (caller-facing, returns discount if valid for the given tier)
  public query ({ caller }) func validateDiscountCode(code : Text, tierId : Nat) : async ?PaymentTypes.DiscountCode {
    let now = Time.now();
    PaymentsLib.validateDiscountCode(discounts, code, tierId, now);
  };

  // ── Payment Configuration (admin only) ────────────────────────────────────

  /// Admin: retrieve the current payment gateway configuration.
  /// Reads ALL values from appConfig (stable Map) — never from paymentConfig.current.
  public query ({ caller }) func adminGetPaymentConfig() : async PaymentTypes.PaymentConfig {
    if (not AccessControl.isAdmin(accessControlState, caller)) Runtime.trap("Unauthorized");
    buildPaymentConfigFromAppConfig();
  };

  /// Admin: save the payment gateway configuration.
  /// Writes EACH field individually to appConfig (stable Map).
  /// Never writes to paymentConfig.current.
  /// Gas Wallet Price IDs are auto-populated from the tier price IDs
  /// (Gas Walker = Time Walker, Gas Traveler = Time Traveler, Gas Lord = Time Lord).
  public shared ({ caller }) func adminSavePaymentConfig(
    config : PaymentTypes.PaymentConfig,
  ) : async { #ok; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized");
    };
    let now = Time.now();
    let updatedBy = caller.toText();

    // Auto-backup before saving config
    ignore BackupLib.createVersionBackup(
      versionBackups, profiles, listings, subscriptions, notifications,
      siteSettings, appVersions, false, "auto",
      ?"Pre-payment-config-save backup", now,
    );

    // Write each Stripe field to appConfig individually
    func writeOptional(key : Text, val : ?Text, enc : Bool, cat : Text) {
      switch (val) {
        case (?v) {
          appConfig.add(key, {
            key;
            value     = v;
            encrypted = enc;
            category  = cat;
            updatedAt = now;
            updatedBy;
          });
        };
        case null {};
      };
    };

    writeOptional("stripe_publishable_key",     config.stripePublishableKey,    false, "stripe");
    writeOptional("stripe_secret_key",          config.stripeSecretKey,         true,  "stripe");
    writeOptional("stripe_webhook_secret_test", config.stripeWebhookSecretTest, true,  "stripe");
    writeOptional("stripe_webhook_secret_live", config.stripeWebhookSecretLive, true,  "stripe");
    writeOptional("stripe_price_walker",        config.stripeWalkerPriceId,     false, "stripe");
    writeOptional("stripe_price_traveler",      config.stripeProPriceId,        false, "stripe");
    writeOptional("stripe_price_lord",          config.stripeMaxPriceId,        false, "stripe");
    writeOptional("stripe_price_backup",        config.stripeBackupPriceId,     false, "stripe");

    // Gas Wallet Price IDs are the same products as the tier Price IDs.
    // Auto-populate them from the tier price IDs so they stay in sync.
    writeOptional("stripe_price_gas_walker",   config.stripeWalkerPriceId,  false, "stripe");
    writeOptional("stripe_price_gas_traveler", config.stripeProPriceId,     false, "stripe");
    writeOptional("stripe_price_gas_lord",     config.stripeMaxPriceId,     false, "stripe");

    // Always write stripe_mode (it has a non-null default of "test")
    appConfig.add("stripe_mode", {
      key       = "stripe_mode";
      value     = config.stripeMode;
      encrypted = false;
      category  = "stripe";
      updatedAt = now;
      updatedBy;
    });

    writeOptional("paypal_client_id",     config.paypalClientId,     false, "paypal");
    writeOptional("paypal_client_secret", config.paypalClientSecret, true,  "paypal");

    // Always write paypal_mode
    appConfig.add("paypal_mode", {
      key       = "paypal_mode";
      value     = config.paypalMode;
      encrypted = false;
      category  = "paypal";
      updatedAt = now;
      updatedBy;
    });

    #ok;
  };

  /// Admin: test the PayPal connection by requesting an OAuth token.
  public shared ({ caller }) func adminTestPaypalConnection(
    clientId : Text,
    clientSecret : Text,
    mode : Text,
  ) : async { #ok : Text; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized");
    };
    let baseUrl = if (mode == "live") {
      "https://api-m.paypal.com";
    } else {
      "https://api-m.sandbox.paypal.com";
    };
    let credentials = clientId # ":" # clientSecret;
    let encoded = base64Encode(credentials);
    try {
      // Cycles: 49_140_000_000 for PayPal POST calls (required by ICP for outbound POST).
      // is_replicated = ?false: only one replica makes the call — bypasses ICP consensus for non-deterministic PayPal responses.
      // transform: strips non-deterministic OAuth token fields — keeps only connected status.
      let response = await (with cycles = 49_140_000_000) icManagement().http_request({
        url = baseUrl # "/v1/oauth2/token";
        method = #post;
        body = ?"grant_type=client_credentials".encodeUtf8();
        headers = [
          { name = "Authorization"; value = "Basic " # encoded },
          { name = "Content-Type"; value = "application/x-www-form-urlencoded" },
        ];
        max_response_bytes = ?4_096;
        is_replicated = ?false;
        transform = ?{
          function = transformPaypalTokenResponse;
          context = Blob.fromArray([]);
        };
      });
      if (response.status >= 200 and response.status < 300) {
        #ok("connected");
      } else {
        let reason = switch (response.body.decodeUtf8()) {
          case (?t) { "PayPal error (status " # debug_show(response.status) # "): " # t };
          case null { "PayPal error: status " # debug_show(response.status) };
        };
        #err(reason);
      };
    } catch (e) {
      #err("HTTP outcall failed: " # e.message());
    };
  };

  // ── Internal: minimal Base64 encoder ─────────────────────────────────────
  let BASE64_CHARS : [Char] = [
    'A','B','C','D','E','F','G','H','I','J','K','L','M',
    'N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
    'a','b','c','d','e','f','g','h','i','j','k','l','m',
    'n','o','p','q','r','s','t','u','v','w','x','y','z',
    '0','1','2','3','4','5','6','7','8','9','+','/',
  ];

  func base64Encode(input : Text) : Text {
    let arr = input.encodeUtf8().toArray();
    let len = arr.size();
    var result = "";
    var i = 0;
    while (i < len) {
      let b0 : Nat = arr[i].toNat();
      let b1 : Nat = if (i + 1 < len) { arr[i + 1].toNat() } else { 0 };
      let b2 : Nat = if (i + 2 < len) { arr[i + 2].toNat() } else { 0 };
      let idx0 : Nat = b0 / 4;
      let idx1 : Nat = (b0 % 4) * 16 + b1 / 16;
      let idx2 : Nat = (b1 % 16) * 4 + b2 / 64;
      let idx3 : Nat = b2 % 64;
      let c0 = Text.fromChar(BASE64_CHARS[idx0]);
      let c1 = Text.fromChar(BASE64_CHARS[idx1]);
      let c2 = if (i + 1 < len) { Text.fromChar(BASE64_CHARS[idx2]) } else { "=" };
      let c3 = if (i + 2 < len) { Text.fromChar(BASE64_CHARS[idx3]) } else { "=" };
      result := result # c0 # c1 # c2 # c3;
      i += 3;
    };
    result;
  };
};

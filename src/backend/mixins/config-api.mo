import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Debug "mo:core/Debug";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import AppConfigTypes "../types/app-config";
import BackupTypes "../types/backup";
import PaymentTypes "../types/payments";

mixin (
  accessControlState : AccessControl.AccessControlState,
  appConfig          : Map.Map<Text, AppConfigTypes.ConfigEntry>,
  paymentConfig      : { var current : ?PaymentTypes.PaymentConfig },
  versionBackups     : List.List<BackupTypes.VersionBackup>,
) {
  // ── Admin guard ─────────────────────────────────────────────────────────────
  func requireAdmin(caller : Principal) {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: admin only");
    };
  };

  // ── Helpers ──────────────────────────────────────────────────────────────────

  /// Return the timestamp of the most recent version backup, or 0 if none.
  func latestBackupAt() : Common.Timestamp {
    var latest : Common.Timestamp = 0;
    for (b in versionBackups.values()) {
      if (b.createdAt > latest) { latest := b.createdAt };
    };
    latest;
  };

  /// Write a config key/value pair into appConfig.
  func writeConfig(key : Text, value : Text, encrypted : Bool, category : Text, caller : Principal) {
    let now = Time.now();
    appConfig.add(key, {
      key;
      value;
      encrypted;
      category;
      updatedAt = now;
      updatedBy = caller.toText();
    });
  };

  // ── Config Validation Gate ───────────────────────────────────────────────

  /// Check whether all required API keys are present and non-empty in appConfig.
  /// Returns true only when BOTH stripe_secret_key AND gemini_api_key are configured.
  public query func isConfigValid() : async Bool {
    let stripeKey = switch (appConfig.get("stripe_secret_key")) { case (?e) { e.value != "" }; case null { false } };
    let geminiKey = switch (appConfig.get("gemini_api_key"))    { case (?e) { e.value != "" }; case null { false } };
    stripeKey and geminiKey
  };

  /// Assert that all required API keys are present. Traps with CONFIG_INVALID if not.
  /// Call this at the start of any function that makes external API calls (Stripe, Gemini).
  public shared func assertConfig() : async () {
    let stripeKey = switch (appConfig.get("stripe_secret_key")) { case (?e) { e.value != "" }; case null { false } };
    let geminiKey = switch (appConfig.get("gemini_api_key"))    { case (?e) { e.value != "" }; case null { false } };
    if (not stripeKey or not geminiKey) {
      Runtime.trap("CONFIG_INVALID: Missing required API keys");
    };
  };

  // ── Public API ───────────────────────────────────────────────────────────────

  /// Read a single config value by key. Callable by anyone (non-sensitive lookup).
  /// For sensitive/encrypted values the admin UI should restrict display.
  public query func getConfig(key : Text) : async ?Text {
    switch (appConfig.get(key)) {
      case (?entry) { ?entry.value };
      case null     { null };
    };
  };

  /// Admin: upsert a config key/value.
  public shared ({ caller }) func setConfig(
    key       : Text,
    value     : Text,
    encrypted : Bool,
    category  : Text,
    updatedBy : Text,
  ) : async () {
    requireAdmin(caller);
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

  /// Admin: return all config entries sorted by category then key.
  public query ({ caller }) func getAllConfig() : async [AppConfigTypes.ConfigEntry] {
    requireAdmin(caller);
    func compareEntries(a : AppConfigTypes.ConfigEntry, b : AppConfigTypes.ConfigEntry) : { #equal; #greater; #less } {
      let cat = Text.compare(a.category, b.category);
      if (cat == #equal) { Text.compare(a.key, b.key) } else { cat }
    };
    appConfig.values().sort(compareEntries).toArray()
  };

  /// Admin: remove a config entry by key.
  public shared ({ caller }) func deleteConfig(key : Text) : async () {
    requireAdmin(caller);
    appConfig.remove(key);
  };

  /// Admin: set Stripe keys and mode.
  /// NEVER exposed as a query — secret key is write-only.
  public shared ({ caller }) func adminSetStripeKeys(
    publishable : Text,
    secret      : Text,
    mode        : Text,
  ) : async () {
    requireAdmin(caller);
    writeConfig("stripe_publishable_key", publishable, false, "stripe", caller);
    writeConfig("stripe_secret_key",      secret,      true,  "stripe", caller);
    writeConfig("stripe_mode",            mode,         false, "stripe", caller);
    writeConfig("stripe_test_mode", (if (mode == "test") "true" else "false"), false, "stripe", caller);
  };

  /// Admin: set Stripe price IDs for all tiers.
  /// Also auto-copies to Gas Wallet price IDs (same Stripe products).
  public shared ({ caller }) func adminSetStripePrices(
    walker   : Text,
    traveler : Text,
    lord     : Text,
    backup   : Text,
  ) : async () {
    requireAdmin(caller);
    writeConfig("stripe_price_walker",   walker,   false, "stripe", caller);
    writeConfig("stripe_price_traveler", traveler, false, "stripe", caller);
    writeConfig("stripe_price_lord",     lord,     false, "stripe", caller);
    writeConfig("stripe_price_backup",   backup,   false, "stripe", caller);
    // Gas Wallet uses the same Stripe price IDs as subscription tiers
    writeConfig("stripe_price_gas_walker",   walker,   false, "stripe", caller);
    writeConfig("stripe_price_gas_traveler", traveler, false, "stripe", caller);
    writeConfig("stripe_price_gas_lord",     lord,     false, "stripe", caller);
  };

  /// Admin: set the Gemini API key.
  /// NEVER exposed as a query — API key is write-only.
  public shared ({ caller }) func adminSetGeminiKey(key : Text) : async () {
    requireAdmin(caller);
    writeConfig("gemini_api_key", key, true, "ocr", caller);
  };

  /// Admin: set maintenance mode on/off with custom message.
  public shared ({ caller }) func adminSetMaintenanceMode(
    enabled : Bool,
    message : Text,
  ) : async () {
    requireAdmin(caller);
    writeConfig("maintenance_mode",    (if (enabled) "true" else "false"), false, "site", caller);
    writeConfig("maintenance_message", message,                            false, "site", caller);
  };

  /// Admin: set the site base URL used for Stripe redirect URLs.
  /// Example: "https://past-e-jev.caffeine.xyz"
  /// Falls back to the hardcoded default if not set.
  public shared ({ caller }) func adminSetSiteBaseUrl(url : Text) : async { #ok; #err : Text } {
    requireAdmin(caller);
    writeConfig("site_base_url", url, false, "site", caller);
    #ok
  };

  /// Public query: returns the configured site base URL.
  /// Returns "" if not explicitly set (callers should fall back to the hardcoded default).
  public query func getSiteBaseUrl() : async Text {
    switch (appConfig.get("site_base_url")) {
      case (?e) { e.value };
      case null { "" };
    };
  };

  /// Public query: returns only the non-secret config values safe for frontend use.
  /// NEVER includes stripeSecretKey or geminiApiKey.
  public query func getPublicConfig() : async {
    publishableKey   : Text;
    mode             : Text;
    maintenanceMode  : Bool;
    maintenanceMessage : Text;
    gasWalkerPriceId   : Text;
    gasTravelerPriceId : Text;
    gasLordPriceId     : Text;
    siteBaseUrl        : Text;
  } {
    let publishableKey = switch (appConfig.get("stripe_publishable_key")) {
      case (?e) { e.value }; case null { "" };
    };
    let mode = switch (appConfig.get("stripe_mode")) {
      case (?e) { e.value }; case null { "test" };
    };
    let maintenanceMode = switch (appConfig.get("maintenance_mode")) {
      case (?e) { e.value == "true" }; case null { false };
    };
    let maintenanceMessage = switch (appConfig.get("maintenance_message")) {
      case (?e) { e.value };
      case null { "Copie Past-e is temporarily offline for maintenance." };
    };
    let gasWalkerPriceId = switch (appConfig.get("stripe_price_gas_walker")) {
      case (?e) { e.value }; case null { "" };
    };
    let gasTravelerPriceId = switch (appConfig.get("stripe_price_gas_traveler")) {
      case (?e) { e.value }; case null { "" };
    };
    let gasLordPriceId = switch (appConfig.get("stripe_price_gas_lord")) {
      case (?e) { e.value }; case null { "" };
    };
    let siteBaseUrl = switch (appConfig.get("site_base_url")) {
      case (?e) { e.value }; case null { "" };
    };
    {
      publishableKey;
      mode;
      maintenanceMode;
      maintenanceMessage;
      gasWalkerPriceId;
      gasTravelerPriceId;
      gasLordPriceId;
      siteBaseUrl;
    }
  };

  /// One-time migration: copy fields from the existing paymentConfig into appConfig
  /// for any key not already present. Safe to call multiple times (idempotent).
  public shared ({ caller }) func initConfigFromPaymentConfig() : async () {
    requireAdmin(caller);
    let now = Time.now();

    let cfg : PaymentTypes.PaymentConfig = switch (paymentConfig.current) {
      case (?c) { c };
      case null { return }; // nothing to migrate
    };

    func insertIfAbsent(key : Text, val : ?Text, enc : Bool, cat : Text) {
      switch (appConfig.get(key)) {
        case (?_) {}; // already present — do not overwrite
        case null {
          switch (val) {
            case (?v) {
              appConfig.add(key, {
                key;
                value     = v;
                encrypted = enc;
                category  = cat;
                updatedAt = now;
                updatedBy = "migration";
              });
            };
            case null {}; // no value to migrate
          };
        };
      };
    };

    insertIfAbsent("stripe_publishable_key",       cfg.stripePublishableKey,     false, "stripe");
    insertIfAbsent("stripe_secret_key",            cfg.stripeSecretKey,          true,  "stripe");
    insertIfAbsent("stripe_webhook_secret_test",   cfg.stripeWebhookSecretTest,  true,  "stripe");
    insertIfAbsent("stripe_webhook_secret_live",   cfg.stripeWebhookSecretLive,  true,  "stripe");
    insertIfAbsent("stripe_price_walker",          cfg.stripeWalkerPriceId,      false, "stripe");
    insertIfAbsent("stripe_price_traveler",        cfg.stripeProPriceId,         false, "stripe");
    insertIfAbsent("stripe_price_lord",            cfg.stripeMaxPriceId,         false, "stripe");
    insertIfAbsent("stripe_price_backup",          cfg.stripeBackupPriceId,      false, "stripe");
    insertIfAbsent("stripe_mode",                  ?cfg.stripeMode,              false, "stripe");
    insertIfAbsent("stripe_test_mode",             ?(if (cfg.stripeMode == "test") "true" else "false"), false, "stripe");
    insertIfAbsent("paypal_client_id",             cfg.paypalClientId,           false, "paypal");
    insertIfAbsent("paypal_client_secret",         cfg.paypalClientSecret,       true,  "paypal");
    insertIfAbsent("paypal_mode",                  ?cfg.paypalMode,              false, "paypal");
  };

  /// Debug helper: returns the length of the stored Stripe secret key.
  /// Use to diagnose if the key was actually saved (0 = not saved).
  /// NEVER returns the key itself — only its character count.
  public query func debugCheckStripeKeyLength() : async Nat {
    switch (appConfig.get("stripe_secret_key")) {
      case (?entry) { entry.value.size() };
      case null { 0 };
    };
  };

  /// Health status query: checks if critical Stripe keys exist, reports backup counts.
  public query ({ caller }) func getHealthStatus() : async Common.HealthStatus {
    requireAdmin(caller);
    let hasSecretKey    = switch (appConfig.get("stripe_secret_key"))    { case (?e) { e.value != "" }; case null { false } };
    let hasPubKey       = switch (appConfig.get("stripe_publishable_key")){ case (?e) { e.value != "" }; case null { false } };
    let hasStripeMode   = switch (appConfig.get("stripe_mode"))          { case (?e) { e.value != "" }; case null { false } };
    let critical        = hasSecretKey and hasPubKey and hasStripeMode;
    let backupCount     = versionBackups.size();
    let lastBackupAt    = latestBackupAt();
    {
      status              = if (critical) "ok" else "degraded";
      keysConfigured      = critical;
      criticalKeysPresent = critical;
      lastBackupAt;
      backupCount;
    };
  };

  /// System startup guard: verify critical payment config exists.
  /// Returns status, keysConfigured flag, and list of missing keys.
  public shared func validateCriticalConfig() : async {
    status       : Text;
    keysConfigured : Bool;
    missingKeys  : [Text];
  } {
    let missing = List.empty<Text>();
    let secretKey = switch (appConfig.get("stripe_secret_key"))    { case (?e) e.value; case null "" };
    let pubKey    = switch (appConfig.get("stripe_publishable_key")){ case (?e) e.value; case null "" };
    let mode      = switch (appConfig.get("stripe_mode"))          { case (?e) e.value; case null "" };
    if (secretKey == "") missing.add("stripe_secret_key");
    if (pubKey    == "") missing.add("stripe_publishable_key");
    if (mode      == "") missing.add("stripe_mode");
    let allOk = missing.size() == 0;
    {
      status       = if (allOk) "ok" else "degraded";
      keysConfigured = allOk;
      missingKeys  = missing.toArray();
    }
  };

  /// Admin: force re-save all Stripe settings with a fresh timestamp.
  /// Use this if config ever gets corrupted or disappears.
  public shared ({ caller }) func adminForceResaveStripeConfig() : async { #ok : Text; #err : Text } {
    requireAdmin(caller);
    let secretKey = switch (appConfig.get("stripe_secret_key"))    { case (?e) e.value; case null { return #err("No secret key stored — set it first in admin > Payments") } };
    let pubKey    = switch (appConfig.get("stripe_publishable_key")){ case (?e) e.value; case null { return #err("No publishable key stored") } };
    let mode      = switch (appConfig.get("stripe_mode"))          { case (?e) e.value; case null { return #err("No Stripe mode set (test/live)") } };
    let now = Time.now();
    appConfig.add("stripe_secret_key", {
      key = "stripe_secret_key"; value = secretKey; encrypted = true;
      category = "stripe"; updatedAt = now; updatedBy = caller.toText();
    });
    appConfig.add("stripe_publishable_key", {
      key = "stripe_publishable_key"; value = pubKey; encrypted = false;
      category = "stripe"; updatedAt = now; updatedBy = caller.toText();
    });
    appConfig.add("stripe_mode", {
      key = "stripe_mode"; value = mode; encrypted = false;
      category = "stripe"; updatedAt = now; updatedBy = caller.toText();
    });
    #ok("Stripe config re-saved and locked in — all keys verified")
  };

  /// Admin: comprehensive config health diagnostics showing key presence and lengths.
  public query ({ caller }) func debugConfigHealthReport() : async {
    stripSecretKeyLength       : Nat;
    stripePublishableKeyLength : Nat;
    stripeModeSet              : Text;
    geminiKeyLength            : Nat;
    siteBaseUrlSet             : Text;
    allCriticalKeysPresent     : Bool;
    status                     : Text;
  } {
    requireAdmin(caller);
    let secretKey = switch (appConfig.get("stripe_secret_key"))    { case (?e) e.value; case null "" };
    let pubKey    = switch (appConfig.get("stripe_publishable_key")){ case (?e) e.value; case null "" };
    let mode      = switch (appConfig.get("stripe_mode"))          { case (?e) e.value; case null "" };
    let gemini    = switch (appConfig.get("gemini_api_key"))        { case (?e) e.value; case null "" };
    let baseUrl   = switch (appConfig.get("site_base_url"))         { case (?e) e.value; case null "" };
    let allOk = secretKey != "" and pubKey != "" and mode != "";
    {
      stripSecretKeyLength       = secretKey.size();
      stripePublishableKeyLength = pubKey.size();
      stripeModeSet              = mode;
      geminiKeyLength            = gemini.size();
      siteBaseUrlSet             = baseUrl;
      allCriticalKeysPresent     = allOk;
      status = if (allOk) {
        "HEALTHY — All critical keys present"
      } else {
        "DEGRADED — Missing keys: "
          # (if (secretKey == "") "secret_key " else "")
          # (if (pubKey    == "") "pub_key " else "")
          # (if (mode      == "") "mode" else "")
      };
    }
  };

  /// Admin: test and verify Stripe config by reading all keys and checking lengths.
  public shared ({ caller }) func adminTestAndVerifyStripeConfig() : async {
    configValid    : Bool;
    testPassed     : Bool;
    secretKeyPresent : Bool;
    pubKeyPresent  : Bool;
    modeCorrect    : Bool;
    message        : Text;
  } {
    requireAdmin(caller);
    let secretKey = switch (appConfig.get("stripe_secret_key"))    { case (?e) e.value; case null "" };
    let pubKey    = switch (appConfig.get("stripe_publishable_key")){ case (?e) e.value; case null "" };
    let mode      = switch (appConfig.get("stripe_mode"))          { case (?e) e.value; case null "" };
    let secretOk = secretKey != "" and secretKey.size() > 10;
    let pubOk    = pubKey    != "" and pubKey.size()    > 10;
    let modeOk   = mode == "test" or mode == "live";
    let configOk = secretOk and pubOk and modeOk;
    {
      configValid    = configOk;
      testPassed     = configOk;
      secretKeyPresent = secretOk;
      pubKeyPresent  = pubOk;
      modeCorrect    = modeOk;
      message = if (configOk) {
        "Stripe config VALID — " # mode # " mode — ready for payments"
      } else {
        "Config invalid: "
          # (if (not secretOk) "secret_key_bad " else "")
          # (if (not pubOk)    "pub_key_bad " else "")
          # (if (not modeOk)   "mode_bad" else "")
      };
    }
  };
};

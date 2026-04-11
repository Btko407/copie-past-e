import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Text "mo:core/Text";
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
    {
      publishableKey;
      mode;
      maintenanceMode;
      maintenanceMessage;
      gasWalkerPriceId;
      gasTravelerPriceId;
      gasLordPriceId;
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
};

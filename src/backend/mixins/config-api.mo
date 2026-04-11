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
    // gemini_api_key — not in PaymentConfig type; only migrate if present in appConfig already via other path
    // site_name — not in PaymentConfig; no migration needed
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

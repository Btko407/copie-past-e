import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import AutofillTypes "../types/autofill-config";

mixin (
  accessControlState : AccessControl.AccessControlState,
) {
  // ── Storage ──────────────────────────────────────────────────────────────────
  let autofillConfigs   : Map.Map<Text, AutofillTypes.PlatformAutofillConfig> = Map.empty();
  let autofillSessions  : List.List<AutofillTypes.AutofillSession>            = List.empty();
  let autofillSessionCounter = { var value : Nat = 0 };

  // ── Default initialisation (runs once when map is empty) ─────────────────────
  if (autofillConfigs.isEmpty()) {
    let now = Time.now();

    autofillConfigs.add("facebook", {
      platformName             = "facebook";
      enabled                  = true;
      lastUpdated              = now;
      updatedBy                = "system";
      fbPrefillTitle           = true;
      fbPrefillDescription     = true;
      fbPrefillPrice           = true;
      fbPrefillCategory        = true;
      fbPrefillCondition       = true;
      fbAutoClickLocalPickup   = false;
      fbAutoClickShipping      = false;
      mecariPrefillTitle           = false;
      mecariPrefillDescription     = false;
      mecariPrefillPrice           = false;
      mecariPrefillBrand           = false;
      mecariPrefillCategory        = false;
      mecariPrefillCondition       = false;
      mecariAutoSelectDeliveryDays = false;
      mecariDeliveryDaysValue      = null;
      mecariAutoSelectShipping     = false;
      mecariShippingType           = null;
    });

    autofillConfigs.add("mecari", {
      platformName             = "mecari";
      enabled                  = true;
      lastUpdated              = now;
      updatedBy                = "system";
      fbPrefillTitle           = false;
      fbPrefillDescription     = false;
      fbPrefillPrice           = false;
      fbPrefillCategory        = false;
      fbPrefillCondition       = false;
      fbAutoClickLocalPickup   = false;
      fbAutoClickShipping      = false;
      mecariPrefillTitle           = true;
      mecariPrefillDescription     = true;
      mecariPrefillPrice           = true;
      mecariPrefillBrand           = true;
      mecariPrefillCategory        = true;
      mecariPrefillCondition       = true;
      mecariAutoSelectDeliveryDays = true;
      mecariDeliveryDaysValue      = ?3;
      mecariAutoSelectShipping     = true;
      mecariShippingType           = ?"normal";
    });

    autofillConfigs.add("offerUp", {
      platformName             = "offerUp";
      enabled                  = true;
      lastUpdated              = now;
      updatedBy                = "system";
      fbPrefillTitle           = true;
      fbPrefillDescription     = true;
      fbPrefillPrice           = true;
      fbPrefillCategory        = true;
      fbPrefillCondition       = true;
      fbAutoClickLocalPickup   = false;
      fbAutoClickShipping      = false;
      mecariPrefillTitle           = false;
      mecariPrefillDescription     = false;
      mecariPrefillPrice           = false;
      mecariPrefillBrand           = false;
      mecariPrefillCategory        = false;
      mecariPrefillCondition       = false;
      mecariAutoSelectDeliveryDays = false;
      mecariDeliveryDaysValue      = null;
      mecariAutoSelectShipping     = false;
      mecariShippingType           = null;
    });
  };

  // ── Public API ───────────────────────────────────────────────────────────────

  /// Get autofill config for a platform (no auth — extension can read).
  public query func getAutofillConfig(platform : Text) : async ?AutofillTypes.PlatformAutofillConfig {
    autofillConfigs.get(platform);
  };

  /// Admin: get all platform autofill configs.
  public query ({ caller }) func getAllAutofillConfigs() : async [AutofillTypes.PlatformAutofillConfig] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return [];
    };
    autofillConfigs.values().toArray();
  };

  /// Admin: enable or disable autofill for a platform.
  public shared ({ caller }) func setAutofillPlatformEnabled(
    platform : Text,
    enabled  : Bool,
  ) : async { #ok : Text; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: admin only");
    };
    switch (autofillConfigs.get(platform)) {
      case null { #err("Platform not found: " # platform) };
      case (?config) {
        autofillConfigs.add(platform, {
          config with
          enabled;
          lastUpdated = Time.now();
          updatedBy   = caller.toText();
        });
        let statusLabel = if (enabled) { "✅ Enabled" } else { "❌ Disabled" };
        #ok(statusLabel # " autofill for " # platform);
      };
    };
  };

  /// Admin: update Facebook Marketplace autofill field settings.
  public shared ({ caller }) func updateFacebookAutofillSettings(
    prefillTitle         : Bool,
    prefillDescription   : Bool,
    prefillPrice         : Bool,
    prefillCategory      : Bool,
    prefillCondition     : Bool,
    autoClickLocalPickup : Bool,
    autoClickShipping    : Bool,
  ) : async { #ok : Text; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: admin only");
    };
    switch (autofillConfigs.get("facebook")) {
      case null { #err("Facebook config not found") };
      case (?config) {
        autofillConfigs.add("facebook", {
          config with
          fbPrefillTitle         = prefillTitle;
          fbPrefillDescription   = prefillDescription;
          fbPrefillPrice         = prefillPrice;
          fbPrefillCategory      = prefillCategory;
          fbPrefillCondition     = prefillCondition;
          fbAutoClickLocalPickup = autoClickLocalPickup;
          fbAutoClickShipping    = autoClickShipping;
          lastUpdated            = Time.now();
          updatedBy              = caller.toText();
        });
        #ok("✅ Facebook Marketplace autofill settings updated");
      };
    };
  };

  /// Admin: update Mecari autofill field settings.
  public shared ({ caller }) func updateMecariAutofillSettings(
    prefillTitle          : Bool,
    prefillDescription    : Bool,
    prefillPrice          : Bool,
    prefillBrand          : Bool,
    prefillCategory       : Bool,
    prefillCondition      : Bool,
    autoSelectDeliveryDays : Bool,
    deliveryDaysValue     : ?Nat,
    autoSelectShipping    : Bool,
    shippingType          : ?Text,
  ) : async { #ok : Text; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: admin only");
    };
    // Validate delivery days range
    switch (deliveryDaysValue) {
      case null {};
      case (?days) {
        if (days < 1 or days > 7) {
          return #err("Delivery days must be between 1 and 7");
        };
      };
    };
    switch (autofillConfigs.get("mecari")) {
      case null { #err("Mecari config not found") };
      case (?config) {
        autofillConfigs.add("mecari", {
          config with
          mecariPrefillTitle           = prefillTitle;
          mecariPrefillDescription     = prefillDescription;
          mecariPrefillPrice           = prefillPrice;
          mecariPrefillBrand           = prefillBrand;
          mecariPrefillCategory        = prefillCategory;
          mecariPrefillCondition       = prefillCondition;
          mecariAutoSelectDeliveryDays = autoSelectDeliveryDays;
          mecariDeliveryDaysValue      = deliveryDaysValue;
          mecariAutoSelectShipping     = autoSelectShipping;
          mecariShippingType           = shippingType;
          lastUpdated                  = Time.now();
          updatedBy                    = caller.toText();
        });
        #ok("✅ Mecari autofill settings updated");
      };
    };
  };

  /// Admin: get health status for all platforms based on session data.
  public query ({ caller }) func getAutofillHealthStatus() : async [AutofillTypes.AutofillHealthStatus] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return [];
    };

    let results : List.List<AutofillTypes.AutofillHealthStatus> = List.empty();

    for ((platformName, config) in autofillConfigs.entries()) {
      var totalAttempts  : Nat = 0;
      var totalSuccessful : Nat = 0;
      var activeSessions : Nat = 0;
      var lastTestAt : ?Common.Timestamp = null;

      for (session in autofillSessions.values()) {
        if (session.platform == platformName) {
          totalAttempts   += session.fieldsAttempted;
          totalSuccessful += session.fieldsSuccessful;
          if (session.completedAt == null) {
            activeSessions += 1;
          };
          switch (lastTestAt) {
            case null { lastTestAt := ?session.createdAt };
            case (?prev) {
              if (session.createdAt > prev) {
                lastTestAt := ?session.createdAt;
              };
            };
          };
        };
      };

      let successRate : Float = if (totalAttempts == 0) {
        1.0
      } else {
        totalSuccessful.toFloat() / totalAttempts.toFloat()
      };

      results.add({
        platformName;
        enabled         = config.enabled;
        isHealthy       = config.enabled and successRate > 0.9;
        lastTestAt;
        lastTestResult  = null;
        activeSessions;
        successRate;
        totalAttempts;
        totalSuccessful;
      });
    };

    results.toArray();
  };

  /// Admin: test autofill configuration for a platform and return field readiness.
  public shared ({ caller }) func testAutofill(platform : Text) : async AutofillTypes.AutofillTestResult {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return {
        platform;
        success       = false;
        fieldsPrepped = [];
        fieldsFailed  = [];
        duration      = 0;
        message       = "Unauthorized: admin only";
      };
    };

    let startTime = Time.now();

    switch (autofillConfigs.get(platform)) {
      case null {
        {
          platform;
          success       = false;
          fieldsPrepped = [];
          fieldsFailed  = [];
          duration      = 0;
          message       = "Platform config not found: " # platform;
        }
      };
      case (?config) {
        if (not config.enabled) {
          return {
            platform;
            success       = false;
            fieldsPrepped = [];
            fieldsFailed  = [];
            duration      = 0;
            message       = "⚠️ Autofill disabled for " # platform;
          };
        };

        let fieldsPrepped : List.List<Text> = List.empty();
        let fieldsFailed  : List.List<Text> = List.empty();

        if (platform == "facebook" or platform == "offerUp") {
          if (config.fbPrefillTitle)         { fieldsPrepped.add("Title")        } else { fieldsFailed.add("Title") };
          if (config.fbPrefillDescription)   { fieldsPrepped.add("Description")  } else { fieldsFailed.add("Description") };
          if (config.fbPrefillPrice)         { fieldsPrepped.add("Price")        } else { fieldsFailed.add("Price") };
          if (config.fbPrefillCategory)      { fieldsPrepped.add("Category")     } else { fieldsFailed.add("Category") };
          if (config.fbPrefillCondition)     { fieldsPrepped.add("Condition")    } else { fieldsFailed.add("Condition") };
          if (config.fbAutoClickLocalPickup) { fieldsPrepped.add("LocalPickup")  } else { fieldsFailed.add("LocalPickup") };
          if (config.fbAutoClickShipping)    { fieldsPrepped.add("Shipping")     } else { fieldsFailed.add("Shipping") };
        };

        if (platform == "mecari") {
          if (config.mecariPrefillTitle)           { fieldsPrepped.add("Title")        } else { fieldsFailed.add("Title") };
          if (config.mecariPrefillDescription)     { fieldsPrepped.add("Description")  } else { fieldsFailed.add("Description") };
          if (config.mecariPrefillPrice)           { fieldsPrepped.add("Price")        } else { fieldsFailed.add("Price") };
          if (config.mecariPrefillBrand)           { fieldsPrepped.add("Brand")        } else { fieldsFailed.add("Brand") };
          if (config.mecariPrefillCategory)        { fieldsPrepped.add("Category")     } else { fieldsFailed.add("Category") };
          if (config.mecariPrefillCondition)       { fieldsPrepped.add("Condition")    } else { fieldsFailed.add("Condition") };
          if (config.mecariAutoSelectDeliveryDays) { fieldsPrepped.add("DeliveryDays") } else { fieldsFailed.add("DeliveryDays") };
          if (config.mecariAutoSelectShipping)     { fieldsPrepped.add("Shipping")     } else { fieldsFailed.add("Shipping") };
        };

        let endTime  = Time.now();
        let elapsed  = endTime - startTime;
        let duration = if (elapsed < 0) { 0 } else { elapsed.toNat() / 1_000_000 };
        let success  = fieldsFailed.isEmpty();

        {
          platform;
          success;
          fieldsPrepped = fieldsPrepped.toArray();
          fieldsFailed  = fieldsFailed.toArray();
          duration;
          message = if (success) {
            "✅ All " # fieldsPrepped.size().toText() # " autofill fields ready"
          } else {
            "⚠️ " # fieldsFailed.size().toText() # " fields disabled"
          };
        }
      };
    };
  };

  /// User: log an autofill session for health tracking.
  public shared ({ caller }) func logAutofillSession(
    platform         : Text,
    fieldsAttempted  : Nat,
    fieldsSuccessful : Nat,
    errors           : [Text],
  ) : async { #ok : Text; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized: must be logged in");
    };

    let sessionId = autofillSessionCounter.value.toText();
    autofillSessionCounter.value += 1;

    autofillSessions.add({
      sessionId;
      userId           = caller;
      platform;
      createdAt        = Time.now();
      completedAt      = null;
      fieldsAttempted;
      fieldsSuccessful;
      errors;
      testMode         = false;
    });

    #ok("Session logged: " # sessionId);
  };
};

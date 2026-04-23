import Common "common";

module {
  /// Platform-specific autofill configuration
  public type PlatformAutofillConfig = {
    platformName : Text;
    enabled      : Bool;
    lastUpdated  : Common.Timestamp;
    updatedBy    : Text;

    // ── FACEBOOK MARKETPLACE SETTINGS ──
    fbPrefillTitle          : Bool;
    fbPrefillDescription    : Bool;
    fbPrefillPrice          : Bool;
    fbPrefillCategory       : Bool;
    fbPrefillCondition      : Bool;
    fbAutoClickLocalPickup  : Bool;
    fbAutoClickShipping     : Bool;

    // ── MECARI SETTINGS ──
    mecariPrefillTitle           : Bool;
    mecariPrefillDescription     : Bool;
    mecariPrefillPrice           : Bool;
    mecariPrefillBrand           : Bool;
    mecariPrefillCategory        : Bool;
    mecariPrefillCondition       : Bool;
    mecariAutoSelectDeliveryDays : Bool;
    mecariDeliveryDaysValue      : ?Nat;
    mecariAutoSelectShipping     : Bool;
    mecariShippingType           : ?Text;
  };

  /// Autofill session tracking (for debugging)
  public type AutofillSession = {
    sessionId        : Text;
    userId           : Common.UserId;
    platform         : Text;
    createdAt        : Common.Timestamp;
    completedAt      : ?Common.Timestamp;
    fieldsAttempted  : Nat;
    fieldsSuccessful : Nat;
    errors           : [Text];
    testMode         : Bool;
  };

  /// Health status of autofill system
  public type AutofillHealthStatus = {
    platformName    : Text;
    enabled         : Bool;
    isHealthy       : Bool;
    lastTestAt      : ?Common.Timestamp;
    lastTestResult  : ?Text;
    activeSessions  : Nat;
    successRate     : Float;
    totalAttempts   : Nat;
    totalSuccessful : Nat;
  };

  /// Autofill test result
  public type AutofillTestResult = {
    platform      : Text;
    success       : Bool;
    fieldsPrepped : [Text];
    fieldsFailed  : [Text];
    duration      : Nat;
    message       : Text;
  };
};

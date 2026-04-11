module {
  public type UserId = Principal;
  public type ListingId = Nat;
  public type ImageId = Nat;
  public type Timestamp = Int;

  // ── Restore types ──────────────────────────────────────────────────────────

  /// Returned by all admin restore operations.
  public type RestoreResult = {
    success          : Bool;
    usersRestored    : Nat;
    listingsRestored : Nat;
    configRestored   : Nat;    // number of app_config entries restored
    preRestoreBackupId : Text; // ID of the auto-save taken before restore
    message          : Text;
  };

  /// Detailed error variant for restore failures.
  public type RestoreError = {
    #PreRestoreBackupFailed : Text;
    #RestoreStepFailed : { step : Text; error : Text };
  };

  // ── Health / monitoring types ──────────────────────────────────────────────

  /// Returned by the health-check query.
  public type HealthStatus = {
    status              : Text;  // "ok" | "degraded" | "error"
    keysConfigured      : Bool;  // true if critical Stripe keys are present
    criticalKeysPresent : Bool;  // same semantic, kept for backward compat
    lastBackupAt        : Timestamp; // nanoseconds; 0 if no backup yet
    backupCount         : Nat;
  };
};

import Common "common";

module {
  /// Metrics sub-record for a component
  public type ComponentMetrics = {
    uptime       : Float;
    responseTime : Nat;
    errorCount   : Nat;
    successCount : Nat;
  };

  /// Individual component health status
  public type ComponentStatus = {
    name      : Text;
    category  : Text;
    status    : { #healthy; #warning; #error; #offline };
    lastCheck : Common.Timestamp;
    message   : Text;
    metrics   : ComponentMetrics;
  };

  /// Individual system issue
  public type SystemIssue = {
    id                : Text;
    severity          : { #info; #warning; #error; #critical };
    title             : Text;
    description       : Text;
    affectedComponent : Text;
    suggestedFix      : Text;
    discoveredAt      : Common.Timestamp;
    resolved          : Bool;
  };

  /// System-wide diagnostic report
  public type SystemDiagnostics = {
    timestamp        : Common.Timestamp;
    overallStatus    : { #healthy; #warning; #critical };
    components       : [ComponentStatus];
    issues           : [SystemIssue];
    recommendations  : [Text];
    criticalFailures : [Text];
  };

  /// Feature status for all app features
  public type FeatureStatus = {
    featureName : Text;
    enabled     : Bool;
    working     : Bool;
    lastError   : ?Text;
    errorCount  : Nat;
    usageCount  : Nat;
  };

  /// Integration health check
  public type IntegrationStatus = {
    name            : Text;
    connected       : Bool;
    lastTestAt      : ?Common.Timestamp;
    lastTestResult  : ?Bool;
    configPresent   : Bool;
    errorMessage    : ?Text;
  };
};

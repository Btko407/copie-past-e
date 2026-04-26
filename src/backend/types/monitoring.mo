module {
  /// A single structured log entry for the monitoring ring buffer.
  public type MonitoringLogEntry = {
    timestamp  : Int;    // nanoseconds since epoch
    level      : Text;   // "info" | "warn" | "error" | "critical"
    component  : Text;   // e.g. "Stripe", "OCR", "System"
    message    : Text;
  };
};

import Map "mo:core/Map";
import Time "mo:core/Time";
import Cycles "mo:core/Cycles";

/// Shared monitoring state type — holds the ring-buffer log and counters.
/// Pass this record to any mixin that needs to emit structured log events.
module {
  /// A single structured log entry (shared with monitoring-api mixin).
  public type MonitoringLogEntry = {
    timestamp       : Int;
    level           : Text;
    component       : Text;
    message         : Text;
    cyclesAvailable : Nat;
  };

  let MON_RING_SIZE : Nat = 1000;

  /// Write a structured log entry into the shared ring-buffer.
  /// Params mirror the monitoring-api mixin state slots exactly.
  public func logEvent(
    monLogs        : Map.Map<Nat, MonitoringLogEntry>,
    monNextIndex   : { var value : Nat },
    monTotalLogged : { var value : Nat },
    level          : Text,
    component      : Text,
    message        : Text,
  ) {
    let entry : MonitoringLogEntry = {
      timestamp       = Time.now();
      level;
      component;
      message;
      cyclesAvailable = Cycles.balance();
    };
    let idx = monNextIndex.value % MON_RING_SIZE;
    monLogs.add(idx, entry);
    monNextIndex.value   := monNextIndex.value + 1;
    monTotalLogged.value += 1;
  };
};

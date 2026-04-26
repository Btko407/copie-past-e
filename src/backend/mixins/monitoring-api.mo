import Map "mo:core/Map";
import Time "mo:core/Time";
import Cycles "mo:core/Cycles";
import Prim "mo:⛔";
import MonitoringLib "../lib/monitoring";

/// Monitoring ring-buffer mixin.
/// Tracks up to 1000 structured log entries (oldest overwritten when full).
/// Survives upgrades automatically via Enhanced Orthogonal Persistence (EOP).
mixin (
  monLogs        : Map.Map<Nat, MonitoringLib.MonitoringLogEntry>,
  monNextIndex   : { var value : Nat },
  monTotalLogged : { var value : Nat },
) {
  /// Alias for the shared log entry type (accessible as actor public type).
  public type MonitoringLogEntry = MonitoringLib.MonitoringLogEntry;

  let MON_RING_SIZE : Nat = 1000;

  /// Write a structured log entry.
  /// `level` should be one of: "info", "warn", "error", "critical".
  public func logEvent(level : Text, component : Text, message : Text) {
    MonitoringLib.logEvent(monLogs, monNextIndex, monTotalLogged, level, component, message);
  };

  /// Return the most recent `limit` log entries (up to 1000), newest-first.
  public query func getRecentLogs(limit : Nat) : async [MonitoringLib.MonitoringLogEntry] {
    let total = monLogs.size();
    if (total == 0) { return [] };

    let cap   = if (limit > MON_RING_SIZE) MON_RING_SIZE else limit;
    let count = if (cap > total) total else cap;

    // writeHead points to where the NEXT write will go — the slot just after
    // the most-recent entry (wrapping within MON_RING_SIZE).
    let writeHead = monNextIndex.value % MON_RING_SIZE;

    // Walk backwards from the most-recent slot to collect `count` entries.
    var collected : [MonitoringLib.MonitoringLogEntry] = [];
    var i = 0;
    while (i < count) {
      let slot = (writeHead + MON_RING_SIZE - 1 - i) % MON_RING_SIZE;
      switch (monLogs.get(slot)) {
        case (?entry) {
          collected := collected.concat([entry]);
        };
        case null {};
      };
      i += 1;
    };
    collected
  };

  /// Return the total number of log entries ever written (may exceed 1000 once buffer wraps).
  public query func getLogCount() : async Nat {
    monTotalLogged.value
  };

  /// Return a lightweight system health snapshot for the admin dashboard.
  public query func getMonitoringStatus() : async {
    logCount        : Nat;
    cyclesAvailable : Nat;
    heapSize        : Nat;
  } {
    {
      logCount        = monTotalLogged.value;
      cyclesAvailable = Cycles.balance();
      heapSize        = Prim.rts_heap_size();
    }
  };
};

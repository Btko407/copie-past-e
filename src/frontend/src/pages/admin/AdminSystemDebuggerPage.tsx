import { createActor } from "@/backend";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  Loader2,
  RefreshCw,
  Server,
  Shield,
  Zap,
} from "lucide-react";
import { type ReactNode, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type LogLevel = "info" | "warn" | "error" | "critical";

interface SystemLogEntry {
  timestamp: bigint;
  level: LogLevel;
  component: string;
  message: string;
  cyclesAvailable?: bigint;
}

interface SystemStatus {
  cycles: bigint;
  heapSize: bigint;
  logCount: bigint;
  recentLogs: SystemLogEntry[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LOW_CYCLES_THRESHOLD = BigInt(5_000_000_000_000); // 5 trillion
const POLL_INTERVAL_MS = 30_000;
const MAX_LOGS_DISPLAYED = 20;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toNum(v: bigint | number | null | undefined): number {
  if (v === null || v === undefined) return 0;
  return typeof v === "bigint" ? Number(v) : v;
}

function formatCyclesT(cycles: bigint): string {
  return `${(Number(cycles) / 1_000_000_000_000).toFixed(1)}T`;
}

function formatHeapMB(heapSize: bigint): string {
  return `${(Number(heapSize) / (1024 * 1024)).toFixed(1)} MB`;
}

function formatLogTime(ts: bigint): string {
  // Backend timestamps are nanoseconds
  const ms = Number(ts) / 1_000_000;
  const d = new Date(ms);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function normalizeLevel(raw: string): LogLevel {
  const l = raw.toLowerCase();
  if (l === "warn" || l === "warning") return "warn";
  if (l === "error") return "error";
  if (l === "critical") return "critical";
  return "info";
}

// ─── Level badge config ───────────────────────────────────────────────────────

const LEVEL_BADGE: Record<
  LogLevel,
  { cls: string; label: string; dotCls: string }
> = {
  info: {
    cls: "bg-cyan-900/60 text-cyan-300 border-cyan-700/60",
    label: "INFO",
    dotCls: "bg-cyan-400",
  },
  warn: {
    cls: "bg-yellow-900/60 text-yellow-300 border-yellow-700/60",
    label: "WARN",
    dotCls: "bg-yellow-400",
  },
  error: {
    cls: "bg-red-900/60 text-red-300 border-red-700/60",
    label: "ERROR",
    dotCls: "bg-red-400",
  },
  critical: {
    cls: "bg-red-900/80 text-red-200 border-red-600/80 font-bold",
    label: "CRIT",
    dotCls: "bg-red-300 animate-pulse",
  },
};

function LevelBadge({ level }: { level: LogLevel }) {
  const cfg = LEVEL_BADGE[level];
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border font-mono text-[9px] uppercase tracking-widest ${cfg.cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dotCls}`} />
      {cfg.label}
    </span>
  );
}

// ─── Metric card ─────────────────────────────────────────────────────────────

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: "blue" | "green" | "amber" | "red";
  loading?: boolean;
}

function MetricCard({
  icon,
  label,
  value,
  sub,
  accent = "blue",
  loading,
}: MetricCardProps) {
  const accentMap = {
    blue: "border-primary/50 bg-primary/5 text-primary",
    green: "border-green-500/50 bg-green-900/10 text-green-400",
    amber: "border-yellow-500/50 bg-yellow-900/10 text-yellow-300",
    red: "border-red-500/50 bg-red-900/10 text-red-300",
  };
  const iconCls = accentMap[accent];

  return (
    <div className="rounded-xl bg-card border border-border/40 p-4 flex gap-3 items-start">
      <div className={`mt-0.5 shrink-0 rounded-lg p-2 border ${iconCls}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">
          {label}
        </p>
        {loading ? (
          <Skeleton className="h-5 w-24" />
        ) : (
          <p className="font-display text-lg font-bold text-foreground tracking-wider leading-none">
            {value}
          </p>
        )}
        {sub && !loading && (
          <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Log row skeleton ─────────────────────────────────────────────────────────

function LogRowSkeleton() {
  return (
    <div className="flex gap-3 items-center px-4 py-2 border-b border-border/20 last:border-0">
      <Skeleton className="h-4 w-14 shrink-0" />
      <Skeleton className="h-4 w-12 shrink-0" />
      <Skeleton className="h-4 w-20 shrink-0" />
      <Skeleton className="h-4 flex-1" />
    </div>
  );
}

// ─── Log table ────────────────────────────────────────────────────────────────

function LogTable({
  logs,
  loading,
  error,
}: {
  logs: SystemLogEntry[];
  loading: boolean;
  error: boolean;
}) {
  if (loading) {
    return (
      <div data-ocid="health.log_table.loading_state">
        {(["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"] as const).map(
          (k) => (
            <LogRowSkeleton key={k} />
          ),
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center py-10 gap-2"
        data-ocid="health.log_table.error_state"
      >
        <AlertTriangle className="w-6 h-6 text-yellow-400" />
        <p className="font-mono text-xs text-muted-foreground text-center">
          getSystemStatus() not yet available on this backend.
          <br />
          Upgrade and redeploy the canister to enable live log monitoring.
        </p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-10 gap-2"
        data-ocid="health.log_table.empty_state"
      >
        <Activity className="w-6 h-6 text-muted-foreground/40" />
        <p className="font-mono text-xs text-muted-foreground">
          No log entries yet. Activity will appear here as the system operates.
        </p>
      </div>
    );
  }

  return (
    <div data-ocid="health.log_table">
      {logs.slice(0, MAX_LOGS_DISPLAYED).map((entry, idx) => {
        const level = normalizeLevel(entry.level as string);
        const cfg = LEVEL_BADGE[level];
        const isCritical = level === "critical";
        // Use timestamp + idx as a stable key (ring buffer entries are unique by position)
        const rowKey = `${String(entry.timestamp)}-${idx}`;
        return (
          <div
            key={rowKey}
            className={`flex gap-0 items-stretch border-b border-border/20 last:border-0 hover:bg-secondary/20 transition-colors duration-150 ${
              isCritical ? "bg-red-900/10" : ""
            }`}
            data-ocid={`health.log_table.item.${idx + 1}`}
          >
            {/* Level color stripe */}
            <div
              className={`w-0.5 shrink-0 ${cfg.dotCls.replace("animate-pulse", "")} opacity-70`}
            />

            <div className="flex gap-3 items-center px-4 py-2 flex-1 min-w-0">
              {/* Timestamp */}
              <span className="font-mono text-[10px] text-muted-foreground/60 shrink-0 w-16 tabular-nums">
                {formatLogTime(entry.timestamp)}
              </span>

              {/* Level badge */}
              <div className="shrink-0">
                <LevelBadge level={level} />
              </div>

              {/* Component */}
              <span className="font-mono text-[10px] text-primary/80 shrink-0 w-20 truncate">
                {entry.component}
              </span>

              {/* Message */}
              <span
                className={`font-mono text-[11px] min-w-0 truncate ${
                  isCritical
                    ? "text-red-200 font-bold"
                    : level === "error"
                      ? "text-red-300"
                      : level === "warn"
                        ? "text-yellow-300"
                        : "text-foreground/80"
                }`}
                title={entry.message}
              >
                {entry.message}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Hook: polling system status ──────────────────────────────────────────────

function useSystemStatus() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<SystemStatus | null>({
    queryKey: ["systemStatus"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await (actor as any).getSystemStatus?.();
        if (result === undefined || result === null) return null;
        return result as SystemStatus;
      } catch {
        // Method not yet deployed — return null so we show graceful fallback
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: POLL_INTERVAL_MS,
    staleTime: 0,
    retry: 0,
  });
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function AdminSystemDebuggerPage() {
  const {
    data: status,
    isLoading,
    dataUpdatedAt,
    refetch,
    isFetching,
  } = useSystemStatus();

  const [manualRefetchTs, setManualRefetchTs] = useState<Date | null>(null);

  const handleRefresh = async () => {
    await refetch();
    setManualRefetchTs(new Date());
  };

  const lastUpdated =
    manualRefetchTs ?? (dataUpdatedAt ? new Date(dataUpdatedAt) : null);
  const cycles = status?.cycles ?? null;
  const isLowCycles = cycles !== null && cycles < LOW_CYCLES_THRESHOLD;

  // Determine if getSystemStatus is actually unavailable (null returned, not loading)
  const isMethodMissing = !isLoading && status === null;

  const logs: SystemLogEntry[] = status?.recentLogs ?? [];

  // Count by level
  const criticalCount = logs.filter(
    (l) => normalizeLevel(l.level as string) === "critical",
  ).length;
  const errorCount = logs.filter(
    (l) => normalizeLevel(l.level as string) === "error",
  ).length;
  const warnCount = logs.filter(
    (l) => normalizeLevel(l.level as string) === "warn",
  ).length;

  return (
    <AdminLayout title="System Health Monitor" subtitle="Live Telemetry">
      {/* ── Low cycles warning banner ──────────────────────────────────────── */}
      {isLowCycles && (
        <div
          className="mb-5 rounded-lg border border-yellow-500/60 bg-yellow-900/15 px-4 py-3 flex items-start gap-3"
          data-ocid="health.low_cycles_banner"
        >
          <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="font-mono text-xs text-yellow-300 font-bold">
              ⚠ Low Cycles Warning
            </p>
            <p className="font-mono text-[11px] text-yellow-400/80 mt-0.5">
              Canister has{" "}
              <span className="font-bold text-yellow-300">
                {formatCyclesT(cycles!)} cycles
              </span>{" "}
              remaining — below the 5T safe threshold. HTTPS outcalls (Stripe,
              Gemini OCR) may fail. Top up immediately via IC dashboard or{" "}
              <code className="bg-yellow-900/40 px-1 rounded text-[10px]">
                dfx canister deposit-cycles
              </code>
              .
            </p>
          </div>
        </div>
      )}

      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div
        className="mb-6 rounded-xl bg-card neon-border-blue p-5 relative overflow-hidden"
        data-ocid="health.header"
      >
        <div className="absolute inset-0 retro-grid opacity-10 pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-5 h-5 text-primary shrink-0" />
              <h2 className="font-display text-base font-bold tracking-wider text-foreground text-glow-blue uppercase">
                System Health Monitor
              </h2>
              <Badge
                variant="outline"
                className="font-mono text-[8px] uppercase tracking-widest border-primary/40 text-primary/70 bg-primary/5 ml-1"
              >
                30s polling
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-muted-foreground shrink-0" />
              <p className="font-mono text-[11px] text-muted-foreground">
                {lastUpdated
                  ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
                  : "Waiting for first poll…"}
                {isFetching && (
                  <span className="ml-2 text-primary/70">● Refreshing</span>
                )}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="shrink-0 font-mono text-[10px] uppercase tracking-widest neon-border-blue hover:bg-primary/10 transition-smooth"
            onClick={handleRefresh}
            disabled={isFetching}
            data-ocid="health.refresh_button"
          >
            {isFetching ? (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            )}
            {isFetching ? "Polling…" : "Refresh Now"}
          </Button>
        </div>
      </div>

      {/* ── Metric cards ──────────────────────────────────────────────────── */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
        data-ocid="health.metrics_grid"
      >
        <MetricCard
          icon={<Zap className="w-4 h-4" />}
          label="Cycles Available"
          value={status?.cycles != null ? formatCyclesT(status.cycles) : "—"}
          sub={
            status?.cycles != null
              ? isLowCycles
                ? "⚠ Below 5T threshold"
                : "Sufficient for outcalls"
              : "Pending"
          }
          accent={
            status?.cycles == null ? "blue" : isLowCycles ? "amber" : "green"
          }
          loading={isLoading}
        />
        <MetricCard
          icon={<Database className="w-4 h-4" />}
          label="Heap Size"
          value={status?.heapSize != null ? formatHeapMB(status.heapSize) : "—"}
          sub="Canister memory"
          accent="blue"
          loading={isLoading}
        />
        <MetricCard
          icon={<Server className="w-4 h-4" />}
          label="Log Entries"
          value={
            status?.logCount != null ? String(toNum(status.logCount)) : "—"
          }
          sub="Ring buffer (max 1000)"
          accent="blue"
          loading={isLoading}
        />
        <MetricCard
          icon={<Shield className="w-4 h-4" />}
          label="Alert Summary"
          value={
            isLoading
              ? "…"
              : isMethodMissing
                ? "N/A"
                : criticalCount > 0
                  ? `${criticalCount} Critical`
                  : errorCount > 0
                    ? `${errorCount} Errors`
                    : warnCount > 0
                      ? `${warnCount} Warnings`
                      : "All Clear"
          }
          sub={
            isMethodMissing
              ? "Method not deployed"
              : `${logs.length} recent entries`
          }
          accent={
            isMethodMissing
              ? "blue"
              : criticalCount > 0
                ? "red"
                : errorCount > 0
                  ? "amber"
                  : "green"
          }
          loading={isLoading}
        />
      </div>

      {/* ── Recent log entries ─────────────────────────────────────────────── */}
      <div
        className="rounded-xl bg-card border border-border/40 overflow-hidden"
        data-ocid="health.log_panel"
      >
        {/* Panel header */}
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-border/40 bg-card">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary shrink-0" />
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-foreground">
              Recent Log Entries
            </h3>
            {!isLoading && !isMethodMissing && logs.length > 0 && (
              <span className="font-mono text-[9px] text-muted-foreground">
                (showing last {Math.min(logs.length, MAX_LOGS_DISPLAYED)} of{" "}
                {toNum(status?.logCount ?? BigInt(0))})
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Legend */}
            {!isMethodMissing && (
              <div className="hidden sm:flex items-center gap-3">
                {(["info", "warn", "error", "critical"] as LogLevel[]).map(
                  (lvl) => (
                    <div key={lvl} className="flex items-center gap-1">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${LEVEL_BADGE[lvl].dotCls.replace("animate-pulse", "")}`}
                      />
                      <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">
                        {lvl}
                      </span>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        </div>

        {/* Column headers */}
        {!isLoading && !isMethodMissing && logs.length > 0 && (
          <div className="flex gap-3 items-center px-4 py-1.5 bg-muted/20 border-b border-border/20">
            <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60 w-16 shrink-0">
              Time
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60 shrink-0 w-14">
              Level
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60 shrink-0 w-20">
              Component
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60">
              Message
            </span>
          </div>
        )}

        {/* Log rows */}
        <ScrollArea className="h-[420px]" data-ocid="health.log_scroll_area">
          <LogTable logs={logs} loading={isLoading} error={isMethodMissing} />
        </ScrollArea>
      </div>

      {/* ── Method not deployed notice ─────────────────────────────────────── */}
      {isMethodMissing && (
        <div
          className="mt-4 rounded-lg border border-border/40 bg-muted/20 px-5 py-4 flex items-start gap-3"
          data-ocid="health.method_missing_notice"
        >
          <CheckCircle2 className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="font-mono text-xs text-muted-foreground font-semibold mb-1">
              Backend monitoring not yet deployed
            </p>
            <p className="font-mono text-[11px] text-muted-foreground/70 leading-snug">
              The{" "}
              <code className="bg-muted/50 px-1 rounded">
                getSystemStatus()
              </code>{" "}
              method has not been deployed to the canister yet. Once you deploy
              the Golden Master backend with the monitoring mixin, this
              dashboard will auto-populate with live cycle telemetry and
              structured log entries. The page will poll every 30 seconds and
              activate automatically.
            </p>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

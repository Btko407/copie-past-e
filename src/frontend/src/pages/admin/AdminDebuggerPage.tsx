import { createActor } from "@/backend";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  Database,
  Download,
  Eye,
  HardDrive,
  Link2,
  Loader2,
  RefreshCw,
  Shield,
  Users,
  Wrench,
  XCircle,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorAny = any;

// ─── Shared types ─────────────────────────────────────────────────────────────

type StatusLevel = "green" | "yellow" | "red";

interface SystemHealth {
  stripe: {
    status: string;
    hasPublishableKey: boolean;
    hasSecretKey: boolean;
    hasPriceIds: boolean;
    lastWebhookAt?: bigint;
  };
  gemini: { status: string; hasApiKey: boolean };
  database: { status: string; canReadUsers: boolean; canReadConfig: boolean };
  backup: {
    status: string;
    lastBackupAt?: bigint;
    backupCount: bigint;
    freshnessHours?: bigint;
  };
  maintenance: { isActive: boolean };
  signups: { total: bigint; lastSignupAt?: bigint };
  paypal: { status: string; isConfigured: boolean };
}

interface ComponentStatus {
  name: string;
  category: string;
  status: "healthy" | "warning" | "error" | "offline";
  lastCheck: bigint;
  message: string;
  metrics: {
    uptime: number;
    responseTime: bigint | number;
    errorCount: bigint | number;
    successCount: bigint | number;
  };
}

interface SystemIssue {
  id: string;
  severity: "info" | "warning" | "error" | "critical";
  title: string;
  description: string;
  affectedComponent: string;
  suggestedFix: string;
  discoveredAt: bigint;
  resolved: boolean;
}

interface SystemDiagnostics {
  timestamp: bigint;
  overallStatus: "healthy" | "warning" | "critical";
  components: ComponentStatus[];
  issues: SystemIssue[];
  recommendations: string[];
  criticalFailures: string[];
}

interface IntegrationStatus {
  name: string;
  connected: boolean;
  lastTestAt?: bigint | null;
  lastTestResult?: boolean | null;
  configPresent: boolean;
  errorMessage?: string | null;
}

interface BackupFile {
  id: string;
  filename: string;
  size: bigint | number;
  created: bigint;
  backupType: string;
  userCount: bigint | number;
  listingCount: bigint | number;
}

interface ExportReport {
  timestamp: bigint;
  overallStatus: string;
  componentsJson: string;
  issuesJson: string;
  recommendationsJson: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toNum(v: bigint | number | null | undefined): number {
  if (v === null || v === undefined) return 0;
  return typeof v === "bigint" ? Number(v) : v;
}

function formatTs(ts: bigint | undefined): string {
  if (!ts || ts === BigInt(0)) return "Never";
  return new Date(toNum(ts) / 1_000_000).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatBytes(b: bigint | number): string {
  const n = toNum(b);
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

function formatCycles(cycles: bigint): string {
  return `${(Number(cycles) / 1_000_000_000_000).toFixed(2)} trillion`;
}

function getCyclesLevel(cycles: bigint | null): StatusLevel {
  if (!cycles) return "yellow";
  const c = Number(cycles);
  if (c < 100_000_000_000) return "red";
  if (c < 1_000_000_000_000) return "yellow";
  return "green";
}

function statusColor(level: StatusLevel) {
  return {
    green: "border-l-[#22c55e] bg-[#22c55e]/5",
    yellow: "border-l-[#eab308] bg-[#eab308]/5",
    red: "border-l-[#ef4444] bg-[#ef4444]/5",
  }[level];
}

function componentStatusToLevel(s: ComponentStatus["status"]): StatusLevel {
  if (s === "healthy") return "green";
  if (s === "warning") return "yellow";
  return "red";
}

// ─── Reusable sub-components ──────────────────────────────────────────────────

function StatusBadge({ level }: { level: StatusLevel }) {
  const cfg = {
    green: {
      label: "OPERATIONAL",
      cls: "text-[#22c55e] border-[#22c55e]/50 bg-[#22c55e]/10",
    },
    yellow: {
      label: "WARNING",
      cls: "text-[#eab308] border-[#eab308]/50 bg-[#eab308]/10",
    },
    red: {
      label: "ERROR",
      cls: "text-[#ef4444] border-[#ef4444]/50 bg-[#ef4444]/10",
    },
  }[level];
  return (
    <Badge
      variant="outline"
      className={`font-mono text-[9px] uppercase tracking-widest ${cfg.cls}`}
    >
      {cfg.label}
    </Badge>
  );
}

function StatusIcon({ level }: { level: StatusLevel }) {
  if (level === "green")
    return <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0" />;
  if (level === "yellow")
    return <AlertTriangle className="w-4 h-4 text-[#eab308] shrink-0" />;
  return <XCircle className="w-4 h-4 text-[#ef4444] shrink-0" />;
}

interface DebugCardProps {
  icon: React.ReactNode;
  title: string;
  level: StatusLevel;
  details: { label: string; ok: boolean; info?: string }[];
  fixLabel?: string;
  fixPath?: string;
  onFixClick?: () => void;
  fixLoading?: boolean;
}

function DebugCard({
  icon,
  title,
  level,
  details,
  fixLabel,
  fixPath,
  onFixClick,
  fixLoading,
}: DebugCardProps) {
  const navigate = useNavigate();
  return (
    <div
      className={`rounded-xl bg-card border-l-4 border border-border/40 p-5 flex flex-col gap-3 ${statusColor(level)}`}
      data-ocid="debugger-status-card"
    >
      <div className="flex items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="shrink-0">{icon}</div>
          <p className="font-display text-xs font-bold uppercase tracking-wider text-foreground truncate">
            {title}
          </p>
        </div>
        <StatusBadge level={level} />
      </div>
      <ul className="space-y-1.5">
        {details.map((d) => (
          <li key={d.label} className="flex items-start gap-2">
            <StatusIcon level={d.ok ? "green" : "red"} />
            <span className="font-mono text-[11px] text-muted-foreground leading-tight">
              <span
                className={d.ok ? "text-foreground/80" : "text-[#ef4444]/90"}
              >
                {d.label}
              </span>
              {d.info && (
                <span className="ml-1 text-muted-foreground">— {d.info}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
      {fixLabel && (fixPath || onFixClick) && (
        <Button
          variant="outline"
          size="sm"
          className="self-start font-mono text-[10px] uppercase tracking-widest h-7 px-3 border-border/60 hover:bg-secondary/40 transition-smooth"
          onClick={() => {
            if (onFixClick) onFixClick();
            else if (fixPath) navigate({ to: fixPath as "/" });
          }}
          disabled={fixLoading}
          data-ocid={`debugger-fix-${title.toLowerCase().replace(/\s+/g, "-")}`}
        >
          {fixLoading ? (
            <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
          ) : (
            <Wrench className="w-3 h-3 mr-1.5" />
          )}
          {fixLoading ? "Creating…" : fixLabel}
        </Button>
      )}
    </div>
  );
}

function DebugCardSkeleton() {
  return (
    <div className="rounded-xl bg-card border border-border/40 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
      </div>
    </div>
  );
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useSystemHealth(refreshKey: number) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<SystemHealth>({
    queryKey: ["systemHealth", refreshKey],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getSystemHealthStatus() as Promise<SystemHealth>;
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    retry: 1,
  });
}

function useCyclesBalance(refreshKey: number) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<bigint | null>({
    queryKey: ["cyclesBalance", refreshKey],
    queryFn: async () => {
      if (!actor) return null;
      const result = await (actor as ActorAny).getCanisterCyclesBalance?.();
      if (result === undefined || result === null) return null;
      return result as bigint;
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    retry: 1,
  });
}

// ─── Tab: Diagnostics ─────────────────────────────────────────────────────────

function DiagnosticsTab({
  diagnostics,
  loading,
}: {
  diagnostics: SystemDiagnostics | undefined;
  loading: boolean;
}) {
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[0, 1, 2, 3].map((k) => (
          <DebugCardSkeleton key={k} />
        ))}
      </div>
    );
  }
  if (!diagnostics) {
    return (
      <p className="font-mono text-xs text-muted-foreground">
        No diagnostics data available.
      </p>
    );
  }

  const overallOk = diagnostics.overallStatus === "healthy";
  const overallWarn = diagnostics.overallStatus === "warning";

  return (
    <div className="space-y-4">
      {/* Overall banner */}
      <div
        className={`rounded-lg border p-4 flex items-center gap-3 ${
          overallOk
            ? "bg-green-900/10 border-green-500/50"
            : overallWarn
              ? "bg-yellow-900/10 border-yellow-500/50"
              : "bg-red-900/10 border-red-500/50"
        }`}
        data-ocid="diagnostics.overall_status"
      >
        {overallOk ? (
          <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
        ) : overallWarn ? (
          <AlertTriangle className="h-5 w-5 text-yellow-400 shrink-0" />
        ) : (
          <XCircle className="h-5 w-5 text-red-400 shrink-0" />
        )}
        <span className="font-semibold text-sm text-white">
          {overallOk
            ? "✅ All Systems Healthy"
            : overallWarn
              ? "⚠️ Warnings Detected"
              : "❌ Critical Issues"}
        </span>
        <span className="ml-auto font-mono text-xs text-muted-foreground">
          {diagnostics.components.length} components
        </span>
      </div>

      {/* Critical failures */}
      {diagnostics.criticalFailures.length > 0 && (
        <div
          className="bg-red-900/20 border border-red-500/60 p-4 rounded-lg"
          data-ocid="diagnostics.critical_failures"
        >
          <h3 className="text-red-400 font-bold text-xs mb-2 uppercase tracking-wide">
            🚨 Critical:
          </h3>
          <ul className="space-y-1">
            {diagnostics.criticalFailures.map((f) => (
              <li key={f} className="text-red-300 text-xs flex gap-2">
                <span>•</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Component cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {diagnostics.components.map((c) => {
          const level = componentStatusToLevel(c.status);
          return (
            <div
              key={c.name}
              className={`rounded-xl bg-card border-l-4 border border-border/40 p-4 ${statusColor(level)}`}
              data-ocid="diagnostics.component_card"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="font-display text-xs font-bold uppercase tracking-wider text-foreground truncate">
                  {c.name}
                </p>
                <StatusBadge level={level} />
              </div>
              <p className="font-mono text-[11px] text-muted-foreground leading-snug">
                {c.message}
              </p>
              <div className="mt-2 flex gap-4 font-mono text-[10px] text-muted-foreground/60">
                <span>Uptime: {(c.metrics.uptime * 100).toFixed(0)}%</span>
                <span>Errors: {toNum(c.metrics.errorCount)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Issues */}
      {diagnostics.issues.length > 0 && (
        <div className="space-y-2" data-ocid="diagnostics.issues_list">
          <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            Issues Found:
          </h3>
          {diagnostics.issues.map((issue) => (
            <button
              key={issue.id}
              type="button"
              className="w-full text-left bg-card border border-border/40 p-4 rounded-lg cursor-pointer hover:border-yellow-500/50 transition-smooth"
              onClick={() =>
                setExpandedIssue(expandedIssue === issue.id ? null : issue.id)
              }
              data-ocid={`diagnostics.issue.${issue.id}`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {issue.severity === "critical" && (
                    <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                  )}
                  {issue.severity === "error" && (
                    <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0" />
                  )}
                  {issue.severity === "warning" && (
                    <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0" />
                  )}
                  {issue.severity === "info" && (
                    <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0" />
                  )}
                  <span className="font-bold text-sm text-foreground truncate">
                    {issue.title}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className={`font-mono text-[9px] uppercase tracking-widest shrink-0 ${
                    issue.severity === "critical"
                      ? "text-red-300 border-red-500/50 bg-red-900/20"
                      : issue.severity === "error"
                        ? "text-orange-300 border-orange-500/50 bg-orange-900/20"
                        : "text-yellow-300 border-yellow-500/50 bg-yellow-900/20"
                  }`}
                >
                  {issue.severity}
                </Badge>
              </div>
              {expandedIssue === issue.id && (
                <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                  <p>{issue.description}</p>
                  <div className="bg-green-900/20 border border-green-500/40 px-3 py-2 rounded">
                    <span className="text-green-400 font-semibold">Fix: </span>
                    {issue.suggestedFix}
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Recommendations */}
      {diagnostics.recommendations.length > 0 && (
        <div
          className="bg-blue-900/10 border border-blue-500/40 p-4 rounded-lg"
          data-ocid="diagnostics.recommendations"
        >
          <h3 className="text-blue-400 font-bold text-xs mb-2 uppercase tracking-wide">
            💡 Recommendations:
          </h3>
          <ul className="space-y-1">
            {diagnostics.recommendations.map((rec) => (
              <li key={rec} className="text-blue-300 text-xs flex gap-2">
                <span>→</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Backups ─────────────────────────────────────────────────────────────

function BackupsTab({ actor }: { actor: ActorAny }) {
  const { isFetching } = useActor(createActor);
  const { data: backups, isLoading } = useQuery<BackupFile[]>({
    queryKey: ["backupsForDownload"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as ActorAny).listBackupsForDownload();
    },
    enabled: !!actor && !isFetching,
  });

  const downloadBackup = async (backupId: string) => {
    if (!actor) return;
    try {
      const result = await (actor as ActorAny).downloadVersionBackupAsJson(
        backupId,
      );
      if (!result || result.length === 0) {
        toast.error("Backup not found");
        return;
      }
      const item = Array.isArray(result) ? result[0] : result;
      const blob = new Blob([item.data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = item.filename;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${item.filename}`);
    } catch (err) {
      toast.error("Download failed");
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[0, 1, 2].map((k) => (
          <Skeleton key={k} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3" data-ocid="debugger.backups_list">
      {!backups || backups.length === 0 ? (
        <div
          className="rounded-lg bg-card border border-border/40 p-8 text-center"
          data-ocid="debugger.backups.empty_state"
        >
          <HardDrive className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="font-mono text-xs text-muted-foreground">
            No backups available for download.
          </p>
        </div>
      ) : (
        backups.map((b, idx) => (
          <div
            key={b.id}
            className="rounded-lg bg-card border border-border/40 p-4 flex flex-col sm:flex-row sm:items-center gap-3"
            data-ocid={`debugger.backup.item.${idx + 1}`}
          >
            <div className="flex-1 min-w-0">
              <p className="font-mono text-xs text-foreground font-semibold truncate">
                {b.filename}
              </p>
              <div className="flex flex-wrap gap-3 mt-1 font-mono text-[10px] text-muted-foreground">
                <span>{toNum(b.userCount)} users</span>
                <span>{toNum(b.listingCount)} listings</span>
                <span>{formatBytes(b.size)}</span>
                <span>{formatTs(b.created)}</span>
                <Badge
                  variant="outline"
                  className="font-mono text-[9px] uppercase border-border/50"
                >
                  {b.backupType}
                </Badge>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="font-mono text-[10px] uppercase tracking-widest h-8 shrink-0 border-primary/40 hover:bg-primary/10 hover:text-primary transition-smooth"
              onClick={() => downloadBackup(b.id)}
              data-ocid={`debugger.backup.download_button.${idx + 1}`}
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Download JSON
            </Button>
          </div>
        ))
      )}
    </div>
  );
}

// ─── Tab: Integrations ────────────────────────────────────────────────────────

function IntegrationsTab({
  diagnostics,
  integrations,
  loading,
}: {
  diagnostics: SystemDiagnostics | undefined;
  integrations: IntegrationStatus[] | undefined;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[0, 1, 2, 3].map((k) => (
          <Skeleton key={k} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  const items = integrations ?? [];

  return (
    <div className="space-y-3" data-ocid="debugger.integrations_list">
      {items.length === 0 && (
        <p className="font-mono text-xs text-muted-foreground">
          No integration data available.
        </p>
      )}
      {items.map((intg, idx) => (
        <div
          key={intg.name}
          className={`rounded-lg border p-4 flex items-start justify-between gap-3 ${
            intg.connected
              ? "bg-green-900/10 border-green-500/40"
              : "bg-red-900/10 border-red-500/40"
          }`}
          data-ocid={`debugger.integration.item.${idx + 1}`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Link2
              className={`h-4 w-4 shrink-0 ${intg.connected ? "text-green-400" : "text-red-400"}`}
            />
            <div className="min-w-0">
              <p className="font-semibold text-sm text-foreground">
                {intg.name}
              </p>
              <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
                {intg.connected ? "✅ Connected" : "❌ Not connected"}
                {intg.errorMessage &&
                  ` — ${Array.isArray(intg.errorMessage) ? intg.errorMessage[0] : intg.errorMessage}`}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <Badge
              variant="outline"
              className={`font-mono text-[9px] uppercase tracking-widest ${
                intg.configPresent
                  ? "text-green-300 border-green-500/50 bg-green-900/20"
                  : "text-red-300 border-red-500/50 bg-red-900/20"
              }`}
            >
              {intg.configPresent ? "Config OK" : "No Config"}
            </Badge>
          </div>
        </div>
      ))}

      {/* Also show critical failures if diagnostics available */}
      {diagnostics && diagnostics.criticalFailures.length > 0 && (
        <div className="bg-red-900/10 border border-red-500/40 p-4 rounded-lg mt-2">
          <h3 className="font-mono text-xs text-red-400 uppercase tracking-widest mb-2">
            Critical:
          </h3>
          {diagnostics.criticalFailures.map((f) => (
            <p key={f} className="text-red-300 text-xs">
              {f}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tab: Export ──────────────────────────────────────────────────────────────

function ExportTab({ actor }: { actor: ActorAny }) {
  const { isFetching } = useActor(createActor);
  const { data: exportReport, isLoading } = useQuery<ExportReport>({
    queryKey: ["systemExportReport"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return (actor as ActorAny).exportSystemReport();
    },
    enabled: !!actor && !isFetching,
  });

  const downloadReport = () => {
    if (!exportReport) return;
    try {
      const reportData = {
        timestamp: toNum(exportReport.timestamp),
        overallStatus: exportReport.overallStatus,
        components: JSON.parse(exportReport.componentsJson),
        issues: JSON.parse(exportReport.issuesJson),
        recommendations: JSON.parse(exportReport.recommendationsJson),
      };
      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `system-report-${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("System report downloaded");
    } catch {
      toast.error("Failed to generate report");
    }
  };

  return (
    <div className="space-y-4" data-ocid="debugger.export_section">
      <div className="bg-blue-900/10 border border-blue-500/40 p-5 rounded-lg">
        <h3 className="font-mono text-xs text-blue-300 uppercase tracking-widest mb-1">
          📥 Export System Report
        </h3>
        <p className="font-mono text-[11px] text-muted-foreground mb-4">
          Download complete system diagnostics as a JSON file for backup and
          analysis.
        </p>
        <Button
          variant="outline"
          className="font-mono text-[10px] uppercase tracking-widest border-blue-500/50 text-blue-300 hover:bg-blue-900/30"
          onClick={downloadReport}
          disabled={isLoading || !exportReport}
          data-ocid="debugger.export.download_button"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          {isLoading ? "Generating…" : "Download System Report JSON"}
        </Button>
      </div>

      {exportReport && (
        <div className="rounded-lg bg-card border border-border/40 p-4 font-mono text-xs space-y-1">
          <p className="text-muted-foreground">Report Summary:</p>
          <p className="text-foreground">
            Status:{" "}
            <span
              className={
                exportReport.overallStatus === "healthy"
                  ? "text-green-400"
                  : exportReport.overallStatus === "warning"
                    ? "text-yellow-400"
                    : "text-red-400"
              }
            >
              {exportReport.overallStatus}
            </span>
          </p>
          <p className="text-foreground">
            Components: {(() => {
              try {
                return JSON.parse(exportReport.componentsJson).length;
              } catch {
                return "?";
              }
            })()}
          </p>
          <p className="text-foreground">
            Issues: {(() => {
              try {
                return JSON.parse(exportReport.issuesJson).length;
              } catch {
                return "?";
              }
            })()}
          </p>
          <p className="text-foreground">
            Recommendations: {(() => {
              try {
                return JSON.parse(exportReport.recommendationsJson).length;
              } catch {
                return "?";
              }
            })()}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

type Tab = "diagnostics" | "backups" | "integrations" | "export";

export function AdminDebuggerPage() {
  const [activeTab, setActiveTab] = useState<Tab>("diagnostics");
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const { actor } = useActor(createActor);

  // Legacy system health (original card grid)
  const { data, isLoading, isError, isFetching } = useSystemHealth(refreshKey);
  const { data: cyclesData, isLoading: cyclesLoading } =
    useCyclesBalance(refreshKey);

  // New diagnostics data
  const { actor: actorRef, isFetching: actorFetching } = useActor(createActor);
  const { data: diagnostics, isLoading: diagLoading } =
    useQuery<SystemDiagnostics>({
      queryKey: ["systemDiagnostics", refreshKey],
      queryFn: async () => {
        if (!actorRef) throw new Error("Actor not ready");
        return (actorRef as ActorAny).getSystemDiagnostics();
      },
      enabled: !!actorRef && !actorFetching && activeTab === "diagnostics",
      staleTime: 0,
    });

  const { data: integrations, isLoading: integLoading } = useQuery<
    IntegrationStatus[]
  >({
    queryKey: ["integrationStatus", refreshKey],
    queryFn: async () => {
      if (!actorRef) return [];
      return (actorRef as ActorAny).getIntegrationStatus();
    },
    enabled: !!actorRef && !actorFetching && activeTab === "integrations",
  });

  React.useEffect(() => {
    if (data && !isFetching) setLastChecked(new Date());
  }, [data, isFetching]);

  const createBackupMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await (actor as ActorAny).createVersionBackup(
        true,
        "Manual backup from System Debugger",
      );
      if (result?.__kind__ === "err") throw new Error(result.err as string);
      return result;
    },
    onSuccess: () => {
      toast.success("Backup created successfully.");
      setRefreshKey((k) => k + 1);
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Backup failed."),
  });

  const cards = data
    ? buildCards(
        data,
        () => createBackupMutation.mutate(),
        createBackupMutation.isPending,
      )
    : null;
  const cyclesCard =
    !cyclesLoading && cyclesData !== undefined
      ? buildCyclesCard(cyclesData ?? null)
      : null;
  const allCards: DebugCardProps[] = [
    ...(cyclesCard ? [cyclesCard] : []),
    ...(cards ?? []),
  ];
  const issueCount = allCards.filter((c) => c.level !== "green").length;
  const showLowCyclesWarning =
    cyclesData !== null &&
    cyclesData !== undefined &&
    Number(cyclesData) < 1_000_000_000_000;
  const stillLoading = isLoading || cyclesLoading;

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "diagnostics", label: "Diagnostics", icon: Eye },
    { id: "backups", label: "Backups", icon: HardDrive },
    { id: "integrations", label: "Integrations", icon: Link2 },
    { id: "export", label: "Export", icon: Download },
  ];

  return (
    <AdminLayout title="System Debugger" subtitle="Health Status">
      {/* Low cycles warning */}
      {showLowCyclesWarning && (
        <div
          className="mb-4 rounded-lg bg-[#eab308]/10 border border-[#eab308]/40 px-4 py-3 flex items-start gap-3"
          data-ocid="debugger-low-cycles-banner"
        >
          <AlertTriangle className="w-4 h-4 text-[#eab308] shrink-0 mt-0.5" />
          <p className="font-mono text-xs text-[#eab308]">
            <span className="font-bold">Low cycles warning.</span> HTTPS
            outcalls (Stripe payments, OCR) will fail if cycles run out.
          </p>
        </div>
      )}

      {/* Page header */}
      <div
        className="mb-6 rounded-xl bg-card neon-border-blue p-5 relative overflow-hidden"
        data-ocid="debugger-header"
      >
        <div className="absolute inset-0 retro-grid opacity-10 pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-primary shrink-0" />
              <h2 className="font-display text-base font-bold tracking-wider text-foreground text-glow-blue uppercase">
                System Debugger
              </h2>
            </div>
            <p className="font-mono text-[11px] text-muted-foreground">
              {lastChecked
                ? `Last checked: ${lastChecked.toLocaleTimeString()}`
                : "Not checked yet"}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            {allCards.length > 0 && !stillLoading && (
              <div
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-[11px] font-semibold border ${
                  issueCount === 0
                    ? "text-[#22c55e] border-[#22c55e]/40 bg-[#22c55e]/10"
                    : "text-[#eab308] border-[#eab308]/40 bg-[#eab308]/10"
                }`}
                data-ocid="debugger-overall-status"
              >
                {issueCount === 0 ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5" />
                )}
                {issueCount === 0
                  ? "All systems operational"
                  : `${issueCount} issue${issueCount > 1 ? "s" : ""} need attention`}
              </div>
            )}
            <Button
              size="sm"
              variant="outline"
              className="w-full sm:w-auto font-mono text-[10px] uppercase tracking-widest neon-border-blue hover:bg-primary/10 transition-smooth"
              onClick={() => setRefreshKey((k) => k + 1)}
              disabled={stillLoading || isFetching}
              data-ocid="debugger-refresh-btn"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 mr-1.5 ${isFetching ? "animate-spin" : ""}`}
              />
              {isFetching ? "Refreshing…" : "Refresh All"}
            </Button>
          </div>
        </div>
      </div>

      {isError && !isLoading && (
        <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/40 px-4 py-3 font-mono text-xs text-destructive">
          Failed to load system health. Check your connection and try
          refreshing.
        </div>
      )}

      {/* Legacy cards grid — always visible at top */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
        data-ocid="debugger-cards-grid"
      >
        {stillLoading || allCards.length === 0
          ? [
              "sk-0",
              "sk-1",
              "sk-2",
              "sk-3",
              "sk-4",
              "sk-5",
              "sk-6",
              "sk-7",
            ].map((k) => <DebugCardSkeleton key={k} />)
          : allCards.map((card) => <DebugCard key={card.title} {...card} />)}
      </div>

      {/* Tabbed section */}
      <div className="rounded-xl bg-card border border-border/40 overflow-hidden">
        {/* Tab bar */}
        <div
          className="flex border-b border-border/40 overflow-x-auto"
          data-ocid="debugger.tabs"
        >
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-3 font-mono text-[11px] uppercase tracking-widest whitespace-nowrap transition-smooth border-b-2 ${
                activeTab === id
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/30"
              }`}
              data-ocid={`debugger.tab.${id}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-5">
          {activeTab === "diagnostics" && (
            <DiagnosticsTab diagnostics={diagnostics} loading={diagLoading} />
          )}
          {activeTab === "backups" && <BackupsTab actor={actor} />}
          {activeTab === "integrations" && (
            <IntegrationsTab
              diagnostics={diagnostics}
              integrations={integrations}
              loading={integLoading}
            />
          )}
          {activeTab === "export" && <ExportTab actor={actor} />}
        </div>
      </div>
    </AdminLayout>
  );
}

// ─── Card builders (legacy) ───────────────────────────────────────────────────

function buildCyclesCard(cycles: bigint | null): DebugCardProps {
  const level = getCyclesLevel(cycles);
  let cyclesInfo: string;
  let statusInfo: string;
  if (!cycles) {
    cyclesInfo = "Unable to read balance";
    statusInfo =
      "Could not fetch cycles — actor may not expose this method yet";
  } else {
    cyclesInfo = formatCycles(cycles);
    statusInfo =
      level === "green"
        ? "Sufficient cycles for HTTPS outcalls"
        : level === "yellow"
          ? "Low cycles — top up to prevent HTTPS outcall failures"
          : "Critical: Canister may stop functioning";
  }
  return {
    icon: <Zap className="w-4 h-4 text-primary" />,
    title: "Canister Cycles",
    level,
    details: [
      { label: "Cycles balance", ok: level === "green", info: cyclesInfo },
      { label: "Status", ok: level === "green", info: statusInfo },
      ...(level !== "green"
        ? [
            {
              label: "Top up",
              ok: false,
              info: 'Use IC dashboard or "dfx canister deposit-cycles <amount> <canister-id>"',
            },
          ]
        : []),
    ],
  };
}

function buildCards(
  h: SystemHealth,
  onCreateBackup: () => void,
  backupLoading: boolean,
): DebugCardProps[] {
  const stripeLevel: StatusLevel =
    !h.stripe.hasPublishableKey || !h.stripe.hasSecretKey
      ? "red"
      : !h.stripe.hasPriceIds
        ? "yellow"
        : "green";

  const stripeCard: DebugCardProps = {
    icon: <CreditCard className="w-4 h-4 text-primary" />,
    title: "Stripe Payments",
    level: stripeLevel,
    details: [
      {
        label: "Publishable key",
        ok: h.stripe.hasPublishableKey,
        info: h.stripe.hasPublishableKey ? "Configured" : "Missing",
      },
      {
        label: "Secret key",
        ok: h.stripe.hasSecretKey,
        info: h.stripe.hasSecretKey ? "Configured" : "Missing",
      },
      {
        label: "Price IDs",
        ok: h.stripe.hasPriceIds,
        info: h.stripe.hasPriceIds ? "At least one set" : "None configured",
      },
      {
        label: "Payment verification",
        ok: true,
        info: "Polling (ICP architecture — no webhooks)",
      },
    ],
    fixLabel: "Go to Payments Config",
    fixPath: "/admin/payments",
  };

  const geminiCard: DebugCardProps = {
    icon: <Eye className="w-4 h-4 text-primary" />,
    title: "Gemini OCR",
    level: h.gemini.hasApiKey ? "green" : "red",
    details: [
      {
        label: "Gemini API key",
        ok: h.gemini.hasApiKey,
        info: h.gemini.hasApiKey ? "Configured" : "Not set — OCR disabled",
      },
      { label: "Model", ok: true, info: "gemini-2.5-flash-lite" },
    ],
    fixLabel: "Go to OCR Settings",
    fixPath: "/admin/settings",
  };

  const dbOk = h.database.canReadUsers && h.database.canReadConfig;
  const databaseCard: DebugCardProps = {
    icon: <Database className="w-4 h-4 text-primary" />,
    title: "Canister Database",
    level: dbOk ? "green" : "red",
    details: [
      {
        label: "Read users",
        ok: h.database.canReadUsers,
        info: h.database.canReadUsers ? "OK" : "Cannot read",
      },
      {
        label: "Read canister storage",
        ok: h.database.canReadConfig,
        info: h.database.canReadConfig ? "OK" : "Cannot read",
      },
    ],
  };

  const freshHours =
    h.backup.freshnessHours !== undefined
      ? Number(h.backup.freshnessHours)
      : undefined;
  const backupLevel: StatusLevel =
    !h.backup.lastBackupAt || h.backup.lastBackupAt === BigInt(0)
      ? "red"
      : freshHours === undefined
        ? "yellow"
        : freshHours < 24
          ? "green"
          : freshHours < 48
            ? "yellow"
            : "red";

  const backupCard: DebugCardProps = {
    icon: <HardDrive className="w-4 h-4 text-primary" />,
    title: "Backup System",
    level: backupLevel,
    details: [
      {
        label: "Last backup",
        ok: backupLevel !== "red",
        info:
          h.backup.lastBackupAt && h.backup.lastBackupAt > BigInt(0)
            ? `${formatTs(h.backup.lastBackupAt)}${freshHours !== undefined ? ` (${freshHours}h ago)` : ""}`
            : "No backup found",
      },
      {
        label: "Backups stored",
        ok: Number(h.backup.backupCount) > 0,
        info: `${Number(h.backup.backupCount)} backup${Number(h.backup.backupCount) !== 1 ? "s" : ""}`,
      },
    ],
    fixLabel: "Create Backup Now",
    onFixClick: onCreateBackup,
    fixLoading: backupLoading,
  };

  const maintenanceCard: DebugCardProps = {
    icon: <Shield className="w-4 h-4 text-accent" />,
    title: "Maintenance Mode",
    level: h.maintenance.isActive ? "yellow" : "green",
    details: [
      {
        label: "Maintenance mode",
        ok: !h.maintenance.isActive,
        info: h.maintenance.isActive
          ? "ACTIVE — users cannot access site"
          : "Off",
      },
    ],
    ...(h.maintenance.isActive
      ? { fixLabel: "Toggle Maintenance Mode", fixPath: "/admin/settings" }
      : {}),
  };

  const signupsCard: DebugCardProps = {
    icon: <Users className="w-4 h-4 text-primary" />,
    title: "User Signups",
    level: "green",
    details: [
      {
        label: "Total users",
        ok: true,
        info: `${Number(h.signups.total)} registered`,
      },
      {
        label: "Last signup",
        ok: true,
        info:
          h.signups.lastSignupAt && h.signups.lastSignupAt > BigInt(0)
            ? formatTs(h.signups.lastSignupAt)
            : "No signups yet",
      },
    ],
  };

  const paypalCard: DebugCardProps = {
    icon: <Zap className="w-4 h-4 text-accent" />,
    title: "PayPal",
    level: h.paypal.isConfigured ? "green" : "yellow",
    details: [
      {
        label: "PayPal",
        ok: h.paypal.isConfigured,
        info: h.paypal.isConfigured
          ? "Configured"
          : "Not configured (optional)",
      },
    ],
    ...(h.paypal.isConfigured
      ? {}
      : { fixLabel: "Go to Payments Config", fixPath: "/admin/payments" }),
  };

  return [
    stripeCard,
    geminiCard,
    databaseCard,
    backupCard,
    maintenanceCard,
    signupsCard,
    paypalCard,
  ];
}

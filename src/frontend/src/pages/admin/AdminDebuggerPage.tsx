import { createActor } from "@/backend";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  Database,
  Eye,
  HardDrive,
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

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Hook ─────────────────────────────────────────────────────────────────────

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTs(ts: bigint | undefined): string {
  if (!ts || ts === BigInt(0)) return "Never";
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusColor(level: StatusLevel) {
  return {
    green: "border-l-[#22c55e] bg-[#22c55e]/5",
    yellow: "border-l-[#eab308] bg-[#eab308]/5",
    red: "border-l-[#ef4444] bg-[#ef4444]/5",
  }[level];
}

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

// ─── Card component ────────────────────────────────────────────────────────

interface DebugCardProps {
  icon: React.ReactNode;
  title: string;
  level: StatusLevel;
  details: { label: string; ok: boolean; info?: string }[];
  fixLabel?: string;
  fixPath?: string;
  /** If provided, clicking the fix button calls this instead of navigating */
  onFixClick?: () => void;
  /** Shows a spinner on the fix button when true */
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
      {/* Card header */}
      <div className="flex items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="shrink-0">{icon}</div>
          <p className="font-display text-xs font-bold uppercase tracking-wider text-foreground truncate">
            {title}
          </p>
        </div>
        <StatusBadge level={level} />
      </div>

      {/* Details list */}
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

      {/* Fix button */}
      {fixLabel && (fixPath || onFixClick) && (
        <Button
          variant="outline"
          size="sm"
          className="self-start font-mono text-[10px] uppercase tracking-widest h-7 px-3 border-border/60 hover:bg-secondary/40 transition-smooth"
          onClick={() => {
            if (onFixClick) {
              onFixClick();
            } else if (fixPath) {
              navigate({ to: fixPath as "/" });
            }
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

// ─── Skeleton card ─────────────────────────────────────────────────────────

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

// ─── Main page ─────────────────────────────────────────────────────────────

export function AdminDebuggerPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const { actor } = useActor(createActor);

  const { data, isLoading, isError, isFetching } = useSystemHealth(refreshKey);

  // Track when data was last fetched
  React.useEffect(() => {
    if (data && !isFetching) setLastChecked(new Date());
  }, [data, isFetching]);

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  // ── Backup creation mutation ────────────────────────────────────────────────
  const createBackupMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const a = actor as any;
      const result = await a.createVersionBackup(
        true,
        "Manual backup from System Debugger",
      );
      if (result?.__kind__ === "err") throw new Error(result.err as string);
      return result;
    },
    onSuccess: () => {
      toast.success("Backup created successfully.");
      setRefreshKey((k) => k + 1); // refresh health status
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Backup failed.");
    },
  });

  // Derive cards from health data
  const cards = data
    ? buildCards(
        data,
        () => createBackupMutation.mutate(),
        createBackupMutation.isPending,
      )
    : null;
  const issueCount = cards
    ? cards.filter((c) => c.level !== "green").length
    : 0;

  return (
    <AdminLayout title="System Debugger" subtitle="Health Status">
      {/* Page header */}
      <div
        className="mb-6 rounded-xl bg-card neon-border-blue p-5 relative overflow-hidden"
        data-ocid="debugger-header"
      >
        <div className="absolute inset-0 retro-grid opacity-10 pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Left: title + timestamp */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-primary shrink-0" />
              <h2 className="font-display text-base font-bold tracking-wider text-foreground text-glow-blue uppercase">
                System Debugger
              </h2>
            </div>
            <p className="font-mono text-[11px] text-muted-foreground">
              {lastChecked
                ? `Last checked: ${lastChecked.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
                : "Not checked yet"}
            </p>
          </div>

          {/* Right: overall status + refresh */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            {cards && !isLoading && (
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
              onClick={handleRefresh}
              disabled={isLoading || isFetching}
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

      {/* Error state */}
      {isError && !isLoading && (
        <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/40 px-4 py-3 font-mono text-xs text-destructive">
          Failed to load system health. Check your connection and try
          refreshing.
        </div>
      )}

      {/* Cards grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        data-ocid="debugger-cards-grid"
      >
        {isLoading || !cards
          ? [
              "skel-0",
              "skel-1",
              "skel-2",
              "skel-3",
              "skel-4",
              "skel-5",
              "skel-6",
            ].map((k) => <DebugCardSkeleton key={k} />)
          : cards.map((card) => <DebugCard key={card.title} {...card} />)}
      </div>
    </AdminLayout>
  );
}

// ─── Card builder ─────────────────────────────────────────────────────────

function buildCards(
  h: SystemHealth,
  onCreateBackup: () => void,
  backupLoading: boolean,
): DebugCardProps[] {
  // ── STRIPE ──────────────────────────────────────────────────────────────
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
        label: "Last webhook",
        ok: !!h.stripe.lastWebhookAt && h.stripe.lastWebhookAt > BigInt(0),
        info:
          h.stripe.lastWebhookAt && h.stripe.lastWebhookAt > BigInt(0)
            ? formatTs(h.stripe.lastWebhookAt)
            : "Never received",
      },
    ],
    fixLabel: "Go to Payments Config",
    fixPath: "/admin/payments",
  };

  // ── GEMINI ──────────────────────────────────────────────────────────────
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
      {
        label: "Model",
        ok: true,
        info: "gemini-2.5-flash-lite",
      },
    ],
    fixLabel: "Go to OCR Settings",
    fixPath: "/admin/settings",
  };

  // ── DATABASE ─────────────────────────────────────────────────────────────
  const dbOk = h.database.canReadUsers && h.database.canReadConfig;
  const databaseCard: DebugCardProps = {
    icon: <Database className="w-4 h-4 text-primary" />,
    title: "Supabase Database",
    level: dbOk ? "green" : "red",
    details: [
      {
        label: "Read users table",
        ok: h.database.canReadUsers,
        info: h.database.canReadUsers ? "OK" : "Cannot read",
      },
      {
        label: "Read app_config table",
        ok: h.database.canReadConfig,
        info: h.database.canReadConfig ? "OK" : "Cannot read",
      },
    ],
  };

  // ── BACKUP ───────────────────────────────────────────────────────────────
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

  // ── MAINTENANCE ──────────────────────────────────────────────────────────
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

  // ── SIGNUPS ──────────────────────────────────────────────────────────────
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

  // ── PAYPAL ───────────────────────────────────────────────────────────────
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

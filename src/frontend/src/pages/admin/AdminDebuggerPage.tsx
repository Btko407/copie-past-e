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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorAny = any;

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

function formatCycles(cycles: bigint): string {
  const trillion = 1_000_000_000_000;
  const val = Number(cycles) / trillion;
  return `${val.toFixed(2)} trillion`;
}

function getCyclesLevel(cycles: bigint | null): StatusLevel {
  if (cycles === null) return "yellow";
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
  const { data: cyclesData, isLoading: cyclesLoading } =
    useCyclesBalance(refreshKey);

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
      const a = actor as ActorAny;
      const result = await a.createVersionBackup(
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

  // Build cycles card separately (it's data from a different query)
  const cyclesCard: DebugCardProps | null =
    !cyclesLoading && cyclesData !== undefined
      ? buildCyclesCard(cyclesData ?? null)
      : null;

  // All cards in display order: cycles first, then system health
  const allCards: DebugCardProps[] = [
    ...(cyclesCard ? [cyclesCard] : []),
    ...(cards ?? []),
  ];

  const issueCount = allCards.filter((c) => c.level !== "green").length;

  // Low cycles warning banner
  const showLowCyclesWarning =
    cyclesData !== null &&
    cyclesData !== undefined &&
    Number(cyclesData) < 1_000_000_000_000;

  const stillLoading = isLoading || cyclesLoading;

  return (
    <AdminLayout title="System Debugger" subtitle="Health Status">
      {/* Low cycles global warning banner */}
      {showLowCyclesWarning && (
        <div
          className="mb-4 rounded-lg bg-[#eab308]/10 border border-[#eab308]/40 px-4 py-3 flex items-start gap-3"
          data-ocid="debugger-low-cycles-banner"
        >
          <AlertTriangle className="w-4 h-4 text-[#eab308] shrink-0 mt-0.5" />
          <p className="font-mono text-xs text-[#eab308]">
            <span className="font-bold">Low cycles warning.</span> HTTPS
            outcalls (Stripe payments, OCR) will fail if cycles run out. Top up
            your canister using the IC dashboard or{" "}
            <code className="bg-[#eab308]/10 px-1 rounded text-[10px]">
              dfx canister deposit-cycles
            </code>
            .
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
              onClick={handleRefresh}
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
        {stillLoading || allCards.length === 0
          ? [
              "skel-0",
              "skel-1",
              "skel-2",
              "skel-3",
              "skel-4",
              "skel-5",
              "skel-6",
              "skel-7",
            ].map((k) => <DebugCardSkeleton key={k} />)
          : allCards.map((card) => <DebugCard key={card.title} {...card} />)}
      </div>
    </AdminLayout>
  );
}

// ─── Cycles card builder ──────────────────────────────────────────────────────

function buildCyclesCard(cycles: bigint | null): DebugCardProps {
  const level = getCyclesLevel(cycles);

  let cyclesInfo: string;
  let statusInfo: string;

  if (cycles === null) {
    cyclesInfo = "Unable to read balance";
    statusInfo =
      "Could not fetch cycles — actor may not expose this method yet";
  } else {
    cyclesInfo = formatCycles(cycles);
    if (level === "green") {
      statusInfo = "Sufficient cycles for HTTPS outcalls";
    } else if (level === "yellow") {
      statusInfo = "Low cycles — top up to prevent HTTPS outcall failures";
    } else {
      statusInfo = "Critical: Canister may stop functioning";
    }
  }

  return {
    icon: <Zap className="w-4 h-4 text-primary" />,
    title: "Canister Cycles",
    level,
    details: [
      {
        label: "Cycles balance",
        ok: level === "green",
        info: cyclesInfo,
      },
      {
        label: "Status",
        ok: level === "green",
        info: statusInfo,
      },
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

// ─── System health card builder ───────────────────────────────────────────────

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
        label: "Payment verification",
        ok: true,
        info: "Polling (ICP architecture — no webhooks)",
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

  // ── CANISTER DATABASE ─────────────────────────────────────────────────────
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

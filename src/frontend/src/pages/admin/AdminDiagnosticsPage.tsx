import { createActor } from "@/backend";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  HardDrive,
  Package,
  RefreshCw,
  Server,
  Shield,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorAny = any;

// ─── Status Indicator ─────────────────────────────────────────────────────────

type HealthLevel = "ok" | "warn" | "error" | "loading" | "unknown";

function HealthIcon({ level }: { level: HealthLevel }) {
  if (level === "ok")
    return <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />;
  if (level === "warn")
    return <AlertTriangle className="w-4 h-4 text-accent shrink-0" />;
  if (level === "error")
    return <XCircle className="w-4 h-4 text-destructive shrink-0" />;
  if (level === "loading")
    return (
      <RefreshCw className="w-3.5 h-3.5 animate-spin text-muted-foreground shrink-0" />
    );
  return (
    <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30 shrink-0" />
  );
}

function HealthBadge({ level, label }: { level: HealthLevel; label: string }) {
  const cls =
    level === "ok"
      ? "text-green-400 border-green-400/40 bg-green-400/5"
      : level === "warn"
        ? "text-accent border-accent/40 bg-accent/5"
        : level === "error"
          ? "text-destructive border-destructive/40 bg-destructive/5"
          : "text-muted-foreground border-border/30";
  return (
    <Badge
      variant="outline"
      className={`font-mono text-[10px] gap-1 shrink-0 ${cls}`}
    >
      <HealthIcon level={level} />
      {label}
    </Badge>
  );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────

function DiagSection({
  title,
  subtitle,
  icon: Icon,
  level,
  onRecheck,
  recheckLabel = "Recheck",
  loading = false,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  level: HealthLevel;
  onRecheck?: () => void;
  recheckLabel?: string;
  loading?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border/40 bg-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border/50 bg-card/80 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-display text-xs font-bold tracking-widest uppercase text-foreground">
              {title}
            </p>
            <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <HealthBadge
            level={level}
            label={
              level === "ok"
                ? "Healthy"
                : level === "warn"
                  ? "Warning"
                  : level === "error"
                    ? "Error"
                    : level === "loading"
                      ? "Checking…"
                      : "Unknown"
            }
          />
          {onRecheck && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRecheck}
              disabled={loading}
              className="font-mono text-[10px] h-7 px-2 gap-1"
            >
              <RefreshCw
                className={`w-3 h-3 ${loading ? "animate-spin" : ""}`}
              />
              {recheckLabel}
            </Button>
          )}
        </div>
      </div>
      <div className="p-5 space-y-2">{children}</div>
    </section>
  );
}

function DiagRow({
  label,
  value,
  level = "unknown",
  mono = true,
}: {
  label: string;
  value: string;
  level?: HealthLevel;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-secondary/10 border border-border/20 px-4 py-2.5">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground shrink-0">
        {label}
      </span>
      <div className="flex items-center gap-2 min-w-0">
        <HealthIcon level={level} />
        <span
          className={`${
            mono ? "font-mono" : "font-body"
          } text-xs text-foreground truncate`}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

// ─── Extension Health ─────────────────────────────────────────────────────────

function ExtensionHealthSection() {
  const { actor, isFetching } = useActor(createActor);
  const enabled = !!actor && !isFetching;
  const [zipChecked, setZipChecked] = useState(false);
  const [zipOk, setZipOk] = useState(false);
  const [zipChecking, setZipChecking] = useState(false);

  const {
    data: latestVersion,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["latestExtensionVersion"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      return (actor as ActorAny).getLatestExtensionVersion();
    },
    enabled,
  });

  const version = (latestVersion as ActorAny)?.latestVersion ?? "—";
  const buildNum = (latestVersion as ActorAny)?.buildNumber ?? "—";
  const downloadUrl =
    (latestVersion as ActorAny)?.downloadUrl ??
    `/copie-paste-extension-v${version}.zip`;
  const releasedAt = (latestVersion as ActorAny)?.releasedAt;
  const buildTime = releasedAt
    ? new Date(Number(releasedAt) / 1_000_000).toLocaleString()
    : "—";

  async function checkZip() {
    setZipChecking(true);
    try {
      const res = await fetch(downloadUrl, { method: "HEAD" });
      setZipOk(res.ok);
    } catch {
      setZipOk(false);
    } finally {
      setZipChecked(true);
      setZipChecking(false);
    }
  }

  const zipLevel: HealthLevel = zipChecking
    ? "loading"
    : !zipChecked
      ? "unknown"
      : zipOk
        ? "ok"
        : "error";

  const overallLevel: HealthLevel = isLoading
    ? "loading"
    : version === "—"
      ? "warn"
      : zipChecked && !zipOk
        ? "error"
        : "ok";

  return (
    <DiagSection
      title="Extension Health"
      subtitle="ZIP availability, manifest version, and last build"
      icon={Package}
      level={overallLevel}
      onRecheck={() => {
        void refetch();
        void checkZip();
      }}
      loading={isLoading || zipChecking}
    >
      {isLoading ? (
        <Skeleton className="h-8 w-full bg-primary/5" />
      ) : (
        <>
          <DiagRow label="Current Version" value={`v${version}`} level="ok" />
          <DiagRow label="Build #" value={`#${buildNum}`} level="ok" />
          <DiagRow label="Last Build" value={buildTime} level="ok" />
          <DiagRow label="Local ZIP" value={downloadUrl} level={zipLevel} />
          {!zipChecked && (
            <Button
              variant="outline"
              size="sm"
              onClick={checkZip}
              disabled={zipChecking}
              className="font-mono text-[10px] gap-1 mt-1"
            >
              <RefreshCw
                className={`w-3 h-3 ${zipChecking ? "animate-spin" : ""}`}
              />
              Check ZIP availability
            </Button>
          )}
        </>
      )}
    </DiagSection>
  );
}

// ─── Backend API Health ───────────────────────────────────────────────────────

function BackendHealthSection() {
  const { actor, isFetching } = useActor(createActor);
  const enabled = !!actor && !isFetching;

  const {
    data: health,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["healthStatus"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const a = actor as ActorAny;
      if (typeof a.getHealthStatus === "function") return a.getHealthStatus();
      return null;
    },
    enabled,
    staleTime: 0,
  });

  const h = health as ActorAny;
  const overallLevel: HealthLevel = isLoading
    ? "loading"
    : !h
      ? "warn"
      : h.status === "ok"
        ? "ok"
        : "warn";

  return (
    <DiagSection
      title="Backend API"
      subtitle="Canister health and backend.did freshness"
      icon={Server}
      level={overallLevel}
      onRecheck={() => void refetch()}
      loading={isLoading}
    >
      {isLoading ? (
        <Skeleton className="h-8 w-full bg-primary/5" />
      ) : !h ? (
        <DiagRow
          label="Health API"
          value="getHealthStatus not yet deployed — backend is reachable"
          level="warn"
        />
      ) : (
        <>
          <DiagRow
            label="Canister Status"
            value={String(h.status ?? "ok")}
            level={h.status === "ok" ? "ok" : "warn"}
          />
          <DiagRow
            label="Keys Configured"
            value={
              h.keysConfigured ? "Yes" : "Missing — check Stripe/Gemini config"
            }
            level={h.keysConfigured ? "ok" : "warn"}
          />
          <DiagRow
            label="Critical Keys Present"
            value={h.criticalKeysPresent ? "Yes" : "No"}
            level={h.criticalKeysPresent ? "ok" : "error"}
          />
        </>
      )}
    </DiagSection>
  );
}

// ─── Stripe Config Health ─────────────────────────────────────────────────────

function StripeHealthSection() {
  const { actor, isFetching } = useActor(createActor);
  const enabled = !!actor && !isFetching;

  const {
    data: stripeHealth,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["stripeHealthStatus"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      return (actor as ActorAny).getStripeHealthStatus();
    },
    enabled,
  });

  const sh = stripeHealth as ActorAny;
  const keysOk = sh?.keysConfigured ?? false;
  const hasPrices = sh?.status !== "no_price_ids" && sh?.status !== "keys_only";
  const overallLevel: HealthLevel = isLoading
    ? "loading"
    : !sh
      ? "warn"
      : !keysOk
        ? "error"
        : !hasPrices
          ? "warn"
          : "ok";

  const mode = sh?.isTestMode === false ? "live" : "test";

  return (
    <DiagSection
      title="Stripe Config"
      subtitle="Secret key, publishable key, and price IDs"
      icon={Shield}
      level={overallLevel}
      onRecheck={() => void refetch()}
      loading={isLoading}
    >
      {isLoading ? (
        <Skeleton className="h-24 w-full bg-primary/5" />
      ) : (
        <>
          <DiagRow
            label="Mode"
            value={mode.toUpperCase()}
            level={mode === "live" ? "ok" : "warn"}
          />
          <DiagRow
            label="Secret Key"
            value={
              keysOk ? "Configured ●●●●●●" : "Missing — payments will fail"
            }
            level={keysOk ? "ok" : "error"}
          />
          <DiagRow
            label="Publishable Key"
            value={keysOk ? "Configured" : "Missing"}
            level={keysOk ? "ok" : "error"}
          />
          <DiagRow
            label="Price IDs"
            value={
              hasPrices
                ? "Configured"
                : "Missing — subscription creation will fail"
            }
            level={hasPrices ? "ok" : "warn"}
          />
          <DiagRow
            label="Payment Verification"
            value="Polling (ICP architecture — no webhooks)"
            level="ok"
          />
          {sh?.lastCheckoutTestResult !== undefined && (
            <DiagRow
              label="Last Checkout Test"
              value={String(sh.lastCheckoutTestResult)}
              level={
                String(sh.lastCheckoutTestResult).toLowerCase().includes("ok")
                  ? "ok"
                  : "warn"
              }
            />
          )}
        </>
      )}
    </DiagSection>
  );
}

// ─── Gemini / OCR ─────────────────────────────────────────────────────────────

function GeminiHealthSection() {
  const { actor, isFetching } = useActor(createActor);
  const enabled = !!actor && !isFetching;

  const {
    data: geminiHealth,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["geminiHealthStatus"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const a = actor as ActorAny;
      if (typeof a.getGeminiHealthStatus === "function")
        return a.getGeminiHealthStatus();
      if (typeof a.getHealthStatus === "function") {
        const h = await a.getHealthStatus();
        return { apiKeyConfigured: h?.keysConfigured, lastTestResult: null };
      }
      return null;
    },
    enabled,
  });

  const gh = geminiHealth as ActorAny;
  const apiKeyOk = gh?.apiKeyConfigured ?? false;
  const overallLevel: HealthLevel = isLoading
    ? "loading"
    : !gh
      ? "warn"
      : apiKeyOk
        ? "ok"
        : "warn";

  return (
    <DiagSection
      title="Gemini / OCR"
      subtitle="API key configuration and last OCR test"
      icon={Zap}
      level={overallLevel}
      onRecheck={() => void refetch()}
      loading={isLoading}
    >
      {isLoading ? (
        <Skeleton className="h-8 w-full bg-primary/5" />
      ) : (
        <>
          <DiagRow
            label="API Key"
            value={
              apiKeyOk
                ? "Configured ●●●●●●"
                : "Not configured — Smart OCR disabled"
            }
            level={apiKeyOk ? "ok" : "warn"}
          />
          {gh?.lastTestResult !== undefined && gh?.lastTestResult !== null && (
            <DiagRow
              label="Last OCR Test"
              value={String(gh.lastTestResult)}
              level={
                String(gh.lastTestResult).toLowerCase().includes("ok")
                  ? "ok"
                  : "warn"
              }
            />
          )}
        </>
      )}
    </DiagSection>
  );
}

// ─── Backup Health ────────────────────────────────────────────────────────────

function BackupHealthSection() {
  const { actor, isFetching } = useActor(createActor);
  const enabled = !!actor && !isFetching;

  const {
    data: health,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["healthStatus"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const a = actor as ActorAny;
      if (typeof a.getHealthStatus === "function") return a.getHealthStatus();
      return null;
    },
    enabled,
    staleTime: 0,
  });

  const h = health as ActorAny;
  const backupCount = h ? Number(h.backupCount ?? 0) : 0;
  const lastBackupAt = h?.lastBackupAt
    ? (() => {
        const ms = Number(h.lastBackupAt) / 1_000_000;
        return ms > 0 ? new Date(ms).toLocaleString() : "No backups yet";
      })()
    : "—";
  const overallLevel: HealthLevel = isLoading
    ? "loading"
    : backupCount === 0
      ? "warn"
      : "ok";

  return (
    <DiagSection
      title="Backup Health"
      subtitle="Last backup timestamp, count, and pre-restore snapshot status"
      icon={HardDrive}
      level={overallLevel}
      onRecheck={() => void refetch()}
      loading={isLoading}
    >
      {isLoading ? (
        <Skeleton className="h-16 w-full bg-primary/5" />
      ) : (
        <>
          <DiagRow
            label="Last Backup"
            value={lastBackupAt}
            level={lastBackupAt === "No backups yet" ? "warn" : "ok"}
          />
          <DiagRow
            label="Stored Backups"
            value={`${backupCount} backup${backupCount !== 1 ? "s" : ""}`}
            level={backupCount > 0 ? "ok" : "warn"}
          />
          <DiagRow
            label="Pre-restore Snapshot"
            value="Auto-created before every restore (ICP architecture)"
            level="ok"
          />
        </>
      )}
    </DiagSection>
  );
}

// ─── Stable Memory Health ─────────────────────────────────────────────────────

function StableMemorySection() {
  const { actor, isFetching } = useActor(createActor);
  const enabled = !!actor && !isFetching;

  const {
    data: stats,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["adminSystemStats"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const a = actor as ActorAny;
      if (typeof a.adminGetSystemStats === "function")
        return a.adminGetSystemStats();
      return null;
    },
    enabled,
  });

  const s = stats as ActorAny;
  const overallLevel: HealthLevel = isLoading ? "loading" : s ? "ok" : "warn";

  return (
    <DiagSection
      title="Stable Memory"
      subtitle="Current data counts for master listings, users, and subscriptions"
      icon={Database}
      level={overallLevel}
      onRecheck={() => void refetch()}
      loading={isLoading}
    >
      {isLoading ? (
        <Skeleton className="h-20 w-full bg-primary/5" />
      ) : !s ? (
        <DiagRow
          label="System Stats"
          value="adminGetSystemStats not yet deployed"
          level="warn"
        />
      ) : (
        <>
          {s.totalMasterListings !== undefined && (
            <DiagRow
              label="Master Listings"
              value={String(s.totalMasterListings)}
              level="ok"
            />
          )}
          {s.totalUsers !== undefined && (
            <DiagRow
              label="Total Users"
              value={String(s.totalUsers)}
              level="ok"
            />
          )}
          {s.totalSubscriptions !== undefined && (
            <DiagRow
              label="Active Subscriptions"
              value={String(s.totalSubscriptions)}
              level="ok"
            />
          )}
          {s.totalListings !== undefined && (
            <DiagRow
              label="Legacy Listings"
              value={String(s.totalListings)}
              level="ok"
            />
          )}
          {s.cyclesBalance !== undefined && (
            <DiagRow
              label="Canister Cycles"
              value={`${(Number(s.cyclesBalance) / 1e12).toFixed(3)}T`}
              level={
                Number(s.cyclesBalance) < 1_000_000_000_000 ? "warn" : "ok"
              }
            />
          )}
        </>
      )}
    </DiagSection>
  );
}

// ─── Build / Deploy ───────────────────────────────────────────────────────────

function BuildDeploySection() {
  const { actor, isFetching } = useActor(createActor);
  const enabled = !!actor && !isFetching;

  const {
    data: latestVersion,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["latestExtensionVersion"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      return (actor as ActorAny).getLatestExtensionVersion();
    },
    enabled,
  });

  const v = latestVersion as ActorAny;
  const buildVersion = v?.latestVersion ?? "—";
  const deployTs = v?.releasedAt
    ? new Date(Number(v.releasedAt) / 1_000_000).toLocaleString()
    : "—";

  const overallLevel: HealthLevel = isLoading
    ? "loading"
    : buildVersion === "—"
      ? "warn"
      : "ok";

  return (
    <DiagSection
      title="Build / Deploy"
      subtitle="Latest deploy timestamp and published build version"
      icon={Server}
      level={overallLevel}
      onRecheck={() => void refetch()}
      loading={isLoading}
    >
      {isLoading ? (
        <Skeleton className="h-8 w-full bg-primary/5" />
      ) : (
        <>
          <DiagRow
            label="Build Version"
            value={`v${buildVersion}`}
            level="ok"
          />
          <DiagRow label="Last Deploy" value={deployTs} level="ok" />
          <DiagRow
            label="Backend Bindings"
            value="Generated from backend.did — re-run pnpm bindgen after schema changes"
            level="ok"
          />
        </>
      )}
    </DiagSection>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export function AdminDiagnosticsPage() {
  return (
    <AdminLayout title="Diagnostics" subtitle="System Health">
      <div className="max-w-3xl space-y-8" data-ocid="admin-diagnostics-page">
        <div>
          <p className="font-display text-xs font-bold tracking-widest uppercase text-foreground">
            System Health Dashboard
          </p>
          <p className="font-mono text-[10px] text-muted-foreground mt-1">
            Real-time health checks for extension, backend, payments, OCR,
            backup, and stable memory. Each section shows green when fully
            configured, yellow when partially configured, red when missing or
            broken.
          </p>
        </div>

        <ExtensionHealthSection />
        <BackendHealthSection />
        <StripeHealthSection />
        <GeminiHealthSection />
        <BackupHealthSection />
        <StableMemorySection />
        <BuildDeploySection />
      </div>
    </AdminLayout>
  );
}

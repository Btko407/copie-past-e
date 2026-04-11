import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateVersion,
  useListVersionHistory,
  useRevertToVersion,
  useRollbackToVersion,
} from "@/hooks/useAdminVersions";
import {
  useCreateVersionSnapshot,
  useExportBackupAsJson,
  useMarkBackupStable,
  useRestoreFromBackup,
  useVersionSnapshotList,
} from "@/hooks/useBackupDashboard";
import { AdminBackupDashboard } from "@/pages/admin/AdminBackupDashboard";
import type {
  AppVersion,
  RestoreResult,
  SiteSettings,
  VersionBackupSummary,
} from "@/types";
import {
  Archive,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Database,
  FileJson,
  History,
  Plus,
  RefreshCw,
  Shield,
  Star,
  Upload,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function formatDate(ts: bigint | number | string) {
  const num = typeof ts === "bigint" ? Number(ts) / 1_000_000 : Number(ts);
  return new Date(num).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function shortId(id: string) {
  return id.slice(0, 8);
}

// shortId is exported for use in sub-components
export { shortId };

function shortPrincipal(p: { toString(): string }) {
  const s = p.toString();
  return `${s.slice(0, 8)}…${s.slice(-4)}`;
}

function ColorSwatch({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
      <span
        className="w-3 h-3 rounded-sm border border-border/50 inline-block shrink-0"
        style={{ background: color }}
      />
      {label}
    </span>
  );
}

function VersionSnapshot({ settings }: { settings: SiteSettings }) {
  return (
    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-3 rounded-lg bg-secondary/20 border border-border/40">
      <div>
        <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-1">
          App Name
        </p>
        <p className="font-mono text-xs text-foreground truncate">
          {settings.appName}
        </p>
      </div>
      <div>
        <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-1.5">
          Colors
        </p>
        <div className="flex flex-col gap-1">
          <ColorSwatch color={settings.primaryColor} label="Primary" />
          <ColorSwatch color={settings.accentColor} label="Accent" />
        </div>
      </div>
      <div>
        <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-1.5">
          Features
        </p>
        <div className="flex flex-wrap gap-1">
          <span
            className={[
              "font-mono text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5",
              settings.uploadEnabled
                ? "bg-primary/10 text-primary"
                : "bg-muted/30 text-muted-foreground line-through",
            ].join(" ")}
          >
            <Upload className="w-2 h-2" />
            Upload
          </span>
          <span
            className={[
              "font-mono text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5",
              settings.copyButtonsEnabled
                ? "bg-primary/10 text-primary"
                : "bg-muted/30 text-muted-foreground line-through",
            ].join(" ")}
          >
            <Copy className="w-2 h-2" />
            Copy
          </span>
          <span
            className={[
              "font-mono text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5",
              settings.contentModerationEnabled
                ? "bg-accent/10 text-accent"
                : "bg-muted/30 text-muted-foreground line-through",
            ].join(" ")}
          >
            <Shield className="w-2 h-2" />
            Moderation
          </span>
        </div>
      </div>
      <div>
        <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-1">
          Rate Limits
        </p>
        <p className="font-mono text-[10px] text-muted-foreground">
          {settings.maxRequestsPerMinute?.toString()}/min ·{" "}
          {settings.maxUploadsPerHour?.toString()}/hr
        </p>
      </div>
      <div>
        <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-1">
          Session
        </p>
        <p className="font-mono text-[10px] text-muted-foreground">
          {settings.maxSessionDurationMinutes?.toString()} min ·{" "}
          {settings.maxConcurrentSessions?.toString()} concurrent
        </p>
      </div>
      <div>
        <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-1">
          Origins
        </p>
        <p className="font-mono text-[10px] text-muted-foreground truncate">
          {settings.allowedOrigins || "*"}
        </p>
      </div>
    </div>
  );
}

type SettingsKey = keyof SiteSettings;
const DIFF_KEYS: SettingsKey[] = [
  "appName",
  "primaryColor",
  "accentColor",
  "uploadEnabled",
  "copyButtonsEnabled",
  "contentModerationEnabled",
  "maxRequestsPerMinute",
  "maxUploadsPerHour",
  "maxSessionDurationMinutes",
  "maxConcurrentSessions",
  "allowedOrigins",
];

function VersionDiff({
  current,
  previous,
}: {
  current: SiteSettings;
  previous: SiteSettings;
}) {
  const changed = DIFF_KEYS.filter((k) => {
    const a = current[k];
    const b = previous[k];
    return typeof a === "bigint" || typeof b === "bigint"
      ? a?.toString() !== b?.toString()
      : a !== b;
  });

  if (changed.length === 0) {
    return (
      <p className="font-mono text-[10px] text-muted-foreground mt-2 px-3">
        No configuration changes vs previous version.
      </p>
    );
  }

  return (
    <div className="mt-2 space-y-1 px-3">
      <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-2">
        Changed fields vs previous
      </p>
      {changed.map((k) => (
        <div
          key={k as string}
          className="grid grid-cols-3 gap-2 text-[10px] font-mono py-1 border-b border-border/30"
        >
          <span className="text-muted-foreground truncate">{k as string}</span>
          <span className="text-destructive line-through truncate">
            {previous[k]?.toString() ?? "—"}
          </span>
          <span className="text-primary truncate">
            {current[k]?.toString() ?? "—"}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Version Snapshot Dashboard (data snapshots) ──────────────────────────────

function snapshotFreshness(backups: VersionBackupSummary[]) {
  const last = backups[0];
  const lastTs = last ? Number(last.createdAt) / 1_000_000 : null;
  const hoursSince = lastTs
    ? (Date.now() - lastTs) / (1000 * 60 * 60)
    : Number.POSITIVE_INFINITY;
  return {
    dotColor:
      hoursSince < 24
        ? "bg-green-500"
        : hoursSince < 48
          ? "bg-amber-400"
          : "bg-destructive",
    hoursSince,
    lastTs,
    lastBackup: last,
  };
}

function SnapshotTypeBadge({ type }: { type: string }) {
  const isManual = type.includes("manual");
  const isPreDeploy = type.includes("pre-deploy");
  const label = isManual ? "Manual" : isPreDeploy ? "Pre-Deploy" : "Auto";
  return (
    <Badge
      variant="outline"
      className={[
        "font-mono text-[9px] uppercase tracking-widest",
        isManual
          ? "border-accent/40 text-accent bg-accent/5"
          : isPreDeploy
            ? "border-primary/40 text-primary bg-primary/5"
            : "border-border/40 text-muted-foreground bg-muted/5",
      ].join(" ")}
    >
      {label}
    </Badge>
  );
}

function DataSnapshotDashboard() {
  const { data: snapshots = [], isLoading } = useVersionSnapshotList();
  const createSnapshot = useCreateVersionSnapshot();
  const restore = useRestoreFromBackup();
  const markStable = useMarkBackupStable();
  const exportJson = useExportBackupAsJson();

  const [restoreTarget, setRestoreTarget] =
    useState<VersionBackupSummary | null>(null);
  const [restoreResult, setRestoreResult] = useState<RestoreResult | null>(
    null,
  );

  const { dotColor, lastBackup } = snapshotFreshness(snapshots);
  const totalSizeKb = snapshots.reduce(
    (acc, b) => acc + Number(b.sizeKb ?? 0),
    0,
  );

  async function handleCreate() {
    try {
      await createSnapshot.mutateAsync({ notes: "Manual version snapshot" });
      toast.success("Version snapshot created", {
        icon: <CheckCircle2 className="w-4 h-4 text-primary" />,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Snapshot failed.");
    }
  }

  async function handleRestore() {
    if (!restoreTarget) return;
    try {
      const result = await restore.mutateAsync(restoreTarget.id);
      if (result.success) {
        setRestoreResult(result);
        setRestoreTarget(null);
        toast.success("Restore complete!");
      } else {
        toast.error(result.errorMessage || "Restore failed.");
        setRestoreTarget(null);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Restore failed.");
      setRestoreTarget(null);
    }
  }

  async function handleToggleStable(snapshot: VersionBackupSummary) {
    try {
      await markStable.mutateAsync(snapshot.id);
      toast.success(
        snapshot.isStable ? "Stable mark removed." : "Marked as stable.",
      );
    } catch {
      toast.error("Could not update stable status.");
    }
  }

  return (
    <div className="space-y-4">
      {/* Status bar */}
      {!isLoading && (
        <div className="flex items-center gap-3 flex-wrap px-4 py-3 rounded-lg bg-secondary/20 border border-border/40">
          <span
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColor}`}
            aria-hidden="true"
          />
          <span className="font-mono text-xs text-foreground">
            Last snapshot:{" "}
            <span className="text-primary">
              {lastBackup
                ? new Date(
                    Number(lastBackup.createdAt) / 1_000_000,
                  ).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Never"}
            </span>
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">|</span>
          <span className="font-mono text-xs text-foreground">
            <span className="text-primary">{snapshots.length}</span> snapshots
            stored
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">|</span>
          <span className="font-mono text-xs text-foreground">
            <span className="text-primary">
              {(totalSizeKb / 1024).toFixed(1)}
            </span>{" "}
            MB used
          </span>
        </div>
      )}

      {/* Create button */}
      <Button
        size="sm"
        onClick={handleCreate}
        disabled={createSnapshot.isPending}
        className="font-mono text-xs gap-1.5 neon-border-blue glow-blue-sm"
        data-ocid="create-version-snapshot-btn"
      >
        <Plus className="w-3 h-3" />
        {createSnapshot.isPending ? "Creating…" : "Create Version Snapshot Now"}
      </Button>

      {/* Snapshot table */}
      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-12 rounded-lg" />
          ))}
        </div>
      ) : snapshots.length === 0 ? (
        <div
          className="rounded-xl bg-card neon-border-blue p-10 text-center"
          data-ocid="version-snapshots-empty-state"
        >
          <Archive className="w-7 h-7 text-muted-foreground/40 mx-auto mb-3" />
          <p className="font-display text-xs text-muted-foreground uppercase tracking-widest">
            No version snapshots yet
          </p>
          <p className="font-mono text-[10px] text-muted-foreground/60 mt-1">
            Snapshots are created automatically before each version change.
            Create one manually above.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-card neon-border-blue">
          <table className="w-full min-w-[680px] text-left">
            <thead>
              <tr className="border-b border-border/40">
                {[
                  "ID",
                  "Type",
                  "Created",
                  "Version",
                  "Users",
                  "Listings",
                  "Size",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest px-3 py-3 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {snapshots.map((snap) => (
                <tr
                  key={snap.id}
                  className="border-b border-border/20 hover:bg-secondary/10 transition-smooth"
                  data-ocid="version-snapshot-row"
                >
                  <td className="px-3 py-2.5">
                    <span className="font-mono text-[11px] text-muted-foreground bg-secondary/30 px-1.5 py-0.5 rounded">
                      {snap.id.slice(0, 8)}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <SnapshotTypeBadge type={snap.backupType ?? ""} />
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap font-mono text-[11px] text-foreground">
                    {new Date(
                      Number(snap.createdAt) / 1_000_000,
                    ).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="font-mono text-xs text-primary">
                      {snap.versionLabel || "—"}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="font-mono text-xs tabular-nums flex items-center gap-1">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      {snap.userCount?.toString() ?? "—"}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="font-mono text-xs tabular-nums flex items-center gap-1">
                      <Archive className="w-3 h-3 text-muted-foreground" />
                      {snap.listingCount?.toString() ?? "—"}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                    {snap.sizeKb ? `${snap.sizeKb.toString()} KB` : "—"}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Stable star */}
                      <button
                        type="button"
                        onClick={() => handleToggleStable(snap)}
                        aria-label={
                          snap.isStable ? "Unmark stable" : "Mark as stable"
                        }
                        className="p-1 rounded hover:bg-accent/10 transition-colors"
                        data-ocid={`snap-stable-toggle-${snap.id}`}
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${snap.isStable ? "fill-accent text-accent" : "text-muted-foreground"}`}
                        />
                      </button>
                      {/* Restore */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRestoreTarget(snap)}
                        disabled={restore.isPending}
                        className="font-mono text-[10px] h-7 border-accent/40 text-accent hover:bg-accent/10 whitespace-nowrap"
                        data-ocid={`snap-restore-btn-${snap.id}`}
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Restore
                      </Button>
                      {/* Download JSON */}
                      <button
                        type="button"
                        onClick={() => exportJson.mutateAsync(snap)}
                        aria-label="Download as JSON"
                        className="p-1.5 rounded border border-border/40 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                        data-ocid={`snap-download-${snap.id}`}
                      >
                        <FileJson className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Restore confirm */}
      <AlertDialog
        open={!!restoreTarget}
        onOpenChange={(open) => !open && setRestoreTarget(null)}
      >
        <AlertDialogContent className="bg-card border-accent/30 font-body">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-sm uppercase tracking-wider text-accent text-glow-yellow">
              Restore from version snapshot?
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="font-mono text-xs text-muted-foreground leading-relaxed space-y-3">
                <p>
                  Restore snapshot{" "}
                  <span className="font-bold text-foreground bg-secondary/40 px-1.5 py-0.5 rounded">
                    {restoreTarget ? restoreTarget.id.slice(0, 8) : ""}
                  </span>{" "}
                  — this will restore{" "}
                  <span className="text-primary font-bold">
                    {restoreTarget?.userCount?.toString() ?? "0"} user accounts
                  </span>{" "}
                  and{" "}
                  <span className="text-primary font-bold">
                    {restoreTarget?.listingCount?.toString() ?? "0"} listings
                  </span>
                  .
                </p>
                <p className="text-primary/80">
                  Current state will be auto-saved as a new backup first.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono text-xs">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleRestore();
              }}
              disabled={restore.isPending}
              className="font-mono text-xs bg-accent text-accent-foreground hover:bg-accent/80"
              data-ocid="confirm-snap-restore-btn"
            >
              <RefreshCw className="w-3 h-3 mr-1.5" />
              {restore.isPending ? "Restoring…" : "Restore — I Understand"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Restore success */}
      <AlertDialog
        open={!!restoreResult}
        onOpenChange={(open) => !open && setRestoreResult(null)}
      >
        <AlertDialogContent className="bg-card border-primary/30 font-body">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-sm uppercase tracking-wider text-primary text-glow-blue flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Restore Complete
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="font-mono text-xs text-muted-foreground space-y-2">
                <p>
                  <span className="text-primary font-bold">
                    {restoreResult?.usersRestored?.toString() ?? "0"} users
                  </span>{" "}
                  and{" "}
                  <span className="text-primary font-bold">
                    {restoreResult?.listingsRestored?.toString() ?? "0"}{" "}
                    listings
                  </span>{" "}
                  restored.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              className="font-mono text-xs"
              onClick={() => setRestoreResult(null)}
            >
              Done
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AdminVersionsPage() {
  const { data: versions = [], isLoading } = useListVersionHistory();
  const createVersion = useCreateVersion();
  const rollback = useRollbackToVersion();
  const revert = useRevertToVersion();

  const [activeTab, setActiveTab] = useState<"snapshots" | "backups">(
    "snapshots",
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [revertTarget, setRevertTarget] = useState<AppVersion | null>(null);
  const [expandedId, setExpandedId] = useState<bigint | null>(null);

  function getAutoLabel() {
    if (versions.length === 0) return "v1.0";
    const labels = versions
      .map((v) => v.versionLabel)
      .filter((l) => /^v\d+\.\d+$/.test(l));
    if (labels.length === 0) return `v${String(versions.length + 1)}.0`;
    const nums = labels
      .map((l) => Number.parseFloat(l.replace("v", "")))
      .sort((a, b) => b - a);
    const latest = nums[0];
    const minor = Math.round((latest % 1) * 10) + 1;
    const major = Math.floor(latest);
    return `v${String(major)}.${String(minor)}`;
  }

  function openCreateModal() {
    setNewLabel(getAutoLabel());
    setNewDesc("");
    setCreateOpen(true);
  }

  async function handleCreate() {
    if (!newLabel.trim()) return;
    try {
      await createVersion.mutateAsync({
        versionLabel: newLabel.trim(),
        description: newDesc.trim(),
      });
      toast.success("Version created", {
        description: `Snapshot ${newLabel} saved.`,
        icon: <CheckCircle2 className="w-4 h-4 text-primary" />,
      });
      setCreateOpen(false);
    } catch {
      toast.error("Failed to create version snapshot.");
    }
  }

  async function handleRevert() {
    if (!revertTarget) return;
    const versionNumber = versions.length - versions.indexOf(revertTarget);
    try {
      const result = await revert.mutateAsync({
        versionId: revertTarget.id,
        versionNumber,
        versionLabel: revertTarget.versionLabel,
      });
      toast.success(`Reverted to ${revertTarget.versionLabel}`, {
        description: `Current settings saved as ${result.newSnapshotLabel}. Configuration restored.`,
        icon: <RefreshCw className="w-4 h-4 text-accent" />,
      });
      setRevertTarget(null);
    } catch {
      try {
        await rollback.mutateAsync(revertTarget.id);
        toast.success("Rollback complete", {
          description: `Configuration restored to ${revertTarget.versionLabel}.`,
          icon: <RefreshCw className="w-4 h-4 text-accent" />,
        });
        setRevertTarget(null);
      } catch {
        toast.error("Revert failed", {
          description: "Could not restore version.",
        });
      }
    }
  }

  function toggleExpand(id: bigint) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  const isReverting = revert.isPending || rollback.isPending;

  return (
    <AdminLayout title="Versions" subtitle="History & Rollback">
      {/* ── Tab Navigation ── */}
      <div className="flex gap-1 mb-6 bg-secondary/20 p-1 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("snapshots")}
          className={[
            "flex items-center gap-1.5 px-4 py-2 rounded-md font-mono text-xs font-medium transition-smooth",
            activeTab === "snapshots"
              ? "bg-card text-primary shadow-sm neon-border-blue"
              : "text-muted-foreground hover:text-foreground",
          ].join(" ")}
          data-ocid="tab-version-snapshots"
        >
          <History className="w-3.5 h-3.5" />
          Version Snapshots
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("backups")}
          className={[
            "flex items-center gap-1.5 px-4 py-2 rounded-md font-mono text-xs font-medium transition-smooth",
            activeTab === "backups"
              ? "bg-card text-primary shadow-sm neon-border-blue"
              : "text-muted-foreground hover:text-foreground",
          ].join(" ")}
          data-ocid="tab-data-backups"
        >
          <Database className="w-3.5 h-3.5" />
          Data Backups
        </button>
      </div>

      {activeTab === "backups" ? (
        <AdminBackupDashboard />
      ) : (
        <>
          {/* ── Section A: Version Snapshots ── */}
          <div className="mb-2">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center glow-blue-sm">
                <History className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold tracking-wider uppercase text-foreground">
                  Section A — Version Snapshots
                </h3>
                <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                  App configuration snapshots
                </p>
              </div>
            </div>
          </div>

          {/* Header row */}
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-sm font-bold tracking-wider uppercase text-foreground">
                Version History
              </h2>
              {!isLoading && (
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] text-primary border-primary/50 bg-primary/5"
                >
                  <History className="w-2.5 h-2.5 mr-1" />
                  {versions.length} snapshots
                </Badge>
              )}
            </div>
            <Button
              size="sm"
              onClick={openCreateModal}
              className="font-mono text-xs gap-1.5 neon-border-blue glow-blue-sm"
              data-ocid="create-version-btn"
            >
              <Plus className="w-3 h-3" />
              Create Snapshot
            </Button>
          </div>

          {/* Version List */}
          {isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : versions.length === 0 ? (
            <div
              className="rounded-xl bg-card neon-border-blue p-12 text-center"
              data-ocid="versions-empty-state"
            >
              <Clock className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
              <p className="font-display text-xs text-muted-foreground uppercase tracking-widest">
                No snapshots yet
              </p>
              <p className="font-mono text-[10px] text-muted-foreground/60 mt-1">
                Create your first version snapshot to enable rollback
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {versions.map((version, index) => {
                const isExpanded = expandedId === version.id;
                const prevVersion = versions[index + 1];
                const isLatest = index === 0;
                const versionNum = versions.length - index;

                return (
                  <div
                    key={version.id.toString()}
                    className={[
                      "rounded-xl bg-card overflow-hidden transition-smooth",
                      version.isRollback
                        ? "neon-border-yellow"
                        : "neon-border-blue",
                    ].join(" ")}
                    data-ocid="version-card"
                  >
                    <button
                      type="button"
                      className="flex items-start gap-3 px-5 py-4 cursor-pointer hover:bg-secondary/20 transition-smooth w-full text-left"
                      onClick={() => toggleExpand(version.id)}
                    >
                      <div className="shrink-0 mt-0.5">
                        {version.isRollback ? (
                          <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center glow-yellow-sm">
                            <RefreshCw className="w-3.5 h-3.5 text-accent" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center glow-blue-sm">
                            <Zap className="w-3.5 h-3.5 text-primary" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={[
                              "font-display text-sm font-bold tracking-wider",
                              version.isRollback
                                ? "text-accent text-glow-yellow"
                                : "text-primary text-glow-blue",
                            ].join(" ")}
                          >
                            {version.versionLabel}
                          </span>
                          {version.isRollback && (
                            <Badge
                              variant="outline"
                              className="font-mono text-[9px] text-accent border-accent/40 bg-accent/5 uppercase tracking-widest"
                            >
                              Rollback
                            </Badge>
                          )}
                          {isLatest && (
                            <Badge
                              variant="outline"
                              className="font-mono text-[9px] text-primary border-primary/40 bg-primary/5 uppercase tracking-widest"
                            >
                              Latest
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="font-mono text-[10px] text-muted-foreground">
                            <Clock className="w-2.5 h-2.5 inline mr-1 mb-0.5" />
                            {formatDate(version.createdAt)}
                          </span>
                          <span className="font-mono text-[10px] text-muted-foreground">
                            By {shortPrincipal(version.createdBy)}
                          </span>
                          {version.description && (
                            <span className="font-mono text-[10px] text-muted-foreground/70 truncate max-w-xs">
                              &ldquo;{version.description}&rdquo;
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {!isLatest && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setRevertTarget(version);
                            }}
                            className="font-mono text-[10px] h-7 border-accent/40 text-accent hover:bg-accent/10 gap-1 whitespace-nowrap"
                            data-ocid={`revert-btn-${version.id.toString()}`}
                          >
                            <RefreshCw className="w-3 h-3" />
                            Revert to V{versionNum}
                          </Button>
                        )}
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="border-t border-border/30 px-5 py-4 bg-secondary/10">
                        <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-1">
                          Configuration Snapshot
                        </p>
                        <VersionSnapshot settings={version.settingsSnapshot} />

                        {prevVersion && (
                          <div className="mt-3">
                            <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-1">
                              Changes vs {prevVersion.versionLabel}
                            </p>
                            <VersionDiff
                              current={version.settingsSnapshot}
                              previous={prevVersion.settingsSnapshot}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Section B: Data Snapshots (full-state backups for version revert) ── */}
          <div className="mt-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center glow-yellow-sm">
                <Database className="w-3.5 h-3.5 text-accent" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold tracking-wider uppercase text-foreground">
                  Section B — Data Snapshots
                </h3>
                <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                  Full-state backups for safe version rollback — restore users,
                  listings, and config to any saved point
                </p>
              </div>
            </div>
            <DataSnapshotDashboard />
          </div>
        </>
      )}

      {/* Create Version Modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="bg-card border-primary/30 font-body sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-sm uppercase tracking-wider text-primary text-glow-blue">
              Create Version Snapshot
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label
                htmlFor="versionLabel"
                className="font-mono text-xs text-foreground tracking-wide"
              >
                Version Label
              </Label>
              <Input
                id="versionLabel"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="mt-2 font-mono text-sm bg-secondary/30 border-primary/30 focus:border-primary/60"
                placeholder="v1.0"
                data-ocid="version-label-input"
              />
            </div>
            <div>
              <Label
                htmlFor="versionDesc"
                className="font-mono text-xs text-foreground tracking-wide"
              >
                Description{" "}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="versionDesc"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="mt-2 font-mono text-xs bg-secondary/30 border-primary/30 focus:border-primary/60 resize-none"
                placeholder="What changed in this version…"
                rows={3}
                data-ocid="version-desc-input"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCreateOpen(false)}
                className="font-mono text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCreate}
                disabled={!newLabel.trim() || createVersion.isPending}
                className="font-mono text-xs gap-1.5 neon-border-blue glow-blue-sm"
                data-ocid="confirm-create-version-btn"
              >
                <Plus className="w-3 h-3" />
                {createVersion.isPending ? "Creating…" : "Create Snapshot"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Revert Confirm Dialog */}
      <AlertDialog
        open={!!revertTarget}
        onOpenChange={(open) => !open && setRevertTarget(null)}
      >
        <AlertDialogContent className="bg-card border-accent/30 font-body">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-sm uppercase tracking-wider text-accent text-glow-yellow">
              Revert to {revertTarget?.versionLabel}?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-xs text-muted-foreground leading-relaxed">
              Your current settings will be{" "}
              <span className="text-primary font-bold">
                auto-saved as a new snapshot
              </span>{" "}
              first, then{" "}
              <span className="text-foreground font-bold">
                {revertTarget?.versionLabel}
              </span>{" "}
              settings will be restored.
              <br />
              <br />
              <span className="text-primary font-bold">
                User data and listings will NOT be affected.
              </span>{" "}
              Only app configuration will be restored.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono text-xs">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevert}
              disabled={isReverting}
              className="font-mono text-xs bg-accent text-accent-foreground hover:bg-accent/80"
              data-ocid="confirm-revert-btn"
            >
              <RefreshCw className="w-3 h-3 mr-1.5" />
              {isReverting
                ? "Reverting…"
                : `Revert to ${revertTarget?.versionLabel ?? ""}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}

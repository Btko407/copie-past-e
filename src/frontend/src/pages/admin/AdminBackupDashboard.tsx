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
import { Skeleton } from "@/components/ui/skeleton";
import {
  useBackupList,
  useCreateManualBackup,
  useDeleteBackup,
  useExportBackupAsJson,
  useMarkBackupStable,
  useRestoreFromBackup,
  useRollbackToStable,
} from "@/hooks/useBackupDashboard";
import type { RestoreResult, VersionBackupSummary } from "@/types";
import {
  AlertTriangle,
  Archive,
  CheckCircle2,
  Clock,
  Database,
  Download,
  FileJson,
  Plus,
  RefreshCw,
  RotateCcw,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

function formatDate(ts: bigint | number) {
  const ms = typeof ts === "bigint" ? Number(ts) / 1_000_000 : Number(ts);
  if (!ms) return "—";
  return new Date(ms).toLocaleString("en-US", {
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

function BackupStatusBar({
  backups,
}: {
  backups: VersionBackupSummary[];
}) {
  const lastBackup = backups[0];
  const lastTs = lastBackup ? Number(lastBackup.createdAt) / 1_000_000 : null;
  const hoursSince = lastTs
    ? (Date.now() - lastTs) / (1000 * 60 * 60)
    : Number.POSITIVE_INFINITY;

  const dotColor =
    hoursSince < 24
      ? "bg-green-500"
      : hoursSince < 48
        ? "bg-amber-400"
        : "bg-destructive";

  const totalSizeKb = backups.reduce(
    (acc, b) => acc + Number(b.sizeKb ?? 0),
    0,
  );

  return (
    <div className="flex items-center gap-3 flex-wrap px-4 py-3 rounded-lg bg-secondary/20 border border-border/40 mb-4">
      <span
        className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColor}`}
        aria-hidden="true"
      />
      <span className="font-mono text-xs text-foreground">
        Last backup:{" "}
        <span className="text-primary">
          {lastBackup ? formatDate(lastBackup.createdAt) : "Never"}
        </span>
      </span>
      <span className="font-mono text-[10px] text-muted-foreground">|</span>
      <span className="font-mono text-xs text-foreground">
        <span className="text-primary">{backups.length}</span> backups stored
      </span>
      <span className="font-mono text-[10px] text-muted-foreground">|</span>
      <span className="font-mono text-xs text-foreground">
        <span className="text-primary">{(totalSizeKb / 1024).toFixed(1)}</span>{" "}
        MB used
      </span>
    </div>
  );
}

function BackupTypeBadge({ type }: { type: string }) {
  const isManual = type === "manual";
  return (
    <Badge
      variant="outline"
      className={[
        "font-mono text-[9px] uppercase tracking-widest",
        isManual
          ? "border-accent/40 text-accent bg-accent/5"
          : "border-primary/40 text-primary bg-primary/5",
      ].join(" ")}
    >
      {isManual ? "Manual" : "Auto"}
    </Badge>
  );
}

export function AdminBackupDashboard() {
  const { data: backups = [], isLoading } = useBackupList();
  const createManual = useCreateManualBackup();
  const restore = useRestoreFromBackup();
  const markStable = useMarkBackupStable();
  const deleteBackup = useDeleteBackup();
  const rollbackStable = useRollbackToStable();
  const exportJson = useExportBackupAsJson();

  const [restoreTarget, setRestoreTarget] =
    useState<VersionBackupSummary | null>(null);
  const [restoreResult, setRestoreResult] = useState<RestoreResult | null>(
    null,
  );
  const [rollbackConfirm, setRollbackConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<VersionBackupSummary | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasStable = backups.some((b) => b.isStable);

  async function handleCreateManualBackup() {
    try {
      await createManual.mutateAsync({});
      toast.success("Manual backup created", {
        icon: <CheckCircle2 className="w-4 h-4 text-primary" />,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Backup failed.");
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
        toast.error(result.errorMessage || result.message || "Restore failed.");
        setRestoreTarget(null);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Restore failed.");
      setRestoreTarget(null);
    }
  }

  async function handleRollbackStable() {
    try {
      const result = await rollbackStable.mutateAsync();
      setRollbackConfirm(false);
      if (result.success) {
        toast.success("Rolled back to last stable backup!");
      } else {
        toast.error(
          result.errorMessage || result.message || "Rollback failed.",
        );
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Rollback failed.");
      setRollbackConfirm(false);
    }
  }

  async function handleToggleStable(backup: VersionBackupSummary) {
    try {
      await markStable.mutateAsync(backup.id);
      toast.success(
        backup.isStable ? "Stable mark removed." : "Marked as stable.",
      );
    } catch {
      toast.error("Could not update stable status.");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteBackup.mutateAsync(deleteTarget.id);
      toast.success("Backup deleted.");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed.");
      setDeleteTarget(null);
    }
  }

  function handleExportAllBackups() {
    const json = JSON.stringify(backups, (_k, v) =>
      typeof v === "bigint" ? v.toString() : v,
    );
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `all-backups-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    toast.info(
      `Import file "${file.name}" selected. Restore via the button below.`,
    );
  }

  return (
    <div className="space-y-6">
      {/* Status bar */}
      {!isLoading && <BackupStatusBar backups={backups} />}

      {/* Action buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          size="sm"
          onClick={handleCreateManualBackup}
          disabled={createManual.isPending}
          className="font-mono text-xs gap-1.5 neon-border-blue glow-blue-sm"
          data-ocid="create-manual-backup-btn"
        >
          <Plus className="w-3 h-3" />
          {createManual.isPending ? "Creating…" : "Create Manual Backup Now"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportAllBackups}
          disabled={backups.length === 0}
          className="font-mono text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
          data-ocid="export-all-backups-btn"
        >
          <Download className="w-3 h-3" />
          Export All as .json
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="font-mono text-xs gap-1.5 border-border/40"
          data-ocid="import-backup-file-btn"
        >
          <Archive className="w-3 h-3" />
          Import Backup File
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.zip"
          className="hidden"
          onChange={handleImportFile}
        />
        {hasStable && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRollbackConfirm(true)}
            disabled={rollbackStable.isPending}
            className="font-mono text-xs gap-1.5 border-accent/40 text-accent hover:bg-accent/10 ml-auto"
            data-ocid="rollback-stable-btn"
          >
            <RotateCcw className="w-3 h-3" />
            Rollback to Last Stable Version
          </Button>
        )}
      </div>

      {/* Backup list */}
      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-12 rounded-lg" />
          ))}
        </div>
      ) : backups.length === 0 ? (
        <div
          className="rounded-xl bg-card neon-border-blue p-10 text-center"
          data-ocid="backups-empty-state"
        >
          <Database className="w-7 h-7 text-muted-foreground/40 mx-auto mb-3" />
          <p className="font-display text-xs text-muted-foreground uppercase tracking-widest">
            No backups yet
          </p>
          <p className="font-mono text-[10px] text-muted-foreground/60 mt-1">
            Create a manual backup or wait for an automatic backup to appear.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-card neon-border-blue">
          <table className="w-full min-w-[700px] text-left">
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
              {backups.map((backup) => (
                <tr
                  key={backup.id}
                  className="border-b border-border/20 hover:bg-secondary/10 transition-smooth"
                  data-ocid="backup-row"
                >
                  <td className="px-3 py-2.5">
                    <span className="font-mono text-[11px] text-muted-foreground bg-secondary/30 px-1.5 py-0.5 rounded">
                      {shortId(backup.id)}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <BackupTypeBadge type={backup.backupType} />
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap font-mono text-[11px] text-foreground">
                    {formatDate(backup.createdAt)}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="font-mono text-xs text-primary">
                      {backup.versionLabel || "—"}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="font-mono text-xs tabular-nums flex items-center gap-1">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      {backup.userCount?.toString() ?? "—"}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="font-mono text-xs tabular-nums flex items-center gap-1">
                      <Archive className="w-3 h-3 text-muted-foreground" />
                      {backup.listingCount?.toString() ?? "—"}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                    {backup.sizeKb ? `${backup.sizeKb.toString()} KB` : "—"}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Stable star */}
                      <button
                        type="button"
                        onClick={() => handleToggleStable(backup)}
                        aria-label={
                          backup.isStable ? "Unmark stable" : "Mark as stable"
                        }
                        className="p-1 rounded hover:bg-accent/10 transition-colors"
                        data-ocid={`stable-toggle-${backup.id}`}
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${backup.isStable ? "fill-accent text-accent" : "text-muted-foreground"}`}
                        />
                      </button>
                      {/* Restore */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRestoreTarget(backup)}
                        disabled={restore.isPending}
                        className="font-mono text-[10px] h-7 border-accent/40 text-accent hover:bg-accent/10 whitespace-nowrap"
                        data-ocid={`restore-backup-btn-${backup.id}`}
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Restore
                      </Button>
                      {/* Download JSON */}
                      <button
                        type="button"
                        onClick={() => exportJson.mutateAsync(backup)}
                        aria-label="Download as JSON"
                        className="p-1.5 rounded border border-border/40 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                        data-ocid={`download-backup-${backup.id}`}
                      >
                        <FileJson className="w-3.5 h-3.5" />
                      </button>
                      {/* Delete — only non-stable auto backups */}
                      {!backup.isStable && backup.backupType !== "manual" && (
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(backup)}
                          aria-label="Delete backup"
                          className="p-1.5 rounded border border-destructive/30 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          data-ocid={`delete-backup-${backup.id}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Restore from file */}
      <div className="rounded-xl bg-card neon-border-blue p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Archive className="w-4 h-4 text-primary" />
          <h4 className="font-display text-xs font-bold tracking-widest uppercase text-primary">
            Restore From File
          </h4>
        </div>
        <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
          Upload a previously downloaded backup .json or .zip file to restore
          from a local backup — even if the database is unavailable.
        </p>
        <button
          type="button"
          className="w-full border-2 border-dashed border-primary/20 hover:border-primary/40 rounded-lg p-8 text-center transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          data-ocid="restore-from-file-zone"
        >
          <Download className="w-6 h-6 text-muted-foreground/40 mx-auto mb-2" />
          <p className="font-mono text-xs text-muted-foreground">
            Drag &amp; drop or click to upload a backup file
          </p>
          <p className="font-mono text-[10px] text-muted-foreground/60 mt-1">
            .json or .zip accepted
          </p>
        </button>
      </div>

      {/* ── Modals ── */}

      {/* Restore confirm */}
      <AlertDialog
        open={!!restoreTarget}
        onOpenChange={(open) => !open && setRestoreTarget(null)}
      >
        <AlertDialogContent className="bg-card border-accent/30 font-body">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-sm uppercase tracking-wider text-accent text-glow-yellow">
              Restore from backup?
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="font-mono text-xs text-muted-foreground leading-relaxed space-y-3">
                <p>
                  Restore backup{" "}
                  <span className="font-bold text-foreground bg-secondary/40 px-1.5 py-0.5 rounded">
                    {restoreTarget ? shortId(restoreTarget.id) : ""}
                  </span>{" "}
                  created{" "}
                  <span className="text-foreground">
                    {restoreTarget ? formatDate(restoreTarget.createdAt) : ""}
                  </span>
                  ?
                </p>
                <p>
                  This will restore{" "}
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
              data-ocid="confirm-restore-backup-btn"
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
                {(restoreResult?.preRestoreBackupId ||
                  restoreResult?.preSaveBackupId) && (
                  <p className="text-muted-foreground/70">
                    Pre-restore backup:{" "}
                    <span className="font-bold text-foreground bg-secondary/40 px-1.5 py-0.5 rounded">
                      {shortId(
                        restoreResult.preRestoreBackupId ||
                          restoreResult.preSaveBackupId,
                      )}
                    </span>
                  </p>
                )}
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

      {/* Rollback to stable confirm */}
      <AlertDialog open={rollbackConfirm} onOpenChange={setRollbackConfirm}>
        <AlertDialogContent className="bg-card border-accent/30 font-body">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-sm uppercase tracking-wider text-accent">
              Rollback to Last Stable?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-xs text-muted-foreground">
              This will restore the most recent backup marked as Stable. Current
              state will be saved as a new backup first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono text-xs">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleRollbackStable();
              }}
              disabled={rollbackStable.isPending}
              className="font-mono text-xs bg-accent text-accent-foreground hover:bg-accent/80"
              data-ocid="confirm-rollback-stable-btn"
            >
              <RotateCcw className="w-3 h-3 mr-1.5" />
              {rollbackStable.isPending
                ? "Rolling back…"
                : "Rollback — I Understand"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete confirm */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent className="bg-card border-destructive/40 font-body">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-sm uppercase tracking-wider text-destructive flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Delete Backup?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-xs text-muted-foreground">
              Delete backup{" "}
              <span className="font-bold text-foreground">
                {deleteTarget ? shortId(deleteTarget.id) : ""}
              </span>
              ? This cannot be undone. Manual backups are protected and cannot
              be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono text-xs">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleteBackup.isPending}
              className="font-mono text-xs bg-destructive text-destructive-foreground hover:bg-destructive/80"
              data-ocid="confirm-delete-backup-btn"
            >
              <Trash2 className="w-3 h-3 mr-1.5" />
              {deleteBackup.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

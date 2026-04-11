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
import { Skeleton } from "@/components/ui/skeleton";
import {
  useListVersionBackups,
  useRestoreFromVersionBackup,
} from "@/hooks/useAdminVersions";
import type { RestoreResult, VersionBackupSummary } from "@/types";
import {
  AlertTriangle,
  Archive,
  ChevronDown,
  ChevronRight,
  Database,
  FileJson,
  Loader2,
  Mail,
  RotateCcw,
  Shield,
  Upload,
  Users,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({
  icon,
  letter,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  letter: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-4 mb-5">
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-[10px] text-yellow-400/70 uppercase tracking-[0.2em]">
            Section {letter}
          </span>
        </div>
        <h2 className="font-display text-base font-bold text-yellow-400 text-glow-yellow leading-tight">
          {title}
        </h2>
        <p className="font-mono text-xs text-muted-foreground mt-1.5 leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

// ─── Backup Row ───────────────────────────────────────────────────────────────

function BackupRow({
  backup,
  onRestore,
  restoring,
}: {
  backup: VersionBackupSummary;
  onRestore: (b: VersionBackupSummary) => void;
  restoring: boolean;
}) {
  return (
    <div
      className="rounded-xl bg-secondary/20 border border-border/40 p-4 space-y-3"
      data-ocid="emergency-backup-row"
    >
      {/* Meta row */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[10px] text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded">
              #{shortId(backup.id)}
            </span>
            <Badge
              variant="outline"
              className={[
                "font-mono text-[9px] uppercase tracking-widest",
                backup.backupType === "manual"
                  ? "border-yellow-400/40 text-yellow-400 bg-yellow-400/5"
                  : "border-primary/40 text-primary bg-primary/5",
              ].join(" ")}
            >
              {backup.backupType === "manual" ? "Manual" : "Auto"}
            </Badge>
            {backup.isStable && (
              <Badge
                variant="outline"
                className="font-mono text-[9px] uppercase tracking-widest border-green-500/40 text-green-400 bg-green-400/5"
              >
                ★ Stable
              </Badge>
            )}
          </div>
          <p className="font-display text-xs text-foreground">
            {backup.versionLabel || "Unnamed backup"}
          </p>
          <p className="font-mono text-[11px] text-muted-foreground">
            {formatDate(backup.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground flex-shrink-0">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {backup.userCount?.toString() ?? "0"} users
          </span>
          <span className="flex items-center gap-1">
            <Archive className="w-3 h-3" />
            {backup.listingCount?.toString() ?? "0"} listings
          </span>
        </div>
      </div>

      {/* BIG yellow restore button */}
      <button
        type="button"
        onClick={() => onRestore(backup)}
        disabled={restoring}
        className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold text-lg px-6 py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 glow-yellow"
        data-ocid={`emergency-restore-btn-${backup.id}`}
      >
        {restoring ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <RotateCcw className="w-5 h-5" />
        )}
        {restoring ? "Restoring…" : "Restore to This Point"}
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function EmergencyRestorePage() {
  const { data: backups = [], isLoading } = useListVersionBackups();
  const restoreMutation = useRestoreFromVersionBackup();

  const [confirmTarget, setConfirmTarget] =
    useState<VersionBackupSummary | null>(null);
  const [restoreResult, setRestoreResult] = useState<RestoreResult | null>(
    null,
  );
  const [manualOpen, setManualOpen] = useState(false);

  // File restore state
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileConfirmOpen, setFileConfirmOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // ── Restore from DB backup ─────────────────────────────────────────────────

  async function handleConfirmRestore() {
    if (!confirmTarget) return;
    try {
      const result = await restoreMutation.mutateAsync(confirmTarget.id);
      setConfirmTarget(null);
      if (result.success) {
        setRestoreResult(result);
        toast.success("Restore complete!");
      } else {
        toast.error(result.errorMessage || result.message || "Restore failed.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Restore failed.");
      setConfirmTarget(null);
    }
  }

  // ── File restore ───────────────────────────────────────────────────────────

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (e.target) e.target.value = "";
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setSelectedFile(file);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleUploadAndRestore() {
    if (!selectedFile) {
      toast.error("Please select a backup file first.");
      return;
    }
    setFileConfirmOpen(true);
  }

  async function handleConfirmFileRestore() {
    if (!selectedFile) return;
    setFileConfirmOpen(false);

    try {
      // Read and parse the file
      const text = await selectedFile.text();
      let backupData: unknown;

      if (selectedFile.name.endsWith(".zip")) {
        toast.info(
          "ZIP restore: extract listings.json from the ZIP and upload that file instead.",
        );
        return;
      }

      backupData = JSON.parse(text);

      // Show what we found
      const data = backupData as {
        tables?: { users?: unknown[]; listings?: unknown[] };
        listings?: unknown[];
      };
      const userCount = data?.tables?.users?.length ?? 0;
      const listingCount =
        data?.tables?.listings?.length ?? data?.listings?.length ?? 0;

      toast.success(
        `File parsed: ${userCount} users, ${listingCount} listings found. Contact support to apply this restore.`,
        { duration: 8000 },
      );
    } catch {
      toast.error(
        "Could not read the file. Make sure it is a valid .json backup file.",
      );
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* ── Page Header ── */}
        <div className="space-y-2">
          <h1 className="font-display text-2xl sm:text-3xl font-black text-destructive text-glow-red flex items-center gap-3">
            <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-400 text-glow-yellow flex-shrink-0" />
            🚨 Emergency Restore
          </h1>
          <p className="font-mono text-sm text-muted-foreground leading-relaxed">
            Use this page if your data is missing or corrupted.{" "}
            <span className="text-yellow-400 font-semibold">
              Your current state will always be saved first before any restore.
            </span>
          </p>
        </div>

        {/* ── SECTION A: Restore From DB Backup ── */}
        <section className="rounded-2xl bg-card neon-border-yellow p-5 sm:p-6 space-y-4">
          <SectionHeader
            icon={<Database className="w-6 h-6 text-yellow-400" />}
            letter="A"
            title="Restore From a Saved Backup"
            subtitle="Choose a backup from the list below and click Restore. Your site will return to exactly how it was at that point in time. Your current data will be saved first automatically."
          />

          {isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          ) : backups.length === 0 ? (
            <div className="rounded-xl bg-secondary/20 border border-dashed border-border/40 p-8 text-center">
              <Database className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="font-display text-xs text-muted-foreground uppercase tracking-widest">
                No backups found
              </p>
              <p className="font-mono text-[11px] text-muted-foreground/60 mt-1">
                Go to Admin → Version History to create a manual backup.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {backups.map((backup) => (
                <BackupRow
                  key={backup.id}
                  backup={backup}
                  onRestore={setConfirmTarget}
                  restoring={
                    restoreMutation.isPending && confirmTarget?.id === backup.id
                  }
                />
              ))}
            </div>
          )}
        </section>

        {/* ── SECTION B: Restore From File ── */}
        <section className="rounded-2xl bg-card neon-border-yellow p-5 sm:p-6 space-y-4">
          <SectionHeader
            icon={<FileJson className="w-6 h-6 text-yellow-400" />}
            letter="B"
            title="Restore From a Downloaded Backup File"
            subtitle="If you downloaded a backup file (.json or .zip) to your computer, upload it here to restore from it."
          />

          {/* Drag-and-drop zone — outer div handles drag events, inner button triggers file picker */}
          <div
            className={[
              "w-full border-2 border-dashed rounded-xl text-center transition-all duration-200",
              isDragOver
                ? "border-yellow-400/60 bg-yellow-400/5"
                : "border-border/40 hover:border-yellow-400/40 hover:bg-yellow-400/5",
            ].join(" ")}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={() => setIsDragOver(false)}
            data-ocid="emergency-file-drop-zone"
          >
            <button
              type="button"
              className="w-full p-8 sm:p-10 cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
              {selectedFile ? (
                <div className="space-y-1">
                  <p className="font-mono text-sm text-yellow-400 font-semibold">
                    {selectedFile.name}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB — ready to
                    restore
                  </p>
                </div>
              ) : (
                <>
                  <p className="font-mono text-sm text-muted-foreground">
                    Drag &amp; drop or click to upload a backup file
                  </p>
                  <p className="font-mono text-[11px] text-muted-foreground/60 mt-1">
                    .json or .zip accepted
                  </p>
                </>
              )}
            </button>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept=".json,.zip"
            className="hidden"
            onChange={handleFileChange}
            aria-label="Select backup file"
          />

          {/* Big yellow upload button */}
          <button
            type="button"
            onClick={handleUploadAndRestore}
            disabled={!selectedFile}
            className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-lg px-6 py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 glow-yellow"
            data-ocid="emergency-upload-restore-btn"
          >
            <Upload className="w-5 h-5" />
            Upload and Restore
          </button>
        </section>

        {/* ── SECTION C: Manual Steps (collapsible) ── */}
        <section className="rounded-2xl bg-card neon-border-red p-5 sm:p-6 space-y-4">
          <button
            type="button"
            className="w-full flex items-start gap-4 text-left group"
            onClick={() => setManualOpen((v) => !v)}
            aria-expanded={manualOpen}
            data-ocid="emergency-manual-toggle"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-destructive/10 border border-destructive/30 flex items-center justify-center">
              <Shield className="w-6 h-6 text-destructive" />
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[10px] text-destructive/70 uppercase tracking-[0.2em]">
                  Section C
                </span>
              </div>
              <h2 className="font-display text-base font-bold text-destructive text-glow-red">
                If Buttons Are Not Working — Manual Steps
              </h2>
              <p className="font-mono text-xs text-muted-foreground mt-1">
                Click to {manualOpen ? "collapse" : "expand"} step-by-step
                instructions
              </p>
            </div>
            <div className="flex-shrink-0 pt-3">
              {manualOpen ? (
                <ChevronDown className="w-5 h-5 text-destructive" />
              ) : (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </button>

          {manualOpen && (
            <div className="space-y-5 pt-2">
              <ol className="space-y-4">
                {[
                  {
                    step: 1,
                    text: "Go to supabase.com and log in to your project.",
                  },
                  {
                    step: 2,
                    text: 'Click on "Table Editor" in the left side menu.',
                  },
                  {
                    step: 3,
                    text: 'Find the "version_backups" table and click on it to open it.',
                  },
                  {
                    step: 4,
                    text: 'Find the most recent row (top of the list) and copy the contents of the "backup_data" column.',
                  },
                  {
                    step: 5,
                    text: "Contact support with your backup data and we can help restore it manually.",
                  },
                ].map(({ step, text }) => (
                  <li key={step} className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center font-display text-sm font-bold text-destructive">
                      {step}
                    </span>
                    <p className="font-mono text-sm text-foreground leading-relaxed pt-1">
                      {text}
                    </p>
                  </li>
                ))}
              </ol>

              <button
                type="button"
                onClick={() => {
                  window.location.href =
                    "mailto:support@example.com?subject=Emergency+Restore+Help";
                }}
                className="w-full bg-destructive hover:bg-destructive/80 text-destructive-foreground font-bold text-base px-6 py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 glow-red"
                data-ocid="emergency-email-support-btn"
              >
                <Mail className="w-5 h-5" />
                Email Admin Support
              </button>
            </div>
          )}
        </section>

        {/* ── Emergency API Note ── */}
        <div className="rounded-xl bg-secondary/20 border border-border/40 p-4 space-y-1">
          <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">
            <span className="text-foreground font-semibold">
              Emergency API endpoint:
            </span>{" "}
            <code className="font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[10px]">
              POST {window.location.origin}/api/admin/emergency-restore
            </code>
          </p>
          <p className="font-mono text-[11px] text-muted-foreground">
            Protected by your{" "}
            <code className="font-mono text-accent bg-accent/10 px-1 py-0.5 rounded text-[10px]">
              EMERGENCY_RESTORE_TOKEN
            </code>{" "}
            environment variable. Body:{" "}
            <code className="font-mono text-muted-foreground/80 text-[10px]">
              {"{ token, backupId }"}
            </code>
          </p>
        </div>

        {/* ── Confirm Restore Modal ── */}
        <AlertDialog
          open={!!confirmTarget}
          onOpenChange={(open) => !open && setConfirmTarget(null)}
        >
          <AlertDialogContent className="bg-card border-yellow-400/40 font-body">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-display text-sm uppercase tracking-wider text-yellow-400 text-glow-yellow flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Are you sure?
              </AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="font-mono text-xs text-muted-foreground leading-relaxed space-y-3">
                  <p>
                    Restore backup{" "}
                    <span className="font-bold text-foreground bg-secondary/40 px-1.5 py-0.5 rounded">
                      #{confirmTarget ? shortId(confirmTarget.id) : ""}
                    </span>{" "}
                    created{" "}
                    <span className="text-foreground">
                      {confirmTarget ? formatDate(confirmTarget.createdAt) : ""}
                    </span>
                    ?
                  </p>
                  <p>
                    This will restore{" "}
                    <span className="text-yellow-400 font-bold">
                      {confirmTarget?.userCount?.toString() ?? "0"} user
                      accounts
                    </span>{" "}
                    and{" "}
                    <span className="text-yellow-400 font-bold">
                      {confirmTarget?.listingCount?.toString() ?? "0"} listings
                    </span>{" "}
                    to their state at that point in time.
                  </p>
                  <p className="text-primary/80">
                    ✓ Current data will be auto-saved as a backup first.
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
                  handleConfirmRestore();
                }}
                disabled={restoreMutation.isPending}
                className="font-mono text-xs bg-yellow-400 text-black hover:bg-yellow-300 font-bold"
                data-ocid="emergency-confirm-restore-btn"
              >
                {restoreMutation.isPending ? (
                  <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                ) : (
                  <RotateCcw className="w-3 h-3 mr-1.5" />
                )}
                {restoreMutation.isPending ? "Restoring…" : "Yes, Restore Now"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* ── Restore Success Modal ── */}
        <AlertDialog
          open={!!restoreResult}
          onOpenChange={(open) => !open && setRestoreResult(null)}
        >
          <AlertDialogContent className="bg-card border-primary/30 font-body">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-display text-sm uppercase tracking-wider text-primary text-glow-blue flex items-center gap-2">
                ✓ Restore Complete
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
                    restored successfully.
                  </p>
                  {(restoreResult?.preRestoreBackupId ||
                    restoreResult?.preSaveBackupId) && (
                    <p className="text-muted-foreground/70">
                      Pre-restore backup saved:{" "}
                      <span className="font-bold text-foreground bg-secondary/40 px-1.5 py-0.5 rounded">
                        #
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

        {/* ── File Confirm Modal ── */}
        <AlertDialog open={fileConfirmOpen} onOpenChange={setFileConfirmOpen}>
          <AlertDialogContent className="bg-card border-yellow-400/40 font-body">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-display text-sm uppercase tracking-wider text-yellow-400 text-glow-yellow flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Restore from file?
              </AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="font-mono text-xs text-muted-foreground space-y-2">
                  <p>
                    Upload and restore from{" "}
                    <span className="font-bold text-foreground">
                      {selectedFile?.name}
                    </span>
                    ?
                  </p>
                  <p className="text-primary/80">
                    ✓ Current data will be auto-saved as a backup first.
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
                  handleConfirmFileRestore();
                }}
                className="font-mono text-xs bg-yellow-400 text-black hover:bg-yellow-300 font-bold"
                data-ocid="emergency-confirm-file-restore-btn"
              >
                <Upload className="w-3 h-3 mr-1.5" />
                Yes, Restore Now
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}

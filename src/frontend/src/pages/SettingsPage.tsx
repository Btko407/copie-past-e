import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useProfile } from "@/hooks/useProfile";
import { useSubmitTicket } from "@/hooks/useSupportTickets";
import { useActor } from "@caffeineai/core-infrastructure";
import { Link } from "@tanstack/react-router";
import {
  Archive,
  ArrowLeft,
  CheckCircle2,
  Download,
  HelpCircle,
  Upload,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createActor } from "../backend";
import { BackupExportModal } from "../components/BackupExportModal";
import { useGetMyBackups, useRestoreFromBackup } from "../hooks/useBackup";
import { useRestoreFromZip } from "../hooks/useBackupExport";

// ─── Validation ───────────────────────────────────────────────────────────────

const USERNAME_RE = /^[a-zA-Z0-9_]{3,30}$/;

function validateUsername(value: string): string | null {
  if (value.length < 3) return "Username must be at least 3 characters.";
  if (value.length > 30) return "Username cannot exceed 30 characters.";
  if (!USERNAME_RE.test(value))
    return "Only letters, numbers, and underscores allowed.";
  return null;
}

const SUPPORT_SUBJECTS = [
  "Account Issue",
  "Billing Question",
  "Technical Problem",
  "Listing Issue",
  "Other",
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export function SettingsPage() {
  const { profile, isLoading, setUsername, isSaving } = useProfile();
  const { actor, isFetching } = useActor(createActor);

  const [inputValue, setInputValue] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [takenError, setTakenError] = useState<string | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const seededRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Seed input with current username once loaded
  useEffect(() => {
    if (profile?.username && !seededRef.current) {
      seededRef.current = true;
      setInputValue(profile.username);
    }
  }, [profile?.username]);

  // ── Real-time availability check ──────────────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setTakenError(null);
    setIsAvailable(null);

    const err = validateUsername(val);
    setValidationError(err);
    if (err || val === profile?.username) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (!actor) return;
      setCheckingAvailability(true);
      try {
        const existing = await actor.getProfileByUsername(val);
        setIsAvailable(existing === null);
        if (existing !== null) {
          setTakenError("That username is already taken.");
        }
      } catch {
        // silently ignore availability check errors
      } finally {
        setCheckingAvailability(false);
      }
    }, 500);
  };

  const handleBlur = () => {
    if (!inputValue) return;
    const err = validateUsername(inputValue);
    setValidationError(err);
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    const err = validateUsername(inputValue);
    if (err) {
      setValidationError(err);
      return;
    }
    if (inputValue === profile?.username) {
      toast.info("That's already your username.");
      return;
    }

    try {
      await setUsername(inputValue);
      toast.success("Username updated successfully!", {
        description: `You're now known as @${inputValue}`,
      });
      setIsAvailable(null);
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : "Failed to update username.";
      if (
        msg.toLowerCase().includes("taken") ||
        msg.toLowerCase().includes("already")
      ) {
        setTakenError("That username is already taken.");
      } else {
        toast.error("Failed to update username", { description: msg });
      }
    }
  };

  const displayError = validationError ?? takenError;
  const isUnchanged = inputValue === profile?.username;
  const canSave =
    !displayError &&
    !isUnchanged &&
    !checkingAvailability &&
    isAvailable !== false &&
    inputValue.length >= 3;

  return (
    <div className="min-h-screen bg-background retro-grid">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Back link */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary text-sm transition-smooth mb-8 group"
          data-ocid="settings-back-link"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-smooth" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-primary text-glow-blue tracking-wider uppercase mb-1">
            Account Settings
          </h1>
          <p className="text-muted-foreground text-sm font-body">
            Manage your identity on the platform.
          </p>
        </div>

        {/* Username Card */}
        <Card className="bg-card border-primary/20 neon-border-blue shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center neon-border-blue">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="font-display text-base tracking-wide text-foreground uppercase">
                  Username
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Unique across the platform — used for upgrades and identity.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <Separator className="bg-border/50" />

          <CardContent className="pt-6 space-y-6">
            {/* Current username display */}
            {isLoading ? (
              <div className="space-y-1">
                <Skeleton className="h-4 w-24 bg-primary/10" />
                <Skeleton className="h-9 w-full bg-primary/10" />
              </div>
            ) : (
              <>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="username-input"
                      className="font-mono text-xs text-muted-foreground tracking-widest uppercase"
                    >
                      Username
                    </Label>
                    {profile && (
                      <Badge
                        variant="outline"
                        className="font-mono text-[10px] border-primary/40 text-primary bg-primary/10 px-2"
                      >
                        @{profile.username}
                      </Badge>
                    )}
                  </div>

                  {/* Input with availability indicator */}
                  <div className="relative">
                    <Input
                      id="username-input"
                      value={inputValue}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Enter new username…"
                      maxLength={30}
                      spellCheck={false}
                      autoComplete="off"
                      data-ocid="settings-username-input"
                      className={`font-mono bg-input border-border text-foreground pr-9 transition-smooth focus:ring-primary/50 ${
                        displayError
                          ? "border-destructive/60 focus:border-destructive neon-border-red"
                          : isAvailable === true
                            ? "border-green-500/60 focus:border-green-500 neon-border-green"
                            : "border-border focus:border-primary/60"
                      }`}
                    />
                    {/* Status icon */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {checkingAvailability && (
                        <span className="inline-block w-3 h-3 rounded-full border-2 border-primary/40 border-t-primary animate-spin" />
                      )}
                      {!checkingAvailability &&
                        isAvailable === true &&
                        !displayError && (
                          <CheckCircle2 className="w-4 h-4 text-green-500 text-glow-green" />
                        )}
                      {!checkingAvailability &&
                        (displayError || isAvailable === false) && (
                          <XCircle className="w-4 h-4 text-destructive" />
                        )}
                    </div>
                  </div>

                  {/* Error / success hint */}
                  {displayError ? (
                    <p
                      className="text-xs text-destructive font-mono"
                      data-ocid="settings-username-error"
                    >
                      {displayError}
                    </p>
                  ) : isAvailable === true && !isUnchanged ? (
                    <p className="text-xs text-green-500 font-mono text-glow-green">
                      ✓ Username is available
                    </p>
                  ) : isUnchanged && inputValue ? (
                    <p className="text-xs text-muted-foreground font-mono">
                      This is your current username.
                    </p>
                  ) : null}

                  <p className="text-[11px] text-muted-foreground font-mono">
                    3–30 characters · letters, numbers, underscores only
                  </p>
                </div>

                {/* Save button */}
                <Button
                  onClick={handleSave}
                  disabled={!canSave || isSaving || isFetching}
                  data-ocid="settings-save-username-btn"
                  className={`w-full font-display text-sm tracking-wider uppercase transition-smooth ${
                    canSave && !isSaving
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 glow-blue-sm"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {isSaving ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" />
                      Saving…
                    </span>
                  ) : (
                    "Save Username"
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Account Info Card */}
        {profile && (
          <Card className="mt-6 bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-sm tracking-wide text-muted-foreground uppercase">
                Account Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <InfoRow label="Email" value={profile.email || "—"} />
              <InfoRow
                label="Role"
                value={
                  <Badge
                    variant="outline"
                    className={`font-mono text-[10px] px-2 ${
                      profile.role === "admin"
                        ? "border-accent/50 text-accent bg-accent/10 text-glow-yellow"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {profile.role}
                  </Badge>
                }
              />
              <InfoRow
                label="Member since"
                value={new Date(
                  Number(profile.createdAt) / 1_000_000,
                ).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              />
              <InfoRow
                label="Email verified"
                value={
                  profile.emailVerified ? (
                    <span className="text-green-500 font-mono text-xs text-glow-green">
                      ✓ Verified
                    </span>
                  ) : (
                    <span className="text-muted-foreground font-mono text-xs">
                      Not verified
                    </span>
                  )
                }
              />
            </CardContent>
          </Card>
        )}

        {/* Restore From Backup */}
        <RestoreFromBackupSection />

        {/* Contact Support */}
        <ContactSupportSection />
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
      <span className="font-mono text-xs text-muted-foreground tracking-wider uppercase">
        {label}
      </span>
      <span className="text-sm text-foreground font-body">{value}</span>
    </div>
  );
}

// ─── Contact Support ───────────────────────────────────────────────────────────

function ContactSupportSection() {
  const { submit, loading, success } = useSubmitTicket();
  const [subject, setSubject] = useState<string>(SUPPORT_SUBJECTS[0]);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const maxChars = 1000;
  const charsLeft = maxChars - message.length;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please enter a message before submitting.");
      return;
    }
    try {
      await submit(subject, message.trim());
      setSubmitted(true);
      setMessage("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to send your message.",
      );
    }
  }

  return (
    <Card
      className="mt-6 bg-card border-primary/20 neon-border-blue shadow-lg"
      data-ocid="settings-contact-support-section"
    >
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center neon-border-blue">
            <HelpCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="font-display text-base tracking-wide text-foreground uppercase">
              Contact Support
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Have a question or issue? Send us a message and we'll respond
              through your notification center.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <Separator className="bg-border/50" />

      <CardContent className="pt-6">
        {submitted || success ? (
          <div
            className="flex items-start gap-3 rounded-lg border border-green-500/30 bg-green-500/5 px-4 py-4"
            data-ocid="support-success-msg"
          >
            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-display text-sm font-bold tracking-wide text-green-500 uppercase">
                Message Sent
              </p>
              <p className="font-mono text-xs text-muted-foreground mt-1 leading-relaxed">
                Your message has been received. We will respond through your
                notification center.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="font-mono text-xs text-primary hover:text-primary/80 transition-smooth mt-3 underline underline-offset-2"
              >
                Send another message
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Subject */}
            <div className="space-y-1.5">
              <Label
                htmlFor="support-subject"
                className="font-mono text-xs text-muted-foreground tracking-widest uppercase"
              >
                Subject
              </Label>
              <select
                id="support-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/60 transition-smooth min-h-[44px]"
                data-ocid="support-subject-select"
              >
                {SUPPORT_SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="support-message"
                  className="font-mono text-xs text-muted-foreground tracking-widest uppercase"
                >
                  Message
                </Label>
                <span
                  className={`font-mono text-[10px] ${
                    charsLeft < 100
                      ? "text-destructive"
                      : "text-muted-foreground/60"
                  }`}
                >
                  {charsLeft} chars left
                </span>
              </div>
              <Textarea
                id="support-message"
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, maxChars))}
                placeholder="Describe your issue or question…"
                rows={5}
                required
                className="font-mono text-sm bg-input border-border text-foreground focus:border-primary/60 focus:ring-primary/50 resize-none transition-smooth"
                data-ocid="support-message-input"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !message.trim()}
              className="w-full font-display text-sm tracking-wider uppercase bg-primary text-primary-foreground hover:bg-primary/90 glow-blue-sm transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
              data-ocid="support-submit-btn"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" />
                  Sending…
                </span>
              ) : (
                "Send Message"
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Restore From Backup ───────────────────────────────────────────────────────

function RestoreFromBackupSection() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const restoreJson = useRestoreFromBackup();
  const restoreZip = useRestoreFromZip();
  const { data: backupHistory = [], isLoading: isLoadingHistory } =
    useGetMyBackups();
  const [showExportModal, setShowExportModal] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreProgress, setRestoreProgress] = useState<string | null>(null);
  const [restoreMessage, setRestoreMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsRestoring(true);
    setRestoreMessage(null);
    setRestoreProgress(null);

    try {
      const isZip =
        file.name.endsWith(".zip") || file.type === "application/zip";

      if (isZip) {
        // ZIP restore flow
        const result = await restoreZip.mutateAsync({
          file,
          onProgress: (msg) => setRestoreProgress(msg),
        });
        setRestoreMessage({
          type: "success",
          text: `${result.restoredCount} listing${result.restoredCount !== 1 ? "s" : ""} restored successfully.`,
        });
        toast.success(`${result.restoredCount} listings restored from backup.`);
      } else {
        // JSON restore flow
        const text = await file.text();
        const parsed = JSON.parse(text) as {
          listings?: import("../hooks/useBackup").BackupListingEntry[];
        };
        if (!Array.isArray(parsed.listings)) {
          setRestoreMessage({
            type: "error",
            text: "Invalid backup file. Missing listings data.",
          });
          return;
        }
        const result = await restoreJson.mutateAsync(parsed.listings);
        setRestoreMessage({
          type: "success",
          text: `${result.restoredCount} listing${result.restoredCount !== 1 ? "s" : ""} restored successfully.`,
        });
        toast.success(`${result.restoredCount} listings restored.`);
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message.toLowerCase().includes("subscription")
            ? "An active subscription is required to restore a backup."
            : err.message
          : "Failed to restore backup.";
      setRestoreMessage({ type: "error", text: msg });
      toast.error(msg);
    } finally {
      setIsRestoring(false);
      setRestoreProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const isBusy = isRestoring || restoreJson.isPending || restoreZip.isPending;

  return (
    <>
      <BackupExportModal
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
      />

      <Card
        className="mt-6 bg-card border-primary/20 neon-border-blue shadow-lg"
        data-ocid="settings-restore-backup-section"
      >
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center neon-border-blue">
              <Archive className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="font-display text-base tracking-wide text-foreground uppercase">
                Restore From Backup
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Upload a backup file to restore your listings. Requires an
                active subscription. Restoring will add listings from the backup
                to your active listings. Smart Backup export is a $29.99
                one-time export fee.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <Separator className="bg-border/50" />

        <CardContent className="pt-6 space-y-5">
          {/* Export backup button */}
          <div className="rounded-lg bg-accent/5 border border-accent/20 px-4 py-4 space-y-2">
            <p className="font-display text-xs tracking-widest uppercase text-accent">
              ⚡ Smart Backup — $29.99
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Export all your listings including photos as a downloadable ZIP
              archive. One-time charge of $29.99.
            </p>
            <Button
              onClick={() => setShowExportModal(true)}
              className="font-display text-xs tracking-widest uppercase bg-accent text-accent-foreground hover:bg-accent/90 glow-yellow transition-smooth gap-2 mt-1"
              data-ocid="smart-backup-export-btn"
            >
              <Archive className="w-3.5 h-3.5" />
              Export My Listings — $29.99
            </Button>
          </div>

          <Separator className="bg-border/40" />

          {/* Upload backup file */}
          <div className="space-y-3">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
              Upload Backup File
            </p>
            <Button
              variant="outline"
              disabled={isBusy}
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto font-display text-xs tracking-widest uppercase neon-border-blue text-primary hover:glow-blue-sm transition-smooth gap-2"
              data-ocid="upload-backup-file-btn"
            >
              <Upload className="w-3.5 h-3.5" />
              {isBusy ? "Restoring..." : "Upload Backup File"}
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.zip"
              className="sr-only"
              tabIndex={-1}
              onChange={handleFileSelect}
            />

            {isBusy && (
              <div className="flex items-center gap-2 font-mono text-xs text-primary animate-pulse">
                <span>⚡</span>
                <span>{restoreProgress ?? "Restoring your listings…"}</span>
              </div>
            )}

            {restoreMessage && !isBusy && (
              <p
                className={`font-mono text-xs ${
                  restoreMessage.type === "success"
                    ? "text-green-500"
                    : "text-destructive"
                }`}
                data-ocid="restore-backup-result"
              >
                {restoreMessage.type === "success" ? "✓ " : "✗ "}
                {restoreMessage.text}
              </p>
            )}
          </div>

          <Separator className="bg-border/40" />

          {/* Backup History */}
          <BackupHistorySection
            records={backupHistory}
            isLoading={isLoadingHistory}
          />
        </CardContent>
      </Card>
    </>
  );
}

// ─── Backup History ────────────────────────────────────────────────────────────

interface BackupHistorySectionProps {
  records: import("../hooks/useBackup").BackupRecord[];
  isLoading: boolean;
}

function BackupHistorySection({
  records,
  isLoading,
}: BackupHistorySectionProps) {
  return (
    <div className="space-y-3" data-ocid="backup-history-section">
      <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
        Previous Exports
      </p>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full bg-primary/5" />
          <Skeleton className="h-10 w-full bg-primary/5" />
        </div>
      ) : records.length === 0 ? (
        <p className="font-mono text-xs text-muted-foreground/60 py-2">
          No backups yet. Purchase a Smart Backup to get started.
        </p>
      ) : (
        <div className="overflow-x-auto -mx-2">
          <table className="w-full min-w-[380px] text-left">
            <thead>
              <tr className="border-b border-border/40">
                {["Date", "Listings", "Images", "Re-download"].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((rec, i) => {
                const expired = rec.expiresAt
                  ? new Date(rec.expiresAt) < new Date()
                  : false;
                return (
                  <tr
                    key={rec.id}
                    className={`border-b border-border/20 ${i % 2 === 0 ? "bg-card/60" : "bg-background/40"} ${expired ? "opacity-50" : ""}`}
                    data-ocid={`backup-history-row-${i}`}
                  >
                    <td className="px-3 py-2.5 font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                      {new Date(rec.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-xs text-foreground">
                      {rec.listingCount}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-xs text-foreground">
                      {rec.imageCount}
                    </td>
                    <td className="px-3 py-2.5">
                      {expired ? (
                        <span className="font-mono text-[10px] text-muted-foreground/50">
                          Expired
                        </span>
                      ) : rec.downloadUrl ? (
                        <a
                          href={rec.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-[10px] text-primary hover:text-primary/80 transition-colors"
                          data-ocid={`backup-redownload-${i}`}
                        >
                          <Download className="w-3 h-3" />
                          Re-download
                        </a>
                      ) : (
                        <span className="font-mono text-[10px] text-muted-foreground/50">
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

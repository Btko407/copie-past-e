import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import { AlertTriangle, Download, Flame, Fuel, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createActor } from "../backend";
import type { BackupListingEntry } from "../hooks/useBackup";
import {
  useConfirmBackupPayment,
  useDeleteBackup,
  useDownloadBackup,
  useGetMyBackups,
  useInitiateBackupPayment,
  useRestoreFromBackup,
} from "../hooks/useBackup";

// ─── Stripe Backup Checkout hook ──────────────────────────────────────────────

function useStripeBackupCheckout(onSuccess: () => void) {
  const { actor } = useActor(createActor);
  const initiate = useInitiateBackupPayment();
  const confirm = useConfirmBackupPayment();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = async () => {
    setIsProcessing(true);
    try {
      const result = await initiate.mutateAsync();

      if (!result.stripeClientSecret) {
        // No Stripe secret — dev/mock mode, confirm directly
        await confirm.mutateAsync({
          paymentRecordId: result.paymentRecordId,
          stripePaymentIntentId: "pi_mock_backup",
        });
        onSuccess();
        return;
      }

      // Fetch the publishable key at runtime from backend
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const a = actor as any;
      let publishableKey = "";
      if (a && typeof a.getStripePublicKey === "function") {
        try {
          const keyResult = await a.getStripePublicKey();
          publishableKey = keyResult?.publishableKey ?? "";
        } catch {
          // ignore
        }
      }

      if (!publishableKey) {
        throw new Error("Stripe not configured. Contact support.");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const StripeLib = (window as unknown as Record<string, unknown>)
        .Stripe as any;
      if (!StripeLib) throw new Error("Stripe.js not loaded");

      const stripe = StripeLib(publishableKey);
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        result.stripeClientSecret,
      );

      if (error) throw new Error(error.message);
      if (paymentIntent?.status === "succeeded") {
        await confirm.mutateAsync({
          paymentRecordId: result.paymentRecordId,
          stripePaymentIntentId: paymentIntent.id,
        });
        onSuccess();
      }
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Payment failed. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return { handlePurchase, isProcessing };
}

// ─── Smart Backup Button ───────────────────────────────────────────────────────

function SmartBackupButton() {
  const download = useDownloadBackup();

  const { handlePurchase, isProcessing } = useStripeBackupCheckout(async () => {
    try {
      await download.mutateAsync({ includeImages: true });
      toast.success("Backup downloaded! Check your Downloads folder.");
    } catch {
      toast.error(
        "Backup purchased but download failed. Access it from your profile.",
      );
    }
  });

  return (
    <div className="flex flex-col gap-1.5">
      <Button
        onClick={handlePurchase}
        disabled={isProcessing || download.isPending}
        size="sm"
        className="shrink-0 bg-card border border-primary/50 text-primary hover:bg-primary/10 glow-blue-sm font-display font-bold tracking-wider uppercase text-xs transition-smooth w-fit flex items-center gap-1.5"
        data-ocid="smart-backup-purchase-btn"
      >
        <span>💾</span>
        {isProcessing || download.isPending
          ? "Processing..."
          : "Smart Backup — $29.99"}
      </Button>
      <p className="font-mono text-[10px] text-muted-foreground leading-relaxed max-w-xs">
        Save a backup of all your listings before they are permanently deleted.
        Restore anytime in the future.
      </p>
    </div>
  );
}

// ─── Upload Backup Button (used on Dashboard) ─────────────────────────────────

export function UploadBackupButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const restore = useRestoreFromBackup();
  const [isRestoring, setIsRestoring] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsRestoring(true);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as { listings?: BackupListingEntry[] };
      if (!Array.isArray(parsed.listings)) {
        toast.error("Invalid backup file. Missing listings data.");
        return;
      }
      const result = await restore.mutateAsync(parsed.listings);
      toast.success(`${result.restoredCount} listings restored successfully.`);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.toLowerCase().includes("subscription")) {
          toast.error(
            "An active subscription is required to restore a backup.",
          );
        } else {
          toast.error(err.message);
        }
      } else {
        toast.error("Failed to restore backup.");
      }
    } finally {
      setIsRestoring(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        disabled={isRestoring}
        onClick={() => fileInputRef.current?.click()}
        className="h-8 gap-1.5 font-display text-xs tracking-wide border-border/60 hover:border-primary/50 hover:text-primary transition-smooth"
        data-ocid="upload-backup-btn"
      >
        <Download className="h-3 w-3" />
        {isRestoring ? "Restoring..." : "Upload Backup"}
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.zip"
        className="sr-only"
        tabIndex={-1}
        onChange={handleFileSelect}
      />
    </>
  );
}

// ─── Backups Section (used on Profile Page) ────────────────────────────────────

export function BackupsSection() {
  const { data: backups = [], isLoading } = useGetMyBackups();
  const download = useDownloadBackup();
  const deleteBackup = useDeleteBackup();

  const handleReDownload = async (backupId: string) => {
    try {
      await download.mutateAsync({ includeImages: false });
      toast.success("Backup downloaded.");
    } catch {
      toast.error(`Could not re-download backup ${backupId}.`);
    }
  };

  const handleDelete = async (backupId: string) => {
    try {
      await deleteBackup.mutateAsync(backupId);
      toast.success("Backup deleted.");
    } catch {
      toast.error("Failed to delete backup.");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-12 w-full bg-primary/5 rounded-lg" />
        ))}
      </div>
    );
  }

  if (backups.length === 0) {
    return (
      <p className="font-mono text-xs text-muted-foreground py-3">
        No backups yet. A backup can be purchased when your subscription
        expires.
      </p>
    );
  }

  return (
    <ul
      className="divide-y divide-border/40 rounded-lg border border-border/40 overflow-hidden"
      data-ocid="backup-list"
    >
      {backups.map((b) => (
        <li
          key={b.id}
          className="flex items-center justify-between gap-3 px-4 py-3 bg-card/40 hover:bg-primary/5 transition-smooth"
          data-ocid={`backup-item-${b.id}`}
        >
          <div className="flex-1 min-w-0">
            <p className="font-mono text-xs text-foreground truncate">
              {new Date(b.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
            <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
              {b.listingCount} listings
              {b.includesImages ? " · includes images" : " · text only"}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleReDownload(b.id)}
              disabled={download.isPending}
              className="h-7 w-7 p-0 text-primary hover:bg-primary/10 transition-smooth"
              aria-label="Download backup"
              data-ocid={`backup-download-${b.id}`}
            >
              <Download className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDelete(b.id)}
              disabled={deleteBackup.isPending}
              className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10 transition-smooth"
              aria-label="Delete backup"
              data-ocid={`backup-delete-${b.id}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}

// ─── Low Fuel Warning Banner (< 20%) ─────────────────────────────────────────

interface LowFuelBannerProps {
  onDismiss: () => void;
}

export function LowFuelWarningBanner({ onDismiss }: LowFuelBannerProps) {
  const navigate = useNavigate();
  return (
    <div
      className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg px-4 py-3 mb-4 border border-accent/50 bg-accent/8"
      style={{ boxShadow: "0 0 10px oklch(0.88 0.19 84 / 0.15)" }}
      role="alert"
      data-ocid="low-fuel-warning-banner"
    >
      {/* Amber top stripe */}
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-lg bg-gradient-to-r from-accent/20 via-accent to-accent/20" />

      {/* Dismiss */}
      <button
        type="button"
        onClick={onDismiss}
        className="absolute top-2.5 right-2.5 text-accent/50 hover:text-accent transition-smooth"
        aria-label="Dismiss low fuel warning"
        data-ocid="low-fuel-banner-dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-start gap-2.5 min-w-0 pr-7">
        <Fuel className="h-4 w-4 text-accent shrink-0 mt-0.5" />
        <div>
          <p className="font-display text-[11px] font-bold tracking-widest uppercase text-accent mb-0.5">
            Low Fuel Warning ⚠️
          </p>
          <p className="text-xs text-accent/80 leading-relaxed">
            Your DeLorean is running low on gas. Refuel before your listings are
            archived.
          </p>
        </div>
      </div>

      <Button
        onClick={() => navigate({ to: "/wallet" })}
        size="sm"
        className="shrink-0 bg-accent/90 text-accent-foreground hover:bg-accent font-display font-bold tracking-wider uppercase text-[11px] h-8 px-3"
        data-ocid="low-fuel-refuel-btn"
      >
        Refuel Now
      </Button>
    </div>
  );
}

// ─── Expired Subscription Banner ──────────────────────────────────────────────

interface RefuelBannerProps {
  daysUntilDeletion: number | null;
  onRefuel: () => void;
  onDismiss: () => void;
}

export function RefuelBanner({
  daysUntilDeletion,
  onRefuel,
  onDismiss,
}: RefuelBannerProps) {
  const isWarning = daysUntilDeletion !== null && daysUntilDeletion <= 5;
  const isExpired = daysUntilDeletion !== null;

  if (!isExpired) return null;

  if (isWarning) {
    // Orange/yellow warning — only a few days left in archive window
    return (
      <div
        className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg px-5 py-4 mb-6 border border-accent/60 bg-accent/10 glow-yellow-sm"
        role="alert"
        data-ocid="refuel-warning-banner"
      >
        {/* Dismiss */}
        <button
          type="button"
          onClick={onDismiss}
          className="absolute top-3 right-3 text-accent/60 hover:text-accent transition-smooth"
          aria-label="Dismiss warning"
          data-ocid="refuel-banner-dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 min-w-0 pr-6">
          <AlertTriangle className="h-5 w-5 text-accent shrink-0 mt-0.5 text-glow-yellow" />
          <div>
            <p className="font-display text-xs font-bold tracking-widest uppercase text-accent text-glow-yellow mb-1">
              ⚠ FINAL WARNING — OUT OF GAS
            </p>
            <p className="text-sm text-accent/80 leading-relaxed">
              Only{" "}
              <strong className="text-accent font-bold">
                {daysUntilDeletion} day{daysUntilDeletion !== 1 ? "s" : ""}
              </strong>{" "}
              before your listings are gone forever. The DeLorean is on empty —
              refuel now to save them!
            </p>
          </div>
        </div>

        <Button
          onClick={onRefuel}
          size="sm"
          className="shrink-0 bg-accent text-accent-foreground hover:bg-accent/90 glow-yellow font-display font-bold tracking-wider uppercase text-xs animate-pulse"
          data-ocid="refuel-warning-btn"
        >
          <Flame className="w-3.5 h-3.5 mr-1.5" />
          REFUEL GAS NOW
        </Button>
      </div>
    );
  }

  // Expired banner — red, urgent, with Smart Backup option
  return (
    <div
      className="relative rounded-lg px-5 py-4 mb-6 border border-destructive/60 bg-destructive/10 glow-red"
      role="alert"
      data-ocid="refuel-expired-banner"
    >
      {/* BTTF decorative time circuit stripe */}
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-lg bg-gradient-to-r from-destructive/20 via-destructive to-destructive/20" />

      {/* Dismiss */}
      <button
        type="button"
        onClick={onDismiss}
        className="absolute top-3 right-3 text-destructive/60 hover:text-destructive transition-smooth"
        aria-label="Dismiss banner"
        data-ocid="refuel-banner-dismiss"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Main content row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pr-6">
        <div className="flex items-start gap-3 min-w-0">
          <Flame className="h-5 w-5 text-destructive shrink-0 mt-0.5 text-glow-red animate-pulse" />
          <div>
            <p className="font-display text-xs font-bold tracking-widest uppercase text-destructive text-glow-red mb-1">
              🔴 SUBSCRIPTION EXPIRED — OUT OF GAS
            </p>
            <p className="text-sm text-destructive/80 leading-relaxed">
              Your DeLorean is out of gas. Refuel to restore your listings
              before they are permanently deleted in{" "}
              <strong className="text-destructive font-bold text-glow-red">
                {daysUntilDeletion} day{daysUntilDeletion !== 1 ? "s" : ""}
              </strong>
              .
            </p>
          </div>
        </div>

        <Button
          onClick={onRefuel}
          size="sm"
          className="shrink-0 bg-destructive text-destructive-foreground hover:bg-destructive/90 glow-red font-display font-bold tracking-wider uppercase text-xs"
          data-ocid="refuel-expired-btn"
        >
          <Flame className="w-3.5 h-3.5 mr-1.5" />
          REFUEL GAS
        </Button>
      </div>

      {/* Smart Backup option */}
      <div className="mt-4 pt-4 border-t border-destructive/30">
        <SmartBackupButton />
      </div>
    </div>
  );
}

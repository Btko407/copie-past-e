/**
 * BackupExportModal — $29.99 Smart Backup export payment modal.
 *
 * Steps:
 * 1. Confirm payment modal → Stripe redirect
 * 2. Progress modal while ZIP is generated (BackupProgressModal)
 */

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Archive, CreditCard, Loader2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  type ZipProgress,
  useCreateStripeCheckoutForBackup,
  useDownloadBackupZip,
} from "../hooks/useBackupExport";

// ─── BackupExportModal ─────────────────────────────────────────────────────────

interface BackupExportModalProps {
  open: boolean;
  onClose: () => void;
}

export function BackupExportModal({ open, onClose }: BackupExportModalProps) {
  const checkoutForBackup = useCreateStripeCheckoutForBackup();

  function handleClose() {
    onClose();
  }

  async function handlePayAndExport() {
    try {
      await checkoutForBackup.mutateAsync();
      // Stripe redirect happens — user returns to /payment-success
    } catch (err) {
      toast.error("Payment setup failed", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-primary/30 neon-border-blue">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/40 flex items-center justify-center shrink-0">
              <Archive className="w-5 h-5 text-accent" />
            </div>
            <DialogTitle className="font-display text-base tracking-wide text-foreground uppercase">
              Export Your Listings — $29.99
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed mt-2">
            Your complete listing archive including all photos will be packaged
            into a downloadable backup file. This backup can be used to restore
            your listings in the future.
            <br />
            <br />
            <span className="font-mono text-xs text-muted-foreground/70">
              One-time charge of $29.99.
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col sm:flex-row gap-2 mt-2">
          <Button
            variant="outline"
            onClick={handleClose}
            className="order-2 sm:order-1 font-mono text-xs"
            data-ocid="backup-cancel-btn"
          >
            <X className="w-3.5 h-3.5 mr-1.5" />
            Cancel
          </Button>
          <Button
            onClick={handlePayAndExport}
            disabled={checkoutForBackup.isPending}
            className="order-1 sm:order-2 font-display text-sm tracking-widest uppercase bg-accent text-accent-foreground hover:bg-accent/90 glow-yellow flex-1 sm:flex-none"
            data-ocid="backup-pay-export-btn"
          >
            {checkoutForBackup.isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Redirecting…
              </>
            ) : (
              <>
                <CreditCard className="w-3.5 h-3.5 mr-1.5" />
                Pay $29.99 and Export
              </>
            )}
          </Button>
        </DialogFooter>

        <p
          className="text-center font-mono text-[10px] text-muted-foreground/50 -mt-1"
          data-ocid="backup-stripe-note"
        >
          Secured by Stripe. You'll be redirected to complete payment.
        </p>
      </DialogContent>
    </Dialog>
  );
}

// ─── BackupProgressModal ───────────────────────────────────────────────────────
// Shows progress while ZIP is being generated. Auto-starts on open.

interface BackupProgressProps {
  open: boolean;
  onClose: () => void;
  autoStart?: boolean;
}

export function BackupProgressModal({
  open,
  onClose,
  autoStart = false,
}: BackupProgressProps) {
  const [progress, setProgress] = useState<ZipProgress | null>(null);
  const [done, setDone] = useState(false);
  const downloadZip = useDownloadBackupZip();

  async function startExport() {
    if (downloadZip.isPending || done) return;
    try {
      await downloadZip.mutateAsync({
        onProgress: (p) => setProgress(p),
      });
      setDone(true);
      toast.success("Backup downloaded!", {
        description: "Your complete listing archive has been saved.",
      });
      setTimeout(onClose, 2000);
    } catch (err) {
      toast.error("Export failed", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
      onClose();
    }
  }

  if (autoStart && open && !downloadZip.isPending && !done) {
    void startExport();
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-sm bg-card border-primary/30 neon-border-blue">
        <DialogHeader>
          <DialogTitle className="font-display text-base tracking-wide text-foreground uppercase flex items-center gap-2">
            {done ? (
              <>
                <span className="text-green-400">✓</span>
                Backup Complete!
              </>
            ) : (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                Building Your Backup…
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="py-2 space-y-3">
          {progress && !done && (
            <div className="space-y-2">
              <p className="font-mono text-xs text-muted-foreground">
                {progress.message}
              </p>
              {progress.total > 0 && (
                <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (progress.current / progress.total) * 100)}%`,
                    }}
                  />
                </div>
              )}
              {progress.total > 0 && (
                <p className="font-mono text-[10px] text-muted-foreground/60 text-right">
                  {progress.current} / {progress.total} images
                </p>
              )}
            </div>
          )}
          {!progress && !done && (
            <div className="flex items-center gap-2 animate-pulse">
              <span className="text-primary">⚡</span>
              <p className="font-mono text-xs text-muted-foreground">
                Preparing export…
              </p>
            </div>
          )}
          {done && (
            <p className="font-mono text-xs text-green-400">
              ✓ Your listing archive has been saved to your device.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

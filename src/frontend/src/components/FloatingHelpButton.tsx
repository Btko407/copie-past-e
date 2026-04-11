import { Button } from "@/components/ui/button";
import { useSubmitTicket } from "@/hooks/useSupportTickets";
import { useLocation } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SUBJECTS = [
  "Account Issue",
  "Billing Question",
  "Technical Problem",
  "Listing Issue",
  "Other",
] as const;

type Subject = (typeof SUBJECTS)[number];

interface SupportModalProps {
  onClose: () => void;
}

function SupportModal({ onClose }: SupportModalProps) {
  const [subject, setSubject] = useState<Subject>("Account Issue");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { submit, loading, success } = useSubmitTicket();
  const dialogRef = useRef<HTMLDivElement>(null);

  // Trap focus and close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleSubmit = async () => {
    if (!message.trim()) {
      setErrorMsg("Please enter a message.");
      return;
    }
    setErrorMsg("");
    try {
      await submit(subject, message.trim());
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to send message.",
      );
    }
  };

  return (
    <dialog
      open
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-background/80 backdrop-blur-sm m-0 max-w-none max-h-none w-full h-full border-0 bg-transparent"
      aria-label="Contact Support"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="w-full max-w-md bg-card neon-border-blue rounded-xl p-6 relative outline-none"
        style={{
          boxShadow:
            "0 0 40px oklch(0.65 0.22 262 / 0.15), 0 8px 32px oklch(0 0 0 / 0.5)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-sm font-bold tracking-wider text-foreground text-glow-blue uppercase">
              Contact Support
            </h2>
            <p className="font-mono text-[10px] text-muted-foreground mt-0.5 tracking-wide">
              We'll reply through your notification center
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-smooth"
            aria-label="Close support form"
            data-ocid="support-modal-close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {success ? (
          <div className="py-6 text-center space-y-3">
            <div className="text-3xl">⚡</div>
            <p className="font-display text-sm font-bold text-primary text-glow-blue tracking-wider uppercase">
              Message Received
            </p>
            <p className="font-mono text-xs text-muted-foreground leading-relaxed">
              Your message has been received. We will respond through your
              notification center.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 font-mono text-xs"
              onClick={onClose}
              data-ocid="support-success-close"
            >
              Close
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Subject */}
            <div>
              <label
                htmlFor="support-subject"
                className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5"
              >
                Subject
              </label>
              <select
                id="support-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value as Subject)}
                className="w-full bg-secondary border border-border rounded-md px-3 py-2 font-mono text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                data-ocid="support-subject-select"
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="support-message"
                className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5"
              >
                Message
              </label>
              <textarea
                id="support-message"
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 1000))}
                placeholder="Describe your issue..."
                rows={5}
                className="w-full bg-secondary border border-border rounded-md px-3 py-2 font-mono text-xs text-foreground resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary placeholder:text-muted-foreground/50"
                data-ocid="support-message-textarea"
              />
              <p className="font-mono text-[10px] text-muted-foreground/60 text-right mt-1">
                {message.length}/1000
              </p>
            </div>

            {errorMsg && (
              <p className="font-mono text-xs text-destructive">{errorMsg}</p>
            )}

            <Button
              onClick={handleSubmit}
              disabled={loading || !message.trim()}
              className="w-full font-mono text-xs tracking-widest uppercase"
              data-ocid="support-submit-btn"
            >
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </div>
        )}
      </div>
    </dialog>
  );
}

export function FloatingHelpButton() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Hide on admin pages
  const isAdminPage = location.pathname.startsWith("/admin");
  if (isAdminPage) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[100] w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg transition-smooth hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background neon-border-blue glow-blue-sm"
        aria-label="Contact support"
        data-ocid="floating-help-btn"
      >
        <span className="font-display text-lg font-black text-primary-foreground leading-none">
          ?
        </span>
      </button>
      {open && <SupportModal onClose={() => setOpen(false)} />}
    </>
  );
}

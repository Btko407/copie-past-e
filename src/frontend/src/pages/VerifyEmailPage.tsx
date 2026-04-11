import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  Clock,
  Mail,
  RefreshCw,
  Shield,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useEmailVerification } from "../hooks/useEmailVerification";

// ─── Sub-components ───────────────────────────────────────────────────────────

function VerifyHeader() {
  return (
    <header className="relative z-10 w-full bg-card/60 backdrop-blur-md border-b border-primary/20 py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center gap-2">
        <Zap className="w-5 h-5 text-primary" strokeWidth={2.5} />
        <span className="font-display text-xl font-bold text-primary text-glow-blue tracking-wide">
          COPIE PAST-E
        </span>
      </div>
    </header>
  );
}

function SuccessCard({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-card/80 backdrop-blur-md rounded-lg p-8 neon-border-blue glow-blue-sm flex flex-col items-center text-center gap-6"
    >
      <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/40 flex items-center justify-center glow-yellow">
        <CheckCircle2 className="w-10 h-10 text-accent" strokeWidth={1.5} />
      </div>
      <div className="space-y-2">
        <h2 className="font-display text-2xl font-bold text-accent tracking-wider">
          EMAIL VERIFIED
        </h2>
        <p className="text-muted-foreground font-body text-sm leading-relaxed max-w-xs">
          Your account is now active. Your free 30-day trial has started — the
          DeLorean is fueled and ready.
        </p>
      </div>
      <div className="w-full bg-muted/50 rounded p-3 border border-accent/20 text-left space-y-1">
        <p className="font-display text-xs font-bold text-accent tracking-wide">
          FREE TRIAL STARTED
        </p>
        <p className="text-muted-foreground text-xs font-body">
          30 days · No credit card required · All features included
        </p>
      </div>
      <Button
        onClick={onContinue}
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-display text-sm font-bold tracking-widest uppercase h-11 transition-smooth"
        data-ocid="verify-success-continue"
      >
        Go to Dashboard
      </Button>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const {
    email,
    status,
    errorMessage,
    resendCount,
    cooldownRemaining,
    initiateVerification,
    submitToken,
    resend,
    isLoading,
  } = useEmailVerification();

  const [inputEmail, setInputEmail] = useState("");
  const [token, setToken] = useState("");
  const tokenInputRef = useRef<HTMLInputElement>(null);

  // Focus token field when we reach the 'sent' step
  useEffect(() => {
    if (status === "sent") {
      setTimeout(() => tokenInputRef.current?.focus(), 300);
    }
  }, [status]);

  // Redirect on verified
  useEffect(() => {
    if (status === "verified") {
      const timer = setTimeout(() => {
        toast.success("Welcome aboard! Your 30-day free trial has started.", {
          duration: 5000,
          icon: "⚡",
        });
        navigate({ to: "/dashboard" });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail.trim()) return;
    await initiateVerification(inputEmail.trim());
  };

  const handleVerifyToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;
    const ok = await submitToken(token.trim());
    if (!ok && errorMessage) {
      toast.error(errorMessage, { duration: 4000 });
    }
  };

  const handleResend = async () => {
    await resend();
    if (!errorMessage) {
      toast.success("Verification email resent.", { duration: 3000 });
    }
  };

  const canResend =
    cooldownRemaining === 0 && resendCount < 3 && status === "sent";
  const resendsLeft = 3 - resendCount;

  return (
    <div
      className="min-h-screen bg-background flex flex-col overflow-hidden"
      data-ocid="verify-email-page"
    >
      {/* Background effects */}
      <div className="fixed inset-0 retro-grid opacity-40 pointer-events-none" />
      <div className="fixed inset-0 scanlines opacity-30 pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] rounded-full bg-accent/5 blur-[80px]" />
      </div>

      <VerifyHeader />

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {status === "verified" ? (
            <SuccessCard onContinue={() => navigate({ to: "/dashboard" })} />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="bg-card/80 backdrop-blur-md neon-border-blue rounded-lg p-8 glow-blue-sm flex flex-col gap-6"
            >
              {/* Icon + title */}
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-16 h-16 rounded-full bg-primary/10 neon-border-blue flex items-center justify-center">
                  <Mail
                    className="w-8 h-8 text-primary text-glow-blue"
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <h1 className="font-display text-2xl font-bold text-primary text-glow-blue tracking-wider">
                    VERIFY EMAIL
                  </h1>
                  <p className="text-muted-foreground text-sm font-body mt-1">
                    {status === "idle" || status === "sending"
                      ? "Enter your email to activate your account"
                      : `Confirmation sent to ${email}`}
                  </p>
                </div>
              </div>

              {/* Step 1: Email input */}
              {(status === "idle" ||
                status === "sending" ||
                status === "error") && (
                <form
                  onSubmit={handleSendEmail}
                  className="flex flex-col gap-4"
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="email-input"
                      className="font-display text-xs tracking-widest text-foreground/70 uppercase"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email-input"
                      type="email"
                      placeholder="you@example.com"
                      value={inputEmail}
                      onChange={(e) => setInputEmail(e.target.value)}
                      className="bg-muted/50 border-border focus:border-primary font-body"
                      autoComplete="email"
                      required
                      data-ocid="verify-email-input"
                    />
                  </div>

                  {errorMessage && (
                    <p className="text-destructive text-xs font-body">
                      {errorMessage}
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading || !inputEmail.trim()}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display text-sm font-bold tracking-widest uppercase h-11 glow-blue neon-border-blue transition-smooth"
                    data-ocid="verify-send-btn"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Send Verification Email
                      </span>
                    )}
                  </Button>
                </form>
              )}

              {/* Step 2: Token entry */}
              {status === "sent" || status === "verifying" ? (
                <form
                  onSubmit={handleVerifyToken}
                  className="flex flex-col gap-4"
                >
                  {/* Info banner */}
                  <div className="bg-primary/5 border border-primary/20 rounded p-3 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <p className="text-foreground/80 text-xs font-body leading-relaxed">
                      Check your inbox for a verification code and enter it
                      below.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="token-input"
                      className="font-display text-xs tracking-widest text-foreground/70 uppercase"
                    >
                      Verification Code
                    </Label>
                    <Input
                      id="token-input"
                      ref={tokenInputRef}
                      type="text"
                      placeholder="Enter code from email"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      className="bg-muted/50 border-border focus:border-primary font-mono text-center tracking-widest text-lg"
                      autoComplete="one-time-code"
                      required
                      data-ocid="verify-token-input"
                    />
                  </div>

                  {errorMessage && (
                    <p className="text-destructive text-xs font-body">
                      {errorMessage}
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading || !token.trim()}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display text-sm font-bold tracking-widest uppercase h-11 glow-blue neon-border-blue transition-smooth"
                    data-ocid="verify-token-btn"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                        Verifying...
                      </span>
                    ) : (
                      "Verify Email"
                    )}
                  </Button>

                  {/* Resend section */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-muted-foreground text-xs font-body">
                      {resendsLeft > 0
                        ? `${resendsLeft} resend${resendsLeft !== 1 ? "s" : ""} remaining`
                        : "No resends left"}
                    </span>
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={!canResend}
                      className="flex items-center gap-1.5 text-xs font-display tracking-wide text-primary hover:text-accent disabled:opacity-40 disabled:cursor-not-allowed transition-smooth"
                      data-ocid="verify-resend-btn"
                    >
                      {cooldownRemaining > 0 ? (
                        <>
                          <Clock className="w-3.5 h-3.5" />
                          Resend in {cooldownRemaining}s
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3.5 h-3.5" />
                          Resend Email
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : null}

              <p className="text-muted-foreground text-xs font-body text-center">
                Secure verification — your email is only used for account access
              </p>
            </motion.div>
          )}
        </div>
      </main>

      <footer className="relative z-10 bg-card/60 border-t border-border/50 py-4 px-6">
        <p className="text-center text-muted-foreground text-xs font-body">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-accent transition-smooth hover:underline underline-offset-2"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}

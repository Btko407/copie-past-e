import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { EMAIL_ENABLED } from "@/hooks/useEmailVerification";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "@tanstack/react-router";
import { Clock, Copy, Shield, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

const features = [
  {
    icon: Zap,
    label: "Instant Import",
    desc: "Capture any listing in seconds",
  },
  {
    icon: Shield,
    label: "Stored Forever",
    desc: "Your listings never disappear",
  },
  {
    icon: Copy,
    label: "One-Click Reuse",
    desc: "Copy and paste at lightning speed",
  },
  {
    icon: Clock,
    label: "Time Travel",
    desc: "Access your full listing history",
  },
];

export function LoginPage() {
  const { isAuthenticated, isInitializing, login } = useAuth();
  const { profile, isLoading: isProfileLoading } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) return;
    if (isProfileLoading) return;

    // If email verification is enabled and profile exists but email is not verified,
    // send to verification screen. Otherwise go straight to dashboard.
    if (EMAIL_ENABLED && profile && !profile.emailVerified) {
      navigate({ to: "/verify-email" });
    } else {
      navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, isProfileLoading, profile, navigate]);

  return (
    <div
      className="min-h-screen bg-background flex flex-col overflow-hidden"
      data-ocid="login-page"
    >
      {/* Retro grid background */}
      <div className="fixed inset-0 retro-grid opacity-40 pointer-events-none" />

      {/* Scanline overlay */}
      <div className="fixed inset-0 scanlines opacity-30 pointer-events-none" />

      {/* Radial accent glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-accent/5 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full bg-card/60 backdrop-blur-md border-b border-primary/20 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" strokeWidth={2.5} />
          <span className="font-display text-xl font-bold text-primary text-glow-blue tracking-wide">
            COPIE PAST-E
          </span>
        </div>
      </header>

      {/* Hero banner */}
      <div className="relative z-10 w-full overflow-hidden h-40 sm:h-52 border-b border-primary/20">
        <img
          src="/assets/generated/hero-time-travel.dim_900x400.jpg"
          alt="Retro-futuristic time travel visualization"
          className="w-full h-full object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
      </div>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="bg-card/80 backdrop-blur-md neon-border-blue rounded-lg p-8 glow-blue-sm flex flex-col items-center text-center gap-6"
          >
            {/* Logo mark */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-20 h-20 rounded-full bg-primary/10 neon-border-blue flex items-center justify-center glow-blue"
            >
              <Zap
                className="w-10 h-10 text-primary text-glow-blue"
                strokeWidth={1.5}
              />
            </motion.div>

            {/* Title */}
            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display text-3xl font-bold text-primary text-glow-blue tracking-wider"
              >
                COPIE PAST-E
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground font-body text-sm tracking-wide"
              >
                Capture your listings forever
              </motion.p>
            </div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-foreground/70 font-body text-sm leading-relaxed max-w-xs"
            >
              Import marketplace listings, store them permanently, and reuse
              them at lightning speed.
            </motion.p>

            {/* Login button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="w-full"
            >
              <Button
                onClick={login}
                disabled={
                  isInitializing || (isAuthenticated && isProfileLoading)
                }
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display text-sm font-bold tracking-widest uppercase glow-blue neon-border-blue transition-smooth h-12"
                data-ocid="login-btn"
              >
                {isInitializing || (isAuthenticated && isProfileLoading) ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                    {isInitializing ? "Initializing..." : "Loading..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Login with Internet Identity
                  </span>
                )}
              </Button>
            </motion.div>

            <p className="text-muted-foreground text-xs font-body">
              Secure, decentralized authentication — no passwords
            </p>
          </motion.div>

          {/* Feature grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-2 gap-3 mt-6"
          >
            {features.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="bg-card/50 backdrop-blur-sm neon-border-blue rounded p-3 flex items-start gap-3 group hover:glow-blue-sm transition-smooth"
              >
                <Icon className="w-4 h-4 text-primary mt-0.5 shrink-0 group-hover:text-glow-blue transition-smooth" />
                <div className="min-w-0">
                  <p className="font-display text-xs font-bold text-foreground/90 tracking-wide">
                    {label}
                  </p>
                  <p className="text-muted-foreground text-xs mt-0.5 leading-tight">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
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

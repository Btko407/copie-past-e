import { createActor } from "@/backend";
import { useAuth } from "@/hooks/useAuth";
import { useMaintenanceMode } from "@/hooks/useMaintenanceMode";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

// MaintenancePage is rendered at /maintenance.
// Admin users are redirected to /admin immediately.
// The route is NOT behind ProtectedRoute — even logged-out users see it.

export function MaintenancePage() {
  const { message, eta } = useMaintenanceMode();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { actor, isFetching } = useActor(createActor);

  const { data: isAdmin = false } = useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });

  // Admins bypass the maintenance page
  useEffect(() => {
    if (isAdmin) {
      navigate({ to: "/admin" });
    }
  }, [isAdmin, navigate]);

  if (isAdmin) return null;

  const displayMessage =
    message ||
    "Copie Past-e is temporarily down for maintenance. We will be back shortly. Thank you for your patience.";

  return (
    <div
      className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden"
      data-ocid="maintenance-page"
    >
      {/* Retro grid bg */}
      <div className="absolute inset-0 retro-grid opacity-20 pointer-events-none" />

      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0.95 0 0) 2px, oklch(0.95 0 0) 4px)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full space-y-8">
        {/* Lightning bolt animation */}
        <div
          className="text-6xl animate-pulse"
          aria-hidden="true"
          style={{ filter: "drop-shadow(0 0 20px oklch(0.65 0.22 262 / 0.8))" }}
        >
          ⚡
        </div>

        {/* Brand */}
        <div className="space-y-1">
          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-widest text-primary text-glow-blue uppercase">
            COPIE PAST-E
          </h1>
          <p className="font-mono text-[10px] tracking-[0.3em] text-accent/70 uppercase">
            System Maintenance
          </p>
        </div>

        {/* Message card */}
        <div
          className="w-full rounded-xl bg-card neon-border-blue p-6 space-y-4"
          style={{
            boxShadow:
              "0 0 40px oklch(0.65 0.22 262 / 0.1), 0 4px 24px oklch(0 0 0 / 0.4)",
          }}
        >
          <p className="font-mono text-sm text-foreground leading-relaxed">
            {displayMessage}
          </p>

          {eta && (
            <div className="border-t border-border/50 pt-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                Estimated Return
              </p>
              <p className="font-mono text-sm text-accent text-glow-yellow">
                {eta}
              </p>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <p className="font-mono text-[10px] text-muted-foreground/50 tracking-widest uppercase">
          Please check back soon
        </p>
      </div>
    </div>
  );
}

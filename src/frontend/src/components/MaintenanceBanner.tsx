import { useMaintenanceMode } from "@/hooks/useMaintenanceMode";
import { Zap } from "lucide-react";

export function MaintenanceBanner() {
  const { isActive, toggle } = useMaintenanceMode();

  if (!isActive) return null;

  return (
    <div
      className="w-full bg-accent/20 border-b border-accent/40 px-4 py-2 flex items-center justify-between gap-3 flex-wrap"
      role="alert"
      data-ocid="maintenance-banner"
    >
      <div className="flex items-center gap-2 min-w-0">
        <Zap className="w-4 h-4 text-accent shrink-0" />
        <p className="font-mono text-xs text-accent-foreground tracking-wide">
          <span className="font-bold">Maintenance mode is ON.</span> Users
          cannot access the site.
        </p>
      </div>
      <button
        type="button"
        onClick={() => toggle(false, "", "")}
        className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-accent border border-accent/50 rounded px-3 py-1.5 hover:bg-accent/20 transition-smooth focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent min-h-[36px]"
        data-ocid="maintenance-banner-turn-off"
      >
        Turn Off
      </button>
    </div>
  );
}

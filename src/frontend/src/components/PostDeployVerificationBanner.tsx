import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { createActor } from "../backend";
import { useHealthStatus } from "../hooks/useHealthCheck";

const SESSION_DISMISS_KEY = "post_deploy_banner_dismissed";

export function PostDeployVerificationBanner() {
  const { data: health } = useHealthStatus();
  const { actor, isFetching } = useActor(createActor);

  const { data: isAdmin } = useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });

  const [dismissed, setDismissed] = useState<boolean>(
    () => sessionStorage.getItem(SESSION_DISMISS_KEY) === "true",
  );

  function handleDismiss() {
    sessionStorage.setItem(SESSION_DISMISS_KEY, "true");
    setDismissed(true);
  }

  // Only show to admins when critical keys are missing and not dismissed
  if (
    !isAdmin ||
    dismissed ||
    !health ||
    health.criticalKeysPresent !== false
  ) {
    return null;
  }

  return (
    <div
      role="alert"
      className="relative z-50 flex items-center gap-3 px-4 py-3 bg-accent/10 border-b border-accent/40 text-accent"
      data-ocid="post-deploy-banner"
    >
      <AlertTriangle className="w-4 h-4 shrink-0" />
      <p className="font-mono text-xs flex-1 min-w-0">
        <span className="font-bold">Deploy verification:</span> Some payment
        settings are missing. Restore from backup if unexpected.{" "}
        <Link
          to="/admin/payments"
          className="underline underline-offset-2 hover:text-accent/80 transition-colors"
        >
          Check admin → Payments
        </Link>
      </p>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss banner"
        className="shrink-0 p-1 rounded hover:bg-accent/20 transition-colors"
        data-ocid="dismiss-deploy-banner-btn"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

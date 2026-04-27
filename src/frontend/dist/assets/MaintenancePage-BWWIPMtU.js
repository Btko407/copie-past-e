import { af as useMaintenanceMode, u as useNavigate, h as useAuth, b as useActor, i as useQuery, r as reactExports, j as jsxRuntimeExports, f as createActor } from "./index-wfeVo5SS.js";
function MaintenancePage() {
  const { message, eta } = useMaintenanceMode();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { actor, isFetching } = useActor(createActor);
  const { data: isAdmin = false } = useQuery({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && isAuthenticated
  });
  reactExports.useEffect(() => {
    if (isAdmin) {
      navigate({ to: "/admin" });
    }
  }, [isAdmin, navigate]);
  if (isAdmin) return null;
  const displayMessage = message || "Copie Past-e is temporarily down for maintenance. We will be back shortly. Thank you for your patience.";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden",
      "data-ocid": "maintenance-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 retro-grid opacity-20 pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 pointer-events-none opacity-[0.025]",
            style: {
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0.95 0 0) 2px, oklch(0.95 0 0) 4px)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex flex-col items-center text-center max-w-md w-full space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-6xl animate-pulse",
              "aria-hidden": "true",
              style: { filter: "drop-shadow(0 0 20px oklch(0.65 0.22 262 / 0.8))" },
              children: "⚡"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl sm:text-3xl font-black tracking-widest text-primary text-glow-blue uppercase", children: "COPIE PAST-E" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] tracking-[0.3em] text-accent/70 uppercase", children: "System Maintenance" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "w-full rounded-xl bg-card neon-border-blue p-6 space-y-4",
              style: {
                boxShadow: "0 0 40px oklch(0.65 0.22 262 / 0.1), 0 4px 24px oklch(0 0 0 / 0.4)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-foreground leading-relaxed", children: displayMessage }),
                eta && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/50 pt-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1", children: "Estimated Return" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-accent text-glow-yellow", children: eta })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground/50 tracking-widest uppercase", children: "Please check back soon" })
        ] })
      ]
    }
  );
}
export {
  MaintenancePage
};

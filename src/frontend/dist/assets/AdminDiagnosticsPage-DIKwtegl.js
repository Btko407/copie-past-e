import { c as createLucideIcon, j as jsxRuntimeExports, u as useActor, r as reactExports, k as useQuery, S as Skeleton, B as Button, ak as RefreshCw, y as Shield, Z as Zap, C as CircleCheck, T as TriangleAlert, e as createActor } from "./index-CDYDluDX.js";
import { A as AdminLayout, D as Database } from "./AdminLayout-BjK6RzTr.js";
import { B as Badge } from "./badge-tMJODRQh.js";
import { P as Package } from "./package-BhHZQZB-.js";
import { H as HardDrive } from "./hard-drive-BMSB5VXJ.js";
import { C as CircleX } from "./circle-x-bAaUQV7d.js";
import "./credit-card-BORXzGfX.js";
import "./trash-2-B9mOI9ri.js";
import "./dollar-sign-rpn8AkE2.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "20", height: "8", x: "2", y: "2", rx: "2", ry: "2", key: "ngkwjq" }],
  ["rect", { width: "20", height: "8", x: "2", y: "14", rx: "2", ry: "2", key: "iecqi9" }],
  ["line", { x1: "6", x2: "6.01", y1: "6", y2: "6", key: "16zg32" }],
  ["line", { x1: "6", x2: "6.01", y1: "18", y2: "18", key: "nzw8ys" }]
];
const Server = createLucideIcon("server", __iconNode);
function HealthIcon({ level }) {
  if (level === "ok")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-green-400 shrink-0" });
  if (level === "warn")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-accent shrink-0" });
  if (level === "error")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4 text-destructive shrink-0" });
  if (level === "loading")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5 animate-spin text-muted-foreground shrink-0" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 rounded-full border-2 border-muted-foreground/30 shrink-0" });
}
function HealthBadge({ level, label }) {
  const cls = level === "ok" ? "text-green-400 border-green-400/40 bg-green-400/5" : level === "warn" ? "text-accent border-accent/40 bg-accent/5" : level === "error" ? "text-destructive border-destructive/40 bg-destructive/5" : "text-muted-foreground border-border/30";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Badge,
    {
      variant: "outline",
      className: `font-mono text-[10px] gap-1 shrink-0 ${cls}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(HealthIcon, { level }),
        label
      ]
    }
  );
}
function DiagSection({
  title,
  subtitle,
  icon: Icon,
  level,
  onRecheck,
  recheckLabel = "Recheck",
  loading = false,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-xl border border-border/40 bg-card overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border/50 bg-card/80 flex items-center justify-between gap-4 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs font-bold tracking-widest uppercase text-foreground", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground mt-0.5", children: subtitle })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          HealthBadge,
          {
            level,
            label: level === "ok" ? "Healthy" : level === "warn" ? "Warning" : level === "error" ? "Error" : level === "loading" ? "Checking…" : "Unknown"
          }
        ),
        onRecheck && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: onRecheck,
            disabled: loading,
            className: "font-mono text-[10px] h-7 px-2 gap-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                RefreshCw,
                {
                  className: `w-3 h-3 ${loading ? "animate-spin" : ""}`
                }
              ),
              recheckLabel
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 space-y-2", children })
  ] });
}
function DiagRow({
  label,
  value,
  level = "unknown",
  mono = true
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 rounded-lg bg-secondary/10 border border-border/20 px-4 py-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground shrink-0", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(HealthIcon, { level }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: `${mono ? "font-mono" : "font-body"} text-xs text-foreground truncate`,
          children: value
        }
      )
    ] })
  ] });
}
function ExtensionHealthSection() {
  const { actor, isFetching } = useActor(createActor);
  const enabled = !!actor && !isFetching;
  const [zipChecked, setZipChecked] = reactExports.useState(false);
  const [zipOk, setZipOk] = reactExports.useState(false);
  const [zipChecking, setZipChecking] = reactExports.useState(false);
  const {
    data: latestVersion,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["latestExtensionVersion"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      return actor.getLatestExtensionVersion();
    },
    enabled
  });
  const version = (latestVersion == null ? void 0 : latestVersion.latestVersion) ?? "—";
  const buildNum = (latestVersion == null ? void 0 : latestVersion.buildNumber) ?? "—";
  const downloadUrl = (latestVersion == null ? void 0 : latestVersion.downloadUrl) ?? `/copie-paste-extension-v${version}.zip`;
  const releasedAt = latestVersion == null ? void 0 : latestVersion.releasedAt;
  const buildTime = releasedAt ? new Date(Number(releasedAt) / 1e6).toLocaleString() : "—";
  async function checkZip() {
    setZipChecking(true);
    try {
      const res = await fetch(downloadUrl, { method: "HEAD" });
      setZipOk(res.ok);
    } catch {
      setZipOk(false);
    } finally {
      setZipChecked(true);
      setZipChecking(false);
    }
  }
  const zipLevel = zipChecking ? "loading" : !zipChecked ? "unknown" : zipOk ? "ok" : "error";
  const overallLevel = isLoading ? "loading" : version === "—" ? "warn" : zipChecked && !zipOk ? "error" : "ok";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DiagSection,
    {
      title: "Extension Health",
      subtitle: "ZIP availability, manifest version, and last build",
      icon: Package,
      level: overallLevel,
      onRecheck: () => {
        void refetch();
        void checkZip();
      },
      loading: isLoading || zipChecking,
      children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full bg-primary/5" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DiagRow, { label: "Current Version", value: `v${version}`, level: "ok" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DiagRow, { label: "Build #", value: `#${buildNum}`, level: "ok" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DiagRow, { label: "Last Build", value: buildTime, level: "ok" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DiagRow, { label: "Local ZIP", value: downloadUrl, level: zipLevel }),
        !zipChecked && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: checkZip,
            disabled: zipChecking,
            className: "font-mono text-[10px] gap-1 mt-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                RefreshCw,
                {
                  className: `w-3 h-3 ${zipChecking ? "animate-spin" : ""}`
                }
              ),
              "Check ZIP availability"
            ]
          }
        )
      ] })
    }
  );
}
function BackendHealthSection() {
  const { actor, isFetching } = useActor(createActor);
  const enabled = !!actor && !isFetching;
  const {
    data: health,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["healthStatus"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const a = actor;
      if (typeof a.getHealthStatus === "function") return a.getHealthStatus();
      return null;
    },
    enabled,
    staleTime: 0
  });
  const h = health;
  const overallLevel = isLoading ? "loading" : !h ? "warn" : h.status === "ok" ? "ok" : "warn";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DiagSection,
    {
      title: "Backend API",
      subtitle: "Canister health and backend.did freshness",
      icon: Server,
      level: overallLevel,
      onRecheck: () => void refetch(),
      loading: isLoading,
      children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full bg-primary/5" }) : !h ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        DiagRow,
        {
          label: "Health API",
          value: "getHealthStatus not yet deployed — backend is reachable",
          level: "warn"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DiagRow,
          {
            label: "Canister Status",
            value: String(h.status ?? "ok"),
            level: h.status === "ok" ? "ok" : "warn"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DiagRow,
          {
            label: "Keys Configured",
            value: h.keysConfigured ? "Yes" : "Missing — check Stripe/Gemini config",
            level: h.keysConfigured ? "ok" : "warn"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DiagRow,
          {
            label: "Critical Keys Present",
            value: h.criticalKeysPresent ? "Yes" : "No",
            level: h.criticalKeysPresent ? "ok" : "error"
          }
        )
      ] })
    }
  );
}
function StripeHealthSection() {
  const { actor, isFetching } = useActor(createActor);
  const enabled = !!actor && !isFetching;
  const {
    data: stripeHealth,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["stripeHealthStatus"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      return actor.getStripeHealthStatus();
    },
    enabled
  });
  const sh = stripeHealth;
  const keysOk = (sh == null ? void 0 : sh.keysConfigured) ?? false;
  const hasPrices = (sh == null ? void 0 : sh.status) !== "no_price_ids" && (sh == null ? void 0 : sh.status) !== "keys_only";
  const overallLevel = isLoading ? "loading" : !sh ? "warn" : !keysOk ? "error" : !hasPrices ? "warn" : "ok";
  const mode = (sh == null ? void 0 : sh.isTestMode) === false ? "live" : "test";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DiagSection,
    {
      title: "Stripe Config",
      subtitle: "Secret key, publishable key, and price IDs",
      icon: Shield,
      level: overallLevel,
      onRecheck: () => void refetch(),
      loading: isLoading,
      children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full bg-primary/5" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DiagRow,
          {
            label: "Mode",
            value: mode.toUpperCase(),
            level: mode === "live" ? "ok" : "warn"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DiagRow,
          {
            label: "Secret Key",
            value: keysOk ? "Configured ●●●●●●" : "Missing — payments will fail",
            level: keysOk ? "ok" : "error"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DiagRow,
          {
            label: "Publishable Key",
            value: keysOk ? "Configured" : "Missing",
            level: keysOk ? "ok" : "error"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DiagRow,
          {
            label: "Price IDs",
            value: hasPrices ? "Configured" : "Missing — subscription creation will fail",
            level: hasPrices ? "ok" : "warn"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DiagRow,
          {
            label: "Payment Verification",
            value: "Polling (ICP architecture — no webhooks)",
            level: "ok"
          }
        ),
        (sh == null ? void 0 : sh.lastCheckoutTestResult) !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          DiagRow,
          {
            label: "Last Checkout Test",
            value: String(sh.lastCheckoutTestResult),
            level: String(sh.lastCheckoutTestResult).toLowerCase().includes("ok") ? "ok" : "warn"
          }
        )
      ] })
    }
  );
}
function GeminiHealthSection() {
  const { actor, isFetching } = useActor(createActor);
  const enabled = !!actor && !isFetching;
  const {
    data: geminiHealth,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["geminiHealthStatus"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const a = actor;
      if (typeof a.getGeminiHealthStatus === "function")
        return a.getGeminiHealthStatus();
      if (typeof a.getHealthStatus === "function") {
        const h = await a.getHealthStatus();
        return { apiKeyConfigured: h == null ? void 0 : h.keysConfigured, lastTestResult: null };
      }
      return null;
    },
    enabled
  });
  const gh = geminiHealth;
  const apiKeyOk = (gh == null ? void 0 : gh.apiKeyConfigured) ?? false;
  const overallLevel = isLoading ? "loading" : !gh ? "warn" : apiKeyOk ? "ok" : "warn";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DiagSection,
    {
      title: "Gemini / OCR",
      subtitle: "API key configuration and last OCR test",
      icon: Zap,
      level: overallLevel,
      onRecheck: () => void refetch(),
      loading: isLoading,
      children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full bg-primary/5" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DiagRow,
          {
            label: "API Key",
            value: apiKeyOk ? "Configured ●●●●●●" : "Not configured — Smart OCR disabled",
            level: apiKeyOk ? "ok" : "warn"
          }
        ),
        (gh == null ? void 0 : gh.lastTestResult) !== void 0 && (gh == null ? void 0 : gh.lastTestResult) !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(
          DiagRow,
          {
            label: "Last OCR Test",
            value: String(gh.lastTestResult),
            level: String(gh.lastTestResult).toLowerCase().includes("ok") ? "ok" : "warn"
          }
        )
      ] })
    }
  );
}
function BackupHealthSection() {
  const { actor, isFetching } = useActor(createActor);
  const enabled = !!actor && !isFetching;
  const {
    data: health,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["healthStatus"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const a = actor;
      if (typeof a.getHealthStatus === "function") return a.getHealthStatus();
      return null;
    },
    enabled,
    staleTime: 0
  });
  const h = health;
  const backupCount = h ? Number(h.backupCount ?? 0) : 0;
  const lastBackupAt = (h == null ? void 0 : h.lastBackupAt) ? (() => {
    const ms = Number(h.lastBackupAt) / 1e6;
    return ms > 0 ? new Date(ms).toLocaleString() : "No backups yet";
  })() : "—";
  const overallLevel = isLoading ? "loading" : backupCount === 0 ? "warn" : "ok";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DiagSection,
    {
      title: "Backup Health",
      subtitle: "Last backup timestamp, count, and pre-restore snapshot status",
      icon: HardDrive,
      level: overallLevel,
      onRecheck: () => void refetch(),
      loading: isLoading,
      children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full bg-primary/5" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DiagRow,
          {
            label: "Last Backup",
            value: lastBackupAt,
            level: lastBackupAt === "No backups yet" ? "warn" : "ok"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DiagRow,
          {
            label: "Stored Backups",
            value: `${backupCount} backup${backupCount !== 1 ? "s" : ""}`,
            level: backupCount > 0 ? "ok" : "warn"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DiagRow,
          {
            label: "Pre-restore Snapshot",
            value: "Auto-created before every restore (ICP architecture)",
            level: "ok"
          }
        )
      ] })
    }
  );
}
function StableMemorySection() {
  const { actor, isFetching } = useActor(createActor);
  const enabled = !!actor && !isFetching;
  const {
    data: stats,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["adminSystemStats"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const a = actor;
      if (typeof a.adminGetSystemStats === "function")
        return a.adminGetSystemStats();
      return null;
    },
    enabled
  });
  const s = stats;
  const overallLevel = isLoading ? "loading" : s ? "ok" : "warn";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DiagSection,
    {
      title: "Stable Memory",
      subtitle: "Current data counts for master listings, users, and subscriptions",
      icon: Database,
      level: overallLevel,
      onRecheck: () => void refetch(),
      loading: isLoading,
      children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full bg-primary/5" }) : !s ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        DiagRow,
        {
          label: "System Stats",
          value: "adminGetSystemStats not yet deployed",
          level: "warn"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        s.totalMasterListings !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          DiagRow,
          {
            label: "Master Listings",
            value: String(s.totalMasterListings),
            level: "ok"
          }
        ),
        s.totalUsers !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          DiagRow,
          {
            label: "Total Users",
            value: String(s.totalUsers),
            level: "ok"
          }
        ),
        s.totalSubscriptions !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          DiagRow,
          {
            label: "Active Subscriptions",
            value: String(s.totalSubscriptions),
            level: "ok"
          }
        ),
        s.totalListings !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          DiagRow,
          {
            label: "Legacy Listings",
            value: String(s.totalListings),
            level: "ok"
          }
        ),
        s.cyclesBalance !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          DiagRow,
          {
            label: "Canister Cycles",
            value: `${(Number(s.cyclesBalance) / 1e12).toFixed(3)}T`,
            level: Number(s.cyclesBalance) < 1e12 ? "warn" : "ok"
          }
        )
      ] })
    }
  );
}
function BuildDeploySection() {
  const { actor, isFetching } = useActor(createActor);
  const enabled = !!actor && !isFetching;
  const {
    data: latestVersion,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["latestExtensionVersion"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      return actor.getLatestExtensionVersion();
    },
    enabled
  });
  const v = latestVersion;
  const buildVersion = (v == null ? void 0 : v.latestVersion) ?? "—";
  const deployTs = (v == null ? void 0 : v.releasedAt) ? new Date(Number(v.releasedAt) / 1e6).toLocaleString() : "—";
  const overallLevel = isLoading ? "loading" : buildVersion === "—" ? "warn" : "ok";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DiagSection,
    {
      title: "Build / Deploy",
      subtitle: "Latest deploy timestamp and published build version",
      icon: Server,
      level: overallLevel,
      onRecheck: () => void refetch(),
      loading: isLoading,
      children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full bg-primary/5" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DiagRow,
          {
            label: "Build Version",
            value: `v${buildVersion}`,
            level: "ok"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DiagRow, { label: "Last Deploy", value: deployTs, level: "ok" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DiagRow,
          {
            label: "Backend Bindings",
            value: "Generated from backend.did — re-run pnpm bindgen after schema changes",
            level: "ok"
          }
        )
      ] })
    }
  );
}
function AdminDiagnosticsPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { title: "Diagnostics", subtitle: "System Health", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl space-y-8", "data-ocid": "admin-diagnostics-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs font-bold tracking-widest uppercase text-foreground", children: "System Health Dashboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground mt-1", children: "Real-time health checks for extension, backend, payments, OCR, backup, and stable memory. Each section shows green when fully configured, yellow when partially configured, red when missing or broken." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ExtensionHealthSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BackendHealthSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StripeHealthSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(GeminiHealthSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BackupHealthSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StableMemorySection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BuildDeploySection, {})
  ] }) });
}
export {
  AdminDiagnosticsPage
};

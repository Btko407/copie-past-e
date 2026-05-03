import { c as createLucideIcon, r as reactExports, u as useActor, k as useQuery, R as React, b as useMutation, j as jsxRuntimeExports, T as TriangleAlert, y as Shield, C as CircleCheck, B as Button, ak as RefreshCw, d as ue, Z as Zap, S as Skeleton, o as useNavigate, e as createActor } from "./index-CDYDluDX.js";
import { A as AdminLayout, D as Database, U as Users } from "./AdminLayout-BjK6RzTr.js";
import { B as Badge } from "./badge-tMJODRQh.js";
import { E as Eye } from "./eye-R7ZJDlq3.js";
import { H as HardDrive } from "./hard-drive-BMSB5VXJ.js";
import { D as Download } from "./download-DEXd4YsB.js";
import { L as LoaderCircle } from "./loader-circle-BkTHt6EF.js";
import { C as CircleX } from "./circle-x-bAaUQV7d.js";
import { C as CreditCard } from "./credit-card-BORXzGfX.js";
import "./trash-2-B9mOI9ri.js";
import "./dollar-sign-rpn8AkE2.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M9 17H7A5 5 0 0 1 7 7h2", key: "8i5ue5" }],
  ["path", { d: "M15 7h2a5 5 0 1 1 0 10h-2", key: "1b9ql8" }],
  ["line", { x1: "8", x2: "16", y1: "12", y2: "12", key: "1jonct" }]
];
const Link2 = createLucideIcon("link-2", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
      key: "cbrjhi"
    }
  ]
];
const Wrench = createLucideIcon("wrench", __iconNode);
function toNum(v) {
  if (v === null || v === void 0) return 0;
  return typeof v === "bigint" ? Number(v) : v;
}
function formatTs(ts) {
  if (!ts || ts === BigInt(0)) return "Never";
  return new Date(toNum(ts) / 1e6).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function formatBytes(b) {
  const n = toNum(b);
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}
function formatCycles(cycles) {
  return `${(Number(cycles) / 1e12).toFixed(2)} trillion`;
}
function getCyclesLevel(cycles) {
  if (!cycles) return "yellow";
  const c = Number(cycles);
  if (c < 1e11) return "red";
  if (c < 1e12) return "yellow";
  return "green";
}
function statusColor(level) {
  return {
    green: "border-l-[#22c55e] bg-[#22c55e]/5",
    yellow: "border-l-[#eab308] bg-[#eab308]/5",
    red: "border-l-[#ef4444] bg-[#ef4444]/5"
  }[level];
}
function componentStatusToLevel(s) {
  if (s === "healthy") return "green";
  if (s === "warning") return "yellow";
  return "red";
}
function StatusBadge({ level }) {
  const cfg = {
    green: {
      label: "OPERATIONAL",
      cls: "text-[#22c55e] border-[#22c55e]/50 bg-[#22c55e]/10"
    },
    yellow: {
      label: "WARNING",
      cls: "text-[#eab308] border-[#eab308]/50 bg-[#eab308]/10"
    },
    red: {
      label: "ERROR",
      cls: "text-[#ef4444] border-[#ef4444]/50 bg-[#ef4444]/10"
    }
  }[level];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Badge,
    {
      variant: "outline",
      className: `font-mono text-[9px] uppercase tracking-widest ${cfg.cls}`,
      children: cfg.label
    }
  );
}
function StatusIcon({ level }) {
  if (level === "green")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-[#22c55e] shrink-0" });
  if (level === "yellow")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-[#eab308] shrink-0" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4 text-[#ef4444] shrink-0" });
}
function DebugCard({
  icon,
  title,
  level,
  details,
  fixLabel,
  fixPath,
  onFixClick,
  fixLoading
}) {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `rounded-xl bg-card border-l-4 border border-border/40 p-5 flex flex-col gap-3 ${statusColor(level)}`,
      "data-ocid": "debugger-status-card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0", children: icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs font-bold uppercase tracking-wider text-foreground truncate", children: title })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { level })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: details.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { level: d.ok ? "green" : "red" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[11px] text-muted-foreground leading-tight", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: d.ok ? "text-foreground/80" : "text-[#ef4444]/90",
                children: d.label
              }
            ),
            d.info && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 text-muted-foreground", children: [
              "— ",
              d.info
            ] })
          ] })
        ] }, d.label)) }),
        fixLabel && (fixPath || onFixClick) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            className: "self-start font-mono text-[10px] uppercase tracking-widest h-7 px-3 border-border/60 hover:bg-secondary/40 transition-smooth",
            onClick: () => {
              if (onFixClick) onFixClick();
              else if (fixPath) navigate({ to: fixPath });
            },
            disabled: fixLoading,
            "data-ocid": `debugger-fix-${title.toLowerCase().replace(/\s+/g, "-")}`,
            children: [
              fixLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3 h-3 mr-1.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { className: "w-3 h-3 mr-1.5" }),
              fixLoading ? "Creating…" : fixLabel
            ]
          }
        )
      ]
    }
  );
}
function DebugCardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-card border border-border/40 p-5 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-20" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-4/5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-3/5" })
    ] })
  ] });
}
function useSystemHealth(refreshKey) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["systemHealth", refreshKey],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getSystemHealthStatus();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    retry: 1
  });
}
function useCyclesBalance(refreshKey) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["cyclesBalance", refreshKey],
    queryFn: async () => {
      var _a;
      if (!actor) return null;
      const result = await ((_a = actor.getCanisterCyclesBalance) == null ? void 0 : _a.call(actor));
      if (result === void 0 || result === null) return null;
      return result;
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    retry: 1
  });
}
function DiagnosticsTab({
  diagnostics,
  loading
}) {
  const [expandedIssue, setExpandedIssue] = reactExports.useState(null);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [0, 1, 2, 3].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(DebugCardSkeleton, {}, k)) });
  }
  if (!diagnostics) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: "No diagnostics data available." });
  }
  const overallOk = diagnostics.overallStatus === "healthy";
  const overallWarn = diagnostics.overallStatus === "warning";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `rounded-lg border p-4 flex items-center gap-3 ${overallOk ? "bg-green-900/10 border-green-500/50" : overallWarn ? "bg-yellow-900/10 border-yellow-500/50" : "bg-red-900/10 border-red-500/50"}`,
        "data-ocid": "diagnostics.overall_status",
        children: [
          overallOk ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5 text-green-400 shrink-0" }) : overallWarn ? /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5 text-yellow-400 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-5 w-5 text-red-400 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-white", children: overallOk ? "✅ All Systems Healthy" : overallWarn ? "⚠️ Warnings Detected" : "❌ Critical Issues" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto font-mono text-xs text-muted-foreground", children: [
            diagnostics.components.length,
            " components"
          ] })
        ]
      }
    ),
    diagnostics.criticalFailures.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-red-900/20 border border-red-500/60 p-4 rounded-lg",
        "data-ocid": "diagnostics.critical_failures",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-red-400 font-bold text-xs mb-2 uppercase tracking-wide", children: "🚨 Critical:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: diagnostics.criticalFailures.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-red-300 text-xs flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "•" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: f })
          ] }, f)) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: diagnostics.components.map((c) => {
      const level = componentStatusToLevel(c.status);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `rounded-xl bg-card border-l-4 border border-border/40 p-4 ${statusColor(level)}`,
          "data-ocid": "diagnostics.component_card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs font-bold uppercase tracking-wider text-foreground truncate", children: c.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { level })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[11px] text-muted-foreground leading-snug", children: c.message }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex gap-4 font-mono text-[10px] text-muted-foreground/60", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Uptime: ",
                (c.metrics.uptime * 100).toFixed(0),
                "%"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Errors: ",
                toNum(c.metrics.errorCount)
              ] })
            ] })
          ]
        },
        c.name
      );
    }) }),
    diagnostics.issues.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-ocid": "diagnostics.issues_list", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-mono text-xs text-muted-foreground uppercase tracking-widest", children: "Issues Found:" }),
      diagnostics.issues.map((issue) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "w-full text-left bg-card border border-border/40 p-4 rounded-lg cursor-pointer hover:border-yellow-500/50 transition-smooth",
          onClick: () => setExpandedIssue(expandedIssue === issue.id ? null : issue.id),
          "data-ocid": `diagnostics.issue.${issue.id}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                issue.severity === "critical" && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 text-red-500 shrink-0" }),
                issue.severity === "error" && /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-orange-500 shrink-0" }),
                issue.severity === "warning" && /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-yellow-500 shrink-0" }),
                issue.severity === "info" && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-blue-500 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-sm text-foreground truncate", children: issue.title })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: `font-mono text-[9px] uppercase tracking-widest shrink-0 ${issue.severity === "critical" ? "text-red-300 border-red-500/50 bg-red-900/20" : issue.severity === "error" ? "text-orange-300 border-orange-500/50 bg-orange-900/20" : "text-yellow-300 border-yellow-500/50 bg-yellow-900/20"}`,
                  children: issue.severity
                }
              )
            ] }),
            expandedIssue === issue.id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-2 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: issue.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-green-900/20 border border-green-500/40 px-3 py-2 rounded", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400 font-semibold", children: "Fix: " }),
                issue.suggestedFix
              ] })
            ] })
          ]
        },
        issue.id
      ))
    ] }),
    diagnostics.recommendations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-blue-900/10 border border-blue-500/40 p-4 rounded-lg",
        "data-ocid": "diagnostics.recommendations",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-blue-400 font-bold text-xs mb-2 uppercase tracking-wide", children: "💡 Recommendations:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: diagnostics.recommendations.map((rec) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-blue-300 text-xs flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "→" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: rec })
          ] }, rec)) })
        ]
      }
    )
  ] });
}
function BackupsTab({ actor }) {
  const { isFetching } = useActor(createActor);
  const { data: backups, isLoading } = useQuery({
    queryKey: ["backupsForDownload"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listBackupsForDownload();
    },
    enabled: !!actor && !isFetching
  });
  const downloadBackup = async (backupId) => {
    if (!actor) return;
    try {
      const result = await actor.downloadVersionBackupAsJson(
        backupId
      );
      if (!result || result.length === 0) {
        ue.error("Backup not found");
        return;
      }
      const item = Array.isArray(result) ? result[0] : result;
      const blob = new Blob([item.data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = item.filename;
      a.click();
      URL.revokeObjectURL(url);
      ue.success(`Downloaded ${item.filename}`);
    } catch (err) {
      ue.error("Download failed");
      console.error(err);
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [0, 1, 2].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded-lg" }, k)) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "debugger.backups_list", children: !backups || backups.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-lg bg-card border border-border/40 p-8 text-center",
      "data-ocid": "debugger.backups.empty_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "h-8 w-8 text-muted-foreground/40 mx-auto mb-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: "No backups available for download." })
      ]
    }
  ) : backups.map((b, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-lg bg-card border border-border/40 p-4 flex flex-col sm:flex-row sm:items-center gap-3",
      "data-ocid": `debugger.backup.item.${idx + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-foreground font-semibold truncate", children: b.filename }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 mt-1 font-mono text-[10px] text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              toNum(b.userCount),
              " users"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              toNum(b.listingCount),
              " listings"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatBytes(b.size) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatTs(b.created) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: "font-mono text-[9px] uppercase border-border/50",
                children: b.backupType
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            className: "font-mono text-[10px] uppercase tracking-widest h-8 shrink-0 border-primary/40 hover:bg-primary/10 hover:text-primary transition-smooth",
            onClick: () => downloadBackup(b.id),
            "data-ocid": `debugger.backup.download_button.${idx + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3.5 w-3.5 mr-1.5" }),
              "Download JSON"
            ]
          }
        )
      ]
    },
    b.id
  )) });
}
function IntegrationsTab({
  diagnostics,
  integrations,
  loading
}) {
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [0, 1, 2, 3].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded-lg" }, k)) });
  }
  const items = integrations ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-ocid": "debugger.integrations_list", children: [
    items.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: "No integration data available." }),
    items.map((intg, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `rounded-lg border p-4 flex items-start justify-between gap-3 ${intg.connected ? "bg-green-900/10 border-green-500/40" : "bg-red-900/10 border-red-500/40"}`,
        "data-ocid": `debugger.integration.item.${idx + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link2,
              {
                className: `h-4 w-4 shrink-0 ${intg.connected ? "text-green-400" : "text-red-400"}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: intg.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[11px] text-muted-foreground mt-0.5", children: [
                intg.connected ? "✅ Connected" : "❌ Not connected",
                intg.errorMessage && ` — ${Array.isArray(intg.errorMessage) ? intg.errorMessage[0] : intg.errorMessage}`
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: `font-mono text-[9px] uppercase tracking-widest ${intg.configPresent ? "text-green-300 border-green-500/50 bg-green-900/20" : "text-red-300 border-red-500/50 bg-red-900/20"}`,
              children: intg.configPresent ? "Config OK" : "No Config"
            }
          ) })
        ]
      },
      intg.name
    )),
    diagnostics && diagnostics.criticalFailures.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-red-900/10 border border-red-500/40 p-4 rounded-lg mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-mono text-xs text-red-400 uppercase tracking-widest mb-2", children: "Critical:" }),
      diagnostics.criticalFailures.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-300 text-xs", children: f }, f))
    ] })
  ] });
}
function ExportTab({ actor }) {
  const { isFetching } = useActor(createActor);
  const { data: exportReport, isLoading } = useQuery({
    queryKey: ["systemExportReport"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.exportSystemReport();
    },
    enabled: !!actor && !isFetching
  });
  const downloadReport = () => {
    if (!exportReport) return;
    try {
      const reportData = {
        timestamp: toNum(exportReport.timestamp),
        overallStatus: exportReport.overallStatus,
        components: JSON.parse(exportReport.componentsJson),
        issues: JSON.parse(exportReport.issuesJson),
        recommendations: JSON.parse(exportReport.recommendationsJson)
      };
      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: "application/json"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `system-report-${(/* @__PURE__ */ new Date()).toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      ue.success("System report downloaded");
    } catch {
      ue.error("Failed to generate report");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "debugger.export_section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-blue-900/10 border border-blue-500/40 p-5 rounded-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-mono text-xs text-blue-300 uppercase tracking-widest mb-1", children: "📥 Export System Report" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[11px] text-muted-foreground mb-4", children: "Download complete system diagnostics as a JSON file for backup and analysis." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          className: "font-mono text-[10px] uppercase tracking-widest border-blue-500/50 text-blue-300 hover:bg-blue-900/30",
          onClick: downloadReport,
          disabled: isLoading || !exportReport,
          "data-ocid": "debugger.export.download_button",
          children: [
            isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2" }),
            isLoading ? "Generating…" : "Download System Report JSON"
          ]
        }
      )
    ] }),
    exportReport && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-card border border-border/40 p-4 font-mono text-xs space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Report Summary:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-foreground", children: [
        "Status:",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: exportReport.overallStatus === "healthy" ? "text-green-400" : exportReport.overallStatus === "warning" ? "text-yellow-400" : "text-red-400",
            children: exportReport.overallStatus
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-foreground", children: [
        "Components: ",
        (() => {
          try {
            return JSON.parse(exportReport.componentsJson).length;
          } catch {
            return "?";
          }
        })()
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-foreground", children: [
        "Issues: ",
        (() => {
          try {
            return JSON.parse(exportReport.issuesJson).length;
          } catch {
            return "?";
          }
        })()
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-foreground", children: [
        "Recommendations: ",
        (() => {
          try {
            return JSON.parse(exportReport.recommendationsJson).length;
          } catch {
            return "?";
          }
        })()
      ] })
    ] })
  ] });
}
function AdminDebuggerPage() {
  const [activeTab, setActiveTab] = reactExports.useState("diagnostics");
  const [refreshKey, setRefreshKey] = reactExports.useState(0);
  const [lastChecked, setLastChecked] = reactExports.useState(null);
  const { actor } = useActor(createActor);
  const { data, isLoading, isError, isFetching } = useSystemHealth(refreshKey);
  const { data: cyclesData, isLoading: cyclesLoading } = useCyclesBalance(refreshKey);
  const { actor: actorRef, isFetching: actorFetching } = useActor(createActor);
  const { data: diagnostics, isLoading: diagLoading } = useQuery({
    queryKey: ["systemDiagnostics", refreshKey],
    queryFn: async () => {
      if (!actorRef) throw new Error("Actor not ready");
      return actorRef.getSystemDiagnostics();
    },
    enabled: !!actorRef && !actorFetching && activeTab === "diagnostics",
    staleTime: 0
  });
  const { data: integrations, isLoading: integLoading } = useQuery({
    queryKey: ["integrationStatus", refreshKey],
    queryFn: async () => {
      if (!actorRef) return [];
      return actorRef.getIntegrationStatus();
    },
    enabled: !!actorRef && !actorFetching && activeTab === "integrations"
  });
  React.useEffect(() => {
    if (data && !isFetching) setLastChecked(/* @__PURE__ */ new Date());
  }, [data, isFetching]);
  const createBackupMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.createVersionBackup(
        true,
        "Manual backup from System Debugger"
      );
      if ((result == null ? void 0 : result.__kind__) === "err") throw new Error(result.err);
      return result;
    },
    onSuccess: () => {
      ue.success("Backup created successfully.");
      setRefreshKey((k) => k + 1);
    },
    onError: (err) => ue.error(err instanceof Error ? err.message : "Backup failed.")
  });
  const cards = data ? buildCards(
    data,
    () => createBackupMutation.mutate(),
    createBackupMutation.isPending
  ) : null;
  const cyclesCard = !cyclesLoading && cyclesData !== void 0 ? buildCyclesCard(cyclesData ?? null) : null;
  const allCards = [
    ...cyclesCard ? [cyclesCard] : [],
    ...cards ?? []
  ];
  const issueCount = allCards.filter((c) => c.level !== "green").length;
  const showLowCyclesWarning = cyclesData !== null && cyclesData !== void 0 && Number(cyclesData) < 1e12;
  const stillLoading = isLoading || cyclesLoading;
  const TABS = [
    { id: "diagnostics", label: "Diagnostics", icon: Eye },
    { id: "backups", label: "Backups", icon: HardDrive },
    { id: "integrations", label: "Integrations", icon: Link2 },
    { id: "export", label: "Export", icon: Download }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { title: "System Debugger", subtitle: "Health Status", children: [
    showLowCyclesWarning && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "mb-4 rounded-lg bg-[#eab308]/10 border border-[#eab308]/40 px-4 py-3 flex items-start gap-3",
        "data-ocid": "debugger-low-cycles-banner",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-[#eab308] shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-[#eab308]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: "Low cycles warning." }),
            " HTTPS outcalls (Stripe payments, OCR) will fail if cycles run out."
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "mb-6 rounded-xl bg-card neon-border-blue p-5 relative overflow-hidden",
        "data-ocid": "debugger-header",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 retro-grid opacity-10 pointer-events-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col sm:flex-row sm:items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5 text-primary shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-bold tracking-wider text-foreground text-glow-blue uppercase", children: "System Debugger" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[11px] text-muted-foreground", children: lastChecked ? `Last checked: ${lastChecked.toLocaleTimeString()}` : "Not checked yet" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3", children: [
              allCards.length > 0 && !stillLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-[11px] font-semibold border ${issueCount === 0 ? "text-[#22c55e] border-[#22c55e]/40 bg-[#22c55e]/10" : "text-[#eab308] border-[#eab308]/40 bg-[#eab308]/10"}`,
                  "data-ocid": "debugger-overall-status",
                  children: [
                    issueCount === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3.5 h-3.5" }),
                    issueCount === 0 ? "All systems operational" : `${issueCount} issue${issueCount > 1 ? "s" : ""} need attention`
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  className: "w-full sm:w-auto font-mono text-[10px] uppercase tracking-widest neon-border-blue hover:bg-primary/10 transition-smooth",
                  onClick: () => setRefreshKey((k) => k + 1),
                  disabled: stillLoading || isFetching,
                  "data-ocid": "debugger-refresh-btn",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      RefreshCw,
                      {
                        className: `w-3.5 h-3.5 mr-1.5 ${isFetching ? "animate-spin" : ""}`
                      }
                    ),
                    isFetching ? "Refreshing…" : "Refresh All"
                  ]
                }
              )
            ] })
          ] })
        ]
      }
    ),
    isError && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 rounded-lg bg-destructive/10 border border-destructive/40 px-4 py-3 font-mono text-xs text-destructive", children: "Failed to load system health. Check your connection and try refreshing." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6",
        "data-ocid": "debugger-cards-grid",
        children: stillLoading || allCards.length === 0 ? [
          "sk-0",
          "sk-1",
          "sk-2",
          "sk-3",
          "sk-4",
          "sk-5",
          "sk-6",
          "sk-7"
        ].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(DebugCardSkeleton, {}, k)) : allCards.map((card) => /* @__PURE__ */ jsxRuntimeExports.jsx(DebugCard, { ...card }, card.title))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-card border border-border/40 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex border-b border-border/40 overflow-x-auto",
          "data-ocid": "debugger.tabs",
          children: TABS.map(({ id, label, icon: Icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setActiveTab(id),
              className: `flex items-center gap-2 px-4 py-3 font-mono text-[11px] uppercase tracking-widest whitespace-nowrap transition-smooth border-b-2 ${activeTab === id ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/30"}`,
              "data-ocid": `debugger.tab.${id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5" }),
                label
              ]
            },
            id
          ))
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
        activeTab === "diagnostics" && /* @__PURE__ */ jsxRuntimeExports.jsx(DiagnosticsTab, { diagnostics, loading: diagLoading }),
        activeTab === "backups" && /* @__PURE__ */ jsxRuntimeExports.jsx(BackupsTab, { actor }),
        activeTab === "integrations" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          IntegrationsTab,
          {
            diagnostics,
            integrations,
            loading: integLoading
          }
        ),
        activeTab === "export" && /* @__PURE__ */ jsxRuntimeExports.jsx(ExportTab, { actor })
      ] })
    ] })
  ] });
}
function buildCyclesCard(cycles) {
  const level = getCyclesLevel(cycles);
  let cyclesInfo;
  let statusInfo;
  if (!cycles) {
    cyclesInfo = "Unable to read balance";
    statusInfo = "Could not fetch cycles — actor may not expose this method yet";
  } else {
    cyclesInfo = formatCycles(cycles);
    statusInfo = level === "green" ? "Sufficient cycles for HTTPS outcalls" : level === "yellow" ? "Low cycles — top up to prevent HTTPS outcall failures" : "Critical: Canister may stop functioning";
  }
  return {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-primary" }),
    title: "Canister Cycles",
    level,
    details: [
      { label: "Cycles balance", ok: level === "green", info: cyclesInfo },
      { label: "Status", ok: level === "green", info: statusInfo },
      ...level !== "green" ? [
        {
          label: "Top up",
          ok: false,
          info: 'Use IC dashboard or "dfx canister deposit-cycles <amount> <canister-id>"'
        }
      ] : []
    ]
  };
}
function buildCards(h, onCreateBackup, backupLoading) {
  const stripeLevel = !h.stripe.hasPublishableKey || !h.stripe.hasSecretKey ? "red" : !h.stripe.hasPriceIds ? "yellow" : "green";
  const stripeCard = {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-4 h-4 text-primary" }),
    title: "Stripe Payments",
    level: stripeLevel,
    details: [
      {
        label: "Publishable key",
        ok: h.stripe.hasPublishableKey,
        info: h.stripe.hasPublishableKey ? "Configured" : "Missing"
      },
      {
        label: "Secret key",
        ok: h.stripe.hasSecretKey,
        info: h.stripe.hasSecretKey ? "Configured" : "Missing"
      },
      {
        label: "Price IDs",
        ok: h.stripe.hasPriceIds,
        info: h.stripe.hasPriceIds ? "At least one set" : "None configured"
      },
      {
        label: "Payment verification",
        ok: true,
        info: "Polling (ICP architecture — no webhooks)"
      }
    ],
    fixLabel: "Go to Payments Config",
    fixPath: "/admin/payments"
  };
  const geminiCard = {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4 text-primary" }),
    title: "Gemini OCR",
    level: h.gemini.hasApiKey ? "green" : "red",
    details: [
      {
        label: "Gemini API key",
        ok: h.gemini.hasApiKey,
        info: h.gemini.hasApiKey ? "Configured" : "Not set — OCR disabled"
      },
      { label: "Model", ok: true, info: "gemini-2.5-flash-lite" }
    ],
    fixLabel: "Go to OCR Settings",
    fixPath: "/admin/settings"
  };
  const dbOk = h.database.canReadUsers && h.database.canReadConfig;
  const databaseCard = {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "w-4 h-4 text-primary" }),
    title: "Canister Database",
    level: dbOk ? "green" : "red",
    details: [
      {
        label: "Read users",
        ok: h.database.canReadUsers,
        info: h.database.canReadUsers ? "OK" : "Cannot read"
      },
      {
        label: "Read canister storage",
        ok: h.database.canReadConfig,
        info: h.database.canReadConfig ? "OK" : "Cannot read"
      }
    ]
  };
  const freshHours = h.backup.freshnessHours !== void 0 ? Number(h.backup.freshnessHours) : void 0;
  const backupLevel = !h.backup.lastBackupAt || h.backup.lastBackupAt === BigInt(0) ? "red" : freshHours === void 0 ? "yellow" : freshHours < 24 ? "green" : freshHours < 48 ? "yellow" : "red";
  const backupCard = {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "w-4 h-4 text-primary" }),
    title: "Backup System",
    level: backupLevel,
    details: [
      {
        label: "Last backup",
        ok: backupLevel !== "red",
        info: h.backup.lastBackupAt && h.backup.lastBackupAt > BigInt(0) ? `${formatTs(h.backup.lastBackupAt)}${freshHours !== void 0 ? ` (${freshHours}h ago)` : ""}` : "No backup found"
      },
      {
        label: "Backups stored",
        ok: Number(h.backup.backupCount) > 0,
        info: `${Number(h.backup.backupCount)} backup${Number(h.backup.backupCount) !== 1 ? "s" : ""}`
      }
    ],
    fixLabel: "Create Backup Now",
    onFixClick: onCreateBackup,
    fixLoading: backupLoading
  };
  const maintenanceCard = {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4 text-accent" }),
    title: "Maintenance Mode",
    level: h.maintenance.isActive ? "yellow" : "green",
    details: [
      {
        label: "Maintenance mode",
        ok: !h.maintenance.isActive,
        info: h.maintenance.isActive ? "ACTIVE — users cannot access site" : "Off"
      }
    ],
    ...h.maintenance.isActive ? { fixLabel: "Toggle Maintenance Mode", fixPath: "/admin/settings" } : {}
  };
  const signupsCard = {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4 text-primary" }),
    title: "User Signups",
    level: "green",
    details: [
      {
        label: "Total users",
        ok: true,
        info: `${Number(h.signups.total)} registered`
      },
      {
        label: "Last signup",
        ok: true,
        info: h.signups.lastSignupAt && h.signups.lastSignupAt > BigInt(0) ? formatTs(h.signups.lastSignupAt) : "No signups yet"
      }
    ]
  };
  const paypalCard = {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-accent" }),
    title: "PayPal",
    level: h.paypal.isConfigured ? "green" : "yellow",
    details: [
      {
        label: "PayPal",
        ok: h.paypal.isConfigured,
        info: h.paypal.isConfigured ? "Configured" : "Not configured (optional)"
      }
    ],
    ...h.paypal.isConfigured ? {} : { fixLabel: "Go to Payments Config", fixPath: "/admin/payments" }
  };
  return [
    stripeCard,
    geminiCard,
    databaseCard,
    backupCard,
    maintenanceCard,
    signupsCard,
    paypalCard
  ];
}
export {
  AdminDebuggerPage
};

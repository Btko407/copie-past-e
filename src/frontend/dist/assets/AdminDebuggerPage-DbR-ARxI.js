import { c as createLucideIcon, r as reactExports, f as useActor, e as React, h as useMutation, j as jsxRuntimeExports, V as TriangleAlert, s as Shield, J as CircleCheck, B as Button, R as RefreshCw, p as useQuery, a as ue, Z as Zap, S as Skeleton, u as useNavigate, i as createActor } from "./index-BkwokjFY.js";
import { A as AdminLayout, D as Database, U as Users } from "./AdminLayout-CBdfXdYt.js";
import { B as Badge } from "./badge-CTXPTPQY.js";
import { L as LoaderCircle } from "./loader-circle-cS4Tgb1i.js";
import { C as CreditCard } from "./credit-card-URNb3Zv0.js";
import { E as Eye } from "./eye-CrfeS7ha.js";
import { C as CircleX } from "./circle-x-BLguENKi.js";
import "./trash-2-CfPvNxUG.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["line", { x1: "22", x2: "2", y1: "12", y2: "12", key: "1y58io" }],
  [
    "path",
    {
      d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
      key: "oot6mr"
    }
  ],
  ["line", { x1: "6", x2: "6.01", y1: "16", y2: "16", key: "sgf278" }],
  ["line", { x1: "10", x2: "10.01", y1: "16", y2: "16", key: "1l4acy" }]
];
const HardDrive = createLucideIcon("hard-drive", __iconNode$1);
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
function formatTs(ts) {
  if (!ts || ts === BigInt(0)) return "Never";
  const ms = Number(ts) / 1e6;
  return new Date(ms).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function formatCycles(cycles) {
  const trillion = 1e12;
  const val = Number(cycles) / trillion;
  return `${val.toFixed(2)} trillion`;
}
function getCyclesLevel(cycles) {
  if (cycles === null) return "yellow";
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
              if (onFixClick) {
                onFixClick();
              } else if (fixPath) {
                navigate({ to: fixPath });
              }
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
function AdminDebuggerPage() {
  const [refreshKey, setRefreshKey] = reactExports.useState(0);
  const [lastChecked, setLastChecked] = reactExports.useState(null);
  const { actor } = useActor(createActor);
  const { data, isLoading, isError, isFetching } = useSystemHealth(refreshKey);
  const { data: cyclesData, isLoading: cyclesLoading } = useCyclesBalance(refreshKey);
  React.useEffect(() => {
    if (data && !isFetching) setLastChecked(/* @__PURE__ */ new Date());
  }, [data, isFetching]);
  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
  };
  const createBackupMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const a = actor;
      const result = await a.createVersionBackup(
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
    onError: (err) => {
      ue.error(err instanceof Error ? err.message : "Backup failed.");
    }
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
            " HTTPS outcalls (Stripe payments, OCR) will fail if cycles run out. Top up your canister using the IC dashboard or",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "bg-[#eab308]/10 px-1 rounded text-[10px]", children: "dfx canister deposit-cycles" }),
            "."
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[11px] text-muted-foreground", children: lastChecked ? `Last checked: ${lastChecked.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}` : "Not checked yet" })
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
                  onClick: handleRefresh,
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
        className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
        "data-ocid": "debugger-cards-grid",
        children: stillLoading || allCards.length === 0 ? [
          "skel-0",
          "skel-1",
          "skel-2",
          "skel-3",
          "skel-4",
          "skel-5",
          "skel-6",
          "skel-7"
        ].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(DebugCardSkeleton, {}, k)) : allCards.map((card) => /* @__PURE__ */ jsxRuntimeExports.jsx(DebugCard, { ...card }, card.title))
      }
    )
  ] });
}
function buildCyclesCard(cycles) {
  const level = getCyclesLevel(cycles);
  let cyclesInfo;
  let statusInfo;
  if (cycles === null) {
    cyclesInfo = "Unable to read balance";
    statusInfo = "Could not fetch cycles — actor may not expose this method yet";
  } else {
    cyclesInfo = formatCycles(cycles);
    if (level === "green") {
      statusInfo = "Sufficient cycles for HTTPS outcalls";
    } else if (level === "yellow") {
      statusInfo = "Low cycles — top up to prevent HTTPS outcall failures";
    } else {
      statusInfo = "Critical: Canister may stop functioning";
    }
  }
  return {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-primary" }),
    title: "Canister Cycles",
    level,
    details: [
      {
        label: "Cycles balance",
        ok: level === "green",
        info: cyclesInfo
      },
      {
        label: "Status",
        ok: level === "green",
        info: statusInfo
      },
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
      {
        label: "Model",
        ok: true,
        info: "gemini-2.5-flash-lite"
      }
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

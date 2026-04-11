import { O as useAuth, ab as useGetAdminSettings, j as jsxRuntimeExports, q as Shield, S as Skeleton, Z as Zap, ac as Settings, ad as Clock, n as Link } from "./index-D1sD4pLM.js";
import { U as Users, L as LayoutDashboard, A as AdminLayout, C as ChartColumn } from "./AdminLayout-BxFVigGd.js";
import { B as Badge } from "./badge-BR0j4Hou.js";
import { u as useGetSiteAnalytics } from "./useAdminAnalytics-CkBiklHA.js";
import { u as useListAllUsers } from "./useAdminUsers-SRNzzFvH.js";
import { u as useListVersionHistory } from "./useAdminVersions-Cur4M-kf.js";
import { I as Image } from "./image-BE1g-X6J.js";
import "./credit-card-BZ5ckz5C.js";
import "./trash-2-BbcxXwWt.js";
const QUICK_LINKS = [
  {
    id: "settings",
    label: "Settings",
    desc: "Configure app, theme & security",
    path: "/admin/settings",
    icon: Settings,
    glow: "glow-blue-sm",
    border: "neon-border-blue",
    color: "text-primary",
    textGlow: "text-glow-blue"
  },
  {
    id: "users",
    label: "Users",
    desc: "Manage roles & accounts",
    path: "/admin/users",
    icon: Users,
    glow: "glow-yellow-sm",
    border: "neon-border-yellow",
    color: "text-accent",
    textGlow: "text-glow-yellow"
  },
  {
    id: "analytics",
    label: "Analytics",
    desc: "Posts, images & growth metrics",
    path: "/admin/analytics",
    icon: ChartColumn,
    glow: "glow-blue-sm",
    border: "neon-border-blue",
    color: "text-primary",
    textGlow: "text-glow-blue"
  },
  {
    id: "versions",
    label: "Versions",
    desc: "History, snapshots & rollback",
    path: "/admin/versions",
    icon: Clock,
    glow: "glow-yellow-sm",
    border: "neon-border-yellow",
    color: "text-accent",
    textGlow: "text-glow-yellow"
  }
];
function formatDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function AdminDashboardPage() {
  var _a, _b, _c;
  const { principalId } = useAuth();
  const { data: settings, isLoading: settingsLoading } = useGetAdminSettings();
  const { data: analytics, isLoading: analyticsLoading } = useGetSiteAnalytics();
  const { data: versions = [], isLoading: versionsLoading } = useListVersionHistory();
  const { data: users = [], isLoading: usersLoading } = useListAllUsers();
  const latestVersion = versions[0];
  const shortPrincipal = principalId ? `${principalId.slice(0, 8)}…${principalId.slice(-6)}` : null;
  const recentUsers = [...users].sort((a, b) => Number(b.registrationDate) - Number(a.registrationDate)).slice(0, 5);
  const stats = [
    {
      label: "Total Users",
      value: ((_a = analytics == null ? void 0 : analytics.totalUsers) == null ? void 0 : _a.toString()) ?? "—",
      icon: Users,
      color: "text-primary",
      glow: "text-glow-blue",
      border: "neon-border-blue"
    },
    {
      label: "Total Listings",
      value: ((_b = analytics == null ? void 0 : analytics.totalListings) == null ? void 0 : _b.toString()) ?? "—",
      icon: LayoutDashboard,
      color: "text-primary",
      glow: "text-glow-blue",
      border: "neon-border-blue"
    },
    {
      label: "Total Images",
      value: ((_c = analytics == null ? void 0 : analytics.totalImages) == null ? void 0 : _c.toString()) ?? "—",
      icon: Image,
      color: "text-accent",
      glow: "text-glow-yellow",
      border: "neon-border-yellow"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { title: "Admin Dashboard", subtitle: "Overview", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "mb-8 rounded-xl bg-card neon-border-blue p-6 relative overflow-hidden",
        style: {
          boxShadow: "0 0 40px oklch(0.65 0.22 262 / 0.08), 0 4px 24px oklch(0 0 0 / 0.4)"
        },
        "data-ocid": "admin-welcome-banner",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 retro-grid opacity-20 pointer-events-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-wrap items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center glow-blue-sm neon-border-blue shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-6 h-6 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold tracking-wider text-foreground text-glow-blue uppercase", children: "Control Center" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-muted-foreground mt-0.5 tracking-wide truncate", children: [
                settingsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-32 inline-block" }) : (settings == null ? void 0 : settings.appName) ?? "COPIE PAST-E",
                " — Full admin access granted"
              ] }),
              shortPrincipal && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] text-primary/60 mt-1 tracking-widest", children: [
                "PRINCIPAL: ",
                shortPrincipal
              ] })
            ] }),
            versionsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-24" }) : latestVersion ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-1.5 font-mono text-xs text-accent/90 neon-border-yellow rounded px-3 py-1.5 bg-accent/5 glow-yellow-sm shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3 h-3" }),
              latestVersion.versionLabel
            ] }) : null
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8",
        "data-ocid": "admin-stats-row",
        children: analyticsLoading ? [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-lg" }, i)) : stats.map(({ label, value, icon: Icon, color, glow, border }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `rounded-xl bg-card ${border} p-5 relative overflow-hidden`,
            "data-ocid": "admin-stat-card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 retro-grid opacity-10 pointer-events-none" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-start justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2", children: label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: `font-display text-3xl font-black ${color} ${glow}`,
                      children: value
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-current/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-5 h-5 ${color}` }) })
              ] })
            ]
          },
          label
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3", children: "Quick Navigation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: QUICK_LINKS.map(
          ({
            id,
            label,
            desc,
            path,
            icon: Icon,
            border,
            color,
            textGlow,
            glow
          }) => /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: path, "data-ocid": `admin-quicklink-${id}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: [
                "group rounded-xl bg-card",
                border,
                "p-4 transition-smooth hover:bg-secondary/20 cursor-pointer h-full"
              ].join(" "),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `w-8 h-8 rounded-lg bg-current/10 flex items-center justify-center mb-3 transition-smooth ${glow} opacity-80 group-hover:opacity-100`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-4 h-4 ${color}` })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: `font-display text-xs font-bold tracking-wider uppercase ${color} ${textGlow} mb-1`,
                    children: label
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground leading-relaxed", children: desc })
              ]
            }
          ) }, id)
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3", children: "Recently Registered" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl bg-card neon-border-blue overflow-hidden", children: usersLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-3", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 rounded" }, i)) }) : recentUsers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-center font-mono text-xs text-muted-foreground", children: "No users registered yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border/50", children: recentUsers.map((user) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-3 px-4 py-3 hover:bg-secondary/20 transition-smooth",
            "data-ocid": "recent-user-row",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0 neon-border-blue", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3 h-3 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-foreground truncate", children: [
                  user.userId.slice(0, 10),
                  "…",
                  user.userId.slice(-6)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground", children: formatDate(user.registrationDate) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: [
                    "font-mono text-[10px] uppercase tracking-widest shrink-0",
                    user.role === "admin" ? "text-accent border-accent/50 bg-accent/5" : "text-primary border-primary/50 bg-primary/5"
                  ].join(" "),
                  children: user.role
                }
              )
            ]
          },
          user.userId
        )) }) })
      ] })
    ] })
  ] });
}
export {
  AdminDashboardPage
};

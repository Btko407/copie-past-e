import { r as reactExports, j as jsxRuntimeExports, S as Skeleton, q as Input, B as Button } from "./index-DlPcOTZa.js";
import { U as Users, L as LayoutDashboard, C as ChartColumn, A as AdminLayout } from "./AdminLayout-7S4QaLfU.js";
import { B as Badge } from "./badge-Cqya1gqC.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BxWvQOzZ.js";
import { u as useGetSiteAnalytics } from "./useAdminAnalytics-COoEloFK.js";
import { u as useListAllUsers } from "./useAdminUsers-APQHaVm4.js";
import { I as Image } from "./image-ConwxI9i.js";
import { T as TrendingUp } from "./trending-up-BxPVBlQC.js";
import { S as Search } from "./search-t5UlxwV1.js";
import { D as Download } from "./download-DNsV216a.js";
import { A as ArrowUpDown } from "./arrow-up-down-DmfFn2FG.js";
import { C as ChevronUp } from "./chevron-up-C-ZrNbDK.js";
import { C as ChevronDown } from "./chevron-down-Ba3NMDGY.js";
import "./credit-card-CgoLLcDw.js";
import "./trash-2-CC-jY3rN.js";
import "./dollar-sign-B5XuboAE.js";
function formatDate(ts) {
  if (!ts) return "—";
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function SortIcon({
  active,
  direction
}) {
  if (!active) return /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "w-3 h-3 opacity-40" });
  return direction === "asc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-3 h-3 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3 h-3 text-primary" });
}
function StatCard({
  label,
  value,
  icon: Icon,
  color,
  glow,
  border,
  sub
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: [
        "rounded-xl bg-card p-4 relative overflow-hidden",
        border
      ].join(" "),
      "data-ocid": "analytics-stat-card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 retro-grid opacity-10 pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2", children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: [
                  "font-display text-2xl sm:text-3xl font-black",
                  color,
                  glow
                ].join(" "),
                children: value
              }
            ),
            sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground mt-1", children: sub })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-card flex items-center justify-center shrink-0 border border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: ["w-5 h-5", color].join(" ") }) })
        ] })
      ]
    }
  );
}
function exportCSV(users, totalUsers, totalListings, totalImages, avgListings, avgImages) {
  const rows = [
    "# SITE-WIDE SUMMARY",
    `Total Users,${totalUsers.toString()}`,
    `Total Listings,${totalListings.toString()}`,
    `Total Images,${totalImages.toString()}`,
    `Avg Listings/User,${avgListings.toFixed(2)}`,
    `Avg Images/Listing,${avgImages.toFixed(2)}`,
    "",
    "# PER-USER BREAKDOWN",
    "Principal,Role,Listings,Images,Registered,Last Login",
    ...users.map(
      (u) => [
        u.userId,
        u.role,
        u.listingCount.toString(),
        u.imageCount.toString(),
        formatDate(u.registrationDate),
        u.lastLoginDate ? formatDate(u.lastLoginDate) : "—"
      ].join(",")
    )
  ];
  const blob = new Blob([rows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `analytics-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
function AdminAnalyticsPage() {
  var _a, _b, _c, _d, _e;
  const { data: analytics, isLoading: analyticsLoading } = useGetSiteAnalytics();
  const { data: users = [], isLoading: usersLoading } = useListAllUsers();
  const [search, setSearch] = reactExports.useState("");
  const [sortKey, setSortKey] = reactExports.useState("listingCount");
  const [sortDir, setSortDir] = reactExports.useState("desc");
  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }
  function getSortValue(user, key) {
    if (key === "registrationDate") return user.registrationDate;
    if (key === "listingCount") return user.listingCount;
    if (key === "imageCount") return user.imageCount;
    return user.userId;
  }
  const filtered = users.filter(
    (u) => search.trim() ? u.userId.toLowerCase().includes(search.toLowerCase()) : true
  ).sort((a, b) => {
    const av = getSortValue(a, sortKey);
    const bv = getSortValue(b, sortKey);
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });
  const summaryStats = [
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
    },
    {
      label: "Avg Listings / User",
      value: ((_d = analytics == null ? void 0 : analytics.avgListingsPerUser) == null ? void 0 : _d.toFixed(1)) ?? "—",
      icon: ChartColumn,
      color: "text-accent",
      glow: "text-glow-yellow",
      border: "neon-border-yellow",
      sub: "per registered account"
    },
    {
      label: "Avg Images / Listing",
      value: ((_e = analytics == null ? void 0 : analytics.avgImagesPerListing) == null ? void 0 : _e.toFixed(1)) ?? "—",
      icon: TrendingUp,
      color: "text-primary",
      glow: "text-glow-blue",
      border: "neon-border-blue",
      sub: "across all posts"
    }
  ];
  const COLS = [
    { key: "userId", label: "Principal" },
    { key: "listingCount", label: "Listings" },
    { key: "imageCount", label: "Images" },
    { key: "registrationDate", label: "Registered" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { title: "Analytics", subtitle: "Site Metrics", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8",
        "data-ocid": "analytics-summary-cards",
        children: analyticsLoading ? [0, 1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-xl" }, i)) : summaryStats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { ...s }, s.label))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 mb-4 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xs font-bold tracking-wider uppercase text-foreground", children: "Per-User Breakdown" }),
          !usersLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "outline",
              className: "font-mono text-[10px] text-primary border-primary/50 bg-primary/5",
              children: [
                users.length,
                " users"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 w-full sm:w-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 sm:flex-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Filter by principal…",
                value: search,
                onChange: (e) => setSearch(e.target.value),
                className: "pl-8 font-mono text-xs bg-secondary/30 border-primary/30 focus:border-primary/60 w-full sm:w-56 h-10 min-h-[44px]",
                "data-ocid": "analytics-user-search"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => exportCSV(
                users,
                (analytics == null ? void 0 : analytics.totalUsers) ?? BigInt(0),
                (analytics == null ? void 0 : analytics.totalListings) ?? BigInt(0),
                (analytics == null ? void 0 : analytics.totalImages) ?? BigInt(0),
                (analytics == null ? void 0 : analytics.avgListingsPerUser) ?? 0,
                (analytics == null ? void 0 : analytics.avgImagesPerListing) ?? 0
              ),
              className: "font-mono text-xs border-accent/40 text-accent hover:bg-accent/10 h-10 min-h-[44px] gap-1.5 shrink-0",
              "data-ocid": "export-csv-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3 h-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Export CSV" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "CSV" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden sm:block rounded-xl bg-card neon-border-blue overflow-hidden", children: usersLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 space-y-3", children: [0, 1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 rounded" }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-primary/20 hover:bg-transparent", children: [
          COLS.map(({ key, label }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            TableHead,
            {
              onClick: () => toggleSort(key),
              className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-smooth select-none whitespace-nowrap",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                label,
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SortIcon,
                  {
                    active: sortKey === key,
                    direction: sortDir
                  }
                )
              ] })
            },
            key
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Last Login" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          TableCell,
          {
            colSpan: 5,
            className: "text-center font-mono text-xs text-muted-foreground py-12",
            "data-ocid": "analytics-empty-state",
            children: "No users match your filter"
          }
        ) }) : filtered.map((user) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableRow,
          {
            className: "border-primary/10 hover:bg-primary/5 transition-smooth",
            "data-ocid": "analytics-user-row",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs text-foreground max-w-[160px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { title: user.userId, className: "truncate block", children: [
                user.userId.slice(0, 10),
                "…",
                user.userId.slice(-6)
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-mono text-sm font-bold text-primary text-glow-blue tabular-nums", children: user.listingCount.toString() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-mono text-sm font-bold text-accent text-glow-yellow tabular-nums", children: user.imageCount.toString() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs text-muted-foreground whitespace-nowrap", children: formatDate(user.registrationDate) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs text-muted-foreground whitespace-nowrap", children: user.lastLoginDate ? formatDate(user.lastLoginDate) : "—" })
            ]
          },
          user.userId
        )) })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:hidden space-y-3", children: usersLoading ? [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 rounded-lg" }, i)) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "rounded-xl bg-card neon-border-blue p-8 text-center",
          "data-ocid": "analytics-empty-state",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: "No users match your filter" })
        }
      ) : filtered.map((user) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-lg bg-card/60 border border-border/50 p-4",
          "data-ocid": "analytics-user-row",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-foreground truncate mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { title: user.userId, children: [
              user.userId.slice(0, 14),
              "…",
              user.userId.slice(-6)
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 text-xs font-mono", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-[10px] uppercase tracking-widest", children: "Listings" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-primary font-bold mt-0.5 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "w-3 h-3" }),
                  user.listingCount.toString()
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-[10px] uppercase tracking-widest", children: "Images" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-accent font-bold mt-0.5 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-3 h-3" }),
                  user.imageCount.toString()
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-[10px] uppercase tracking-widest", children: "Registered" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground mt-0.5", children: formatDate(user.registrationDate) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-[10px] uppercase tracking-widest", children: "Last Login" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground mt-0.5", children: user.lastLoginDate ? formatDate(user.lastLoginDate) : "—" })
              ] })
            ] })
          ]
        },
        user.userId
      )) })
    ] })
  ] });
}
export {
  AdminAnalyticsPage
};

import { r as reactExports, j as jsxRuntimeExports, B as Button, S as Skeleton, T as TriangleAlert, an as Bell } from "./index-DlPcOTZa.js";
import { u as useAdminNotifications, A as AdminLayout, a as CheckCheck, b as Activity, M as Megaphone, D as Database, c as ListChecks, d as UserPlus } from "./AdminLayout-7S4QaLfU.js";
import { B as Badge } from "./badge-Cqya1gqC.js";
import { D as DollarSign } from "./dollar-sign-B5XuboAE.js";
import "./credit-card-CgoLLcDw.js";
import "./trash-2-CC-jY3rN.js";
const TYPE_META = {
  signup: {
    icon: UserPlus,
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
    label: "Signup"
  },
  payment: {
    icon: DollarSign,
    color: "text-green-400",
    bg: "bg-green-400/10 border-green-400/20",
    label: "Payment"
  },
  listing: {
    icon: ListChecks,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10 border-cyan-400/20",
    label: "Listing"
  },
  backup: {
    icon: Database,
    color: "text-purple-400",
    bg: "bg-purple-400/10 border-purple-400/20",
    label: "Backup"
  },
  error: {
    icon: TriangleAlert,
    color: "text-red-400",
    bg: "bg-red-400/10 border-red-400/20",
    label: "Error"
  },
  broadcast: {
    icon: Megaphone,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-400/20",
    label: "Broadcast"
  }
};
function getTypeMeta(type) {
  return TYPE_META[type] ?? {
    icon: Bell,
    color: "text-muted-foreground",
    bg: "bg-secondary/20 border-border",
    label: type
  };
}
function relativeTime(nanoseconds) {
  const ms = Number(nanoseconds / 1000000n);
  const now = Date.now();
  const diff = now - ms;
  if (diff < 0) return "just now";
  const mins = Math.floor(diff / 6e4);
  const hours = Math.floor(diff / 36e5);
  const days = Math.floor(diff / 864e5);
  if (mins < 2) return "just now";
  if (mins < 60) return `${mins} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
const FILTERS = [
  { key: "all", label: "All" },
  { key: "signup", label: "Signups" },
  { key: "payment", label: "Payments" },
  { key: "listing", label: "Listings" },
  { key: "backup", label: "Backups" },
  { key: "error", label: "Errors" }
];
function NotifCard({
  notif,
  onMarkRead
}) {
  const meta = getTypeMeta(notif.type);
  const Icon = meta.icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `activity-notif-card-${notif.id}`,
      className: [
        "flex items-start gap-4 p-4 rounded-md border transition-smooth",
        !notif.read ? "bg-primary/5 border-primary/15" : "bg-card/50 border-border/40"
      ].join(" "),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `w-9 h-9 rounded-md border flex items-center justify-center shrink-0 ${meta.bg}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-4 h-4 ${meta.color}` })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: `font-body text-sm leading-snug break-words ${!notif.read ? "text-foreground" : "text-muted-foreground"}`,
              children: notif.message
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `font-mono text-[10px] uppercase tracking-widest ${meta.color}`,
                children: meta.label
              }
            ),
            notif.relatedUser && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] text-primary/70", children: [
              "@",
              notif.relatedUser
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground/50", children: relativeTime(notif.createdAt) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-end gap-2 shrink-0", children: !notif.read ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => onMarkRead(notif.id),
            className: "font-mono text-[10px] text-primary hover:text-primary/70 transition-smooth underline-offset-2 hover:underline whitespace-nowrap",
            "aria-label": "Mark as read",
            "data-ocid": `activity-mark-read-${notif.id}`,
            children: "Mark read"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "secondary",
            className: "font-mono text-[9px] tracking-widest uppercase opacity-50 px-1.5",
            children: "Read"
          }
        ) })
      ]
    }
  );
}
function AdminActivityFeedPage() {
  const { notifications, unreadCount, loading, markRead, markAllRead } = useAdminNotifications();
  const [filter, setFilter] = reactExports.useState("all");
  const [, setTick] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 3e4);
    return () => clearInterval(id);
  }, []);
  const filtered = filter === "all" ? notifications : notifications.filter((n) => n.type === filter);
  const filterUnread = (key) => key === "all" ? unreadCount : notifications.filter((n) => n.type === key && !n.read).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { title: "Activity Feed", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up" }) }),
      unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => markAllRead(),
          className: "font-mono text-xs tracking-widest uppercase self-start sm:self-auto",
          "data-ocid": "activity-mark-all-read-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "w-4 h-4 mr-2" }),
            "Mark All Read"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "fieldset",
      {
        className: "flex flex-wrap gap-2 border-none p-0 m-0",
        "aria-label": "Filter notifications by type",
        "data-ocid": "activity-filters",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { className: "sr-only", children: "Filter by type" }),
          FILTERS.map(({ key, label }) => {
            const count = filterUnread(key);
            const isActive = filter === key;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setFilter(key),
                "data-ocid": `activity-filter-${key}`,
                className: [
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs tracking-widest uppercase transition-smooth min-h-[36px] border",
                  isActive ? "bg-primary/15 text-primary border-primary/30 glow-blue-sm" : "text-muted-foreground hover:text-foreground hover:bg-secondary/40 border-transparent"
                ].join(" "),
                "aria-pressed": isActive,
                children: [
                  label,
                  count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 rounded-full bg-destructive text-destructive-foreground font-mono text-[9px] flex items-center justify-center leading-none", children: count > 9 ? "9+" : count })
                ]
              },
              key
            );
          })
        ]
      }
    ),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "activity-loading", children: ["s1", "s2", "s3", "s4", "s5", "s6"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-md" }, k)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-16 text-center",
        "data-ocid": "activity-empty-state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-10 h-10 text-muted-foreground/30 mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-sm text-muted-foreground uppercase tracking-widest", children: filter === "all" ? "No activity yet" : `No ${filter} events` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground/50 mt-2", children: filter === "all" ? "Events will appear here as users interact with the site." : `No ${filter} notifications found. Try a different filter.` })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "activity-list", children: filtered.map((notif) => /* @__PURE__ */ jsxRuntimeExports.jsx(NotifCard, { notif, onMarkRead: markRead }, notif.id)) })
  ] }) });
}
export {
  AdminActivityFeedPage
};

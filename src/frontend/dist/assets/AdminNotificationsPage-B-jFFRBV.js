import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, ai as Bell, B as Button, f as useActor, V as TriangleAlert, l as Label, I as Input, S as Skeleton, a as ue, i as createActor } from "./index-CfRHchGz.js";
import { u as useAdminNotifications, A as AdminLayout } from "./AdminLayout-DXRphwAf.js";
import { B as Badge } from "./badge-BiArleFJ.js";
import { T as Textarea } from "./textarea-jCJbSd5S.js";
import "./credit-card-MzuqdLsN.js";
import "./trash-2-D4SW5vrN.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742",
      key: "178tsu"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  ["path", { d: "M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05", key: "1hqiys" }]
];
const BellOff = createLucideIcon("bell-off", __iconNode$1);
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
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = createLucideIcon("send", __iconNode);
const TARGET_OPTIONS = [
  { value: "all", label: "All Users" },
  { value: "specific", label: "Specific User" },
  { value: "free", label: "Free Tier Only" },
  { value: "expired", label: "Expired Subscribers" }
];
const PRIORITY_OPTIONS = [
  { value: "normal", label: "Normal", color: "secondary" },
  { value: "important", label: "Important", color: "accent" },
  { value: "urgent", label: "Urgent", color: "destructive" }
];
function relativeTime(ts) {
  const ms = Number(ts) / 1e6;
  const diff = Date.now() - ms;
  if (diff < 6e4) return "just now";
  if (diff < 36e5) return `${Math.floor(diff / 6e4)}m ago`;
  if (diff < 864e5) return `${Math.floor(diff / 36e5)}h ago`;
  return `${Math.floor(diff / 864e5)}d ago`;
}
function priorityBadge(priority) {
  if (priority === "urgent")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", className: "text-xs font-mono uppercase", children: "Urgent" });
  if (priority === "important")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Badge,
      {
        variant: "outline",
        className: "text-xs font-mono uppercase border-accent text-accent",
        children: "Important"
      }
    );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs font-mono uppercase", children: "Normal" });
}
function ComposeForm({ onSent }) {
  const { actor } = useActor(createActor);
  const [title, setTitle] = reactExports.useState("");
  const [message, setMessage] = reactExports.useState("");
  const [targetType, setTargetType] = reactExports.useState("all");
  const [targetUser, setTargetUser] = reactExports.useState("");
  const [priority, setPriority] = reactExports.useState("normal");
  const [sending, setSending] = reactExports.useState(false);
  const canSend = title.trim().length > 0 && message.trim().length > 0 && (targetType !== "specific" || targetUser.trim().length > 0);
  async function handleSend() {
    if (!actor || !canSend) return;
    setSending(true);
    try {
      const userId = targetType === "specific" && targetUser.trim() ? [targetUser.trim()] : [];
      const result = await actor.createBroadcastNotification(
        title.trim(),
        message.trim(),
        priority,
        targetType,
        userId
      );
      if ("err" in result) {
        ue.error(result.err);
      } else {
        const count = Number(result.ok);
        ue.success(
          `Notification sent to ${count} ${count === 1 ? "user" : "users"}`
        );
        setTitle("");
        setMessage("");
        setTargetType("all");
        setTargetUser("");
        setPriority("normal");
        onSent();
      }
    } catch (err) {
      ue.error(
        `Failed to send: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setSending(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg p-6 space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-md border border-accent/40 bg-accent/5 px-4 py-2.5 text-xs text-accent font-mono", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 mt-0.5 shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Urgent messages appear as banners in the user notification center until dismissed." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Label,
          {
            htmlFor: "notif-title",
            className: "font-mono text-xs uppercase tracking-wider text-muted-foreground",
            children: [
              "Title ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-mono", children: [
          title.length,
          "/100"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          id: "notif-title",
          value: title,
          maxLength: 100,
          onChange: (e) => setTitle(e.target.value),
          placeholder: "Notification title…",
          className: "font-mono text-sm",
          "data-ocid": "notif-title-input"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Label,
          {
            htmlFor: "notif-message",
            className: "font-mono text-xs uppercase tracking-wider text-muted-foreground",
            children: [
              "Message ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-mono", children: [
          message.length,
          "/500"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          id: "notif-message",
          value: message,
          maxLength: 500,
          onChange: (e) => setMessage(e.target.value),
          placeholder: "Compose your message…",
          rows: 4,
          className: "font-mono text-sm resize-none",
          "data-ocid": "notif-message-input"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-mono text-xs uppercase tracking-wider text-muted-foreground", children: "Send To" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: TARGET_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setTargetType(opt.value),
          "data-ocid": `target-${opt.value}`,
          className: `px-3 py-1.5 rounded border text-xs font-mono transition-colors duration-150 ${targetType === opt.value ? "bg-primary/20 border-primary text-primary" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"}`,
          children: opt.label
        },
        opt.value
      )) }),
      targetType === "specific" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          value: targetUser,
          onChange: (e) => setTargetUser(e.target.value),
          placeholder: "Enter username…",
          className: "font-mono text-sm max-w-xs",
          "data-ocid": "notif-target-user"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-mono text-xs uppercase tracking-wider text-muted-foreground", children: "Priority" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: PRIORITY_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setPriority(opt.value),
          "data-ocid": `priority-${opt.value}`,
          className: `px-3 py-1.5 rounded border text-xs font-mono transition-colors duration-150 ${priority === opt.value ? opt.value === "urgent" ? "bg-destructive/20 border-destructive text-destructive" : opt.value === "important" ? "bg-accent/20 border-accent text-accent" : "bg-primary/20 border-primary text-primary" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"}`,
          children: opt.label
        },
        opt.value
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        onClick: handleSend,
        disabled: !canSend || sending,
        className: "w-full sm:w-auto gap-2",
        "data-ocid": "notif-send-btn",
        children: sending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" }),
          "Sending…"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }),
          "Send Notification"
        ] })
      }
    )
  ] });
}
function SentHistory({
  notifications,
  loading
}) {
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: ["s1", "s2", "s3", "s4"].map((key) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded" }, key)) });
  }
  if (notifications.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-16 text-center gap-3",
        "data-ocid": "notif-history-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BellOff, { className: "h-10 w-10 text-muted-foreground/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-mono text-sm", children: "No notifications sent yet." })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm font-mono", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2.5 px-3 text-xs text-muted-foreground uppercase tracking-wider font-medium", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2.5 px-3 text-xs text-muted-foreground uppercase tracking-wider font-medium", children: "Message" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2.5 px-3 text-xs text-muted-foreground uppercase tracking-wider font-medium", children: "Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2.5 px-3 text-xs text-muted-foreground uppercase tracking-wider font-medium", children: "Priority" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2.5 px-3 text-xs text-muted-foreground uppercase tracking-wider font-medium", children: "Read" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: notifications.slice(0, 20).map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: "border-b border-border/50 hover:bg-muted/20 transition-colors",
          "data-ocid": `notif-row-${n.id}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3 text-xs text-muted-foreground whitespace-nowrap", children: relativeTime(n.createdAt) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-2.5 px-3 max-w-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-clamp-1 text-foreground text-xs", children: n.message }),
              n.relatedUser && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-xs block", children: [
                "→ ",
                n.relatedUser
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: "text-xs font-mono capitalize",
                children: n.type.replace(/_/g, " ")
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3", children: priorityBadge(n.priority) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3", children: n.read ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-mono", children: "Read" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-primary font-mono font-semibold", children: "Unread" }) })
          ]
        },
        n.id
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:hidden space-y-3", children: notifications.slice(0, 20).map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-lg p-4 space-y-2",
        "data-ocid": `notif-card-${n.id}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono text-foreground line-clamp-2 flex-1", children: n.message }),
            priorityBadge(n.priority)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs font-mono capitalize", children: n.type.replace(/_/g, " ") }),
            n.relatedUser && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-mono", children: [
              "→ ",
              n.relatedUser
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-mono ml-auto", children: relativeTime(n.createdAt) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: n.read ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-mono", children: "Read" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-primary font-mono font-semibold", children: "Unread" }) })
        ]
      },
      n.id
    )) })
  ] });
}
function AdminNotificationsPage() {
  const { notifications, loading, markAllRead } = useAdminNotifications();
  const [refreshKey, setRefreshKey] = reactExports.useState(0);
  function handleSent() {
    setRefreshKey((k) => k + 1);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 border-b border-border pb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-primary/10 border border-primary/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold text-foreground tracking-wide", children: "Broadcast Notifications" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono mt-0.5", children: "Send in-app messages to users" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-display font-semibold text-foreground uppercase tracking-widest mb-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-1 h-4 bg-primary rounded-full" }),
        "Compose"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ComposeForm, { onSent: handleSent }, refreshKey)
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-display font-semibold text-foreground uppercase tracking-widest flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-1 h-4 bg-accent rounded-full" }),
          "Sent History"
        ] }),
        notifications.some((n) => !n.read) && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: markAllRead,
            className: "text-xs font-mono text-muted-foreground hover:text-foreground",
            "data-ocid": "notif-mark-all-read",
            children: "Mark all read"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-lg overflow-hidden p-4 min-h-[120px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SentHistory, { notifications, loading }) })
    ] })
  ] }) });
}
export {
  AdminNotificationsPage
};

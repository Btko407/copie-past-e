import { c as createLucideIcon, ai as useSupportTickets, r as reactExports, j as jsxRuntimeExports, S as Skeleton, B as Button, R as RefreshCw, a as ue } from "./index-CxqRs8Fn.js";
import { A as AdminLayout } from "./AdminLayout-C4UuyS2A.js";
import { B as Badge } from "./badge-CamUHYgR.js";
import { e as CircleHelp, C as Card, d as CardContent } from "./card-aIDbK3OF.js";
import { T as Textarea } from "./textarea-IQFpdPqY.js";
import { C as ChevronUp } from "./chevron-up-B-z0DJgK.js";
import { C as ChevronDown } from "./chevron-down-CAh52t0j.js";
import { C as CircleX } from "./circle-x-C4SyLe9F.js";
import "./credit-card-DsnG0NGQ.js";
import "./trash-2-DYMhRp-y.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["polyline", { points: "22 12 16 12 14 15 10 15 8 12 2 12", key: "o97t9d" }],
  [
    "path",
    {
      d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
      key: "oot6mr"
    }
  ]
];
const Inbox = createLucideIcon("inbox", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", key: "1lielz" }]
];
const MessageSquare = createLucideIcon("message-square", __iconNode);
function formatDate(ns) {
  const ms = Number(ns / 1000000n);
  if (!ms) return "—";
  return new Date(ms).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function statusLabel(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
function StatusBadge({ status }) {
  const variants = {
    open: {
      cls: "bg-destructive/20 text-destructive border-destructive/40",
      dot: "bg-destructive"
    },
    replied: {
      cls: "bg-primary/20 text-primary border-primary/40",
      dot: "bg-primary"
    },
    closed: {
      cls: "bg-muted text-muted-foreground border-border",
      dot: "bg-muted-foreground"
    }
  };
  const v = variants[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Badge,
    {
      variant: "outline",
      className: `inline-flex items-center gap-1.5 text-xs font-mono ${v.cls}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `w-1.5 h-1.5 rounded-full ${v.dot}` }),
        statusLabel(status)
      ]
    }
  );
}
function TicketDetail({
  ticket,
  onReply,
  onClose
}) {
  const [replyText, setReplyText] = reactExports.useState(ticket.adminReply ?? "");
  const [sending, setSending] = reactExports.useState(false);
  const [closing, setClosing] = reactExports.useState(false);
  async function handleReply() {
    const text = replyText.trim();
    if (!text) {
      ue.error("Reply cannot be empty.");
      return;
    }
    setSending(true);
    try {
      await onReply(ticket.id, text);
      ue.success("Reply sent. User has been notified.");
      setReplyText("");
    } catch (e) {
      ue.error(e instanceof Error ? e.message : "Failed to send reply.");
    } finally {
      setSending(false);
    }
  }
  async function handleClose() {
    setClosing(true);
    try {
      await onClose(ticket.id);
      ue.success("Ticket closed.");
    } catch (e) {
      ue.error(e instanceof Error ? e.message : "Failed to close ticket.");
    } finally {
      setClosing(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border-t border-border bg-card/60 px-4 py-5 space-y-4",
      "data-ocid": "ticket-detail-panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 text-xs font-mono text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-semibold", children: [
            "@",
            ticket.username
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-border", children: "|" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Subject: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: ticket.subject })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-border", children: "|" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Opened:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: formatDate(ticket.createdAt) })
          ] }),
          ticket.repliedAt && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-border", children: "|" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Replied:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: formatDate(ticket.repliedAt) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded border border-primary/30 bg-background/60 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-muted-foreground mb-1 uppercase tracking-widest", children: "User Message" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words", children: ticket.message })
        ] }),
        ticket.adminReply && ticket.status === "replied" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded border border-primary/40 bg-primary/5 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-primary mb-1 uppercase tracking-widest", children: "Admin Reply" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words", children: ticket.adminReply })
        ] }),
        ticket.status !== "closed" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              value: replyText,
              onChange: (e) => setReplyText(e.target.value),
              placeholder: "Type your reply to the user…",
              className: "min-h-[100px] text-sm font-mono resize-none bg-background border-input focus:border-primary/60",
              maxLength: 2e3,
              "data-ocid": "ticket-reply-textarea"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                onClick: handleReply,
                disabled: sending || closing,
                className: "font-mono text-xs",
                "data-ocid": "ticket-send-reply-btn",
                children: [
                  sending ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3 h-3 mr-1.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-3 h-3 mr-1.5" }),
                  sending ? "Sending…" : "Send Reply"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                onClick: handleClose,
                disabled: sending || closing,
                className: "font-mono text-xs border-muted-foreground/30 text-muted-foreground hover:text-foreground hover:border-foreground",
                "data-ocid": "ticket-close-btn",
                children: [
                  closing ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3 h-3 mr-1.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3 h-3 mr-1.5" }),
                  closing ? "Closing…" : "Close Ticket"
                ]
              }
            )
          ] })
        ] }),
        ticket.status === "closed" && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-mono text-muted-foreground flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3.5 h-3.5 text-muted-foreground" }),
          "This ticket is closed."
        ] })
      ]
    }
  );
}
function TicketRow({
  ticket,
  expanded,
  onToggle,
  onReply,
  onClose
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "tr",
      {
        className: "border-b border-border hover:bg-muted/20 transition-colors cursor-pointer",
        onClick: onToggle,
        onKeyDown: (e) => e.key === "Enter" && onToggle(),
        "data-ocid": `ticket-row-${ticket.id}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-sm font-mono text-foreground whitespace-nowrap", children: [
            "@",
            ticket.username
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-sm text-foreground max-w-[220px] truncate", children: ticket.subject }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: ticket.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs font-mono text-muted-foreground whitespace-nowrap", children: formatDate(ticket.createdAt) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "h-7 px-2 font-mono text-xs text-muted-foreground hover:text-foreground",
              "data-ocid": `ticket-view-btn-${ticket.id}`,
              onClick: (e) => {
                e.stopPropagation();
                onToggle();
              },
              children: [
                expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-3.5 h-3.5 mr-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3.5 h-3.5 mr-1" }),
                expanded ? "Hide" : "View"
              ]
            }
          ) })
        ]
      }
    ),
    expanded && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TicketDetail, { ticket, onReply, onClose }) }) })
  ] });
}
function TicketCard({
  ticket,
  expanded,
  onToggle,
  onReply,
  onClose
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Card,
    {
      className: "border-border bg-card overflow-hidden",
      "data-ocid": `ticket-card-${ticket.id}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-muted/20 transition-colors",
            onClick: onToggle,
            onKeyDown: (e) => e.key === "Enter" && onToggle(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-mono font-semibold text-foreground", children: [
                    "@",
                    ticket.username
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: ticket.status })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground truncate", children: ticket.subject }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-muted-foreground", children: formatDate(ticket.createdAt) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 text-muted-foreground shrink-0", children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4" }) })
            ]
          }
        ),
        expanded && /* @__PURE__ */ jsxRuntimeExports.jsx(TicketDetail, { ticket, onReply, onClose })
      ] })
    }
  );
}
function AdminSupportInboxPage() {
  const { tickets, loading, reply, close } = useSupportTickets();
  const [activeFilter, setActiveFilter] = reactExports.useState("all");
  const [expandedId, setExpandedId] = reactExports.useState(null);
  const intervalRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    function startPolling() {
      intervalRef.current = setInterval(() => {
      }, 3e4);
    }
    startPolling();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
  const filtered = tickets.filter((t) => {
    if (activeFilter === "all") return true;
    return t.status === activeFilter;
  });
  const counts = {
    all: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    replied: tickets.filter((t) => t.status === "replied").length,
    closed: tickets.filter((t) => t.status === "closed").length
  };
  const handleToggle = reactExports.useCallback(
    (id) => setExpandedId((prev) => prev === id ? null : id),
    []
  );
  const tabs = [
    { key: "all", label: "All" },
    { key: "open", label: "Open" },
    { key: "replied", label: "Replied" },
    { key: "closed", label: "Closed" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Inbox, { className: "w-5 h-5 text-primary shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-display font-bold text-foreground tracking-wide truncate", children: "Support Inbox" }),
        counts.open > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Badge,
          {
            variant: "outline",
            className: "shrink-0 text-xs font-mono bg-destructive/10 text-destructive border-destructive/40",
            children: [
              counts.open,
              " open"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-mono text-muted-foreground shrink-0", children: [
        tickets.length,
        " total"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex gap-1 mb-6 overflow-x-auto",
        "data-ocid": "ticket-filter-tabs",
        children: tabs.map(({ key, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setActiveFilter(key),
            className: `shrink-0 px-3 py-1.5 rounded text-xs font-mono transition-colors ${activeFilter === key ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"}`,
            "data-ocid": `ticket-tab-${key}`,
            children: [
              label,
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${activeFilter === key ? "bg-primary-foreground/20" : "bg-border"}`,
                  children: counts[key]
                }
              )
            ]
          },
          key
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded" }, i)) }),
      !loading && filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center py-20 gap-4 text-center",
          "data-ocid": "ticket-empty-state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleHelp, { className: "w-12 h-12 text-muted-foreground/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono text-muted-foreground max-w-sm", children: activeFilter === "all" ? "No support tickets yet. Users can submit tickets from their account settings or the help button." : `No ${activeFilter} tickets.` })
          ]
        }
      ),
      !loading && filtered.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block overflow-hidden rounded border border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", "data-ocid": "ticket-table", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left text-xs font-mono text-muted-foreground uppercase tracking-widest", children: "User" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left text-xs font-mono text-muted-foreground uppercase tracking-widest", children: "Subject" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left text-xs font-mono text-muted-foreground uppercase tracking-widest", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left text-xs font-mono text-muted-foreground uppercase tracking-widest", children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-right text-xs font-mono text-muted-foreground uppercase tracking-widest", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((ticket) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            TicketRow,
            {
              ticket,
              expanded: expandedId === ticket.id,
              onToggle: () => handleToggle(ticket.id),
              onReply: reply,
              onClose: close
            },
            ticket.id
          )) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:hidden space-y-3", "data-ocid": "ticket-card-list", children: filtered.map((ticket) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          TicketCard,
          {
            ticket,
            expanded: expandedId === ticket.id,
            onToggle: () => handleToggle(ticket.id),
            onReply: reply,
            onClose: close
          },
          ticket.id
        )) })
      ] })
    ] })
  ] });
}
export {
  AdminSupportInboxPage
};

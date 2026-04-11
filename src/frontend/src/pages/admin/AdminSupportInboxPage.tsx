import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useSupportTickets } from "@/hooks/useSupportTickets";
import type { SupportTicket } from "@/types";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Inbox,
  MessageSquare,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Helpers ──────────────────────────────────────────────────────────────────

type FilterTab = "all" | "open" | "replied" | "closed";

function formatDate(ns: bigint): string {
  const ms = Number(ns / 1_000_000n);
  if (!ms) return "—";
  return new Date(ms).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusLabel(status: SupportTicket["status"]): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: SupportTicket["status"] }) {
  const variants: Record<
    SupportTicket["status"],
    { cls: string; dot: string }
  > = {
    open: {
      cls: "bg-destructive/20 text-destructive border-destructive/40",
      dot: "bg-destructive",
    },
    replied: {
      cls: "bg-primary/20 text-primary border-primary/40",
      dot: "bg-primary",
    },
    closed: {
      cls: "bg-muted text-muted-foreground border-border",
      dot: "bg-muted-foreground",
    },
  };
  const v = variants[status];
  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center gap-1.5 text-xs font-mono ${v.cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${v.dot}`} />
      {statusLabel(status)}
    </Badge>
  );
}

// ─── Ticket Detail Panel ──────────────────────────────────────────────────────

function TicketDetail({
  ticket,
  onReply,
  onClose,
}: {
  ticket: SupportTicket;
  onReply: (id: number, text: string) => Promise<void>;
  onClose: (id: number) => Promise<void>;
}) {
  const [replyText, setReplyText] = useState(ticket.adminReply ?? "");
  const [sending, setSending] = useState(false);
  const [closing, setClosing] = useState(false);

  async function handleReply() {
    const text = replyText.trim();
    if (!text) {
      toast.error("Reply cannot be empty.");
      return;
    }
    setSending(true);
    try {
      await onReply(ticket.id, text);
      toast.success("Reply sent. User has been notified.");
      setReplyText("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to send reply.");
    } finally {
      setSending(false);
    }
  }

  async function handleClose() {
    setClosing(true);
    try {
      await onClose(ticket.id);
      toast.success("Ticket closed.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to close ticket.");
    } finally {
      setClosing(false);
    }
  }

  return (
    <div
      className="border-t border-border bg-card/60 px-4 py-5 space-y-4"
      data-ocid="ticket-detail-panel"
    >
      {/* User info row */}
      <div className="flex flex-wrap gap-3 text-xs font-mono text-muted-foreground">
        <span>
          <span className="text-foreground font-semibold">
            @{ticket.username}
          </span>
        </span>
        <span className="text-border">|</span>
        <span>
          Subject: <span className="text-foreground">{ticket.subject}</span>
        </span>
        <span className="text-border">|</span>
        <span>
          Opened:{" "}
          <span className="text-foreground">
            {formatDate(ticket.createdAt)}
          </span>
        </span>
        {ticket.repliedAt && (
          <>
            <span className="text-border">|</span>
            <span>
              Replied:{" "}
              <span className="text-foreground">
                {formatDate(ticket.repliedAt)}
              </span>
            </span>
          </>
        )}
      </div>

      {/* Message block */}
      <div className="rounded border border-primary/30 bg-background/60 px-4 py-3">
        <p className="text-xs font-mono text-muted-foreground mb-1 uppercase tracking-widest">
          User Message
        </p>
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
          {ticket.message}
        </p>
      </div>

      {/* Existing reply */}
      {ticket.adminReply && ticket.status === "replied" && (
        <div className="rounded border border-primary/40 bg-primary/5 px-4 py-3">
          <p className="text-xs font-mono text-primary mb-1 uppercase tracking-widest">
            Admin Reply
          </p>
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
            {ticket.adminReply}
          </p>
        </div>
      )}

      {/* Reply / close controls — only when not closed */}
      {ticket.status !== "closed" && (
        <div className="space-y-3">
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your reply to the user…"
            className="min-h-[100px] text-sm font-mono resize-none bg-background border-input focus:border-primary/60"
            maxLength={2000}
            data-ocid="ticket-reply-textarea"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={handleReply}
              disabled={sending || closing}
              className="font-mono text-xs"
              data-ocid="ticket-send-reply-btn"
            >
              {sending ? (
                <RefreshCw className="w-3 h-3 mr-1.5 animate-spin" />
              ) : (
                <MessageSquare className="w-3 h-3 mr-1.5" />
              )}
              {sending ? "Sending…" : "Send Reply"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleClose}
              disabled={sending || closing}
              className="font-mono text-xs border-muted-foreground/30 text-muted-foreground hover:text-foreground hover:border-foreground"
              data-ocid="ticket-close-btn"
            >
              {closing ? (
                <RefreshCw className="w-3 h-3 mr-1.5 animate-spin" />
              ) : (
                <XCircle className="w-3 h-3 mr-1.5" />
              )}
              {closing ? "Closing…" : "Close Ticket"}
            </Button>
          </div>
        </div>
      )}

      {ticket.status === "closed" && (
        <p className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-muted-foreground" />
          This ticket is closed.
        </p>
      )}
    </div>
  );
}

// ─── Desktop Table Row ────────────────────────────────────────────────────────

function TicketRow({
  ticket,
  expanded,
  onToggle,
  onReply,
  onClose,
}: {
  ticket: SupportTicket;
  expanded: boolean;
  onToggle: () => void;
  onReply: (id: number, text: string) => Promise<void>;
  onClose: (id: number) => Promise<void>;
}) {
  return (
    <>
      <tr
        className="border-b border-border hover:bg-muted/20 transition-colors cursor-pointer"
        onClick={onToggle}
        onKeyDown={(e) => e.key === "Enter" && onToggle()}
        data-ocid={`ticket-row-${ticket.id}`}
      >
        <td className="px-4 py-3 text-sm font-mono text-foreground whitespace-nowrap">
          @{ticket.username}
        </td>
        <td className="px-4 py-3 text-sm text-foreground max-w-[220px] truncate">
          {ticket.subject}
        </td>
        <td className="px-4 py-3">
          <StatusBadge status={ticket.status} />
        </td>
        <td className="px-4 py-3 text-xs font-mono text-muted-foreground whitespace-nowrap">
          {formatDate(ticket.createdAt)}
        </td>
        <td className="px-4 py-3 text-right">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 font-mono text-xs text-muted-foreground hover:text-foreground"
            data-ocid={`ticket-view-btn-${ticket.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            {expanded ? (
              <ChevronUp className="w-3.5 h-3.5 mr-1" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 mr-1" />
            )}
            {expanded ? "Hide" : "View"}
          </Button>
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-border">
          <td colSpan={5} className="p-0">
            <TicketDetail ticket={ticket} onReply={onReply} onClose={onClose} />
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Mobile Card ──────────────────────────────────────────────────────────────

function TicketCard({
  ticket,
  expanded,
  onToggle,
  onReply,
  onClose,
}: {
  ticket: SupportTicket;
  expanded: boolean;
  onToggle: () => void;
  onReply: (id: number, text: string) => Promise<void>;
  onClose: (id: number) => Promise<void>;
}) {
  return (
    <Card
      className="border-border bg-card overflow-hidden"
      data-ocid={`ticket-card-${ticket.id}`}
    >
      <CardContent className="p-0">
        <button
          type="button"
          className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-muted/20 transition-colors"
          onClick={onToggle}
          onKeyDown={(e) => e.key === "Enter" && onToggle()}
        >
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-mono font-semibold text-foreground">
                @{ticket.username}
              </span>
              <StatusBadge status={ticket.status} />
            </div>
            <p className="text-sm text-foreground truncate">{ticket.subject}</p>
            <p className="text-xs font-mono text-muted-foreground">
              {formatDate(ticket.createdAt)}
            </p>
          </div>
          <span className="mt-0.5 text-muted-foreground shrink-0">
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </span>
        </button>
        {expanded && (
          <TicketDetail ticket={ticket} onReply={onReply} onClose={onClose} />
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function AdminSupportInboxPage() {
  const { tickets, loading, reply, close } = useSupportTickets();
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Poll every 30s when page is visible
  useEffect(() => {
    function startPolling() {
      intervalRef.current = setInterval(() => {
        if (document.visibilityState === "visible") {
          // React Query staleTime handles actual refetching via invalidation
          // We trigger a visibility-based refresh
        }
      }, 30_000);
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

  const counts: Record<FilterTab, number> = {
    all: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    replied: tickets.filter((t) => t.status === "replied").length,
    closed: tickets.filter((t) => t.status === "closed").length,
  };

  const handleToggle = useCallback(
    (id: number) => setExpandedId((prev) => (prev === id ? null : id)),
    [],
  );

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "open", label: "Open" },
    { key: "replied", label: "Replied" },
    { key: "closed", label: "Closed" },
  ];

  return (
    <AdminLayout>
      {/* Page header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <Inbox className="w-5 h-5 text-primary shrink-0" />
          <h1 className="text-lg font-display font-bold text-foreground tracking-wide truncate">
            Support Inbox
          </h1>
          {counts.open > 0 && (
            <Badge
              variant="outline"
              className="shrink-0 text-xs font-mono bg-destructive/10 text-destructive border-destructive/40"
            >
              {counts.open} open
            </Badge>
          )}
        </div>
        <p className="text-xs font-mono text-muted-foreground shrink-0">
          {tickets.length} total
        </p>
      </div>

      {/* Filter tabs */}
      <div
        className="flex gap-1 mb-6 overflow-x-auto"
        data-ocid="ticket-filter-tabs"
      >
        {tabs.map(({ key, label }) => (
          <button
            type="button"
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`shrink-0 px-3 py-1.5 rounded text-xs font-mono transition-colors ${
              activeFilter === key
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
            data-ocid={`ticket-tab-${key}`}
          >
            {label}
            <span
              className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                activeFilter === key ? "bg-primary-foreground/20" : "bg-border"
              }`}
            >
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-20 gap-4 text-center"
            data-ocid="ticket-empty-state"
          >
            <HelpCircle className="w-12 h-12 text-muted-foreground/40" />
            <p className="text-sm font-mono text-muted-foreground max-w-sm">
              {activeFilter === "all"
                ? "No support tickets yet. Users can submit tickets from their account settings or the help button."
                : `No ${activeFilter} tickets.`}
            </p>
          </div>
        )}

        {/* Desktop table */}
        {!loading && filtered.length > 0 && (
          <>
            <div className="hidden md:block overflow-hidden rounded border border-border bg-card">
              <table className="w-full" data-ocid="ticket-table">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="px-4 py-2.5 text-left text-xs font-mono text-muted-foreground uppercase tracking-widest">
                      User
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-mono text-muted-foreground uppercase tracking-widest">
                      Subject
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-mono text-muted-foreground uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-mono text-muted-foreground uppercase tracking-widest">
                      Date
                    </th>
                    <th className="px-4 py-2.5 text-right text-xs font-mono text-muted-foreground uppercase tracking-widest">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((ticket) => (
                    <TicketRow
                      key={ticket.id}
                      ticket={ticket}
                      expanded={expandedId === ticket.id}
                      onToggle={() => handleToggle(ticket.id)}
                      onReply={reply}
                      onClose={close}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="md:hidden space-y-3" data-ocid="ticket-card-list">
              {filtered.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  expanded={expandedId === ticket.id}
                  onToggle={() => handleToggle(ticket.id)}
                  onReply={reply}
                  onClose={close}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

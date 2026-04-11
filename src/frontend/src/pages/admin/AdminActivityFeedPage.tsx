import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";
import type { AdminNotification } from "@/types";
import {
  Activity,
  AlertTriangle,
  Bell,
  CheckCheck,
  Database,
  DollarSign,
  ListChecks,
  Megaphone,
  UserPlus,
} from "lucide-react";
import { useEffect, useState } from "react";

// ── Helpers ────────────────────────────────────────────────────────────────────

const TYPE_META: Record<
  string,
  { icon: React.ElementType; color: string; bg: string; label: string }
> = {
  signup: {
    icon: UserPlus,
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
    label: "Signup",
  },
  payment: {
    icon: DollarSign,
    color: "text-green-400",
    bg: "bg-green-400/10 border-green-400/20",
    label: "Payment",
  },
  listing: {
    icon: ListChecks,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10 border-cyan-400/20",
    label: "Listing",
  },
  backup: {
    icon: Database,
    color: "text-purple-400",
    bg: "bg-purple-400/10 border-purple-400/20",
    label: "Backup",
  },
  error: {
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-red-400/10 border-red-400/20",
    label: "Error",
  },
  broadcast: {
    icon: Megaphone,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-400/20",
    label: "Broadcast",
  },
};

function getTypeMeta(type: string) {
  return (
    TYPE_META[type] ?? {
      icon: Bell,
      color: "text-muted-foreground",
      bg: "bg-secondary/20 border-border",
      label: type,
    }
  );
}

function relativeTime(nanoseconds: bigint): string {
  const ms = Number(nanoseconds / 1_000_000n);
  const now = Date.now();
  const diff = now - ms;
  if (diff < 0) return "just now";
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (mins < 2) return "just now";
  if (mins < 60) return `${mins} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Filter config ──────────────────────────────────────────────────────────────

type FilterKey = "all" | "signup" | "payment" | "listing" | "backup" | "error";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "signup", label: "Signups" },
  { key: "payment", label: "Payments" },
  { key: "listing", label: "Listings" },
  { key: "backup", label: "Backups" },
  { key: "error", label: "Errors" },
];

// ── Notification Card ─────────────────────────────────────────────────────────

function NotifCard({
  notif,
  onMarkRead,
}: {
  notif: AdminNotification;
  onMarkRead: (id: number) => void;
}) {
  const meta = getTypeMeta(notif.type);
  const Icon = meta.icon;

  return (
    <div
      data-ocid={`activity-notif-card-${notif.id}`}
      className={[
        "flex items-start gap-4 p-4 rounded-md border transition-smooth",
        !notif.read
          ? "bg-primary/5 border-primary/15"
          : "bg-card/50 border-border/40",
      ].join(" ")}
    >
      {/* Type icon */}
      <div
        className={`w-9 h-9 rounded-md border flex items-center justify-center shrink-0 ${meta.bg}`}
      >
        <Icon className={`w-4 h-4 ${meta.color}`} />
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <p
          className={`font-body text-sm leading-snug break-words ${
            !notif.read ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {notif.message}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
          <span
            className={`font-mono text-[10px] uppercase tracking-widest ${meta.color}`}
          >
            {meta.label}
          </span>
          {notif.relatedUser && (
            <span className="font-mono text-[10px] text-primary/70">
              @{notif.relatedUser}
            </span>
          )}
          <span className="font-mono text-[10px] text-muted-foreground/50">
            {relativeTime(notif.createdAt)}
          </span>
        </div>
      </div>

      {/* Read state + action */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        {!notif.read ? (
          <button
            type="button"
            onClick={() => onMarkRead(notif.id)}
            className="font-mono text-[10px] text-primary hover:text-primary/70 transition-smooth underline-offset-2 hover:underline whitespace-nowrap"
            aria-label="Mark as read"
            data-ocid={`activity-mark-read-${notif.id}`}
          >
            Mark read
          </button>
        ) : (
          <Badge
            variant="secondary"
            className="font-mono text-[9px] tracking-widest uppercase opacity-50 px-1.5"
          >
            Read
          </Badge>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function AdminActivityFeedPage() {
  const { notifications, unreadCount, loading, markRead, markAllRead } =
    useAdminNotifications();
  const [filter, setFilter] = useState<FilterKey>("all");

  // Auto-refresh every 30 seconds via the hook's refetchInterval (already set),
  // but we also force a local re-render for relative timestamps
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const filtered: AdminNotification[] =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  const filterUnread = (key: FilterKey) =>
    key === "all"
      ? unreadCount
      : notifications.filter((n) => n.type === key && !n.read).length;

  return (
    <AdminLayout title="Activity Feed">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="font-mono text-xs text-muted-foreground">
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "All caught up"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllRead()}
              className="font-mono text-xs tracking-widest uppercase self-start sm:self-auto"
              data-ocid="activity-mark-all-read-btn"
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>

        {/* ── Filter Tabs ──────────────────────────────────────────────────── */}
        <fieldset
          className="flex flex-wrap gap-2 border-none p-0 m-0"
          aria-label="Filter notifications by type"
          data-ocid="activity-filters"
        >
          <legend className="sr-only">Filter by type</legend>
          {FILTERS.map(({ key, label }) => {
            const count = filterUnread(key);
            const isActive = filter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                data-ocid={`activity-filter-${key}`}
                className={[
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs tracking-widest uppercase transition-smooth min-h-[36px] border",
                  isActive
                    ? "bg-primary/15 text-primary border-primary/30 glow-blue-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40 border-transparent",
                ].join(" ")}
                aria-pressed={isActive}
              >
                {label}
                {count > 0 && (
                  <span className="w-4 h-4 rounded-full bg-destructive text-destructive-foreground font-mono text-[9px] flex items-center justify-center leading-none">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </button>
            );
          })}
        </fieldset>

        {/* ── Content ─────────────────────────────────────────────────────── */}
        {loading ? (
          <div className="space-y-3" data-ocid="activity-loading">
            {["s1", "s2", "s3", "s4", "s5", "s6"].map((k) => (
              <Skeleton key={k} className="h-20 rounded-md" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 text-center"
            data-ocid="activity-empty-state"
          >
            <Activity className="w-10 h-10 text-muted-foreground/30 mb-4" />
            <p className="font-display text-sm text-muted-foreground uppercase tracking-widest">
              {filter === "all" ? "No activity yet" : `No ${filter} events`}
            </p>
            <p className="font-mono text-xs text-muted-foreground/50 mt-2">
              {filter === "all"
                ? "Events will appear here as users interact with the site."
                : `No ${filter} notifications found. Try a different filter.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3" data-ocid="activity-list">
            {filtered.map((notif) => (
              <NotifCard key={notif.id} notif={notif} onMarkRead={markRead} />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

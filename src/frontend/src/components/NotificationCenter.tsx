import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "motion/react";
import type { InAppNotification, NotificationType } from "../types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NotificationCenterProps {
  notifications: InAppNotification[];
  unreadCount: number;
  onMarkRead: (id: bigint) => void;
  onMarkAllRead: () => void;
  isLoading?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_ICON: Record<NotificationType, string> = {
  subscriptionExpiry: "⚡",
  subscriptionRenewed: "🔋",
  listingArchived: "📦",
  listingDeletionWarning: "⚠️",
  adminAnnouncement: "📢",
  lowFuelWarning: "⛽",
  paymentFailed: "❌",
  subscriptionCancelled: "🚫",
  refuelSuccess: "⚡",
};

const TYPE_BORDER: Record<NotificationType, string> = {
  subscriptionExpiry: "border-l-accent",
  subscriptionRenewed: "border-l-primary",
  listingArchived: "border-l-muted-foreground",
  listingDeletionWarning: "border-l-destructive",
  adminAnnouncement: "border-l-accent",
  lowFuelWarning: "border-l-destructive",
  paymentFailed: "border-l-destructive",
  subscriptionCancelled: "border-l-destructive",
  refuelSuccess: "border-l-primary",
};

const TYPE_UNREAD_BG: Record<NotificationType, string> = {
  subscriptionExpiry: "bg-accent/5",
  subscriptionRenewed: "bg-primary/5",
  listingArchived: "bg-secondary/30",
  listingDeletionWarning: "bg-destructive/5",
  adminAnnouncement: "bg-accent/5",
  lowFuelWarning: "bg-destructive/5",
  paymentFailed: "bg-destructive/5",
  subscriptionCancelled: "bg-destructive/5",
  refuelSuccess: "bg-primary/5",
};

function formatRelativeTime(createdAt: bigint): string {
  // createdAt may be nanoseconds or milliseconds
  const ms =
    createdAt > BigInt(1e15)
      ? Number(createdAt / BigInt(1_000_000))
      : Number(createdAt);
  const diff = Date.now() - ms;

  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min ago`;
  if (diff < 86_400_000)
    return `${Math.floor(diff / 3_600_000)} hour${Math.floor(diff / 3_600_000) !== 1 ? "s" : ""} ago`;
  if (diff < 604_800_000)
    return `${Math.floor(diff / 86_400_000)} day${Math.floor(diff / 86_400_000) !== 1 ? "s" : ""} ago`;
  return `${Math.floor(diff / 604_800_000)} week${Math.floor(diff / 604_800_000) !== 1 ? "s" : ""} ago`;
}

// ─── Notification Row ─────────────────────────────────────────────────────────

function NotificationRow({
  notification,
  onMarkRead,
}: {
  notification: InAppNotification;
  onMarkRead: (id: bigint) => void;
}) {
  const icon = TYPE_ICON[notification.notificationType];
  const borderColor = TYPE_BORDER[notification.notificationType];
  const unreadBg = TYPE_UNREAD_BG[notification.notificationType];

  return (
    <motion.button
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.25 }}
      type="button"
      onClick={() => !notification.isRead && onMarkRead(notification.id)}
      className={`w-full text-left px-4 py-3 border-l-2 ${borderColor} rounded-r transition-smooth hover:bg-secondary/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
        notification.isRead ? "bg-card/30 opacity-60" : unreadBg
      }`}
      data-ocid={`notification-row-${String(notification.id)}`}
      aria-label={`${notification.isRead ? "Read" : "Unread"}: ${notification.title}`}
    >
      <div className="flex items-start gap-3 min-w-0">
        {/* Icon */}
        <span className="text-lg shrink-0 mt-0.5" aria-hidden="true">
          {icon}
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <p
              className={`font-display text-xs font-bold tracking-wide truncate ${
                notification.isRead
                  ? "text-muted-foreground"
                  : "text-foreground text-glow-blue"
              }`}
            >
              {notification.title}
            </p>
            <span className="font-mono text-[10px] text-muted-foreground shrink-0 tabular-nums">
              {formatRelativeTime(notification.createdAt)}
            </span>
          </div>
          <p className="font-body text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {notification.message}
          </p>
        </div>

        {/* Unread dot */}
        {!notification.isRead && (
          <span
            className="shrink-0 mt-1.5 w-2 h-2 rounded-full bg-primary glow-blue-sm"
            aria-hidden="true"
          />
        )}
      </div>
    </motion.button>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function NotificationSkeleton() {
  return (
    <div className="flex flex-col gap-2 px-1">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex gap-3 p-3">
          <Skeleton className="h-6 w-6 rounded bg-primary/10 shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3 w-3/4 bg-primary/10 rounded" />
            <Skeleton className="h-3 w-full bg-muted/30 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function NotificationCenter({
  notifications,
  unreadCount,
  onMarkRead,
  onMarkAllRead,
  isLoading = false,
}: NotificationCenterProps) {
  return (
    <div
      className="rounded-xl bg-card/60 neon-border-blue overflow-hidden"
      data-ocid="notification-center"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <span className="font-display text-sm font-bold text-primary text-glow-blue tracking-wide uppercase">
            Notifications
          </span>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-primary/20 neon-border-blue font-mono text-[10px] font-bold text-primary text-glow-blue">
              {unreadCount}
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMarkAllRead}
            className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth h-7 px-2"
            data-ocid="mark-all-read-btn"
          >
            Mark all read
          </Button>
        )}
      </div>

      {/* Notification list */}
      <ScrollArea className="max-h-[360px]">
        <div className="p-2 flex flex-col gap-1">
          {isLoading ? (
            <NotificationSkeleton />
          ) : notifications.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-12 gap-3"
              data-ocid="notifications-empty"
            >
              <span className="text-3xl opacity-40" aria-hidden="true">
                🔔
              </span>
              <p className="font-display text-xs text-muted-foreground tracking-widest uppercase">
                No notifications
              </p>
              <p className="font-body text-xs text-muted-foreground/60 text-center max-w-[200px]">
                Account and subscription updates will appear here.
              </p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {notifications.map((notification) => (
                <NotificationRow
                  key={String(notification.id)}
                  notification={notification}
                  onMarkRead={onMarkRead}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

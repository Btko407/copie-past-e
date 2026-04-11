import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@caffeineai/core-infrastructure";
import { AlertTriangle, Bell, BellOff, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createActor } from "../../backend";
import { useAdminNotifications } from "../../hooks/useAdminNotifications";
import type { AdminNotification } from "../../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorAny = any;

// ─── Target type options ──────────────────────────────────────────────────────

type TargetType = "all" | "specific" | "free" | "expired";
type Priority = "normal" | "important" | "urgent";

const TARGET_OPTIONS: { value: TargetType; label: string }[] = [
  { value: "all", label: "All Users" },
  { value: "specific", label: "Specific User" },
  { value: "free", label: "Free Tier Only" },
  { value: "expired", label: "Expired Subscribers" },
];

const PRIORITY_OPTIONS: { value: Priority; label: string; color: string }[] = [
  { value: "normal", label: "Normal", color: "secondary" },
  { value: "important", label: "Important", color: "accent" },
  { value: "urgent", label: "Urgent", color: "destructive" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function relativeTime(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const diff = Date.now() - ms;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

function priorityBadge(priority: AdminNotification["priority"]) {
  if (priority === "urgent")
    return (
      <Badge variant="destructive" className="text-xs font-mono uppercase">
        Urgent
      </Badge>
    );
  if (priority === "important")
    return (
      <Badge
        variant="outline"
        className="text-xs font-mono uppercase border-accent text-accent"
      >
        Important
      </Badge>
    );
  return (
    <Badge variant="secondary" className="text-xs font-mono uppercase">
      Normal
    </Badge>
  );
}

// ─── Compose form ─────────────────────────────────────────────────────────────

function ComposeForm({ onSent }: { onSent: () => void }) {
  const { actor } = useActor(createActor);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetType, setTargetType] = useState<TargetType>("all");
  const [targetUser, setTargetUser] = useState("");
  const [priority, setPriority] = useState<Priority>("normal");
  const [sending, setSending] = useState(false);

  const canSend =
    title.trim().length > 0 &&
    message.trim().length > 0 &&
    (targetType !== "specific" || targetUser.trim().length > 0);

  async function handleSend() {
    if (!actor || !canSend) return;
    setSending(true);
    try {
      const userId: [] | [string] =
        targetType === "specific" && targetUser.trim()
          ? [targetUser.trim()]
          : [];

      const result = await (actor as ActorAny).createBroadcastNotification(
        title.trim(),
        message.trim(),
        priority,
        targetType,
        userId,
      );

      if ("err" in result) {
        toast.error(result.err);
      } else {
        const count = Number(result.ok);
        toast.success(
          `Notification sent to ${count} ${count === 1 ? "user" : "users"}`,
        );
        setTitle("");
        setMessage("");
        setTargetType("all");
        setTargetUser("");
        setPriority("normal");
        onSent();
      }
    } catch (err) {
      toast.error(
        `Failed to send: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-5">
      {/* Urgent banner hint */}
      <div className="flex items-start gap-2 rounded-md border border-accent/40 bg-accent/5 px-4 py-2.5 text-xs text-accent font-mono">
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
        <span>
          Urgent messages appear as banners in the user notification center
          until dismissed.
        </span>
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="notif-title"
            className="font-mono text-xs uppercase tracking-wider text-muted-foreground"
          >
            Title <span className="text-destructive">*</span>
          </Label>
          <span className="text-xs text-muted-foreground font-mono">
            {title.length}/100
          </span>
        </div>
        <Input
          id="notif-title"
          value={title}
          maxLength={100}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Notification title…"
          className="font-mono text-sm"
          data-ocid="notif-title-input"
        />
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="notif-message"
            className="font-mono text-xs uppercase tracking-wider text-muted-foreground"
          >
            Message <span className="text-destructive">*</span>
          </Label>
          <span className="text-xs text-muted-foreground font-mono">
            {message.length}/500
          </span>
        </div>
        <Textarea
          id="notif-message"
          value={message}
          maxLength={500}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Compose your message…"
          rows={4}
          className="font-mono text-sm resize-none"
          data-ocid="notif-message-input"
        />
      </div>

      {/* Send To */}
      <div className="space-y-2">
        <Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Send To
        </Label>
        <div className="flex flex-wrap gap-2">
          {TARGET_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTargetType(opt.value)}
              data-ocid={`target-${opt.value}`}
              className={`px-3 py-1.5 rounded border text-xs font-mono transition-colors duration-150 ${
                targetType === opt.value
                  ? "bg-primary/20 border-primary text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {targetType === "specific" && (
          <div className="pt-1">
            <Input
              value={targetUser}
              onChange={(e) => setTargetUser(e.target.value)}
              placeholder="Enter username…"
              className="font-mono text-sm max-w-xs"
              data-ocid="notif-target-user"
            />
          </div>
        )}
      </div>

      {/* Priority */}
      <div className="space-y-2">
        <Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Priority
        </Label>
        <div className="flex flex-wrap gap-2">
          {PRIORITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setPriority(opt.value)}
              data-ocid={`priority-${opt.value}`}
              className={`px-3 py-1.5 rounded border text-xs font-mono transition-colors duration-150 ${
                priority === opt.value
                  ? opt.value === "urgent"
                    ? "bg-destructive/20 border-destructive text-destructive"
                    : opt.value === "important"
                      ? "bg-accent/20 border-accent text-accent"
                      : "bg-primary/20 border-primary text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <Button
        onClick={handleSend}
        disabled={!canSend || sending}
        className="w-full sm:w-auto gap-2"
        data-ocid="notif-send-btn"
      >
        {sending ? (
          <>
            <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Notification
          </>
        )}
      </Button>
    </div>
  );
}

// ─── Sent history ─────────────────────────────────────────────────────────────

function SentHistory({
  notifications,
  loading,
}: {
  notifications: AdminNotification[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {(["s1", "s2", "s3", "s4"] as const).map((key) => (
          <Skeleton key={key} className="h-14 w-full rounded" />
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 text-center gap-3"
        data-ocid="notif-history-empty"
      >
        <BellOff className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-muted-foreground font-mono text-sm">
          No notifications sent yet.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2.5 px-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Date
              </th>
              <th className="text-left py-2.5 px-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Message
              </th>
              <th className="text-left py-2.5 px-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Type
              </th>
              <th className="text-left py-2.5 px-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Priority
              </th>
              <th className="text-left py-2.5 px-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Read
              </th>
            </tr>
          </thead>
          <tbody>
            {notifications.slice(0, 20).map((n) => (
              <tr
                key={n.id}
                className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                data-ocid={`notif-row-${n.id}`}
              >
                <td className="py-2.5 px-3 text-xs text-muted-foreground whitespace-nowrap">
                  {relativeTime(n.createdAt)}
                </td>
                <td className="py-2.5 px-3 max-w-xs">
                  <span className="line-clamp-1 text-foreground text-xs">
                    {n.message}
                  </span>
                  {n.relatedUser && (
                    <span className="text-muted-foreground text-xs block">
                      → {n.relatedUser}
                    </span>
                  )}
                </td>
                <td className="py-2.5 px-3">
                  <Badge
                    variant="outline"
                    className="text-xs font-mono capitalize"
                  >
                    {n.type.replace(/_/g, " ")}
                  </Badge>
                </td>
                <td className="py-2.5 px-3">{priorityBadge(n.priority)}</td>
                <td className="py-2.5 px-3">
                  {n.read ? (
                    <span className="text-xs text-muted-foreground font-mono">
                      Read
                    </span>
                  ) : (
                    <span className="text-xs text-primary font-mono font-semibold">
                      Unread
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {notifications.slice(0, 20).map((n) => (
          <div
            key={n.id}
            className="bg-card border border-border rounded-lg p-4 space-y-2"
            data-ocid={`notif-card-${n.id}`}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-mono text-foreground line-clamp-2 flex-1">
                {n.message}
              </p>
              {priorityBadge(n.priority)}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="outline" className="text-xs font-mono capitalize">
                {n.type.replace(/_/g, " ")}
              </Badge>
              {n.relatedUser && (
                <span className="text-xs text-muted-foreground font-mono">
                  → {n.relatedUser}
                </span>
              )}
              <span className="text-xs text-muted-foreground font-mono ml-auto">
                {relativeTime(n.createdAt)}
              </span>
            </div>
            <div>
              {n.read ? (
                <span className="text-xs text-muted-foreground font-mono">
                  Read
                </span>
              ) : (
                <span className="text-xs text-primary font-mono font-semibold">
                  Unread
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AdminNotificationsPage() {
  const { notifications, loading, markAllRead } = useAdminNotifications();
  const [refreshKey, setRefreshKey] = useState(0);

  function handleSent() {
    setRefreshKey((k) => k + 1);
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Page header */}
        <div className="flex items-center gap-3 border-b border-border pb-5">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-foreground tracking-wide">
              Broadcast Notifications
            </h1>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              Send in-app messages to users
            </p>
          </div>
        </div>

        {/* Compose section */}
        <section>
          <h2 className="text-sm font-display font-semibold text-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="inline-block w-1 h-4 bg-primary rounded-full" />
            Compose
          </h2>
          <ComposeForm key={refreshKey} onSent={handleSent} />
        </section>

        {/* Sent history section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-display font-semibold text-foreground uppercase tracking-widest flex items-center gap-2">
              <span className="inline-block w-1 h-4 bg-accent rounded-full" />
              Sent History
            </h2>
            {notifications.some((n) => !n.read) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllRead}
                className="text-xs font-mono text-muted-foreground hover:text-foreground"
                data-ocid="notif-mark-all-read"
              >
                Mark all read
              </Button>
            )}
          </div>
          <div className="bg-card border border-border rounded-lg overflow-hidden p-4 min-h-[120px]">
            <SentHistory notifications={notifications} loading={loading} />
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

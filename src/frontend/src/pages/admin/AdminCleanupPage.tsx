import type { UserCleanupSummary } from "@/backend";
import { TimeCircuitsCountdown } from "@/components/TimeCircuitsCountdown";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetCleanupSummaries,
  useRunLifecycleCleanup,
} from "@/hooks/useAdminUsers";
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Clock,
  RefreshCw,
  Trash2,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";

type FilterTab = "all" | "expired" | "renewal";

function formatTs(ts: bigint | undefined): string {
  if (!ts) return "—";
  const ms = Number(ts) > 1e15 ? Number(ts) / 1_000_000 : Number(ts);
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function userIdLabel(userId: { toString(): string }): string {
  const s = userId.toString();
  if (s.length > 20) return `${s.slice(0, 10)}…${s.slice(-6)}`;
  return s;
}

interface CleanupRowProps {
  user: UserCleanupSummary;
  expanded: boolean;
  onToggle: () => void;
}

function CleanupRow({ user, expanded, onToggle }: CleanupRowProps) {
  const activeCount = Number(user.activeListingCount);
  const archivedCount = Number(user.archivedListingCount);

  const borderClass = user.hasExpiredListings
    ? "circuit-glow-red border"
    : archivedCount > 0
      ? "circuit-glow-yellow border"
      : "border border-border/50";

  return (
    <div
      className={`rounded-lg bg-card/60 overflow-hidden ${borderClass}`}
      data-ocid="cleanup-user-row"
    >
      {/* Main row — clickable to expand */}
      <button
        type="button"
        className="w-full text-left p-4 flex items-start gap-3 hover:bg-card/80 transition-colors"
        onClick={onToggle}
        aria-expanded={expanded}
        data-ocid="cleanup-row-toggle"
      >
        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0 neon-border-blue mt-0.5">
          <Users className="w-4 h-4 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Email + ID */}
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-mono text-xs text-foreground truncate max-w-[200px]">
              {user.email || userIdLabel(user.userId)}
            </p>
            {user.email && (
              <p className="font-mono text-[10px] text-muted-foreground">
                {userIdLabel(user.userId)}
              </p>
            )}
          </div>

          {/* Badges */}
          <div className="flex gap-2 flex-wrap mt-1.5">
            <Badge
              variant="outline"
              className="font-mono text-[10px] text-primary border-primary/40 h-5"
            >
              {activeCount} active
            </Badge>
            {archivedCount > 0 && (
              <Badge
                variant="outline"
                className="font-mono text-[10px] text-accent border-accent/40 h-5"
              >
                {archivedCount} archived
              </Badge>
            )}
            {user.hasExpiredListings && (
              <Badge
                variant="outline"
                className="font-mono text-[10px] text-destructive border-destructive/60 bg-destructive/10 h-5 animate-circuit-pulse"
                data-ocid="needs-renewal-badge"
              >
                <AlertTriangle className="w-2.5 h-2.5 mr-1" />
                NEEDS RENEWAL
              </Badge>
            )}
          </div>
        </div>

        {/* Compact countdown + chevron */}
        <div className="flex items-center gap-3 shrink-0">
          {user.oldestActiveExpirationDate && (
            <div className="hidden sm:block">
              <TimeCircuitsCountdown
                expirationDate={user.oldestActiveExpirationDate}
                compact
              />
            </div>
          )}
          <div className="text-muted-foreground">
            {expanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </div>
        </div>
      </button>

      {/* Expanded panel */}
      {expanded && (
        <div className="border-t border-border/40 bg-background/30 p-4 space-y-4">
          {/* Oldest expiry countdown (full) */}
          {user.oldestActiveExpirationDate ? (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                Oldest Active Listing Expiry
              </p>
              <TimeCircuitsCountdown
                expirationDate={user.oldestActiveExpirationDate}
                label="LISTING EXPIRY"
              />
            </div>
          ) : (
            <p className="font-mono text-[10px] text-muted-foreground">
              No active listings with expiration date.
            </p>
          )}

          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-md bg-card/60 border border-border/40 p-3">
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                Active
              </p>
              <p className="font-display text-xl font-bold text-primary mt-0.5">
                {activeCount}
              </p>
            </div>
            <div className="rounded-md bg-card/60 border border-border/40 p-3">
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                Archived
              </p>
              <p className="font-display text-xl font-bold text-accent mt-0.5">
                {archivedCount}
              </p>
            </div>
            <div className="rounded-md bg-card/60 border border-border/40 p-3">
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                Oldest Expiry
              </p>
              <p className="font-mono text-xs text-foreground mt-0.5">
                {formatTs(user.oldestActiveExpirationDate)}
              </p>
            </div>
            <div className="rounded-md bg-card/60 border border-border/40 p-3">
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                Status
              </p>
              <p
                className={`font-mono text-xs mt-0.5 font-bold ${
                  user.hasExpiredListings
                    ? "text-destructive"
                    : archivedCount > 0
                      ? "text-accent"
                      : "text-green-400"
                }`}
              >
                {user.hasExpiredListings
                  ? "NEEDS RENEWAL"
                  : archivedCount > 0
                    ? "PENDING ARCHIVE"
                    : "NOMINAL"}
              </p>
            </div>
          </div>

          {/* Archived deletion warning */}
          {archivedCount > 0 && (
            <div className="rounded-md bg-destructive/10 border border-destructive/30 p-3 flex items-start gap-2">
              <Trash2 className="w-3.5 h-3.5 text-destructive shrink-0 mt-0.5" />
              <p className="font-mono text-[11px] text-destructive/90">
                {archivedCount} archived listing
                {archivedCount !== 1 ? "s" : ""} pending permanent deletion —
                auto-delete fires 30 days after archival unless user renews.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AdminCleanupPage() {
  const { data: summaries = [], isLoading, refetch } = useGetCleanupSummaries();
  const runCleanup = useRunLifecycleCleanup();
  const [filter, setFilter] = useState<FilterTab>("all");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expiredCount = summaries.filter((s) => s.hasExpiredListings).length;
  const archivedCount = summaries.filter(
    (s) => Number(s.archivedListingCount) > 0,
  ).length;

  const filtered = summaries
    .filter((s) => {
      if (filter === "expired") return s.hasExpiredListings;
      if (filter === "renewal")
        return Number(s.archivedListingCount) > 0 || s.hasExpiredListings;
      return true;
    })
    .sort(
      (a, b) =>
        (b.hasExpiredListings
          ? 2
          : Number(b.archivedListingCount) > 0
            ? 1
            : 0) -
        (a.hasExpiredListings ? 2 : Number(a.archivedListingCount) > 0 ? 1 : 0),
    );

  return (
    <AdminLayout title="Listing Cleanup" subtitle="Lifecycle Manager">
      <div className="max-w-4xl space-y-6" data-ocid="admin-cleanup-page">
        {/* Page title */}
        <div>
          <h1 className="font-display text-2xl font-black tracking-[0.15em] uppercase text-foreground text-glow-blue">
            LISTING CLEANUP MANAGER
          </h1>
          <p className="font-mono text-[11px] text-muted-foreground mt-1 tracking-wider">
            Monitor listing lifecycles · Trigger temporal sweeps · Manage user
            renewals
          </p>
        </div>

        {/* Stats + Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl bg-card circuit-glow-red border p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
              Users w/ Expired
            </p>
            <p className="font-display text-2xl font-black text-destructive text-glow-red">
              {expiredCount}
            </p>
          </div>
          <div className="rounded-xl bg-card circuit-glow-yellow border p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
              Archived Pending Delete
            </p>
            <p className="font-display text-2xl font-black text-accent text-glow-yellow">
              {archivedCount}
            </p>
          </div>
          <div className="rounded-xl bg-card neon-border-blue p-4 flex items-end">
            <Button
              className="w-full font-display font-bold tracking-widest uppercase text-xs bg-destructive/90 text-destructive-foreground hover:bg-destructive"
              onClick={() => runCleanup.mutate()}
              disabled={runCleanup.isPending}
              data-ocid="run-cleanup-btn"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              {runCleanup.isPending
                ? "RUNNING TEMPORAL SWEEP…"
                : "RUN CLEANUP NOW"}
            </Button>
          </div>
        </div>

        {/* Cleanup result */}
        {runCleanup.isSuccess && runCleanup.data && (
          <div
            className="rounded-xl bg-card circuit-glow-green border p-4 flex items-center gap-3"
            data-ocid="cleanup-result"
          >
            <Zap className="w-4 h-4 text-green-400 shrink-0" />
            <p className="font-mono text-sm text-green-400">
              ✓ Temporal sweep complete:{" "}
              <span className="font-bold">
                {String(runCleanup.data.archived)}
              </span>{" "}
              listings archived,{" "}
              <span className="font-bold">
                {String(runCleanup.data.deleted)}
              </span>{" "}
              permanently deleted
            </p>
          </div>
        )}

        {/* Lifecycle rules explainer */}
        <div className="rounded-xl bg-card/40 border border-border/40 p-4">
          <p className="font-display text-xs font-bold tracking-widest uppercase text-primary mb-3">
            ⚡ Lifecycle Rules
          </p>
          <ul className="space-y-2 font-mono text-[11px] text-muted-foreground">
            <li className="flex gap-2 items-start">
              <span className="text-primary shrink-0 mt-px">→</span>
              <span>
                Active listings auto-archive after{" "}
                <span className="text-foreground font-bold">30 days</span> (Tier
                1 / Free)
              </span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-primary shrink-0 mt-px">→</span>
              <span>
                Archived listings auto-delete after{" "}
                <span className="text-destructive font-bold">30 more days</span>{" "}
                of inactivity unless renewed
              </span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-accent shrink-0 mt-px">⚡</span>
              <span>
                Users can renew via tier upgrade — days stack on top of current
                expiry
              </span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-green-400 shrink-0 mt-px">∞</span>
              <span className="text-green-400 font-bold">
                Admins are exempt — unlimited uploads and time
              </span>
            </li>
          </ul>
        </div>

        {/* Filter tabs + user summaries */}
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <Tabs
              value={filter}
              onValueChange={(v) => setFilter(v as FilterTab)}
            >
              <TabsList
                className="font-mono text-[10px]"
                data-ocid="cleanup-filter-tabs"
              >
                <TabsTrigger value="all" data-ocid="filter-all">
                  All Users ({summaries.length})
                </TabsTrigger>
                <TabsTrigger value="expired" data-ocid="filter-expired">
                  Has Expired ({expiredCount})
                </TabsTrigger>
                <TabsTrigger value="renewal" data-ocid="filter-renewal">
                  Needs Renewal ({archivedCount})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button
              variant="outline"
              size="sm"
              className="font-mono text-[10px] uppercase gap-1.5"
              onClick={() => refetch()}
              data-ocid="refresh-summaries-btn"
            >
              <RefreshCw className="w-3 h-3" />
              Refresh
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="rounded-xl bg-card neon-border-blue p-8 text-center"
              data-ocid="cleanup-empty-state"
            >
              <Clock className="w-8 h-8 text-primary mx-auto mb-3 opacity-60" />
              <p className="font-display text-sm text-muted-foreground tracking-wider">
                {filter === "all"
                  ? "No user data available"
                  : "No users match this filter"}
              </p>
            </div>
          ) : (
            <div className="space-y-3" data-ocid="cleanup-user-list">
              {filtered.map((user) => {
                const uid = user.userId.toString();
                return (
                  <CleanupRow
                    key={uid}
                    user={user}
                    expanded={expandedIds.has(uid)}
                    onToggle={() => toggleExpanded(uid)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

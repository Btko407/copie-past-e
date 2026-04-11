import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetSiteAnalytics } from "@/hooks/useAdminAnalytics";
import { useListAllUsers } from "@/hooks/useAdminUsers";
import type { UserSummary } from "@/types";
import {
  ArrowUpDown,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Download,
  Image,
  LayoutDashboard,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

type SortKey = "userId" | "listingCount" | "imageCount" | "registrationDate";

function formatDate(ts: bigint | undefined) {
  if (!ts) return "—";
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function SortIcon({
  active,
  direction,
}: { active: boolean; direction: "asc" | "desc" }) {
  if (!active) return <ArrowUpDown className="w-3 h-3 opacity-40" />;
  return direction === "asc" ? (
    <ChevronUp className="w-3 h-3 text-primary" />
  ) : (
    <ChevronDown className="w-3 h-3 text-primary" />
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  glow,
  border,
  sub,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  glow: string;
  border: string;
  sub?: string;
}) {
  return (
    <div
      className={[
        "rounded-xl bg-card p-4 relative overflow-hidden",
        border,
      ].join(" ")}
      data-ocid="analytics-stat-card"
    >
      <div className="absolute inset-0 retro-grid opacity-10 pointer-events-none" />
      <div className="relative flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
            {label}
          </p>
          <p
            className={[
              "font-display text-2xl sm:text-3xl font-black",
              color,
              glow,
            ].join(" ")}
          >
            {value}
          </p>
          {sub && (
            <p className="font-mono text-[10px] text-muted-foreground mt-1">
              {sub}
            </p>
          )}
        </div>
        <div className="w-9 h-9 rounded-lg bg-card flex items-center justify-center shrink-0 border border-border/50">
          <Icon className={["w-5 h-5", color].join(" ")} />
        </div>
      </div>
    </div>
  );
}

function exportCSV(
  users: UserSummary[],
  totalUsers: bigint,
  totalListings: bigint,
  totalImages: bigint,
  avgListings: number,
  avgImages: number,
) {
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
    ...users.map((u) =>
      [
        u.userId,
        u.role,
        u.listingCount.toString(),
        u.imageCount.toString(),
        formatDate(u.registrationDate),
        u.lastLoginDate ? formatDate(u.lastLoginDate) : "—",
      ].join(","),
    ),
  ];

  const blob = new Blob([rows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `analytics-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function AdminAnalyticsPage() {
  const { data: analytics, isLoading: analyticsLoading } =
    useGetSiteAnalytics();
  const { data: users = [], isLoading: usersLoading } = useListAllUsers();

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("listingCount");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function getSortValue(
    user: UserSummary,
    key: SortKey,
  ): string | number | bigint {
    if (key === "registrationDate") return user.registrationDate;
    if (key === "listingCount") return user.listingCount;
    if (key === "imageCount") return user.imageCount;
    return user.userId;
  }

  const filtered = users
    .filter((u) =>
      search.trim()
        ? u.userId.toLowerCase().includes(search.toLowerCase())
        : true,
    )
    .sort((a, b) => {
      const av = getSortValue(a, sortKey);
      const bv = getSortValue(b, sortKey);
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const summaryStats = [
    {
      label: "Total Users",
      value: analytics?.totalUsers?.toString() ?? "—",
      icon: Users,
      color: "text-primary",
      glow: "text-glow-blue",
      border: "neon-border-blue",
    },
    {
      label: "Total Listings",
      value: analytics?.totalListings?.toString() ?? "—",
      icon: LayoutDashboard,
      color: "text-primary",
      glow: "text-glow-blue",
      border: "neon-border-blue",
    },
    {
      label: "Total Images",
      value: analytics?.totalImages?.toString() ?? "—",
      icon: Image,
      color: "text-accent",
      glow: "text-glow-yellow",
      border: "neon-border-yellow",
    },
    {
      label: "Avg Listings / User",
      value: analytics?.avgListingsPerUser?.toFixed(1) ?? "—",
      icon: BarChart3,
      color: "text-accent",
      glow: "text-glow-yellow",
      border: "neon-border-yellow",
      sub: "per registered account",
    },
    {
      label: "Avg Images / Listing",
      value: analytics?.avgImagesPerListing?.toFixed(1) ?? "—",
      icon: TrendingUp,
      color: "text-primary",
      glow: "text-glow-blue",
      border: "neon-border-blue",
      sub: "across all posts",
    },
  ];

  const COLS: { key: SortKey; label: string }[] = [
    { key: "userId", label: "Principal" },
    { key: "listingCount", label: "Listings" },
    { key: "imageCount", label: "Images" },
    { key: "registrationDate", label: "Registered" },
  ];

  return (
    <AdminLayout title="Analytics" subtitle="Site Metrics">
      {/* Summary Cards */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8"
        data-ocid="analytics-summary-cards"
      >
        {analyticsLoading
          ? [0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))
          : summaryStats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Per-User Table */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-3">
            <h3 className="font-display text-xs font-bold tracking-wider uppercase text-foreground">
              Per-User Breakdown
            </h3>
            {!usersLoading && (
              <Badge
                variant="outline"
                className="font-mono text-[10px] text-primary border-primary/50 bg-primary/5"
              >
                {users.length} users
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Filter by principal…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 font-mono text-xs bg-secondary/30 border-primary/30 focus:border-primary/60 w-full sm:w-56 h-10 min-h-[44px]"
                data-ocid="analytics-user-search"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                exportCSV(
                  users,
                  analytics?.totalUsers ?? BigInt(0),
                  analytics?.totalListings ?? BigInt(0),
                  analytics?.totalImages ?? BigInt(0),
                  analytics?.avgListingsPerUser ?? 0,
                  analytics?.avgImagesPerListing ?? 0,
                )
              }
              className="font-mono text-xs border-accent/40 text-accent hover:bg-accent/10 h-10 min-h-[44px] gap-1.5 shrink-0"
              data-ocid="export-csv-btn"
            >
              <Download className="w-3 h-3" />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">CSV</span>
            </Button>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block rounded-xl bg-card neon-border-blue overflow-hidden">
          {usersLoading ? (
            <div className="p-6 space-y-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 rounded" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-primary/20 hover:bg-transparent">
                    {COLS.map(({ key, label }) => (
                      <TableHead
                        key={key}
                        onClick={() => toggleSort(key)}
                        className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-smooth select-none whitespace-nowrap"
                      >
                        <span className="flex items-center gap-1">
                          {label}
                          <SortIcon
                            active={sortKey === key}
                            direction={sortDir}
                          />
                        </span>
                      </TableHead>
                    ))}
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Last Login
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center font-mono text-xs text-muted-foreground py-12"
                        data-ocid="analytics-empty-state"
                      >
                        No users match your filter
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((user) => (
                      <TableRow
                        key={user.userId}
                        className="border-primary/10 hover:bg-primary/5 transition-smooth"
                        data-ocid="analytics-user-row"
                      >
                        <TableCell className="font-mono text-xs text-foreground max-w-[160px]">
                          <span title={user.userId} className="truncate block">
                            {user.userId.slice(0, 10)}…{user.userId.slice(-6)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm font-bold text-primary text-glow-blue tabular-nums">
                          {user.listingCount.toString()}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm font-bold text-accent text-glow-yellow tabular-nums">
                          {user.imageCount.toString()}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(user.registrationDate)}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                          {user.lastLoginDate
                            ? formatDate(user.lastLoginDate)
                            : "—"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Mobile card list */}
        <div className="sm:hidden space-y-3">
          {usersLoading ? (
            [0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 rounded-lg" />
            ))
          ) : filtered.length === 0 ? (
            <div
              className="rounded-xl bg-card neon-border-blue p-8 text-center"
              data-ocid="analytics-empty-state"
            >
              <p className="font-mono text-xs text-muted-foreground">
                No users match your filter
              </p>
            </div>
          ) : (
            filtered.map((user) => (
              <div
                key={user.userId}
                className="rounded-lg bg-card/60 border border-border/50 p-4"
                data-ocid="analytics-user-row"
              >
                <p className="font-mono text-xs text-foreground truncate mb-3">
                  <span title={user.userId}>
                    {user.userId.slice(0, 14)}…{user.userId.slice(-6)}
                  </span>
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <p className="text-muted-foreground text-[10px] uppercase tracking-widest">
                      Listings
                    </p>
                    <p className="text-primary font-bold mt-0.5 flex items-center gap-1">
                      <LayoutDashboard className="w-3 h-3" />
                      {user.listingCount.toString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[10px] uppercase tracking-widest">
                      Images
                    </p>
                    <p className="text-accent font-bold mt-0.5 flex items-center gap-1">
                      <Image className="w-3 h-3" />
                      {user.imageCount.toString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[10px] uppercase tracking-widest">
                      Registered
                    </p>
                    <p className="text-foreground mt-0.5">
                      {formatDate(user.registrationDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[10px] uppercase tracking-widest">
                      Last Login
                    </p>
                    <p className="text-foreground mt-0.5">
                      {user.lastLoginDate
                        ? formatDate(user.lastLoginDate)
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

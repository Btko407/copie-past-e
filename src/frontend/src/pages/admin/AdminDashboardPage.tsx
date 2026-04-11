import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSiteAnalytics } from "@/hooks/useAdminAnalytics";
import { useGetAdminSettings } from "@/hooks/useAdminSettings";
import { useListAllUsers } from "@/hooks/useAdminUsers";
import { useListVersionHistory } from "@/hooks/useAdminVersions";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  Clock,
  Image,
  LayoutDashboard,
  Settings,
  Shield,
  Users,
  Zap,
} from "lucide-react";

const QUICK_LINKS = [
  {
    id: "settings",
    label: "Settings",
    desc: "Configure app, theme & security",
    path: "/admin/settings",
    icon: Settings,
    glow: "glow-blue-sm",
    border: "neon-border-blue",
    color: "text-primary",
    textGlow: "text-glow-blue",
  },
  {
    id: "users",
    label: "Users",
    desc: "Manage roles & accounts",
    path: "/admin/users",
    icon: Users,
    glow: "glow-yellow-sm",
    border: "neon-border-yellow",
    color: "text-accent",
    textGlow: "text-glow-yellow",
  },
  {
    id: "analytics",
    label: "Analytics",
    desc: "Posts, images & growth metrics",
    path: "/admin/analytics",
    icon: BarChart3,
    glow: "glow-blue-sm",
    border: "neon-border-blue",
    color: "text-primary",
    textGlow: "text-glow-blue",
  },
  {
    id: "versions",
    label: "Versions",
    desc: "History, snapshots & rollback",
    path: "/admin/versions",
    icon: Clock,
    glow: "glow-yellow-sm",
    border: "neon-border-yellow",
    color: "text-accent",
    textGlow: "text-glow-yellow",
  },
] as const;

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function AdminDashboardPage() {
  const { principalId } = useAuth();
  const { data: settings, isLoading: settingsLoading } = useGetAdminSettings();
  const { data: analytics, isLoading: analyticsLoading } =
    useGetSiteAnalytics();
  const { data: versions = [], isLoading: versionsLoading } =
    useListVersionHistory();
  const { data: users = [], isLoading: usersLoading } = useListAllUsers();

  const latestVersion = versions[0];
  const shortPrincipal = principalId
    ? `${principalId.slice(0, 8)}…${principalId.slice(-6)}`
    : null;

  // Sort users by registrationDate desc, take last 5
  const recentUsers = [...users]
    .sort((a, b) => Number(b.registrationDate) - Number(a.registrationDate))
    .slice(0, 5);

  const stats = [
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
  ];

  return (
    <AdminLayout title="Admin Dashboard" subtitle="Overview">
      {/* Welcome Banner */}
      <div
        className="mb-8 rounded-xl bg-card neon-border-blue p-6 relative overflow-hidden"
        style={{
          boxShadow:
            "0 0 40px oklch(0.65 0.22 262 / 0.08), 0 4px 24px oklch(0 0 0 / 0.4)",
        }}
        data-ocid="admin-welcome-banner"
      >
        <div className="absolute inset-0 retro-grid opacity-20 pointer-events-none" />
        <div className="relative flex flex-wrap items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center glow-blue-sm neon-border-blue shrink-0">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-xl font-bold tracking-wider text-foreground text-glow-blue uppercase">
              Control Center
            </h2>
            <p className="font-mono text-xs text-muted-foreground mt-0.5 tracking-wide truncate">
              {settingsLoading ? (
                <Skeleton className="h-3 w-32 inline-block" />
              ) : (
                (settings?.appName ?? "COPIE PAST-E")
              )}
              {" — Full admin access granted"}
            </p>
            {shortPrincipal && (
              <p className="font-mono text-[10px] text-primary/60 mt-1 tracking-widest">
                PRINCIPAL: {shortPrincipal}
              </p>
            )}
          </div>
          {versionsLoading ? (
            <Skeleton className="h-7 w-24" />
          ) : latestVersion ? (
            <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-accent/90 neon-border-yellow rounded px-3 py-1.5 bg-accent/5 glow-yellow-sm shrink-0">
              <Zap className="w-3 h-3" />
              {latestVersion.versionLabel}
            </div>
          ) : null}
        </div>
      </div>

      {/* Stats Cards */}
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        data-ocid="admin-stats-row"
      >
        {analyticsLoading
          ? [0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))
          : stats.map(({ label, value, icon: Icon, color, glow, border }) => (
              <div
                key={label}
                className={`rounded-xl bg-card ${border} p-5 relative overflow-hidden`}
                data-ocid="admin-stat-card"
              >
                <div className="absolute inset-0 retro-grid opacity-10 pointer-events-none" />
                <div className="relative flex items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                      {label}
                    </p>
                    <p
                      className={`font-display text-3xl font-black ${color} ${glow}`}
                    >
                      {value}
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-current/10 flex items-center justify-center shrink-0">
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                </div>
              </div>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Nav */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
            Quick Navigation
          </p>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_LINKS.map(
              ({
                id,
                label,
                desc,
                path,
                icon: Icon,
                border,
                color,
                textGlow,
                glow,
              }) => (
                <Link key={id} to={path} data-ocid={`admin-quicklink-${id}`}>
                  <div
                    className={[
                      "group rounded-xl bg-card",
                      border,
                      "p-4 transition-smooth hover:bg-secondary/20 cursor-pointer h-full",
                    ].join(" ")}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg bg-current/10 flex items-center justify-center mb-3 transition-smooth ${glow} opacity-80 group-hover:opacity-100`}
                    >
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <p
                      className={`font-display text-xs font-bold tracking-wider uppercase ${color} ${textGlow} mb-1`}
                    >
                      {label}
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </Link>
              ),
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
            Recently Registered
          </p>
          <div className="rounded-xl bg-card neon-border-blue overflow-hidden">
            {usersLoading ? (
              <div className="p-4 space-y-3">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-10 rounded" />
                ))}
              </div>
            ) : recentUsers.length === 0 ? (
              <div className="p-6 text-center font-mono text-xs text-muted-foreground">
                No users registered yet
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {recentUsers.map((user) => (
                  <div
                    key={user.userId}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/20 transition-smooth"
                    data-ocid="recent-user-row"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0 neon-border-blue">
                      <Users className="w-3 h-3 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs text-foreground truncate">
                        {user.userId.slice(0, 10)}…{user.userId.slice(-6)}
                      </p>
                      <p className="font-mono text-[10px] text-muted-foreground">
                        {formatDate(user.registrationDate)}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={[
                        "font-mono text-[10px] uppercase tracking-widest shrink-0",
                        user.role === "admin"
                          ? "text-accent border-accent/50 bg-accent/5"
                          : "text-primary border-primary/50 bg-primary/5",
                      ].join(" ")}
                    >
                      {user.role}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

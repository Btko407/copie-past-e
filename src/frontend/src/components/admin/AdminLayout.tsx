import { useAdminNotifications } from "@/hooks/useAdminNotifications";
import { useAuth } from "@/hooks/useAuth";
import type { AdminNotification } from "@/types";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  CheckCheck,
  Clock,
  CreditCard,
  Database,
  DollarSign,
  HeadphonesIcon,
  LayoutDashboard,
  ListChecks,
  Megaphone,
  Menu,
  Settings,
  ShieldAlert,
  Terminal,
  Trash2,
  UserPlus,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Settings", path: "/admin/settings", icon: Settings },
  { label: "Users", path: "/admin/users", icon: Users },
  { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  { label: "Versions", path: "/admin/versions", icon: Clock },
  { label: "Extension", path: "/admin/extension", icon: Zap },
  { label: "Tier Mgmt", path: "/admin/tiers", icon: Zap },
  { label: "Payments", path: "/admin/payments", icon: CreditCard },
  { label: "Cleanup", path: "/admin/cleanup", icon: Trash2 },
  { label: "Debugger", path: "/admin/debugger", icon: Terminal },
  { label: "Autofill", path: "/admin/autofill", icon: Zap },
  { label: "Broadcast", path: "/admin/notifications", icon: Bell },
  { label: "Activity", path: "/admin/activity", icon: Activity },
  { label: "Support", path: "/admin/support", icon: HeadphonesIcon },
  { label: "Emergency", path: "/admin/emergency-restore", icon: ShieldAlert },
] as const;

// Type → icon + color
const TYPE_META: Record<
  string,
  { icon: React.ElementType; color: string; page: string }
> = {
  signup: { icon: UserPlus, color: "text-blue-400", page: "/admin/users" },
  payment: {
    icon: DollarSign,
    color: "text-green-400",
    page: "/admin/payments",
  },
  listing: {
    icon: ListChecks,
    color: "text-cyan-400",
    page: "/admin/analytics",
  },
  backup: { icon: Database, color: "text-purple-400", page: "/admin/versions" },
  error: {
    icon: AlertTriangle,
    color: "text-red-400",
    page: "/admin/payments",
  },
  broadcast: {
    icon: Megaphone,
    color: "text-yellow-400",
    page: "/admin/notifications",
  },
};

function getTypeMeta(type: string) {
  return (
    TYPE_META[type] ?? {
      icon: Bell,
      color: "text-muted-foreground",
      page: "/admin/activity",
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
  return new Date(ms).toLocaleDateString();
}

// ── Bell Dropdown ──────────────────────────────────────────────────────────────
interface BellDropdownProps {
  notifications: AdminNotification[];
  unreadCount: number;
  markRead: (id: number) => void;
  markAllRead: () => void;
}

function BellDropdown({
  notifications,
  unreadCount,
  markRead,
  markAllRead,
}: BellDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  const recent = notifications.slice(0, 10);

  function handleNotifClick(notif: AdminNotification) {
    if (!notif.read) markRead(notif.id);
    const meta = getTypeMeta(notif.type);
    const page = notif.relatedId ? meta.page : meta.page;
    setOpen(false);
    navigate({ to: page });
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Activity feed${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={open}
        aria-haspopup="true"
        data-ocid="admin-bell-btn"
        className="relative w-10 h-10 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span
            className="absolute top-1 right-1 min-w-[16px] h-4 rounded-full bg-destructive text-destructive-foreground font-mono text-[9px] font-bold flex items-center justify-center px-1 leading-none"
            aria-hidden="true"
            data-ocid="admin-bell-badge"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <dialog
          open
          className="absolute right-0 top-full mt-2 w-[340px] max-w-[calc(100vw-1rem)] bg-card border border-primary/20 rounded-md shadow-2xl z-50 flex flex-col m-0 p-0"
          aria-label="Activity notifications"
          data-ocid="admin-bell-dropdown"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-primary/10 shrink-0">
            <span className="font-display text-xs font-bold tracking-widest text-foreground uppercase">
              Activity Feed
            </span>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => markAllRead()}
                  className="flex items-center gap-1 font-mono text-[10px] text-primary hover:text-primary/80 transition-smooth"
                  data-ocid="admin-bell-mark-all-read"
                >
                  <CheckCheck className="w-3 h-3" />
                  Mark All Read
                </button>
              )}
              <Link
                to="/admin/activity"
                onClick={() => setOpen(false)}
                className="font-mono text-[10px] text-accent hover:text-accent/80 transition-smooth underline-offset-2 hover:underline"
                data-ocid="admin-bell-view-all"
              >
                View All
              </Link>
            </div>
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto" style={{ maxHeight: "340px" }}>
            {recent.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="w-6 h-6 text-muted-foreground/40 mx-auto mb-2" />
                <p className="font-mono text-xs text-muted-foreground">
                  No activity yet
                </p>
              </div>
            ) : (
              recent.map((notif) => {
                const meta = getTypeMeta(notif.type);
                const Icon = meta.icon;
                return (
                  <button
                    key={notif.id}
                    type="button"
                    onClick={() => handleNotifClick(notif)}
                    data-ocid={`admin-bell-notif-${notif.id}`}
                    className={[
                      "w-full flex items-start gap-3 px-4 py-3 text-left border-b border-primary/5 last:border-b-0 transition-smooth hover:bg-secondary/30 min-h-[44px]",
                      !notif.read ? "bg-primary/5" : "",
                    ].join(" ")}
                  >
                    {/* Icon */}
                    <span className={`mt-0.5 shrink-0 ${meta.color}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-body text-xs leading-snug break-words ${!notif.read ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {notif.relatedUser && (
                          <span className="font-mono text-[10px] text-primary/70 truncate max-w-[100px]">
                            @{notif.relatedUser}
                          </span>
                        )}
                        <span className="font-mono text-[10px] text-muted-foreground/50">
                          {relativeTime(notif.createdAt)}
                        </span>
                      </div>
                    </div>
                    {/* Unread dot */}
                    {!notif.read && (
                      <span
                        className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0"
                        aria-label="Unread"
                      />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </dialog>
      )}
    </div>
  );
}

// ── NavItems ───────────────────────────────────────────────────────────────────
function NavItems({
  currentPath,
  onNavigate,
}: {
  currentPath: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
        const isActive =
          path === "/admin"
            ? currentPath === "/admin"
            : currentPath.startsWith(path);

        return (
          <Link
            key={path}
            to={path}
            onClick={onNavigate}
            data-ocid={`admin-nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
            className={[
              "flex items-center gap-3 px-3 py-3 rounded-md font-mono text-xs tracking-widest uppercase transition-smooth group min-h-[44px]",
              isActive
                ? "bg-primary/15 text-primary glow-blue-sm neon-border-blue"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/40",
            ].join(" ")}
          >
            <Icon
              className={[
                "w-4 h-4 shrink-0 transition-smooth",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground group-hover:text-foreground",
              ].join(" ")}
            />
            {label}
            {isActive && (
              <span className="ml-auto w-1 h-4 rounded-full bg-primary glow-blue-sm" />
            )}
          </Link>
        );
      })}
    </>
  );
}

// ── AdminLayout ────────────────────────────────────────────────────────────────
interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const { principalId } = useAuth();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { notifications, unreadCount, markRead, markAllRead } =
    useAdminNotifications();

  const shortId = principalId
    ? `${principalId.slice(0, 6)}…${principalId.slice(-4)}`
    : null;

  useEffect(() => {
    setDrawerOpen(false);
  }, []);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <div className="min-h-screen bg-background flex" data-ocid="admin-layout">
      {/* ── Desktop Sidebar ─────────────────────────────────────────────────── */}
      <aside
        className="hidden md:flex w-64 shrink-0 bg-card border-r border-primary/20 flex-col retro-grid relative overflow-hidden"
        style={{ boxShadow: "inset -4px 0 20px oklch(0.65 0.22 262 / 0.05)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0.95 0 0) 2px, oklch(0.95 0 0) 4px)",
          }}
        />

        <div className="px-5 py-5 border-b border-primary/20 relative">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 group focus-visible:outline-none"
          >
            <span className="font-display text-xs font-bold tracking-widest text-primary text-glow-blue uppercase">
              COPIE PAST-E
            </span>
          </Link>
          <p className="font-mono text-[10px] tracking-[0.2em] text-accent/70 uppercase mt-0.5">
            Admin Panel
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 relative overflow-y-auto">
          <NavItems currentPath={currentPath} />
        </nav>

        {shortId && (
          <div className="px-4 py-4 border-t border-primary/20 relative">
            <p className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-widest mb-1">
              Principal
            </p>
            <span className="font-mono text-xs text-primary/80 neon-border-blue rounded px-2 py-1 inline-block bg-card/50">
              {shortId}
            </span>
          </div>
        )}
      </aside>

      {/* ── Mobile Drawer Backdrop ───────────────────────────────────────────── */}
      {drawerOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden w-full cursor-default"
          onClick={() => setDrawerOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setDrawerOpen(false)}
          aria-label="Close navigation menu"
          tabIndex={-1}
        />
      )}

      {/* ── Mobile Drawer ───────────────────────────────────────────────────── */}
      <dialog
        open={drawerOpen}
        className={[
          "fixed inset-y-0 left-0 z-50 w-72 m-0 max-h-none h-full bg-card border-r border-primary/20 flex flex-col retro-grid md:hidden transition-transform duration-300 ease-in-out p-0",
          drawerOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        aria-label="Admin navigation"
        data-ocid="admin-mobile-drawer"
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0.95 0 0) 2px, oklch(0.95 0 0) 4px)",
          }}
        />

        <div className="px-5 py-4 border-b border-primary/20 relative flex items-center justify-between">
          <div>
            <Link
              to="/dashboard"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-2 focus-visible:outline-none"
            >
              <span className="font-display text-xs font-bold tracking-widest text-primary text-glow-blue uppercase">
                COPIE PAST-E
              </span>
            </Link>
            <p className="font-mono text-[10px] tracking-[0.2em] text-accent/70 uppercase mt-0.5">
              Admin Panel
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-smooth shrink-0"
            aria-label="Close navigation menu"
            data-ocid="admin-drawer-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 relative overflow-y-auto">
          <NavItems
            currentPath={currentPath}
            onNavigate={() => setDrawerOpen(false)}
          />
        </nav>

        {shortId && (
          <div className="px-4 py-4 border-t border-primary/20 relative">
            <p className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-widest mb-1">
              Principal
            </p>
            <span className="font-mono text-xs text-primary/80 neon-border-blue rounded px-2 py-1 inline-block bg-card/50">
              {shortId}
            </span>
          </div>
        )}
      </dialog>

      {/* ── Main Area ───────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-card/90 backdrop-blur-md border-b border-primary/20 flex items-center px-4 gap-3 sticky top-0 z-30">
          {/* Hamburger — mobile only */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-smooth shrink-0 md:hidden"
            aria-label="Open navigation menu"
            aria-expanded={drawerOpen}
            data-ocid="admin-hamburger-btn"
          >
            <Menu className="w-5 h-5" />
          </button>

          {title && (
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <h1 className="font-display text-sm font-bold tracking-wider text-foreground text-glow-blue truncate uppercase">
                {title}
              </h1>
              {subtitle && (
                <>
                  <span className="text-muted-foreground/40 hidden sm:inline">
                    /
                  </span>
                  <span className="font-mono text-xs text-muted-foreground truncate hidden sm:inline">
                    {subtitle}
                  </span>
                </>
              )}
            </div>
          )}

          <div className="ml-auto flex items-center gap-2">
            {/* Bell notification button */}
            <BellDropdown
              notifications={notifications}
              unreadCount={unreadCount}
              markRead={markRead}
              markAllRead={markAllRead}
            />
            <span className="font-mono text-[10px] text-accent/70 tracking-widest uppercase neon-border-yellow rounded px-2 py-0.5 bg-accent/5">
              ⚡ ADMIN
            </span>
          </div>
        </header>

        {/* Content */}
        <main
          className="flex-1 overflow-auto p-4 md:p-6"
          data-ocid="admin-content"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

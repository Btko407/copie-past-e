import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useGetMyGasWallet } from "@/hooks/useGasWallet";
import { useNotifications } from "@/hooks/useNotifications";
import { useProfile } from "@/hooks/useProfile";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Bell,
  Fuel,
  LayoutGrid,
  LogOut,
  Settings,
  Shield,
  User,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createActor } from "../backend";
import { NotificationCenter } from "./NotificationCenter";

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { actor, isFetching } = useActor(createActor);
  const { username, isLoading: profileLoading } = useProfile();
  const { notifications, unreadCount, markRead, markAllRead } =
    useNotifications();

  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  // Close bell dropdown when clicking outside
  useEffect(() => {
    if (!bellOpen) return;
    function handleClick(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [bellOpen]);

  const { data: isAdmin } = useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 300_000,
  });

  const { data: gasWallet, isLoading: gasLoading } = useGetMyGasWallet();

  return (
    <header
      className="sticky top-0 z-50 w-full bg-card/90 backdrop-blur-md border-b border-primary/20"
      data-ocid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to={isAuthenticated ? "/dashboard" : "/"}
          className="flex items-center gap-2 group focus-visible:outline-none"
          data-ocid="navbar-logo"
        >
          <Zap
            className="w-5 h-5 text-primary transition-smooth group-hover:text-accent"
            strokeWidth={2.5}
          />
          <span className="font-display text-lg font-bold tracking-wide text-primary text-glow-blue group-hover:text-accent group-hover:text-glow-yellow transition-smooth">
            COPIE PAST-E
          </span>
        </Link>

        {/* Right side */}
        {isAuthenticated && (
          <nav className="flex items-center gap-3" data-ocid="navbar-actions">
            {/* Username / profile link */}
            <div
              className="hidden sm:flex items-center gap-1.5"
              data-ocid="navbar-identity"
            >
              {profileLoading ? (
                <Skeleton className="h-6 w-20 bg-primary/10 rounded" />
              ) : username ? (
                <Link
                  to="/profile"
                  className="group"
                  data-ocid="navbar-profile-link"
                >
                  <span className="font-mono text-xs neon-border-blue rounded px-2 py-1 bg-card text-primary text-glow-blue group-hover:glow-blue-sm transition-smooth cursor-pointer flex items-center gap-1.5">
                    <User className="w-3 h-3" />@{username}
                  </span>
                </Link>
              ) : (
                <Link to="/settings" data-ocid="navbar-set-username-link">
                  <span className="font-mono text-xs neon-border-blue rounded px-2 py-1 bg-card text-muted-foreground hover:text-primary transition-smooth cursor-pointer">
                    Set username
                  </span>
                </Link>
              )}
            </div>

            {/* Admin badge */}
            {isAdmin && (
              <Link to="/admin" data-ocid="navbar-admin-link">
                <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase text-accent neon-border-yellow rounded px-2 py-1 bg-accent/10 transition-smooth hover:glow-yellow-sm cursor-pointer text-glow-yellow">
                  <Shield className="w-3 h-3" />
                  Admin
                </span>
              </Link>
            )}

            {/* Gas balance */}
            <Link to="/wallet" data-ocid="navbar-gas-balance">
              <span
                className={`hidden sm:inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase rounded px-2 py-1 transition-smooth cursor-pointer ${
                  gasWallet != null && gasWallet.gasBalance < 10
                    ? "text-destructive border border-destructive/50 bg-destructive/10 hover:glow-red-sm"
                    : "text-accent neon-border-yellow bg-accent/10 hover:glow-yellow-sm"
                }`}
                title="Gas balance — click to manage wallet"
              >
                <Fuel
                  className={`w-3 h-3 ${gasWallet != null && gasWallet.gasBalance < 10 ? "text-destructive" : "text-accent"}`}
                />
                {gasLoading ? (
                  <Skeleton className="h-3 w-8 bg-accent/20" />
                ) : gasWallet != null ? (
                  <span
                    className={
                      gasWallet.gasBalance < 10
                        ? "text-destructive"
                        : "text-accent text-glow-yellow"
                    }
                  >
                    {gasWallet.gasBalance.toLocaleString()} GAS
                  </span>
                ) : (
                  <span className="text-muted-foreground">— GAS</span>
                )}
              </span>
            </Link>

            {/* Listings button */}
            <Link to="/dashboard" data-ocid="navbar-listings-link">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-foreground hover:text-primary hover:bg-primary/10 transition-smooth"
                aria-label="Go to Listings"
                data-ocid="navbar-listings-btn"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Listings</span>
              </Button>
            </Link>

            {/* Notification bell */}
            <div className="relative" ref={bellRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setBellOpen((v) => !v)}
                className="relative text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-smooth"
                aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
                data-ocid="navbar-bell-btn"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span
                    className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary glow-blue-sm animate-pulse"
                    aria-hidden="true"
                  />
                )}
              </Button>

              {/* Mini dropdown */}
              {bellOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-80 z-50 rounded-xl shadow-2xl bg-card neon-border-blue overflow-hidden"
                  data-ocid="navbar-bell-dropdown"
                >
                  <div className="px-4 py-2.5 border-b border-border/60 flex items-center justify-between">
                    <span className="font-display text-xs font-bold text-primary text-glow-blue tracking-wide uppercase">
                      Notifications
                    </span>
                    <Link
                      to="/profile"
                      className="font-mono text-[10px] text-muted-foreground hover:text-primary transition-smooth"
                      onClick={() => setBellOpen(false)}
                      data-ocid="navbar-bell-view-all"
                    >
                      View all →
                    </Link>
                  </div>
                  <div className="p-2 flex flex-col gap-1 max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-center font-mono text-xs text-muted-foreground py-6">
                        No notifications
                      </p>
                    ) : (
                      notifications.slice(0, 3).map((n) => (
                        <button
                          key={String(n.id)}
                          type="button"
                          onClick={() => {
                            if (!n.isRead) markRead(n.id);
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded transition-smooth hover:bg-secondary/20 border-l-2 ${
                            n.isRead
                              ? "border-l-border opacity-60"
                              : "border-l-primary"
                          }`}
                        >
                          <p
                            className={`font-display text-[11px] font-bold truncate ${n.isRead ? "text-muted-foreground" : "text-foreground"}`}
                          >
                            {n.notificationType === "subscriptionExpiry"
                              ? "⚡"
                              : n.notificationType === "subscriptionRenewed"
                                ? "🔋"
                                : n.notificationType ===
                                    "listingDeletionWarning"
                                  ? "⚠️"
                                  : "📢"}{" "}
                            {n.title}
                          </p>
                          <p className="font-body text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                            {n.message}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && unreadCount > 0 && (
                    <div className="px-3 py-2 border-t border-border/60">
                      <button
                        type="button"
                        onClick={() => {
                          markAllRead();
                          setBellOpen(false);
                        }}
                        className="w-full font-mono text-[10px] text-muted-foreground hover:text-primary transition-smooth text-center"
                        data-ocid="navbar-bell-mark-all"
                      >
                        Mark all as read
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Settings icon */}
            <Link
              to="/settings"
              aria-label="Account settings"
              data-ocid="navbar-settings-link"
            >
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-smooth"
                aria-label="Settings"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-smooth"
              aria-label="Logout"
              data-ocid="navbar-logout-btn"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}

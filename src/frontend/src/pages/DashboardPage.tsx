import { Layout } from "@/components/Layout";
import { ListingCard } from "@/components/ListingCard";
import { MaintenanceBanner } from "@/components/MaintenanceBanner";
import { PaymentBanners } from "@/components/PaymentBanners";
import { LowFuelWarningBanner, RefuelBanner } from "@/components/RefuelBanner";
import { TimeCircuitsCountdown } from "@/components/TimeCircuitsCountdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useFavoritedListings, useListings } from "@/hooks/useListings";
import { useCheckLowFuelNotification } from "@/hooks/useNotifications";
import { useGetMySubscription, useGetTiers } from "@/hooks/useTiers";
import { useNavigate } from "@tanstack/react-router";
import { Heart, Plus, Search, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Listing } from "../backend";
import { ListingStatus } from "../backend";
import { computeFuelFromExpiry } from "../components/GasFuelTank";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabKey = "active" | "archived" | "favorites";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function nsToMs(ns: bigint | number): number {
  if (typeof ns === "bigint") return Number(ns) / 1_000_000;
  return ns > 1e15 ? ns / 1_000_000 : ns;
}

function formatCompactTime(msRemaining: number): string {
  if (msRemaining <= 0) return "EXPIRED";
  const totalSecs = Math.floor(msRemaining / 1000);
  const days = Math.floor(totalSecs / (24 * 3600));
  const rem = totalSecs % (24 * 3600);
  const hours = Math.floor(rem / 3600);
  const mins = Math.floor((rem % 3600) / 60);
  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  parts.push(`${mins}m`);
  return parts.join(" ");
}

// ─── Compact Countdown Banner (mobile) ────────────────────────────────────────

interface CompactCountdownProps {
  expirationDate: bigint | number;
  tierName: string;
}

function CompactCountdown({ expirationDate, tierName }: CompactCountdownProps) {
  const expMs = nsToMs(expirationDate);
  const [msRemaining, setMsRemaining] = useState(() => expMs - Date.now());

  // Use useEffect-free polling via a ref-driven interval; kept simple with useState + interval
  useState(() => {
    const tick = () => setMsRemaining(expMs - Date.now());
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  });

  const timeStr = formatCompactTime(msRemaining);
  const isExpired = msRemaining <= 0;
  // Threshold: show warning only when < 20% fuel — determined by DashboardPage
  const isLow = msRemaining > 0 && msRemaining < 7 * 24 * 60 * 60 * 1000;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-mono ${
        isExpired
          ? "border-destructive/60 bg-destructive/10 text-destructive"
          : isLow
            ? "border-accent/60 bg-accent/10 text-accent"
            : "border-primary/40 bg-primary/10 text-primary"
      }`}
      data-ocid="compact-countdown-banner"
    >
      <span className="text-sm">⏱</span>
      <span
        className={`font-bold tracking-wide ${isExpired ? "animate-circuit-pulse" : ""}`}
      >
        {timeStr}
      </span>
      <span className="text-muted-foreground">remaining</span>
      <span className="mx-1 text-muted-foreground">·</span>
      <span className="font-display font-bold tracking-widest uppercase text-[10px]">
        {tierName}
      </span>
    </div>
  );
}

// ─── Skeleton Grid ─────────────────────────────────────────────────────────────

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-3 gap-1.5" data-ocid="listings-skeleton">
      {Array.from({ length: 9 }, (_, i) => `sk-${i}`).map((key) => (
        <div key={key} className="aspect-square rounded-md overflow-hidden">
          <Skeleton className="w-full h-full rounded-none" />
        </div>
      ))}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

interface EmptyStateProps {
  tab: TabKey;
  onImport: () => void;
}

function EmptyState({ tab, onImport }: EmptyStateProps) {
  const config = {
    active: {
      icon: "📋",
      title: "Your archive is empty",
      desc: "Start capturing listings to build your reuse archive. Import once, copy forever.",
      cta: "Create your first listing",
      showCta: true,
    },
    archived: {
      icon: "🗃",
      title: "No archived listings",
      desc: "Listings you archive will appear here for 30 days before deletion.",
      cta: "",
      showCta: false,
    },
    favorites: {
      icon: "🤍",
      title: "No favorites yet",
      desc: "Tap ♡ on any listing to add it here.",
      cta: "",
      showCta: false,
    },
  }[tab];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
      data-ocid={`empty-state-${tab}`}
    >
      <span className="text-5xl mb-4">{config.icon}</span>
      <h3 className="font-display text-base font-bold text-foreground text-glow-blue mb-2">
        {config.title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-6">
        {config.desc}
      </p>
      {config.showCta && (
        <Button
          onClick={onImport}
          className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 glow-yellow font-display font-bold tracking-wide"
          data-ocid="create-first-listing-btn"
        >
          <Plus className="h-4 w-4" />
          {config.cta}
        </Button>
      )}
    </motion.div>
  );
}

// ─── Listings Grid ─────────────────────────────────────────────────────────────

interface ListingsGridProps {
  listings: Listing[];
}

function ListingsGrid({ listings }: ListingsGridProps) {
  return (
    <div className="grid grid-cols-3 gap-1.5" data-ocid="listings-grid">
      {listings.map((listing, index) => (
        <ListingCard
          key={listing.id.toString()}
          listing={listing}
          index={index}
        />
      ))}
    </div>
  );
}

// ─── Tab Bar ──────────────────────────────────────────────────────────────────

interface TabBarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  activeCnt: number;
  archivedCnt: number;
  favoritesCnt: number;
}

function TabBar({
  activeTab,
  onTabChange,
  activeCnt,
  archivedCnt,
  favoritesCnt,
}: TabBarProps) {
  const tabs: {
    key: TabKey;
    label: string;
    count: number;
    textClass: string;
  }[] = [
    {
      key: "active",
      label: "Active",
      count: activeCnt,
      textClass: "text-foreground",
    },
    {
      key: "archived",
      label: "Archived",
      count: archivedCnt,
      textClass: "text-accent",
    },
    {
      key: "favorites",
      label: "Favorites",
      count: favoritesCnt,
      textClass: "text-accent",
    },
  ];

  return (
    <div
      className="flex border-b border-border/40 mb-4"
      role="tablist"
      data-ocid="tab-bar"
    >
      {tabs.map(({ key, label, count, textClass }) => {
        const isActive = activeTab === key;
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-display font-bold tracking-wide transition-smooth relative ${
              isActive
                ? "text-primary"
                : `${textClass} opacity-70 hover:opacity-100`
            }`}
            onClick={() => onTabChange(key)}
            data-ocid={`tab-${key}`}
          >
            {key === "favorites" && <Heart className="h-3 w-3" />}
            {label}
            <span
              className={`font-mono text-[10px] px-1 py-0.5 rounded ${
                isActive
                  ? "bg-primary/20 text-primary"
                  : "bg-muted/60 text-muted-foreground"
              }`}
            >
              {count}
            </span>
            {isActive && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary glow-blue-sm rounded-t"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

// Threshold: show low-fuel banner only when fuel drops below 20%
const LOW_FUEL_THRESHOLD = 20;

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: listings, isLoading: listingsLoading } = useListings();
  const { data: favoritedListings, isLoading: favoritesLoading } =
    useFavoritedListings();
  const { data: subscription } = useGetMySubscription();
  const { data: tiers } = useGetTiers();
  const checkLowFuel = useCheckLowFuelNotification();

  const [activeTab, setActiveTab] = useState<TabKey>("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [lowFuelBannerDismissed, setLowFuelBannerDismissed] = useState(false);

  // Track whether we've already fired the low-fuel backend check this session
  const lowFuelCheckFiredRef = useRef(false);

  const allListings = listings ?? [];
  const allFavorited = favoritedListings ?? [];

  // Subscription info
  const now = Date.now();
  const expirationMs = subscription?.expirationDate
    ? nsToMs(subscription.expirationDate)
    : null;
  const isSubscriptionExpired = expirationMs !== null && expirationMs < now;
  const currentTier = tiers?.find(
    (t) => Number(t.tierId) === Number(subscription?.tier ?? 1),
  );
  const tierName = currentTier?.name ?? "Time Walker";

  // Compute fuel level using the same formula as GasFuelTank
  const tierNum = subscription?.tier
    ? (Math.min(3, Math.max(1, Number(subscription.tier))) as 1 | 2 | 3)
    : null;

  const fuelData = useMemo(() => {
    if (!expirationMs || !tierNum) return null;
    return computeFuelFromExpiry(expirationMs, tierNum);
  }, [expirationMs, tierNum]);

  const fuelPercent = fuelData?.fuelPercent ?? 0;
  const isLowFuel =
    !isSubscriptionExpired &&
    fuelPercent < LOW_FUEL_THRESHOLD &&
    fuelPercent > 0;

  // Fire low-fuel backend notification check once per session when < 20%
  useEffect(() => {
    if (
      isLowFuel &&
      !lowFuelCheckFiredRef.current &&
      expirationMs &&
      subscription
    ) {
      lowFuelCheckFiredRef.current = true;
      // Convert expirationMs (ms) back to nanoseconds for the backend
      const expiryNs = BigInt(Math.round(expirationMs * 1_000_000));
      checkLowFuel.mutate({
        fuelPercent,
        subscriptionExpirationTimestamp: expiryNs,
      });
    }
  }, [isLowFuel, expirationMs, subscription, fuelPercent, checkLowFuel]);

  // Sort active listings: pinned first (by pinnedAt asc to preserve pin order), then by createdAt desc
  const sortedActive = useMemo(() => {
    return allListings
      .filter((l) => l.status === ListingStatus.active)
      .sort((a, b) => {
        const aPin = a.pinned ? 1 : 0;
        const bPin = b.pinned ? 1 : 0;
        if (bPin !== aPin) return bPin - aPin;
        // Among pinned, sort by pinnedAt ascending (earlier pin = higher rank)
        if (a.pinned && b.pinned && a.pinnedAt && b.pinnedAt) {
          return Number(a.pinnedAt) - Number(b.pinnedAt);
        }
        return Number(b.createdAt) - Number(a.createdAt);
      });
  }, [allListings]);

  const sortedArchived = useMemo(() => {
    return allListings
      .filter((l) => l.status === ListingStatus.archived)
      .sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
  }, [allListings]);

  // Favorites tab: use the dedicated backend query, filtered by search
  // Also sort: pinned favorites first
  const sortedFavorites = useMemo(() => {
    return [...allFavorited].sort((a, b) => {
      const aPin = a.pinned ? 1 : 0;
      const bPin = b.pinned ? 1 : 0;
      if (bPin !== aPin) return bPin - aPin;
      return Number(b.createdAt) - Number(a.createdAt);
    });
  }, [allFavorited]);

  // Search filter — applied to the active tab
  function filterBySearch(items: Listing[]): Listing[] {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        (l.description ?? "").toLowerCase().includes(q),
    );
  }

  const visibleListings = filterBySearch(
    activeTab === "active"
      ? sortedActive
      : activeTab === "archived"
        ? sortedArchived
        : sortedFavorites,
  );

  const isLoading =
    listingsLoading || (activeTab === "favorites" && favoritesLoading);

  // Days until deletion for expired archive clock
  const daysUntilDeletion =
    isSubscriptionExpired && expirationMs !== null
      ? Math.max(
          0,
          Math.floor(
            (expirationMs + 30 * 24 * 60 * 60 * 1000 - now) /
              (1000 * 60 * 60 * 24),
          ),
        )
      : null;

  const showRefuelBanner =
    !bannerDismissed &&
    isSubscriptionExpired &&
    sortedArchived.length > 0 &&
    daysUntilDeletion !== null;

  const showLowFuelBanner =
    !lowFuelBannerDismissed && isLowFuel && !isSubscriptionExpired;

  return (
    <Layout>
      {/* Maintenance mode banner — self-hides if not active or non-admin */}
      <MaintenanceBanner />

      <div
        className="max-w-screen-xl mx-auto px-3 sm:px-6 py-6"
        data-ocid="dashboard-page"
      >
        {/* Page header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display text-xl font-bold text-foreground text-glow-blue">
            Archive
          </h1>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigate({ to: "/upgrade" })}
              className="h-8 px-2 text-xs gap-1 border border-accent/30 text-accent hover:bg-accent/10 glow-yellow-sm font-display font-bold tracking-wide"
              data-ocid="upgrade-tier-btn"
            >
              <Zap className="h-3 w-3" />
              <span className="hidden sm:inline">Upgrade</span>
            </Button>
            <Button
              size="sm"
              onClick={() => navigate({ to: "/import" })}
              className="h-8 gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90 glow-yellow-sm font-display font-bold tracking-wide text-xs"
              data-ocid="new-listing-btn"
            >
              + New Listing
            </Button>
          </div>
        </div>

        {/* Payment banners — success (24h) and failure (persistent) */}
        <PaymentBanners />

        {/* Expired banner (red) — shown when subscription is expired */}
        {showRefuelBanner && (
          <RefuelBanner
            daysUntilDeletion={daysUntilDeletion}
            onRefuel={() => navigate({ to: "/wallet" })}
            onDismiss={() => setBannerDismissed(true)}
          />
        )}

        {/* Low fuel warning banner (amber) — shown only when fuel < 20% */}
        {showLowFuelBanner && (
          <LowFuelWarningBanner
            onDismiss={() => setLowFuelBannerDismissed(true)}
          />
        )}

        {/* Subscription countdown */}
        {subscription?.expirationDate && (
          <>
            {/* Mobile: compact banner */}
            <div className="sm:hidden mb-3">
              <CompactCountdown
                expirationDate={subscription.expirationDate}
                tierName={tierName}
              />
            </div>
            {/* Desktop: full BTTF display */}
            <div
              className="hidden sm:block mb-4"
              data-ocid="active-listings-countdown"
            >
              <TimeCircuitsCountdown
                expirationDate={subscription.expirationDate}
                label="SUBSCRIPTION TIME REMAINING"
              />
            </div>
          </>
        )}

        {/* Search bar */}
        <div className="relative mb-3" data-ocid="search-container">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your listings..."
            className="pl-8 h-9 bg-background border-border/60 focus:border-primary focus:ring-primary/30 font-mono text-xs placeholder:text-muted-foreground/60 transition-smooth"
            data-ocid="search-input"
          />
        </div>

        {/* Tab bar */}
        <TabBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeCnt={sortedActive.length}
          archivedCnt={sortedArchived.length}
          favoritesCnt={allFavorited.length}
        />

        {/* Expired archive clock — shown in archived tab when subscription expired */}
        {activeTab === "archived" &&
          isSubscriptionExpired &&
          expirationMs !== null && (
            <div className="mb-4" data-ocid="archive-countdown">
              <TimeCircuitsCountdown
                expirationDate={expirationMs + 30 * 24 * 60 * 60 * 1000}
                label="⚠ ARCHIVE WINDOW — TIME UNTIL PERMANENT DELETION"
                forceRed
              />
              <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="font-display text-xs font-bold tracking-widest uppercase text-destructive mb-0.5">
                    🚗 Your DeLorean is out of gas!
                  </p>
                  <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                    Refuel to restore your listings before they're permanently
                    deleted.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => navigate({ to: "/wallet" })}
                  className="shrink-0 bg-accent text-accent-foreground hover:bg-accent/90 glow-yellow-sm font-display font-bold tracking-wide text-xs"
                  data-ocid="refuel-from-archive-btn"
                >
                  ⛽ Refuel Now
                </Button>
              </div>
            </div>
          )}

        {/* Content */}
        {isLoading ? (
          <SkeletonGrid />
        ) : visibleListings.length === 0 ? (
          <EmptyState
            tab={activeTab}
            onImport={() => navigate({ to: "/import" })}
          />
        ) : (
          <ListingsGrid listings={visibleListings} />
        )}
      </div>
    </Layout>
  );
}

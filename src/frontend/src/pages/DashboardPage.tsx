import { Layout } from "@/components/Layout";
import { ListingCard } from "@/components/ListingCard";
import { MaintenanceBanner } from "@/components/MaintenanceBanner";
import { MasterListingForm } from "@/components/MasterListingForm";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { PaymentBanners } from "@/components/PaymentBanners";
import { PlatformDraftModal } from "@/components/PlatformDraftModal";
import { LowFuelWarningBanner, RefuelBanner } from "@/components/RefuelBanner";
import { TimeCircuitsCountdown } from "@/components/TimeCircuitsCountdown";
import { UniversalListingForm } from "@/components/UniversalListingForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserMasterListings } from "@/hooks/useGetUserMasterListings";
import { useFavoritedListings, useListings } from "@/hooks/useListings";
import { useCheckLowFuelNotification } from "@/hooks/useNotifications";
import { useGetMySubscription, useGetTiers } from "@/hooks/useTiers";
import { useNavigate } from "@tanstack/react-router";
import { Calendar, Heart, Plus, Search, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Listing } from "../backend";
import { ListingStatus } from "../backend";
import type { MasterListing } from "../backend";
import { computeFuelFromExpiry } from "../components/GasFuelTank";
import type { Platform, PlatformDraftSummary } from "../types/masterListing";
import { ALL_PLATFORMS, PLATFORM_CONFIG } from "../types/masterListing";
import { NewListingModal } from "./NewListingModal";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabKey = "active" | "archived" | "favorites";
type SortOption = "newest" | "oldest";
type DateFilter = "all" | "today" | "week" | "month";
type PlatformFilter = "all" | Platform;

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

const DATE_FILTER_META: Record<DateFilter, { label: string; icon: string }> = {
  all: { label: "All Time", icon: "📅" },
  today: { label: "Today", icon: "📍" },
  week: { label: "This Week", icon: "📆" },
  month: { label: "This Month", icon: "📊" },
};

function filterByDateRange(listings: Listing[], filter: DateFilter): Listing[] {
  if (filter === "all") return listings;
  const now = Date.now();
  const DAY_MS = 24 * 60 * 60 * 1000;
  return listings.filter((l) => {
    const ageMs = now - nsToMs(l.createdAt);
    switch (filter) {
      case "today":
        return ageMs <= DAY_MS;
      case "week":
        return ageMs <= 7 * DAY_MS;
      case "month":
        return ageMs <= 30 * DAY_MS;
      default:
        return true;
    }
  });
}

/** Convert backend DraftStatus variant to our frontend union */
function toDraftStatus(raw: string): PlatformDraftSummary["status"] {
  switch (raw) {
    case "saved":
      return "saved";
    case "preparing":
      return "preparing";
    case "ready":
      return "ready";
    case "posted":
      return "posted";
    default:
      return "unsaved";
  }
}

/** Map a backend PlatformListingDraft to PlatformDraftSummary */
function toDraftSummary(
  d: MasterListing["platformDrafts"][number],
): PlatformDraftSummary | null {
  // platform comes as Platform__2 enum value string
  const platformRaw =
    typeof d.platform === "string"
      ? d.platform
      : typeof d.platform === "object"
        ? (Object.keys(d.platform as Record<string, unknown>)[0] ?? "")
        : "";

  if (!ALL_PLATFORMS.includes(platformRaw as Platform)) return null;

  const statusRaw =
    typeof d.status === "string"
      ? d.status
      : typeof d.status === "object"
        ? (Object.keys(d.status as Record<string, unknown>)[0] ?? "")
        : "";

  return {
    draftId: d.draftId,
    platform: platformRaw as Platform,
    status: toDraftStatus(statusRaw),
    completenessPercent: Number(d.completenessPercent),
    isValid: d.isValid,
    lastEditedAt: d.lastEditedAt,
  };
}

// ─── Compact Countdown Banner (mobile) ────────────────────────────────────────

interface CompactCountdownProps {
  expirationDate: bigint | number;
  tierName: string;
}

function CompactCountdown({ expirationDate, tierName }: CompactCountdownProps) {
  const expMs = nsToMs(expirationDate);
  const [msRemaining, setMsRemaining] = useState(() => expMs - Date.now());

  useState(() => {
    const tick = () => setMsRemaining(expMs - Date.now());
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  });

  const timeStr = formatCompactTime(msRemaining);
  const isExpired = msRemaining <= 0;
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
  onNewListing: () => void;
}

function EmptyState({ tab, onNewListing }: EmptyStateProps) {
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
          onClick={onNewListing}
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

// ─── Master Listings Grid ─────────────────────────────────────────────────────

interface MasterListingsGridProps {
  masterListings: MasterListing[];
  onEditDraft: (
    listingId: string,
    platform: Platform,
    masterListing: {
      title: string;
      description: string;
      price?: string | null;
      category?: string | null;
      tags?: string[];
    },
    existingDraft?: {
      platformFields: Record<string, unknown>;
      status: string;
      completenessPercent: number;
      isValid: boolean;
    } | null,
  ) => void;
}

function MasterListingsGrid({
  masterListings,
  onEditDraft,
}: MasterListingsGridProps) {
  if (masterListings.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <h2 className="font-display text-xs font-bold text-foreground/80 uppercase tracking-widest">
          Master Listings
        </h2>
        <span className="px-1.5 py-0.5 bg-primary/20 text-primary text-[10px] font-mono rounded">
          {masterListings.length}
        </span>
      </div>
      <div
        className="grid grid-cols-3 gap-1.5"
        data-ocid="master-listings-grid"
      >
        {masterListings.map((ml, index) => {
          const drafts = ml.platformDrafts
            .map(toDraftSummary)
            .filter((d): d is PlatformDraftSummary => d !== null);

          // Build a synthetic Listing-compatible shape for display
          const syntheticListing: Listing = {
            id: BigInt(0), // unused — we override click via onEditDraft
            status: ListingStatus.active,
            tierLevel: BigInt(1),
            title: ml.title,
            favorited: ml.pinned,
            userId: ml.userId,
            createdAt: ml.createdAt,
            description: ml.description,
            platform: undefined,
            pinned: ml.pinned,
            expirationDate: ml.expirationDate ?? BigInt(0),
            archivedManually: false,
          };

          return (
            <ListingCard
              key={ml.id}
              listing={syntheticListing}
              index={index}
              platformDrafts={drafts}
              onEditDraft={(platform) => {
                const matchingDraft = ml.platformDrafts.find((d) => {
                  const pRaw =
                    typeof d.platform === "string"
                      ? d.platform
                      : typeof d.platform === "object"
                        ? (Object.keys(
                            d.platform as Record<string, unknown>,
                          )[0] ?? "")
                        : "";
                  return pRaw === platform;
                });
                const existingDraft = matchingDraft
                  ? {
                      platformFields: matchingDraft.platformFields as Record<
                        string,
                        unknown
                      >,
                      status:
                        typeof matchingDraft.status === "string"
                          ? matchingDraft.status
                          : (Object.keys(
                              matchingDraft.status as Record<string, unknown>,
                            )[0] ?? ""),
                      completenessPercent: Number(
                        matchingDraft.completenessPercent,
                      ),
                      isValid: matchingDraft.isValid,
                    }
                  : null;
                onEditDraft(
                  ml.id,
                  platform,
                  {
                    title: ml.title,
                    description: ml.description,
                    price: ml.price?.[0] ?? null,
                    category: ml.category?.[0] ?? null,
                    tags: ml.tags ?? [],
                  },
                  existingDraft,
                );
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── Platform Filter Bar (for master listings) ────────────────────────────────

interface PlatformFilterBarProps {
  active: PlatformFilter;
  onChange: (p: PlatformFilter) => void;
}

function PlatformFilterBar({ active, onChange }: PlatformFilterBarProps) {
  return (
    <div
      className="overflow-x-auto whitespace-nowrap scrollbar-none pb-1"
      data-ocid="master-platform-filter-bar"
    >
      <div className="inline-flex gap-1.5">
        <button
          type="button"
          onClick={() => onChange("all")}
          className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-smooth shrink-0 ${
            active === "all"
              ? "bg-primary/20 text-primary border border-primary/50"
              : "bg-muted/40 text-muted-foreground border border-border/40 hover:text-foreground hover:bg-muted/60"
          }`}
          data-ocid="master-platform-filter.all.tab"
        >
          All Listings
        </button>
        {ALL_PLATFORMS.map((p) => {
          const cfg = PLATFORM_CONFIG[p];
          const isActive = active === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-smooth shrink-0 ${
                isActive
                  ? "bg-primary/20 text-primary border border-primary/50"
                  : "bg-muted/40 text-muted-foreground border border-border/40 hover:text-foreground hover:bg-muted/60"
              }`}
              data-ocid={`master-platform-filter.${p}.tab`}
            >
              {cfg.icon} {cfg.name}
            </button>
          );
        })}
      </div>
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

const LOW_FUEL_THRESHOLD = 20;

const ONBOARDING_KEY = "copie_onboarding_complete";

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: listings, isLoading: listingsLoading } = useListings();
  const { data: favoritedListings, isLoading: favoritesLoading } =
    useFavoritedListings();
  const { data: masterListingsRaw, isLoading: masterListingsLoading } =
    useGetUserMasterListings();
  const { data: subscription } = useGetMySubscription();
  const { data: tiers } = useGetTiers();
  const checkLowFuel = useCheckLowFuelNotification();

  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(
    () => localStorage.getItem(ONBOARDING_KEY) !== "true",
  );

  function handleOnboardingComplete() {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setShowOnboarding(false);
  }

  const [activeTab, setActiveTab] = useState<TabKey>("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [lowFuelBannerDismissed, setLowFuelBannerDismissed] = useState(false);
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("all");
  const [masterPlatformFilter, setMasterPlatformFilter] =
    useState<PlatformFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [newListingModalOpen, setNewListingModalOpen] = useState(false);
  const [showMasterForm, setShowMasterForm] = useState(false);
  const [universalListingModalOpen, setUniversalListingModalOpen] =
    useState(false);
  const [draftModal, setDraftModal] = useState<{
    listingId: string;
    platform: Platform;
    masterListing?: {
      title: string;
      description: string;
      price?: string | null;
      category?: string | null;
      tags?: string[];
    };
    existingDraft?: {
      platformFields: Record<string, unknown>;
      status: string;
      completenessPercent: number;
      isValid: boolean;
    } | null;
  } | null>(null);

  const lowFuelCheckFiredRef = useRef(false);

  const allListings = listings ?? [];
  const allFavorited = favoritedListings ?? [];
  const masterListings: MasterListing[] = masterListingsRaw ?? [];

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

  useEffect(() => {
    if (
      isLowFuel &&
      !lowFuelCheckFiredRef.current &&
      expirationMs &&
      subscription
    ) {
      lowFuelCheckFiredRef.current = true;
      const expiryNs = BigInt(Math.round(expirationMs * 1_000_000));
      checkLowFuel.mutate({
        fuelPercent,
        subscriptionExpirationTimestamp: expiryNs,
      });
    }
  }, [isLowFuel, expirationMs, subscription, fuelPercent, checkLowFuel]);

  // Sort active: apply date filter, platform filter, then createdAt sort
  const sortedActive = useMemo(() => {
    let items = allListings.filter((l) => l.status === ListingStatus.active);
    items = filterByDateRange(items, dateFilter);
    if (platformFilter !== "all") {
      items = items.filter((l) => {
        const p = l.platform;
        if (!p) return false;
        const pStr =
          typeof p === "string"
            ? p.replace(/^#/, "")
            : typeof p === "object"
              ? Object.keys(p as Record<string, unknown>)[0]
              : "";
        return pStr === platformFilter;
      });
    }
    return items.sort((a, b) => {
      const aTime = Number(a.createdAt);
      const bTime = Number(b.createdAt);
      return sortOption === "newest" ? bTime - aTime : aTime - bTime;
    });
  }, [allListings, dateFilter, platformFilter, sortOption]);

  const sortedArchived = useMemo(() => {
    return allListings
      .filter((l) => l.status === ListingStatus.archived)
      .sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
  }, [allListings]);

  const sortedFavorites = useMemo(() => {
    return [...allFavorited].sort((a, b) => {
      const aPin = a.pinned ? 1 : 0;
      const bPin = b.pinned ? 1 : 0;
      if (bPin !== aPin) return bPin - aPin;
      return Number(b.createdAt) - Number(a.createdAt);
    });
  }, [allFavorited]);

  // Filtered master listings by platform
  const filteredMasterListings = useMemo(() => {
    if (masterPlatformFilter === "all") return masterListings;
    return masterListings.filter((ml) =>
      ml.platformDrafts.some((d) => {
        const pRaw =
          typeof d.platform === "string"
            ? d.platform
            : typeof d.platform === "object"
              ? (Object.keys(d.platform as Record<string, unknown>)[0] ?? "")
              : "";
        return pRaw === masterPlatformFilter && d.status !== "unsaved";
      }),
    );
  }, [masterListings, masterPlatformFilter]);

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
      {/* Onboarding Wizard — non-dismissible until all steps complete */}
      {showOnboarding && (
        <OnboardingWizard
          onComplete={handleOnboardingComplete}
          onOpenNewListing={() => setShowMasterForm(true)}
        />
      )}

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
              onClick={() => setShowMasterForm(true)}
              className="h-8 gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90 glow-yellow-sm font-display font-bold tracking-wide text-xs"
              data-ocid="new-listing-btn"
            >
              + New Listing
            </Button>
          </div>
        </div>

        <PaymentBanners />

        {showRefuelBanner && (
          <RefuelBanner
            daysUntilDeletion={daysUntilDeletion}
            onRefuel={() => navigate({ to: "/wallet" })}
            onDismiss={() => setBannerDismissed(true)}
          />
        )}

        {showLowFuelBanner && (
          <LowFuelWarningBanner
            onDismiss={() => setLowFuelBannerDismissed(true)}
          />
        )}

        {subscription?.expirationDate && (
          <>
            <div className="sm:hidden mb-3">
              <CompactCountdown
                expirationDate={subscription.expirationDate}
                tierName={tierName}
              />
            </div>
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
          onTabChange={(tab) => {
            setActiveTab(tab);
            setPlatformFilter("all");
            setSortOption("newest");
            setDateFilter("all");
          }}
          activeCnt={sortedActive.length}
          archivedCnt={sortedArchived.length}
          favoritesCnt={allFavorited.length}
        />

        {/* Expired archive clock */}
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

        {/* Active tab controls: platform filter + sort + date filter */}
        {activeTab === "active" && (
          <div className="space-y-2 mb-4">
            {/* Platform filter */}
            <div
              className="flex gap-2 flex-wrap"
              data-ocid="platform-filter-bar"
            >
              <button
                type="button"
                onClick={() => setPlatformFilter("all")}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-smooth ${
                  platformFilter === "all"
                    ? "bg-primary/20 text-primary border border-primary/50"
                    : "bg-muted/40 text-muted-foreground border border-border/40 hover:text-foreground hover:bg-muted/60"
                }`}
                data-ocid="platform-filter.all.tab"
              >
                All
              </button>
              {ALL_PLATFORMS.map((p) => {
                const cfg = PLATFORM_CONFIG[p];
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlatformFilter(p)}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-smooth ${
                      platformFilter === p
                        ? "bg-primary/20 text-primary border border-primary/50"
                        : "bg-muted/40 text-muted-foreground border border-border/40 hover:text-foreground hover:bg-muted/60"
                    }`}
                    data-ocid={`platform-filter.${p}.tab`}
                  >
                    {cfg.icon} {cfg.name}
                  </button>
                );
              })}
            </div>

            {/* Sort + Date filter row */}
            <div className="flex gap-3 flex-wrap items-center">
              {/* Sort select */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                  Sort:
                </span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="px-2 py-1.5 rounded-md text-xs font-mono bg-secondary/50 border border-border/40 text-foreground focus:outline-none focus:border-primary/60 transition-smooth"
                  data-ocid="sort-select"
                  aria-label="Sort order"
                >
                  <option value="newest">📥 Newest First</option>
                  <option value="oldest">📤 Oldest First</option>
                </select>
              </div>

              {/* Date filter */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
                {(["all", "today", "week", "month"] as const).map((f) => {
                  const { label, icon } = DATE_FILTER_META[f];
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setDateFilter(f)}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-mono font-semibold transition-smooth ${
                        dateFilter === f
                          ? "bg-accent/20 text-accent border border-accent/50"
                          : "bg-muted/40 text-muted-foreground border border-border/40 hover:text-foreground hover:bg-muted/60"
                      }`}
                      data-ocid={`date-filter-${f}`}
                    >
                      {icon} {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <SkeletonGrid />
        ) : visibleListings.length === 0 ? (
          <EmptyState
            tab={activeTab}
            onNewListing={() => setNewListingModalOpen(true)}
          />
        ) : (
          <ListingsGrid listings={visibleListings} />
        )}

        {/* ── Master Listings Section ─────────────────────────────────────── */}
        {activeTab === "active" && (
          <div className="mt-8 space-y-3" data-ocid="master-listings-section">
            <div className="h-px bg-border/30" />

            {/* Platform filter tabs for master listings */}
            <PlatformFilterBar
              active={masterPlatformFilter}
              onChange={setMasterPlatformFilter}
            />

            {masterListingsLoading ? (
              <SkeletonGrid />
            ) : (
              <MasterListingsGrid
                masterListings={filteredMasterListings}
                onEditDraft={(
                  listingId,
                  platform,
                  masterListingData,
                  existingDraft,
                ) =>
                  setDraftModal({
                    listingId,
                    platform,
                    masterListing: masterListingData,
                    existingDraft,
                  })
                }
              />
            )}
          </div>
        )}
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      <NewListingModal
        isOpen={newListingModalOpen}
        onClose={() => setNewListingModalOpen(false)}
      />
      <MasterListingForm
        isOpen={showMasterForm}
        onClose={() => setShowMasterForm(false)}
      />
      <UniversalListingForm
        isOpen={universalListingModalOpen}
        onClose={() => setUniversalListingModalOpen(false)}
      />

      {/* Platform Draft Modal */}
      {draftModal && (
        <PlatformDraftModal
          isOpen={!!draftModal}
          onClose={() => setDraftModal(null)}
          listingId={draftModal.listingId}
          platform={draftModal.platform}
          masterListing={draftModal.masterListing}
          existingDraft={draftModal.existingDraft}
        />
      )}
    </Layout>
  );
}

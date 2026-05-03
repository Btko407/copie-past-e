import { ExtensionBanner } from "@/components/ExtensionBanner";
import { Layout } from "@/components/Layout";
import { MaintenanceBanner } from "@/components/MaintenanceBanner";
import { MasterListingCard } from "@/components/MasterListingCard";
import { MasterListingForm } from "@/components/MasterListingForm";
import { PaymentBanners } from "@/components/PaymentBanners";
import { PlatformDraftModal } from "@/components/PlatformDraftModal";
import { LowFuelWarningBanner, RefuelBanner } from "@/components/RefuelBanner";
import { StatusToast } from "@/components/StatusToast";
import { TimeCircuitsCountdown } from "@/components/TimeCircuitsCountdown";
import { UniversalListingForm } from "@/components/UniversalListingForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserMasterListings } from "@/hooks/useGetUserMasterListings";
import { useCheckLowFuelNotification } from "@/hooks/useNotifications";
import { useGetMySubscription, useGetTiers } from "@/hooks/useTiers";
import { useNavigate } from "@tanstack/react-router";
import { Calendar, Plus, Search, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MasterListing } from "../backend";
import { ListingStatus__2 } from "../backend";
import { computeFuelFromExpiry } from "../components/GasFuelTank";
import { ALL_PLATFORMS, PLATFORM_CONFIG } from "../types/masterListing";
import type { Platform } from "../types/masterListing";
import { normalizePlatform } from "../utils/normalizePlatform";
import { NewListingModal } from "./NewListingModal";

// ─── Types ────────────────────────────────────────────────────────────────────

type MasterTab = "all" | Platform | "archived" | "favorites";
type SortOption = "newest" | "oldest";
type DateFilter = "all" | "today" | "week" | "month";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function nsToMs(ns: bigint | number): number {
  if (typeof ns === "bigint") return Number(ns) / 1_000_000;
  return ns > 1e15 ? ns / 1_000_000 : ns;
}

function filterMasterByDateRange(
  listings: MasterListing[],
  filter: DateFilter,
): MasterListing[] {
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
        <div key={key} className="rounded-md overflow-hidden">
          <Skeleton className="aspect-square w-full rounded-none" />
          <div className="px-2 pt-1.5 pb-2 bg-card space-y-1">
            <Skeleton className="h-3 w-3/4 rounded" />
            <Skeleton className="h-2 w-1/2 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

interface EmptyStateProps {
  tab: MasterTab;
  onNewListing: () => void;
}

function EmptyState({ tab, onNewListing }: EmptyStateProps) {
  const isPlatform = ALL_PLATFORMS.includes(tab as Platform);
  const platformName = isPlatform
    ? (PLATFORM_CONFIG[tab as Platform]?.name ?? tab)
    : tab;

  const config: Record<
    string,
    { icon: string; title: string; desc: string; cta: string; showCta: boolean }
  > = {
    all: {
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
      title: "No pinned listings",
      desc: "Pin listings by clicking the star icon to see them here.",
      cta: "",
      showCta: false,
    },
  };

  const activeConfig = config[tab] ?? {
    icon: PLATFORM_CONFIG[tab as Platform]?.icon ?? "📋",
    title: `No ${platformName} drafts yet`,
    desc: `Create a listing and add a ${platformName} draft to see it here.`,
    cta: "Create your first listing",
    showCta: true,
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
      data-ocid={`empty-state-${tab}`}
    >
      <span className="text-5xl mb-4">{activeConfig.icon}</span>
      <h3 className="font-display text-base font-bold text-foreground text-glow-blue mb-2">
        {activeConfig.title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-6">
        {activeConfig.desc}
      </p>
      {activeConfig.showCta && (
        <Button
          onClick={onNewListing}
          className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 glow-yellow font-display font-bold tracking-wide"
          data-ocid="create-first-listing-btn"
        >
          <Plus className="h-4 w-4" />
          {activeConfig.cta}
        </Button>
      )}
    </motion.div>
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
    <div className="grid grid-cols-3 gap-1.5" data-ocid="master-listings-grid">
      {masterListings.map((ml, index) => (
        <MasterListingCard
          key={ml.id}
          listing={ml}
          index={index}
          onEditDraft={(platform) => {
            const matchingDraft = ml.platformDrafts.find(
              (d) => normalizePlatform(d.platform) === platform,
            );
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
                price: ml.price ?? null,
                category: ml.category ?? null,
                tags: ml.tags ?? [],
              },
              existingDraft,
            );
          }}
        />
      ))}
    </div>
  );
}

// ─── Master Tab Bar ───────────────────────────────────────────────────────────

const MASTER_TABS: Array<{ key: MasterTab; label: string; icon: string }> = [
  { key: "all", label: "All", icon: "📋" },
  { key: "facebook", label: "Facebook", icon: PLATFORM_CONFIG.facebook.icon },
  { key: "mercari", label: "Mercari", icon: PLATFORM_CONFIG.mercari.icon },
  { key: "ebay", label: "eBay", icon: PLATFORM_CONFIG.ebay.icon },
  { key: "poshmark", label: "Poshmark", icon: PLATFORM_CONFIG.poshmark.icon },
  { key: "depop", label: "Depop", icon: PLATFORM_CONFIG.depop.icon },
  { key: "etsy", label: "Etsy", icon: PLATFORM_CONFIG.etsy.icon },
  { key: "archived", label: "Archived", icon: "🗃" },
  { key: "favorites", label: "Favorites", icon: "⭐" },
];

interface MasterTabBarProps {
  active: MasterTab;
  counts: Record<string, number>;
  onChange: (tab: MasterTab) => void;
}

function MasterTabBar({ active, counts, onChange }: MasterTabBarProps) {
  return (
    <div
      className="overflow-x-auto whitespace-nowrap scrollbar-none pb-1"
      data-ocid="master-tab-bar"
    >
      <div className="inline-flex gap-1">
        {MASTER_TABS.map(({ key, label, icon }) => {
          const isActive = active === key;
          const count = counts[key] ?? 0;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-mono font-semibold transition-smooth shrink-0 ${
                isActive
                  ? "bg-primary/20 text-primary border border-primary/50"
                  : "bg-muted/40 text-muted-foreground border border-border/40 hover:text-foreground hover:bg-muted/60"
              }`}
              data-ocid={`master-tab.${key}.tab`}
            >
              {icon} {label}
              {count > 0 && (
                <span
                  className={`px-1 py-0.5 rounded text-[9px] font-mono leading-none ${
                    isActive
                      ? "bg-primary/30 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

const LOW_FUEL_THRESHOLD = 20;

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: masterListingsRaw, isLoading: masterListingsLoading } =
    useGetUserMasterListings();
  const { data: subscription } = useGetMySubscription();
  const { data: tiers } = useGetTiers();
  const checkLowFuel = useCheckLowFuelNotification();

  const [activeTab, setActiveTab] = useState<MasterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [lowFuelBannerDismissed, setLowFuelBannerDismissed] = useState(false);
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

  const masterListings: MasterListing[] = masterListingsRaw ?? [];

  // Stub handlers for NewListingModal backward-compat (legacy path, no-op)
  function handleOptimisticAdd(_listing: import("../backend").Listing) {}
  function handleOptimisticRollback(_tempId: bigint) {}

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

  // ── Master listing filter/sort ────────────────────────────────────────────
  const filteredMasterListings = useMemo(() => {
    let items = masterListings;

    // Tab filter
    if (activeTab === "archived") {
      items = items.filter((ml) => ml.status === ListingStatus__2.archived);
    } else if (activeTab === "favorites") {
      items = items.filter((ml) => ml.pinned);
    } else if (activeTab !== "all") {
      // Platform tab: show listings that have a draft for that platform
      const platformTab = activeTab as Platform;
      items = items.filter((ml) =>
        ml.platformDrafts.some(
          (d) => normalizePlatform(d.platform) === platformTab,
        ),
      );
    } else {
      // "all" shows non-archived
      items = items.filter((ml) => ml.status !== ListingStatus__2.archived);
    }

    // Search filter
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      items = items.filter(
        (ml) =>
          ml.title.toLowerCase().includes(q) ||
          ml.description.toLowerCase().includes(q) ||
          (ml.category ?? "").toLowerCase().includes(q),
      );
    }

    // Date range filter
    items = filterMasterByDateRange(items, dateFilter);

    // Sort
    return [...items].sort((a, b) => {
      const aTime = Number(a.createdAt);
      const bTime = Number(b.createdAt);
      return sortOption === "newest" ? bTime - aTime : aTime - bTime;
    });
  }, [masterListings, activeTab, searchQuery, dateFilter, sortOption]);

  // Tab counts
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: masterListings.filter(
        (ml) => ml.status !== ListingStatus__2.archived,
      ).length,
      archived: masterListings.filter(
        (ml) => ml.status === ListingStatus__2.archived,
      ).length,
      favorites: masterListings.filter((ml) => ml.pinned).length,
    };
    for (const p of ALL_PLATFORMS) {
      counts[p] = masterListings.filter(
        (ml) =>
          ml.status !== ListingStatus__2.archived &&
          ml.platformDrafts.some((d) => normalizePlatform(d.platform) === p),
      ).length;
    }
    return counts;
  }, [masterListings]);

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
    tabCounts.archived > 0 &&
    daysUntilDeletion !== null;

  const showLowFuelBanner =
    !lowFuelBannerDismissed && isLowFuel && !isSubscriptionExpired;

  return (
    <Layout>
      {/* Extension nudge banner — desktop only, non-blocking, session-dismissible */}
      <div className="max-w-screen-xl mx-auto px-3 sm:px-6 pt-3">
        <ExtensionBanner />
      </div>

      {/* Session extension status toast — once per session, desktop only */}
      <StatusToast />

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
            placeholder="Search master listings..."
            className="pl-8 h-9 bg-background border-border/60 focus:border-primary focus:ring-primary/30 font-mono text-xs placeholder:text-muted-foreground/60 transition-smooth"
            data-ocid="search-input"
          />
        </div>

        {/* Master tab bar — All, 6 platforms, Archived, Favorites */}
        <div className="mb-3">
          <MasterTabBar
            active={activeTab}
            counts={tabCounts}
            onChange={(tab) => {
              setActiveTab(tab);
              setSortOption("newest");
              setDateFilter("all");
            }}
          />
        </div>

        {/* Expired archive clock (shown when on Archived tab) */}
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

        {/* Sort + Date filter row (shown on all/platform tabs) */}
        {activeTab !== "archived" && activeTab !== "favorites" && (
          <div className="flex gap-3 flex-wrap items-center mb-3">
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
            <div className="flex items-center gap-1.5 flex-wrap">
              <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
              {(["all", "today", "week", "month"] as const).map((f) => {
                const meta = DATE_FILTER_META[f];
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
                    {meta.icon} {meta.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Master Listings Grid (primary) ─────────────────────────────── */}
        <div data-ocid="master-listings-section">
          {masterListingsLoading ? (
            <SkeletonGrid />
          ) : filteredMasterListings.length === 0 ? (
            <EmptyState
              tab={activeTab}
              onNewListing={() => setShowMasterForm(true)}
            />
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
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      <NewListingModal
        isOpen={newListingModalOpen}
        onClose={() => setNewListingModalOpen(false)}
        onOptimisticAdd={handleOptimisticAdd}
        onOptimisticRollback={handleOptimisticRollback}
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

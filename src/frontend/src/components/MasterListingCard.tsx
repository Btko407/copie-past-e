import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Pencil, Plus, Star } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { MasterListing } from "../backend";
import { ListingStatus__2 } from "../backend";
import {
  ALL_PLATFORMS,
  PLATFORM_CONFIG,
  type Platform,
  type PlatformDraftSummary,
} from "../types/masterListing";
import { normalizePlatform } from "../utils/normalizePlatform";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function nsToMs(ts: bigint | number): number {
  if (typeof ts === "bigint") return Number(ts) / 1_000_000;
  return ts > 1e15 ? ts / 1_000_000 : ts;
}

function getDraftSummaries(ml: MasterListing): PlatformDraftSummary[] {
  return ml.platformDrafts
    .map((d) => {
      const platform = normalizePlatform(d.platform);
      if (!platform) return null;

      const statusRaw =
        typeof d.status === "string"
          ? d.status
          : typeof d.status === "object" && d.status !== null
            ? (Object.keys(d.status as Record<string, unknown>)[0] ?? "")
            : "";

      const status = (
        ["saved", "preparing", "ready", "posted"].includes(statusRaw)
          ? statusRaw
          : "unsaved"
      ) as PlatformDraftSummary["status"];

      return {
        draftId: d.draftId,
        platform,
        status,
        completenessPercent: Number(d.completenessPercent),
        isValid: d.isValid,
        lastEditedAt: d.lastEditedAt,
      } satisfies PlatformDraftSummary;
    })
    .filter((d): d is PlatformDraftSummary => d !== null);
}

function draftBadgeClass(status: PlatformDraftSummary["status"]): string {
  switch (status) {
    case "posted":
      return "bg-green-900/40 border-green-500/50 text-green-300";
    case "saved":
    case "ready":
      return "bg-blue-900/40 border-blue-500/50 text-blue-200";
    case "preparing":
      return "bg-amber-900/40 border-amber-500/50 text-amber-300";
    default:
      return "bg-muted/40 border-border/40 text-muted-foreground";
  }
}

function getStatusBadge(status: MasterListing["status"]) {
  switch (status) {
    case ListingStatus__2.archived:
      return { label: "Archived", cls: "bg-muted/60 text-muted-foreground" };
    case ListingStatus__2.draft:
      return { label: "Draft", cls: "bg-amber-900/40 text-amber-300" };
    default:
      return { label: "Active", cls: "bg-green-900/40 text-green-300" };
  }
}

// ─── Draft Actions Menu ───────────────────────────────────────────────────────

interface DraftMenuProps {
  draftMap: Map<Platform, PlatformDraftSummary>;
  onEditDraft: (platform: Platform) => void;
  onClose: () => void;
}

function DraftMenu({ draftMap, onEditDraft, onClose }: DraftMenuProps) {
  return (
    <div className="absolute bottom-full right-0 mb-1 z-50 min-w-[170px] bg-card border border-border/60 rounded-lg shadow-xl overflow-hidden">
      <div className="px-2.5 py-1.5 border-b border-border/30">
        <p className="text-[10px] font-display font-bold text-muted-foreground uppercase tracking-widest">
          Platform Drafts
        </p>
      </div>
      <div className="py-1 max-h-52 overflow-y-auto">
        {ALL_PLATFORMS.map((platform) => {
          const cfg = PLATFORM_CONFIG[platform];
          const existing = draftMap.get(platform);
          return (
            <button
              key={platform}
              type="button"
              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-left text-xs text-foreground hover:bg-primary/10 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onEditDraft(platform);
                onClose();
              }}
              data-ocid={`master-card.draft_actions.${platform}.${existing ? "edit_button" : "button"}`}
            >
              {existing ? (
                <Pencil className="h-3 w-3 text-primary shrink-0" />
              ) : (
                <Plus className="h-3 w-3 text-muted-foreground shrink-0" />
              )}
              <span className="font-mono">
                {cfg.icon} {existing ? "Edit" : "Add"} {cfg.name}
              </span>
              {existing?.status === "posted" && (
                <span className="ml-auto text-green-400 text-[9px] font-bold">
                  ✓
                </span>
              )}
              {existing &&
                existing.status !== "unsaved" &&
                existing.status !== "posted" && (
                  <span className="ml-auto font-mono text-[9px] text-muted-foreground">
                    {existing.completenessPercent}%
                  </span>
                )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Platform Draft Badges ────────────────────────────────────────────────────

function PlatformBadges({ drafts }: { drafts: PlatformDraftSummary[] }) {
  const active = drafts.filter((d) => d.status !== "unsaved");
  if (active.length === 0) return null;

  const visible = active.slice(0, 5);
  const extra = active.length - 5;

  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((d) => {
        const cfg = PLATFORM_CONFIG[d.platform];
        return (
          <span
            key={d.draftId}
            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-semibold leading-none border ${draftBadgeClass(d.status)}`}
            title={`${cfg.name} — ${d.status} (${d.completenessPercent}%)`}
          >
            {cfg.icon}
            <span className="hidden sm:inline">{cfg.name.slice(0, 3)}</span>
            {d.status === "posted" && <span className="text-green-400">✓</span>}
          </span>
        );
      })}
      {extra > 0 && (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-muted/40 border border-border/40 text-muted-foreground">
          +{extra}
        </span>
      )}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface MasterListingCardProps {
  listing: MasterListing;
  index?: number;
  onEditDraft?: (platform: Platform) => void;
  onSmartPost?: (platform: Platform) => void;
}

export function MasterListingCard({
  listing,
  index = 0,
  onEditDraft,
}: MasterListingCardProps) {
  const [showDraftMenu, setShowDraftMenu] = useState(false);
  const [imageError, setImageError] = useState(false);

  const drafts = getDraftSummaries(listing);
  const draftMap = new Map(drafts.map((d) => [d.platform, d]));

  // Read photos directly from listing.photos (Uint8Array[]) — no hook calls
  const thumbnailUrl = (() => {
    if (imageError || !listing.photos?.length) return null;
    try {
      const bytes = listing.photos[0];
      if (!bytes?.length) return null;
      const blob = new Blob([bytes.buffer as ArrayBuffer], {
        type: "image/jpeg",
      });
      return URL.createObjectURL(blob);
    } catch {
      return null;
    }
  })();

  const updatedAtMs = nsToMs(listing.updatedAt);
  const relativeTime = formatDistanceToNow(new Date(updatedAtMs), {
    addSuffix: true,
  });

  const statusBadge = getStatusBadge(listing.status);
  const isArchived = listing.status === ListingStatus__2.archived;
  const isFavorited = listing.pinned;
  const draftCount = ALL_PLATFORMS.filter((p) => draftMap.has(p)).length;

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: "easeOut" }}
      className={`group relative rounded-md overflow-hidden border border-border/40 bg-card transition-smooth hover:border-primary/40 hover:shadow-[0_0_12px_oklch(0.65_0.22_262_/_0.15)] ${
        isArchived ? "opacity-60" : ""
      }`}
      data-ocid="master-listing-card"
    >
      {/* Thumbnail */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={listing.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-smooth group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center retro-grid opacity-30">
            <span className="text-4xl">📋</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

        {/* Favorite star */}
        {isFavorited && (
          <div className="absolute top-1.5 right-1.5 z-10">
            <Star
              className="h-3.5 w-3.5 fill-accent text-accent"
              style={{ filter: "drop-shadow(0 0 4px oklch(0.88 0.19 84))" }}
            />
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-1.5 left-1.5 z-10">
          <span
            className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
              statusBadge.cls
            }`}
          >
            {statusBadge.label}
          </span>
        </div>

        {/* Draft count pill */}
        {draftCount > 0 && (
          <div className="absolute bottom-1.5 left-1.5 z-10">
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-primary/80 text-primary-foreground">
              {draftCount}/6
            </span>
          </div>
        )}
      </div>

      {/* Info strip */}
      <div className="px-2 pt-1.5 pb-2 bg-card space-y-1">
        <p className="font-display text-[11px] font-semibold text-foreground line-clamp-1 leading-tight group-hover:text-primary transition-colors duration-200">
          {listing.title}
        </p>

        <div className="flex items-center gap-1.5 flex-wrap">
          {listing.price && (
            <span className="font-mono text-[10px] text-accent leading-none">
              ${listing.price}
            </span>
          )}
          {listing.category && (
            <span className="font-mono text-[9px] text-muted-foreground leading-none">
              · {listing.category}
            </span>
          )}
        </div>

        {/* Platform draft badges */}
        {drafts.length > 0 && <PlatformBadges drafts={drafts} />}

        {/* Bottom row: updated time + draft menu */}
        <div className="flex items-center justify-between gap-1 pt-0.5">
          <span className="font-mono text-[9px] text-muted-foreground/70 truncate leading-none">
            {relativeTime}
          </span>

          {onEditDraft && (
            <div className="relative flex-shrink-0">
              <Button
                size="sm"
                variant="ghost"
                className="h-5 px-1.5 text-[10px] font-display font-bold text-primary hover:bg-primary/10 transition-smooth gap-0.5 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDraftMenu((prev) => !prev);
                }}
                aria-label="Manage platform drafts"
                data-ocid="master-card.draft_actions.open_modal_button"
              >
                <Pencil className="h-2.5 w-2.5" />
                Drafts
              </Button>
              {showDraftMenu && (
                <DraftMenu
                  draftMap={draftMap}
                  onEditDraft={onEditDraft}
                  onClose={() => setShowDraftMenu(false)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

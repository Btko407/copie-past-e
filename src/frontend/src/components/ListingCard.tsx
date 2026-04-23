import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useArchiveListing,
  useListingImages,
  usePermanentDeleteListing,
  useRestoreListing,
  useToggleFavorite,
  useTogglePin,
} from "@/hooks/useListings";
import { useGetMySubscription } from "@/hooks/useTiers";
import { useNavigate } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import {
  Archive,
  Check,
  Copy,
  Loader2,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Listing } from "../backend";
import { ListingStatus } from "../backend";
import { useClipboard } from "../hooks/useClipboard";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildFullPost(listing: Listing): string {
  const parts: string[] = [listing.title];
  if (listing.description) parts.push(listing.description);
  if (listing.price) parts.push(`Price: ${listing.price}`);
  if (listing.sourceUrl) parts.push(listing.sourceUrl);
  return parts.join("\n");
}

function nsToMs(ts: bigint | number): number {
  if (typeof ts === "bigint") return Number(ts) / 1_000_000;
  return ts > 1e15 ? ts / 1_000_000 : ts;
}

function daysUntilDeletion(archivedAt: bigint): number {
  const archivedMs = Number(archivedAt) / 1_000_000;
  const deleteAt = archivedMs + 30 * 24 * 60 * 60 * 1000;
  return Math.max(
    0,
    Math.floor((deleteAt - Date.now()) / (1000 * 60 * 60 * 24)),
  );
}

// ─── Archive Confirm Overlay ───────────────────────────────────────────────────

interface ConfirmOverlayProps {
  type: "archive" | "delete";
  title?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

function ConfirmOverlay({
  type,
  title,
  onConfirm,
  onCancel,
  isLoading,
}: ConfirmOverlayProps) {
  const isDelete = type === "delete";
  return (
    <div
      className={`absolute inset-0 z-40 flex flex-col items-center justify-center rounded-lg backdrop-blur-sm p-3 ${
        isDelete
          ? "bg-card/95 border border-destructive/60"
          : "bg-card/95 neon-border-yellow"
      }`}
    >
      {isDelete ? (
        <Trash2 className="h-5 w-5 text-destructive mb-1.5" />
      ) : (
        <Archive className="h-5 w-5 text-accent mb-1.5 text-glow-yellow" />
      )}
      <p
        className={`font-display text-[11px] font-bold tracking-wide text-center mb-1 ${isDelete ? "text-destructive" : "text-foreground"}`}
      >
        {isDelete ? "Delete forever?" : "Archive listing?"}
      </p>
      {isDelete && title && (
        <p className="text-[10px] text-muted-foreground text-center mb-1 leading-tight truncate w-full px-2">
          "{title}"
        </p>
      )}
      <div className="flex gap-1.5 w-full mt-2">
        <Button
          size="sm"
          variant="ghost"
          className="flex-1 h-7 text-[11px] border border-border/60 hover:bg-secondary/50 transition-smooth"
          onClick={onCancel}
          disabled={isLoading}
          data-ocid="confirm-cancel-btn"
        >
          <X className="h-3 w-3 mr-1" /> Cancel
        </Button>
        <Button
          size="sm"
          className={`flex-1 h-7 text-[11px] font-display font-bold transition-smooth ${
            isDelete
              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              : "bg-accent text-accent-foreground hover:bg-accent/90 glow-yellow-sm"
          }`}
          onClick={onConfirm}
          disabled={isLoading}
          data-ocid="confirm-action-btn"
        >
          {isLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : isDelete ? (
            "Delete"
          ) : (
            "Archive"
          )}
        </Button>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ListingCardProps {
  listing: Listing;
  index: number;
}

export function ListingCard({ listing, index }: ListingCardProps) {
  const navigate = useNavigate();
  const { copy, copiedId } = useClipboard();
  const [imageError, setImageError] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Optimistic local state — seeded from backend value, reverted on error
  const [optimisticPinned, setOptimisticPinned] = useState<boolean | null>(
    null,
  );
  const [optimisticFavorited, setOptimisticFavorited] = useState<
    boolean | null
  >(null);

  const { data: images, isLoading: imagesLoading } = useListingImages(
    listing.id,
  );
  const archiveListing = useArchiveListing();
  const restoreListing = useRestoreListing();
  const permanentDeleteListing = usePermanentDeleteListing();
  const togglePin = useTogglePin();
  const toggleFavorite = useToggleFavorite();
  const { data: subscription } = useGetMySubscription();

  const isArchiving = archiveListing.isPending;
  const isRestoring = restoreListing.isPending;
  const isDeleting = permanentDeleteListing.isPending;
  const isArchived = listing.status === ListingStatus.archived;
  const isCopied = copiedId === listing.id.toString();

  // Resolved display state — optimistic wins over backend value
  const isPinned =
    optimisticPinned !== null ? optimisticPinned : listing.pinned;
  const isFavorited =
    optimisticFavorited !== null ? optimisticFavorited : listing.favorited;

  const expirationMs = subscription?.expirationDate
    ? nsToMs(subscription.expirationDate)
    : null;
  const isSubscriptionActive =
    expirationMs !== null && expirationMs > Date.now();

  const deletionDays =
    isArchived && listing.archivedAt
      ? daysUntilDeletion(listing.archivedAt)
      : null;

  const createdAtMs =
    typeof listing.createdAt === "bigint"
      ? Number(listing.createdAt) / 1_000_000
      : Number(listing.createdAt) > 1e15
        ? Number(listing.createdAt) / 1_000_000
        : Number(listing.createdAt);
  const relativeTime = formatDistanceToNow(new Date(createdAtMs), {
    addSuffix: true,
  });

  const thumbnail =
    images && images.length > 0 && !imageError
      ? images[0].blob.getDirectURL()
      : null;

  function handleArchive() {
    archiveListing.mutate(listing.id, {
      onSuccess: () => {
        setShowArchiveConfirm(false);
        toast.success("Listing archived.");
      },
      onError: () => {
        toast.error("Failed to archive listing.");
      },
    });
  }

  function handleRestore() {
    if (!isSubscriptionActive) return;
    restoreListing.mutate(listing.id, {
      onSuccess: () => {
        toast.success("Listing restored!");
      },
      onError: () => {
        toast.error("Failed to restore listing.");
      },
    });
  }

  function handlePermanentDelete() {
    permanentDeleteListing.mutate(listing.id, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        toast.success("Listing permanently deleted.");
      },
      onError: () => {
        toast.error("Failed to delete listing.");
      },
    });
  }

  function handlePinClick(e: React.MouseEvent) {
    e.stopPropagation();
    // Optimistic update
    const next = !isPinned;
    setOptimisticPinned(next);
    togglePin.mutate(listing.id, {
      onError: () => {
        // Revert
        setOptimisticPinned(isPinned);
        toast.error("Failed to update pin.");
      },
    });
  }

  function handleFavoriteClick(e: React.MouseEvent) {
    e.stopPropagation();
    // Optimistic update
    const next = !isFavorited;
    setOptimisticFavorited(next);
    toggleFavorite.mutate(listing.id, {
      onError: () => {
        // Revert
        setOptimisticFavorited(isFavorited);
        toast.error("Failed to update favorite.");
      },
    });
  }

  function handleCardClick() {
    if (showArchiveConfirm || showDeleteConfirm) return;
    navigate({ to: "/listing/$id", params: { id: listing.id.toString() } });
  }

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
      className={`group relative rounded-md overflow-hidden cursor-pointer transition-smooth ${
        isArchived ? "opacity-60" : ""
      }`}
      data-ocid="listing-card"
      onClick={handleCardClick}
    >
      {/* Confirm overlays */}
      {showArchiveConfirm && (
        <ConfirmOverlay
          type="archive"
          onConfirm={handleArchive}
          onCancel={() => setShowArchiveConfirm(false)}
          isLoading={isArchiving}
        />
      )}
      {showDeleteConfirm && (
        <ConfirmOverlay
          type="delete"
          title={listing.title}
          onConfirm={handlePermanentDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          isLoading={isDeleting}
        />
      )}

      {/* Square image container */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        {imagesLoading ? (
          <Skeleton className="absolute inset-0 rounded-none" />
        ) : thumbnail ? (
          <img
            src={thumbnail}
            alt={listing.title}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-smooth group-hover:scale-105 ${isArchived ? "grayscale" : ""}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center retro-grid opacity-40">
            <span className="text-3xl">📋</span>
          </div>
        )}

        {/* Dark gradient overlay for icons */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 pointer-events-none" />

        {/* Pin icon — top-left */}
        <button
          type="button"
          className="absolute top-1.5 left-1.5 w-8 h-8 flex items-center justify-center z-20 rounded-full transition-smooth hover:scale-110 active:scale-95"
          onClick={handlePinClick}
          aria-label={isPinned ? "Unpin listing" : "Pin listing to top"}
          data-ocid="pin-listing-btn"
          disabled={togglePin.isPending}
        >
          <span
            className="text-base leading-none drop-shadow-md transition-all duration-200"
            style={{
              opacity: isPinned ? 1 : 0.35,
              filter: isPinned ? "drop-shadow(0 0 4px #00d4ff)" : "none",
            }}
          >
            📌
          </span>
        </button>

        {/* Favorite icon — top-right */}
        <button
          type="button"
          className="absolute top-1.5 right-1.5 w-8 h-8 flex items-center justify-center z-20 rounded-full transition-smooth hover:scale-110 active:scale-95"
          onClick={handleFavoriteClick}
          aria-label={
            isFavorited ? "Remove from favorites" : "Add to favorites"
          }
          data-ocid="favorite-listing-btn"
          disabled={toggleFavorite.isPending}
        >
          <span
            className="text-base leading-none drop-shadow-md transition-all duration-200"
            style={{
              color: isFavorited ? "#ffd700" : undefined,
              opacity: isFavorited ? 1 : 0.5,
              filter: isFavorited ? "drop-shadow(0 0 4px #ffd700)" : "none",
            }}
          >
            {isFavorited ? "♥" : "♡"}
          </span>
        </button>

        {/* Actions strip — bottom on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between px-1.5 py-1.5 opacity-0 group-hover:opacity-100 transition-smooth pointer-events-none group-hover:pointer-events-auto"
          role="toolbar"
          aria-label="Listing actions"
        >
          {/* Copy button */}
          <button
            type="button"
            className="h-7 px-2 rounded text-[11px] font-display font-bold bg-primary/80 text-primary-foreground hover:bg-primary transition-smooth glow-blue-sm"
            onClick={(e) => {
              e.stopPropagation();
              copy(buildFullPost(listing), listing.id.toString());
            }}
            aria-label="Copy listing"
            data-ocid="copy-listing-btn"
          >
            {isCopied ? (
              <Check className="h-3 w-3 inline mr-0.5" />
            ) : (
              <Copy className="h-3 w-3 inline mr-0.5" />
            )}
            {isCopied ? "✓" : "Copy"}
          </button>

          {/* Action buttons */}
          <div className="flex gap-1 relative">
            {!isArchived && (
              <button
                type="button"
                className="h-7 w-7 rounded flex items-center justify-center bg-black/60 text-muted-foreground hover:text-accent hover:bg-black/80 transition-smooth"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowArchiveConfirm(true);
                }}
                aria-label="Archive"
                data-ocid="archive-listing-btn"
              >
                <Archive className="h-3.5 w-3.5" />
              </button>
            )}
            {isArchived && (
              <>
                <button
                  type="button"
                  className={`h-7 px-1.5 rounded text-[11px] flex items-center gap-0.5 transition-smooth ${
                    isSubscriptionActive
                      ? "bg-primary/80 text-primary-foreground hover:bg-primary"
                      : "bg-muted/60 text-muted-foreground/50 cursor-not-allowed"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRestore();
                  }}
                  disabled={!isSubscriptionActive || isRestoring}
                  aria-label="Restore"
                  data-ocid="restore-listing-btn"
                >
                  {isRestoring ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3 w-3" />
                  )}
                </button>
                <button
                  type="button"
                  className="h-7 w-7 rounded flex items-center justify-center bg-destructive/80 text-destructive-foreground hover:bg-destructive transition-smooth"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(true);
                  }}
                  aria-label="Delete forever"
                  data-ocid="permanent-delete-btn"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Archived badge */}
        {isArchived && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none z-10">
            <span className="font-mono text-[9px] px-1.5 py-0.5 bg-muted/80 text-muted-foreground border border-border/50 tracking-widest rounded uppercase">
              {deletionDays !== null ? `🗑 ${deletionDays}d left` : "ARCHIVED"}
            </span>
          </div>
        )}

        {/* Timestamp overlay — shows on hover */}
        <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-gradient-to-t from-black/60 to-transparent text-xs text-gray-200 group-hover:block hidden pointer-events-none z-10">
          📅 {relativeTime}
        </div>
      </div>

      {/* Title below image */}
      <div className="px-1 pt-1.5 pb-0.5 bg-card">
        <p className="font-display text-[11px] font-semibold text-foreground line-clamp-1 leading-tight group-hover:text-primary transition-colors duration-200">
          {listing.title}
        </p>
        {listing.price && (
          <p className="font-mono text-[10px] text-accent text-glow-yellow leading-tight mt-0.5">
            {listing.price}
          </p>
        )}
      </div>
    </motion.article>
  );
}

export type { ListingCardProps };

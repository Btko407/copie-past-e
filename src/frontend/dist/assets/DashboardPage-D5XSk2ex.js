import { c as createLucideIcon, r as reactExports, u as useNavigate, L as ListingStatus, j as jsxRuntimeExports, m as motion, S as Skeleton, C as Copy, R as RefreshCw, B as Button, X, a as ue, b as useCheckLowFuelNotification, d as Layout, M as MaintenanceBanner, Z as Zap, I as Input } from "./index-C4SYi2ho.js";
import { c as copyText, u as useListingImages, a as useArchiveListing, b as useRestoreListing, d as usePermanentDeleteListing, e as useTogglePin, f as useToggleFavorite, g as useListings, h as useFavoritedListings } from "./copyText-ChK9IbjU.js";
import { u as useGetMySubscription, a as useGetTiers } from "./useTiers-CMD_X8fk.js";
import { C as Check } from "./check-CXuH5Pwk.js";
import { A as Archive } from "./archive-ChGbqOKK.js";
import { L as LoaderCircle } from "./loader-circle-Bh8qpCnU.js";
import { T as Trash2 } from "./trash-2-DCCqSPLP.js";
import { u as useGetPaymentBanner, a as useDismissPaymentBanner, b as useCreateStripePortalSession } from "./useStripePayments-BI09uxBw.js";
import { A as AnimatePresence } from "./index-L7eBRARd.js";
import { R as RefuelBanner, L as LowFuelWarningBanner } from "./RefuelBanner-DKUWTdjW.js";
import { T as TimeCircuitsCountdown } from "./TimeCircuitsCountdown-enzw7ii-.js";
import { c as computeFuelFromExpiry } from "./GasFuelTank-d79qfeo3.js";
import { S as Search } from "./search-npxazY2_.js";
import { P as Plus } from "./plus-SLfPK7-a.js";
import "./useBackup-BCrtYt1J.js";
import "./download-i3MaSiJ4.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
      key: "c3ymky"
    }
  ]
];
const Heart = createLucideIcon("heart", __iconNode);
function useClipboard() {
  const [copiedId, setCopiedId] = reactExports.useState(null);
  const copy = reactExports.useCallback(async (text, id) => {
    await copyText(text);
    if (id) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2e3);
    }
  }, []);
  return { copy, copiedId };
}
function buildFullPost(listing) {
  const parts = [listing.title];
  if (listing.description) parts.push(listing.description);
  if (listing.price) parts.push(`Price: ${listing.price}`);
  if (listing.sourceUrl) parts.push(listing.sourceUrl);
  return parts.join("\n");
}
function nsToMs$1(ts) {
  if (typeof ts === "bigint") return Number(ts) / 1e6;
  return ts > 1e15 ? ts / 1e6 : ts;
}
function daysUntilDeletion(archivedAt) {
  const archivedMs = Number(archivedAt) / 1e6;
  const deleteAt = archivedMs + 30 * 24 * 60 * 60 * 1e3;
  return Math.max(
    0,
    Math.floor((deleteAt - Date.now()) / (1e3 * 60 * 60 * 24))
  );
}
function ConfirmOverlay({
  type,
  title,
  onConfirm,
  onCancel,
  isLoading
}) {
  const isDelete = type === "delete";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `absolute inset-0 z-40 flex flex-col items-center justify-center rounded-lg backdrop-blur-sm p-3 ${isDelete ? "bg-card/95 border border-destructive/60" : "bg-card/95 neon-border-yellow"}`,
      children: [
        isDelete ? /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-5 w-5 text-destructive mb-1.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "h-5 w-5 text-accent mb-1.5 text-glow-yellow" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: `font-display text-[11px] font-bold tracking-wide text-center mb-1 ${isDelete ? "text-destructive" : "text-foreground"}`,
            children: isDelete ? "Delete forever?" : "Archive listing?"
          }
        ),
        isDelete && title && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground text-center mb-1 leading-tight truncate w-full px-2", children: [
          '"',
          title,
          '"'
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 w-full mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "ghost",
              className: "flex-1 h-7 text-[11px] border border-border/60 hover:bg-secondary/50 transition-smooth",
              onClick: onCancel,
              disabled: isLoading,
              "data-ocid": "confirm-cancel-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3 mr-1" }),
                " Cancel"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              className: `flex-1 h-7 text-[11px] font-display font-bold transition-smooth ${isDelete ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-accent text-accent-foreground hover:bg-accent/90 glow-yellow-sm"}`,
              onClick: onConfirm,
              disabled: isLoading,
              "data-ocid": "confirm-action-btn",
              children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : isDelete ? "Delete" : "Archive"
            }
          )
        ] })
      ]
    }
  );
}
function ListingCard({ listing, index }) {
  const navigate = useNavigate();
  const { copy, copiedId } = useClipboard();
  const [imageError, setImageError] = reactExports.useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = reactExports.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = reactExports.useState(false);
  const [optimisticPinned, setOptimisticPinned] = reactExports.useState(
    null
  );
  const [optimisticFavorited, setOptimisticFavorited] = reactExports.useState(null);
  const { data: images, isLoading: imagesLoading } = useListingImages(
    listing.id
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
  const isPinned = optimisticPinned !== null ? optimisticPinned : listing.pinned;
  const isFavorited = optimisticFavorited !== null ? optimisticFavorited : listing.favorited;
  const expirationMs = (subscription == null ? void 0 : subscription.expirationDate) ? nsToMs$1(subscription.expirationDate) : null;
  const isSubscriptionActive = expirationMs !== null && expirationMs > Date.now();
  const deletionDays = isArchived && listing.archivedAt ? daysUntilDeletion(listing.archivedAt) : null;
  const thumbnail = images && images.length > 0 && !imageError ? images[0].blob.getDirectURL() : null;
  function handleArchive() {
    archiveListing.mutate(listing.id, {
      onSuccess: () => {
        setShowArchiveConfirm(false);
        ue.success("Listing archived.");
      },
      onError: () => {
        ue.error("Failed to archive listing.");
      }
    });
  }
  function handleRestore() {
    if (!isSubscriptionActive) return;
    restoreListing.mutate(listing.id, {
      onSuccess: () => {
        ue.success("Listing restored!");
      },
      onError: () => {
        ue.error("Failed to restore listing.");
      }
    });
  }
  function handlePermanentDelete() {
    permanentDeleteListing.mutate(listing.id, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        ue.success("Listing permanently deleted.");
      },
      onError: () => {
        ue.error("Failed to delete listing.");
      }
    });
  }
  function handlePinClick(e) {
    e.stopPropagation();
    const next = !isPinned;
    setOptimisticPinned(next);
    togglePin.mutate(listing.id, {
      onError: () => {
        setOptimisticPinned(isPinned);
        ue.error("Failed to update pin.");
      }
    });
  }
  function handleFavoriteClick(e) {
    e.stopPropagation();
    const next = !isFavorited;
    setOptimisticFavorited(next);
    toggleFavorite.mutate(listing.id, {
      onError: () => {
        setOptimisticFavorited(isFavorited);
        ue.error("Failed to update favorite.");
      }
    });
  }
  function handleCardClick() {
    if (showArchiveConfirm || showDeleteConfirm) return;
    navigate({ to: "/listing/$id", params: { id: listing.id.toString() } });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.article,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.35, delay: index * 0.05, ease: "easeOut" },
      className: `group relative rounded-md overflow-hidden cursor-pointer transition-smooth ${isArchived ? "opacity-60" : ""}`,
      "data-ocid": "listing-card",
      onClick: handleCardClick,
      children: [
        showArchiveConfirm && /* @__PURE__ */ jsxRuntimeExports.jsx(
          ConfirmOverlay,
          {
            type: "archive",
            onConfirm: handleArchive,
            onCancel: () => setShowArchiveConfirm(false),
            isLoading: isArchiving
          }
        ),
        showDeleteConfirm && /* @__PURE__ */ jsxRuntimeExports.jsx(
          ConfirmOverlay,
          {
            type: "delete",
            title: listing.title,
            onConfirm: handlePermanentDelete,
            onCancel: () => setShowDeleteConfirm(false),
            isLoading: isDeleting
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-square bg-muted overflow-hidden", children: [
          imagesLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "absolute inset-0 rounded-none" }) : thumbnail ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: thumbnail,
              alt: listing.title,
              onError: () => setImageError(true),
              className: `w-full h-full object-cover transition-smooth group-hover:scale-105 ${isArchived ? "grayscale" : ""}`
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center retro-grid opacity-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl", children: "📋" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 pointer-events-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "absolute top-1.5 left-1.5 w-8 h-8 flex items-center justify-center z-20 rounded-full transition-smooth hover:scale-110 active:scale-95",
              onClick: handlePinClick,
              "aria-label": isPinned ? "Unpin listing" : "Pin listing to top",
              "data-ocid": "pin-listing-btn",
              disabled: togglePin.isPending,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-base leading-none drop-shadow-md transition-all duration-200",
                  style: {
                    opacity: isPinned ? 1 : 0.35,
                    filter: isPinned ? "drop-shadow(0 0 4px #00d4ff)" : "none"
                  },
                  children: "📌"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "absolute top-1.5 right-1.5 w-8 h-8 flex items-center justify-center z-20 rounded-full transition-smooth hover:scale-110 active:scale-95",
              onClick: handleFavoriteClick,
              "aria-label": isFavorited ? "Remove from favorites" : "Add to favorites",
              "data-ocid": "favorite-listing-btn",
              disabled: toggleFavorite.isPending,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-base leading-none drop-shadow-md transition-all duration-200",
                  style: {
                    color: isFavorited ? "#ffd700" : void 0,
                    opacity: isFavorited ? 1 : 0.5,
                    filter: isFavorited ? "drop-shadow(0 0 4px #ffd700)" : "none"
                  },
                  children: isFavorited ? "♥" : "♡"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between px-1.5 py-1.5 opacity-0 group-hover:opacity-100 transition-smooth pointer-events-none group-hover:pointer-events-auto",
              role: "toolbar",
              "aria-label": "Listing actions",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    className: "h-7 px-2 rounded text-[11px] font-display font-bold bg-primary/80 text-primary-foreground hover:bg-primary transition-smooth glow-blue-sm",
                    onClick: (e) => {
                      e.stopPropagation();
                      copy(buildFullPost(listing), listing.id.toString());
                    },
                    "aria-label": "Copy listing",
                    "data-ocid": "copy-listing-btn",
                    children: [
                      isCopied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 inline mr-0.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3 w-3 inline mr-0.5" }),
                      isCopied ? "✓" : "Copy"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 relative", children: [
                  !isArchived && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "h-7 w-7 rounded flex items-center justify-center bg-black/60 text-muted-foreground hover:text-accent hover:bg-black/80 transition-smooth",
                      onClick: (e) => {
                        e.stopPropagation();
                        setShowArchiveConfirm(true);
                      },
                      "aria-label": "Archive",
                      "data-ocid": "archive-listing-btn",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "h-3.5 w-3.5" })
                    }
                  ),
                  isArchived && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        className: `h-7 px-1.5 rounded text-[11px] flex items-center gap-0.5 transition-smooth ${isSubscriptionActive ? "bg-primary/80 text-primary-foreground hover:bg-primary" : "bg-muted/60 text-muted-foreground/50 cursor-not-allowed"}`,
                        onClick: (e) => {
                          e.stopPropagation();
                          handleRestore();
                        },
                        disabled: !isSubscriptionActive || isRestoring,
                        "aria-label": "Restore",
                        "data-ocid": "restore-listing-btn",
                        children: isRestoring ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3 w-3" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        className: "h-7 w-7 rounded flex items-center justify-center bg-destructive/80 text-destructive-foreground hover:bg-destructive transition-smooth",
                        onClick: (e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(true);
                        },
                        "aria-label": "Delete forever",
                        "data-ocid": "permanent-delete-btn",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                      }
                    )
                  ] })
                ] })
              ]
            }
          ),
          isArchived && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] px-1.5 py-0.5 bg-muted/80 text-muted-foreground border border-border/50 tracking-widest rounded uppercase", children: deletionDays !== null ? `🗑 ${deletionDays}d left` : "ARCHIVED" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-1 pt-1.5 pb-0.5 bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-[11px] font-semibold text-foreground line-clamp-1 leading-tight group-hover:text-primary transition-colors duration-200", children: listing.title }),
          listing.price && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-accent text-glow-yellow leading-tight mt-0.5", children: listing.price })
        ] })
      ]
    }
  );
}
function SuccessBanner({ onDismiss }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: -12, scale: 0.98 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -8, scale: 0.98 },
      transition: { duration: 0.3 },
      className: "flex items-start sm:items-center justify-between gap-3 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 mb-4",
      role: "alert",
      "data-ocid": "payment-success-banner",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.span,
            {
              animate: { scale: [1, 1.2, 1] },
              transition: { duration: 1.5, repeat: Number.POSITIVE_INFINITY },
              className: "text-lg shrink-0",
              children: "⚡"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs font-bold tracking-widest uppercase text-primary text-glow-blue", children: "DeLorean Refueled!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: "Your subscription has been extended. Time circuits updated." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onDismiss,
            "aria-label": "Dismiss success banner",
            className: "text-muted-foreground hover:text-foreground transition-smooth shrink-0 text-lg leading-none",
            "data-ocid": "dismiss-success-banner-btn",
            children: "×"
          }
        )
      ]
    }
  );
}
function FailureBanner() {
  const portalSession = useCreateStripePortalSession();
  const dismissBanner = useDismissPaymentBanner();
  async function handleFixNow() {
    try {
      await portalSession.mutateAsync();
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to open billing portal."
      );
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: -12, scale: 0.98 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -8 },
      transition: { duration: 0.3 },
      className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 mb-4",
      role: "alert",
      "data-ocid": "payment-failure-banner",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start sm:items-center gap-3 min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg shrink-0 mt-0.5 sm:mt-0", children: "⚠" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs font-bold tracking-widest uppercase text-destructive", children: "Payment Failed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground leading-relaxed", children: "Update your payment method to avoid losing your listings." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              onClick: handleFixNow,
              disabled: portalSession.isPending,
              className: "font-display text-[10px] tracking-widest uppercase bg-destructive text-destructive-foreground hover:bg-destructive/90 h-7 px-3",
              "data-ocid": "payment-failure-fix-now-btn",
              children: portalSession.isPending ? "Opening..." : "Fix Now"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => dismissBanner.mutate(),
              "aria-label": "Dismiss failure banner",
              className: "text-muted-foreground hover:text-foreground transition-smooth text-lg leading-none",
              "data-ocid": "dismiss-failure-banner-btn",
              children: "×"
            }
          )
        ] })
      ]
    }
  );
}
function PaymentBanners() {
  const { data: backendBanner } = useGetPaymentBanner();
  const [successDismissed, setSuccessDismissed] = reactExports.useState(false);
  const dismissBanner = useDismissPaymentBanner();
  const bannerExpiry = localStorage.getItem("refuel_banner_expiry");
  const showSuccess = !successDismissed && bannerExpiry !== null && Date.now() < Number(bannerExpiry);
  const showFailure = (backendBanner == null ? void 0 : backendBanner.bannerType) === "failure";
  function handleSuccessDismiss() {
    setSuccessDismissed(true);
    localStorage.removeItem("refuel_banner_expiry");
    localStorage.removeItem("refuel_banner_shown");
    dismissBanner.mutate();
  }
  if (!showSuccess && !showFailure) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "payment-banners", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { children: [
    showSuccess && /* @__PURE__ */ jsxRuntimeExports.jsx(SuccessBanner, { onDismiss: handleSuccessDismiss }, "success"),
    showFailure && /* @__PURE__ */ jsxRuntimeExports.jsx(FailureBanner, {}, "failure")
  ] }) });
}
function nsToMs(ns) {
  if (typeof ns === "bigint") return Number(ns) / 1e6;
  return ns > 1e15 ? ns / 1e6 : ns;
}
function formatCompactTime(msRemaining) {
  if (msRemaining <= 0) return "EXPIRED";
  const totalSecs = Math.floor(msRemaining / 1e3);
  const days = Math.floor(totalSecs / (24 * 3600));
  const rem = totalSecs % (24 * 3600);
  const hours = Math.floor(rem / 3600);
  const mins = Math.floor(rem % 3600 / 60);
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  parts.push(`${mins}m`);
  return parts.join(" ");
}
function CompactCountdown({ expirationDate, tierName }) {
  const expMs = nsToMs(expirationDate);
  const [msRemaining, setMsRemaining] = reactExports.useState(() => expMs - Date.now());
  reactExports.useState(() => {
    const tick = () => setMsRemaining(expMs - Date.now());
    const id = setInterval(tick, 6e4);
    return () => clearInterval(id);
  });
  const timeStr = formatCompactTime(msRemaining);
  const isExpired = msRemaining <= 0;
  const isLow = msRemaining > 0 && msRemaining < 7 * 24 * 60 * 60 * 1e3;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-mono ${isExpired ? "border-destructive/60 bg-destructive/10 text-destructive" : isLow ? "border-accent/60 bg-accent/10 text-accent" : "border-primary/40 bg-primary/10 text-primary"}`,
      "data-ocid": "compact-countdown-banner",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "⏱" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `font-bold tracking-wide ${isExpired ? "animate-circuit-pulse" : ""}`,
            children: timeStr
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "remaining" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-1 text-muted-foreground", children: "·" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold tracking-widest uppercase text-[10px]", children: tierName })
      ]
    }
  );
}
function SkeletonGrid() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1.5", "data-ocid": "listings-skeleton", children: Array.from({ length: 9 }, (_, i) => `sk-${i}`).map((key) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square rounded-md overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full h-full rounded-none" }) }, key)) });
}
function EmptyState({ tab, onImport }) {
  const config = {
    active: {
      icon: "📋",
      title: "Your archive is empty",
      desc: "Start capturing listings to build your reuse archive. Import once, copy forever.",
      cta: "Create your first listing",
      showCta: true
    },
    archived: {
      icon: "🗃",
      title: "No archived listings",
      desc: "Listings you archive will appear here for 30 days before deletion.",
      cta: "",
      showCta: false
    },
    favorites: {
      icon: "🤍",
      title: "No favorites yet",
      desc: "Tap ♡ on any listing to add it here.",
      cta: "",
      showCta: false
    }
  }[tab];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.4 },
      className: "flex flex-col items-center justify-center py-16 px-6 text-center",
      "data-ocid": `empty-state-${tab}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-5xl mb-4", children: config.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-base font-bold text-foreground text-glow-blue mb-2", children: config.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs leading-relaxed mb-6", children: config.desc }),
        config.showCta && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: onImport,
            className: "gap-2 bg-accent text-accent-foreground hover:bg-accent/90 glow-yellow font-display font-bold tracking-wide",
            "data-ocid": "create-first-listing-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              config.cta
            ]
          }
        )
      ]
    }
  );
}
function ListingsGrid({ listings }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1.5", "data-ocid": "listings-grid", children: listings.map((listing, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    ListingCard,
    {
      listing,
      index
    },
    listing.id.toString()
  )) });
}
function TabBar({
  activeTab,
  onTabChange,
  activeCnt,
  archivedCnt,
  favoritesCnt
}) {
  const tabs = [
    {
      key: "active",
      label: "Active",
      count: activeCnt,
      textClass: "text-foreground"
    },
    {
      key: "archived",
      label: "Archived",
      count: archivedCnt,
      textClass: "text-accent"
    },
    {
      key: "favorites",
      label: "Favorites",
      count: favoritesCnt,
      textClass: "text-accent"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "flex border-b border-border/40 mb-4",
      role: "tablist",
      "data-ocid": "tab-bar",
      children: tabs.map(({ key, label, count, textClass }) => {
        const isActive = activeTab === key;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": isActive,
            className: `flex items-center gap-1.5 px-3 py-2.5 text-xs font-display font-bold tracking-wide transition-smooth relative ${isActive ? "text-primary" : `${textClass} opacity-70 hover:opacity-100`}`,
            onClick: () => onTabChange(key),
            "data-ocid": `tab-${key}`,
            children: [
              key === "favorites" && /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-3 w-3" }),
              label,
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `font-mono text-[10px] px-1 py-0.5 rounded ${isActive ? "bg-primary/20 text-primary" : "bg-muted/60 text-muted-foreground"}`,
                  children: count
                }
              ),
              isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  layoutId: "tab-indicator",
                  className: "absolute bottom-0 left-0 right-0 h-0.5 bg-primary glow-blue-sm rounded-t"
                }
              )
            ]
          },
          key
        );
      })
    }
  );
}
const LOW_FUEL_THRESHOLD = 20;
function DashboardPage() {
  const navigate = useNavigate();
  const { data: listings, isLoading: listingsLoading } = useListings();
  const { data: favoritedListings, isLoading: favoritesLoading } = useFavoritedListings();
  const { data: subscription } = useGetMySubscription();
  const { data: tiers } = useGetTiers();
  const checkLowFuel = useCheckLowFuelNotification();
  const [activeTab, setActiveTab] = reactExports.useState("active");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [bannerDismissed, setBannerDismissed] = reactExports.useState(false);
  const [lowFuelBannerDismissed, setLowFuelBannerDismissed] = reactExports.useState(false);
  const lowFuelCheckFiredRef = reactExports.useRef(false);
  const allListings = listings ?? [];
  const allFavorited = favoritedListings ?? [];
  const now = Date.now();
  const expirationMs = (subscription == null ? void 0 : subscription.expirationDate) ? nsToMs(subscription.expirationDate) : null;
  const isSubscriptionExpired = expirationMs !== null && expirationMs < now;
  const currentTier = tiers == null ? void 0 : tiers.find(
    (t) => Number(t.tierId) === Number((subscription == null ? void 0 : subscription.tier) ?? 1)
  );
  const tierName = (currentTier == null ? void 0 : currentTier.name) ?? "Time Walker";
  const tierNum = (subscription == null ? void 0 : subscription.tier) ? Math.min(3, Math.max(1, Number(subscription.tier))) : null;
  const fuelData = reactExports.useMemo(() => {
    if (!expirationMs || !tierNum) return null;
    return computeFuelFromExpiry(expirationMs, tierNum);
  }, [expirationMs, tierNum]);
  const fuelPercent = (fuelData == null ? void 0 : fuelData.fuelPercent) ?? 0;
  const isLowFuel = !isSubscriptionExpired && fuelPercent < LOW_FUEL_THRESHOLD && fuelPercent > 0;
  reactExports.useEffect(() => {
    if (isLowFuel && !lowFuelCheckFiredRef.current && expirationMs && subscription) {
      lowFuelCheckFiredRef.current = true;
      const expiryNs = BigInt(Math.round(expirationMs * 1e6));
      checkLowFuel.mutate({
        fuelPercent,
        subscriptionExpirationTimestamp: expiryNs
      });
    }
  }, [isLowFuel, expirationMs, subscription, fuelPercent, checkLowFuel]);
  const sortedActive = reactExports.useMemo(() => {
    return allListings.filter((l) => l.status === ListingStatus.active).sort((a, b) => {
      const aPin = a.pinned ? 1 : 0;
      const bPin = b.pinned ? 1 : 0;
      if (bPin !== aPin) return bPin - aPin;
      if (a.pinned && b.pinned && a.pinnedAt && b.pinnedAt) {
        return Number(a.pinnedAt) - Number(b.pinnedAt);
      }
      return Number(b.createdAt) - Number(a.createdAt);
    });
  }, [allListings]);
  const sortedArchived = reactExports.useMemo(() => {
    return allListings.filter((l) => l.status === ListingStatus.archived).sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
  }, [allListings]);
  const sortedFavorites = reactExports.useMemo(() => {
    return [...allFavorited].sort((a, b) => {
      const aPin = a.pinned ? 1 : 0;
      const bPin = b.pinned ? 1 : 0;
      if (bPin !== aPin) return bPin - aPin;
      return Number(b.createdAt) - Number(a.createdAt);
    });
  }, [allFavorited]);
  function filterBySearch(items) {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (l) => l.title.toLowerCase().includes(q) || (l.description ?? "").toLowerCase().includes(q)
    );
  }
  const visibleListings = filterBySearch(
    activeTab === "active" ? sortedActive : activeTab === "archived" ? sortedArchived : sortedFavorites
  );
  const isLoading = listingsLoading || activeTab === "favorites" && favoritesLoading;
  const daysUntilDeletion2 = isSubscriptionExpired && expirationMs !== null ? Math.max(
    0,
    Math.floor(
      (expirationMs + 30 * 24 * 60 * 60 * 1e3 - now) / (1e3 * 60 * 60 * 24)
    )
  ) : null;
  const showRefuelBanner = !bannerDismissed && isSubscriptionExpired && sortedArchived.length > 0 && daysUntilDeletion2 !== null;
  const showLowFuelBanner = !lowFuelBannerDismissed && isLowFuel && !isSubscriptionExpired;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(MaintenanceBanner, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-screen-xl mx-auto px-3 sm:px-6 py-6",
        "data-ocid": "dashboard-page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground text-glow-blue", children: "Archive" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "ghost",
                  onClick: () => navigate({ to: "/upgrade" }),
                  className: "h-8 px-2 text-xs gap-1 border border-accent/30 text-accent hover:bg-accent/10 glow-yellow-sm font-display font-bold tracking-wide",
                  "data-ocid": "upgrade-tier-btn",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3 w-3" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Upgrade" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  onClick: () => navigate({ to: "/import" }),
                  className: "h-8 gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90 glow-yellow-sm font-display font-bold tracking-wide text-xs",
                  "data-ocid": "new-listing-btn",
                  children: "+ New Listing"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentBanners, {}),
          showRefuelBanner && /* @__PURE__ */ jsxRuntimeExports.jsx(
            RefuelBanner,
            {
              daysUntilDeletion: daysUntilDeletion2,
              onRefuel: () => navigate({ to: "/wallet" }),
              onDismiss: () => setBannerDismissed(true)
            }
          ),
          showLowFuelBanner && /* @__PURE__ */ jsxRuntimeExports.jsx(
            LowFuelWarningBanner,
            {
              onDismiss: () => setLowFuelBannerDismissed(true)
            }
          ),
          (subscription == null ? void 0 : subscription.expirationDate) && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:hidden mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              CompactCountdown,
              {
                expirationDate: subscription.expirationDate,
                tierName
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "hidden sm:block mb-4",
                "data-ocid": "active-listings-countdown",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TimeCircuitsCountdown,
                  {
                    expirationDate: subscription.expirationDate,
                    label: "SUBSCRIPTION TIME REMAINING"
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-3", "data-ocid": "search-container", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                placeholder: "Search your listings...",
                className: "pl-8 h-9 bg-background border-border/60 focus:border-primary focus:ring-primary/30 font-mono text-xs placeholder:text-muted-foreground/60 transition-smooth",
                "data-ocid": "search-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TabBar,
            {
              activeTab,
              onTabChange: setActiveTab,
              activeCnt: sortedActive.length,
              archivedCnt: sortedArchived.length,
              favoritesCnt: allFavorited.length
            }
          ),
          activeTab === "archived" && isSubscriptionExpired && expirationMs !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", "data-ocid": "archive-countdown", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TimeCircuitsCountdown,
              {
                expirationDate: expirationMs + 30 * 24 * 60 * 60 * 1e3,
                label: "⚠ ARCHIVE WINDOW — TIME UNTIL PERMANENT DELETION",
                forceRed: true
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs font-bold tracking-widest uppercase text-destructive mb-0.5", children: "🚗 Your DeLorean is out of gas!" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground leading-relaxed", children: "Refuel to restore your listings before they're permanently deleted." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  onClick: () => navigate({ to: "/wallet" }),
                  className: "shrink-0 bg-accent text-accent-foreground hover:bg-accent/90 glow-yellow-sm font-display font-bold tracking-wide text-xs",
                  "data-ocid": "refuel-from-archive-btn",
                  children: "⛽ Refuel Now"
                }
              )
            ] })
          ] }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonGrid, {}) : visibleListings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              tab: activeTab,
              onImport: () => navigate({ to: "/import" })
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(ListingsGrid, { listings: visibleListings })
        ]
      }
    )
  ] });
}
export {
  DashboardPage
};

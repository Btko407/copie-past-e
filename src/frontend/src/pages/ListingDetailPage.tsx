import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  ExternalLink,
  ImagePlus,
  Loader2,
  Pencil,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { createActor } from "../backend";
import type { Image, Listing, UpdateListingArgs } from "../backend.d.ts";
import { CopyButtons } from "../components/CopyButtons";
import { ImageGallery } from "../components/ImageGallery";
import { SmartPostButtons } from "../components/SmartPostButtons";
import {
  CATEGORIES,
  CONDITIONS,
  type ListingCategoryFields,
  SUBCATEGORY_MAP,
  decodeCategory,
  encodeCategory,
} from "../constants/categories";
import { useDeleteListing } from "../hooks/useDeleteListing";
import {
  useListingImages,
  useToggleFavorite,
  useTogglePin,
} from "../hooks/useListings";
import {
  useAddImageToListing,
  useRemoveImage,
  useUpdateListing,
} from "../hooks/useUpdateListing";

const MAX_IMAGES = 10;

// ── New image pending upload ───────────────────────────────────────────────────
interface PendingImage {
  id: string;
  file: File;
  preview: string;
  uploading: boolean;
  uploadProgress: number;
}

export function ListingDetailPage() {
  const { id } = useParams({ from: "/listing/$id" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { actor, isFetching } = useActor(createActor);

  const listingId = BigInt(id);

  const {
    data: listing,
    isLoading,
    error,
  } = useQuery<Listing | null>({
    queryKey: ["listing", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getListing(listingId);
    },
    enabled: !!actor && !isFetching,
  });

  const { data: images = [], isLoading: imagesLoading } = useListingImages(
    listingId,
    !!actor && !isFetching,
  );

  const updateListing = useUpdateListing();
  const deleteListing = useDeleteListing();
  const togglePin = useTogglePin();
  const toggleFavorite = useToggleFavorite();
  const removeImage = useRemoveImage();
  const addImage = useAddImageToListing();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCatFields, setEditCatFields] = useState<ListingCategoryFields>({
    category: "",
    subcategory: "",
    condition: "",
    brand: "",
    typeModel: "",
  });

  // Edit-mode image state
  const [deletingImageId, setDeletingImageId] = useState<bigint | null>(null);
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Optimistic local overrides for pin/favorite
  const [optimisticPinned, setOptimisticPinned] = useState<boolean | null>(
    null,
  );
  const [optimisticFavorited, setOptimisticFavorited] = useState<
    boolean | null
  >(null);

  const isPinned =
    optimisticPinned !== null ? optimisticPinned : (listing?.pinned ?? false);
  const isFavorited =
    optimisticFavorited !== null
      ? optimisticFavorited
      : (listing?.favorited ?? false);

  function startEditing() {
    if (!listing) return;
    setEditTitle(listing.title);
    setEditDescription(listing.description);
    setEditPrice(listing.price?.replace(/^\$/, "") ?? "");
    setEditCatFields(decodeCategory(listing.category));
    setPendingImages([]);
    setIsEditing(true);
  }

  function cancelEditing() {
    for (const p of pendingImages) URL.revokeObjectURL(p.preview);
    setPendingImages([]);
    setIsEditing(false);
  }

  async function saveEdits() {
    if (!listing) return;
    try {
      const args: UpdateListingArgs = {
        id: listingId,
        title: editTitle,
        description: editDescription,
        price: editPrice ? `$${editPrice}` : undefined,
        category: encodeCategory(editCatFields) || undefined,
      };
      await updateListing.mutateAsync(args);

      // Upload any pending new images
      if (pendingImages.length > 0) {
        const startOrder = images.length;
        for (let i = 0; i < pendingImages.length; i++) {
          const p = pendingImages[i];
          setPendingImages((prev) =>
            prev.map((x) => (x.id === p.id ? { ...x, uploading: true } : x)),
          );
          await addImage.mutateAsync({
            listingId,
            file: p.file,
            order: startOrder + i,
            onProgress: (pct) => {
              setPendingImages((prev) =>
                prev.map((x) =>
                  x.id === p.id ? { ...x, uploadProgress: pct } : x,
                ),
              );
            },
          });
          setPendingImages((prev) => prev.filter((x) => x.id !== p.id));
        }
      }

      for (const p of pendingImages) URL.revokeObjectURL(p.preview);
      setPendingImages([]);
      setIsEditing(false);
      toast.success("✓ Listing updated", { duration: 2000 });
    } catch {
      toast.error("Failed to update listing");
    }
  }

  async function handleDeleteImage(img: Image) {
    setDeletingImageId(img.id);
    try {
      await removeImage.mutateAsync({ imageId: img.id, listingId });
      queryClient.invalidateQueries({
        queryKey: ["images", listingId.toString()],
      });
      toast.success("Image removed");
    } catch {
      toast.error("Failed to remove image");
    } finally {
      setDeletingImageId(null);
    }
  }

  async function handleSetCover(img: Image) {
    try {
      const url = img.blob.getDirectURL();
      const res = await fetch(url, { mode: "cors" });
      if (!res.ok) throw new Error("Could not fetch image");
      const blob = await res.blob();
      const file = new File([blob], img.altText || "cover.jpg", {
        type: blob.type,
      });
      await addImage.mutateAsync({ listingId, file, order: -1 });
      await removeImage.mutateAsync({ imageId: img.id, listingId });
      queryClient.invalidateQueries({
        queryKey: ["images", listingId.toString()],
      });
      toast.success("Cover image updated");
    } catch {
      toast.error("Failed to set cover image");
    }
  }

  function handleAddFiles(fileList: FileList | null) {
    if (!fileList) return;
    const existing = images.length + pendingImages.length;
    const slots = MAX_IMAGES - existing;
    if (slots <= 0) return;
    const accepted = Array.from(fileList)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, slots);
    const newPending: PendingImage[] = accepted.map((f) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file: f,
      preview: URL.createObjectURL(f),
      uploading: false,
      uploadProgress: 0,
    }));
    setPendingImages((prev) => [...prev, ...newPending]);
  }

  function removePending(pendingId: string) {
    setPendingImages((prev) => {
      const item = prev.find((x) => x.id === pendingId);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((x) => x.id !== pendingId);
    });
  }

  async function handleDelete() {
    try {
      await deleteListing.mutateAsync(listingId);
      navigate({ to: "/dashboard" });
    } catch {
      toast.error("Failed to delete listing");
    }
  }

  function handlePinToggle() {
    const next = !isPinned;
    setOptimisticPinned(next);
    togglePin.mutate(listingId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["listing", id] });
      },
      onError: () => {
        setOptimisticPinned(isPinned);
        toast.error("Failed to update pin.");
      },
    });
  }

  function handleFavoriteToggle() {
    const next = !isFavorited;
    setOptimisticFavorited(next);
    toggleFavorite.mutate(listingId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["listing", id] });
      },
      onError: () => {
        setOptimisticFavorited(isFavorited);
        toast.error("Failed to update favorite.");
      },
    });
  }

  function formatDate(ts: bigint) {
    return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  if (isLoading) return <DetailSkeleton />;
  if (error || !listing) {
    return <NotFoundState onBack={() => navigate({ to: "/dashboard" })} />;
  }

  const catFields = decodeCategory(listing.category);
  const editSubcategoryOptions = editCatFields.category
    ? (SUBCATEGORY_MAP[editCatFields.category] ?? [])
    : [];

  const selectClass =
    "w-full h-10 rounded-md px-3 text-sm bg-input border border-primary/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary transition-smooth appearance-none cursor-pointer";

  const totalImages = images.length + pendingImages.length;
  const atMaxImages = totalImages >= MAX_IMAGES;
  const isSaving =
    updateListing.isPending || addImage.isPending || removeImage.isPending;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-card border-b border-border backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground transition-smooth"
            onClick={() => navigate({ to: "/dashboard" })}
            data-ocid="back-to-dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono text-xs uppercase tracking-wider">
              Dashboard
            </span>
          </Button>

          <div className="flex items-center gap-2">
            {/* Pin toggle */}
            <button
              type="button"
              className="h-8 w-8 flex items-center justify-center rounded-md border border-border/50 bg-card/60 hover:bg-card transition-smooth"
              onClick={handlePinToggle}
              disabled={togglePin.isPending}
              aria-label={isPinned ? "Unpin listing" : "Pin listing to top"}
              data-ocid="detail-pin-btn"
            >
              <span
                className="text-sm leading-none transition-all duration-200"
                style={{
                  opacity: isPinned ? 1 : 0.35,
                  filter: isPinned ? "drop-shadow(0 0 4px #00d4ff)" : "none",
                }}
              >
                📌
              </span>
            </button>

            {/* Favorite toggle */}
            <button
              type="button"
              className="h-8 w-8 flex items-center justify-center rounded-md border border-border/50 bg-card/60 hover:bg-card transition-smooth"
              onClick={handleFavoriteToggle}
              disabled={toggleFavorite.isPending}
              aria-label={
                isFavorited ? "Remove from favorites" : "Add to favorites"
              }
              data-ocid="detail-favorite-btn"
            >
              <span
                className="text-sm leading-none transition-all duration-200"
                style={{
                  color: isFavorited ? "#ffd700" : undefined,
                  opacity: isFavorited ? 1 : 0.5,
                  filter: isFavorited ? "drop-shadow(0 0 4px #ffd700)" : "none",
                }}
              >
                {isFavorited ? "♥" : "♡"}
              </span>
            </button>

            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-mono text-xs uppercase tracking-wider text-muted-foreground"
                  onClick={cancelEditing}
                  disabled={isSaving}
                  data-ocid="cancel-edit-btn"
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="neon-border-blue hover:glow-blue-sm transition-smooth font-mono text-xs uppercase tracking-wider gap-1.5"
                  onClick={saveEdits}
                  disabled={isSaving}
                  data-ocid="save-edit-btn"
                >
                  {isSaving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  Save
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="neon-border-blue hover:glow-blue-sm transition-smooth font-mono text-xs uppercase tracking-wider gap-1.5"
                onClick={startEditing}
                data-ocid="edit-toggle-btn"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </Button>
            )}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive hover:text-destructive transition-smooth font-mono text-xs uppercase tracking-wider gap-1.5"
                  data-ocid="delete-listing-btn"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card border-border">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display text-lg">
                    Delete this listing?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground">
                    This action cannot be undone. The listing and all its images
                    will be permanently removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    className="font-mono text-xs uppercase tracking-wider"
                    data-ocid="delete-cancel-btn"
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={deleteListing.isPending}
                    className="bg-destructive hover:bg-destructive/80 font-mono text-xs uppercase tracking-wider"
                    data-ocid="delete-confirm-btn"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Gallery / Image Editor */}
        <div>
          {isEditing ? (
            <EditImagePanel
              images={images}
              pendingImages={pendingImages}
              deletingImageId={deletingImageId}
              atMaxImages={atMaxImages}
              totalImages={totalImages}
              fileInputRef={fileInputRef}
              onDeleteImage={handleDeleteImage}
              onSetCover={handleSetCover}
              onAddFiles={handleAddFiles}
              onRemovePending={removePending}
            />
          ) : (
            <ImageGallery images={images} isLoading={imagesLoading} />
          )}
        </div>

        {/* Right: Info */}
        <div className="flex flex-col gap-6">
          {/* Title */}
          {isEditing ? (
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="font-display text-xl bg-input border-primary/50 focus:neon-border-blue transition-smooth h-auto py-2"
              placeholder="Listing title"
              data-ocid="edit-title-input"
            />
          ) : (
            <h1
              className="font-display text-2xl sm:text-3xl leading-tight text-glow-blue"
              data-ocid="listing-title"
            >
              {listing.title}
            </h1>
          )}

          {/* Price */}
          {isEditing ? (
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                Price
              </p>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm pointer-events-none">
                  $
                </span>
                <Input
                  value={editPrice}
                  onChange={(e) => {
                    const raw = e.target.value
                      .replace(/^\$/, "")
                      .replace(/[^0-9.,]/g, "");
                    setEditPrice(raw);
                  }}
                  className="bg-input border-primary/50 focus:neon-border-blue transition-smooth font-mono pl-7"
                  placeholder="49.99"
                  data-ocid="edit-price-input"
                />
              </div>
            </div>
          ) : (
            listing.price && (
              <div data-ocid="listing-price">
                <span className="font-display text-3xl font-bold text-accent text-glow-yellow">
                  {listing.price}
                </span>
              </div>
            )
          )}

          {/* Category fields — view mode */}
          {!isEditing && <ListingCategoryDisplay fields={catFields} />}

          {/* Category fields — edit mode */}
          {isEditing && (
            <div className="flex flex-col gap-3">
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Listing Details
              </p>

              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                  Category
                </p>
                <select
                  value={editCatFields.category}
                  onChange={(e) =>
                    setEditCatFields({
                      ...editCatFields,
                      category: e.target.value,
                      subcategory: "",
                    })
                  }
                  className={selectClass}
                  data-ocid="edit-category-select"
                >
                  <option value="" className="bg-card text-muted-foreground">
                    Select a category…
                  </option>
                  {CATEGORIES.map((cat) => (
                    <option
                      key={cat}
                      value={cat}
                      className="bg-card text-foreground"
                    >
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {editCatFields.category && (
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                    Subcategory <span className="normal-case">(optional)</span>
                  </p>
                  <select
                    value={editCatFields.subcategory}
                    onChange={(e) =>
                      setEditCatFields({
                        ...editCatFields,
                        subcategory: e.target.value,
                      })
                    }
                    className={selectClass}
                    data-ocid="edit-subcategory-select"
                  >
                    <option value="" className="bg-card text-muted-foreground">
                      Select a subcategory…
                    </option>
                    {editSubcategoryOptions.map((sub) => (
                      <option
                        key={sub}
                        value={sub}
                        className="bg-card text-foreground"
                      >
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                  Condition
                </p>
                <select
                  value={editCatFields.condition}
                  onChange={(e) =>
                    setEditCatFields({
                      ...editCatFields,
                      condition: e.target.value,
                    })
                  }
                  className={selectClass}
                  data-ocid="edit-condition-select"
                >
                  <option value="" className="bg-card text-muted-foreground">
                    Select condition…
                  </option>
                  {CONDITIONS.map((cond) => (
                    <option
                      key={cond}
                      value={cond}
                      className="bg-card text-foreground"
                    >
                      {cond}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                  Brand <span className="normal-case">(optional)</span>
                </p>
                <Input
                  value={editCatFields.brand}
                  onChange={(e) =>
                    setEditCatFields({
                      ...editCatFields,
                      brand: e.target.value,
                    })
                  }
                  placeholder="e.g. Samsung, Nike, Honda"
                  className="bg-input border-primary/50 focus:neon-border-blue transition-smooth"
                  data-ocid="edit-brand-input"
                />
              </div>

              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                  Type / Model <span className="normal-case">(optional)</span>
                </p>
                <Input
                  value={editCatFields.typeModel}
                  onChange={(e) =>
                    setEditCatFields({
                      ...editCatFields,
                      typeModel: e.target.value,
                    })
                  }
                  placeholder="e.g. Galaxy S24, Air Max 90"
                  className="bg-input border-primary/50 focus:neon-border-blue transition-smooth"
                  data-ocid="edit-type-model-input"
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Description
            </p>
            {isEditing ? (
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={7}
                className="bg-input border-primary/50 focus:neon-border-blue transition-smooth resize-y font-body text-sm leading-relaxed"
                placeholder="Listing description…"
                data-ocid="edit-description-input"
              />
            ) : (
              <p
                className="whitespace-pre-wrap font-body text-sm leading-relaxed text-foreground/90"
                data-ocid="listing-description"
              >
                {listing.description}
              </p>
            )}
          </div>

          {/* Source URL */}
          {listing.sourceUrl && (
            <div data-ocid="listing-source-url">
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">
                Source
              </p>
              <a
                href={listing.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 text-sm transition-smooth underline-offset-2 hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate max-w-xs min-w-0">
                  {listing.sourceUrl}
                </span>
              </a>
            </div>
          )}

          {/* Date */}
          <p
            className="font-mono text-xs text-muted-foreground"
            data-ocid="listing-date"
          >
            Created {formatDate(listing.createdAt)}
          </p>

          {!isEditing && (
            <>
              <div className="border-t border-border" />
              <CopyButtons
                title={listing.title}
                description={listing.description}
                price={listing.price}
              />
              <SmartPostButtons
                title={listing.title}
                description={listing.description}
                price={listing.price}
                category={catFields.category}
                condition={catFields.condition}
                brand={catFields.brand}
                images={images}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Edit Image Panel ───────────────────────────────────────────────────────────

interface EditImagePanelProps {
  images: Image[];
  pendingImages: PendingImage[];
  deletingImageId: bigint | null;
  atMaxImages: boolean;
  totalImages: number;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onDeleteImage: (img: Image) => void;
  onSetCover: (img: Image) => void;
  onAddFiles: (files: FileList | null) => void;
  onRemovePending: (id: string) => void;
}

function EditImagePanel({
  images,
  pendingImages,
  deletingImageId,
  atMaxImages,
  totalImages,
  fileInputRef,
  onDeleteImage,
  onSetCover,
  onAddFiles,
  onRemovePending,
}: EditImagePanelProps) {
  const [confirmDeleteImg, setConfirmDeleteImg] = useState<Image | null>(null);

  return (
    <div className="flex flex-col gap-4" data-ocid="edit-image-panel">
      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        Images{" "}
        <span className="text-primary/60 normal-case">
          ({totalImages}/{MAX_IMAGES})
        </span>
      </p>

      {/* Existing images grid */}
      {images.length > 0 && (
        <div
          className="grid grid-cols-3 gap-2"
          data-ocid="existing-images-grid"
        >
          {images.map((img, idx) => (
            <div
              key={img.id.toString()}
              className="relative group rounded-md overflow-hidden aspect-square bg-muted neon-border-blue"
              data-ocid={`existing-image-${idx}`}
            >
              <img
                src={img.blob.getDirectURL()}
                alt={img.altText || `Image ${idx + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Delete — desktop hover + always on mobile */}
              <button
                type="button"
                aria-label="Delete image"
                disabled={deletingImageId === img.id}
                onClick={() => setConfirmDeleteImg(img)}
                className="absolute top-1 right-1 w-7 h-7 rounded-full bg-destructive/90 text-destructive-foreground flex items-center justify-center shadow-lg transition-smooth hover:bg-destructive sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                style={{ touchAction: "manipulation" }}
                data-ocid={`delete-image-btn-${idx}`}
              >
                {deletingImageId === img.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <X className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Cover badge / Set as cover */}
              {idx === 0 ? (
                <span className="absolute bottom-1 left-1 rounded px-1.5 py-0.5 bg-primary/80 text-primary-foreground font-mono text-[9px] uppercase tracking-wider">
                  Cover
                </span>
              ) : (
                <button
                  type="button"
                  aria-label="Set as cover image"
                  onClick={() => onSetCover(img)}
                  className="absolute bottom-1 left-1 rounded px-1.5 py-0.5 bg-background/80 border border-primary/40 text-primary font-mono text-[9px] uppercase tracking-wider transition-smooth hover:border-primary flex items-center gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                  data-ocid={`set-cover-btn-${idx}`}
                >
                  <Star className="w-2.5 h-2.5" />
                  Cover
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pending new images */}
      {pendingImages.length > 0 && (
        <div className="grid grid-cols-3 gap-2" data-ocid="pending-images-grid">
          {pendingImages.map((p) => (
            <div
              key={p.id}
              className="relative group rounded-md overflow-hidden aspect-square bg-muted border-2 border-dashed border-primary/40"
            >
              <img
                src={p.preview}
                alt="Preview of new upload"
                className="w-full h-full object-cover"
              />
              {p.uploading ? (
                <div className="absolute inset-0 bg-background/70 flex flex-col items-center justify-center gap-1 p-2">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  {p.uploadProgress > 0 && (
                    <span className="font-mono text-xs text-primary">
                      {p.uploadProgress}%
                    </span>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  aria-label="Remove pending image"
                  onClick={() => onRemovePending(p.id)}
                  className="absolute top-1 right-1 w-7 h-7 rounded-full bg-destructive/90 text-destructive-foreground flex items-center justify-center"
                  data-ocid="remove-pending-image-btn"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <span className="absolute bottom-1 left-1 rounded px-1 py-0.5 bg-background/80 font-mono text-[9px] text-primary uppercase">
                New
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Add images zone */}
      {atMaxImages ? (
        <p
          className="font-mono text-xs text-muted-foreground text-center py-2"
          data-ocid="max-images-msg"
        >
          Maximum {MAX_IMAGES} images per listing.
        </p>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary/30 hover:border-primary/60 hover:bg-primary/5 py-5 transition-smooth"
          aria-label="Add more images"
          data-ocid="add-images-zone"
        >
          <ImagePlus className="w-5 h-5 text-primary/60" />
          <span className="font-mono text-xs uppercase tracking-wider text-primary/60">
            + Add More Images
          </span>
        </button>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.heic,image/*"
        multiple
        className="sr-only"
        onChange={(e) => {
          onAddFiles(e.target.files);
          e.target.value = "";
        }}
        data-ocid="add-images-input"
      />

      {/* Delete confirmation dialog */}
      {confirmDeleteImg && (
        <AlertDialog
          open
          onOpenChange={(open) => {
            if (!open) setConfirmDeleteImg(null);
          }}
        >
          <AlertDialogContent className="bg-card border-border">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-display text-lg">
                Delete this image?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="font-mono text-xs uppercase tracking-wider"
                onClick={() => setConfirmDeleteImg(null)}
                data-ocid="img-delete-cancel-btn"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/80 font-mono text-xs uppercase tracking-wider"
                onClick={() => {
                  onDeleteImage(confirmDeleteImg);
                  setConfirmDeleteImg(null);
                }}
                data-ocid="img-delete-confirm-btn"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

// ── Category display rows ──────────────────────────────────────────────────────

function ListingCategoryDisplay({ fields }: { fields: ListingCategoryFields }) {
  const rows: { label: string; value: string }[] = [];
  if (fields.category) rows.push({ label: "Category", value: fields.category });
  if (fields.subcategory)
    rows.push({ label: "Subcategory", value: fields.subcategory });
  if (fields.condition)
    rows.push({ label: "Condition", value: fields.condition });
  if (fields.brand) rows.push({ label: "Brand", value: fields.brand });
  if (rows.length === 0) return null;

  return (
    <div
      className="flex flex-col gap-1.5 rounded-lg border border-primary/20 bg-card/30 px-3 py-3"
      data-ocid="listing-category-details"
    >
      {rows.map(({ label, value }) => (
        <div key={label} className="flex items-baseline gap-2 min-w-0">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground shrink-0 w-20">
            {label}
          </span>
          <span className="font-body text-sm text-foreground/90 truncate min-w-0">
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-14 bg-card border-b border-border" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="w-full aspect-video rounded-lg" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
}

function NotFoundState({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <p className="font-display text-xl text-muted-foreground">
        Listing not found
      </p>
      <Button variant="outline" className="neon-border-blue" onClick={onBack}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>
    </div>
  );
}

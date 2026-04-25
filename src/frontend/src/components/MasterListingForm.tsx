import { useCreateMasterListing } from "@/hooks/useCreateMasterListing";
import { Loader2, Plus, Tag, Trash2, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

interface MasterListingFormProps {
  isOpen: boolean;
  onClose: () => void;
}

async function fileToUint8Array(file: File): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  return new Uint8Array(buffer);
}

const MAX_PHOTOS = 12;
const MAX_TAGS = 20;

export function MasterListingForm({ isOpen, onClose }: MasterListingFormProps) {
  const mutation = useCreateMasterListing();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const titleLen = title.length;
  const descLen = description.length;
  const canSubmit =
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    photos.length > 0 &&
    !mutation.isPending;

  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setPrice("");
    setCategory("");
    setTags([]);
    setTagInput("");
    for (const url of photoPreviews) URL.revokeObjectURL(url);
    setPhotos([]);
    setPhotoPreviews([]);
  }, [photoPreviews]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const addPhotos = (files: FileList | File[]) => {
    const incoming = Array.from(files).filter((f) =>
      f.type.startsWith("image/"),
    );
    const remaining = MAX_PHOTOS - photos.length;
    const toAdd = incoming.slice(0, remaining);
    if (toAdd.length === 0) return;

    const newPreviews = toAdd.map((f) => URL.createObjectURL(f));
    setPhotos((prev) => [...prev, ...toAdd]);
    setPhotoPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removePhoto = (idx: number) => {
    URL.revokeObjectURL(photoPreviews[idx]);
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addPhotos(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) addPhotos(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const addTag = () => {
    const t = tagInput.trim();
    if (!t || tags.includes(t) || tags.length >= MAX_TAGS) return;
    setTags((prev) => [...prev, t]);
    setTagInput("");
  };

  const removeTag = (idx: number) => {
    setTags((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    const photoBytes = await Promise.all(photos.map(fileToUint8Array));

    mutation.mutate(
      {
        title: title.trim(),
        description: description.trim(),
        price: price.trim() || null,
        category: category.trim() || null,
        tags,
        photos: photoBytes,
      },
      {
        onSuccess: () => {
          toast.success("Master listing created!", {
            description:
              "Use the Edit Draft buttons to prepare platform-specific versions.",
          });
          resetForm();
          onClose();
        },
      },
    );
  };

  if (!isOpen) return null;

  // ── Counter colour helpers ──────────────────────────────────────────────────
  const titleCounterClass =
    titleLen >= 200
      ? "text-destructive font-semibold"
      : titleLen >= 180
        ? "text-yellow-400"
        : "text-muted-foreground";

  const descCounterClass =
    descLen >= 5000
      ? "text-destructive font-semibold"
      : descLen >= 4500
        ? "text-yellow-400"
        : "text-muted-foreground";

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      data-ocid="master_listing_form.dialog"
    >
      <dialog
        open
        className="bg-card border border-primary/30 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl p-0"
        aria-labelledby="ml-dialog-title"
      >
        {/* ── Sticky Header ──────────────────────────────────────────────── */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-card border-b border-primary/20 rounded-t-xl">
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">
              📋
            </span>
            <div>
              <h2
                id="ml-dialog-title"
                className="font-display text-base font-bold text-primary tracking-wide"
              >
                Create Master Listing
              </h2>
              <p className="text-xs text-muted-foreground">
                One source of truth — prepare drafts per platform after
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close dialog"
            data-ocid="master_listing_form.close_button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Scrollable Body ─────────────────────────────────────────────── */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="ml-title"
                className="text-xs font-semibold text-foreground/80 uppercase tracking-widest"
              >
                Title <span className="text-destructive">*</span>
              </label>
              <span className={`text-xs tabular-nums ${titleCounterClass}`}>
                {titleLen}/200
              </span>
            </div>
            <input
              id="ml-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              placeholder="What are you selling?"
              className="w-full px-3 py-2.5 rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/60 transition-colors"
              data-ocid="master_listing_form.title.input"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="ml-desc"
                className="text-xs font-semibold text-foreground/80 uppercase tracking-widest"
              >
                Description <span className="text-destructive">*</span>
              </label>
              <span className={`text-xs tabular-nums ${descCounterClass}`}>
                {descLen}/5000
              </span>
            </div>
            <textarea
              id="ml-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={5000}
              rows={5}
              placeholder="Describe your item in detail…"
              className="w-full px-3 py-2.5 rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/60 transition-colors"
              data-ocid="master_listing_form.description.textarea"
            />
          </div>

          {/* Price + Category */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label
                htmlFor="ml-price"
                className="text-xs font-semibold text-foreground/80 uppercase tracking-widest"
              >
                Price
              </label>
              <input
                id="ml-price"
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="$0.00"
                className="w-full px-3 py-2.5 rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/60 transition-colors"
                data-ocid="master_listing_form.price.input"
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="ml-category"
                className="text-xs font-semibold text-foreground/80 uppercase tracking-widest"
              >
                Category
              </label>
              <input
                id="ml-category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Electronics, Clothing…"
                className="w-full px-3 py-2.5 rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/60 transition-colors"
                data-ocid="master_listing_form.category.input"
              />
            </div>
          </div>

          {/* Photos */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground/80 uppercase tracking-widest">
                📷 Photos <span className="text-destructive">*</span>
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {photos.length}/{MAX_PHOTOS}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {photoPreviews.map((url, idx) => (
                <div
                  key={`photo-${idx}-${photos[idx]?.name ?? idx}`}
                  className="relative aspect-square rounded-lg overflow-hidden bg-muted group"
                  data-ocid={`master_listing_form.photo.item.${idx + 1}`}
                >
                  <img
                    src={url}
                    alt={`Listing item ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Remove item ${idx + 1}`}
                    data-ocid={`master_listing_form.photo.delete_button.${idx + 1}`}
                  >
                    <Trash2 className="h-5 w-5 text-destructive" />
                  </button>
                </div>
              ))}

              {photos.length < MAX_PHOTOS && (
                <button
                  type="button"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Add photos"
                  className={`aspect-square rounded-lg border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-1.5 transition-colors select-none ${
                    isDragging
                      ? "border-primary bg-primary/10"
                      : "border-border/50 hover:border-primary/50 hover:bg-primary/5"
                  }`}
                  data-ocid="master_listing_form.photo.upload_button"
                >
                  <Upload
                    className="h-5 w-5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="text-[10px] text-muted-foreground text-center leading-tight px-1">
                    Click or drop
                  </span>
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              aria-label="Upload photos"
              id="ml-photo-input"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Tag
                className="h-3.5 w-3.5 text-foreground/80"
                aria-hidden="true"
              />
              <label
                htmlFor="ml-tag-input"
                className="text-xs font-semibold text-foreground/80 uppercase tracking-widest"
              >
                Tags
              </label>
              <span className="text-muted-foreground text-xs font-normal normal-case">
                (search keywords)
              </span>
            </div>
            <div className="flex gap-2">
              <input
                id="ml-tag-input"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add a keyword…"
                className="flex-1 px-3 py-2 rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/60 transition-colors"
                data-ocid="master_listing_form.tag.input"
              />
              <button
                type="button"
                onClick={addTag}
                disabled={!tagInput.trim() || tags.length >= MAX_TAGS}
                className="px-3 py-2 rounded-lg bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Add tag"
                data-ocid="master_listing_form.tag.add_button"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag, idx) => (
                  <span
                    key={`tag-${tag}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-medium"
                    data-ocid={`master_listing_form.tag.item.${idx + 1}`}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(idx)}
                      className="hover:text-destructive transition-colors leading-none"
                      aria-label={`Remove tag ${tag}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Info Banner */}
          <div className="flex gap-3 p-3 rounded-lg bg-primary/[0.08] border border-primary/20 text-xs text-primary/80">
            <span className="text-base shrink-0" aria-hidden="true">
              💡
            </span>
            <p>
              After creating your listing, use the{" "}
              <strong className="text-primary">Edit Draft</strong> buttons to
              prepare platform-specific versions for Facebook, Mercari, eBay,
              and more.
            </p>
          </div>
        </div>

        {/* ── Footer / Actions ────────────────────────────────────────────── */}
        <div className="sticky bottom-0 bg-card border-t border-border/30 px-6 py-4 rounded-b-xl flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 rounded-lg bg-muted/60 hover:bg-muted text-foreground text-sm font-medium transition-colors"
            data-ocid="master_listing_form.cancel_button"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex-1 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground text-sm font-semibold font-display tracking-wide transition-colors flex items-center justify-center gap-2"
            data-ocid="master_listing_form.submit_button"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Creating…
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Create Master Listing
              </>
            )}
          </button>
        </div>
      </dialog>
    </div>
  );
}

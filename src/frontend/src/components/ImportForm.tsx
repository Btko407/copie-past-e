import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAdminSettingsContext } from "@/hooks/useAdminSettings";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { CreateListingArgs, Listing } from "../backend.d.ts";
import {
  CATEGORIES,
  CONDITIONS,
  type ListingCategoryFields,
  SUBCATEGORY_MAP,
  encodeCategory,
} from "../constants/categories";
import {
  type UploadableFile,
  useCreateListing,
} from "../hooks/useCreateListing";
import type { PhotoOCRResult } from "../hooks/usePhotoOCR";
import { usePhotoOCR } from "../hooks/usePhotoOCR";
import { useSmartPaste } from "../hooks/useSmartPasteLocal";
import { ImageUploadZone } from "./ImageUploadZone";
import { CarAnimation } from "./animations/CarAnimation";
import { ClockAnimation } from "./animations/ClockAnimation";
import { LightningAnimation } from "./animations/LightningAnimation";

interface ManualFormValues {
  title: string;
  description: string;
  price: string;
  sourceUrl: string;
  category: string;
}

type AnimationStep = "idle" | "lightning" | "clock" | "car" | "saving";
type ActiveTab = "photo" | "smartpaste" | "manual";

interface ImportFormProps {
  onCancel: () => void;
}

// ── Shared sub-components ──────────────────────────────────────────────────────

function PanelHeader({ label, icon }: { label: string; icon: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-lg">{icon}</span>
      <h2 className="font-display text-sm tracking-widest uppercase text-foreground">
        {label}
      </h2>
    </div>
  );
}

/** Highlight label with red/orange ring when field was unparsed */
function FieldLabel({
  htmlFor,
  children,
  missing,
}: {
  htmlFor: string;
  children: React.ReactNode;
  missing?: boolean;
}) {
  return (
    <Label
      htmlFor={htmlFor}
      className="font-display text-xs tracking-widest uppercase text-muted-foreground flex items-center gap-2"
    >
      {children}
      {missing && (
        <span className="text-[10px] font-mono text-destructive tracking-normal normal-case font-normal">
          ← fill in manually
        </span>
      )}
    </Label>
  );
}

// ── Category + Subcategory + Condition + Brand + Type/Model group ──────────────

interface CategoryFieldsProps {
  fields: ListingCategoryFields;
  onChange: (fields: ListingCategoryFields) => void;
  /** Show missing indicator on category if not selected */
  showMissing?: boolean;
  idPrefix: string;
}

function CategoryFields({
  fields,
  onChange,
  showMissing,
  idPrefix,
}: CategoryFieldsProps) {
  const subcategoryOptions = fields.category
    ? (SUBCATEGORY_MAP[fields.category] ?? [])
    : [];
  const catMissing = showMissing && !fields.category;
  const condMissing = showMissing && !fields.condition;

  function set<K extends keyof ListingCategoryFields>(key: K, val: string) {
    if (key === "category") {
      // reset subcategory when category changes
      onChange({ ...fields, category: val, subcategory: "" });
    } else {
      onChange({ ...fields, [key]: val });
    }
  }

  const selectClass = (missing?: boolean) =>
    `w-full h-10 rounded-md px-3 text-sm bg-card/50 border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary transition-smooth appearance-none cursor-pointer ${
      missing
        ? "border-destructive/70 ring-1 ring-destructive/40"
        : "border-primary/40"
    }`;

  return (
    <div className="flex flex-col gap-3">
      {/* 1. Category */}
      <div className="space-y-1.5">
        <FieldLabel htmlFor={`${idPrefix}-category`} missing={catMissing}>
          Category <span className="text-accent">*</span>
        </FieldLabel>
        <select
          id={`${idPrefix}-category`}
          value={fields.category}
          onChange={(e) => set("category", e.target.value)}
          required
          data-ocid={`${idPrefix}-select-category`}
          className={selectClass(catMissing)}
        >
          <option value="" disabled className="bg-card text-muted-foreground">
            Select a category…
          </option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat} className="bg-card text-foreground">
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Subcategory — only visible once category chosen */}
      {fields.category && (
        <div className="space-y-1.5">
          <FieldLabel htmlFor={`${idPrefix}-subcategory`}>
            Subcategory{" "}
            <span className="text-muted-foreground/60">(optional)</span>
          </FieldLabel>
          <select
            id={`${idPrefix}-subcategory`}
            value={fields.subcategory}
            onChange={(e) => set("subcategory", e.target.value)}
            data-ocid={`${idPrefix}-select-subcategory`}
            className={selectClass(false)}
          >
            <option value="" className="bg-card text-muted-foreground">
              Select a subcategory…
            </option>
            {subcategoryOptions.map((sub) => (
              <option key={sub} value={sub} className="bg-card text-foreground">
                {sub}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 3. Condition */}
      <div className="space-y-1.5">
        <FieldLabel htmlFor={`${idPrefix}-condition`} missing={condMissing}>
          Condition <span className="text-accent">*</span>
        </FieldLabel>
        <select
          id={`${idPrefix}-condition`}
          value={fields.condition}
          onChange={(e) => set("condition", e.target.value)}
          required
          data-ocid={`${idPrefix}-select-condition`}
          className={selectClass(condMissing)}
        >
          <option value="" disabled className="bg-card text-muted-foreground">
            Select condition…
          </option>
          {CONDITIONS.map((cond) => (
            <option key={cond} value={cond} className="bg-card text-foreground">
              {cond}
            </option>
          ))}
        </select>
      </div>

      {/* 4. Brand */}
      <div className="space-y-1.5">
        <FieldLabel htmlFor={`${idPrefix}-brand`}>
          Brand <span className="text-muted-foreground/60">(optional)</span>
        </FieldLabel>
        <Input
          id={`${idPrefix}-brand`}
          placeholder="e.g. Samsung, Nike, Honda"
          value={fields.brand}
          onChange={(e) => set("brand", e.target.value)}
          className="neon-border-blue bg-card/50 focus:glow-blue-sm transition-smooth"
          data-ocid={`${idPrefix}-input-brand`}
        />
      </div>

      {/* 5. Type / Model */}
      <div className="space-y-1.5">
        <FieldLabel htmlFor={`${idPrefix}-typeModel`}>
          Type / Model{" "}
          <span className="text-muted-foreground/60">(optional)</span>
        </FieldLabel>
        <Input
          id={`${idPrefix}-typeModel`}
          placeholder="e.g. Galaxy S24, Air Max 90"
          value={fields.typeModel}
          onChange={(e) => set("typeModel", e.target.value)}
          className="neon-border-blue bg-card/50 focus:glow-blue-sm transition-smooth"
          data-ocid={`${idPrefix}-input-type-model`}
        />
      </div>
    </div>
  );
}

// ── Photo upload drop zone ─────────────────────────────────────────────────────

interface PhotoDropZoneProps {
  file: File | null;
  preview: string | null;
  onFile: (f: File) => void;
}

function PhotoDropZone({ file, preview, onFile }: PhotoDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) onFile(dropped);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0];
    if (picked) onFile(picked);
  }

  return (
    <button
      type="button"
      aria-label="Upload screenshot"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      data-ocid="photo-drop-zone"
      className={`relative rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-smooth overflow-hidden min-h-[160px] w-full text-left ${
        dragging
          ? "border-primary bg-primary/10 glow-blue-sm"
          : preview
            ? "border-primary/50 bg-card/30"
            : "border-primary/30 bg-card/20 hover:border-primary/60 hover:bg-card/40"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf,.heic,.heif"
        className="sr-only"
        onChange={handleChange}
        data-ocid="photo-file-input"
      />

      {preview ? (
        <>
          <img
            src={preview}
            alt="Upload preview"
            className="w-full h-full object-contain max-h-64 rounded-lg"
          />
          <div className="absolute inset-0 bg-card/60 opacity-0 hover:opacity-100 transition-smooth flex items-center justify-center rounded-lg">
            <span className="text-xs font-display tracking-widest uppercase text-primary text-glow-blue">
              Change Image
            </span>
          </div>
          <div className="absolute bottom-2 left-2 right-2">
            <p className="text-[10px] font-mono text-muted-foreground truncate text-center bg-card/80 rounded px-2 py-1">
              {file?.name}
            </p>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 px-6 py-8 text-center pointer-events-none">
          <div className="w-12 h-12 rounded-full border border-primary/40 bg-primary/10 flex items-center justify-center">
            <span className="text-2xl">📸</span>
          </div>
          <p className="font-display text-xs tracking-widest uppercase text-primary text-glow-blue">
            Take a screenshot of your listing and upload it here
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
            Go to your listing, take a screenshot, then upload it here.
          </p>
          <p className="text-[10px] font-mono text-muted-foreground/50">
            Supports JPG, PNG, WebP, HEIC, PDF · Drag & drop or click
          </p>
        </div>
      )}
    </button>
  );
}

// ── ParsedPreview — shared between Photo and SmartPaste results ───────────────

interface ParsedPreviewProps {
  title: string;
  onTitle: (v: string) => void;
  price: string;
  onPrice: (v: string) => void;
  catFields: ListingCategoryFields;
  onCatFields: (f: ListingCategoryFields) => void;
  description: string;
  onDescription: (v: string) => void;
  files: UploadableFile[];
  onFiles: (f: UploadableFile[]) => void;
  progressMap: Record<string, number>;
  uploadEnabled: boolean;
  isBusy: boolean;
  animStep: AnimationStep;
  onSave: () => void;
  onBack: () => void;
  backLabel?: string;
  successBadge: React.ReactNode;
  idPrefix: string;
}

function ParsedPreview({
  title,
  onTitle,
  price,
  onPrice,
  catFields,
  onCatFields,
  description,
  onDescription,
  files,
  onFiles,
  progressMap,
  uploadEnabled,
  isBusy,
  animStep,
  onSave,
  onBack,
  backLabel = "Re-paste",
  successBadge,
  idPrefix,
}: ParsedPreviewProps) {
  const titleMissing = !title.trim();
  const descMissing = !description.trim();

  return (
    <motion.div
      className="flex flex-col gap-4"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      data-ocid="parsed-preview"
    >
      {successBadge}

      {/* Title */}
      <div className="space-y-1.5">
        <FieldLabel
          htmlFor={`${idPrefix}-preview-title`}
          missing={titleMissing}
        >
          Title <span className="text-accent">*</span>
        </FieldLabel>
        <Input
          id={`${idPrefix}-preview-title`}
          placeholder="Enter title…"
          value={title}
          onChange={(e) => onTitle(e.target.value)}
          className={`neon-border-blue bg-card/50 focus:glow-blue-sm transition-smooth ${
            titleMissing
              ? "border-destructive/70 ring-1 ring-destructive/30"
              : ""
          }`}
          data-ocid={`${idPrefix}-preview-input-title`}
        />
      </div>

      {/* Price */}
      <div className="space-y-1.5">
        <FieldLabel htmlFor={`${idPrefix}-preview-price`}>
          Price <span className="text-muted-foreground/60">(optional)</span>
        </FieldLabel>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm pointer-events-none">
            $
          </span>
          <Input
            id={`${idPrefix}-preview-price`}
            placeholder="0.00"
            value={price.replace(/^\$/, "")}
            onChange={(e) =>
              onPrice(
                e.target.value
                  .replace(/^\$/, "")
                  .replace(/[^0-9.,A-Za-z\s]/g, ""),
              )
            }
            className="neon-border-blue bg-card/50 focus:glow-blue-sm transition-smooth pl-7"
            data-ocid={`${idPrefix}-preview-input-price`}
          />
        </div>
      </div>

      {/* Category / Subcategory / Condition / Brand / Type */}
      <CategoryFields
        fields={catFields}
        onChange={onCatFields}
        showMissing={true}
        idPrefix={`${idPrefix}-preview`}
      />

      {/* Description */}
      <div className="space-y-1.5">
        <FieldLabel
          htmlFor={`${idPrefix}-preview-description`}
          missing={descMissing}
        >
          Description <span className="text-accent">*</span>
        </FieldLabel>
        <Textarea
          id={`${idPrefix}-preview-description`}
          placeholder="Enter description…"
          rows={5}
          value={description}
          onChange={(e) => onDescription(e.target.value)}
          className={`bg-card/50 focus:glow-blue-sm transition-smooth resize-none text-sm ${
            descMissing
              ? "border border-destructive/70 ring-1 ring-destructive/30"
              : "neon-border-blue"
          }`}
          data-ocid={`${idPrefix}-preview-input-description`}
        />
      </div>

      {/* Images */}
      {uploadEnabled && (
        <div className="space-y-1.5">
          <Label className="font-display text-xs tracking-widest uppercase text-muted-foreground">
            Images <span className="text-muted-foreground/60">(optional)</span>
          </Label>
          <ImageUploadZone
            files={files}
            onChange={onFiles}
            progressMap={progressMap}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <Button
          type="button"
          onClick={onSave}
          disabled={isBusy || !title.trim()}
          data-ocid={`${idPrefix}-btn-save-preview`}
          className="flex-1 font-display text-sm py-5 tracking-widest uppercase glow-yellow bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth"
          style={{
            boxShadow:
              "0 0 16px oklch(0.88 0.19 84 / 0.4), 0 0 32px oklch(0.88 0.19 84 / 0.15)",
          }}
        >
          {animStep === "saving" ? (
            <span className="animate-pulse">Saving to timeline…</span>
          ) : (
            "Save Listing"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isBusy}
          data-ocid={`${idPrefix}-btn-back-from-preview`}
          className="px-4 neon-border-blue transition-smooth text-xs font-display tracking-wider uppercase"
        >
          {backLabel}
        </Button>
      </div>
    </motion.div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function emptyFields(): ListingCategoryFields {
  return {
    category: "",
    subcategory: "",
    condition: "",
    brand: "",
    typeModel: "",
  };
}

// ── Main ImportForm ────────────────────────────────────────────────────────────

export function ImportForm({ onCancel }: ImportFormProps) {
  const navigate = useNavigate();
  const [files, setFiles] = useState<UploadableFile[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [animStep, setAnimStep] = useState<AnimationStep>("idle");
  const [activeTab, setActiveTab] = useState<ActiveTab>("photo");

  // ── Smart Photo state ──────────────────────────────────────────────────────
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoShowPreview, setPhotoShowPreview] = useState(false);
  const [photoTitle, setPhotoTitle] = useState("");
  const [photoPrice, setPhotoPrice] = useState("");
  const [photoCatFields, setPhotoCatFields] = useState<ListingCategoryFields>(
    emptyFields(),
  );
  const [photoDescription, setPhotoDescription] = useState("");
  const [photoOCRError, setPhotoOCRError] = useState<string | null>(null);

  // ── Smart Paste state ──────────────────────────────────────────────────────
  const [pasteText, setPasteText] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewPrice, setPreviewPrice] = useState("");
  const [previewCatFields, setPreviewCatFields] =
    useState<ListingCategoryFields>(emptyFields());
  const [previewDescription, setPreviewDescription] = useState("");

  // ── Manual form state ──────────────────────────────────────────────────────
  const [manualPriceDisplay, setManualPriceDisplay] = useState("");
  const [manualCatFields, setManualCatFields] = useState<ListingCategoryFields>(
    emptyFields(),
  );

  const { uploadEnabled } = useAdminSettingsContext();
  const { mutateAsync: createListingWithImages, isPending } =
    useCreateListing();
  const { parse: parseText, isLoading: isParsing } = useSmartPaste();
  const {
    extractFromImage,
    isProcessing: isOCRProcessing,
    reset: resetOCR,
  } = usePhotoOCR();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ManualFormValues>({
    defaultValues: {
      title: "",
      description: "",
      price: "",
      sourceUrl: "",
      category: "",
    },
  });

  function handleManualPriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/^\$/, "").replace(/[^0-9.,]/g, "");
    setManualPriceDisplay(raw);
  }

  function handlePhotoFileSelect(f: File) {
    setPhotoFile(f);
    setPhotoPreview(URL.createObjectURL(f));
    setPhotoShowPreview(false);
    setPhotoOCRError(null);
    resetOCR();
  }

  const runAnimationSequence = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      setAnimStep("lightning");
      setTimeout(() => {
        setAnimStep("clock");
        setTimeout(() => {
          setAnimStep("car");
          setTimeout(() => {
            setAnimStep("saving");
            resolve();
          }, 600);
        }, 800);
      }, 400);
    });
  }, []);

  // ── Smart Photo: run OCR ────────────────────────────────────────────────────
  async function handlePhotoOCR() {
    if (!photoFile) return;

    setPhotoOCRError(null);
    // Play lightning → clock → idle animation sequence
    setAnimStep("lightning");
    setTimeout(() => setAnimStep("clock"), 400);
    setTimeout(() => setAnimStep("idle"), 1100);

    const result: PhotoOCRResult = await extractFromImage(photoFile);

    if (result.error) {
      // extractFromImage returned an error — show the actual message from backend
      setPhotoOCRError(result.error);
      toast.error(result.error);
      return;
    }

    // Inject all extracted fields into form state — triggers re-render so the
    // user sees the form fill in immediately.
    setPhotoTitle(result.title ?? "");
    setPhotoPrice(result.price ?? "");
    setPhotoCatFields({
      ...emptyFields(),
      category: result.category ?? "",
      condition: result.condition ?? "",
      brand: result.brand ?? "",
    });
    setPhotoDescription(result.description ?? "");

    // Switch to the preview/form view
    setPhotoShowPreview(true);

    toast.success("Listing data extracted! Review and save.");
  }

  // ── Smart Photo: save ───────────────────────────────────────────────────────
  async function handleSavePhotoPreview() {
    await runAnimationSequence();
    const listingArgs: CreateListingArgs = {
      title: photoTitle,
      description: photoDescription,
      price: photoPrice ? `$${photoPrice.replace(/^\$/, "")}` : undefined,
      sourceUrl: undefined,
      category: encodeCategory(photoCatFields) || undefined,
    };
    const onImageProgress = (fileId: string, progress: number) =>
      setProgressMap((prev) => ({ ...prev, [fileId]: progress }));
    try {
      const created: Listing = await createListingWithImages({
        listing: listingArgs,
        files,
        onImageProgress,
      });
      setAnimStep("idle");
      await navigate({ to: `/listing/${created.id.toString()}` });
    } catch {
      setAnimStep("idle");
    }
  }

  // ── Smart Paste: parse and show preview ────────────────────────────────────
  async function handleSmartPaste() {
    if (!pasteText.trim()) return;
    setAnimStep("lightning");
    setTimeout(() => setAnimStep("clock"), 400);
    setTimeout(() => setAnimStep("idle"), 1100);
    const result = await parseText(pasteText);
    setPreviewTitle(result.title ?? "");
    setPreviewPrice(result.price ?? "");
    setPreviewCatFields({ ...emptyFields(), category: result.category ?? "" });
    setPreviewDescription(result.description ?? "");
    setShowPreview(true);
  }

  // ── Smart Paste: save preview ───────────────────────────────────────────────
  async function handleSavePreview() {
    await runAnimationSequence();
    const listingArgs: CreateListingArgs = {
      title: previewTitle,
      description: previewDescription,
      price: previewPrice ? `$${previewPrice.replace(/^\$/, "")}` : undefined,
      sourceUrl: undefined,
      category: encodeCategory(previewCatFields) || undefined,
    };
    const onImageProgress = (fileId: string, progress: number) =>
      setProgressMap((prev) => ({ ...prev, [fileId]: progress }));
    try {
      const created: Listing = await createListingWithImages({
        listing: listingArgs,
        files,
        onImageProgress,
      });
      setAnimStep("idle");
      await navigate({ to: `/listing/${created.id.toString()}` });
    } catch {
      setAnimStep("idle");
    }
  }

  // ── Manual Entry: submit ───────────────────────────────────────────────────
  const onManualSubmit = useCallback(
    async (values: ManualFormValues) => {
      await runAnimationSequence();
      const listingArgs: CreateListingArgs = {
        title: values.title,
        description: values.description,
        price: manualPriceDisplay ? `$${manualPriceDisplay}` : undefined,
        sourceUrl: values.sourceUrl || undefined,
        category: encodeCategory(manualCatFields) || undefined,
      };
      const onImageProgress = (fileId: string, progress: number) =>
        setProgressMap((prev) => ({ ...prev, [fileId]: progress }));
      try {
        const created: Listing = await createListingWithImages({
          listing: listingArgs,
          files,
          onImageProgress,
        });
        setAnimStep("idle");
        await navigate({ to: `/listing/${created.id.toString()}` });
      } catch {
        setAnimStep("idle");
      }
    },
    [
      runAnimationSequence,
      createListingWithImages,
      files,
      navigate,
      manualPriceDisplay,
      manualCatFields,
    ],
  );

  const isBusy =
    isPending || animStep !== "idle" || isParsing || isOCRProcessing;

  // ── Tab bar config ─────────────────────────────────────────────────────────
  const tabs: { id: ActiveTab; label: string; icon: string }[] = [
    { id: "photo", label: "Smart Photo", icon: "📸" },
    { id: "smartpaste", label: "Smart Text", icon: "⚡" },
    { id: "manual", label: "Manual Entry", icon: "✏️" },
  ];

  return (
    <>
      {/* Animation overlays */}
      <AnimatePresence>
        {animStep === "lightning" && <LightningAnimation active />}
      </AnimatePresence>
      <AnimatePresence>
        {animStep === "clock" && <ClockAnimation active />}
      </AnimatePresence>
      <AnimatePresence>
        {animStep === "car" && <CarAnimation active />}
      </AnimatePresence>

      {/* ── Three-tab selector ─────────────────────────────────────────────── */}
      <div
        className="flex rounded-lg overflow-hidden border border-primary/20 mb-5"
        role="tablist"
        aria-label="Import method"
        data-ocid="import-tab-bar"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            data-ocid={`tab-${tab.id}`}
            className={`flex-1 py-2.5 sm:py-3 text-xs font-display tracking-widest uppercase transition-smooth flex items-center justify-center gap-1.5 border-r border-primary/10 last:border-r-0 ${
              activeTab === tab.id
                ? "bg-primary/20 text-primary text-glow-blue"
                : "bg-card/30 text-muted-foreground hover:bg-card/60 hover:text-foreground"
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden xs:inline sm:inline">{tab.label}</span>
            <span className="xs:hidden sm:hidden">
              {tab.id === "photo"
                ? "Photo"
                : tab.id === "smartpaste"
                  ? "Text"
                  : "Manual"}
            </span>
          </button>
        ))}
      </div>

      {/* ── Tab panels ─────────────────────────────────────────────────────── */}
      <div data-ocid="import-form">
        {/* ════════════════════════════════════════════════════════════════════
            TAB A — SMART PHOTO
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "photo" && (
          <motion.div
            key="tab-photo"
            className="rounded-xl border border-primary/30 bg-card/60 p-5 flex flex-col gap-4"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            data-ocid="panel-photo"
          >
            <PanelHeader label="Smart Photo" icon="📸" />

            {!photoShowPreview ? (
              <>
                <p className="text-muted-foreground text-xs leading-relaxed -mt-1">
                  Go to your listing, take a screenshot, then upload it here.
                  Our AI will extract the title, price, description, and
                  category for you.
                </p>

                {/* Drop zone */}
                <PhotoDropZone
                  file={photoFile}
                  preview={photoPreview}
                  onFile={handlePhotoFileSelect}
                />

                {/* OCR error */}
                {photoOCRError && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2"
                  >
                    <span className="text-destructive text-sm mt-0.5">⚠</span>
                    <p className="text-destructive text-xs leading-relaxed">
                      {photoOCRError}
                    </p>
                  </motion.div>
                )}

                {/* CTA */}
                <Button
                  type="button"
                  onClick={handlePhotoOCR}
                  disabled={isBusy || !photoFile}
                  data-ocid="btn-photo-ocr"
                  className="w-full font-display text-sm py-5 tracking-widest uppercase glow-yellow bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth border-accent/70 shadow-lg"
                  style={{
                    boxShadow:
                      "0 0 20px oklch(0.88 0.19 84 / 0.5), 0 0 40px oklch(0.88 0.19 84 / 0.2)",
                  }}
                >
                  {isOCRProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin text-base">⚙</span>
                      Reading image…
                    </span>
                  ) : (
                    "⚡ Copy Past-e"
                  )}
                </Button>

                {!photoFile && (
                  <p className="text-center text-[10px] font-mono text-muted-foreground/50">
                    Upload a screenshot first
                  </p>
                )}
              </>
            ) : (
              <ParsedPreview
                title={photoTitle}
                onTitle={setPhotoTitle}
                price={photoPrice}
                onPrice={setPhotoPrice}
                catFields={photoCatFields}
                onCatFields={setPhotoCatFields}
                description={photoDescription}
                onDescription={setPhotoDescription}
                files={files}
                onFiles={setFiles}
                progressMap={progressMap}
                uploadEnabled={uploadEnabled}
                isBusy={isBusy}
                animStep={animStep}
                onSave={handleSavePhotoPreview}
                onBack={() => {
                  setPhotoShowPreview(false);
                  setPhotoFile(null);
                  setPhotoPreview(null);
                }}
                backLabel="New Photo"
                idPrefix="photo"
                successBadge={
                  <div className="flex items-center gap-2 rounded-md bg-accent/10 border border-accent/30 px-3 py-2">
                    <span className="text-accent text-sm">✓</span>
                    <p className="text-accent text-xs font-display tracking-wide">
                      Image scanned — review and edit, then save.
                      {(!photoTitle ||
                        !photoDescription ||
                        !photoCatFields.category) && (
                        <span className="text-destructive ml-2">
                          Fields with red borders need your input.
                        </span>
                      )}
                    </p>
                  </div>
                }
              />
            )}
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            TAB B — SMART TEXT PASTE
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "smartpaste" && (
          <motion.div
            key="tab-smartpaste"
            className="rounded-xl border border-primary/30 bg-card/60 p-5 flex flex-col gap-4"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            data-ocid="panel-smartpaste"
          >
            <PanelHeader label="Smart Text Paste" icon="⚡" />

            {!showPreview ? (
              <>
                <p className="text-muted-foreground text-xs leading-relaxed -mt-1">
                  Go to your listing, select all text, copy, then paste it here.
                </p>

                <div className="space-y-2">
                  <Label
                    htmlFor="pasteText"
                    className="font-display text-xs tracking-widest uppercase text-muted-foreground"
                  >
                    Paste Listing Text
                  </Label>
                  <Textarea
                    id="pasteText"
                    placeholder="Paste the full listing text you copied from Facebook Marketplace, OfferUp, or anywhere else…"
                    rows={8}
                    value={pasteText}
                    onChange={(e) => setPasteText(e.target.value)}
                    className="neon-border-blue bg-card/40 focus:glow-blue-sm transition-smooth resize-none text-sm"
                    data-ocid="input-paste-text"
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleSmartPaste}
                  disabled={isBusy || !pasteText.trim()}
                  data-ocid="btn-smart-paste"
                  className="w-full font-display text-sm py-5 tracking-widest uppercase glow-yellow bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth border-accent/70 shadow-lg"
                  style={{
                    boxShadow:
                      "0 0 20px oklch(0.88 0.19 84 / 0.5), 0 0 40px oklch(0.88 0.19 84 / 0.2)",
                  }}
                >
                  {isParsing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin text-base">⚙</span>
                      Parsing…
                    </span>
                  ) : (
                    "⚡ Copy Past-e"
                  )}
                </Button>
              </>
            ) : (
              <ParsedPreview
                title={previewTitle}
                onTitle={setPreviewTitle}
                price={previewPrice}
                onPrice={setPreviewPrice}
                catFields={previewCatFields}
                onCatFields={setPreviewCatFields}
                description={previewDescription}
                onDescription={setPreviewDescription}
                files={files}
                onFiles={setFiles}
                progressMap={progressMap}
                uploadEnabled={uploadEnabled}
                isBusy={isBusy}
                animStep={animStep}
                onSave={handleSavePreview}
                onBack={() => {
                  setShowPreview(false);
                  setPasteText("");
                }}
                backLabel="Re-paste"
                idPrefix="paste"
                successBadge={
                  <div className="flex items-center gap-2 rounded-md bg-accent/10 border border-accent/30 px-3 py-2">
                    <span className="text-accent text-sm">✓</span>
                    <p className="text-accent text-xs font-display tracking-wide">
                      Listing parsed — review and edit, then save.
                    </p>
                  </div>
                }
              />
            )}
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            TAB C — MANUAL ENTRY
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === "manual" && (
          <motion.div
            key="tab-manual"
            className="rounded-xl border border-border/40 bg-card/40 p-5 flex flex-col gap-4"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            data-ocid="panel-manual"
          >
            <PanelHeader label="Manual Entry" icon="✏️" />

            <form
              onSubmit={handleSubmit(onManualSubmit)}
              className="flex flex-col gap-4"
              noValidate
              data-ocid="manual-entry-form"
            >
              {/* Title */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="manual-title"
                  className="font-display text-xs tracking-widest uppercase text-muted-foreground"
                >
                  Title <span className="text-accent">*</span>
                </Label>
                <Input
                  id="manual-title"
                  placeholder="e.g. Vintage 1982 DeLorean — Low Miles"
                  className="neon-border-blue bg-card/50 focus:glow-blue-sm transition-smooth"
                  data-ocid="manual-input-title"
                  {...register("title", {
                    required: "Title is required",
                    minLength: {
                      value: 3,
                      message: "Title must be at least 3 characters",
                    },
                  })}
                />
                {errors.title && (
                  <p className="text-destructive text-xs" role="alert">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Category / Subcategory / Condition / Brand / Type */}
              <CategoryFields
                fields={manualCatFields}
                onChange={setManualCatFields}
                idPrefix="manual"
              />

              {/* Description */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="manual-description"
                  className="font-display text-xs tracking-widest uppercase text-muted-foreground"
                >
                  Description <span className="text-accent">*</span>
                </Label>
                <Textarea
                  id="manual-description"
                  placeholder="Full listing description…"
                  rows={5}
                  className="neon-border-blue bg-card/50 focus:glow-blue-sm transition-smooth resize-none text-sm"
                  data-ocid="manual-input-description"
                  {...register("description", {
                    required: "Description is required",
                    minLength: {
                      value: 10,
                      message: "Description must be at least 10 characters",
                    },
                  })}
                />
                {errors.description && (
                  <p className="text-destructive text-xs" role="alert">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="manual-price"
                  className="font-display text-xs tracking-widest uppercase text-muted-foreground"
                >
                  Price{" "}
                  <span className="text-muted-foreground/60">(optional)</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm pointer-events-none">
                    $
                  </span>
                  <Input
                    id="manual-price"
                    placeholder="4,200 or Best Offer"
                    className="neon-border-blue bg-card/50 focus:glow-blue-sm transition-smooth pl-7"
                    data-ocid="manual-input-price"
                    value={manualPriceDisplay}
                    onChange={handleManualPriceChange}
                  />
                </div>
              </div>

              {/* Source URL */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="manual-sourceUrl"
                  className="font-display text-xs tracking-widest uppercase text-muted-foreground"
                >
                  Listing URL{" "}
                  <span className="text-muted-foreground/60">(optional)</span>
                </Label>
                <Input
                  id="manual-sourceUrl"
                  type="url"
                  placeholder="https://marketplace.example.com/listing/…"
                  className="neon-border-blue bg-card/50 focus:glow-blue-sm transition-smooth"
                  data-ocid="manual-input-source-url"
                  {...register("sourceUrl", {
                    pattern: {
                      value: /^(https?:\/\/)/,
                      message:
                        "Must be a valid URL starting with http:// or https://",
                    },
                  })}
                />
                {errors.sourceUrl && (
                  <p className="text-destructive text-xs" role="alert">
                    {errors.sourceUrl.message}
                  </p>
                )}
              </div>

              {/* Images */}
              {uploadEnabled && (
                <div className="space-y-1.5">
                  <Label className="font-display text-xs tracking-widest uppercase text-muted-foreground">
                    Images{" "}
                    <span className="text-muted-foreground/60">(optional)</span>
                  </Label>
                  <ImageUploadZone
                    files={files}
                    onChange={setFiles}
                    progressMap={progressMap}
                  />
                </div>
              )}

              {/* Submit */}
              <div className="flex gap-3 pt-1 mt-auto">
                <Button
                  type="submit"
                  disabled={isBusy}
                  data-ocid="btn-submit-manual"
                  className="flex-1 font-display text-sm py-5 tracking-widest uppercase bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 transition-smooth shadow-md"
                >
                  {animStep === "saving" ? (
                    <span className="animate-pulse">Saving to timeline…</span>
                  ) : (
                    "Post Listing"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isBusy}
                  data-ocid="btn-cancel-import"
                  className="px-5 neon-border-blue transition-smooth text-xs font-display tracking-wider uppercase"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </>
  );
}

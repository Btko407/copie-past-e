import { Button } from "@/components/ui/button";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import type { Image } from "../backend.d.ts";
import { downloadImageFromUrl } from "../pages/api/download-image";

interface ImageCarouselProps {
  images: Image[];
}

type DownloadState = "idle" | "loading" | "done" | "fallback";

export function ImageCarousel({ images }: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [downloadState, setDownloadState] = useState<DownloadState>("idle");
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);

  function prev() {
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
    setDownloadState("idle");
    setFallbackUrl(null);
  }

  function next() {
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
    setDownloadState("idle");
    setFallbackUrl(null);
  }

  async function handleDownload(img: Image, idx: number) {
    if (downloadState === "loading") return;
    setDownloadState("loading");
    setFallbackUrl(null);

    const url = img.blob.getDirectURL();
    const filename = img.altText
      ? `${img.altText.slice(0, 40).replace(/\s+/g, "-").toLowerCase()}.jpg`
      : `listing-image-${idx + 1}.jpg`;

    const result = await downloadImageFromUrl(url, filename);

    if (!result.ok) {
      // Show fallback — "press and hold" message, open in new tab
      setFallbackUrl(result.fallbackUrl ?? url);
      setDownloadState("fallback");
      try {
        window.open(result.fallbackUrl ?? url, "_blank", "noopener noreferrer");
      } catch {
        // swallow popup block
      }
      // Reset to idle after 5s so user can try again
      setTimeout(() => {
        setDownloadState("idle");
        setFallbackUrl(null);
      }, 5000);
      return;
    }

    setDownloadState("done");
    setTimeout(() => {
      setDownloadState("idle");
    }, 1200);
  }

  if (images.length === 0) return null;

  const active = images[activeIndex];

  return (
    <div className="flex flex-col gap-3" data-ocid="image-carousel">
      {/* Main image */}
      <div className="relative group rounded-lg overflow-hidden neon-border-blue bg-card aspect-video flex items-center justify-center">
        <img
          src={active.blob.getDirectURL()}
          alt={active.altText}
          className="w-full h-full object-contain"
        />

        {/* Prev/Next — fade-in on hover for desktop, always visible on mobile */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-background/80 border border-border hover:neon-border-blue hover:glow-blue-sm transition-smooth opacity-0 group-hover:opacity-100 sm:block hidden"
              aria-label="Previous image"
              data-ocid="carousel-prev"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-background/80 border border-border transition-smooth sm:hidden"
              aria-label="Previous image"
              data-ocid="carousel-prev-mobile"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={next}
              className="absolute right-12 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-background/80 border border-border hover:neon-border-blue hover:glow-blue-sm transition-smooth opacity-0 group-hover:opacity-100 sm:block hidden"
              aria-label="Next image"
              data-ocid="carousel-next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-12 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-background/80 border border-border transition-smooth sm:hidden"
              aria-label="Next image"
              data-ocid="carousel-next-mobile"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Download button — bottom-right, 44×44px touch target */}
        <Button
          size="icon"
          variant="outline"
          className={[
            "absolute bottom-2 right-2 min-w-[44px] min-h-[44px] w-11 h-11 transition-smooth bg-background/80 disabled:opacity-50",
            downloadState === "done"
              ? "neon-border-blue glow-blue-sm border-primary"
              : downloadState === "fallback"
                ? "border-destructive/60 text-destructive"
                : "neon-border-blue hover:glow-blue-sm",
          ].join(" ")}
          onClick={() => handleDownload(active, activeIndex)}
          disabled={downloadState === "loading"}
          aria-label="Download image"
          data-ocid="download-single-image-btn"
        >
          {downloadState === "loading" ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : downloadState === "done" ? (
            <Check className="w-5 h-5 text-primary" />
          ) : (
            <Download className="w-5 h-5" />
          )}
        </Button>

        {/* Counter — bottom-left */}
        {images.length > 1 && (
          <span className="absolute bottom-2 left-2 font-mono text-xs text-muted-foreground bg-background/70 px-2 py-1 rounded">
            {activeIndex + 1} / {images.length}
          </span>
        )}
      </div>

      {/* Fallback message */}
      {downloadState === "fallback" && (
        <div
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 font-mono text-xs text-destructive leading-snug"
          data-ocid="download-fallback-msg"
        >
          📱 Press and hold this image, then tap <strong>Save to Photos</strong>
          .{" "}
          {fallbackUrl && (
            <a
              href={fallbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              Open image
            </a>
          )}
        </div>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin"
          data-ocid="thumbnail-strip"
        >
          {images.map((img, idx) => (
            <button
              type="button"
              key={img.id.toString()}
              onClick={() => {
                setActiveIndex(idx);
                setDownloadState("idle");
                setFallbackUrl(null);
              }}
              className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-smooth ${
                idx === activeIndex
                  ? "border-primary glow-blue-sm"
                  : "border-border opacity-60 hover:opacity-90 hover:border-primary/50"
              }`}
              aria-label={`View image ${idx + 1}`}
              data-ocid={`thumbnail-${idx}`}
            >
              <img
                src={img.blob.getDirectURL()}
                alt={img.altText}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

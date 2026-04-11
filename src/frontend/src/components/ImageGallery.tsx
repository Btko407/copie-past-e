import { Skeleton } from "@/components/ui/skeleton";
import { ImageOff } from "lucide-react";
import type { Image } from "../backend.d.ts";
import { ImageCarousel } from "./ImageCarousel";

interface ImageGalleryProps {
  images: Image[];
  isLoading?: boolean;
}

export function ImageGallery({ images, isLoading }: ImageGalleryProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3" data-ocid="image-gallery-loading">
        <Skeleton className="w-full aspect-video rounded-lg" />
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="w-16 h-16 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card/50 aspect-video"
        data-ocid="image-gallery-empty"
      >
        <ImageOff className="w-10 h-10 text-muted-foreground/40" />
        <p className="font-mono text-sm text-muted-foreground uppercase tracking-wider">
          No Images
        </p>
      </div>
    );
  }

  return (
    <div data-ocid="image-gallery">
      <ImageCarousel images={images} />
    </div>
  );
}

import { ImageIcon, Upload, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import type { UploadableFile } from "../hooks/useCreateListing";

interface ImageUploadZoneProps {
  files: UploadableFile[];
  onChange: (files: UploadableFile[]) => void;
  progressMap: Record<string, number>;
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function ImageUploadZone({
  files,
  onChange,
  progressMap,
}: ImageUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const imageFiles = Array.from(incoming).filter((f) =>
        f.type.startsWith("image/"),
      );
      const uploadables: UploadableFile[] = imageFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        id: generateId(),
      }));
      onChange([...files, ...uploadables]);
    },
    [files, onChange],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles],
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const removeFile = (id: string) => {
    const updated = files.filter((f) => f.id !== id);
    // Revoke URL for removed file
    const removed = files.find((f) => f.id === id);
    if (removed) URL.revokeObjectURL(removed.preview);
    onChange(updated);
  };

  return (
    <div className="space-y-3" data-ocid="image-upload-zone">
      {/* Drop zone */}
      <button
        type="button"
        aria-label="Upload images — drag and drop or click to browse"
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => inputRef.current?.click()}
        className={[
          "relative cursor-pointer rounded-lg border-2 border-dashed p-8",
          "flex flex-col items-center gap-3 text-center transition-smooth",
          isDragging
            ? "border-accent bg-accent/5 glow-yellow"
            : "border-border hover:border-primary/60 hover:bg-primary/5",
        ].join(" ")}
      >
        <div
          className={[
            "w-12 h-12 rounded-full flex items-center justify-center transition-smooth",
            isDragging ? "bg-accent/20" : "bg-muted",
          ].join(" ")}
        >
          <Upload
            className={
              isDragging
                ? "text-accent w-5 h-5"
                : "text-muted-foreground w-5 h-5"
            }
          />
        </div>
        <div>
          <p className="font-body text-foreground text-sm font-medium">
            Drag &amp; drop images here
          </p>
          <p className="text-muted-foreground text-xs mt-1">
            or click to browse · PNG, JPG, WEBP supported
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </button>

      {/* Thumbnails */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          <AnimatePresence>
            {files.map((f) => {
              const prog = progressMap[f.id] ?? 0;
              const isUploading = prog > 0 && prog < 100;
              return (
                <motion.div
                  key={f.id}
                  className="relative group rounded-md overflow-hidden neon-border-blue aspect-square bg-muted"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={f.preview}
                    alt={f.file.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Upload progress overlay */}
                  {isUploading && (
                    <div className="absolute inset-0 bg-background/70 flex flex-col items-center justify-center gap-1 p-2">
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${prog}%` }}
                          transition={{ duration: 0.2 }}
                        />
                      </div>
                      <span className="text-primary text-xs font-display">
                        {prog}%
                      </span>
                    </div>
                  )}

                  {/* Done overlay */}
                  {prog === 100 && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <ImageIcon className="w-3 h-3 text-primary-foreground" />
                      </div>
                    </div>
                  )}

                  {/* Remove button */}
                  {prog === 0 && (
                    <button
                      type="button"
                      aria-label={`Remove ${f.file.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(f.id);
                      }}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive/80 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

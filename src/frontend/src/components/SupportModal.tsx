import { useActor } from "@caffeineai/core-infrastructure";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Clock,
  Paperclip,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createActor } from "../backend";
import { useSubmitTicket, useSupportTickets } from "../hooks/useSupportTickets";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface UploadedFile {
  name: string;
  size: number;
  url: string;
  type: string;
}

type TicketStatus = "open" | "in_progress" | "resolved" | string;

interface SupportModalProps {
  onClose: () => void;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function formatDate(ts: bigint | number): string {
  const ms =
    typeof ts === "bigint"
      ? Number(ts) / 1_000_000
      : ts > 1e15
        ? ts / 1_000_000
        : ts;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusLabel(status: TicketStatus): string {
  switch (status) {
    case "open":
      return "OPEN";
    case "in_progress":
      return "IN PROGRESS";
    case "resolved":
      return "RESOLVED";
    default:
      return status.toUpperCase();
  }
}

function statusColor(status: TicketStatus): string {
  switch (status) {
    case "open":
      return "text-[oklch(0.88_0.19_84)] border-[oklch(0.88_0.19_84/0.5)] bg-[oklch(0.88_0.19_84/0.08)]";
    case "in_progress":
      return "text-[oklch(0.65_0.22_262)] border-[oklch(0.65_0.22_262/0.5)] bg-[oklch(0.65_0.22_262/0.08)]";
    case "resolved":
      return "text-[oklch(0.75_0.18_140)] border-[oklch(0.75_0.18_140/0.5)] bg-[oklch(0.75_0.18_140/0.08)]";
    default:
      return "text-muted-foreground border-border/50 bg-muted/20";
  }
}

function StatusIcon({ status }: { status: TicketStatus }) {
  switch (status) {
    case "open":
      return <AlertCircle className="w-3 h-3" />;
    case "in_progress":
      return <Clock className="w-3 h-3" />;
    case "resolved":
      return <CheckCircle2 className="w-3 h-3" />;
    default:
      return <Clock className="w-3 h-3" />;
  }
}

// ─── File Thumbnail ────────────────────────────────────────────────────────────

function FileThumbnail({
  file,
  onRemove,
}: { file: UploadedFile; onRemove: () => void }) {
  const isImage = file.type.startsWith("image/");
  return (
    <div className="relative group" data-ocid="support.file-thumbnail">
      <div className="w-16 h-16 rounded border border-[oklch(0.75_0.18_140/0.3)] bg-[oklch(0.75_0.18_140/0.05)] overflow-hidden flex items-center justify-center">
        {isImage ? (
          <img
            src={file.url}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Paperclip className="w-5 h-5 text-[oklch(0.75_0.18_140/0.6)]" />
        )}
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-destructive flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label={`Remove ${file.name}`}
        data-ocid="support.file-remove"
      >
        <Trash2 className="w-2.5 h-2.5 text-destructive-foreground" />
      </button>
      <p
        className="font-mono text-[9px] text-muted-foreground text-center mt-1 truncate w-16"
        title={file.name}
      >
        {file.name.slice(0, 8)}
        {file.name.length > 8 ? "…" : ""}
      </p>
      <p className="font-mono text-[9px] text-muted-foreground/50 text-center">
        {formatFileSize(file.size)}
      </p>
    </div>
  );
}

// ─── Ticket Row ────────────────────────────────────────────────────────────────

interface TicketRowProps {
  ticket: {
    id: number;
    subject: string;
    status: TicketStatus;
    createdAt: bigint | number;
  };
}

function TicketRow({ ticket }: TicketRowProps) {
  return (
    <div
      className="border border-border/30 bg-card/50 rounded p-3 space-y-1.5"
      data-ocid={`support.ticket-row.${ticket.id}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p
          className="font-mono text-xs text-foreground leading-snug flex-1 min-w-0 truncate"
          title={ticket.subject}
        >
          {ticket.subject}
        </p>
        <span
          className={`flex-shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded border font-mono text-[9px] font-bold uppercase tracking-wide ${statusColor(ticket.status)}`}
        >
          <StatusIcon status={ticket.status} />
          {statusLabel(ticket.status)}
        </span>
      </div>
      <p className="font-mono text-[10px] text-muted-foreground">
        #{ticket.id} &nbsp;·&nbsp; {formatDate(ticket.createdAt)}
      </p>
    </div>
  );
}

// ─── Upload Zone ───────────────────────────────────────────────────────────────

interface UploadZoneProps {
  files: UploadedFile[];
  uploading: boolean;
  onFilesAdded: (newFiles: File[]) => void;
  onRemove: (index: number) => void;
}

function UploadZone({
  files,
  uploading,
  onFilesAdded,
  onRemove,
}: UploadZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length) onFilesAdded(droppedFiles);
  }

  return (
    <div className="space-y-3">
      <label
        htmlFor="support-file-input"
        className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5"
      >
        Attachments (optional)
      </label>
      <button
        type="button"
        className={`file-upload-zone w-full text-center ${dragOver ? "dragover" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        aria-label="Upload attachments — click or drag files here"
        data-ocid="support.file-upload-zone"
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.txt,.log"
          className="sr-only"
          onChange={(e) => {
            if (e.target.files?.length)
              onFilesAdded(Array.from(e.target.files));
          }}
          data-ocid="support.file-input"
        />
        <Upload className="w-6 h-6 mx-auto mb-2 text-[oklch(0.75_0.18_140/0.6)]" />
        <p className="file-upload-label">
          {uploading ? "UPLOADING..." : "DROP FILES OR CLICK TO UPLOAD"}
        </p>
        <p className="font-mono text-[10px] text-muted-foreground/60 mt-1">
          Images, PDFs, logs — max 10MB per file
        </p>
      </button>

      {files.length > 0 && (
        <div
          className="flex flex-wrap gap-3"
          data-ocid="support.file-thumbnails"
        >
          {files.map((f, i) => (
            <FileThumbnail
              key={`${f.name}-${i}`}
              file={f}
              onRemove={() => onRemove(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main SupportModal ─────────────────────────────────────────────────────────

export function SupportModal({ onClose }: SupportModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [activeTab, setActiveTab] = useState<"new" | "history">("new");

  const [validationError, setValidationError] = useState("");

  const dialogRef = useRef<HTMLDivElement>(null);
  const { submit, loading, success } = useSubmitTicket();
  const { tickets, loading: ticketsLoading } = useSupportTickets();

  // TODO: Replace with object-storage extension actor when available.
  // The object-storage extension exposes an `uploadFile(name, mimeType, bytes)` method
  // that returns `{ ok: string }` (a CDN URL). Import its createActor from the generated
  // declarations at `../../../declarations/object_storage/index.js` once the extension
  // canister is deployed and bindgen has run. Until then, files fall back to local object URLs.
  // Example: import { createActor as createStorageActor } from "../../../declarations/object_storage";
  //          const { actor: objectStorageActor } = useActor(createStorageActor);
  const objectStorageActor = null;

  // Trap focus + Escape to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  async function handleFileUpload(newFiles: File[]) {
    setUploadError("");
    setUploading(true);

    const results: UploadedFile[] = [];

    for (const file of newFiles) {
      if (file.size > 10 * 1024 * 1024) {
        setUploadError(`${file.name} exceeds 10MB limit.`);
        continue;
      }
      try {
        // Use object-storage extension pattern
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const storageActor = objectStorageActor as any;
        if (storageActor?.uploadFile) {
          const arrayBuffer = await file.arrayBuffer();
          const bytes = new Uint8Array(arrayBuffer);
          const result = await storageActor.uploadFile(
            file.name,
            file.type,
            bytes,
          );
          if (result?.ok) {
            results.push({
              name: file.name,
              size: file.size,
              url: result.ok,
              type: file.type,
            });
          } else {
            // Fallback: create local object URL for preview
            results.push({
              name: file.name,
              size: file.size,
              url: URL.createObjectURL(file),
              type: file.type,
            });
          }
        } else {
          // No storage actor — use local preview
          results.push({
            name: file.name,
            size: file.size,
            url: URL.createObjectURL(file),
            type: file.type,
          });
        }
      } catch {
        setUploadError(`Failed to upload ${file.name}. Try again.`);
      }
    }

    setUploadedFiles((prev) => [...prev, ...results]);
    setUploading(false);
  }

  function removeFile(index: number) {
    setUploadedFiles((prev) => {
      const next = [...prev];
      const removed = next.splice(index, 1)[0];
      if (removed?.url.startsWith("blob:")) URL.revokeObjectURL(removed.url);
      return next;
    });
  }

  async function handleSubmit() {
    setValidationError("");

    if (!title.trim()) {
      setValidationError("Ticket subject is required.");
      return;
    }
    if (!description.trim()) {
      setValidationError("Description is required.");
      return;
    }

    try {
      const attachmentUrls = uploadedFiles.map((f) => f.url).join(", ");
      const fullMessage = attachmentUrls
        ? `${description.trim()}\n\n[Attachments: ${attachmentUrls}]`
        : description.trim();
      await submit(title.trim(), fullMessage);
      toast.success("Support ticket submitted", {
        description: "We'll respond through your notification center.",
      });
    } catch (err) {
      setValidationError(
        err instanceof Error ? err.message : "Failed to submit ticket.",
      );
    }
  }

  return (
    <dialog
      open
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 m-0 max-w-none max-h-none w-full h-full border-0 bg-[oklch(0.04_0_0/0.85)] backdrop-blur-sm"
      aria-label="Help and Support"
      data-ocid="support.dialog"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="w-full max-w-lg flex flex-col outline-none"
        style={{ maxHeight: "90dvh" }}
        data-ocid="support.modal-container"
      >
        {/* Terminal header */}
        <div className="terminal-header flex items-center justify-between flex-shrink-0">
          <span>[SUPPORT TERMINAL — HELP & DIAGNOSTICS]</span>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded text-[oklch(0.65_0.22_262/0.7)] hover:text-[oklch(0.65_0.22_262)] hover:bg-[oklch(0.65_0.22_262/0.1)] transition-all"
            aria-label="Close support modal"
            data-ocid="support.close-button"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Main window */}
        <div className="terminal-window overflow-hidden flex flex-col flex-1 min-h-0">
          {/* Tabs */}
          <div className="flex border-b border-[oklch(0.65_0.22_262/0.3)] flex-shrink-0">
            {(["new", "history"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 font-mono text-[10px] uppercase tracking-widest transition-all duration-200 ${activeTab === tab ? "text-[oklch(0.65_0.22_262)] border-b-2 border-[oklch(0.65_0.22_262)] bg-[oklch(0.65_0.22_262/0.05)]" : "text-muted-foreground hover:text-foreground"}`}
                data-ocid={`support.tab-${tab}`}
              >
                {tab === "new" ? "New Ticket" : `History (${tickets.length})`}
              </button>
            ))}
          </div>

          <div className="overflow-y-auto flex-1 p-5">
            {/* ─── New Ticket Tab ─────────────────────────────────────────── */}
            {activeTab === "new" && (
              <div>
                {success ? (
                  <div
                    className="flex flex-col items-center justify-center py-10 space-y-4 text-center"
                    data-ocid="support.success-state"
                  >
                    <div className="w-12 h-12 rounded-full border-2 border-[oklch(0.75_0.18_140)] bg-[oklch(0.75_0.18_140/0.1)] flex items-center justify-center shadow-[0_0_16px_oklch(0.75_0.18_140/0.4)]">
                      <CheckCircle2 className="w-6 h-6 text-[oklch(0.75_0.18_140)]" />
                    </div>
                    <div>
                      <p className="font-mono text-sm font-bold text-[oklch(0.75_0.18_140)] text-glow-green uppercase tracking-widest">
                        TICKET SUBMITTED
                      </p>
                      <p className="font-mono text-xs text-muted-foreground mt-2 leading-relaxed max-w-xs">
                        Your ticket has been received. We'll respond through
                        your notification center.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2 border border-[oklch(0.65_0.22_262/0.5)] text-[oklch(0.65_0.22_262)] font-mono text-xs uppercase tracking-widest rounded hover:bg-[oklch(0.65_0.22_262/0.1)] transition-all"
                      data-ocid="support.success-close"
                    >
                      CLOSE TERMINAL
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Prompt line */}
                    <p className="font-mono text-[10px] text-muted-foreground">
                      &gt; DESCRIBE YOUR ISSUE. ATTACH SCREENSHOTS FOR FASTER
                      RESOLUTION.
                    </p>

                    {/* Title */}
                    <div>
                      <label
                        htmlFor="support-title"
                        className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5"
                      >
                        Ticket Subject *
                      </label>
                      <input
                        id="support-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value.slice(0, 120))}
                        placeholder="e.g. Autofill not working on eBay"
                        maxLength={120}
                        className="w-full bg-[oklch(0.12_0_0)] border border-[oklch(0.65_0.22_262/0.3)] focus:border-[oklch(0.65_0.22_262/0.7)] focus:outline-none rounded px-3 py-2.5 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 transition-all"
                        data-ocid="support.title-input"
                      />
                      <p className="font-mono text-[9px] text-muted-foreground/50 text-right mt-0.5">
                        {title.length}/120
                      </p>
                    </div>

                    {/* Description */}
                    <div>
                      <label
                        htmlFor="support-description"
                        className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5"
                      >
                        Description *
                      </label>
                      <textarea
                        id="support-description"
                        value={description}
                        onChange={(e) =>
                          setDescription(e.target.value.slice(0, 2000))
                        }
                        placeholder="Describe the issue in detail. Include steps to reproduce, platform (e.g. eBay), and what you expected vs what happened..."
                        rows={5}
                        className="w-full bg-[oklch(0.12_0_0)] border border-[oklch(0.65_0.22_262/0.3)] focus:border-[oklch(0.65_0.22_262/0.7)] focus:outline-none rounded px-3 py-2.5 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 resize-none transition-all leading-relaxed"
                        data-ocid="support.description-textarea"
                      />
                      <p className="font-mono text-[9px] text-muted-foreground/50 text-right mt-0.5">
                        {description.length}/2000
                      </p>
                    </div>

                    {/* File upload */}
                    <UploadZone
                      files={uploadedFiles}
                      uploading={uploading}
                      onFilesAdded={handleFileUpload}
                      onRemove={removeFile}
                    />

                    {uploadError && (
                      <p
                        className="font-mono text-xs text-destructive"
                        data-ocid="support.upload-error"
                      >
                        {uploadError}
                      </p>
                    )}
                    {validationError && (
                      <p
                        className="font-mono text-xs text-destructive"
                        data-ocid="support.validation-error"
                      >
                        {validationError}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={
                        loading ||
                        uploading ||
                        !title.trim() ||
                        !description.trim()
                      }
                      className="w-full py-3 bg-[oklch(0.65_0.22_262/0.15)] border border-[oklch(0.65_0.22_262/0.6)] hover:bg-[oklch(0.65_0.22_262/0.25)] hover:border-[oklch(0.65_0.22_262)] text-[oklch(0.65_0.22_262)] font-mono text-xs font-bold uppercase tracking-widest transition-all duration-200 rounded shadow-[0_0_8px_oklch(0.65_0.22_262/0.2)] hover:shadow-[0_0_16px_oklch(0.65_0.22_262/0.4)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                      data-ocid="support.submit-button"
                    >
                      {loading ? "TRANSMITTING..." : "SUBMIT TICKET"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ─── History Tab ─────────────────────────────────────────────── */}
            {activeTab === "history" && (
              <div className="space-y-3">
                <p className="font-mono text-[10px] text-muted-foreground">
                  &gt; YOUR OPEN SUPPORT TICKETS
                </p>

                {ticketsLoading ? (
                  <div
                    className="space-y-2"
                    data-ocid="support.history-loading"
                  >
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-14 rounded bg-muted/20 animate-pulse"
                      />
                    ))}
                  </div>
                ) : tickets.length === 0 ? (
                  <div
                    className="text-center py-10"
                    data-ocid="support.history-empty"
                  >
                    <p className="font-mono text-xs text-muted-foreground">
                      No tickets found.
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground/50 mt-1">
                      Submit a new ticket using the "New Ticket" tab.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2" data-ocid="support.ticket-list">
                    {tickets.map((ticket) => (
                      <TicketRow key={ticket.id} ticket={ticket} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}

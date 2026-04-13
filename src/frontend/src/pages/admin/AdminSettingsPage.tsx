import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  useGetAdminSettings,
  useUpdateAdminSettings,
} from "@/hooks/useAdminSettings";
import {
  useCreateVersion,
  useListVersionHistory,
} from "@/hooks/useAdminVersions";
import { useMaintenanceMode } from "@/hooks/useMaintenanceMode";
import type { UpdateSettingsArgs } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Palette,
  RefreshCw,
  Save,
  Shield,
  Sliders,
  Upload,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createActor } from "../../backend";

const DEFAULT_SETTINGS: UpdateSettingsArgs = {
  appName: "COPIE PAST-E",
  primaryColor: "oklch(0.65 0.22 262)",
  accentColor: "oklch(0.88 0.19 84)",
  uploadEnabled: true,
  copyButtonsEnabled: true,
  contentModerationEnabled: false,
  maxRequestsPerMinute: BigInt(60),
  maxUploadsPerHour: BigInt(20),
  maxSessionDurationMinutes: BigInt(1440),
  maxConcurrentSessions: BigInt(5),
  allowedOrigins: "*",
};

function SettingSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-card neon-border-blue overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-primary/20 bg-primary/5">
        <Icon className="w-4 h-4 text-primary" />
        <h3 className="font-display text-xs font-bold tracking-widest uppercase text-primary text-glow-blue">
          {title}
        </h3>
      </div>
      <div className="p-5 space-y-5">{children}</div>
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  description,
  checked,
  onCheckedChange,
  id,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <Icon className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        <div className="min-w-0">
          <Label
            htmlFor={id}
            className="font-mono text-xs text-foreground tracking-wide cursor-pointer"
          >
            {label}
          </Label>
          <p className="font-mono text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        data-ocid={`toggle-${id}`}
        className="shrink-0"
      />
    </div>
  );
}

function NumberInput({
  label,
  description,
  value,
  min,
  max,
  onChange,
  id,
}: {
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  id: string;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-start">
      <div>
        <Label
          htmlFor={id}
          className="font-mono text-xs text-foreground tracking-wide"
        >
          {label}
        </Label>
        <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
          {description}
        </p>
      </div>
      <Input
        id={id}
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) =>
          onChange(Math.min(max, Math.max(min, Number(e.target.value))))
        }
        className="font-mono text-xs bg-secondary/30 border-primary/30 focus:border-primary/60 h-9"
        data-ocid={`input-${id}`}
      />
    </div>
  );
}

// ─── Gemini OCR Section ───────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorAny = any;

type GeminiStatus =
  | "unconfigured"
  | "connected"
  | "failed"
  | "testing"
  | "saving";

/** True when the error message is an ICP cycles error (not a key/config error) */
function isCyclesError(msg: string): boolean {
  return msg.includes("cycles") || msg.includes("http_request");
}

function GeminiOCRSection() {
  const { actor, isFetching } = useActor(createActor);
  const [apiKey, setApiKey] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [status, setStatus] = useState<GeminiStatus>("unconfigured");
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Load existing config on mount — if key is saved, show connected state
  useEffect(() => {
    if (!actor || isFetching) return;
    (actor as ActorAny)
      .adminGetGeminiConfig()
      .then((cfg: { model: string; configured: boolean }) => {
        if (cfg.configured) {
          setStatus("connected");
          setStatusMsg("Connected — OCR Active (gemini-2.5-flash-lite)");
        } else {
          setStatus("unconfigured");
          setStatusMsg(null);
        }
      })
      .catch(() => {
        /* silent — no config yet */
      });
  }, [actor, isFetching]);

  async function handleTestConnection() {
    if (!actor || isFetching) {
      toast.error("Backend not ready. Please try again.");
      return;
    }
    setStatus("testing");
    setStatusMsg(null);
    try {
      const result = await (actor as ActorAny).adminTestGeminiConnection();

      // Handle both return shapes:
      //   New: { success: boolean; message: string }
      //   Old: { __kind__: "ok" | "err"; ok?: ...; err?: string }
      let succeeded = false;
      let errMsg = "";

      if (result && typeof result === "object") {
        if ("success" in result) {
          // New { success: Bool; message: Text } shape
          succeeded = result.success === true;
          errMsg = result.message ?? "";
        } else if (result.__kind__ === "ok") {
          succeeded = true;
        } else if (result.__kind__ === "err") {
          succeeded = false;
          errMsg = (result.err as string) ?? "Connection failed";
        }
      }

      if (succeeded) {
        setStatus("connected");
        setStatusMsg("Connected — OCR Active (gemini-2.5-flash-lite)");
        toast.success("Gemini connected. Smart Photo OCR is active.");
      } else {
        // Always show the real message — never empty {}
        const displayMsg =
          errMsg && errMsg !== "{}"
            ? errMsg
            : "Connection failed — check your API key in admin Settings.";
        setStatus("failed");
        setStatusMsg(displayMsg);
        if (isCyclesError(displayMsg)) {
          toast.error("OCR Connection: Cycles required", {
            description:
              "The backend needs ICP cycles to call external APIs. " +
              "This is a platform-level resource issue, not a key error. " +
              "Your key is saved and correct.",
            duration: 8000,
          });
        } else {
          toast.error("OCR connection failed", { description: displayMsg });
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Connection failed";
      const displayMsg =
        msg && msg !== "{}"
          ? msg
          : "Connection failed — check your API key in admin Settings.";
      setStatus("failed");
      setStatusMsg(displayMsg);
      if (isCyclesError(displayMsg)) {
        toast.error("OCR Connection: Cycles required", {
          description:
            "The backend needs ICP cycles to call the Gemini API. " +
            "Your key is saved correctly.",
          duration: 8000,
        });
      } else {
        toast.error("OCR connection failed", { description: displayMsg });
      }
    }
  }

  async function handleSaveKey() {
    if (!apiKey.trim()) {
      toast.error("Enter a Gemini API key first.");
      return;
    }
    if (!actor || isFetching) {
      toast.error("Backend not ready. Please try again.");
      return;
    }
    setStatus("saving");
    try {
      const result = await (actor as ActorAny).adminSaveGeminiConfig(
        apiKey.trim(),
      );
      if (result.__kind__ === "ok") {
        setStatus("connected");
        setStatusMsg("Connected — OCR Active (gemini-2.5-flash-lite)");
        toast.success("Gemini API key saved.", {
          description:
            "Key stored permanently. Use Test OCR Connection to verify it works.",
        });
        // Best-effort sync to extension storage (non-blocking)
        try {
          window.postMessage(
            { type: "COPIE_PASTE_SET_GEMINI_KEY", apiKey: apiKey.trim() },
            "*",
          );
        } catch (_) {}
        setApiKey("");
      } else {
        const errMsg = result.err as string;
        setStatus("failed");
        setStatusMsg(errMsg);
        toast.error(`Save failed: ${errMsg}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      setStatus("failed");
      setStatusMsg(msg);
      toast.error(msg);
    }
  }

  const statusBadge = (() => {
    if (status === "connected") {
      return (
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-green-400">
          <CheckCircle2 className="w-3 h-3" />
          {statusMsg ?? "Connected — OCR Active (gemini-2.5-flash-lite)"}
        </span>
      );
    }
    if (status === "failed") {
      const msg = statusMsg ?? "Connection failed — check key";
      const isCycles = isCyclesError(msg);
      return (
        <span className="inline-flex flex-col gap-1">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-destructive">
            <XCircle className="w-3 h-3 shrink-0" />
            {isCycles ? "Cycles required for http_request" : msg}
          </span>
          {isCycles && (
            <span className="font-mono text-[9px] text-muted-foreground leading-relaxed">
              Your API key is saved. The canister needs ICP cycles to make
              outbound HTTP calls to Google. This is a platform resource issue.
            </span>
          )}
        </span>
      );
    }
    if (status === "testing" || status === "saving") {
      return (
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
          <Loader2 className="w-3 h-3 animate-spin" />
          {status === "saving" ? "Saving…" : "Testing…"}
        </span>
      );
    }
    return (
      <span className="font-mono text-[10px] text-muted-foreground">
        {apiKey
          ? "Key entered — click Test OCR Connection to verify"
          : "Not configured — enter API key above"}
      </span>
    );
  })();

  return (
    <SettingSection icon={BrainCircuit} title="Smart Photo OCR">
      <p className="font-mono text-[10px] text-muted-foreground -mt-2 leading-relaxed">
        Gemini 2.5 Flash-Lite powers the Smart Photo import. Paste a listing
        screenshot and the AI extracts all fields automatically. Get your API
        key from{" "}
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
        >
          aistudio.google.com
        </a>
        .
      </p>

      {/* Gemini API Key */}
      <div className="space-y-1.5">
        <Label
          htmlFor="gemini-api-key"
          className="font-mono text-xs text-foreground tracking-wide"
        >
          Gemini API Key
          <span className="text-muted-foreground/50 normal-case tracking-normal ml-1 font-normal">
            (GEMINI_API_KEY)
          </span>
        </Label>
        <div className="relative">
          <Input
            id="gemini-api-key"
            type={revealed ? "text" : "password"}
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              // Only reset to unconfigured if key was previously connected
              if (status === "connected") setStatus("unconfigured");
            }}
            placeholder={
              status === "connected"
                ? "Key saved — enter new key to update"
                : "AIza…"
            }
            className="font-mono text-xs bg-secondary/30 border-primary/30 focus:border-primary/60 pr-9"
            autoComplete="off"
            data-ocid="gemini-api-key-input"
          />
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={revealed ? "Hide key" : "Reveal key"}
          >
            {revealed ? (
              <EyeOff className="w-3.5 h-3.5" />
            ) : (
              <Eye className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
        {status === "connected" && (
          <p className="font-mono text-[10px] text-green-400/70">
            API key is saved permanently. Enter a new key above only to replace
            it.
          </p>
        )}
      </div>

      {/* Model (read-only) */}
      <div className="space-y-1.5">
        <Label className="font-mono text-xs text-foreground tracking-wide">
          Model
        </Label>
        <div className="rounded-md border border-border/40 bg-secondary/20 px-3 py-2 font-mono text-xs text-muted-foreground">
          gemini-2.5-flash-lite
        </div>
      </div>

      {/* Status */}
      <div className="flex items-start gap-3 flex-wrap">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
          Status:
        </span>
        {statusBadge}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          className="font-mono text-xs gap-1.5"
          onClick={handleTestConnection}
          disabled={status === "testing" || status === "saving"}
          data-ocid="gemini-test-connection-btn"
        >
          {status === "testing" ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5" />
          )}
          Test OCR Connection
        </Button>
        <Button
          size="sm"
          className="font-mono text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 ml-auto"
          onClick={handleSaveKey}
          disabled={
            !apiKey.trim() || status === "testing" || status === "saving"
          }
          data-ocid="gemini-save-key-btn"
        >
          {status === "saving" ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          Save API Key
        </Button>
      </div>
    </SettingSection>
  );
}

// ─── Maintenance Mode Section ─────────────────────────────────────────────────

function MaintenanceModeSection() {
  const mm = useMaintenanceMode();
  const [message, setMessage] = useState(mm.message);
  const [eta, setEta] = useState(mm.eta);
  const [saving, setSaving] = useState(false);

  // Sync form when hook data loads
  useEffect(() => {
    if (!mm.loading) {
      setMessage(mm.message);
      setEta(mm.eta);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mm.loading, mm.message, mm.eta]);

  async function handleToggle(newActive: boolean) {
    setSaving(true);
    try {
      await mm.toggle(
        newActive,
        message ||
          "Copie Past-e is temporarily down for maintenance. We will be back shortly. Thank you for your patience.",
        eta,
      );
      toast.success(
        newActive
          ? "Maintenance mode turned ON."
          : "Maintenance mode turned OFF.",
      );
    } catch {
      toast.error("Failed to update maintenance mode.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveMessage() {
    setSaving(true);
    try {
      await mm.toggle(mm.isActive, message, eta);
      toast.success("Maintenance message updated.");
    } catch {
      toast.error("Failed to save message.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SettingSection icon={Shield} title="Maintenance Mode">
      {/* ── What does this do? ── */}
      <p className="font-mono text-[10px] text-muted-foreground -mt-2 leading-relaxed">
        When ON, all non-admin users see a maintenance page and cannot use the
        app. Admins bypass this and see a yellow warning banner at the top. Turn
        it on when you need to perform updates, then turn it off when done.
      </p>

      {/* ── Toggle row ── */}
      <div className="flex items-center justify-between gap-4 rounded-lg border border-border/40 bg-secondary/20 px-4 py-3">
        <div>
          <p className="font-mono text-xs font-bold text-foreground">
            {mm.isActive ? "Maintenance Mode is ON" : "Maintenance Mode is OFF"}
          </p>
          <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
            {mm.isActive
              ? "Users see the maintenance page — admins still have full access"
              : "Site is live — all users can access the app normally"}
          </p>
        </div>
        <Switch
          checked={mm.isActive}
          onCheckedChange={handleToggle}
          disabled={saving || mm.loading}
          data-ocid="maintenance-mode-toggle"
          aria-label="Maintenance mode toggle"
          className="shrink-0"
        />
      </div>

      {/* ── Custom message ── */}
      <div className="space-y-1.5">
        <Label
          htmlFor="maintenance-message"
          className="font-mono text-xs text-foreground tracking-wide"
        >
          Message shown to users during maintenance
        </Label>
        <textarea
          id="maintenance-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="Copie Past-e is temporarily down for maintenance. We will be back shortly."
          className="w-full rounded-md border border-primary/30 bg-secondary/30 px-3 py-2 font-mono text-xs text-foreground focus:border-primary/60 focus:outline-none resize-none"
          data-ocid="maintenance-message-input"
        />
      </div>

      {/* ── ETA field ── */}
      <div className="space-y-1.5">
        <Label
          htmlFor="maintenance-eta"
          className="font-mono text-xs text-foreground tracking-wide"
        >
          Estimated back time
          <span className="text-muted-foreground/50 normal-case tracking-normal ml-1 font-normal">
            (optional — e.g. "2:00 PM EST")
          </span>
        </Label>
        <Input
          id="maintenance-eta"
          value={eta}
          onChange={(e) => setEta(e.target.value)}
          placeholder="e.g. 2:00 PM EST"
          className="font-mono text-xs bg-secondary/30 border-primary/30 focus:border-primary/60"
          data-ocid="maintenance-eta-input"
        />
      </div>

      <Button
        size="sm"
        onClick={handleSaveMessage}
        disabled={saving || mm.loading}
        className="font-mono text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
        data-ocid="maintenance-save-message-btn"
      >
        {saving ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Save className="w-3.5 h-3.5" />
        )}
        {saving ? "Saving…" : "Save Message"}
      </Button>
    </SettingSection>
  );
}

export function AdminSettingsPage() {
  const { data: settings, isLoading } = useGetAdminSettings();
  const { data: versionHistory } = useListVersionHistory();
  const updateSettings = useUpdateAdminSettings();
  const createVersion = useCreateVersion();

  const [form, setForm] = useState<UpdateSettingsArgs>(DEFAULT_SETTINGS);
  const [isDirty, setIsDirty] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const initialRef = useRef<UpdateSettingsArgs | null>(null);

  useEffect(() => {
    if (settings && !initialRef.current) {
      const loaded: UpdateSettingsArgs = {
        appName: settings.appName,
        primaryColor: settings.primaryColor,
        accentColor: settings.accentColor,
        uploadEnabled: settings.uploadEnabled,
        copyButtonsEnabled: settings.copyButtonsEnabled,
        contentModerationEnabled: settings.contentModerationEnabled,
        maxRequestsPerMinute: settings.maxRequestsPerMinute,
        maxUploadsPerHour: settings.maxUploadsPerHour,
        maxSessionDurationMinutes: settings.maxSessionDurationMinutes,
        maxConcurrentSessions: settings.maxConcurrentSessions,
        allowedOrigins: settings.allowedOrigins,
      };
      setForm(loaded);
      initialRef.current = loaded;
    }
  }, [settings]);

  function patch<K extends keyof UpdateSettingsArgs>(
    key: K,
    value: UpdateSettingsArgs[K],
  ) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      setIsDirty(JSON.stringify(next) !== JSON.stringify(initialRef.current));
      return next;
    });
  }

  async function handleSave() {
    try {
      await updateSettings.mutateAsync(form);
      initialRef.current = form;
      setIsDirty(false);

      // Derive next version label from existing history
      const nextLabel = (() => {
        if (!versionHistory || versionHistory.length === 0) return "v1.0";
        const latest = versionHistory[versionHistory.length - 1];
        const match = /^v(\d+)\.(\d+)$/.exec(latest.versionLabel);
        if (!match) return `v1.${versionHistory.length}`;
        const major = Number.parseInt(match[1], 10);
        const minor = Number.parseInt(match[2], 10);
        return `v${major}.${minor + 1}`;
      })();

      await createVersion.mutateAsync({
        versionLabel: nextLabel,
        description: `Settings updated — ${new Date().toLocaleString()}`,
      });

      toast.success("Settings saved", {
        description: "Configuration updated and version snapshot created.",
        icon: <CheckCircle2 className="w-4 h-4 text-primary" />,
      });
    } catch {
      toast.error("Save failed", { description: "Could not update settings." });
    }
  }

  function handleReset() {
    setForm(DEFAULT_SETTINGS);
    setIsDirty(true);
    initialRef.current = null;
    setResetDialogOpen(false);
  }

  if (isLoading) {
    return (
      <AdminLayout title="Settings" subtitle="Site Configuration">
        <div className="space-y-6">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Settings" subtitle="Site Configuration">
      {/* Header actions */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-sm font-bold tracking-wider uppercase text-foreground">
            Site Configuration
          </h2>
          {isDirty && (
            <Badge
              variant="outline"
              className="font-mono text-[10px] text-accent border-accent/50 bg-accent/5 gap-1"
              data-ocid="unsaved-changes-badge"
            >
              <AlertTriangle className="w-2.5 h-2.5" />
              Unsaved changes
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setResetDialogOpen(true)}
            className="font-mono text-xs border-border/50 text-muted-foreground hover:text-foreground"
            data-ocid="reset-defaults-btn"
          >
            <RefreshCw className="w-3 h-3 mr-1.5" />
            Reset to Defaults
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!isDirty || updateSettings.isPending}
            className="font-mono text-xs gap-1.5 neon-border-blue glow-blue-sm"
            data-ocid="save-settings-btn"
          >
            <Save className="w-3 h-3" />
            {updateSettings.isPending ? "Saving…" : "Save All"}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* General */}
        <SettingSection icon={Zap} title="General">
          <div>
            <Label
              htmlFor="appName"
              className="font-mono text-xs text-foreground tracking-wide"
            >
              App Name / Title
            </Label>
            <Input
              id="appName"
              value={form.appName}
              onChange={(e) => patch("appName", e.target.value)}
              className="mt-2 font-mono text-sm bg-secondary/30 border-primary/30 focus:border-primary/60"
              placeholder="COPIE PAST-E"
              data-ocid="input-appName"
            />
          </div>
        </SettingSection>

        {/* Theme Colors */}
        <SettingSection icon={Palette} title="Theme Colors">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <Label className="font-mono text-xs text-foreground tracking-wide mb-2 block">
                Primary Color
              </Label>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-md border border-primary/40 shrink-0"
                  style={{ background: form.primaryColor }}
                />
                <Input
                  value={form.primaryColor}
                  onChange={(e) => patch("primaryColor", e.target.value)}
                  className="font-mono text-xs bg-secondary/30 border-primary/30 focus:border-primary/60"
                  placeholder="oklch(0.65 0.22 262)"
                  data-ocid="input-primaryColor"
                />
              </div>
              <p className="font-mono text-[10px] text-muted-foreground mt-1.5">
                HEX (#3b82f6) or OKLCH accepted
              </p>
            </div>
            <div>
              <Label className="font-mono text-xs text-foreground tracking-wide mb-2 block">
                Accent Color
              </Label>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-md border border-accent/40 shrink-0"
                  style={{ background: form.accentColor }}
                />
                <Input
                  value={form.accentColor}
                  onChange={(e) => patch("accentColor", e.target.value)}
                  className="font-mono text-xs bg-secondary/30 border-primary/30 focus:border-primary/60"
                  placeholder="oklch(0.88 0.19 84)"
                  data-ocid="input-accentColor"
                />
              </div>
              <p className="font-mono text-[10px] text-muted-foreground mt-1.5">
                HEX (#facc15) or OKLCH accepted
              </p>
            </div>
          </div>

          {/* Live Preview */}
          <div className="rounded-lg border border-border/50 p-4 bg-secondary/20">
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-3">
              Live Preview
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                style={{ background: form.primaryColor }}
                className="px-4 py-2 rounded font-mono text-xs font-bold text-background"
              >
                Primary Button
              </button>
              <button
                type="button"
                style={{
                  background: "transparent",
                  border: `1px solid ${form.primaryColor}`,
                  color: form.primaryColor,
                }}
                className="px-4 py-2 rounded font-mono text-xs font-bold"
              >
                Outline
              </button>
              <span
                style={{
                  background: `${form.accentColor}20`,
                  color: form.accentColor,
                  border: `1px solid ${form.accentColor}80`,
                }}
                className="px-3 py-1 rounded font-mono text-xs"
              >
                Accent Badge
              </span>
            </div>
          </div>
        </SettingSection>

        {/* Feature Toggles */}
        <SettingSection icon={Sliders} title="Feature Toggles">
          <ToggleRow
            icon={Upload}
            id="uploadEnabled"
            label="Enable Upload"
            description="Allow users to upload images to listings. Disable to restrict storage usage."
            checked={form.uploadEnabled}
            onCheckedChange={(v) => patch("uploadEnabled", v)}
          />
          <ToggleRow
            icon={Copy}
            id="copyButtonsEnabled"
            label="Enable Copy Buttons"
            description="Show one-click copy controls on listing cards and detail pages."
            checked={form.copyButtonsEnabled}
            onCheckedChange={(v) => patch("copyButtonsEnabled", v)}
          />
          <ToggleRow
            icon={Shield}
            id="contentModerationEnabled"
            label="Enable Content Moderation"
            description="Automatically flag suspicious listing content for admin review."
            checked={form.contentModerationEnabled}
            onCheckedChange={(v) => patch("contentModerationEnabled", v)}
          />
        </SettingSection>

        {/* Rate Limits */}
        <SettingSection icon={Sliders} title="Rate Limits">
          <NumberInput
            id="maxRequestsPerMinute"
            label="Max Requests / Minute"
            description="Per-user API call ceiling (1–1000)"
            min={1}
            max={1000}
            value={Number(form.maxRequestsPerMinute)}
            onChange={(v) => patch("maxRequestsPerMinute", BigInt(v))}
          />
          <NumberInput
            id="maxUploadsPerHour"
            label="Max Uploads / Hour"
            description="Image uploads per user per hour (1–100)"
            min={1}
            max={100}
            value={Number(form.maxUploadsPerHour)}
            onChange={(v) => patch("maxUploadsPerHour", BigInt(v))}
          />
          <NumberInput
            id="maxSessionDurationMinutes"
            label="Max Session Duration (min)"
            description="Session expiry in minutes (1–10080 = 1 week)"
            min={1}
            max={10080}
            value={Number(form.maxSessionDurationMinutes)}
            onChange={(v) => patch("maxSessionDurationMinutes", BigInt(v))}
          />
        </SettingSection>

        {/* Security */}
        <SettingSection icon={Lock} title="Security">
          <NumberInput
            id="maxConcurrentSessions"
            label="Max Concurrent Sessions"
            description="How many simultaneous sessions per user (1–10)"
            min={1}
            max={10}
            value={Number(form.maxConcurrentSessions)}
            onChange={(v) => patch("maxConcurrentSessions", BigInt(v))}
          />
          <div>
            <Label
              htmlFor="allowedOrigins"
              className="font-mono text-xs text-foreground tracking-wide"
            >
              Allowed Origins
            </Label>
            <p className="font-mono text-[10px] text-muted-foreground mt-0.5 mb-2">
              Comma-separated list of trusted origins. Use * to allow all.
            </p>
            <Input
              id="allowedOrigins"
              value={form.allowedOrigins}
              onChange={(e) => patch("allowedOrigins", e.target.value)}
              className="font-mono text-xs bg-secondary/30 border-primary/30 focus:border-primary/60"
              placeholder="https://yourdomain.com, https://admin.yourdomain.com"
              data-ocid="input-allowedOrigins"
            />
          </div>
        </SettingSection>

        {/* Gemini OCR */}
        <GeminiOCRSection />

        {/* Maintenance Mode */}
        <MaintenanceModeSection />

        {/* Emergency Restore */}
        <SettingSection icon={Shield} title="Emergency Restore">
          <p className="font-mono text-[10px] text-muted-foreground -mt-2 leading-relaxed">
            If the admin panel is inaccessible, use this endpoint to restore
            your most recent backup programmatically. Set the{" "}
            <code className="font-mono bg-secondary/40 px-1 rounded text-accent">
              EMERGENCY_RESTORE_TOKEN
            </code>{" "}
            environment variable — it is NOT stored in the config table.
          </p>
          <div className="space-y-3">
            <div>
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-1.5">
                Endpoint
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-md border border-border/40 bg-secondary/20 px-3 py-2 font-mono text-xs text-foreground break-all">
                  POST /api/admin/emergency-restore
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  className="font-mono text-xs h-9 shrink-0 gap-1.5"
                  onClick={() => {
                    navigator.clipboard
                      .writeText("POST /api/admin/emergency-restore")
                      .then(() => toast.success("Copied to clipboard"))
                      .catch(() => {});
                  }}
                  data-ocid="copy-emergency-endpoint-btn"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </Button>
              </div>
            </div>
            <div>
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-1.5">
                Request Body
              </p>
              <pre className="rounded-md border border-border/40 bg-secondary/20 px-3 py-3 font-mono text-xs text-muted-foreground overflow-x-auto">
                {`{
  "token": "<EMERGENCY_RESTORE_TOKEN>",
  "backupId": "latest"
}`}
              </pre>
            </div>
            <div className="rounded-md border border-accent/20 bg-accent/5 px-3 py-2.5">
              <p className="font-mono text-[10px] text-accent">
                ⚠ Keep your EMERGENCY_RESTORE_TOKEN secret. If compromised,
                rotate it immediately in your environment settings.
              </p>
            </div>
          </div>
        </SettingSection>
      </div>

      {/* Bottom save */}
      <div className="mt-8 flex justify-end gap-2 items-center">
        {isDirty && (
          <p className="font-mono text-[10px] text-accent/70 flex items-center gap-1.5 mr-auto">
            <AlertTriangle className="w-3 h-3" />
            You have unsaved changes
          </p>
        )}
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!isDirty || updateSettings.isPending}
          className="font-mono text-xs gap-1.5 neon-border-blue glow-blue-sm"
          data-ocid="save-settings-bottom-btn"
        >
          <Save className="w-3 h-3" />
          {updateSettings.isPending ? "Saving…" : "Save All Changes"}
        </Button>
      </div>

      {/* Reset Dialog */}
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent className="bg-card border-primary/30 font-body">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-sm uppercase tracking-wider text-glow-blue text-primary">
              Reset Configuration
            </AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-xs text-muted-foreground">
              This will reset all settings to factory defaults. You can save or
              discard afterward.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono text-xs">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              className="font-mono text-xs bg-destructive hover:bg-destructive/80"
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}

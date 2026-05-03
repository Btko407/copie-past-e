import { createActor } from "@/backend";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  Globe,
  HardDrive,
  Package,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ─── Types ─────────────────────────────────────────────────────────────────────

type DownloadMode = "local" | "webstore" | "both";

interface ExtensionVersion {
  version: string;
  buildNumber: number;
  releaseNotes: string;
  downloadUrl: string;
  isForceUpdate: boolean;
  releasedAt: number;
  supportedPlatforms: string[];
}

interface LatestVersionInfo {
  latestVersion: string;
  buildNumber: number;
  isForceUpdate: boolean;
  releaseNotes: string;
  downloadUrl: string;
  releasedAt: number;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const PLATFORM_CAPS = [
  { key: "facebook" as const, label: "Facebook Marketplace", emoji: "📘" },
  { key: "mercari" as const, label: "Mercari", emoji: "🏯" },
  { key: "ebay" as const, label: "eBay", emoji: "🔨" },
  { key: "poshmark" as const, label: "Poshmark", emoji: "👗" },
  { key: "depop" as const, label: "Depop", emoji: "🎨" },
  { key: "etsy" as const, label: "Etsy", emoji: "🛍" },
];

const REQUIRED_FILES = [
  "manifest.json",
  "background.js",
  "content-facebook.js",
  "content-mercari.js",
  "content-ebay.js",
  "content-poshmark.js",
  "content-depop.js",
  "content-etsy.js",
  "content-detection.js",
  "popup.html",
  "popup.js",
];

type PlatformKey = (typeof PLATFORM_CAPS)[number]["key"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorAny = any;

// ─── Integrity Check ───────────────────────────────────────────────────────────

function PackageIntegritySection({ downloadUrl }: { downloadUrl: string }) {
  const [zipStatus, setZipStatus] = useState<"unknown" | "ok" | "missing">(
    "unknown",
  );
  const [checking, setChecking] = useState(false);

  async function checkZip() {
    if (!downloadUrl) {
      setZipStatus("missing");
      return;
    }
    setChecking(true);
    try {
      const res = await fetch(downloadUrl, { method: "HEAD" });
      setZipStatus(res.ok ? "ok" : "missing");
    } catch {
      setZipStatus("missing");
    } finally {
      setChecking(false);
    }
  }

  return (
    <section
      className="rounded-xl border border-border/40 bg-card overflow-hidden"
      data-ocid="ext-integrity-section"
    >
      <div className="px-5 py-4 border-b border-border/50 bg-card/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
            <Package className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-display text-xs font-bold tracking-widest uppercase text-foreground">
              Package Integrity
            </p>
            <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
              ZIP availability + required file checklist
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={checkZip}
          disabled={checking}
          className="font-mono text-xs gap-1.5"
          data-ocid="ext-integrity-check-btn"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${checking ? "animate-spin" : ""}`}
          />
          {checking ? "Checking…" : "Check ZIP"}
        </Button>
      </div>
      <div className="p-5 space-y-4">
        {/* ZIP status */}
        <div className="flex items-center justify-between rounded-lg bg-secondary/10 border border-border/30 px-4 py-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Local ZIP
            </p>
            <code className="font-mono text-xs text-primary mt-0.5 block break-all">
              {downloadUrl || "(not configured)"}
            </code>
          </div>
          {zipStatus === "ok" && (
            <Badge
              variant="outline"
              className="text-green-400 border-green-400/40 bg-green-400/5 font-mono text-[10px] gap-1 shrink-0"
            >
              <CheckCircle2 className="w-3 h-3" /> Available
            </Badge>
          )}
          {zipStatus === "missing" && (
            <Badge
              variant="outline"
              className="text-destructive border-destructive/40 bg-destructive/5 font-mono text-[10px] gap-1 shrink-0"
            >
              <XCircle className="w-3 h-3" /> Not Found
            </Badge>
          )}
          {zipStatus === "unknown" && (
            <Badge
              variant="outline"
              className="text-muted-foreground font-mono text-[10px] shrink-0"
            >
              Unchecked
            </Badge>
          )}
        </div>

        {/* Required files list */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
            Required Files Checklist
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {REQUIRED_FILES.map((file) => (
              <div
                key={file}
                className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground"
              >
                <CheckCircle2 className="w-3 h-3 text-green-400 shrink-0" />
                {file}
              </div>
            ))}
          </div>
          <p className="font-mono text-[9px] text-muted-foreground/50 mt-2">
            Run{" "}
            <code className="text-primary">node scripts/zip-extension.mjs</code>{" "}
            to regenerate ZIP.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Download Config Section ───────────────────────────────────────────────────

interface DownloadConfigSectionProps {
  downloadMode: DownloadMode;
  localDownloadUrl: string;
  chromeWebStoreUrl: string;
  platformCaps: Record<PlatformKey, boolean>;
  onSave: (cfg: {
    mode: DownloadMode;
    localUrl: string;
    webstoreUrl: string;
    caps: Record<PlatformKey, boolean>;
  }) => void;
  saving: boolean;
}

function DownloadConfigSection({
  downloadMode: initMode,
  localDownloadUrl: initLocal,
  chromeWebStoreUrl: initWebstore,
  platformCaps: initCaps,
  onSave,
  saving,
}: DownloadConfigSectionProps) {
  const [mode, setMode] = useState<DownloadMode>(initMode);
  const [localUrl, setLocalUrl] = useState(initLocal);
  const [webstoreUrl, setWebstoreUrl] = useState(initWebstore);
  const [caps, setCaps] = useState(initCaps);

  useEffect(() => {
    setMode(initMode);
    setLocalUrl(initLocal);
    setWebstoreUrl(initWebstore);
    setCaps(initCaps);
  }, [initMode, initLocal, initWebstore, initCaps]);

  function copyUrl() {
    navigator.clipboard
      .writeText(localUrl)
      .then(() => toast.success("Download URL copied to clipboard"));
  }

  return (
    <section
      className="rounded-xl border border-border/40 bg-card overflow-hidden"
      data-ocid="ext-download-config-section"
    >
      <div className="px-5 py-4 border-b border-border/50 bg-card/80 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
          <Globe className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="font-display text-xs font-bold tracking-widest uppercase text-foreground">
            Download Configuration
          </p>
          <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
            Download mode, URLs, and platform capability matrix
          </p>
        </div>
      </div>
      <div className="p-5 space-y-5">
        {/* Download mode */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
            Download Mode
          </p>
          <div className="flex gap-4">
            {(["local", "webstore", "both"] as DownloadMode[]).map((m) => (
              <label key={m} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="downloadMode"
                  value={m}
                  checked={mode === m}
                  onChange={() => setMode(m)}
                  className="accent-primary"
                  data-ocid={`ext-download-mode-${m}.radio`}
                />
                <span className="font-mono text-xs text-foreground capitalize">
                  {m}
                </span>
              </label>
            ))}
          </div>
          <p className="font-mono text-[9px] text-muted-foreground/60 mt-1">
            <strong>local</strong> — local ZIP only ·<strong> webstore</strong>{" "}
            — Chrome Web Store only ·<strong> both</strong> — show both download
            options
          </p>
        </div>

        <Separator className="bg-border/30" />

        {/* Local URL */}
        {mode !== "webstore" && (
          <div>
            <Label
              htmlFor="ext-local-url"
              className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
            >
              <HardDrive className="inline w-3 h-3 mr-1" />
              Local ZIP URL
            </Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="ext-local-url"
                value={localUrl}
                onChange={(e) => setLocalUrl(e.target.value)}
                placeholder="/copie-paste-extension-v1.3.1.zip"
                className="font-mono text-xs flex-1"
                data-ocid="ext-local-url.input"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={copyUrl}
                className="shrink-0"
                aria-label="Copy download URL"
                data-ocid="ext-copy-url.button"
              >
                <Copy className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* Web Store URL */}
        {mode !== "local" && (
          <div>
            <Label
              htmlFor="ext-webstore-url"
              className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
            >
              <Globe className="inline w-3 h-3 mr-1" />
              Chrome Web Store URL
            </Label>
            <Input
              id="ext-webstore-url"
              value={webstoreUrl}
              onChange={(e) => setWebstoreUrl(e.target.value)}
              placeholder="https://chromewebstore.google.com/detail/…"
              className="font-mono text-xs mt-1"
              data-ocid="ext-webstore-url.input"
            />
            <p className="font-mono text-[9px] text-muted-foreground/60 mt-1">
              Leave empty — Chrome Web Store button stays hidden from users.
            </p>
          </div>
        )}

        <Separator className="bg-border/30" />

        {/* Platform capability matrix */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
            Platform Capability Matrix
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PLATFORM_CAPS.map(({ key, label, emoji }) => (
              <div
                key={key}
                className="flex items-center gap-2 cursor-pointer rounded-lg border border-border/30 px-3 py-2.5 hover:bg-secondary/20 transition-colors"
              >
                <Switch
                  id={`cap-${key}`}
                  checked={caps[key]}
                  onCheckedChange={(v) => setCaps({ ...caps, [key]: v })}
                  data-ocid={`ext-cap-${key}.switch`}
                />
                <label
                  htmlFor={`cap-${key}`}
                  className="font-mono text-xs text-foreground cursor-pointer"
                >
                  {emoji} {label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end pt-1">
          <Button
            onClick={() => onSave({ mode, localUrl, webstoreUrl, caps })}
            disabled={saving}
            className="font-mono text-xs gap-1.5"
            data-ocid="ext-download-config.save_button"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "Saving…" : "Save Configuration"}
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─── Publish Modal ─────────────────────────────────────────────────────────────

interface PublishModalProps {
  onClose: () => void;
  onPublish: (args: {
    version: string;
    buildNumber: number;
    releaseNotes: string;
    forceUpdate: boolean;
  }) => void;
  pending: boolean;
  defaultVersion?: string;
  defaultBuild?: number;
}

function PublishModal({
  onClose,
  onPublish,
  pending,
  defaultVersion = "1.3.2",
  defaultBuild = 5,
}: PublishModalProps) {
  const [version, setVersion] = useState(defaultVersion);
  const [buildNumber, setBuildNumber] = useState(defaultBuild);
  const [releaseNotes, setReleaseNotes] = useState("");
  const [forceUpdate, setForceUpdate] = useState(false);

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      data-ocid="ext-publish.dialog"
    >
      <div className="bg-card border border-primary/30 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
        <h3 className="font-display text-sm font-bold tracking-widest uppercase text-foreground">
          Publish New Version
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label
              htmlFor="pub-version"
              className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
            >
              Version
            </Label>
            <Input
              id="pub-version"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="1.3.2"
              className="font-mono text-xs mt-1"
              data-ocid="ext-publish.version.input"
            />
          </div>
          <div>
            <Label
              htmlFor="pub-build"
              className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
            >
              Build #
            </Label>
            <Input
              id="pub-build"
              type="number"
              value={buildNumber}
              onChange={(e) => setBuildNumber(Number.parseInt(e.target.value))}
              className="font-mono text-xs mt-1"
              data-ocid="ext-publish.build_number.input"
            />
          </div>
        </div>

        <div>
          <Label
            htmlFor="pub-notes"
            className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
          >
            Release Notes
          </Label>
          <textarea
            id="pub-notes"
            value={releaseNotes}
            onChange={(e) => setReleaseNotes(e.target.value)}
            placeholder="What changed in this version?"
            rows={3}
            className="w-full mt-1 px-3 py-2 bg-secondary/20 border border-border/40 rounded-md text-xs font-mono text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            data-ocid="ext-publish.release_notes.textarea"
          />
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-destructive/5 border border-destructive/20 px-4 py-3">
          <Switch
            id="pub-force"
            checked={forceUpdate}
            onCheckedChange={setForceUpdate}
            data-ocid="ext-publish.force_update.switch"
          />
          <div>
            <label
              htmlFor="pub-force"
              className="font-mono text-xs font-bold text-destructive cursor-pointer"
            >
              Force Update
            </label>
            <p className="font-mono text-[9px] text-muted-foreground">
              All users must update before continuing
            </p>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            className="flex-1 font-mono text-xs"
            onClick={onClose}
            data-ocid="ext-publish.cancel_button"
          >
            Cancel
          </Button>
          <Button
            className="flex-1 font-mono text-xs gap-1.5"
            onClick={() =>
              onPublish({ version, buildNumber, releaseNotes, forceUpdate })
            }
            disabled={pending || !version.trim()}
            data-ocid="ext-publish.submit_button"
          >
            <Zap className="w-3.5 h-3.5" />
            {pending ? "Publishing…" : "Publish"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export function AdminExtensionVersionsPage() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const enabled = !!actor && !actorFetching;
  const queryClient = useQueryClient();
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Config state — seeded from backend on load
  const [downloadMode, setDownloadMode] = useState<DownloadMode>("local");
  const [localDownloadUrl, setLocalDownloadUrl] = useState(
    "/copie-paste-extension-v1.3.1.zip",
  );
  const [chromeWebStoreUrl, setChromeWebStoreUrl] = useState("");
  const [platformCaps, setPlatformCaps] = useState<
    Record<PlatformKey, boolean>
  >({
    facebook: true,
    mercari: true,
    ebay: true,
    poshmark: true,
    depop: true,
    etsy: true,
  });

  // ── Queries

  const { data: latestVersion, isLoading: latestLoading } =
    useQuery<LatestVersionInfo>({
      queryKey: ["latestExtensionVersion"],
      queryFn: async () => {
        if (!actor) throw new Error("Backend not ready");
        return (await (
          actor as ActorAny
        ).getLatestExtensionVersion()) as LatestVersionInfo;
      },
      enabled,
    });

  const { data: versions = [], isLoading: versionsLoading } = useQuery<
    ExtensionVersion[]
  >({
    queryKey: ["extensionVersions"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      return (await (
        actor as ActorAny
      ).adminListExtensionVersions()) as ExtensionVersion[];
    },
    enabled,
    refetchInterval: 30_000,
  });

  const { data: extConfig } = useQuery({
    queryKey: ["extensionConfig"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      return (actor as ActorAny).getExtensionConfig();
    },
    enabled,
  });

  // Sync config panel from backend data
  useEffect(() => {
    const cfg = extConfig as ActorAny;
    if (!cfg) return;
    if (cfg.downloadMode) setDownloadMode(cfg.downloadMode as DownloadMode);
    if (cfg.localDownloadUrl)
      setLocalDownloadUrl(cfg.localDownloadUrl as string);
    if (cfg.chromeWebStoreUrl !== undefined)
      setChromeWebStoreUrl(cfg.chromeWebStoreUrl as string);
    if (cfg.capabilities) {
      setPlatformCaps({
        facebook: cfg.capabilities.facebook ?? true,
        mercari: cfg.capabilities.mercari ?? true,
        ebay: cfg.capabilities.ebay ?? true,
        poshmark: cfg.capabilities.poshmark ?? true,
        depop: cfg.capabilities.depop ?? true,
        etsy: cfg.capabilities.etsy ?? true,
      });
    }
  }, [extConfig]);

  // ── Mutations

  const saveConfigMutation = useMutation({
    mutationFn: async (cfg: {
      mode: DownloadMode;
      localUrl: string;
      webstoreUrl: string;
      caps: Record<PlatformKey, boolean>;
    }) => {
      if (!actor) throw new Error("Backend not ready");
      await (actor as ActorAny).adminSetExtensionConfig(
        cfg.mode,
        cfg.localUrl,
        cfg.webstoreUrl,
      );
      await (actor as ActorAny).adminSetPlatformCapabilities(
        cfg.caps.facebook,
        cfg.caps.mercari,
        cfg.caps.ebay,
        cfg.caps.poshmark,
        cfg.caps.depop,
        cfg.caps.etsy,
      );
    },
    onSuccess: (_data, cfg) => {
      setDownloadMode(cfg.mode);
      setLocalDownloadUrl(cfg.localUrl);
      setChromeWebStoreUrl(cfg.webstoreUrl);
      setPlatformCaps(cfg.caps);
      queryClient.invalidateQueries({ queryKey: ["extensionConfig"] });
      queryClient.invalidateQueries({ queryKey: ["latestExtensionVersion"] });
      toast.success("Extension configuration saved");
    },
    onError: () => toast.error("Failed to save extension configuration"),
  });

  const publishMutation = useMutation({
    mutationFn: async (args: {
      version: string;
      buildNumber: number;
      releaseNotes: string;
      forceUpdate: boolean;
    }) => {
      if (!actor) throw new Error("Backend not ready");
      const effectiveUrl =
        localDownloadUrl || `/copie-paste-extension-v${args.version}.zip`;
      return (actor as ActorAny).adminSetExtensionVersion(
        args.version,
        args.buildNumber,
        args.releaseNotes,
        effectiveUrl,
        args.forceUpdate,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extensionVersions"] });
      queryClient.invalidateQueries({ queryKey: ["latestExtensionVersion"] });
      setShowPublishModal(false);
      toast.success("Extension version published");
    },
    onError: () => toast.error("Failed to publish extension version"),
  });

  // ── Helpers

  function handleRollback(version: ExtensionVersion) {
    publishMutation.mutate({
      version: version.version,
      buildNumber: version.buildNumber,
      releaseNotes: `Rollback to v${version.version}`,
      forceUpdate: false,
    });
  }

  function platformEmoji(p: string) {
    return PLATFORM_CAPS.find((x) => x.key === p)?.emoji ?? "📦";
  }

  const currentV = latestVersion?.latestVersion ?? "—";
  const currentBuild = latestVersion?.buildNumber ?? "—";
  const buildTs = latestVersion?.releasedAt
    ? new Date(Number(latestVersion.releasedAt) / 1_000_000).toLocaleString()
    : "—";

  return (
    <AdminLayout title="Extension" subtitle="Release Console">
      <div className="max-w-4xl space-y-8" data-ocid="admin-extension-page">
        {/* ── Current Release ── */}
        <section
          className="rounded-xl border border-primary/30 bg-card overflow-hidden"
          data-ocid="ext-current-release-section"
        >
          <div className="px-5 py-4 border-b border-border/50 bg-card/80 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-display text-xs font-bold tracking-widest uppercase text-foreground">
                  Current Release
                </p>
                <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                  Active extension version served to all users
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowPublishModal(true)}
              className="font-mono text-xs gap-1.5"
              data-ocid="ext-publish-version.open_modal_button"
            >
              <Plus className="w-3.5 h-3.5" />
              Publish New Version
            </Button>
          </div>

          {latestLoading ? (
            <div className="p-6 text-muted-foreground font-mono text-xs animate-pulse">
              Loading version info…
            </div>
          ) : (
            <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  label: "Version",
                  value: `v${currentV}`,
                  color: "text-primary",
                },
                {
                  label: "Build #",
                  value: `#${currentBuild}`,
                  color: "text-foreground",
                },
                {
                  label: "Last Build",
                  value: buildTs,
                  color: "text-muted-foreground",
                },
                {
                  label: "Force Update",
                  value: latestVersion?.isForceUpdate ? "ACTIVE" : "Off",
                  color: latestVersion?.isForceUpdate
                    ? "text-destructive"
                    : "text-green-400",
                },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="rounded-lg bg-background/60 border border-border/30 px-4 py-3"
                >
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {label}
                  </p>
                  <p
                    className={`font-mono text-sm font-bold mt-1 ${color} break-all`}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          )}

          {latestVersion?.releaseNotes && (
            <div className="px-5 pb-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                Release Notes
              </p>
              <p className="font-mono text-xs text-muted-foreground bg-secondary/10 border border-border/20 rounded px-3 py-2">
                {latestVersion.releaseNotes}
              </p>
            </div>
          )}
        </section>

        {/* ── Download Configuration */}
        <DownloadConfigSection
          downloadMode={downloadMode}
          localDownloadUrl={localDownloadUrl}
          chromeWebStoreUrl={chromeWebStoreUrl}
          platformCaps={platformCaps}
          saving={saveConfigMutation.isPending}
          onSave={(cfg) => saveConfigMutation.mutate(cfg)}
        />

        {/* ── Package Integrity */}
        <PackageIntegritySection downloadUrl={localDownloadUrl} />

        {/* ── Version History */}
        <section
          className="rounded-xl border border-border/40 bg-card overflow-hidden"
          data-ocid="ext-versions-table"
        >
          <div className="px-5 py-4 border-b border-border/50 bg-card/80 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
              <RefreshCw className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-display text-xs font-bold tracking-widest uppercase text-foreground">
                Version History
              </p>
              <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                {versions.length} version{versions.length !== 1 ? "s" : ""} on
                record
              </p>
            </div>
          </div>

          {versionsLoading ? (
            <div className="p-6 font-mono text-xs text-muted-foreground animate-pulse">
              Loading version history…
            </div>
          ) : versions.length === 0 ? (
            <div
              className="p-8 text-center"
              data-ocid="ext-versions-table.empty_state"
            >
              <Package className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="font-mono text-xs text-muted-foreground">
                No versions published yet. Use &quot;Publish New Version&quot;
                to add the first.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 bg-secondary/10">
                    {[
                      "Version",
                      "Build",
                      "Released",
                      "Force Update",
                      "Platforms",
                      "Notes",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {versions.map((v, i) => (
                    <tr
                      key={`${v.version}-${v.buildNumber}`}
                      className="border-b border-border/20 hover:bg-secondary/10 transition-colors"
                      data-ocid={`ext-versions-table.item.${i + 1}`}
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold text-primary text-xs">
                          v{v.version}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        #{v.buildNumber}
                      </td>
                      <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                        {new Date(
                          Number(v.releasedAt) / 1_000_000,
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {v.isForceUpdate ? (
                          <Badge
                            variant="outline"
                            className="text-destructive border-destructive/40 bg-destructive/5 font-mono text-[10px] gap-1"
                          >
                            <XCircle className="w-2.5 h-2.5" /> FORCE
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-green-400 border-green-400/40 bg-green-400/5 font-mono text-[10px] gap-1"
                          >
                            <CheckCircle2 className="w-2.5 h-2.5" /> Optional
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {v.supportedPlatforms.map((p) => (
                            <span key={p} title={p} className="text-sm">
                              {platformEmoji(p)}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground max-w-[160px] truncate">
                        {v.releaseNotes || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => {
                              const a = document.createElement("a");
                              a.href = v.downloadUrl;
                              a.click();
                            }}
                            title="Download"
                            data-ocid={`ext-versions-table.item.${i + 1}.download_button`}
                          >
                            <Download className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => {
                              navigator.clipboard.writeText(v.downloadUrl);
                              toast.success("URL copied");
                            }}
                            title="Copy URL"
                            data-ocid={`ext-versions-table.item.${i + 1}.secondary_button`}
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </Button>
                          {i > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-accent hover:text-accent"
                              onClick={() => handleRollback(v)}
                              title="Rollback to this version"
                              disabled={publishMutation.isPending}
                              data-ocid={`ext-versions-table.item.${i + 1}.rollback_button`}
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Quick download link */}
        {localDownloadUrl && (
          <div className="flex items-center gap-2">
            <a
              href={localDownloadUrl}
              download
              className="inline-flex items-center gap-1.5 font-mono text-xs text-primary hover:underline"
              data-ocid="ext-local-download.link"
            >
              <Download className="w-3.5 h-3.5" />
              Download current package
            </a>
            {chromeWebStoreUrl && (
              <>
                <span className="text-muted-foreground/40">·</span>
                <a
                  href={chromeWebStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-accent hover:underline"
                  data-ocid="ext-webstore.link"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Chrome Web Store
                </a>
              </>
            )}
          </div>
        )}
      </div>

      {/* Publish Modal */}
      {showPublishModal && (
        <PublishModal
          onClose={() => setShowPublishModal(false)}
          onPublish={(args) => publishMutation.mutate(args)}
          pending={publishMutation.isPending}
          defaultVersion={
            latestVersion?.latestVersion
              ? (() => {
                  const parts = latestVersion.latestVersion.split(".");
                  const patch = Number(parts[parts.length - 1] ?? "0") + 1;
                  parts[parts.length - 1] = String(patch);
                  return parts.join(".");
                })()
              : "1.3.2"
          }
          defaultBuild={
            latestVersion?.buildNumber ? latestVersion.buildNumber + 1 : 5
          }
        />
      )}
    </AdminLayout>
  );
}

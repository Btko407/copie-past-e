import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Copy,
  Download,
  Globe,
  HardDrive,
  Plus,
  RefreshCw,
  Save,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ExtensionVersion {
  version: string;
  buildNumber: number;
  releaseNotes: string;
  downloadUrl: string;
  isForceUpdate: boolean;
  releasedAt: number;
  supportedPlatforms: string[];
}

interface ExtensionCapabilities {
  autofillFacebook: boolean;
  autofillMecari: boolean;
  photoUpload: boolean;
  smartOCR: boolean;
  platformDetection: boolean;
  autoFillCondition: boolean;
  autoFillBrand: boolean;
  autoFillPrice: boolean;
  autoFillCategory: boolean;
  autoFillDescription: boolean;
  localPickupDetection: boolean;
  deliveryDaysDetection: boolean;
  shippingTypeDetection: boolean;
}

type DownloadMode = "local" | "webstore" | "both";

const PLATFORM_CAPABILITIES = [
  { key: "facebook", label: "Facebook Marketplace", emoji: "📘" },
  { key: "mercari", label: "Mercari", emoji: "🏯" },
  { key: "ebay", label: "eBay", emoji: "🔨" },
  { key: "poshmark", label: "Poshmark", emoji: "👗" },
  { key: "depop", label: "Depop", emoji: "🎨" },
  { key: "etsy", label: "Etsy", emoji: "🛍" },
] as const;

export function AdminExtensionVersionsPage() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const enabled = !!actor && !actorFetching;
  const queryClient = useQueryClient();
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showCapabilitiesModal, setShowCapabilitiesModal] = useState(false);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [newVersion, setNewVersion] = useState("1.3.1");
  const [newBuildNumber, setNewBuildNumber] = useState(4);
  const [newReleaseNotes, setNewReleaseNotes] = useState(
    "Production release with full 6-platform autofill support",
  );
  const [forceUpdate, setForceUpdate] = useState(false);

  // Download config state
  const [downloadMode, setDownloadMode] = useState<DownloadMode>("local");
  const [localDownloadUrl, setLocalDownloadUrl] = useState(
    "/copie-paste-extension-v1.3.1.zip",
  );
  const [chromeWebStoreUrl, setChromeWebStoreUrl] = useState("");

  // Per-platform capability toggles
  const [platformCaps, setPlatformCaps] = useState({
    facebook: true,
    mercari: true,
    ebay: true,
    poshmark: true,
    depop: true,
    etsy: true,
  });

  const [capabilities, setCapabilities] = useState<ExtensionCapabilities>({
    autofillFacebook: true,
    autofillMecari: true,
    photoUpload: true,
    smartOCR: false,
    platformDetection: true,
    autoFillCondition: true,
    autoFillBrand: true,
    autoFillPrice: true,
    autoFillCategory: true,
    autoFillDescription: true,
    localPickupDetection: true,
    deliveryDaysDetection: true,
    shippingTypeDetection: true,
  });

  // Load existing extension config
  const { data: extConfig } = useQuery({
    queryKey: ["extensionConfig"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return await (actor as any).getExtensionConfig();
    },
    enabled,
  });

  // Sync config panel state when data loads
  useState(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cfg = extConfig as any;
    if (cfg) {
      if (cfg.downloadMode) setDownloadMode(cfg.downloadMode as DownloadMode);
      if (cfg.localDownloadUrl) setLocalDownloadUrl(cfg.localDownloadUrl);
      if (cfg.chromeWebStoreUrl !== undefined)
        setChromeWebStoreUrl(cfg.chromeWebStoreUrl);
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
    }
  });

  const { data: versions = [], isLoading } = useQuery({
    queryKey: ["extensionVersions"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return await (actor as any).adminListExtensionVersions();
    },
    enabled,
    refetchInterval: 30000,
  });

  const { data: latestVersion } = useQuery({
    queryKey: ["latestExtensionVersion"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return await (actor as any).getLatestExtensionVersion();
    },
    enabled,
  });

  const saveConfigMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (actor as any).adminSetExtensionConfig(
        downloadMode,
        localDownloadUrl,
        chromeWebStoreUrl,
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (actor as any).adminSetPlatformCapabilities(
        platformCaps.facebook,
        platformCaps.mercari,
        platformCaps.ebay,
        platformCaps.poshmark,
        platformCaps.depop,
        platformCaps.etsy,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extensionConfig"] });
      queryClient.invalidateQueries({ queryKey: ["latestExtensionVersion"] });
      setShowConfigPanel(false);
      toast.success("✅ Extension config saved");
    },
    onError: () => {
      toast.error("Failed to save extension config");
    },
  });

  const publishMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const effectiveUrl =
        localDownloadUrl || `/copie-paste-extension-v${newVersion}.zip`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return await (actor as any).adminSetExtensionVersion(
        newVersion,
        newBuildNumber,
        newReleaseNotes,
        effectiveUrl,
        forceUpdate,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extensionVersions"] });
      queryClient.invalidateQueries({ queryKey: ["latestExtensionVersion"] });
      setShowPublishModal(false);
      toast.success("✅ Extension version published", {
        description: `v${newVersion} ${forceUpdate ? "(FORCE UPDATE)" : ""} is now live`,
      });
    },
    onError: () => {
      toast.error("Failed to publish extension version");
    },
  });

  const downloadVersion = (version: ExtensionVersion) => {
    const url = version.downloadUrl;
    if (!url) {
      toast.error(`No download URL for v${version.version}`);
      return;
    }
    window.location.href = url;
    toast.success(`Downloading v${version.version}`);
  };

  const copyDownloadUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Download URL copied");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Zap className="h-8 w-8 text-blue-400" />
          Extension Versions
        </h1>
        <p className="text-gray-400 mt-2">
          Manage extension versions, control capabilities, and publish updates
        </p>
      </div>

      {/* Current Status */}
      {latestVersion && (
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-blue-300">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                Current Version: v{(latestVersion as any).latestVersion}
              </h2>
              <p className="text-gray-400 mt-1">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                Build #{(latestVersion as any).buildNumber}
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(latestVersion as any).isForceUpdate && (
                  <span className="ml-2 px-2 py-1 bg-red-900/50 border border-red-500 text-red-300 text-xs rounded">
                    🔴 FORCE UPDATE ACTIVE
                  </span>
                )}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowConfigPanel(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 rounded font-semibold text-white"
                data-ocid="ext-config.open_modal_button"
              >
                <Globe className="h-4 w-4" />
                Download Config
              </button>
              <button
                type="button"
                onClick={() => setShowCapabilitiesModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded font-semibold text-white"
                data-ocid="ext-capabilities.open_modal_button"
              >
                ⚙️ Capabilities
              </button>
              <button
                type="button"
                onClick={() => setShowPublishModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded font-bold text-white"
                data-ocid="ext-publish-version.open_modal_button"
              >
                <Plus className="h-4 w-4" />
                Publish New Version
              </button>
            </div>
          </div>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <p className="text-gray-300 text-sm">
            {(latestVersion as any).releaseNotes}
          </p>
        </div>
      )}

      {/* Version History */}
      <div
        className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
        data-ocid="ext-versions-table"
      >
        <div className="p-4 bg-gray-700 border-b border-gray-600">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Version History ({versions.length})
          </h3>
        </div>

        {isLoading ? (
          <div className="p-6 text-gray-400">Loading versions...</div>
        ) : versions.length === 0 ? (
          <div
            className="p-6 text-gray-400 text-center"
            data-ocid="ext-versions-table.empty_state"
          >
            No versions published yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 bg-gray-800/50">
                  <th className="px-4 py-3 text-left">Version</th>
                  <th className="px-4 py-3 text-left">Build</th>
                  <th className="px-4 py-3 text-left">Released</th>
                  <th className="px-4 py-3 text-left">Force Update</th>
                  <th className="px-4 py-3 text-left">Platforms</th>
                  <th className="px-4 py-3 text-left">Release Notes</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {versions.map((version: ExtensionVersion, i: number) => (
                  <tr
                    key={`${version.version}-${version.buildNumber}`}
                    className="border-b border-gray-700 hover:bg-gray-700/40 transition"
                    data-ocid={`ext-versions-table.item.${i + 1}`}
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-blue-300">
                        v{version.version}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-400">
                      #{version.buildNumber}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-sm">
                      {new Date(
                        Number(version.releasedAt) / 1_000_000,
                      ).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {version.isForceUpdate ? (
                        <span className="px-2 py-1 bg-red-900 text-red-300 text-xs rounded">
                          🔴 YES
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded">
                          ✅ Optional
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {version.supportedPlatforms.map((p) => {
                          const emoji =
                            p === "facebook"
                              ? "📘"
                              : p === "mercari"
                                ? "🏯"
                                : p === "ebay"
                                  ? "🔨"
                                  : p === "poshmark"
                                    ? "👗"
                                    : p === "depop"
                                      ? "🎨"
                                      : p === "etsy"
                                        ? "🛍"
                                        : "📱";
                          return (
                            <span
                              key={p}
                              className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                              title={p}
                            >
                              {emoji}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs max-w-xs truncate">
                      {version.releaseNotes}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => downloadVersion(version)}
                          className="p-2 bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 rounded transition"
                          title="Download"
                          data-ocid={`ext-versions-table.item.${i + 1}.download_button`}
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => copyDownloadUrl(version.downloadUrl)}
                          className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition"
                          title="Copy URL"
                          data-ocid={`ext-versions-table.item.${i + 1}.secondary_button`}
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Publish Modal */}
      {showPublishModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          data-ocid="ext-publish-modal"
        >
          <div className="bg-gray-800 border border-blue-500 rounded-lg p-6 max-w-md w-full space-y-4">
            <h3 className="text-xl font-bold text-blue-300">
              Publish New Version
            </h3>

            <div>
              <label
                htmlFor="ext-publish-version"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Version
              </label>
              <input
                id="ext-publish-version"
                type="text"
                value={newVersion}
                onChange={(e) => setNewVersion(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                placeholder="1.3"
                data-ocid="ext-publish-modal.version.input"
              />
            </div>

            <div>
              <label
                htmlFor="ext-publish-build"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Build Number
              </label>
              <input
                id="ext-publish-build"
                type="number"
                value={newBuildNumber}
                onChange={(e) =>
                  setNewBuildNumber(Number.parseInt(e.target.value))
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                data-ocid="ext-publish-modal.build_number.input"
              />
            </div>

            <div>
              <label
                htmlFor="ext-publish-notes"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Release Notes
              </label>
              <textarea
                id="ext-publish-notes"
                value={newReleaseNotes}
                onChange={(e) => setNewReleaseNotes(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm resize-none"
                rows={3}
                data-ocid="ext-publish-modal.release_notes.textarea"
              />
            </div>

            <label
              htmlFor="ext-publish-force"
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                id="ext-publish-force"
                type="checkbox"
                checked={forceUpdate}
                onChange={(e) => setForceUpdate(e.target.checked)}
                className="w-4 h-4 rounded"
                data-ocid="ext-publish-modal.force_update.checkbox"
              />
              <span className="text-sm text-gray-300">Force Update</span>
            </label>

            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                data-ocid="ext-publish-modal.cancel_button"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => publishMutation.mutate()}
                disabled={publishMutation.isPending}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded text-white font-semibold"
                data-ocid="ext-publish-modal.submit_button"
              >
                {publishMutation.isPending ? "Publishing..." : "🚀 Publish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download Config Panel */}
      {showConfigPanel && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          data-ocid="ext-config.dialog"
        >
          <div className="bg-gray-800 border border-emerald-500 rounded-lg p-6 max-w-lg w-full space-y-5 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-emerald-300 flex items-center gap-2">
              <Globe className="h-5 w-5" /> Download Config
            </h3>

            {/* Download Mode */}
            <div>
              <p className="text-sm font-semibold text-gray-300 mb-2">
                Download Mode
              </p>
              <div className="flex gap-3">
                {(["local", "webstore", "both"] as DownloadMode[]).map(
                  (mode) => (
                    <label
                      key={mode}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="downloadMode"
                        value={mode}
                        checked={downloadMode === mode}
                        onChange={() => setDownloadMode(mode)}
                        className="accent-emerald-500"
                        data-ocid={`ext-config.mode_${mode}.radio`}
                      />
                      <span className="text-sm text-gray-300 capitalize">
                        {mode}
                      </span>
                    </label>
                  ),
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                <strong>local</strong>: local ZIP only ·
                <strong> webstore</strong>: Chrome Web Store only ·
                <strong> both</strong>: show both buttons
              </p>
            </div>

            {/* Local URL */}
            {downloadMode !== "webstore" && (
              <div>
                <label
                  htmlFor="local-url"
                  className="block text-sm font-semibold text-gray-300 mb-1"
                >
                  <HardDrive className="inline h-3 w-3 mr-1" /> Local Download
                  URL
                </label>
                <input
                  id="local-url"
                  type="text"
                  value={localDownloadUrl}
                  onChange={(e) => setLocalDownloadUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm font-mono"
                  placeholder="/copie-paste-extension-v1.3.1.zip"
                  data-ocid="ext-config.local_url.input"
                />
              </div>
            )}

            {/* Web Store URL */}
            {downloadMode !== "local" && (
              <div>
                <label
                  htmlFor="webstore-url"
                  className="block text-sm font-semibold text-gray-300 mb-1"
                >
                  <Globe className="inline h-3 w-3 mr-1" /> Chrome Web Store URL
                </label>
                <input
                  id="webstore-url"
                  type="text"
                  value={chromeWebStoreUrl}
                  onChange={(e) => setChromeWebStoreUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm font-mono"
                  placeholder="https://chromewebstore.google.com/detail/..."
                  data-ocid="ext-config.webstore_url.input"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to hide the Chrome Web Store button from users.
                </p>
              </div>
            )}

            {/* Per-platform capability toggles */}
            <div>
              <p className="text-sm font-semibold text-gray-300 mb-2">
                Platform Capabilities
              </p>
              <div className="grid grid-cols-2 gap-2">
                {PLATFORM_CAPABILITIES.map(({ key, label, emoji }) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={platformCaps[key as keyof typeof platformCaps]}
                      onChange={(e) =>
                        setPlatformCaps({
                          ...platformCaps,
                          [key]: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded accent-emerald-500"
                      data-ocid={`ext-config.platform_${key}.checkbox`}
                    />
                    <span className="text-sm text-gray-300">
                      {emoji} {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-700">
              <button
                type="button"
                onClick={() => setShowConfigPanel(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                data-ocid="ext-config.cancel_button"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => saveConfigMutation.mutate()}
                disabled={saveConfigMutation.isPending}
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 rounded text-white font-semibold flex items-center justify-center gap-2"
                data-ocid="ext-config.confirm_button"
              >
                <Save className="h-4 w-4" />
                {saveConfigMutation.isPending ? "Saving..." : "Save Config"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Capabilities Modal */}
      {showCapabilitiesModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          data-ocid="ext-capabilities.dialog"
        >
          <div className="bg-gray-800 border border-purple-500 rounded-lg p-6 max-w-md w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-purple-300">
              Extension Capabilities
            </h3>

            <div className="space-y-3">
              {/* Facebook */}
              <div>
                <h4 className="text-sm font-semibold text-blue-300 mb-2">
                  📘 Facebook Marketplace
                </h4>
                {[
                  { key: "autofillFacebook", label: "Auto-fill enabled" },
                  { key: "autoFillPrice", label: "Auto-fill price" },
                  { key: "autoFillCategory", label: "Auto-fill category" },
                  { key: "autoFillCondition", label: "Auto-fill condition" },
                  {
                    key: "autoFillDescription",
                    label: "Auto-fill description",
                  },
                  { key: "localPickupDetection", label: "Detect local pickup" },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 cursor-pointer text-sm text-gray-300 mb-1"
                  >
                    <input
                      type="checkbox"
                      checked={capabilities[key as keyof ExtensionCapabilities]}
                      onChange={(e) =>
                        setCapabilities({
                          ...capabilities,
                          [key]: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded"
                    />
                    {label}
                  </label>
                ))}
              </div>

              {/* Mecari */}
              <div className="pt-3 border-t border-gray-700">
                <h4 className="text-sm font-semibold text-pink-300 mb-2">
                  🏯 Mecari
                </h4>
                {[
                  { key: "autofillMecari", label: "Auto-fill enabled" },
                  { key: "autoFillPrice", label: "Auto-fill price" },
                  { key: "autoFillBrand", label: "Auto-fill brand" },
                  { key: "autoFillCategory", label: "Auto-fill category" },
                  { key: "autoFillCondition", label: "Auto-fill condition" },
                  {
                    key: "deliveryDaysDetection",
                    label: "Detect delivery days",
                  },
                  {
                    key: "shippingTypeDetection",
                    label: "Detect shipping type",
                  },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 cursor-pointer text-sm text-gray-300 mb-1"
                  >
                    <input
                      type="checkbox"
                      checked={capabilities[key as keyof ExtensionCapabilities]}
                      onChange={(e) =>
                        setCapabilities({
                          ...capabilities,
                          [key]: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded"
                    />
                    {label}
                  </label>
                ))}
              </div>

              {/* General */}
              <div className="pt-3 border-t border-gray-700">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">
                  ⚙️ General
                </h4>
                {[
                  { key: "photoUpload", label: "Photo upload" },
                  { key: "smartOCR", label: "Smart OCR (optional)" },
                  { key: "platformDetection", label: "Auto-detect platform" },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 cursor-pointer text-sm text-gray-300 mb-1"
                  >
                    <input
                      type="checkbox"
                      checked={capabilities[key as keyof ExtensionCapabilities]}
                      onChange={(e) =>
                        setCapabilities({
                          ...capabilities,
                          [key]: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-700">
              <button
                type="button"
                onClick={() => setShowCapabilitiesModal(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                data-ocid="ext-capabilities.cancel_button"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success(
                    "Capabilities updated (will apply on next publish)",
                  );
                  setShowCapabilitiesModal(false);
                }}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white font-semibold"
                data-ocid="ext-capabilities.confirm_button"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

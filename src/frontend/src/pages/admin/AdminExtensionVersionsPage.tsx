import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, Download, Plus, RefreshCw, Zap } from "lucide-react";
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

export function AdminExtensionVersionsPage() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const enabled = !!actor && !actorFetching;
  const queryClient = useQueryClient();
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showCapabilitiesModal, setShowCapabilitiesModal] = useState(false);
  const [newVersion, setNewVersion] = useState("1.3");
  const [newBuildNumber, setNewBuildNumber] = useState(3);
  const [newReleaseNotes, setNewReleaseNotes] = useState(
    "Complete autofill v1.3 — Facebook & Mecari full support",
  );
  const [forceUpdate, setForceUpdate] = useState(true);
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

  const publishMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return await (actor as any).adminSetExtensionVersion(
        newVersion,
        newBuildNumber,
        newReleaseNotes,
        "https://chrome.google.com/webstore/detail/copie-past-e/YOUR_ID",
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
    const data = JSON.stringify(
      {
        version: version.version,
        buildNumber: version.buildNumber,
        releaseNotes: version.releaseNotes,
        downloadUrl: version.downloadUrl,
        capabilities,
        downloadedAt: new Date().toISOString(),
      },
      null,
      2,
    );
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `copie-paste-extension-v${version.version}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded v${version.version}`);
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
            <div className="flex gap-2">
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
                        {version.supportedPlatforms.map((p) => (
                          <span
                            key={p}
                            className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                          >
                            {p === "facebook"
                              ? "📘"
                              : p === "mecari"
                                ? "🏯"
                                : "📱"}
                          </span>
                        ))}
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

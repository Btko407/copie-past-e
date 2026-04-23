import { createActor } from "@/backend";
import type { ExtensionUpdateCheck, ExtensionVersion } from "@/backend.d.ts";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle2,
  Plus,
  RefreshCw,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorAny = any;

function platformEmoji(p: string): string {
  if (p === "facebook") return "📘";
  if (p === "mecari") return "🏯";
  return "📱";
}

function nsToDate(ts: bigint | number): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString();
}

// ─── Publish Modal ────────────────────────────────────────────────────────────

interface PublishModalProps {
  onClose: () => void;
  onPublish: (
    version: string,
    buildNumber: number,
    releaseNotes: string,
    forceUpdate: boolean,
  ) => void;
  isPending: boolean;
}

function PublishModal({ onClose, onPublish, isPending }: PublishModalProps) {
  const [version, setVersion] = useState("1.3");
  const [buildNumber, setBuildNumber] = useState(3);
  const [releaseNotes, setReleaseNotes] = useState(
    "Complete autofill v1.3 — Facebook & Mecari full support",
  );
  const [forceUpdate, setForceUpdate] = useState(true);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="presentation"
      data-ocid="ext-publish-modal-backdrop"
    >
      <div
        className="w-full max-w-md rounded-xl border border-blue-500/60 bg-gray-900 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        data-ocid="ext-publish-modal"
      >
        <div className="bg-gradient-to-r from-blue-900/60 to-purple-900/40 px-5 py-4 border-b border-blue-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-400" />
            <h3 className="font-display text-sm font-bold tracking-wider text-white uppercase">
              Publish New Version
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-lg leading-none"
            aria-label="Close"
            data-ocid="ext-publish-modal.close_button"
          >
            ×
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label
              htmlFor="ext-version"
              className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5"
            >
              Version Number
            </label>
            <input
              id="ext-version"
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono"
              placeholder="1.3"
              data-ocid="ext-publish-modal.version.input"
            />
          </div>

          <div>
            <label
              htmlFor="ext-build"
              className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5"
            >
              Build Number
            </label>
            <input
              id="ext-build"
              type="number"
              value={buildNumber}
              onChange={(e) =>
                setBuildNumber(Number.parseInt(e.target.value) || 1)
              }
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono"
              data-ocid="ext-publish-modal.build_number.input"
            />
          </div>

          <div>
            <label
              htmlFor="ext-notes"
              className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5"
            >
              Release Notes
            </label>
            <textarea
              id="ext-notes"
              value={releaseNotes}
              onChange={(e) => setReleaseNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono resize-none"
              data-ocid="ext-publish-modal.release_notes.textarea"
            />
          </div>

          <label
            className="flex items-center gap-3 cursor-pointer"
            htmlFor="ext-force"
          >
            <input
              id="ext-force"
              type="checkbox"
              checked={forceUpdate}
              onChange={(e) => setForceUpdate(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500"
              data-ocid="ext-publish-modal.force_update.checkbox"
            />
            <span className="text-sm text-gray-300">
              🔴 Force Update (all users must update)
            </span>
          </label>

          {forceUpdate && (
            <div className="flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-900/20 px-3 py-2.5">
              <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-300 leading-relaxed">
                All users will be notified to update. Extension will stop
                functioning until updated.
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 font-mono text-xs"
              onClick={onClose}
              disabled={isPending}
              data-ocid="ext-publish-modal.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold"
              onClick={() =>
                onPublish(version, buildNumber, releaseNotes, forceUpdate)
              }
              disabled={isPending || !version.trim()}
              data-ocid="ext-publish-modal.submit_button"
            >
              {isPending ? (
                <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              ) : (
                <Plus className="h-3.5 w-3.5 mr-1.5" />
              )}
              {isPending ? "Publishing…" : "🚀 Publish"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function AdminExtensionVersionsPage() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [showPublishModal, setShowPublishModal] = useState(false);

  const enabled = !!actor && !isFetching;

  const { data: versions = [], isLoading: versionsLoading } = useQuery<
    ExtensionVersion[]
  >({
    queryKey: ["extensionVersions"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as ActorAny).adminListExtensionVersions();
    },
    enabled,
    refetchInterval: 30_000,
  });

  const { data: latestVersion } = useQuery<ExtensionUpdateCheck | null>({
    queryKey: ["latestExtensionVersion"],
    queryFn: async () => {
      if (!actor) return null;
      return (actor as ActorAny).getLatestExtensionVersion();
    },
    enabled,
  });

  const publishMutation = useMutation({
    mutationFn: async ({
      version,
      buildNumber,
      releaseNotes,
      forceUpdate,
    }: {
      version: string;
      buildNumber: number;
      releaseNotes: string;
      forceUpdate: boolean;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await (actor as ActorAny).adminSetExtensionVersion(
        version,
        BigInt(buildNumber),
        releaseNotes,
        "https://chrome.google.com/webstore/detail/copie-paste/YOUR_ID",
        forceUpdate,
      );
      if (result?.err) throw new Error(result.err);
      return result;
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["extensionVersions"] });
      queryClient.invalidateQueries({ queryKey: ["latestExtensionVersion"] });
      setShowPublishModal(false);
      toast.success("✅ Extension version published", {
        description: `v${vars.version} ${vars.forceUpdate ? "(FORCE UPDATE)" : "(optional)"} is now live`,
      });
    },
    onError: (err) =>
      toast.error(
        err instanceof Error ? err.message : "Failed to publish version",
      ),
  });

  return (
    <>
      <AdminLayout title="Extension Versions" subtitle="Version Management">
        {/* Page header banner */}
        <div
          className="mb-6 rounded-xl overflow-hidden relative"
          data-ocid="ext-versions-header"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-purple-900/30 pointer-events-none" />
          <div className="absolute inset-0 retro-grid opacity-10 pointer-events-none" />
          <div className="relative p-5 flex flex-col sm:flex-row sm:items-center gap-4 border border-blue-500/40 rounded-xl">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-blue-500/15 flex items-center justify-center shrink-0">
                <Zap className="h-5 w-5 text-blue-400" />
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-sm font-bold tracking-wider text-white uppercase text-glow-blue">
                  Extension Version Control
                </h2>
                <p className="font-mono text-[11px] text-gray-400 mt-0.5">
                  Publish updates, manage rollouts, force upgrades
                </p>
              </div>
              <Badge
                variant="outline"
                className="shrink-0 font-mono text-[9px] uppercase tracking-widest text-blue-300 border-blue-500/50 bg-blue-900/20"
              >
                v1.3+
              </Badge>
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold shrink-0 gap-1.5"
              onClick={() => setShowPublishModal(true)}
              data-ocid="ext-publish-version.open_modal_button"
            >
              <Plus className="h-3.5 w-3.5" />
              Publish New Version
            </Button>
          </div>
        </div>

        {/* Current version status */}
        {latestVersion && (
          <div
            className="mb-6 rounded-xl border border-blue-500/50 bg-gradient-to-r from-blue-900/30 to-purple-900/20 p-5"
            data-ocid="ext-current-version-card"
          >
            <div className="flex flex-wrap items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-display text-xl font-bold text-blue-300">
                    v{latestVersion.latestVersion}
                  </span>
                  <span className="font-mono text-xs text-gray-400">
                    Build #{Number(latestVersion.buildNumber)}
                  </span>
                  {latestVersion.isForceUpdate ? (
                    <span className="px-2 py-0.5 bg-red-900/50 border border-red-500/60 text-red-300 text-[10px] font-mono rounded-full">
                      🔴 FORCE UPDATE
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-green-900/30 border border-green-500/40 text-green-300 text-[10px] font-mono rounded-full">
                      ✅ Optional
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {latestVersion.releaseNotes}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span className="text-xs text-green-400 font-mono">Live</span>
              </div>
            </div>
          </div>
        )}

        {/* Version history table */}
        <div
          className="rounded-xl border border-gray-700/60 bg-gray-900/80 overflow-hidden"
          data-ocid="ext-versions-table"
        >
          <div className="px-5 py-3 bg-gray-800/60 border-b border-gray-700/60 flex items-center justify-between">
            <h3 className="font-display text-xs font-bold tracking-wider text-gray-300 uppercase">
              Version History
            </h3>
            <span className="font-mono text-[10px] text-gray-500">
              {versions.length} release{versions.length !== 1 ? "s" : ""}
            </span>
          </div>

          {versionsLoading ? (
            <div className="p-5 space-y-3">
              {[0, 1, 2].map((k) => (
                <Skeleton key={k} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          ) : versions.length === 0 ? (
            <div
              className="p-10 text-center"
              data-ocid="ext-versions-table.empty_state"
            >
              <Zap className="h-8 w-8 text-gray-600 mx-auto mb-3" />
              <p className="font-mono text-sm text-gray-500">
                No versions published yet
              </p>
              <Button
                size="sm"
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs"
                onClick={() => setShowPublishModal(true)}
                data-ocid="ext-versions-empty.open_modal_button"
              >
                Publish First Version
              </Button>
            </div>
          ) : (
            /* Desktop table / mobile cards */
            <>
              {/* Desktop */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700/60 bg-gray-800/30">
                      <th className="px-4 py-3 text-left font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                        Version
                      </th>
                      <th className="px-4 py-3 text-left font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                        Build #
                      </th>
                      <th className="px-4 py-3 text-left font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                        Released
                      </th>
                      <th className="px-4 py-3 text-left font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                        Update
                      </th>
                      <th className="px-4 py-3 text-left font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                        Platforms
                      </th>
                      <th className="px-4 py-3 text-left font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {versions.map((v, i) => (
                      <tr
                        key={`${v.version}-${i}`}
                        className="border-b border-gray-700/40 hover:bg-gray-800/30 transition-colors"
                        data-ocid={`ext-versions-table.item.${i + 1}`}
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono font-bold text-blue-300">
                            v{v.version}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-gray-400 text-xs">
                          #{Number(v.buildNumber)}
                        </td>
                        <td className="px-4 py-3 font-mono text-gray-400 text-xs">
                          {nsToDate(v.releasedAt)}
                        </td>
                        <td className="px-4 py-3">
                          {v.isForceUpdate ? (
                            <span className="px-2 py-0.5 bg-red-900/40 border border-red-500/40 text-red-300 text-[10px] font-mono rounded-full whitespace-nowrap">
                              🔴 Force
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-green-900/20 border border-green-500/30 text-green-300 text-[10px] font-mono rounded-full whitespace-nowrap">
                              ✅ Optional
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1 flex-wrap">
                            {v.supportedPlatforms.length > 0 ? (
                              v.supportedPlatforms.map((p) => (
                                <span
                                  key={p}
                                  className="px-1.5 py-0.5 bg-gray-700/60 text-gray-300 text-[10px] font-mono rounded"
                                >
                                  {platformEmoji(p)} {p}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-600 text-xs font-mono">
                                —
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs max-w-xs truncate font-mono">
                          {v.releaseNotes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="sm:hidden divide-y divide-gray-700/40">
                {versions.map((v, i) => (
                  <div
                    key={`${v.version}-${i}`}
                    className="p-4 space-y-2"
                    data-ocid={`ext-versions-mobile.item.${i + 1}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-blue-300">
                        v{v.version}
                      </span>
                      {v.isForceUpdate ? (
                        <span className="px-2 py-0.5 bg-red-900/40 border border-red-500/40 text-red-300 text-[10px] font-mono rounded-full">
                          🔴 Force
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-green-900/20 border border-green-500/30 text-green-300 text-[10px] font-mono rounded-full">
                          ✅ Optional
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
                      <span>Build #{Number(v.buildNumber)}</span>
                      <span>·</span>
                      <span>{nsToDate(v.releasedAt)}</span>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {v.supportedPlatforms.map((p) => (
                        <span
                          key={p}
                          className="px-1.5 py-0.5 bg-gray-700/60 text-gray-300 text-[10px] font-mono rounded"
                        >
                          {platformEmoji(p)} {p}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 font-mono leading-relaxed line-clamp-2">
                      {v.releaseNotes}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </AdminLayout>

      {showPublishModal && (
        <PublishModal
          onClose={() => setShowPublishModal(false)}
          isPending={publishMutation.isPending}
          onPublish={(version, buildNumber, releaseNotes, forceUpdate) =>
            publishMutation.mutate({
              version,
              buildNumber,
              releaseNotes,
              forceUpdate,
            })
          }
        />
      )}
    </>
  );
}

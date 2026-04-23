import { f as useActor, g as useQueryClient, r as reactExports, p as useQuery, h as useMutation, j as jsxRuntimeExports, Z as Zap, B as Button, J as CircleCheck, S as Skeleton, V as TriangleAlert, R as RefreshCw, a as ue, i as createActor } from "./index-D98vhwYy.js";
import { A as AdminLayout } from "./AdminLayout-DVOU4iA3.js";
import { B as Badge } from "./badge-YFa9vupG.js";
import { P as Plus } from "./plus-DRJ5B-Dl.js";
import "./credit-card-DK_RA7Ki.js";
import "./trash-2-BM2HKh5A.js";
function platformEmoji(p) {
  if (p === "facebook") return "📘";
  if (p === "mecari") return "🏯";
  return "📱";
}
function nsToDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString();
}
function PublishModal({ onClose, onPublish, isPending }) {
  const [version, setVersion] = reactExports.useState("1.3");
  const [buildNumber, setBuildNumber] = reactExports.useState(3);
  const [releaseNotes, setReleaseNotes] = reactExports.useState(
    "Complete autofill v1.3 — Facebook & Mecari full support"
  );
  const [forceUpdate, setForceUpdate] = reactExports.useState(true);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      style: { background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" },
      onClick: onClose,
      onKeyDown: (e) => e.key === "Escape" && onClose(),
      role: "presentation",
      "data-ocid": "ext-publish-modal-backdrop",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "w-full max-w-md rounded-xl border border-blue-500/60 bg-gray-900 overflow-hidden",
          onClick: (e) => e.stopPropagation(),
          onKeyDown: (e) => e.stopPropagation(),
          "data-ocid": "ext-publish-modal",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-blue-900/60 to-purple-900/40 px-5 py-4 border-b border-blue-500/30 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-blue-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-sm font-bold tracking-wider text-white uppercase", children: "Publish New Version" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  className: "text-gray-400 hover:text-white transition-colors text-lg leading-none",
                  "aria-label": "Close",
                  "data-ocid": "ext-publish-modal.close_button",
                  children: "×"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "ext-version",
                    className: "block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5",
                    children: "Version Number"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "ext-version",
                    type: "text",
                    value: version,
                    onChange: (e) => setVersion(e.target.value),
                    className: "w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono",
                    placeholder: "1.3",
                    "data-ocid": "ext-publish-modal.version.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "ext-build",
                    className: "block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5",
                    children: "Build Number"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "ext-build",
                    type: "number",
                    value: buildNumber,
                    onChange: (e) => setBuildNumber(Number.parseInt(e.target.value) || 1),
                    className: "w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono",
                    "data-ocid": "ext-publish-modal.build_number.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "ext-notes",
                    className: "block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5",
                    children: "Release Notes"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    id: "ext-notes",
                    value: releaseNotes,
                    onChange: (e) => setReleaseNotes(e.target.value),
                    rows: 3,
                    className: "w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono resize-none",
                    "data-ocid": "ext-publish-modal.release_notes.textarea"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "label",
                {
                  className: "flex items-center gap-3 cursor-pointer",
                  htmlFor: "ext-force",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        id: "ext-force",
                        type: "checkbox",
                        checked: forceUpdate,
                        onChange: (e) => setForceUpdate(e.target.checked),
                        className: "w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500",
                        "data-ocid": "ext-publish-modal.force_update.checkbox"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-300", children: "🔴 Force Update (all users must update)" })
                  ]
                }
              ),
              forceUpdate && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-900/20 px-3 py-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-red-400 shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-300 leading-relaxed", children: "All users will be notified to update. Extension will stop functioning until updated." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    className: "flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 font-mono text-xs",
                    onClick: onClose,
                    disabled: isPending,
                    "data-ocid": "ext-publish-modal.cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    className: "flex-1 bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold",
                    onClick: () => onPublish(version, buildNumber, releaseNotes, forceUpdate),
                    disabled: isPending || !version.trim(),
                    "data-ocid": "ext-publish-modal.submit_button",
                    children: [
                      isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5 mr-1.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5 mr-1.5" }),
                      isPending ? "Publishing…" : "🚀 Publish"
                    ]
                  }
                )
              ] })
            ] })
          ]
        }
      )
    }
  );
}
function AdminExtensionVersionsPage() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [showPublishModal, setShowPublishModal] = reactExports.useState(false);
  const enabled = !!actor && !isFetching;
  const { data: versions = [], isLoading: versionsLoading } = useQuery({
    queryKey: ["extensionVersions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminListExtensionVersions();
    },
    enabled,
    refetchInterval: 3e4
  });
  const { data: latestVersion } = useQuery({
    queryKey: ["latestExtensionVersion"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLatestExtensionVersion();
    },
    enabled
  });
  const publishMutation = useMutation({
    mutationFn: async ({
      version,
      buildNumber,
      releaseNotes,
      forceUpdate
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.adminSetExtensionVersion(
        version,
        BigInt(buildNumber),
        releaseNotes,
        "https://chrome.google.com/webstore/detail/copie-paste/YOUR_ID",
        forceUpdate
      );
      if (result == null ? void 0 : result.err) throw new Error(result.err);
      return result;
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["extensionVersions"] });
      queryClient.invalidateQueries({ queryKey: ["latestExtensionVersion"] });
      setShowPublishModal(false);
      ue.success("✅ Extension version published", {
        description: `v${vars.version} ${vars.forceUpdate ? "(FORCE UPDATE)" : "(optional)"} is now live`
      });
    },
    onError: (err) => ue.error(
      err instanceof Error ? err.message : "Failed to publish version"
    )
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { title: "Extension Versions", subtitle: "Version Management", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "mb-6 rounded-xl overflow-hidden relative",
          "data-ocid": "ext-versions-header",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-blue-900/40 to-purple-900/30 pointer-events-none" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 retro-grid opacity-10 pointer-events-none" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative p-5 flex flex-col sm:flex-row sm:items-center gap-4 border border-blue-500/40 rounded-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-blue-500/15 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-5 w-5 text-blue-400" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-bold tracking-wider text-white uppercase text-glow-blue", children: "Extension Version Control" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[11px] text-gray-400 mt-0.5", children: "Publish updates, manage rollouts, force upgrades" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: "shrink-0 font-mono text-[9px] uppercase tracking-widest text-blue-300 border-blue-500/50 bg-blue-900/20",
                    children: "v1.3+"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  className: "bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold shrink-0 gap-1.5",
                  onClick: () => setShowPublishModal(true),
                  "data-ocid": "ext-publish-version.open_modal_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                    "Publish New Version"
                  ]
                }
              )
            ] })
          ]
        }
      ),
      latestVersion && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "mb-6 rounded-xl border border-blue-500/50 bg-gradient-to-r from-blue-900/30 to-purple-900/20 p-5",
          "data-ocid": "ext-current-version-card",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-xl font-bold text-blue-300", children: [
                  "v",
                  latestVersion.latestVersion
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-gray-400", children: [
                  "Build #",
                  Number(latestVersion.buildNumber)
                ] }),
                latestVersion.isForceUpdate ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 bg-red-900/50 border border-red-500/60 text-red-300 text-[10px] font-mono rounded-full", children: "🔴 FORCE UPDATE" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 bg-green-900/30 border border-green-500/40 text-green-300 text-[10px] font-mono rounded-full", children: "✅ Optional" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-300 leading-relaxed", children: latestVersion.releaseNotes })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-green-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-green-400 font-mono", children: "Live" })
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-xl border border-gray-700/60 bg-gray-900/80 overflow-hidden",
          "data-ocid": "ext-versions-table",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 bg-gray-800/60 border-b border-gray-700/60 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xs font-bold tracking-wider text-gray-300 uppercase", children: "Version History" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] text-gray-500", children: [
                versions.length,
                " release",
                versions.length !== 1 ? "s" : ""
              ] })
            ] }),
            versionsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 space-y-3", children: [0, 1, 2].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded-lg" }, k)) }) : versions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "p-10 text-center",
                "data-ocid": "ext-versions-table.empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-8 w-8 text-gray-600 mx-auto mb-3" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-gray-500", children: "No versions published yet" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      className: "mt-4 bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs",
                      onClick: () => setShowPublishModal(true),
                      "data-ocid": "ext-versions-empty.open_modal_button",
                      children: "Publish First Version"
                    }
                  )
                ]
              }
            ) : (
              /* Desktop table / mobile cards */
              /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden sm:block overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-700/60 bg-gray-800/30", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-mono text-[10px] text-gray-500 uppercase tracking-widest", children: "Version" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-mono text-[10px] text-gray-500 uppercase tracking-widest", children: "Build #" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-mono text-[10px] text-gray-500 uppercase tracking-widest", children: "Released" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-mono text-[10px] text-gray-500 uppercase tracking-widest", children: "Update" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-mono text-[10px] text-gray-500 uppercase tracking-widest", children: "Platforms" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-mono text-[10px] text-gray-500 uppercase tracking-widest", children: "Notes" })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: versions.map((v, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "tr",
                    {
                      className: "border-b border-gray-700/40 hover:bg-gray-800/30 transition-colors",
                      "data-ocid": `ext-versions-table.item.${i + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-bold text-blue-300", children: [
                          "v",
                          v.version
                        ] }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-mono text-gray-400 text-xs", children: [
                          "#",
                          Number(v.buildNumber)
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-gray-400 text-xs", children: nsToDate(v.releasedAt) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: v.isForceUpdate ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 bg-red-900/40 border border-red-500/40 text-red-300 text-[10px] font-mono rounded-full whitespace-nowrap", children: "🔴 Force" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 bg-green-900/20 border border-green-500/30 text-green-300 text-[10px] font-mono rounded-full whitespace-nowrap", children: "✅ Optional" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 flex-wrap", children: v.supportedPlatforms.length > 0 ? v.supportedPlatforms.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "span",
                          {
                            className: "px-1.5 py-0.5 bg-gray-700/60 text-gray-300 text-[10px] font-mono rounded",
                            children: [
                              platformEmoji(p),
                              " ",
                              p
                            ]
                          },
                          p
                        )) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600 text-xs font-mono", children: "—" }) }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-gray-400 text-xs max-w-xs truncate font-mono", children: v.releaseNotes })
                      ]
                    },
                    `${v.version}-${i}`
                  )) })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:hidden divide-y divide-gray-700/40", children: versions.map((v, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "p-4 space-y-2",
                    "data-ocid": `ext-versions-mobile.item.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-bold text-blue-300", children: [
                          "v",
                          v.version
                        ] }),
                        v.isForceUpdate ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 bg-red-900/40 border border-red-500/40 text-red-300 text-[10px] font-mono rounded-full", children: "🔴 Force" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 bg-green-900/20 border border-green-500/30 text-green-300 text-[10px] font-mono rounded-full", children: "✅ Optional" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs font-mono text-gray-400", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                          "Build #",
                          Number(v.buildNumber)
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: nsToDate(v.releasedAt) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 flex-wrap", children: v.supportedPlatforms.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "px-1.5 py-0.5 bg-gray-700/60 text-gray-300 text-[10px] font-mono rounded",
                          children: [
                            platformEmoji(p),
                            " ",
                            p
                          ]
                        },
                        p
                      )) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 font-mono leading-relaxed line-clamp-2", children: v.releaseNotes })
                    ]
                  },
                  `${v.version}-${i}`
                )) })
              ] })
            )
          ]
        }
      )
    ] }),
    showPublishModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
      PublishModal,
      {
        onClose: () => setShowPublishModal(false),
        isPending: publishMutation.isPending,
        onPublish: (version, buildNumber, releaseNotes, forceUpdate) => publishMutation.mutate({
          version,
          buildNumber,
          releaseNotes,
          forceUpdate
        })
      }
    )
  ] });
}
export {
  AdminExtensionVersionsPage
};

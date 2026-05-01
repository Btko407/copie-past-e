import { b as useActor, d as useQueryClient, r as reactExports, i as useQuery, e as useMutation, j as jsxRuntimeExports, Z as Zap, R as RefreshCw, C as Copy, a as ue, f as createActor } from "./index-DlPcOTZa.js";
import { P as Plus } from "./plus-D7lSAI_U.js";
import { D as Download } from "./download-DNsV216a.js";
function AdminExtensionVersionsPage() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const enabled = !!actor && !actorFetching;
  const queryClient = useQueryClient();
  const [showPublishModal, setShowPublishModal] = reactExports.useState(false);
  const [showCapabilitiesModal, setShowCapabilitiesModal] = reactExports.useState(false);
  const [newVersion, setNewVersion] = reactExports.useState("1.3");
  const [newBuildNumber, setNewBuildNumber] = reactExports.useState(3);
  const [newReleaseNotes, setNewReleaseNotes] = reactExports.useState(
    "Complete autofill v1.3 — Facebook & Mecari full support"
  );
  const [forceUpdate, setForceUpdate] = reactExports.useState(true);
  const [capabilities, setCapabilities] = reactExports.useState({
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
    shippingTypeDetection: true
  });
  const { data: versions = [], isLoading } = useQuery({
    queryKey: ["extensionVersions"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      return await actor.adminListExtensionVersions();
    },
    enabled,
    refetchInterval: 3e4
  });
  const { data: latestVersion } = useQuery({
    queryKey: ["latestExtensionVersion"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      return await actor.getLatestExtensionVersion();
    },
    enabled
  });
  const publishMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      return await actor.adminSetExtensionVersion(
        newVersion,
        newBuildNumber,
        newReleaseNotes,
        "https://chrome.google.com/webstore/detail/copie-past-e/YOUR_ID",
        forceUpdate
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extensionVersions"] });
      queryClient.invalidateQueries({ queryKey: ["latestExtensionVersion"] });
      setShowPublishModal(false);
      ue.success("✅ Extension version published", {
        description: `v${newVersion} ${forceUpdate ? "(FORCE UPDATE)" : ""} is now live`
      });
    },
    onError: () => {
      ue.error("Failed to publish extension version");
    }
  });
  const downloadVersion = (version) => {
    const data = JSON.stringify(
      {
        version: version.version,
        buildNumber: version.buildNumber,
        releaseNotes: version.releaseNotes,
        downloadUrl: version.downloadUrl,
        capabilities,
        downloadedAt: (/* @__PURE__ */ new Date()).toISOString()
      },
      null,
      2
    );
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `copie-paste-extension-v${version.version}.json`;
    a.click();
    URL.revokeObjectURL(url);
    ue.success(`Downloaded v${version.version}`);
  };
  const copyDownloadUrl = (url) => {
    navigator.clipboard.writeText(url);
    ue.success("Download URL copied");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-bold flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-8 w-8 text-blue-400" }),
        "Extension Versions"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 mt-2", children: "Manage extension versions, control capabilities, and publish updates" })
    ] }),
    latestVersion && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500 p-6 rounded-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-bold text-blue-300", children: [
            "Current Version: v",
            latestVersion.latestVersion
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-400 mt-1", children: [
            "Build #",
            latestVersion.buildNumber,
            latestVersion.isForceUpdate && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 px-2 py-1 bg-red-900/50 border border-red-500 text-red-300 text-xs rounded", children: "🔴 FORCE UPDATE ACTIVE" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowCapabilitiesModal(true),
              className: "flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded font-semibold text-white",
              "data-ocid": "ext-capabilities.open_modal_button",
              children: "⚙️ Capabilities"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setShowPublishModal(true),
              className: "flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded font-bold text-white",
              "data-ocid": "ext-publish-version.open_modal_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                "Publish New Version"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300 text-sm", children: latestVersion.releaseNotes })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-gray-800 rounded-lg border border-gray-700 overflow-hidden",
        "data-ocid": "ext-versions-table",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-gray-700 border-b border-gray-600", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-lg flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-5 w-5" }),
            "Version History (",
            versions.length,
            ")"
          ] }) }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-gray-400", children: "Loading versions..." }) : versions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "p-6 text-gray-400 text-center",
              "data-ocid": "ext-versions-table.empty_state",
              children: "No versions published yet"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-gray-700 bg-gray-800/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Version" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Build" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Released" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Force Update" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Platforms" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Release Notes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: versions.map((version, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-b border-gray-700 hover:bg-gray-700/40 transition",
                "data-ocid": `ext-versions-table.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-bold text-blue-300", children: [
                    "v",
                    version.version
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-mono text-gray-400", children: [
                    "#",
                    version.buildNumber
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-gray-400 text-sm", children: new Date(
                    Number(version.releasedAt) / 1e6
                  ).toLocaleDateString() }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: version.isForceUpdate ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-1 bg-red-900 text-red-300 text-xs rounded", children: "🔴 YES" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-1 bg-green-900 text-green-300 text-xs rounded", children: "✅ Optional" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 flex-wrap", children: version.supportedPlatforms.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded",
                      children: p === "facebook" ? "📘" : p === "mecari" ? "🏯" : "📱"
                    },
                    p
                  )) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-gray-400 text-xs max-w-xs truncate", children: version.releaseNotes }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => downloadVersion(version),
                        className: "p-2 bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 rounded transition",
                        title: "Download",
                        "data-ocid": `ext-versions-table.item.${i + 1}.download_button`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => copyDownloadUrl(version.downloadUrl),
                        className: "p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition",
                        title: "Copy URL",
                        "data-ocid": `ext-versions-table.item.${i + 1}.secondary_button`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4" })
                      }
                    )
                  ] }) })
                ]
              },
              `${version.version}-${version.buildNumber}`
            )) })
          ] }) })
        ]
      }
    ),
    showPublishModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",
        "data-ocid": "ext-publish-modal",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-800 border border-blue-500 rounded-lg p-6 max-w-md w-full space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-blue-300", children: "Publish New Version" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "ext-publish-version",
                className: "block text-sm font-semibold text-gray-300 mb-2",
                children: "Version"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "ext-publish-version",
                type: "text",
                value: newVersion,
                onChange: (e) => setNewVersion(e.target.value),
                className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white",
                placeholder: "1.3",
                "data-ocid": "ext-publish-modal.version.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "ext-publish-build",
                className: "block text-sm font-semibold text-gray-300 mb-2",
                children: "Build Number"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "ext-publish-build",
                type: "number",
                value: newBuildNumber,
                onChange: (e) => setNewBuildNumber(Number.parseInt(e.target.value)),
                className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white",
                "data-ocid": "ext-publish-modal.build_number.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "ext-publish-notes",
                className: "block text-sm font-semibold text-gray-300 mb-2",
                children: "Release Notes"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                id: "ext-publish-notes",
                value: newReleaseNotes,
                onChange: (e) => setNewReleaseNotes(e.target.value),
                className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm resize-none",
                rows: 3,
                "data-ocid": "ext-publish-modal.release_notes.textarea"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              htmlFor: "ext-publish-force",
              className: "flex items-center gap-2 cursor-pointer",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "ext-publish-force",
                    type: "checkbox",
                    checked: forceUpdate,
                    onChange: (e) => setForceUpdate(e.target.checked),
                    className: "w-4 h-4 rounded",
                    "data-ocid": "ext-publish-modal.force_update.checkbox"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-300", children: "Force Update" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowPublishModal(false),
                className: "flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white",
                "data-ocid": "ext-publish-modal.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => publishMutation.mutate(),
                disabled: publishMutation.isPending,
                className: "flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded text-white font-semibold",
                "data-ocid": "ext-publish-modal.submit_button",
                children: publishMutation.isPending ? "Publishing..." : "🚀 Publish"
              }
            )
          ] })
        ] })
      }
    ),
    showCapabilitiesModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",
        "data-ocid": "ext-capabilities.dialog",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-800 border border-purple-500 rounded-lg p-6 max-w-md w-full space-y-4 max-h-[90vh] overflow-y-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-purple-300", children: "Extension Capabilities" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-blue-300 mb-2", children: "📘 Facebook Marketplace" }),
              [
                { key: "autofillFacebook", label: "Auto-fill enabled" },
                { key: "autoFillPrice", label: "Auto-fill price" },
                { key: "autoFillCategory", label: "Auto-fill category" },
                { key: "autoFillCondition", label: "Auto-fill condition" },
                {
                  key: "autoFillDescription",
                  label: "Auto-fill description"
                },
                { key: "localPickupDetection", label: "Detect local pickup" }
              ].map(({ key, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "label",
                {
                  className: "flex items-center gap-2 cursor-pointer text-sm text-gray-300 mb-1",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: capabilities[key],
                        onChange: (e) => setCapabilities({
                          ...capabilities,
                          [key]: e.target.checked
                        }),
                        className: "w-4 h-4 rounded"
                      }
                    ),
                    label
                  ]
                },
                key
              ))
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-3 border-t border-gray-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-pink-300 mb-2", children: "🏯 Mecari" }),
              [
                { key: "autofillMecari", label: "Auto-fill enabled" },
                { key: "autoFillPrice", label: "Auto-fill price" },
                { key: "autoFillBrand", label: "Auto-fill brand" },
                { key: "autoFillCategory", label: "Auto-fill category" },
                { key: "autoFillCondition", label: "Auto-fill condition" },
                {
                  key: "deliveryDaysDetection",
                  label: "Detect delivery days"
                },
                {
                  key: "shippingTypeDetection",
                  label: "Detect shipping type"
                }
              ].map(({ key, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "label",
                {
                  className: "flex items-center gap-2 cursor-pointer text-sm text-gray-300 mb-1",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: capabilities[key],
                        onChange: (e) => setCapabilities({
                          ...capabilities,
                          [key]: e.target.checked
                        }),
                        className: "w-4 h-4 rounded"
                      }
                    ),
                    label
                  ]
                },
                key
              ))
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-3 border-t border-gray-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-gray-300 mb-2", children: "⚙️ General" }),
              [
                { key: "photoUpload", label: "Photo upload" },
                { key: "smartOCR", label: "Smart OCR (optional)" },
                { key: "platformDetection", label: "Auto-detect platform" }
              ].map(({ key, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "label",
                {
                  className: "flex items-center gap-2 cursor-pointer text-sm text-gray-300 mb-1",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: capabilities[key],
                        onChange: (e) => setCapabilities({
                          ...capabilities,
                          [key]: e.target.checked
                        }),
                        className: "w-4 h-4 rounded"
                      }
                    ),
                    label
                  ]
                },
                key
              ))
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-4 border-t border-gray-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowCapabilitiesModal(false),
                className: "flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white",
                "data-ocid": "ext-capabilities.cancel_button",
                children: "Close"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  ue.success(
                    "Capabilities updated (will apply on next publish)"
                  );
                  setShowCapabilitiesModal(false);
                },
                className: "flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white font-semibold",
                "data-ocid": "ext-capabilities.confirm_button",
                children: "Save"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  AdminExtensionVersionsPage
};

import { c as createLucideIcon, b as useActor, d as useQueryClient, r as reactExports, l as useQuery, e as useMutation, j as jsxRuntimeExports, Z as Zap, R as RefreshCw, C as Copy, a as ue, f as createActor } from "./index-Usp6K9eu.js";
import { P as Plus } from "./plus-DWBmF5Ie.js";
import { D as Download } from "./download-B2QSyBSh.js";
import { H as HardDrive } from "./hard-drive-BURMZxkg.js";
import { S as Save } from "./save-DvBYn6TI.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
  ["path", { d: "M2 12h20", key: "9i4pu4" }]
];
const Globe = createLucideIcon("globe", __iconNode);
const PLATFORM_CAPABILITIES = [
  { key: "facebook", label: "Facebook Marketplace", emoji: "📘" },
  { key: "mercari", label: "Mercari", emoji: "🏯" },
  { key: "ebay", label: "eBay", emoji: "🔨" },
  { key: "poshmark", label: "Poshmark", emoji: "👗" },
  { key: "depop", label: "Depop", emoji: "🎨" },
  { key: "etsy", label: "Etsy", emoji: "🛍" }
];
function AdminExtensionVersionsPage() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const enabled = !!actor && !actorFetching;
  const queryClient = useQueryClient();
  const [showPublishModal, setShowPublishModal] = reactExports.useState(false);
  const [showCapabilitiesModal, setShowCapabilitiesModal] = reactExports.useState(false);
  const [showConfigPanel, setShowConfigPanel] = reactExports.useState(false);
  const [newVersion, setNewVersion] = reactExports.useState("1.3.1");
  const [newBuildNumber, setNewBuildNumber] = reactExports.useState(4);
  const [newReleaseNotes, setNewReleaseNotes] = reactExports.useState(
    "Production release with full 6-platform autofill support"
  );
  const [forceUpdate, setForceUpdate] = reactExports.useState(false);
  const [downloadMode, setDownloadMode] = reactExports.useState("local");
  const [localDownloadUrl, setLocalDownloadUrl] = reactExports.useState(
    "/copie-paste-extension-v1.3.1.zip"
  );
  const [chromeWebStoreUrl, setChromeWebStoreUrl] = reactExports.useState("");
  const [platformCaps, setPlatformCaps] = reactExports.useState({
    facebook: true,
    mercari: true,
    ebay: true,
    poshmark: true,
    depop: true,
    etsy: true
  });
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
  const { data: extConfig } = useQuery({
    queryKey: ["extensionConfig"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      return await actor.getExtensionConfig();
    },
    enabled
  });
  reactExports.useState(() => {
    const cfg = extConfig;
    if (cfg) {
      if (cfg.downloadMode) setDownloadMode(cfg.downloadMode);
      if (cfg.localDownloadUrl) setLocalDownloadUrl(cfg.localDownloadUrl);
      if (cfg.chromeWebStoreUrl !== void 0)
        setChromeWebStoreUrl(cfg.chromeWebStoreUrl);
      if (cfg.capabilities) {
        setPlatformCaps({
          facebook: cfg.capabilities.facebook ?? true,
          mercari: cfg.capabilities.mercari ?? true,
          ebay: cfg.capabilities.ebay ?? true,
          poshmark: cfg.capabilities.poshmark ?? true,
          depop: cfg.capabilities.depop ?? true,
          etsy: cfg.capabilities.etsy ?? true
        });
      }
    }
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
  const saveConfigMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      await actor.adminSetExtensionConfig(
        downloadMode,
        localDownloadUrl,
        chromeWebStoreUrl
      );
      await actor.adminSetPlatformCapabilities(
        platformCaps.facebook,
        platformCaps.mercari,
        platformCaps.ebay,
        platformCaps.poshmark,
        platformCaps.depop,
        platformCaps.etsy
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extensionConfig"] });
      queryClient.invalidateQueries({ queryKey: ["latestExtensionVersion"] });
      setShowConfigPanel(false);
      ue.success("✅ Extension config saved");
    },
    onError: () => {
      ue.error("Failed to save extension config");
    }
  });
  const publishMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const effectiveUrl = localDownloadUrl || `/copie-paste-extension-v${newVersion}.zip`;
      return await actor.adminSetExtensionVersion(
        newVersion,
        newBuildNumber,
        newReleaseNotes,
        effectiveUrl,
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
    const url = version.downloadUrl;
    if (!url) {
      ue.error(`No download URL for v${version.version}`);
      return;
    }
    window.location.href = url;
    ue.success(`Downloading v${version.version}`);
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setShowConfigPanel(true),
              className: "flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 rounded font-semibold text-white",
              "data-ocid": "ext-config.open_modal_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4" }),
                "Download Config"
              ]
            }
          ),
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
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 flex-wrap", children: version.supportedPlatforms.map((p) => {
                    const emoji = p === "facebook" ? "📘" : p === "mercari" ? "🏯" : p === "ebay" ? "🔨" : p === "poshmark" ? "👗" : p === "depop" ? "🎨" : p === "etsy" ? "🛍" : "📱";
                    return /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded",
                        title: p,
                        children: emoji
                      },
                      p
                    );
                  }) }) }),
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
    showConfigPanel && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4",
        "data-ocid": "ext-config.dialog",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-800 border border-emerald-500 rounded-lg p-6 max-w-lg w-full space-y-5 max-h-[90vh] overflow-y-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xl font-bold text-emerald-300 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-5 w-5" }),
            " Download Config"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-gray-300 mb-2", children: "Download Mode" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: ["local", "webstore", "both"].map(
              (mode) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "label",
                {
                  className: "flex items-center gap-2 cursor-pointer",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "radio",
                        name: "downloadMode",
                        value: mode,
                        checked: downloadMode === mode,
                        onChange: () => setDownloadMode(mode),
                        className: "accent-emerald-500",
                        "data-ocid": `ext-config.mode_${mode}.radio`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-300 capitalize", children: mode })
                  ]
                },
                mode
              )
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-500 mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "local" }),
              ": local ZIP only ·",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: " webstore" }),
              ": Chrome Web Store only ·",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: " both" }),
              ": show both buttons"
            ] })
          ] }),
          downloadMode !== "webstore" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                htmlFor: "local-url",
                className: "block text-sm font-semibold text-gray-300 mb-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "inline h-3 w-3 mr-1" }),
                  " Local Download URL"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "local-url",
                type: "text",
                value: localDownloadUrl,
                onChange: (e) => setLocalDownloadUrl(e.target.value),
                className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm font-mono",
                placeholder: "/copie-paste-extension-v1.3.1.zip",
                "data-ocid": "ext-config.local_url.input"
              }
            )
          ] }),
          downloadMode !== "local" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                htmlFor: "webstore-url",
                className: "block text-sm font-semibold text-gray-300 mb-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "inline h-3 w-3 mr-1" }),
                  " Chrome Web Store URL"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "webstore-url",
                type: "text",
                value: chromeWebStoreUrl,
                onChange: (e) => setChromeWebStoreUrl(e.target.value),
                className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm font-mono",
                placeholder: "https://chromewebstore.google.com/detail/...",
                "data-ocid": "ext-config.webstore_url.input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Leave empty to hide the Chrome Web Store button from users." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-gray-300 mb-2", children: "Platform Capabilities" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: PLATFORM_CAPABILITIES.map(({ key, label, emoji }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                className: "flex items-center gap-2 cursor-pointer",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: platformCaps[key],
                      onChange: (e) => setPlatformCaps({
                        ...platformCaps,
                        [key]: e.target.checked
                      }),
                      className: "w-4 h-4 rounded accent-emerald-500",
                      "data-ocid": `ext-config.platform_${key}.checkbox`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-gray-300", children: [
                    emoji,
                    " ",
                    label
                  ] })
                ]
              },
              key
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2 border-t border-gray-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowConfigPanel(false),
                className: "flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white",
                "data-ocid": "ext-config.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => saveConfigMutation.mutate(),
                disabled: saveConfigMutation.isPending,
                className: "flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 rounded text-white font-semibold flex items-center justify-center gap-2",
                "data-ocid": "ext-config.confirm_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
                  saveConfigMutation.isPending ? "Saving..." : "Save Config"
                ]
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

import { c as createLucideIcon, u as useActor, a as useQueryClient, r as reactExports, k as useQuery, b as useMutation, j as jsxRuntimeExports, Z as Zap, B as Button, ak as RefreshCw, C as CircleCheck, g as Copy, d as ue, v as Label, s as Input, e as createActor } from "./index-CDYDluDX.js";
import { A as AdminLayout } from "./AdminLayout-BjK6RzTr.js";
import { B as Badge } from "./badge-tMJODRQh.js";
import { S as Separator } from "./separator-COrBmKFK.js";
import { S as Switch } from "./switch-DUDZecVN.js";
import { P as Plus } from "./plus-BzuK47jx.js";
import { P as Package } from "./package-BhHZQZB-.js";
import { C as CircleX } from "./circle-x-bAaUQV7d.js";
import { D as Download } from "./download-DEXd4YsB.js";
import { R as RotateCcw } from "./rotate-ccw-Cqm4bL8u.js";
import { E as ExternalLink } from "./external-link-Bt1eODa_.js";
import { H as HardDrive } from "./hard-drive-BMSB5VXJ.js";
import { S as Save } from "./save-DA1yGkWo.js";
import "./credit-card-BORXzGfX.js";
import "./trash-2-B9mOI9ri.js";
import "./dollar-sign-rpn8AkE2.js";
import "./index-Dn2L3d5t.js";
import "./index-Dkz_c46u.js";
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
const PLATFORM_CAPS = [
  { key: "facebook", label: "Facebook Marketplace", emoji: "📘" },
  { key: "mercari", label: "Mercari", emoji: "🏯" },
  { key: "ebay", label: "eBay", emoji: "🔨" },
  { key: "poshmark", label: "Poshmark", emoji: "👗" },
  { key: "depop", label: "Depop", emoji: "🎨" },
  { key: "etsy", label: "Etsy", emoji: "🛍" }
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
  "popup.js"
];
function PackageIntegritySection({ downloadUrl }) {
  const [zipStatus, setZipStatus] = reactExports.useState(
    "unknown"
  );
  const [checking, setChecking] = reactExports.useState(false);
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "rounded-xl border border-border/40 bg-card overflow-hidden",
      "data-ocid": "ext-integrity-section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border/50 bg-card/80 flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-4 h-4 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs font-bold tracking-widest uppercase text-foreground", children: "Package Integrity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground mt-0.5", children: "ZIP availability + required file checklist" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: checkZip,
              disabled: checking,
              className: "font-mono text-xs gap-1.5",
              "data-ocid": "ext-integrity-check-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  RefreshCw,
                  {
                    className: `w-3.5 h-3.5 ${checking ? "animate-spin" : ""}`
                  }
                ),
                checking ? "Checking…" : "Check ZIP"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg bg-secondary/10 border border-border/30 px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Local ZIP" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "font-mono text-xs text-primary mt-0.5 block break-all", children: downloadUrl || "(not configured)" })
            ] }),
            zipStatus === "ok" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "outline",
                className: "text-green-400 border-green-400/40 bg-green-400/5 font-mono text-[10px] gap-1 shrink-0",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3" }),
                  " Available"
                ]
              }
            ),
            zipStatus === "missing" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "outline",
                className: "text-destructive border-destructive/40 bg-destructive/5 font-mono text-[10px] gap-1 shrink-0",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3 h-3" }),
                  " Not Found"
                ]
              }
            ),
            zipStatus === "unknown" && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: "text-muted-foreground font-mono text-[10px] shrink-0",
                children: "Unchecked"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2", children: "Required Files Checklist" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-1", children: REQUIRED_FILES.map((file) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-2 font-mono text-[10px] text-muted-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3 text-green-400 shrink-0" }),
                  file
                ]
              },
              file
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[9px] text-muted-foreground/50 mt-2", children: [
              "Run",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-primary", children: "node scripts/zip-extension.mjs" }),
              " ",
              "to regenerate ZIP."
            ] })
          ] })
        ] })
      ]
    }
  );
}
function DownloadConfigSection({
  downloadMode: initMode,
  localDownloadUrl: initLocal,
  chromeWebStoreUrl: initWebstore,
  platformCaps: initCaps,
  onSave,
  saving
}) {
  const [mode, setMode] = reactExports.useState(initMode);
  const [localUrl, setLocalUrl] = reactExports.useState(initLocal);
  const [webstoreUrl, setWebstoreUrl] = reactExports.useState(initWebstore);
  const [caps, setCaps] = reactExports.useState(initCaps);
  reactExports.useEffect(() => {
    setMode(initMode);
    setLocalUrl(initLocal);
    setWebstoreUrl(initWebstore);
    setCaps(initCaps);
  }, [initMode, initLocal, initWebstore, initCaps]);
  function copyUrl() {
    navigator.clipboard.writeText(localUrl).then(() => ue.success("Download URL copied to clipboard"));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "rounded-xl border border-border/40 bg-card overflow-hidden",
      "data-ocid": "ext-download-config-section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border/50 bg-card/80 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-4 h-4 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs font-bold tracking-widest uppercase text-foreground", children: "Download Configuration" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground mt-0.5", children: "Download mode, URLs, and platform capability matrix" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2", children: "Download Mode" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4", children: ["local", "webstore", "both"].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "radio",
                  name: "downloadMode",
                  value: m,
                  checked: mode === m,
                  onChange: () => setMode(m),
                  className: "accent-primary",
                  "data-ocid": `ext-download-mode-${m}.radio`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-foreground capitalize", children: m })
            ] }, m)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[9px] text-muted-foreground/60 mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "local" }),
              " — local ZIP only ·",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: " webstore" }),
              " ",
              "— Chrome Web Store only ·",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: " both" }),
              " — show both download options"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border/30" }),
          mode !== "webstore" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Label,
              {
                htmlFor: "ext-local-url",
                className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "inline w-3 h-3 mr-1" }),
                  "Local ZIP URL"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "ext-local-url",
                  value: localUrl,
                  onChange: (e) => setLocalUrl(e.target.value),
                  placeholder: "/copie-paste-extension-v1.3.1.zip",
                  className: "font-mono text-xs flex-1",
                  "data-ocid": "ext-local-url.input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  onClick: copyUrl,
                  className: "shrink-0",
                  "aria-label": "Copy download URL",
                  "data-ocid": "ext-copy-url.button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5" })
                }
              )
            ] })
          ] }),
          mode !== "local" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Label,
              {
                htmlFor: "ext-webstore-url",
                className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "inline w-3 h-3 mr-1" }),
                  "Chrome Web Store URL"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "ext-webstore-url",
                value: webstoreUrl,
                onChange: (e) => setWebstoreUrl(e.target.value),
                placeholder: "https://chromewebstore.google.com/detail/…",
                className: "font-mono text-xs mt-1",
                "data-ocid": "ext-webstore-url.input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] text-muted-foreground/60 mt-1", children: "Leave empty — Chrome Web Store button stays hidden from users." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3", children: "Platform Capability Matrix" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: PLATFORM_CAPS.map(({ key, label, emoji }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-2 cursor-pointer rounded-lg border border-border/30 px-3 py-2.5 hover:bg-secondary/20 transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Switch,
                    {
                      id: `cap-${key}`,
                      checked: caps[key],
                      onCheckedChange: (v) => setCaps({ ...caps, [key]: v }),
                      "data-ocid": `ext-cap-${key}.switch`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "label",
                    {
                      htmlFor: `cap-${key}`,
                      className: "font-mono text-xs text-foreground cursor-pointer",
                      children: [
                        emoji,
                        " ",
                        label
                      ]
                    }
                  )
                ]
              },
              key
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => onSave({ mode, localUrl, webstoreUrl, caps }),
              disabled: saving,
              className: "font-mono text-xs gap-1.5",
              "data-ocid": "ext-download-config.save_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-3.5 h-3.5" }),
                saving ? "Saving…" : "Save Configuration"
              ]
            }
          ) })
        ] })
      ]
    }
  );
}
function PublishModal({
  onClose,
  onPublish,
  pending,
  defaultVersion = "1.3.2",
  defaultBuild = 5
}) {
  const [version, setVersion] = reactExports.useState(defaultVersion);
  const [buildNumber, setBuildNumber] = reactExports.useState(defaultBuild);
  const [releaseNotes, setReleaseNotes] = reactExports.useState("");
  const [forceUpdate, setForceUpdate] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4",
      "data-ocid": "ext-publish.dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-primary/30 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-sm font-bold tracking-widest uppercase text-foreground", children: "Publish New Version" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "pub-version",
                className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
                children: "Version"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "pub-version",
                value: version,
                onChange: (e) => setVersion(e.target.value),
                placeholder: "1.3.2",
                className: "font-mono text-xs mt-1",
                "data-ocid": "ext-publish.version.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "pub-build",
                className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
                children: "Build #"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "pub-build",
                type: "number",
                value: buildNumber,
                onChange: (e) => setBuildNumber(Number.parseInt(e.target.value)),
                className: "font-mono text-xs mt-1",
                "data-ocid": "ext-publish.build_number.input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: "pub-notes",
              className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
              children: "Release Notes"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              id: "pub-notes",
              value: releaseNotes,
              onChange: (e) => setReleaseNotes(e.target.value),
              placeholder: "What changed in this version?",
              rows: 3,
              className: "w-full mt-1 px-3 py-2 bg-secondary/20 border border-border/40 rounded-md text-xs font-mono text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary",
              "data-ocid": "ext-publish.release_notes.textarea"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-lg bg-destructive/5 border border-destructive/20 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              id: "pub-force",
              checked: forceUpdate,
              onCheckedChange: setForceUpdate,
              "data-ocid": "ext-publish.force_update.switch"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "pub-force",
                className: "font-mono text-xs font-bold text-destructive cursor-pointer",
                children: "Force Update"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] text-muted-foreground", children: "All users must update before continuing" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              className: "flex-1 font-mono text-xs",
              onClick: onClose,
              "data-ocid": "ext-publish.cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: "flex-1 font-mono text-xs gap-1.5",
              onClick: () => onPublish({ version, buildNumber, releaseNotes, forceUpdate }),
              disabled: pending || !version.trim(),
              "data-ocid": "ext-publish.submit_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3.5 h-3.5" }),
                pending ? "Publishing…" : "Publish"
              ]
            }
          )
        ] })
      ] })
    }
  );
}
function AdminExtensionVersionsPage() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const enabled = !!actor && !actorFetching;
  const queryClient = useQueryClient();
  const [showPublishModal, setShowPublishModal] = reactExports.useState(false);
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
  const { data: latestVersion, isLoading: latestLoading } = useQuery({
    queryKey: ["latestExtensionVersion"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      return await actor.getLatestExtensionVersion();
    },
    enabled
  });
  const { data: versions = [], isLoading: versionsLoading } = useQuery({
    queryKey: ["extensionVersions"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      return await actor.adminListExtensionVersions();
    },
    enabled,
    refetchInterval: 3e4
  });
  const { data: extConfig } = useQuery({
    queryKey: ["extensionConfig"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      return actor.getExtensionConfig();
    },
    enabled
  });
  reactExports.useEffect(() => {
    const cfg = extConfig;
    if (!cfg) return;
    if (cfg.downloadMode) setDownloadMode(cfg.downloadMode);
    if (cfg.localDownloadUrl)
      setLocalDownloadUrl(cfg.localDownloadUrl);
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
  }, [extConfig]);
  const saveConfigMutation = useMutation({
    mutationFn: async (cfg) => {
      if (!actor) throw new Error("Backend not ready");
      await actor.adminSetExtensionConfig(
        cfg.mode,
        cfg.localUrl,
        cfg.webstoreUrl
      );
      await actor.adminSetPlatformCapabilities(
        cfg.caps.facebook,
        cfg.caps.mercari,
        cfg.caps.ebay,
        cfg.caps.poshmark,
        cfg.caps.depop,
        cfg.caps.etsy
      );
    },
    onSuccess: (_data, cfg) => {
      setDownloadMode(cfg.mode);
      setLocalDownloadUrl(cfg.localUrl);
      setChromeWebStoreUrl(cfg.webstoreUrl);
      setPlatformCaps(cfg.caps);
      queryClient.invalidateQueries({ queryKey: ["extensionConfig"] });
      queryClient.invalidateQueries({ queryKey: ["latestExtensionVersion"] });
      ue.success("Extension configuration saved");
    },
    onError: () => ue.error("Failed to save extension configuration")
  });
  const publishMutation = useMutation({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Backend not ready");
      const effectiveUrl = localDownloadUrl || `/copie-paste-extension-v${args.version}.zip`;
      return actor.adminSetExtensionVersion(
        args.version,
        args.buildNumber,
        args.releaseNotes,
        effectiveUrl,
        args.forceUpdate
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extensionVersions"] });
      queryClient.invalidateQueries({ queryKey: ["latestExtensionVersion"] });
      setShowPublishModal(false);
      ue.success("Extension version published");
    },
    onError: () => ue.error("Failed to publish extension version")
  });
  function handleRollback(version) {
    publishMutation.mutate({
      version: version.version,
      buildNumber: version.buildNumber,
      releaseNotes: `Rollback to v${version.version}`,
      forceUpdate: false
    });
  }
  function platformEmoji(p) {
    var _a;
    return ((_a = PLATFORM_CAPS.find((x) => x.key === p)) == null ? void 0 : _a.emoji) ?? "📦";
  }
  const currentV = (latestVersion == null ? void 0 : latestVersion.latestVersion) ?? "—";
  const currentBuild = (latestVersion == null ? void 0 : latestVersion.buildNumber) ?? "—";
  const buildTs = (latestVersion == null ? void 0 : latestVersion.releasedAt) ? new Date(Number(latestVersion.releasedAt) / 1e6).toLocaleString() : "—";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { title: "Extension", subtitle: "Release Console", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl space-y-8", "data-ocid": "admin-extension-page", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "section",
        {
          className: "rounded-xl border border-primary/30 bg-card overflow-hidden",
          "data-ocid": "ext-current-release-section",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border/50 bg-card/80 flex items-center justify-between gap-4 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs font-bold tracking-widest uppercase text-foreground", children: "Current Release" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground mt-0.5", children: "Active extension version served to all users" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  onClick: () => setShowPublishModal(true),
                  className: "font-mono text-xs gap-1.5",
                  "data-ocid": "ext-publish-version.open_modal_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                    "Publish New Version"
                  ]
                }
              )
            ] }),
            latestLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-muted-foreground font-mono text-xs animate-pulse", children: "Loading version info…" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 grid grid-cols-2 sm:grid-cols-4 gap-4", children: [
              {
                label: "Version",
                value: `v${currentV}`,
                color: "text-primary"
              },
              {
                label: "Build #",
                value: `#${currentBuild}`,
                color: "text-foreground"
              },
              {
                label: "Last Build",
                value: buildTs,
                color: "text-muted-foreground"
              },
              {
                label: "Force Update",
                value: (latestVersion == null ? void 0 : latestVersion.isForceUpdate) ? "ACTIVE" : "Off",
                color: (latestVersion == null ? void 0 : latestVersion.isForceUpdate) ? "text-destructive" : "text-green-400"
              }
            ].map(({ label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-lg bg-background/60 border border-border/30 px-4 py-3",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: `font-mono text-sm font-bold mt-1 ${color} break-all`,
                      children: value
                    }
                  )
                ]
              },
              label
            )) }),
            (latestVersion == null ? void 0 : latestVersion.releaseNotes) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pb-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1", children: "Release Notes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground bg-secondary/10 border border-border/20 rounded px-3 py-2", children: latestVersion.releaseNotes })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DownloadConfigSection,
        {
          downloadMode,
          localDownloadUrl,
          chromeWebStoreUrl,
          platformCaps,
          saving: saveConfigMutation.isPending,
          onSave: (cfg) => saveConfigMutation.mutate(cfg)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PackageIntegritySection, { downloadUrl: localDownloadUrl }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "section",
        {
          className: "rounded-xl border border-border/40 bg-card overflow-hidden",
          "data-ocid": "ext-versions-table",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border/50 bg-card/80 flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs font-bold tracking-widest uppercase text-foreground", children: "Version History" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] text-muted-foreground mt-0.5", children: [
                  versions.length,
                  " version",
                  versions.length !== 1 ? "s" : "",
                  " on record"
                ] })
              ] })
            ] }),
            versionsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 font-mono text-xs text-muted-foreground animate-pulse", children: "Loading version history…" }) : versions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "p-8 text-center",
                "data-ocid": "ext-versions-table.empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-8 h-8 text-muted-foreground/30 mx-auto mb-3" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: 'No versions published yet. Use "Publish New Version" to add the first.' })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border/40 bg-secondary/10", children: [
                "Version",
                "Build",
                "Released",
                "Force Update",
                "Platforms",
                "Notes",
                "Actions"
              ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "th",
                {
                  className: "px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
                  children: h
                },
                h
              )) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: versions.map((v, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  className: "border-b border-border/20 hover:bg-secondary/10 transition-colors",
                  "data-ocid": `ext-versions-table.item.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-bold text-primary text-xs", children: [
                      "v",
                      v.version
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-mono text-xs text-muted-foreground", children: [
                      "#",
                      v.buildNumber
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-[10px] text-muted-foreground whitespace-nowrap", children: new Date(
                      Number(v.releasedAt) / 1e6
                    ).toLocaleDateString() }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: v.isForceUpdate ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Badge,
                      {
                        variant: "outline",
                        className: "text-destructive border-destructive/40 bg-destructive/5 font-mono text-[10px] gap-1",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-2.5 h-2.5" }),
                          " FORCE"
                        ]
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Badge,
                      {
                        variant: "outline",
                        className: "text-green-400 border-green-400/40 bg-green-400/5 font-mono text-[10px] gap-1",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-2.5 h-2.5" }),
                          " Optional"
                        ]
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 flex-wrap", children: v.supportedPlatforms.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { title: p, className: "text-sm", children: platformEmoji(p) }, p)) }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-[10px] text-muted-foreground max-w-[160px] truncate", children: v.releaseNotes || "—" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "ghost",
                          size: "sm",
                          className: "h-7 px-2",
                          onClick: () => {
                            const a = document.createElement("a");
                            a.href = v.downloadUrl;
                            a.click();
                          },
                          title: "Download",
                          "data-ocid": `ext-versions-table.item.${i + 1}.download_button`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "ghost",
                          size: "sm",
                          className: "h-7 px-2",
                          onClick: () => {
                            navigator.clipboard.writeText(v.downloadUrl);
                            ue.success("URL copied");
                          },
                          title: "Copy URL",
                          "data-ocid": `ext-versions-table.item.${i + 1}.secondary_button`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5" })
                        }
                      ),
                      i > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "ghost",
                          size: "sm",
                          className: "h-7 px-2 text-accent hover:text-accent",
                          onClick: () => handleRollback(v),
                          title: "Rollback to this version",
                          disabled: publishMutation.isPending,
                          "data-ocid": `ext-versions-table.item.${i + 1}.rollback_button`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-3.5 h-3.5" })
                        }
                      )
                    ] }) })
                  ]
                },
                `${v.version}-${v.buildNumber}`
              )) })
            ] }) })
          ]
        }
      ),
      localDownloadUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: localDownloadUrl,
            download: true,
            className: "inline-flex items-center gap-1.5 font-mono text-xs text-primary hover:underline",
            "data-ocid": "ext-local-download.link",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5" }),
              "Download current package"
            ]
          }
        ),
        chromeWebStoreUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40", children: "·" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: chromeWebStoreUrl,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "inline-flex items-center gap-1.5 font-mono text-xs text-accent hover:underline",
              "data-ocid": "ext-webstore.link",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3.5 h-3.5" }),
                "Chrome Web Store"
              ]
            }
          )
        ] })
      ] })
    ] }),
    showPublishModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
      PublishModal,
      {
        onClose: () => setShowPublishModal(false),
        onPublish: (args) => publishMutation.mutate(args),
        pending: publishMutation.isPending,
        defaultVersion: (latestVersion == null ? void 0 : latestVersion.latestVersion) ? (() => {
          const parts = latestVersion.latestVersion.split(".");
          const patch = Number(parts[parts.length - 1] ?? "0") + 1;
          parts[parts.length - 1] = String(patch);
          return parts.join(".");
        })() : "1.3.2",
        defaultBuild: (latestVersion == null ? void 0 : latestVersion.buildNumber) ? latestVersion.buildNumber + 1 : 5
      }
    )
  ] });
}
export {
  AdminExtensionVersionsPage
};

import { u as useActor, k as useQuery, j as jsxRuntimeExports, q as Layout, C as CircleCheck, Z as Zap, e as createActor } from "./index-CDYDluDX.js";
import { D as Download } from "./download-DEXd4YsB.js";
import { E as ExternalLink } from "./external-link-Bt1eODa_.js";
const PLATFORMS = [
  {
    name: "Facebook Marketplace",
    bg: "bg-blue-900/20 border border-blue-500/30",
    titleColor: "text-blue-300",
    fields: [
      "Auto-fill title",
      "Auto-fill description",
      "Auto-fill price",
      "Auto-fill category",
      "Auto-fill condition",
      "Local pickup detection"
    ]
  },
  {
    name: "Mercari",
    bg: "bg-pink-900/20 border border-pink-500/30",
    titleColor: "text-pink-300",
    fields: [
      "Auto-fill title",
      "Auto-fill description",
      "Auto-fill price",
      "Auto-fill brand",
      "Auto-fill condition",
      "Shipping type detection"
    ]
  },
  {
    name: "eBay",
    bg: "bg-red-900/20 border border-red-500/30",
    titleColor: "text-red-300",
    fields: [
      "Auto-fill title",
      "Condition ID",
      "Auto-fill price",
      "Quantity",
      "Listing type",
      "Shipping service"
    ]
  },
  {
    name: "Poshmark",
    bg: "bg-rose-900/20 border border-rose-500/30",
    titleColor: "text-rose-300",
    fields: [
      "Auto-fill title",
      "Brand",
      "Size",
      "Department",
      "Color",
      "Original price"
    ]
  },
  {
    name: "Depop",
    bg: "bg-orange-900/20 border border-orange-500/30",
    titleColor: "text-orange-300",
    fields: [
      "Auto-fill title",
      "Condition",
      "Color",
      "Brand",
      "Size",
      "Gender"
    ]
  },
  {
    name: "Etsy",
    bg: "bg-amber-900/20 border border-amber-500/30",
    titleColor: "text-amber-300",
    fields: [
      "Auto-fill title",
      "Tags (×13)",
      "Materials",
      "Who Made",
      "When Made",
      "Is Supply"
    ]
  }
];
function ExtensionPage() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const enabled = !!actor && !actorFetching;
  const { data: extConfig, isLoading } = useQuery({
    queryKey: ["extensionConfig"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      return await actor.getExtensionConfig();
    },
    enabled
  });
  const cfg = extConfig;
  const version = (cfg == null ? void 0 : cfg.latestVersion) ?? "1.3.1";
  const downloadMode = (cfg == null ? void 0 : cfg.downloadMode) ?? "local";
  const localUrl = (cfg == null ? void 0 : cfg.localDownloadUrl) ?? `/copie-paste-extension-v${version}.zip`;
  const webStoreUrl = (cfg == null ? void 0 : cfg.chromeWebStoreUrl) ?? "";
  const showLocalDownload = downloadMode !== "webstore";
  const showWebStore = (downloadMode === "webstore" || downloadMode === "both") && webStoreUrl.trim() !== "";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-4 py-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 text-4xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📋" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "COPIE PAST-E EXTENSION" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Smart autofill for all 6 marketplaces — Facebook, Mercari, eBay, Poshmark, Depop, Etsy" })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "text-center text-muted-foreground",
        "data-ocid": "extension-page.loading_state",
        children: "Loading..."
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500 p-6 rounded-lg",
          "data-ocid": "extension-page.version-card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-bold text-blue-300", children: [
                "✅ v",
                version
              ] }),
              (cfg == null ? void 0 : cfg.buildNumber) && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
                "Build #",
                cfg.buildNumber
              ] })
            ] }),
            (cfg == null ? void 0 : cfg.isForceUpdate) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 inline-block px-2 py-1 bg-red-900 text-red-300 text-xs rounded", children: "🔴 FORCE UPDATE: All users should upgrade immediately" }),
            (cfg == null ? void 0 : cfg.releaseNotes) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground/80 text-sm", children: cfg.releaseNotes })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-wrap justify-center gap-3",
          "data-ocid": "extension-page.download_section",
          children: [
            showLocalDownload && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: localUrl,
                download: true,
                className: "flex items-center gap-2 px-8 py-3 bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg font-bold text-lg transition-smooth",
                "data-ocid": "extension-page.download.link",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-5 w-5" }),
                  "Download Extension (.zip) — v",
                  version
                ]
              }
            ),
            showWebStore && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: webStoreUrl,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "flex items-center gap-2 px-8 py-3 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-lg font-bold text-lg transition-smooth border border-border",
                "data-ocid": "extension-page.webstore.link",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-5 w-5" }),
                  "Chrome Web Store"
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-secondary/30 border border-border/40 p-6 rounded-lg space-y-4",
          "data-ocid": "extension-page.install-steps",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-lg flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5 text-green-400" }),
              "Sideload Installation Guide"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "space-y-2 text-sm text-foreground/80 ml-7 list-decimal", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Download the ZIP using the button above" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                "Extract the ZIP — a folder named",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "copie-paste-extension" }),
                " ",
                "will appear"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                "Open",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "font-mono text-accent", children: "chrome://extensions" }),
                " ",
                "in your browser"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                "Enable",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Developer Mode" }),
                " ",
                "(toggle in top-right corner)"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                "Click",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Load unpacked" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                "Select the extracted",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "copie-paste-extension" }),
                " ",
                "folder"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "The extension icon will appear in your Chrome toolbar — you're ready!" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-4", children: PLATFORMS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `${p.bg} p-4 rounded-lg space-y-2`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "h3",
              {
                className: `font-bold ${p.titleColor} flex items-center gap-2`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4" }),
                  " ",
                  p.name
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "text-sm text-foreground/70 space-y-1", children: p.fields.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              "✓ ",
              f
            ] }, f)) })
          ]
        },
        p.name
      )) })
    ] })
  ] }) });
}
export {
  ExtensionPage
};

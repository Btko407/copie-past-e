import { b as useActor, l as useQuery, j as jsxRuntimeExports, p as Layout, Z as Zap, g as CircleCheck, f as createActor } from "./index-B_oOf7NU.js";
import { D as Download } from "./download-Dt9Q1v_8.js";
function ExtensionPage() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const enabled = !!actor && !actorFetching;
  const { data: latestVersion, isLoading } = useQuery({
    queryKey: ["latestExtensionVersion"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      return await actor.getLatestExtensionVersion();
    },
    enabled
  });
  const v = latestVersion;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-4 py-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 text-4xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📋" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "COPIE PAST-E EXTENSION" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400", children: "Smart autofill for Facebook Marketplace & Mercari" })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "text-center text-gray-400",
        "data-ocid": "extension-page.loading_state",
        children: "Loading..."
      }
    ) : v ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500 p-6 rounded-lg",
          "data-ocid": "extension-page.version-card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-bold text-blue-300", children: [
                "✅ v",
                v.latestVersion
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-gray-400", children: [
                "Build #",
                v.buildNumber
              ] })
            ] }),
            v.isForceUpdate && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 inline-block px-2 py-1 bg-red-900 text-red-300 text-xs rounded", children: "🔴 FORCE UPDATE: All users should upgrade immediately" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-300", children: v.releaseNotes })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: v.downloadUrl,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "flex items-center gap-2 px-8 py-3 bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg font-bold text-lg transition-smooth",
          "data-ocid": "extension-page.download.link",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-5 w-5" }),
            "Install v",
            v.latestVersion
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-blue-300 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-5 w-5" }),
            " Facebook Marketplace"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-sm text-gray-300 space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✓ Auto-fill title" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✓ Auto-fill description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✓ Auto-fill price" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✓ Auto-fill category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✓ Auto-fill condition" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✓ Detect local pickup" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-pink-900/20 border border-pink-500/30 p-4 rounded-lg space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-pink-300 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-5 w-5" }),
            " Mercari"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-sm text-gray-300 space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✓ Auto-fill title" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✓ Auto-fill description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✓ Auto-fill price" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✓ Auto-fill brand" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✓ Auto-fill condition" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✓ Detect delivery options" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-secondary/30 border border-border/40 p-6 rounded-lg space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-lg flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5 text-green-400" }),
          "How It Works"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "space-y-2 text-sm text-gray-300 ml-7 list-decimal", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Install the extension from Chrome Web Store" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Visit a Facebook Marketplace or Mercari listing" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Click the Copie Past-e icon in your browser" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Select your destination platform" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "All available data auto-fills instantly!" })
        ] })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "text-center text-gray-400",
        "data-ocid": "extension-page.empty_state",
        children: "No version available"
      }
    )
  ] }) });
}
export {
  ExtensionPage
};

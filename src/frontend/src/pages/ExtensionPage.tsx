import { createActor } from "@/backend";
import { Layout } from "@/components/Layout";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Download, ExternalLink, Zap } from "lucide-react";

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
      "Local pickup detection",
    ],
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
      "Shipping type detection",
    ],
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
      "Shipping service",
    ],
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
      "Original price",
    ],
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
      "Gender",
    ],
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
      "Is Supply",
    ],
  },
];

export function ExtensionPage() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const enabled = !!actor && !actorFetching;

  const { data: extConfig, isLoading } = useQuery({
    queryKey: ["extensionConfig"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return await (actor as any).getExtensionConfig();
    },
    enabled,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cfg = extConfig as any;
  const version = cfg?.latestVersion ?? "1.3.1";
  const downloadMode: string = cfg?.downloadMode ?? "local";
  const localUrl: string =
    cfg?.localDownloadUrl ?? `/copie-paste-extension-v${version}.zip`;
  const webStoreUrl: string = cfg?.chromeWebStoreUrl ?? "";
  const showLocalDownload = downloadMode !== "webstore";
  const showWebStore =
    (downloadMode === "webstore" || downloadMode === "both") &&
    webStoreUrl.trim() !== "";

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-4xl">
            <span>📋</span>
            <span>COPIE PAST-E EXTENSION</span>
          </div>
          <p className="text-muted-foreground">
            Smart autofill for all 6 marketplaces — Facebook, Mercari, eBay,
            Poshmark, Depop, Etsy
          </p>
        </div>

        {isLoading ? (
          <div
            className="text-center text-muted-foreground"
            data-ocid="extension-page.loading_state"
          >
            Loading...
          </div>
        ) : (
          <div className="space-y-6">
            {/* Current Version */}
            <div
              className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500 p-6 rounded-lg"
              data-ocid="extension-page.version-card"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-blue-300">
                  ✅ v{version}
                </h2>
                {cfg?.buildNumber && (
                  <span className="text-sm text-muted-foreground">
                    Build #{cfg.buildNumber}
                  </span>
                )}
              </div>
              {cfg?.isForceUpdate && (
                <div className="mb-3 inline-block px-2 py-1 bg-red-900 text-red-300 text-xs rounded">
                  🔴 FORCE UPDATE: All users should upgrade immediately
                </div>
              )}
              {cfg?.releaseNotes && (
                <p className="text-foreground/80 text-sm">{cfg.releaseNotes}</p>
              )}
            </div>

            {/* Download Buttons */}
            <div
              className="flex flex-wrap justify-center gap-3"
              data-ocid="extension-page.download_section"
            >
              {showLocalDownload && (
                <a
                  href={localUrl}
                  download
                  className="flex items-center gap-2 px-8 py-3 bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg font-bold text-lg transition-smooth"
                  data-ocid="extension-page.download.link"
                >
                  <Download className="h-5 w-5" />
                  Download Extension (.zip) — v{version}
                </a>
              )}
              {showWebStore && (
                <a
                  href={webStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-8 py-3 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-lg font-bold text-lg transition-smooth border border-border"
                  data-ocid="extension-page.webstore.link"
                >
                  <ExternalLink className="h-5 w-5" />
                  Chrome Web Store
                </a>
              )}
            </div>

            {/* Install Instructions */}
            <div
              className="bg-secondary/30 border border-border/40 p-6 rounded-lg space-y-4"
              data-ocid="extension-page.install-steps"
            >
              <h3 className="font-bold text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                Sideload Installation Guide
              </h3>
              <ol className="space-y-2 text-sm text-foreground/80 ml-7 list-decimal">
                <li>Download the ZIP using the button above</li>
                <li>
                  Extract the ZIP — a folder named{" "}
                  <strong className="text-foreground">
                    copie-paste-extension
                  </strong>{" "}
                  will appear
                </li>
                <li>
                  Open{" "}
                  <strong className="font-mono text-accent">
                    chrome://extensions
                  </strong>{" "}
                  in your browser
                </li>
                <li>
                  Enable{" "}
                  <strong className="text-foreground">Developer Mode</strong>{" "}
                  (toggle in top-right corner)
                </li>
                <li>
                  Click{" "}
                  <strong className="text-foreground">Load unpacked</strong>
                </li>
                <li>
                  Select the extracted{" "}
                  <strong className="text-foreground">
                    copie-paste-extension
                  </strong>{" "}
                  folder
                </li>
                <li>
                  The extension icon will appear in your Chrome toolbar — you're
                  ready!
                </li>
              </ol>
            </div>

            {/* Platform Feature Grid — all 6 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PLATFORMS.map((p) => (
                <div
                  key={p.name}
                  className={`${p.bg} p-4 rounded-lg space-y-2`}
                >
                  <h3
                    className={`font-bold ${p.titleColor} flex items-center gap-2`}
                  >
                    <Zap className="h-4 w-4" /> {p.name}
                  </h3>
                  <ul className="text-sm text-foreground/70 space-y-1">
                    {p.fields.map((f) => (
                      <li key={f}>✓ {f}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

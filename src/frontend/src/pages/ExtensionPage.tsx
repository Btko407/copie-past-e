import { createActor } from "@/backend";
import { Layout } from "@/components/Layout";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Download, Zap } from "lucide-react";

export function ExtensionPage() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const enabled = !!actor && !actorFetching;

  const { data: latestVersion, isLoading } = useQuery({
    queryKey: ["latestExtensionVersion"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return await (actor as any).getLatestExtensionVersion();
    },
    enabled,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const v = latestVersion as any;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-4xl">
            <span>📋</span>
            <span>COPIE PAST-E EXTENSION</span>
          </div>
          <p className="text-gray-400">
            Smart autofill for Facebook Marketplace &amp; Mercari
          </p>
        </div>

        {isLoading ? (
          <div
            className="text-center text-gray-400"
            data-ocid="extension-page.loading_state"
          >
            Loading...
          </div>
        ) : v ? (
          <div className="space-y-6">
            {/* Current Version */}
            <div
              className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500 p-6 rounded-lg"
              data-ocid="extension-page.version-card"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-blue-300">
                  ✅ v{v.latestVersion}
                </h2>
                <span className="text-sm text-gray-400">
                  Build #{v.buildNumber}
                </span>
              </div>
              {v.isForceUpdate && (
                <div className="mb-3 inline-block px-2 py-1 bg-red-900 text-red-300 text-xs rounded">
                  🔴 FORCE UPDATE: All users should upgrade immediately
                </div>
              )}
              <p className="text-gray-300">{v.releaseNotes}</p>
            </div>

            {/* Download Button */}
            <div className="flex justify-center">
              <a
                href={v.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-3 bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg font-bold text-lg transition-smooth"
                data-ocid="extension-page.download.link"
              >
                <Download className="h-5 w-5" />
                Install v{v.latestVersion}
              </a>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg space-y-2">
                <h3 className="font-bold text-blue-300 flex items-center gap-2">
                  <Zap className="h-5 w-5" /> Facebook Marketplace
                </h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>✓ Auto-fill title</li>
                  <li>✓ Auto-fill description</li>
                  <li>✓ Auto-fill price</li>
                  <li>✓ Auto-fill category</li>
                  <li>✓ Auto-fill condition</li>
                  <li>✓ Detect local pickup</li>
                </ul>
              </div>
              <div className="bg-pink-900/20 border border-pink-500/30 p-4 rounded-lg space-y-2">
                <h3 className="font-bold text-pink-300 flex items-center gap-2">
                  <Zap className="h-5 w-5" /> Mercari
                </h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>✓ Auto-fill title</li>
                  <li>✓ Auto-fill description</li>
                  <li>✓ Auto-fill price</li>
                  <li>✓ Auto-fill brand</li>
                  <li>✓ Auto-fill condition</li>
                  <li>✓ Detect delivery options</li>
                </ul>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-secondary/30 border border-border/40 p-6 rounded-lg space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                How It Works
              </h3>
              <ol className="space-y-2 text-sm text-gray-300 ml-7 list-decimal">
                <li>Install the extension from Chrome Web Store</li>
                <li>Visit a Facebook Marketplace or Mercari listing</li>
                <li>Click the Copie Past-e icon in your browser</li>
                <li>Select your destination platform</li>
                <li>All available data auto-fills instantly!</li>
              </ol>
            </div>
          </div>
        ) : (
          <div
            className="text-center text-gray-400"
            data-ocid="extension-page.empty_state"
          >
            No version available
          </div>
        )}
      </div>
    </Layout>
  );
}

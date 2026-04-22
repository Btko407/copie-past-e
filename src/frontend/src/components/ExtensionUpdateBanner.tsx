import { useExtensionUpdateCheck } from "@/hooks/useExtension";
import { AlertCircle, Download } from "lucide-react";

interface ExtensionUpdateBannerProps {
  currentVersion: string;
}

export function ExtensionUpdateBanner({
  currentVersion,
}: ExtensionUpdateBannerProps) {
  const { data: updateInfo, isLoading } =
    useExtensionUpdateCheck(currentVersion);

  if (isLoading || !updateInfo || !updateInfo.needsUpdate) {
    return null;
  }

  const isForce = updateInfo.isForceUpdate;

  return (
    <div
      data-ocid="extension_update.banner"
      className={[
        "flex items-start gap-3 p-4 rounded-lg border",
        isForce
          ? "bg-destructive/10 border-destructive/50"
          : "bg-accent/10 border-accent/40",
      ].join(" ")}
    >
      <AlertCircle
        className={[
          "h-5 w-5 flex-shrink-0 mt-0.5",
          isForce ? "text-destructive" : "text-accent",
        ].join(" ")}
        aria-hidden="true"
      />

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground text-sm">
          {isForce ? "⚠️ Update Required" : "📦 Update Available"}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          v{updateInfo.currentVersion} → v{updateInfo.latestVersion}
        </p>
        {updateInfo.releaseNotes && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {updateInfo.releaseNotes}
          </p>
        )}
      </div>

      <a
        data-ocid="extension_update.download_button"
        href={updateInfo.downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={[
          "flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold",
          "whitespace-nowrap transition-colors duration-200 flex-shrink-0",
          "bg-primary text-primary-foreground hover:bg-primary/80",
        ].join(" ")}
        aria-label={isForce ? "Update extension now" : "Update extension"}
      >
        <Download className="h-3.5 w-3.5" aria-hidden="true" />
        {isForce ? "Update Now" : "Update"}
      </a>
    </div>
  );
}

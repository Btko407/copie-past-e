import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGenerateWebhookToken,
  useGetMyWebhookToken,
} from "@/hooks/useExtension";
import {
  useGetMyFbCredentials,
  useSaveFbCredentials,
} from "@/hooks/useFbGraph";
import {
  Check,
  Chrome,
  ClipboardList,
  Copy,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  Puzzle,
  RefreshCw,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";

// ─── Install steps ────────────────────────────────────────────────────────────

const INSTALL_STEPS = [
  {
    label: "Download the extension ZIP file",
    note: "Click the Download button above to get the extension package",
  },
  {
    label: "Extract the ZIP to a folder on your computer",
    note: null,
  },
  {
    label: "Open Chrome and go to chrome://extensions",
    note: null,
  },
  {
    label: "Enable Developer Mode",
    note: "Toggle in the top-right corner of the extensions page",
  },
  {
    label: "Click 'Load unpacked' and select the extracted folder",
    note: "Select the folder you extracted from the downloaded ZIP",
  },
  {
    label: "The Copie Past-e icon appears in your toolbar",
    note: "Pin it for easy access by clicking the puzzle piece icon",
  },
  {
    label: "Return to any listing and click Auto-Fill",
    note: "Your listings will be auto-filled directly into Facebook Marketplace",
  },
];

// ─── Extension file list (served from /extension/ public folder) ──────────────

const EXTENSION_FILES = [
  { name: "manifest.json", path: "/extension/manifest.json", binary: false },
  { name: "background.js", path: "/extension/background.js", binary: false },
  {
    name: "content-bridge.js",
    path: "/extension/content-bridge.js",
    binary: false,
  },
  {
    name: "content-facebook.js",
    path: "/extension/content-facebook.js",
    binary: false,
  },
  { name: "popup.html", path: "/extension/popup.html", binary: false },
  { name: "popup.js", path: "/extension/popup.js", binary: false },
  { name: "icon-16.png", path: "/extension/icon-16.png", binary: true },
  { name: "icon-48.png", path: "/extension/icon-48.png", binary: true },
  { name: "icon-128.png", path: "/extension/icon-128.png", binary: true },
  { name: "README.txt", path: "/extension/README.txt", binary: false },
];

// ─── Minimal ZIP builder (no external deps) ──────────────────────────────────
// Implements the ZIP local file header + central directory structure (store only, no compression).

function crc32(data: Uint8Array): number {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  let crc = 0xffffffff;
  for (const byte of data) {
    crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function writeUint16LE(view: DataView, offset: number, value: number) {
  view.setUint16(offset, value, true);
}

function writeUint32LE(view: DataView, offset: number, value: number) {
  view.setUint32(offset, value, true);
}

interface ZipEntry {
  name: string;
  data: Uint8Array;
  headerOffset: number;
}

function buildZip(
  files: Array<{ name: string; data: Uint8Array }>,
): Uint8Array {
  const enc = new TextEncoder();
  const entries: ZipEntry[] = [];
  const parts: Uint8Array[] = [];
  let offset = 0;

  // Local file headers + data
  for (const file of files) {
    const nameBytes = enc.encode(`copie-paste-extension/${file.name}`);
    const crc = crc32(file.data);
    const localHeaderSize = 30 + nameBytes.length;
    const localHeader = new ArrayBuffer(localHeaderSize);
    const view = new DataView(localHeader);

    writeUint32LE(view, 0, 0x04034b50); // local file header sig
    writeUint16LE(view, 4, 20); // version needed
    writeUint16LE(view, 6, 0); // flags
    writeUint16LE(view, 8, 0); // compression: store
    writeUint16LE(view, 10, 0); // mod time
    writeUint16LE(view, 12, 0); // mod date
    writeUint32LE(view, 14, crc); // crc32
    writeUint32LE(view, 18, file.data.length); // compressed size
    writeUint32LE(view, 22, file.data.length); // uncompressed size
    writeUint16LE(view, 26, nameBytes.length); // file name length
    writeUint16LE(view, 28, 0); // extra field length
    new Uint8Array(localHeader).set(nameBytes, 30);

    entries.push({ name: file.name, data: file.data, headerOffset: offset });
    parts.push(new Uint8Array(localHeader));
    parts.push(file.data);
    offset += localHeaderSize + file.data.length;
  }

  const centralDirStart = offset;

  // Central directory
  for (const entry of entries) {
    const nameBytes = enc.encode(`copie-paste-extension/${entry.name}`);
    const crc = crc32(entry.data);
    const cdHeaderSize = 46 + nameBytes.length;
    const cdHeader = new ArrayBuffer(cdHeaderSize);
    const view = new DataView(cdHeader);

    writeUint32LE(view, 0, 0x02014b50); // central dir sig
    writeUint16LE(view, 4, 20); // version made
    writeUint16LE(view, 6, 20); // version needed
    writeUint16LE(view, 8, 0); // flags
    writeUint16LE(view, 10, 0); // compression
    writeUint16LE(view, 12, 0); // mod time
    writeUint16LE(view, 14, 0); // mod date
    writeUint32LE(view, 16, crc); // crc32
    writeUint32LE(view, 20, entry.data.length); // compressed
    writeUint32LE(view, 24, entry.data.length); // uncompressed
    writeUint16LE(view, 28, nameBytes.length); // file name length
    writeUint16LE(view, 30, 0); // extra length
    writeUint16LE(view, 32, 0); // comment length
    writeUint16LE(view, 34, 0); // disk start
    writeUint16LE(view, 36, 0); // int attribs
    writeUint32LE(view, 38, 0); // ext attribs
    writeUint32LE(view, 42, entry.headerOffset); // local header offset
    new Uint8Array(cdHeader).set(nameBytes, 46);

    parts.push(new Uint8Array(cdHeader));
    offset += cdHeaderSize;
  }

  const centralDirSize = offset - centralDirStart;

  // End of central directory record
  const eocd = new ArrayBuffer(22);
  const eView = new DataView(eocd);
  writeUint32LE(eView, 0, 0x06054b50); // EOCD sig
  writeUint16LE(eView, 4, 0); // disk number
  writeUint16LE(eView, 6, 0); // disk with central dir
  writeUint16LE(eView, 8, entries.length); // entries on disk
  writeUint16LE(eView, 10, entries.length); // total entries
  writeUint32LE(eView, 12, centralDirSize); // central dir size
  writeUint32LE(eView, 16, centralDirStart); // central dir offset
  writeUint16LE(eView, 20, 0); // comment length
  parts.push(new Uint8Array(eocd));

  // Combine all parts
  const total = parts.reduce((sum, p) => sum + p.length, 0);
  const result = new Uint8Array(total);
  let pos = 0;
  for (const part of parts) {
    result.set(part, pos);
    pos += part.length;
  }
  return result;
}

// ─── Install Guide Section ────────────────────────────────────────────────────

function InstallGuideSection() {
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    try {
      const enc = new TextEncoder();
      const fileData: Array<{ name: string; data: Uint8Array }> = [];

      for (const file of EXTENSION_FILES) {
        const resp = await fetch(file.path);
        if (!resp.ok) {
          console.warn(
            `[Extension Download] Failed to fetch ${file.path}: ${resp.status}`,
          );
          continue;
        }
        if (file.binary) {
          const ab = await resp.arrayBuffer();
          fileData.push({ name: file.name, data: new Uint8Array(ab) });
        } else {
          const text = await resp.text();
          fileData.push({ name: file.name, data: enc.encode(text) });
        }
      }

      const zipBytes = buildZip(fileData);
      const blob = new Blob([zipBytes.buffer as ArrayBuffer], {
        type: "application/zip",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "copie-paste-extension-v1.0.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      toast.success("Extension downloaded! Follow the install steps below.");
    } catch (err) {
      toast.error("Download failed. Please try again.");
      console.error("[Extension Download]", err);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <section
      className="rounded-xl border border-primary/40 bg-card overflow-hidden neon-border-blue"
      data-ocid="extension-install-guide"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-border/50 bg-primary/5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center glow-blue-sm">
            <Download className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-lg text-primary text-glow-blue tracking-wider">
              INSTALL COPIE PAST-E EXTENSION
            </h1>
            <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
              Chrome Extension · Manifest V3 · v1.0.0
            </p>
          </div>
        </div>
        <p className="text-sm text-foreground/90 leading-relaxed mt-3">
          The extension lets you{" "}
          <span className="text-primary font-medium">
            auto-fill your listings
          </span>{" "}
          directly into Facebook Marketplace with one click — no copy-pasting
          required.
        </p>
      </div>

      {/* Download button */}
      <div className="px-6 py-5 border-b border-border/50">
        <Button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full sm:w-auto font-display tracking-wider text-xs h-10 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 glow-blue-sm"
          data-ocid="extension-download-btn"
        >
          <Download className="w-4 h-4" />
          {downloading ? "Generating zip..." : "⬇ Download Extension v1.0"}
        </Button>
        <p className="text-[11px] text-muted-foreground font-mono mt-2">
          Downloads as{" "}
          <code className="bg-muted px-1 rounded">
            copie-paste-extension-v1.0.zip
          </code>{" "}
          — extract and load in Chrome
        </p>
      </div>

      {/* Steps */}
      <div className="px-6 py-5">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardList className="w-4 h-4 text-primary" />
          <p className="font-display text-xs tracking-widest uppercase text-primary">
            Installation Steps
          </p>
        </div>
        <ol className="space-y-4">
          {INSTALL_STEPS.map((step, i) => (
            <li key={step.label} className="flex gap-4 items-start">
              <span className="shrink-0 w-7 h-7 rounded-full border border-primary/50 bg-primary/10 flex items-center justify-center font-display text-xs text-primary glow-blue-sm">
                {i + 1}
              </span>
              <div className="pt-0.5 min-w-0">
                <p className="text-sm text-foreground/90 leading-snug">
                  {step.label}
                </p>
                {step.note && (
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                    {step.note}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────

const HOW_IT_WORKS = [
  {
    icon: "🌐",
    title: "Browse a Listing",
    desc: "Navigate to any Facebook Marketplace listing while already logged into Facebook in your browser.",
  },
  {
    icon: "⚡",
    title: "Click Auto-Fill",
    desc: "Hit the Auto-Fill Facebook Marketplace button on the listing detail page. The extension opens Facebook and fills all form fields automatically.",
  },
  {
    icon: "📋",
    title: "Posted in Seconds",
    desc: "Review the pre-filled form — title, price, description, category, and images — then click Post.",
  },
];

function HowItWorksSection() {
  return (
    <section
      className="rounded-xl border border-border bg-card p-6 space-y-5"
      data-ocid="extension-how-section"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
          <ExternalLink className="w-4 h-4 text-accent" />
        </div>
        <h2 className="font-display text-base text-accent text-glow-yellow tracking-wider">
          HOW IT WORKS
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {HOW_IT_WORKS.map((item) => (
          <div
            key={item.title}
            className="rounded-lg border border-border bg-background p-4 space-y-2 hover:border-primary/40 transition-smooth"
          >
            <div className="text-3xl">{item.icon}</div>
            <p className="font-display text-sm text-primary tracking-wider">
              {item.title}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Webhook Token Section ────────────────────────────────────────────────────

function WebhookTokenSection() {
  const { data: webhookToken, isLoading: tokenLoading } =
    useGetMyWebhookToken();
  const generateToken = useGenerateWebhookToken();
  const [revealed, setRevealed] = useState(false);
  const [tokenCopied, setTokenCopied] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);

  const webhookUrl = webhookToken
    ? `${window.location.origin}/api/extension/webhook?token=${webhookToken}`
    : null;

  function handleCopyToken() {
    if (!webhookToken) return;
    navigator.clipboard.writeText(webhookToken);
    setTokenCopied(true);
    toast.success("Token copied to clipboard");
    setTimeout(() => setTokenCopied(false), 2000);
  }

  function handleCopyUrl() {
    if (!webhookUrl) return;
    navigator.clipboard.writeText(webhookUrl);
    setUrlCopied(true);
    toast.success("Webhook URL copied to clipboard");
    setTimeout(() => setUrlCopied(false), 2000);
  }

  async function handleGenerateToken() {
    try {
      await generateToken.mutateAsync();
      toast.success("New webhook token generated");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to generate token",
      );
    }
  }

  const maskedToken = webhookToken
    ? "•".repeat(Math.min(webhookToken.length, 40))
    : "";

  return (
    <section
      className="rounded-xl border border-border bg-card p-6 space-y-4"
      data-ocid="extension-token-section"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <Zap className="w-4 h-4 text-primary" />
        </div>
        <h2 className="font-display text-base text-primary text-glow-blue tracking-wider">
          YOUR WEBHOOK TOKEN
        </h2>
      </div>

      <p className="text-muted-foreground text-sm leading-relaxed">
        This token connects your browser extension to your Copie Past-e account.{" "}
        <span className="text-accent font-medium">Keep it private</span> —
        regenerating it disconnects any existing extension.
      </p>

      {tokenLoading ? (
        <Skeleton className="h-10 w-full" />
      ) : webhookToken ? (
        <div className="space-y-3">
          {/* Token field */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                readOnly
                value={revealed ? webhookToken : maskedToken}
                className="font-mono text-xs bg-background border-border pr-10"
                data-ocid="extension-webhook-token"
              />
              <button
                type="button"
                onClick={() => setRevealed((r) => !r)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={revealed ? "Hide token" : "Reveal token"}
              >
                {revealed ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyToken}
              aria-label="Copy token"
              className="neon-border-blue text-primary hover:bg-primary/10 shrink-0"
              data-ocid="extension-copy-token"
            >
              {tokenCopied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Webhook URL field */}
          {webhookUrl && (
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Full Webhook URL
              </Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={webhookUrl}
                  className="font-mono text-xs bg-background border-border"
                  data-ocid="extension-webhook-url"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyUrl}
                  aria-label="Copy webhook URL"
                  className="neon-border-blue text-primary hover:bg-primary/10 shrink-0"
                  data-ocid="extension-copy-webhook-url"
                >
                  {urlCopied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic">
          No token generated yet — click below to create one.
        </p>
      )}

      <Button
        variant="outline"
        onClick={handleGenerateToken}
        disabled={generateToken.isPending}
        className="flex items-center gap-2 neon-border-blue text-primary hover:bg-primary/10"
        data-ocid="extension-generate-token"
      >
        <RefreshCw
          className={`w-4 h-4 ${generateToken.isPending ? "animate-spin" : ""}`}
        />
        {webhookToken ? "Regenerate Token" : "Generate Token"}
      </Button>
    </section>
  );
}

// ─── Facebook Graph API Section ───────────────────────────────────────────────

function FbGraphSection() {
  const { data: fbCreds, isLoading: credsLoading } = useGetMyFbCredentials();
  const saveCreds = useSaveFbCredentials();
  const [fbAppId, setFbAppId] = useState("");
  const [fbAccessToken, setFbAccessToken] = useState("");
  const [tokenRevealed, setTokenRevealed] = useState(false);

  useEffect(() => {
    if (fbCreds) {
      setFbAppId(fbCreds.appId ?? "");
      setFbAccessToken(fbCreds.accessToken ?? "");
    }
  }, [fbCreds]);

  async function handleSaveFbCreds() {
    if (!fbAppId.trim() || !fbAccessToken.trim()) {
      toast.error("Both App ID and Access Token are required");
      return;
    }
    try {
      await saveCreds.mutateAsync({
        appId: fbAppId.trim(),
        accessToken: fbAccessToken.trim(),
      });
      toast.success("Facebook credentials saved");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save credentials",
      );
    }
  }

  return (
    <section
      className="rounded-xl border border-border bg-card p-6 space-y-4"
      data-ocid="extension-fb-section"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-sm">📘</span>
        </div>
        <h2 className="font-display text-base text-primary text-glow-blue tracking-wider">
          FACEBOOK GRAPH API
        </h2>
        <Badge
          variant="secondary"
          className="font-display text-xs tracking-wider ml-auto"
        >
          OPTIONAL
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        Connect your Facebook App credentials to import listings you own via the
        Facebook Graph API.{" "}
        <span className="text-accent font-medium">
          Only works for listings you own.
        </span>
      </p>

      {credsLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label
              htmlFor="fb-app-id"
              className="text-xs text-muted-foreground font-display tracking-wider"
            >
              FACEBOOK APP ID
            </Label>
            <Input
              id="fb-app-id"
              placeholder="Enter your Facebook App ID"
              value={fbAppId}
              onChange={(e) => setFbAppId(e.target.value)}
              className="bg-background border-border focus:border-primary focus:ring-primary"
              data-ocid="extension-fb-app-id"
            />
          </div>
          <div className="space-y-1">
            <Label
              htmlFor="fb-access-token"
              className="text-xs text-muted-foreground font-display tracking-wider"
            >
              ACCESS TOKEN
            </Label>
            <div className="relative">
              <Input
                id="fb-access-token"
                type={tokenRevealed ? "text" : "password"}
                placeholder="Enter your Facebook Access Token"
                value={fbAccessToken}
                onChange={(e) => setFbAccessToken(e.target.value)}
                className="bg-background border-border focus:border-primary focus:ring-primary pr-10"
                data-ocid="extension-fb-access-token"
              />
              <button
                type="button"
                onClick={() => setTokenRevealed((r) => !r)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={
                  tokenRevealed ? "Hide access token" : "Reveal access token"
                }
              >
                {tokenRevealed ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Generate an access token from your{" "}
            <a
              href="https://developers.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline underline-offset-2"
            >
              Facebook Developer App
            </a>
            . Requires the{" "}
            <code className="bg-muted px-1 rounded text-xs font-mono">
              user_marketplace
            </code>{" "}
            permission.
          </p>
          <Button
            onClick={handleSaveFbCreds}
            disabled={saveCreds.isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-display tracking-wider text-xs glow-blue-sm"
            data-ocid="extension-save-fb-creds"
          >
            {saveCreds.isPending ? "SAVING..." : "SAVE CREDENTIALS"}
          </Button>
        </div>
      )}
    </section>
  );
}

// ─── Supported Browsers ───────────────────────────────────────────────────────

function BrowsersSection() {
  return (
    <section
      className="rounded-xl border border-border bg-card p-6 space-y-4"
      data-ocid="extension-browsers-section"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <Chrome className="w-4 h-4 text-primary" />
        </div>
        <h2 className="font-display text-base text-primary text-glow-blue tracking-wider">
          SUPPORTED BROWSERS
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center gap-2 rounded-lg border neon-border-blue bg-background p-4">
          <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center glow-blue-sm">
            <Chrome className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display text-xs text-primary tracking-wider">
            CHROME
          </span>
          <Badge
            variant="outline"
            className="font-display text-[9px] tracking-wider border-primary/40 text-primary"
          >
            SUPPORTED
          </Badge>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-background/40 p-4 opacity-50">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <Puzzle className="w-5 h-5 text-muted-foreground" />
          </div>
          <span className="font-display text-xs text-muted-foreground tracking-wider">
            SAFARI
          </span>
          <Badge
            variant="secondary"
            className="font-display text-[9px] tracking-wider"
          >
            COMING SOON
          </Badge>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-background/40 p-4 opacity-50">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <Puzzle className="w-5 h-5 text-muted-foreground" />
          </div>
          <span className="font-display text-xs text-muted-foreground tracking-wider">
            FIREFOX
          </span>
          <Badge
            variant="secondary"
            className="font-display text-[9px] tracking-wider"
          >
            COMING SOON
          </Badge>
        </div>
      </div>
    </section>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export function ExtensionPage() {
  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden">
        {/* Retro grid backdrop */}
        <div className="absolute inset-0 retro-grid opacity-30 pointer-events-none" />
        {/* Ambient glow */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[500px] h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl mx-auto px-4 py-8 space-y-6">
          {/* Browser / device compatibility notice */}
          <div
            className="flex gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3"
            role="note"
            data-ocid="extension-compatibility-notice"
          >
            <span className="shrink-0 text-base mt-0.5">🖥️</span>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="text-foreground font-medium">
                Smart Post works on desktop computers using Google Chrome or
                Microsoft Edge.
              </span>{" "}
              It is not available on mobile browsers, Safari, or Firefox.
            </p>
          </div>

          {/* Hero header */}
          <div className="text-center space-y-3 pb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-display tracking-widest mb-2">
              <Puzzle className="w-3 h-3" />
              BROWSER EXTENSION
            </div>
            <h1 className="font-display text-2xl sm:text-3xl text-foreground leading-tight">
              COPIE PAST-E{" "}
              <span className="text-primary text-glow-blue">EXTENSION</span>
            </h1>
            <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
              Auto-fill listings directly into{" "}
              <span className="text-primary">Facebook Marketplace</span> with
              one click.
            </p>
          </div>

          {/* Install guide — PRIMARY, first and most prominent */}
          <InstallGuideSection />

          {/* How it works */}
          <HowItWorksSection />

          {/* Browser support */}
          <BrowsersSection />

          {/* Webhook token */}
          <WebhookTokenSection />

          {/* Facebook Graph API */}
          <FbGraphSection />
        </div>
      </div>
    </Layout>
  );
}

import { c as createLucideIcon, j as jsxRuntimeExports, d as Layout, r as reactExports, B as Button, Z as Zap, S as Skeleton, I as Input, C as Copy, l as Label, R as RefreshCw, a as ue } from "./index-D1sD4pLM.js";
import { B as Badge } from "./badge-BR0j4Hou.js";
import { a as useGetMyWebhookToken, b as useGenerateWebhookToken } from "./useExtension-B6brG5Ag.js";
import { u as useGetMyFbCredentials, a as useSaveFbCredentials } from "./useFbGraph-oRT9io8Q.js";
import { D as Download } from "./download-BSfNEqiy.js";
import { E as ExternalLink } from "./external-link-Cc8GEmLX.js";
import { E as EyeOff } from "./eye-off-BXBsG6w4.js";
import { E as Eye } from "./eye-0hLs4BeR.js";
import { C as Check } from "./check-C3l7mHYb.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["line", { x1: "21.17", x2: "12", y1: "8", y2: "8", key: "a0cw5f" }],
  ["line", { x1: "3.95", x2: "8.54", y1: "6.06", y2: "14", key: "1kftof" }],
  ["line", { x1: "10.88", x2: "15.46", y1: "21.94", y2: "14", key: "1ymyh8" }]
];
const Chrome = createLucideIcon("chrome", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ],
  ["path", { d: "M12 11h4", key: "1jrz19" }],
  ["path", { d: "M12 16h4", key: "n85exb" }],
  ["path", { d: "M8 11h.01", key: "1dfujw" }],
  ["path", { d: "M8 16h.01", key: "18s6g9" }]
];
const ClipboardList = createLucideIcon("clipboard-list", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z",
      key: "w46dr5"
    }
  ]
];
const Puzzle = createLucideIcon("puzzle", __iconNode);
const INSTALL_STEPS = [
  {
    label: "Download the extension ZIP file",
    note: "Click the Download button above to get the extension package"
  },
  {
    label: "Extract the ZIP to a folder on your computer",
    note: null
  },
  {
    label: "Open Chrome and go to chrome://extensions",
    note: null
  },
  {
    label: "Enable Developer Mode",
    note: "Toggle in the top-right corner of the extensions page"
  },
  {
    label: "Click 'Load unpacked' and select the extracted folder",
    note: "Select the folder you extracted from the downloaded ZIP"
  },
  {
    label: "The Copie Past-e icon appears in your toolbar",
    note: "Pin it for easy access by clicking the puzzle piece icon"
  },
  {
    label: "Return to any listing and click Auto-Fill",
    note: "Your listings will be auto-filled directly into Facebook Marketplace"
  }
];
const EXTENSION_FILES = [
  { name: "manifest.json", path: "/extension/manifest.json", binary: false },
  { name: "background.js", path: "/extension/background.js", binary: false },
  {
    name: "content-bridge.js",
    path: "/extension/content-bridge.js",
    binary: false
  },
  {
    name: "content-facebook.js",
    path: "/extension/content-facebook.js",
    binary: false
  },
  { name: "popup.html", path: "/extension/popup.html", binary: false },
  { name: "popup.js", path: "/extension/popup.js", binary: false },
  { name: "icon-16.png", path: "/extension/icon-16.png", binary: true },
  { name: "icon-48.png", path: "/extension/icon-48.png", binary: true },
  { name: "icon-128.png", path: "/extension/icon-128.png", binary: true },
  { name: "README.txt", path: "/extension/README.txt", binary: false }
];
function crc32(data) {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
    }
    table[i] = c;
  }
  let crc = 4294967295;
  for (const byte of data) {
    crc = table[(crc ^ byte) & 255] ^ crc >>> 8;
  }
  return (crc ^ 4294967295) >>> 0;
}
function writeUint16LE(view, offset, value) {
  view.setUint16(offset, value, true);
}
function writeUint32LE(view, offset, value) {
  view.setUint32(offset, value, true);
}
function buildZip(files) {
  const enc = new TextEncoder();
  const entries = [];
  const parts = [];
  let offset = 0;
  for (const file of files) {
    const nameBytes = enc.encode(`copie-paste-extension/${file.name}`);
    const crc = crc32(file.data);
    const localHeaderSize = 30 + nameBytes.length;
    const localHeader = new ArrayBuffer(localHeaderSize);
    const view = new DataView(localHeader);
    writeUint32LE(view, 0, 67324752);
    writeUint16LE(view, 4, 20);
    writeUint16LE(view, 6, 0);
    writeUint16LE(view, 8, 0);
    writeUint16LE(view, 10, 0);
    writeUint16LE(view, 12, 0);
    writeUint32LE(view, 14, crc);
    writeUint32LE(view, 18, file.data.length);
    writeUint32LE(view, 22, file.data.length);
    writeUint16LE(view, 26, nameBytes.length);
    writeUint16LE(view, 28, 0);
    new Uint8Array(localHeader).set(nameBytes, 30);
    entries.push({ name: file.name, data: file.data, headerOffset: offset });
    parts.push(new Uint8Array(localHeader));
    parts.push(file.data);
    offset += localHeaderSize + file.data.length;
  }
  const centralDirStart = offset;
  for (const entry of entries) {
    const nameBytes = enc.encode(`copie-paste-extension/${entry.name}`);
    const crc = crc32(entry.data);
    const cdHeaderSize = 46 + nameBytes.length;
    const cdHeader = new ArrayBuffer(cdHeaderSize);
    const view = new DataView(cdHeader);
    writeUint32LE(view, 0, 33639248);
    writeUint16LE(view, 4, 20);
    writeUint16LE(view, 6, 20);
    writeUint16LE(view, 8, 0);
    writeUint16LE(view, 10, 0);
    writeUint16LE(view, 12, 0);
    writeUint16LE(view, 14, 0);
    writeUint32LE(view, 16, crc);
    writeUint32LE(view, 20, entry.data.length);
    writeUint32LE(view, 24, entry.data.length);
    writeUint16LE(view, 28, nameBytes.length);
    writeUint16LE(view, 30, 0);
    writeUint16LE(view, 32, 0);
    writeUint16LE(view, 34, 0);
    writeUint16LE(view, 36, 0);
    writeUint32LE(view, 38, 0);
    writeUint32LE(view, 42, entry.headerOffset);
    new Uint8Array(cdHeader).set(nameBytes, 46);
    parts.push(new Uint8Array(cdHeader));
    offset += cdHeaderSize;
  }
  const centralDirSize = offset - centralDirStart;
  const eocd = new ArrayBuffer(22);
  const eView = new DataView(eocd);
  writeUint32LE(eView, 0, 101010256);
  writeUint16LE(eView, 4, 0);
  writeUint16LE(eView, 6, 0);
  writeUint16LE(eView, 8, entries.length);
  writeUint16LE(eView, 10, entries.length);
  writeUint32LE(eView, 12, centralDirSize);
  writeUint32LE(eView, 16, centralDirStart);
  writeUint16LE(eView, 20, 0);
  parts.push(new Uint8Array(eocd));
  const total = parts.reduce((sum, p) => sum + p.length, 0);
  const result = new Uint8Array(total);
  let pos = 0;
  for (const part of parts) {
    result.set(part, pos);
    pos += part.length;
  }
  return result;
}
function InstallGuideSection() {
  const [downloading, setDownloading] = reactExports.useState(false);
  async function handleDownload() {
    setDownloading(true);
    try {
      const enc = new TextEncoder();
      const fileData = [];
      for (const file of EXTENSION_FILES) {
        const resp = await fetch(file.path);
        if (!resp.ok) {
          console.warn(
            `[Extension Download] Failed to fetch ${file.path}: ${resp.status}`
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
      const blob = new Blob([zipBytes.buffer], {
        type: "application/zip"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "copie-paste-extension-v1.0.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5e3);
      ue.success("Extension downloaded! Follow the install steps below.");
    } catch (err) {
      ue.error("Download failed. Please try again.");
      console.error("[Extension Download]", err);
    } finally {
      setDownloading(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "rounded-xl border border-primary/40 bg-card overflow-hidden neon-border-blue",
      "data-ocid": "extension-install-guide",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 border-b border-border/50 bg-primary/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center glow-blue-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-5 h-5 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-lg text-primary text-glow-blue tracking-wider", children: "INSTALL COPIE PAST-E EXTENSION" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[11px] text-muted-foreground mt-0.5", children: "Chrome Extension · Manifest V3 · v1.0.0" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-foreground/90 leading-relaxed mt-3", children: [
            "The extension lets you",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-medium", children: "auto-fill your listings" }),
            " ",
            "directly into Facebook Marketplace with one click — no copy-pasting required."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 border-b border-border/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handleDownload,
              disabled: downloading,
              className: "w-full sm:w-auto font-display tracking-wider text-xs h-10 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 glow-blue-sm",
              "data-ocid": "extension-download-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4" }),
                downloading ? "Generating zip..." : "⬇ Download Extension v1.0"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground font-mono mt-2", children: [
            "Downloads as",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "bg-muted px-1 rounded", children: "copie-paste-extension-v1.0.zip" }),
            " ",
            "— extract and load in Chrome"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "w-4 h-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs tracking-widest uppercase text-primary", children: "Installation Steps" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "space-y-4", children: INSTALL_STEPS.map((step, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-4 items-start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 w-7 h-7 rounded-full border border-primary/50 bg-primary/10 flex items-center justify-center font-display text-xs text-primary glow-blue-sm", children: i + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-0.5 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/90 leading-snug", children: step.label }),
              step.note && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5 leading-snug", children: step.note })
            ] })
          ] }, step.label)) })
        ] })
      ]
    }
  );
}
const HOW_IT_WORKS = [
  {
    icon: "🌐",
    title: "Browse a Listing",
    desc: "Navigate to any Facebook Marketplace listing while already logged into Facebook in your browser."
  },
  {
    icon: "⚡",
    title: "Click Auto-Fill",
    desc: "Hit the Auto-Fill Facebook Marketplace button on the listing detail page. The extension opens Facebook and fills all form fields automatically."
  },
  {
    icon: "📋",
    title: "Posted in Seconds",
    desc: "Review the pre-filled form — title, price, description, category, and images — then click Post."
  }
];
function HowItWorksSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "rounded-xl border border-border bg-card p-6 space-y-5",
      "data-ocid": "extension-how-section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-4 h-4 text-accent" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base text-accent text-glow-yellow tracking-wider", children: "HOW IT WORKS" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: HOW_IT_WORKS.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-lg border border-border bg-background p-4 space-y-2 hover:border-primary/40 transition-smooth",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl", children: item.icon }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-sm text-primary tracking-wider", children: item.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: item.desc })
            ]
          },
          item.title
        )) })
      ]
    }
  );
}
function WebhookTokenSection() {
  const { data: webhookToken, isLoading: tokenLoading } = useGetMyWebhookToken();
  const generateToken = useGenerateWebhookToken();
  const [revealed, setRevealed] = reactExports.useState(false);
  const [tokenCopied, setTokenCopied] = reactExports.useState(false);
  const [urlCopied, setUrlCopied] = reactExports.useState(false);
  const webhookUrl = webhookToken ? `${window.location.origin}/api/extension/webhook?token=${webhookToken}` : null;
  function handleCopyToken() {
    if (!webhookToken) return;
    navigator.clipboard.writeText(webhookToken);
    setTokenCopied(true);
    ue.success("Token copied to clipboard");
    setTimeout(() => setTokenCopied(false), 2e3);
  }
  function handleCopyUrl() {
    if (!webhookUrl) return;
    navigator.clipboard.writeText(webhookUrl);
    setUrlCopied(true);
    ue.success("Webhook URL copied to clipboard");
    setTimeout(() => setUrlCopied(false), 2e3);
  }
  async function handleGenerateToken() {
    try {
      await generateToken.mutateAsync();
      ue.success("New webhook token generated");
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to generate token"
      );
    }
  }
  const maskedToken = webhookToken ? "•".repeat(Math.min(webhookToken.length, 40)) : "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "rounded-xl border border-border bg-card p-6 space-y-4",
      "data-ocid": "extension-token-section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base text-primary text-glow-blue tracking-wider", children: "YOUR WEBHOOK TOKEN" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm leading-relaxed", children: [
          "This token connects your browser extension to your Copie Past-e account.",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-medium", children: "Keep it private" }),
          " — regenerating it disconnects any existing extension."
        ] }),
        tokenLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }) : webhookToken ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  readOnly: true,
                  value: revealed ? webhookToken : maskedToken,
                  className: "font-mono text-xs bg-background border-border pr-10",
                  "data-ocid": "extension-webhook-token"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setRevealed((r) => !r),
                  className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
                  "aria-label": revealed ? "Hide token" : "Reveal token",
                  children: revealed ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "icon",
                onClick: handleCopyToken,
                "aria-label": "Copy token",
                className: "neon-border-blue text-primary hover:bg-primary/10 shrink-0",
                "data-ocid": "extension-copy-token",
                children: tokenCopied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-4 h-4" })
              }
            )
          ] }),
          webhookUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Full Webhook URL" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  readOnly: true,
                  value: webhookUrl,
                  className: "font-mono text-xs bg-background border-border",
                  "data-ocid": "extension-webhook-url"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "icon",
                  onClick: handleCopyUrl,
                  "aria-label": "Copy webhook URL",
                  className: "neon-border-blue text-primary hover:bg-primary/10 shrink-0",
                  "data-ocid": "extension-copy-webhook-url",
                  children: urlCopied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-4 h-4" })
                }
              )
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground italic", children: "No token generated yet — click below to create one." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            onClick: handleGenerateToken,
            disabled: generateToken.isPending,
            className: "flex items-center gap-2 neon-border-blue text-primary hover:bg-primary/10",
            "data-ocid": "extension-generate-token",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                RefreshCw,
                {
                  className: `w-4 h-4 ${generateToken.isPending ? "animate-spin" : ""}`
                }
              ),
              webhookToken ? "Regenerate Token" : "Generate Token"
            ]
          }
        )
      ]
    }
  );
}
function FbGraphSection() {
  const { data: fbCreds, isLoading: credsLoading } = useGetMyFbCredentials();
  const saveCreds = useSaveFbCredentials();
  const [fbAppId, setFbAppId] = reactExports.useState("");
  const [fbAccessToken, setFbAccessToken] = reactExports.useState("");
  const [tokenRevealed, setTokenRevealed] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (fbCreds) {
      setFbAppId(fbCreds.appId ?? "");
      setFbAccessToken(fbCreds.accessToken ?? "");
    }
  }, [fbCreds]);
  async function handleSaveFbCreds() {
    if (!fbAppId.trim() || !fbAccessToken.trim()) {
      ue.error("Both App ID and Access Token are required");
      return;
    }
    try {
      await saveCreds.mutateAsync({
        appId: fbAppId.trim(),
        accessToken: fbAccessToken.trim()
      });
      ue.success("Facebook credentials saved");
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to save credentials"
      );
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "rounded-xl border border-border bg-card p-6 space-y-4",
      "data-ocid": "extension-fb-section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "📘" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base text-primary text-glow-blue tracking-wider", children: "FACEBOOK GRAPH API" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "secondary",
              className: "font-display text-xs tracking-wider ml-auto",
              children: "OPTIONAL"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground leading-relaxed", children: [
          "Connect your Facebook App credentials to import listings you own via the Facebook Graph API.",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-medium", children: "Only works for listings you own." })
        ] }),
        credsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "fb-app-id",
                className: "text-xs text-muted-foreground font-display tracking-wider",
                children: "FACEBOOK APP ID"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "fb-app-id",
                placeholder: "Enter your Facebook App ID",
                value: fbAppId,
                onChange: (e) => setFbAppId(e.target.value),
                className: "bg-background border-border focus:border-primary focus:ring-primary",
                "data-ocid": "extension-fb-app-id"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "fb-access-token",
                className: "text-xs text-muted-foreground font-display tracking-wider",
                children: "ACCESS TOKEN"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "fb-access-token",
                  type: tokenRevealed ? "text" : "password",
                  placeholder: "Enter your Facebook Access Token",
                  value: fbAccessToken,
                  onChange: (e) => setFbAccessToken(e.target.value),
                  className: "bg-background border-border focus:border-primary focus:ring-primary pr-10",
                  "data-ocid": "extension-fb-access-token"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setTokenRevealed((r) => !r),
                  className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
                  "aria-label": tokenRevealed ? "Hide access token" : "Reveal access token",
                  children: tokenRevealed ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Generate an access token from your",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "https://developers.facebook.com/",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-primary hover:underline underline-offset-2",
                children: "Facebook Developer App"
              }
            ),
            ". Requires the",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "bg-muted px-1 rounded text-xs font-mono", children: "user_marketplace" }),
            " ",
            "permission."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleSaveFbCreds,
              disabled: saveCreds.isPending,
              className: "bg-primary text-primary-foreground hover:bg-primary/90 font-display tracking-wider text-xs glow-blue-sm",
              "data-ocid": "extension-save-fb-creds",
              children: saveCreds.isPending ? "SAVING..." : "SAVE CREDENTIALS"
            }
          )
        ] })
      ]
    }
  );
}
function BrowsersSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "rounded-xl border border-border bg-card p-6 space-y-4",
      "data-ocid": "extension-browsers-section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Chrome, { className: "w-4 h-4 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base text-primary text-glow-blue tracking-wider", children: "SUPPORTED BROWSERS" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 rounded-lg border neon-border-blue bg-background p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center glow-blue-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Chrome, { className: "w-5 h-5 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xs text-primary tracking-wider", children: "CHROME" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: "font-display text-[9px] tracking-wider border-primary/40 text-primary",
                children: "SUPPORTED"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 rounded-lg border border-border bg-background/40 p-4 opacity-50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Puzzle, { className: "w-5 h-5 text-muted-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xs text-muted-foreground tracking-wider", children: "SAFARI" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "secondary",
                className: "font-display text-[9px] tracking-wider",
                children: "COMING SOON"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 rounded-lg border border-border bg-background/40 p-4 opacity-50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Puzzle, { className: "w-5 h-5 text-muted-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xs text-muted-foreground tracking-wider", children: "FIREFOX" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "secondary",
                className: "font-display text-[9px] tracking-wider",
                children: "COMING SOON"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function ExtensionPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 retro-grid opacity-30 pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-16 left-1/2 -translate-x-1/2 w-[500px] h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-2xl mx-auto px-4 py-8 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3",
          role: "note",
          "data-ocid": "extension-compatibility-notice",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 text-base mt-0.5", children: "🖥️" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground leading-relaxed", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: "Smart Post works on desktop computers using Google Chrome or Microsoft Edge." }),
              " ",
              "It is not available on mobile browsers, Safari, or Firefox."
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-3 pb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-display tracking-widest mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Puzzle, { className: "w-3 h-3" }),
          "BROWSER EXTENSION"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl sm:text-3xl text-foreground leading-tight", children: [
          "COPIE PAST-E",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary text-glow-blue", children: "EXTENSION" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm max-w-md mx-auto leading-relaxed", children: [
          "Auto-fill listings directly into",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Facebook Marketplace" }),
          " with one click."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InstallGuideSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HowItWorksSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(BrowsersSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(WebhookTokenSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FbGraphSection, {})
    ] })
  ] }) });
}
export {
  ExtensionPage
};

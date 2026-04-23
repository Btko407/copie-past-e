import { c as createLucideIcon, n as useAdminSettingsContext, j as jsxRuntimeExports, B as Button, C as Copy, r as reactExports, S as Skeleton, X, Z as Zap, p as Link, a as ue, b as useActor, d as useQueryClient, e as useMutation, g as createActor, E as ExternalBlob, q as useParams, u as useNavigate, s as useQuery, A as ArrowLeft, k as Input } from "./index-lWC1fMpK.js";
import { A as AlertDialog, a as AlertDialogTrigger, b as AlertDialogContent, c as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./alert-dialog-DgRvb5H3.js";
import { T as Textarea } from "./textarea-CTHY_ej7.js";
import { c as copyText, u as useListingImages, e as useTogglePin, f as useToggleFavorite } from "./copyText-CPCKujva.js";
import { C as ChevronRight } from "./chevron-right-DrWfliLU.js";
import { L as LoaderCircle } from "./loader-circle-IA2cLEZB.js";
import { C as Check } from "./check-j5UfQD6d.js";
import { D as Download } from "./download-CnQb10sO.js";
import { L as LightningAnimation } from "./LightningAnimation-nMYLB5Vq.js";
import { E as ExternalLink } from "./external-link-DzGz4tAJ.js";
import { d as decodeCategory, S as SUBCATEGORY_MAP, C as CATEGORIES, a as CONDITIONS, e as encodeCategory } from "./categories-5mm-YhKT.js";
import { T as Trash2 } from "./trash-2-BvyAkMKH.js";
import { S as Star } from "./star-Lj2614gO.js";
import "./index-7QoLKWwe.js";
import "./index-BTP5BDoM.js";
import "./index-BZk8mP9n.js";
import "./index-D6oI0v4c.js";
import "./index-C9h83G72.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["path", { d: "M15 12H3", key: "6jk70r" }],
  ["path", { d: "M17 18H3", key: "1amg6g" }],
  ["path", { d: "M21 6H3", key: "1jwq7v" }]
];
const AlignLeft = createLucideIcon("align-left", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
const FileText = createLucideIcon("file-text", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["line", { x1: "2", x2: "22", y1: "2", y2: "22", key: "a6p6uj" }],
  ["path", { d: "M10.41 10.41a2 2 0 1 1-2.83-2.83", key: "1bzlo9" }],
  ["line", { x1: "13.5", x2: "6", y1: "13.5", y2: "21", key: "1q0aeu" }],
  ["line", { x1: "18", x2: "21", y1: "12", y2: "15", key: "5mozeu" }],
  [
    "path",
    {
      d: "M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59",
      key: "mmje98"
    }
  ],
  ["path", { d: "M21 15V5a2 2 0 0 0-2-2H9", key: "43el77" }]
];
const ImageOff = createLucideIcon("image-off", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M16 5h6", key: "1vod17" }],
  ["path", { d: "M19 2v6", key: "4bpg5p" }],
  ["path", { d: "M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5", key: "1ue2ih" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }]
];
const ImagePlus = createLucideIcon("image-plus", __iconNode$1);
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
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("pencil", __iconNode);
function useAnimatedButton(idleLabel, successLabel) {
  const [btnState, setBtnState] = reactExports.useState({
    state: "idle",
    label: idleLabel
  });
  const run = reactExports.useCallback(
    async (action) => {
      setBtnState({ state: "loading", label: successLabel });
      try {
        await action();
        setBtnState({ state: "success", label: successLabel });
      } catch {
        setBtnState({ state: "error", label: "Failed — Try Again" });
      } finally {
        setTimeout(() => {
          setBtnState({ state: "idle", label: idleLabel });
        }, 1500);
      }
    },
    [idleLabel, successLabel]
  );
  return { btnState, run };
}
function getAnimatedClass(state, baseClass) {
  if (state === "loading" || state === "success") {
    return `${baseClass} animate-lightning opacity-90`;
  }
  if (state === "error") {
    return "neon-border-red glow-red hover:glow-red transition-smooth font-mono text-xs uppercase tracking-wider text-destructive animate-pulse";
  }
  return baseClass;
}
function CopyButtons({ title, description, price }) {
  const { copyButtonsEnabled } = useAdminSettingsContext();
  const titleBtn = useAnimatedButton("Copy Title", "Copied!");
  const descBtn = useAnimatedButton("Copy Description", "Copied!");
  const fullPostBtn = useAnimatedButton("Copy Full Post", "Copied!");
  if (!copyButtonsEnabled) return null;
  const fullPost = [title, price, description].filter(Boolean).join("\n");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", "data-ocid": "copy-buttons-section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "outline",
        size: "sm",
        disabled: titleBtn.btnState.state !== "idle",
        className: getAnimatedClass(
          titleBtn.btnState.state,
          "neon-border-blue hover:glow-blue-sm transition-smooth font-mono text-xs uppercase tracking-wider"
        ),
        onClick: () => titleBtn.run(async () => {
          await copyText(title);
        }),
        "data-ocid": "copy-title-btn",
        children: [
          titleBtn.btnState.state === "loading" || titleBtn.btnState.state === "success" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-1.5", children: "⚡" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5 mr-1.5" }),
          titleBtn.btnState.label
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "outline",
        size: "sm",
        disabled: descBtn.btnState.state !== "idle",
        className: getAnimatedClass(
          descBtn.btnState.state,
          "neon-border-blue hover:glow-blue-sm transition-smooth font-mono text-xs uppercase tracking-wider"
        ),
        onClick: () => descBtn.run(async () => {
          await copyText(description);
        }),
        "data-ocid": "copy-description-btn",
        children: [
          descBtn.btnState.state === "loading" || descBtn.btnState.state === "success" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-1.5", children: "⚡" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AlignLeft, { className: "w-3.5 h-3.5 mr-1.5" }),
          descBtn.btnState.label
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "outline",
        size: "sm",
        disabled: fullPostBtn.btnState.state !== "idle",
        className: getAnimatedClass(
          fullPostBtn.btnState.state,
          "neon-border-yellow hover:glow-yellow-sm transition-smooth font-mono text-xs uppercase tracking-wider text-accent"
        ),
        onClick: () => fullPostBtn.run(async () => {
          await copyText(fullPost);
        }),
        "data-ocid": "copy-full-post-btn",
        children: [
          fullPostBtn.btnState.state === "loading" || fullPostBtn.btnState.state === "success" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-1.5", children: "⚡" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-3.5 h-3.5 mr-1.5" }),
          fullPostBtn.btnState.label
        ]
      }
    )
  ] }) });
}
function isIOSSafari() {
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/i.test(ua) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  const isChrome = /CriOS/i.test(ua);
  return isIOS && !isChrome;
}
async function fetchImageBlob(imageUrl) {
  try {
    const res = await fetch(imageUrl, { mode: "cors" });
    if (!res.ok) return null;
    return await res.blob();
  } catch {
    return null;
  }
}
function triggerAnchorDownload(blob, filename) {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.rel = "noopener noreferrer";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(objectUrl), 3e4);
}
async function downloadImageFromUrl(imageUrl, filename = "listing-image.jpg") {
  const blob = await fetchImageBlob(imageUrl);
  if (!blob) {
    try {
      window.open(imageUrl, "_blank", "noopener noreferrer");
    } catch {
    }
    return {
      ok: false,
      error: "Failed to fetch image",
      fallbackUrl: imageUrl
    };
  }
  const mimeType = blob.type.startsWith("image/") ? blob.type : "image/jpeg";
  const file = new File([blob], filename, { type: mimeType });
  if (isIOSSafari()) {
    if (typeof navigator.share === "function" && typeof navigator.canShare === "function" && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: "Save Image"
        });
        return { ok: true };
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return { ok: true };
        }
      }
    }
    try {
      window.open(imageUrl, "_blank", "noopener noreferrer");
    } catch {
    }
    return {
      ok: false,
      error: "Press and hold this image, then tap Save to Photos.",
      fallbackUrl: imageUrl
    };
  }
  try {
    triggerAnchorDownload(blob, filename);
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Download failed";
    return { ok: false, error: msg, fallbackUrl: imageUrl };
  }
}
function ImageCarousel({ images }) {
  const [activeIndex, setActiveIndex] = reactExports.useState(0);
  const [downloadState, setDownloadState] = reactExports.useState("idle");
  const [fallbackUrl, setFallbackUrl] = reactExports.useState(null);
  function prev() {
    setActiveIndex((i) => i === 0 ? images.length - 1 : i - 1);
    setDownloadState("idle");
    setFallbackUrl(null);
  }
  function next() {
    setActiveIndex((i) => i === images.length - 1 ? 0 : i + 1);
    setDownloadState("idle");
    setFallbackUrl(null);
  }
  async function handleDownload(img, idx) {
    if (downloadState === "loading") return;
    setDownloadState("loading");
    setFallbackUrl(null);
    const url = img.blob.getDirectURL();
    const filename = img.altText ? `${img.altText.slice(0, 40).replace(/\s+/g, "-").toLowerCase()}.jpg` : `listing-image-${idx + 1}.jpg`;
    const result = await downloadImageFromUrl(url, filename);
    if (!result.ok) {
      setFallbackUrl(result.fallbackUrl ?? url);
      setDownloadState("fallback");
      try {
        window.open(result.fallbackUrl ?? url, "_blank", "noopener noreferrer");
      } catch {
      }
      setTimeout(() => {
        setDownloadState("idle");
        setFallbackUrl(null);
      }, 5e3);
      return;
    }
    setDownloadState("done");
    setTimeout(() => {
      setDownloadState("idle");
    }, 1200);
  }
  if (images.length === 0) return null;
  const active = images[activeIndex];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", "data-ocid": "image-carousel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group rounded-lg overflow-hidden neon-border-blue bg-card aspect-video flex items-center justify-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: active.blob.getDirectURL(),
          alt: active.altText,
          className: "w-full h-full object-contain"
        }
      ),
      images.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: prev,
            className: "absolute left-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-background/80 border border-border hover:neon-border-blue hover:glow-blue-sm transition-smooth opacity-0 group-hover:opacity-100 sm:block hidden",
            "aria-label": "Previous image",
            "data-ocid": "carousel-prev",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: prev,
            className: "absolute left-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-background/80 border border-border transition-smooth sm:hidden",
            "aria-label": "Previous image",
            "data-ocid": "carousel-prev-mobile",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: next,
            className: "absolute right-12 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-background/80 border border-border hover:neon-border-blue hover:glow-blue-sm transition-smooth opacity-0 group-hover:opacity-100 sm:block hidden",
            "aria-label": "Next image",
            "data-ocid": "carousel-next",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: next,
            className: "absolute right-12 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-background/80 border border-border transition-smooth sm:hidden",
            "aria-label": "Next image",
            "data-ocid": "carousel-next-mobile",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-5 h-5" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "icon",
          variant: "outline",
          className: [
            "absolute bottom-2 right-2 min-w-[44px] min-h-[44px] w-11 h-11 transition-smooth bg-background/80 disabled:opacity-50",
            downloadState === "done" ? "neon-border-blue glow-blue-sm border-primary" : downloadState === "fallback" ? "border-destructive/60 text-destructive" : "neon-border-blue hover:glow-blue-sm"
          ].join(" "),
          onClick: () => handleDownload(active, activeIndex),
          disabled: downloadState === "loading",
          "aria-label": "Download image",
          "data-ocid": "download-single-image-btn",
          children: downloadState === "loading" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : downloadState === "done" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-5 h-5 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-5 h-5" })
        }
      ),
      images.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute bottom-2 left-2 font-mono text-xs text-muted-foreground bg-background/70 px-2 py-1 rounded", children: [
        activeIndex + 1,
        " / ",
        images.length
      ] })
    ] }),
    downloadState === "fallback" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 font-mono text-xs text-destructive leading-snug",
        "data-ocid": "download-fallback-msg",
        children: [
          "📱 Press and hold this image, then tap ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Save to Photos" }),
          ".",
          " ",
          fallbackUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: fallbackUrl,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "underline underline-offset-2",
              children: "Open image"
            }
          )
        ]
      }
    ),
    images.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex gap-2 overflow-x-auto pb-1 scrollbar-thin",
        "data-ocid": "thumbnail-strip",
        children: images.map((img, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              setActiveIndex(idx);
              setDownloadState("idle");
              setFallbackUrl(null);
            },
            className: `flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-smooth ${idx === activeIndex ? "border-primary glow-blue-sm" : "border-border opacity-60 hover:opacity-90 hover:border-primary/50"}`,
            "aria-label": `View image ${idx + 1}`,
            "data-ocid": `thumbnail-${idx}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: img.blob.getDirectURL(),
                alt: img.altText,
                className: "w-full h-full object-cover"
              }
            )
          },
          img.id.toString()
        ))
      }
    )
  ] });
}
function ImageGallery({ images, isLoading }) {
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", "data-ocid": "image-gallery-loading", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full aspect-video rounded-lg" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-16 h-16 rounded" }, i)) })
    ] });
  }
  if (images.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card/50 aspect-video",
        "data-ocid": "image-gallery-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ImageOff, { className: "w-10 h-10 text-muted-foreground/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-muted-foreground uppercase tracking-wider", children: "No Images" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "image-gallery", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImageCarousel, { images }) });
}
function useExtensionDetection() {
  const [isInstalled, setIsInstalled] = reactExports.useState(() => {
    try {
      return localStorage.getItem("ext_installed") === "true";
    } catch {
      return false;
    }
  });
  const timerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    function handleMessage(e) {
      var _a;
      if (((_a = e.data) == null ? void 0 : _a.type) === "COPIE_PASTE_EXT_PRESENT") {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        try {
          localStorage.setItem("ext_installed", "true");
        } catch {
        }
        setIsInstalled(true);
      }
    }
    window.addEventListener("message", handleMessage);
    window.postMessage({ type: "COPIE_PASTE_PING" }, "*");
    timerRef.current = setTimeout(() => {
      try {
        localStorage.setItem("ext_installed", "false");
      } catch {
      }
      setIsInstalled(false);
    }, 5e3);
    return () => {
      window.removeEventListener("message", handleMessage);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
  reactExports.useEffect(() => {
    function handleStorage(e) {
      if (e.key === "ext_installed") {
        setIsInstalled(e.newValue === "true");
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);
  return { isInstalled };
}
function useIsMobile() {
  const [isMobile, setIsMobile] = reactExports.useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );
  reactExports.useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}
function stripPrice(price) {
  if (!price) return "0";
  return price.replace(/^\$/, "").replace(/[^0-9.]/g, "") || "0";
}
function ExtensionInstallModal({ onClose }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      style: { background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" },
      onClick: onClose,
      onKeyDown: (e) => e.key === "Escape" && onClose(),
      role: "presentation",
      "data-ocid": "ext-install-modal-backdrop",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "relative w-full max-w-sm rounded-xl border border-primary/40 bg-card p-6 space-y-4 neon-border-blue",
          onClick: (e) => e.stopPropagation(),
          onKeyDown: (e) => e.stopPropagation(),
          "data-ocid": "ext-install-modal",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                className: "absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors",
                "aria-label": "Close",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center glow-blue-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-5 h-5 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-sm text-primary text-glow-blue tracking-wider", children: "EXTENSION REQUIRED" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground", children: "Auto-Fill feature" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-foreground/90 leading-relaxed", children: [
              "This feature requires the",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-medium", children: "Copie Past-e Chrome Extension" }),
              ". Install it to auto-fill listings directly into Facebook Marketplace with one click."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/extension",
                  onClick: onClose,
                  className: "flex-1 flex items-center justify-center gap-1.5 rounded-md h-9 border border-primary/50 bg-primary/10 text-primary text-xs font-display tracking-wider hover:bg-primary/20 transition-smooth",
                  "data-ocid": "ext-install-modal-link",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3.5 h-3.5" }),
                    "How to Install"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: onClose,
                  className: "font-mono text-xs text-muted-foreground hover:text-foreground",
                  "data-ocid": "ext-install-modal-close",
                  children: "Got It"
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function SmartPostButtons({
  title,
  description,
  price,
  category,
  condition,
  brand,
  images,
  listingPlatform
}) {
  const { isInstalled } = useExtensionDetection();
  const isMobile = useIsMobile();
  const [lightning, setLightning] = reactExports.useState(false);
  const [showInstallModal, setShowInstallModal] = reactExports.useState(false);
  const imageUrls = images.map((img) => img.blob.getDirectURL());
  function resolvePlatformKey(raw) {
    if (!raw) return null;
    return raw.replace(/^#/, "").toLowerCase();
  }
  const platformKey = resolvePlatformKey(listingPlatform ?? null);
  const fbDimmed = platformKey !== null && platformKey !== "facebook";
  const mecariDimmed = platformKey !== null && platformKey !== "mecari";
  function triggerLightning() {
    setLightning(true);
    setTimeout(() => setLightning(false), 700);
  }
  function sendSmartPost(platform) {
    const data = {
      action: "SMART_POST",
      platform,
      listing: {
        title,
        price: stripPrice(price),
        description,
        category: category ?? "",
        condition: condition ?? "",
        brand: brand ?? "",
        images: imageUrls
      }
    };
    window.postMessage({ type: "COPIE_PASTE_SMART_POST", ...data }, "*");
    localStorage.setItem("copiepaste_pending_post", JSON.stringify(data));
  }
  function handleAutoFill() {
    triggerLightning();
    sendSmartPost("facebook");
    if (!isInstalled) {
      setTimeout(() => setShowInstallModal(true), 400);
    } else {
      ue.success("📘 Sent to Facebook Auto-Fill", { duration: 2e3 });
    }
  }
  function handleMercariAutoFill() {
    triggerLightning();
    sendSmartPost("mercari");
    if (!isInstalled) {
      setTimeout(() => setShowInstallModal(true), 400);
    } else {
      ue.success("🟠 Sent to Mercari Auto-Fill", { duration: 2e3 });
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(LightningAnimation, { active: lightning }),
    showInstallModal && /* @__PURE__ */ jsxRuntimeExports.jsx(ExtensionInstallModal, { onClose: () => setShowInstallModal(false) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-ocid": "smart-post-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border/50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xs tracking-widest text-primary text-glow-blue uppercase px-2", children: "⚡ Smart Post" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border/50" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: isMobile ? (
        /* ── Mobile: disabled gray buttons + instruction text ── */
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-ocid": "smart-post-mobile-disabled", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              disabled: true,
              className: "w-full font-mono text-xs border-border text-muted-foreground bg-muted/30 cursor-not-allowed h-9 gap-1.5",
              "data-ocid": "autofill-facebook-desktop-only-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📘" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Auto-Fill Facebook (Desktop Only)" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              disabled: true,
              className: "w-full font-mono text-xs border-border text-muted-foreground bg-muted/30 cursor-not-allowed h-9 gap-1.5",
              "data-ocid": "autofill-mercari-desktop-only-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🟠" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Auto-Fill Mercari (Desktop Only)" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center font-mono text-[10px] text-muted-foreground leading-relaxed px-1", children: "Install Chrome on your desktop computer to use Smart Post. On mobile, copy your listing details manually." })
        ] })
      ) : (
        /* ── Desktop: full button with extension detection ── */
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-ocid": "smart-post-desktop", children: [
          isInstalled && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-center gap-1.5",
              "data-ocid": "ext-connected-indicator",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-green-500 inline-block" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-green-400 font-mono", children: "Extension Connected" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: `relative w-full font-mono text-xs border-primary/40 text-foreground hover:border-primary hover:bg-primary/10 transition-smooth gap-1.5 h-9 ${fbDimmed ? "opacity-40" : ""}`,
              onClick: handleAutoFill,
              "data-ocid": "autofill-facebook-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📘" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Auto-Fill Facebook Marketplace" }),
                !isInstalled && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1.5 -right-1.5 px-1 py-0.5 text-[8px] font-display tracking-wider bg-accent text-accent-foreground rounded-full leading-none border border-accent/60 whitespace-nowrap", children: "+ Install Extension" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: `relative w-full font-mono text-xs border-orange-500/40 text-foreground hover:border-orange-500 hover:bg-orange-500/10 transition-smooth gap-1.5 h-9 ${mecariDimmed ? "opacity-40" : ""}`,
              onClick: handleMercariAutoFill,
              "data-ocid": "autofill-mercari-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🟠" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Auto-Fill Mercari" }),
                !isInstalled && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1.5 -right-1.5 px-1 py-0.5 text-[8px] font-display tracking-wider bg-accent text-accent-foreground rounded-full leading-none border border-accent/60 whitespace-nowrap", children: "+ Install Extension" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-center font-mono text-[10px] text-muted-foreground tracking-wider",
              "data-ocid": "smart-post-desktop-notice",
              children: "Desktop Chrome only — requires the Copie Past-e extension"
            }
          )
        ] })
      ) })
    ] })
  ] });
}
function useDeleteListing() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteListing(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    }
  });
}
function useUpdateListing() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateListing(args);
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({
        queryKey: ["listing", updated.id.toString()]
      });
    }
  });
}
function useRemoveImage() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ imageId }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.removeImage(imageId);
    },
    onSuccess: (_, { listingId }) => {
      queryClient.invalidateQueries({
        queryKey: ["images", listingId.toString()]
      });
    }
  });
}
function useAddImageToListing() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ listingId, file, order, onProgress }) => {
      if (!actor) throw new Error("Actor not available");
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let blob = ExternalBlob.fromBytes(bytes);
      if (onProgress) {
        blob = blob.withUploadProgress(onProgress);
      }
      const args = {
        order: BigInt(order),
        blob,
        listingId,
        altText: file.name
      };
      return actor.addImage(args);
    },
    onSuccess: (_, { listingId }) => {
      queryClient.invalidateQueries({
        queryKey: ["images", listingId.toString()]
      });
    }
  });
}
const MAX_IMAGES = 10;
function ListingDetailPage() {
  const { id } = useParams({ from: "/listing/$id" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { actor, isFetching } = useActor(createActor);
  const listingId = BigInt(id);
  const {
    data: listing,
    isLoading,
    error
  } = useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getListing(listingId);
    },
    enabled: !!actor && !isFetching
  });
  const { data: images = [], isLoading: imagesLoading } = useListingImages(
    listingId,
    !!actor && !isFetching
  );
  const updateListing = useUpdateListing();
  const deleteListing = useDeleteListing();
  const togglePin = useTogglePin();
  const toggleFavorite = useToggleFavorite();
  const removeImage = useRemoveImage();
  const addImage = useAddImageToListing();
  const [isEditing, setIsEditing] = reactExports.useState(false);
  const [editTitle, setEditTitle] = reactExports.useState("");
  const [editDescription, setEditDescription] = reactExports.useState("");
  const [editPrice, setEditPrice] = reactExports.useState("");
  const [editCatFields, setEditCatFields] = reactExports.useState({
    category: "",
    subcategory: "",
    condition: "",
    brand: "",
    typeModel: ""
  });
  const [deletingImageId, setDeletingImageId] = reactExports.useState(null);
  const [pendingImages, setPendingImages] = reactExports.useState([]);
  const fileInputRef = reactExports.useRef(null);
  const [optimisticPinned, setOptimisticPinned] = reactExports.useState(
    null
  );
  const [optimisticFavorited, setOptimisticFavorited] = reactExports.useState(null);
  const isPinned = optimisticPinned !== null ? optimisticPinned : (listing == null ? void 0 : listing.pinned) ?? false;
  const isFavorited = optimisticFavorited !== null ? optimisticFavorited : (listing == null ? void 0 : listing.favorited) ?? false;
  function startEditing() {
    var _a;
    if (!listing) return;
    setEditTitle(listing.title);
    setEditDescription(listing.description);
    setEditPrice(((_a = listing.price) == null ? void 0 : _a.replace(/^\$/, "")) ?? "");
    setEditCatFields(decodeCategory(listing.category));
    setPendingImages([]);
    setIsEditing(true);
  }
  function cancelEditing() {
    for (const p of pendingImages) URL.revokeObjectURL(p.preview);
    setPendingImages([]);
    setIsEditing(false);
  }
  async function saveEdits() {
    if (!listing) return;
    try {
      const args = {
        id: listingId,
        title: editTitle,
        description: editDescription,
        price: editPrice ? `$${editPrice}` : void 0,
        category: encodeCategory(editCatFields) || void 0
      };
      await updateListing.mutateAsync(args);
      if (pendingImages.length > 0) {
        const startOrder = images.length;
        for (let i = 0; i < pendingImages.length; i++) {
          const p = pendingImages[i];
          setPendingImages(
            (prev) => prev.map((x) => x.id === p.id ? { ...x, uploading: true } : x)
          );
          await addImage.mutateAsync({
            listingId,
            file: p.file,
            order: startOrder + i,
            onProgress: (pct) => {
              setPendingImages(
                (prev) => prev.map(
                  (x) => x.id === p.id ? { ...x, uploadProgress: pct } : x
                )
              );
            }
          });
          setPendingImages((prev) => prev.filter((x) => x.id !== p.id));
        }
      }
      for (const p of pendingImages) URL.revokeObjectURL(p.preview);
      setPendingImages([]);
      setIsEditing(false);
      ue.success("✓ Listing updated", { duration: 2e3 });
    } catch {
      ue.error("Failed to update listing");
    }
  }
  async function handleDeleteImage(img) {
    setDeletingImageId(img.id);
    try {
      await removeImage.mutateAsync({ imageId: img.id, listingId });
      queryClient.invalidateQueries({
        queryKey: ["images", listingId.toString()]
      });
      ue.success("Image removed");
    } catch {
      ue.error("Failed to remove image");
    } finally {
      setDeletingImageId(null);
    }
  }
  async function handleSetCover(img) {
    try {
      const url = img.blob.getDirectURL();
      const res = await fetch(url, { mode: "cors" });
      if (!res.ok) throw new Error("Could not fetch image");
      const blob = await res.blob();
      const file = new File([blob], img.altText || "cover.jpg", {
        type: blob.type
      });
      await addImage.mutateAsync({ listingId, file, order: -1 });
      await removeImage.mutateAsync({ imageId: img.id, listingId });
      queryClient.invalidateQueries({
        queryKey: ["images", listingId.toString()]
      });
      ue.success("Cover image updated");
    } catch {
      ue.error("Failed to set cover image");
    }
  }
  function handleAddFiles(fileList) {
    if (!fileList) return;
    const existing = images.length + pendingImages.length;
    const slots = MAX_IMAGES - existing;
    if (slots <= 0) return;
    const accepted = Array.from(fileList).filter((f) => f.type.startsWith("image/")).slice(0, slots);
    const newPending = accepted.map((f) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file: f,
      preview: URL.createObjectURL(f),
      uploading: false,
      uploadProgress: 0
    }));
    setPendingImages((prev) => [...prev, ...newPending]);
  }
  function removePending(pendingId) {
    setPendingImages((prev) => {
      const item = prev.find((x) => x.id === pendingId);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((x) => x.id !== pendingId);
    });
  }
  async function handleDelete() {
    try {
      await deleteListing.mutateAsync(listingId);
      navigate({ to: "/dashboard" });
    } catch {
      ue.error("Failed to delete listing");
    }
  }
  function handlePinToggle() {
    const next = !isPinned;
    setOptimisticPinned(next);
    togglePin.mutate(listingId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["listing", id] });
      },
      onError: () => {
        setOptimisticPinned(isPinned);
        ue.error("Failed to update pin.");
      }
    });
  }
  function handleFavoriteToggle() {
    const next = !isFavorited;
    setOptimisticFavorited(next);
    toggleFavorite.mutate(listingId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["listing", id] });
      },
      onError: () => {
        setOptimisticFavorited(isFavorited);
        ue.error("Failed to update favorite.");
      }
    });
  }
  function formatDate(ts) {
    return new Date(Number(ts) / 1e6).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(DetailSkeleton, {});
  if (error || !listing) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(NotFoundState, { onBack: () => navigate({ to: "/dashboard" }) });
  }
  const catFields = decodeCategory(listing.category);
  const editSubcategoryOptions = editCatFields.category ? SUBCATEGORY_MAP[editCatFields.category] ?? [] : [];
  const selectClass = "w-full h-10 rounded-md px-3 text-sm bg-input border border-primary/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary transition-smooth appearance-none cursor-pointer";
  const totalImages = images.length + pendingImages.length;
  const atMaxImages = totalImages >= MAX_IMAGES;
  const isSaving = updateListing.isPending || addImage.isPending || removeImage.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 z-10 bg-card border-b border-border backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          className: "gap-2 text-muted-foreground hover:text-foreground transition-smooth",
          onClick: () => navigate({ to: "/dashboard" }),
          "data-ocid": "back-to-dashboard",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs uppercase tracking-wider", children: "Dashboard" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "h-8 w-8 flex items-center justify-center rounded-md border border-border/50 bg-card/60 hover:bg-card transition-smooth",
            onClick: handlePinToggle,
            disabled: togglePin.isPending,
            "aria-label": isPinned ? "Unpin listing" : "Pin listing to top",
            "data-ocid": "detail-pin-btn",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-sm leading-none transition-all duration-200",
                style: {
                  opacity: isPinned ? 1 : 0.35,
                  filter: isPinned ? "drop-shadow(0 0 4px #00d4ff)" : "none"
                },
                children: "📌"
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "h-8 w-8 flex items-center justify-center rounded-md border border-border/50 bg-card/60 hover:bg-card transition-smooth",
            onClick: handleFavoriteToggle,
            disabled: toggleFavorite.isPending,
            "aria-label": isFavorited ? "Remove from favorites" : "Add to favorites",
            "data-ocid": "detail-favorite-btn",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-sm leading-none transition-all duration-200",
                style: {
                  color: isFavorited ? "#ffd700" : void 0,
                  opacity: isFavorited ? 1 : 0.5,
                  filter: isFavorited ? "drop-shadow(0 0 4px #ffd700)" : "none"
                },
                children: isFavorited ? "♥" : "♡"
              }
            )
          }
        ),
        isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "font-mono text-xs uppercase tracking-wider text-muted-foreground",
              onClick: cancelEditing,
              disabled: isSaving,
              "data-ocid": "cancel-edit-btn",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "neon-border-blue hover:glow-blue-sm transition-smooth font-mono text-xs uppercase tracking-wider gap-1.5",
              onClick: saveEdits,
              disabled: isSaving,
              "data-ocid": "save-edit-btn",
              children: [
                isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5" }),
                "Save"
              ]
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            className: "neon-border-blue hover:glow-blue-sm transition-smooth font-mono text-xs uppercase tracking-wider gap-1.5",
            onClick: startEditing,
            "data-ocid": "edit-toggle-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" }),
              "Edit"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive hover:text-destructive transition-smooth font-mono text-xs uppercase tracking-wider gap-1.5",
              "data-ocid": "delete-listing-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" }),
                "Delete"
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "bg-card border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "font-display text-lg", children: "Delete this listing?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { className: "text-muted-foreground", children: "This action cannot be undone. The listing and all its images will be permanently removed." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                AlertDialogCancel,
                {
                  className: "font-mono text-xs uppercase tracking-wider",
                  "data-ocid": "delete-cancel-btn",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                AlertDialogAction,
                {
                  onClick: handleDelete,
                  disabled: deleteListing.isPending,
                  className: "bg-destructive hover:bg-destructive/80 font-mono text-xs uppercase tracking-wider",
                  "data-ocid": "delete-confirm-btn",
                  children: "Delete"
                }
              )
            ] })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        EditImagePanel,
        {
          images,
          pendingImages,
          deletingImageId,
          atMaxImages,
          totalImages,
          fileInputRef,
          onDeleteImage: handleDeleteImage,
          onSetCover: handleSetCover,
          onAddFiles: handleAddFiles,
          onRemovePending: removePending
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(ImageGallery, { images, isLoading: imagesLoading }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6", children: [
        isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: editTitle,
            onChange: (e) => setEditTitle(e.target.value),
            className: "font-display text-xl bg-input border-primary/50 focus:neon-border-blue transition-smooth h-auto py-2",
            placeholder: "Listing title",
            "data-ocid": "edit-title-input"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h1",
          {
            className: "font-display text-2xl sm:text-3xl leading-tight text-glow-blue",
            "data-ocid": "listing-title",
            children: listing.title
          }
        ),
        isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1.5", children: "Price" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm pointer-events-none", children: "$" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: editPrice,
                onChange: (e) => {
                  const raw = e.target.value.replace(/^\$/, "").replace(/[^0-9.,]/g, "");
                  setEditPrice(raw);
                },
                className: "bg-input border-primary/50 focus:neon-border-blue transition-smooth font-mono pl-7",
                placeholder: "49.99",
                "data-ocid": "edit-price-input"
              }
            )
          ] })
        ] }) : listing.price && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "listing-price", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-3xl font-bold text-accent text-glow-yellow", children: listing.price }) }),
        !isEditing && /* @__PURE__ */ jsxRuntimeExports.jsx(ListingCategoryDisplay, { fields: catFields }),
        isEditing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs uppercase tracking-wider text-muted-foreground", children: "Listing Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1", children: "Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: editCatFields.category,
                onChange: (e) => setEditCatFields({
                  ...editCatFields,
                  category: e.target.value,
                  subcategory: ""
                }),
                className: selectClass,
                "data-ocid": "edit-category-select",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", className: "bg-card text-muted-foreground", children: "Select a category…" }),
                  CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "option",
                    {
                      value: cat,
                      className: "bg-card text-foreground",
                      children: cat
                    },
                    cat
                  ))
                ]
              }
            )
          ] }),
          editCatFields.category && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1", children: [
              "Subcategory ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "normal-case", children: "(optional)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: editCatFields.subcategory,
                onChange: (e) => setEditCatFields({
                  ...editCatFields,
                  subcategory: e.target.value
                }),
                className: selectClass,
                "data-ocid": "edit-subcategory-select",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", className: "bg-card text-muted-foreground", children: "Select a subcategory…" }),
                  editSubcategoryOptions.map((sub) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "option",
                    {
                      value: sub,
                      className: "bg-card text-foreground",
                      children: sub
                    },
                    sub
                  ))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1", children: "Condition" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: editCatFields.condition,
                onChange: (e) => setEditCatFields({
                  ...editCatFields,
                  condition: e.target.value
                }),
                className: selectClass,
                "data-ocid": "edit-condition-select",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", className: "bg-card text-muted-foreground", children: "Select condition…" }),
                  CONDITIONS.map((cond) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "option",
                    {
                      value: cond,
                      className: "bg-card text-foreground",
                      children: cond
                    },
                    cond
                  ))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1", children: [
              "Brand ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "normal-case", children: "(optional)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: editCatFields.brand,
                onChange: (e) => setEditCatFields({
                  ...editCatFields,
                  brand: e.target.value
                }),
                placeholder: "e.g. Samsung, Nike, Honda",
                className: "bg-input border-primary/50 focus:neon-border-blue transition-smooth",
                "data-ocid": "edit-brand-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1", children: [
              "Type / Model ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "normal-case", children: "(optional)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: editCatFields.typeModel,
                onChange: (e) => setEditCatFields({
                  ...editCatFields,
                  typeModel: e.target.value
                }),
                placeholder: "e.g. Galaxy S24, Air Max 90",
                className: "bg-input border-primary/50 focus:neon-border-blue transition-smooth",
                "data-ocid": "edit-type-model-input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs uppercase tracking-wider text-muted-foreground mb-2", children: "Description" }),
          isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              value: editDescription,
              onChange: (e) => setEditDescription(e.target.value),
              rows: 7,
              className: "bg-input border-primary/50 focus:neon-border-blue transition-smooth resize-y font-body text-sm leading-relaxed",
              placeholder: "Listing description…",
              "data-ocid": "edit-description-input"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "whitespace-pre-wrap font-body text-sm leading-relaxed text-foreground/90",
              "data-ocid": "listing-description",
              children: listing.description
            }
          )
        ] }),
        listing.sourceUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "listing-source-url", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1", children: "Source" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: listing.sourceUrl,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "inline-flex items-center gap-1.5 text-primary hover:text-primary/80 text-sm transition-smooth underline-offset-2 hover:underline",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3.5 h-3.5 flex-shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-xs min-w-0", children: listing.sourceUrl })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "p",
          {
            className: "font-mono text-xs text-muted-foreground",
            "data-ocid": "listing-date",
            children: [
              "Created ",
              formatDate(listing.createdAt)
            ]
          }
        ),
        !isEditing && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CopyButtons,
            {
              title: listing.title,
              description: listing.description,
              price: listing.price
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SmartPostButtons,
            {
              title: listing.title,
              description: listing.description,
              price: listing.price,
              category: catFields.category,
              condition: catFields.condition,
              brand: catFields.brand,
              images
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function EditImagePanel({
  images,
  pendingImages,
  deletingImageId,
  atMaxImages,
  totalImages,
  fileInputRef,
  onDeleteImage,
  onSetCover,
  onAddFiles,
  onRemovePending
}) {
  const [confirmDeleteImg, setConfirmDeleteImg] = reactExports.useState(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", "data-ocid": "edit-image-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs uppercase tracking-wider text-muted-foreground", children: [
      "Images",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary/60 normal-case", children: [
        "(",
        totalImages,
        "/",
        MAX_IMAGES,
        ")"
      ] })
    ] }),
    images.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-3 gap-2",
        "data-ocid": "existing-images-grid",
        children: images.map((img, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative group rounded-md overflow-hidden aspect-square bg-muted neon-border-blue",
            "data-ocid": `existing-image-${idx}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: img.blob.getDirectURL(),
                  alt: img.altText || `Image ${idx + 1}`,
                  className: "w-full h-full object-cover"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "aria-label": "Delete image",
                  disabled: deletingImageId === img.id,
                  onClick: () => setConfirmDeleteImg(img),
                  className: "absolute top-1 right-1 w-7 h-7 rounded-full bg-destructive/90 text-destructive-foreground flex items-center justify-center shadow-lg transition-smooth hover:bg-destructive sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100",
                  style: { touchAction: "manipulation" },
                  "data-ocid": `delete-image-btn-${idx}`,
                  children: deletingImageId === img.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
                }
              ),
              idx === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-1 left-1 rounded px-1.5 py-0.5 bg-primary/80 text-primary-foreground font-mono text-[9px] uppercase tracking-wider", children: "Cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "aria-label": "Set as cover image",
                  onClick: () => onSetCover(img),
                  className: "absolute bottom-1 left-1 rounded px-1.5 py-0.5 bg-background/80 border border-primary/40 text-primary font-mono text-[9px] uppercase tracking-wider transition-smooth hover:border-primary flex items-center gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100",
                  "data-ocid": `set-cover-btn-${idx}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-2.5 h-2.5" }),
                    "Cover"
                  ]
                }
              )
            ]
          },
          img.id.toString()
        ))
      }
    ),
    pendingImages.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", "data-ocid": "pending-images-grid", children: pendingImages.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "relative group rounded-md overflow-hidden aspect-square bg-muted border-2 border-dashed border-primary/40",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: p.preview,
              alt: "Preview of new upload",
              className: "w-full h-full object-cover"
            }
          ),
          p.uploading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-background/70 flex flex-col items-center justify-center gap-1 p-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin text-primary" }),
            p.uploadProgress > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-primary", children: [
              p.uploadProgress,
              "%"
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "aria-label": "Remove pending image",
              onClick: () => onRemovePending(p.id),
              className: "absolute top-1 right-1 w-7 h-7 rounded-full bg-destructive/90 text-destructive-foreground flex items-center justify-center",
              "data-ocid": "remove-pending-image-btn",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-1 left-1 rounded px-1 py-0.5 bg-background/80 font-mono text-[9px] text-primary uppercase", children: "New" })
        ]
      },
      p.id
    )) }),
    atMaxImages ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "p",
      {
        className: "font-mono text-xs text-muted-foreground text-center py-2",
        "data-ocid": "max-images-msg",
        children: [
          "Maximum ",
          MAX_IMAGES,
          " images per listing."
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => {
          var _a;
          return (_a = fileInputRef.current) == null ? void 0 : _a.click();
        },
        className: "flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary/30 hover:border-primary/60 hover:bg-primary/5 py-5 transition-smooth",
        "aria-label": "Add more images",
        "data-ocid": "add-images-zone",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "w-5 h-5 text-primary/60" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs uppercase tracking-wider text-primary/60", children: "+ Add More Images" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: fileInputRef,
        type: "file",
        accept: ".jpg,.jpeg,.png,.webp,.heic,image/*",
        multiple: true,
        className: "sr-only",
        onChange: (e) => {
          onAddFiles(e.target.files);
          e.target.value = "";
        },
        "data-ocid": "add-images-input"
      }
    ),
    confirmDeleteImg && /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: true,
        onOpenChange: (open) => {
          if (!open) setConfirmDeleteImg(null);
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "bg-card border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "font-display text-lg", children: "Delete this image?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { className: "text-muted-foreground", children: "This cannot be undone." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogCancel,
              {
                className: "font-mono text-xs uppercase tracking-wider",
                onClick: () => setConfirmDeleteImg(null),
                "data-ocid": "img-delete-cancel-btn",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogAction,
              {
                className: "bg-destructive hover:bg-destructive/80 font-mono text-xs uppercase tracking-wider",
                onClick: () => {
                  onDeleteImage(confirmDeleteImg);
                  setConfirmDeleteImg(null);
                },
                "data-ocid": "img-delete-confirm-btn",
                children: "Delete"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
function ListingCategoryDisplay({ fields }) {
  const rows = [];
  if (fields.category) rows.push({ label: "Category", value: fields.category });
  if (fields.subcategory)
    rows.push({ label: "Subcategory", value: fields.subcategory });
  if (fields.condition)
    rows.push({ label: "Condition", value: fields.condition });
  if (fields.brand) rows.push({ label: "Brand", value: fields.brand });
  if (rows.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "flex flex-col gap-1.5 rounded-lg border border-primary/20 bg-card/30 px-3 py-3",
      "data-ocid": "listing-category-details",
      children: rows.map(({ label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-2 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-wider text-muted-foreground shrink-0 w-20", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body text-sm text-foreground/90 truncate min-w-0", children: value })
      ] }, label))
    }
  );
}
function DetailSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 bg-card border-b border-border" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full aspect-video rounded-lg" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-3/4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-1/4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-1/3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-1/2" })
      ] })
    ] })
  ] });
}
function NotFoundState({ onBack }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col items-center justify-center gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl text-muted-foreground", children: "Listing not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "neon-border-blue", onClick: onBack, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }),
      "Back to Dashboard"
    ] })
  ] });
}
export {
  ListingDetailPage
};

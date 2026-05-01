import { b as useActor, r as reactExports, f as createActor } from "./index-DlPcOTZa.js";
const VALID_CATEGORIES = [
  "Appliances",
  "Automotive",
  "Baby & Kids",
  "Books & Magazines",
  "Clothing & Shoes",
  "Collectibles",
  "Electronics & Media",
  "Furniture",
  "Home & Garden",
  "Jewelry & Accessories",
  "Tools & Machinery",
  "Office Supplies",
  "Services"
];
const VALID_CONDITIONS = [
  "New",
  "Used — Good",
  "Used — Fair",
  "Used — Normal Wear"
];
const CONDITION_MAP = {
  new: "New",
  "used — good": "Used — Good",
  "used - good": "Used — Good",
  "used--good": "Used — Good",
  "used -- good": "Used — Good",
  good: "Used — Good",
  "like new": "Used — Good",
  "used — fair": "Used — Fair",
  "used - fair": "Used — Fair",
  "used--fair": "Used — Fair",
  "used -- fair": "Used — Fair",
  fair: "Used — Fair",
  "used — normal wear": "Used — Normal Wear",
  "used - normal wear": "Used — Normal Wear",
  "used--normal wear": "Used — Normal Wear",
  "used -- normal wear": "Used — Normal Wear",
  "normal wear": "Used — Normal Wear",
  worn: "Used — Normal Wear",
  used: "Used — Normal Wear",
  acceptable: "Used — Fair"
};
function normaliseCategory(raw) {
  if (!raw) return "";
  const trimmed = raw.trim();
  const exact = VALID_CATEGORIES.find(
    (c) => c.toLowerCase() === trimmed.toLowerCase()
  );
  if (exact) return exact;
  const lower = trimmed.toLowerCase();
  if (lower.includes("electron") || lower.includes("media") || lower.includes("phone") || lower.includes("computer") || lower.includes("tech"))
    return "Electronics & Media";
  if (lower.includes("appli") || lower.includes("washer") || lower.includes("fridge") || lower.includes("microwave"))
    return "Appliances";
  if (lower.includes("auto") || lower.includes("car") || lower.includes("truck") || lower.includes("vehicle"))
    return "Automotive";
  if (lower.includes("baby") || lower.includes("kid") || lower.includes("child") || lower.includes("toy"))
    return "Baby & Kids";
  if (lower.includes("book") || lower.includes("magazine") || lower.includes("novel"))
    return "Books & Magazines";
  if (lower.includes("cloth") || lower.includes("shoe") || lower.includes("fashion") || lower.includes("wear") || lower.includes("apparel"))
    return "Clothing & Shoes";
  if (lower.includes("collect") || lower.includes("antique") || lower.includes("art") || lower.includes("card"))
    return "Collectibles";
  if (lower.includes("furni") || lower.includes("sofa") || lower.includes("couch") || lower.includes("chair") || lower.includes("table") || lower.includes("desk") || lower.includes("bed"))
    return "Furniture";
  if (lower.includes("garden") || lower.includes("home") || lower.includes("decor"))
    return "Home & Garden";
  if (lower.includes("jewel") || lower.includes("watch") || lower.includes("accessory") || lower.includes("accessories") || lower.includes("bag"))
    return "Jewelry & Accessories";
  if (lower.includes("tool") || lower.includes("machinery") || lower.includes("equipment") || lower.includes("mower"))
    return "Tools & Machinery";
  if (lower.includes("office") || lower.includes("supply") || lower.includes("supplies") || lower.includes("printer"))
    return "Office Supplies";
  if (lower.includes("service")) return "Services";
  return "";
}
function normaliseCondition(raw) {
  if (!raw) return "";
  const lower = raw.trim().toLowerCase();
  if (CONDITION_MAP[lower]) return CONDITION_MAP[lower];
  const exact = VALID_CONDITIONS.find((c) => c.toLowerCase() === lower);
  if (exact) return exact;
  if (lower.includes("new")) return "New";
  if (lower.includes("good")) return "Used — Good";
  if (lower.includes("fair")) return "Used — Fair";
  if (lower.includes("normal") || lower.includes("wear"))
    return "Used — Normal Wear";
  return "";
}
async function resizeImageToBase64(file, maxPx = 1024) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const { width, height } = img;
      const scale = Math.min(1, maxPx / Math.max(width, height));
      const w = Math.round(width * scale);
      const h = Math.round(height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas 2D context unavailable"));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      const base64 = dataUrl.split(",")[1] ?? "";
      resolve(base64);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image for resizing"));
    };
    img.src = objectUrl;
  });
}
function formatOcrError(raw) {
  if (raw.includes("cycles") || raw.includes("http_request")) {
    return `OCR scan failed: ${raw}`;
  }
  if (raw.includes("429") || raw.toLowerCase().includes("quota")) {
    return `OCR rate limit reached — try again in a minute. (${raw})`;
  }
  if (raw.includes("403") || raw.toLowerCase().includes("api key")) {
    return `OCR API key error — check your Gemini key in admin Settings. (${raw})`;
  }
  if (raw.toLowerCase().includes("not configured") || raw.toLowerCase().includes("api key not")) {
    return raw;
  }
  return raw;
}
function normaliseOcrFields(data) {
  var _a, _b, _c;
  const allEmpty = !data.title && !data.price && !data.description && !data.category && !data.condition && !data.brand;
  if (allEmpty) return null;
  const category = normaliseCategory(data.category ?? "");
  const condition = normaliseCondition(data.condition ?? "");
  const rawPrice = (data.price ?? "").replace(/[^0-9.,]/g, "").trim();
  return {
    title: ((_a = data.title) == null ? void 0 : _a.trim()) || void 0,
    price: rawPrice || void 0,
    description: ((_b = data.description) == null ? void 0 : _b.trim()) || void 0,
    category: category || void 0,
    condition: condition || void 0,
    brand: ((_c = data.brand) == null ? void 0 : _c.trim()) || void 0
  };
}
function requestExtensionOCR(imageBase64, timeoutMs = 6e3) {
  return new Promise((resolve, reject) => {
    const requestId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    const timeout = setTimeout(() => {
      window.removeEventListener("message", handler);
      reject(new Error("Extension OCR timed out"));
    }, timeoutMs);
    function handler(event) {
      const d = event.data;
      if ((d == null ? void 0 : d.type) !== "COPIE_PASTE_OCR_RESPONSE") return;
      if ((d == null ? void 0 : d.requestId) !== requestId) return;
      clearTimeout(timeout);
      window.removeEventListener("message", handler);
      if (d.success === true && d.data) {
        resolve(d.data);
      } else {
        reject(new Error(d.error ?? "Extension OCR returned no data"));
      }
    }
    window.addEventListener("message", handler);
    window.postMessage(
      { type: "COPIE_PASTE_OCR_REQUEST", requestId, imageBase64 },
      "*"
    );
  });
}
function usePhotoOCR() {
  const { actor, isFetching } = useActor(createActor);
  const [isProcessing, setIsProcessing] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const extPresentRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    function handleMessage(event) {
      var _a;
      if (((_a = event.data) == null ? void 0 : _a.type) === "COPIE_PASTE_EXT_PRESENT") {
        extPresentRef.current = true;
      }
    }
    window.addEventListener("message", handleMessage);
    window.postMessage({ type: "COPIE_PASTE_PING" }, "*");
    return () => window.removeEventListener("message", handleMessage);
  }, []);
  async function extractFromImage(file) {
    setIsProcessing(true);
    setError(null);
    const fail = (msg) => {
      const formatted = formatOcrError(msg);
      setError(formatted);
      return { error: formatted };
    };
    try {
      const base64 = await resizeImageToBase64(file, 1024);
      if (extPresentRef.current) {
        console.log("[OCR] Trying extension Gemini OCR path");
        try {
          const extData = await requestExtensionOCR(base64, 6e3);
          const result2 = normaliseOcrFields(extData);
          if (result2) {
            console.log("[OCR] Extension OCR succeeded");
            return result2;
          }
          console.log(
            "[OCR] Extension OCR returned empty fields, falling back to canister"
          );
        } catch (extErr) {
          const extMsg = extErr instanceof Error ? extErr.message : String(extErr);
          console.warn(
            "[OCR] Extension OCR failed:",
            extMsg,
            "— falling back to canister"
          );
        }
      }
      if (!actor || isFetching) {
        return fail("Backend not ready. Please try again in a moment.");
      }
      const raw = await actor.ocrScanImage(base64);
      console.log("[OCR] Backend response:", JSON.stringify(raw));
      if (raw.__kind__ === "err") {
        return fail(raw.err);
      }
      const data = raw.ok;
      const result = normaliseOcrFields(data);
      if (!result) {
        return fail(
          "No listing text found in this image. Try a screenshot that shows the full listing."
        );
      }
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to process image";
      return fail(message);
    } finally {
      setIsProcessing(false);
    }
  }
  function reset() {
    setError(null);
  }
  return { extractFromImage, isProcessing, error, reset };
}
export {
  usePhotoOCR as u
};

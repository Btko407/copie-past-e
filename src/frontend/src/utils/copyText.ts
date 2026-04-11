import { toast } from "sonner";

const TOAST_STYLE = {
  duration: 2000,
  style: {
    background: "oklch(0.16 0 0)",
    border: "1px solid oklch(0.65 0.22 262 / 0.6)",
    color: "oklch(0.95 0 0)",
  },
};

function showToast(message: string, type: "success" | "error") {
  if (type === "success") {
    toast.success(message, TOAST_STYLE);
  } else {
    toast.error(message, { ...TOAST_STYLE, duration: 2000 });
  }
}

/**
 * Unified clipboard copy utility — works across all browsers and contexts.
 * Uses navigator.clipboard when available in a secure context, falls back
 * to execCommand for iOS/Android/HTTP environments.
 */
export async function copyText(text: string): Promise<void> {
  // Modern path: navigator.clipboard API (requires secure context)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied!", "success");
      return;
    } catch {
      // fall through to execCommand fallback
    }
  }

  // Legacy fallback: works on iOS Safari, Android Chrome, and HTTP
  const el = document.createElement("textarea");
  el.value = text;
  el.setAttribute("readonly", "");
  el.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0";
  document.body.appendChild(el);
  el.focus();
  el.select();

  try {
    const success = document.execCommand("copy");
    if (success) {
      showToast("Copied!", "success");
    } else {
      showToast("Copy failed. Please copy manually.", "error");
    }
  } catch {
    showToast("Copy failed. Please copy manually.", "error");
  } finally {
    document.body.removeChild(el);
  }
}

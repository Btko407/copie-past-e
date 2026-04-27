import { r as reactExports } from "./index-wfeVo5SS.js";
function isMobile() {
  if (typeof navigator === "undefined") return false;
  return /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent);
}
function useExtensionDetection() {
  const mobile = isMobile();
  const [isInstalled, setIsInstalled] = reactExports.useState(() => {
    if (mobile) return false;
    try {
      return localStorage.getItem("ext_installed") === "true";
    } catch {
      return false;
    }
  });
  const timerRef = reactExports.useRef(null);
  const debounceRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    function persist(value) {
      try {
        localStorage.setItem("ext_installed", value ? "true" : "false");
      } catch {
      }
      setIsInstalled(value);
    }
    if (mobile) {
      persist(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      if (window.__COPIE_PASTE_INSTALLED__ === true) {
        persist(true);
        return;
      }
      function handleMessage(e) {
        var _a;
        if (((_a = e.data) == null ? void 0 : _a.type) === "COPIE_PASTE_EXT_PRESENT") {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
          persist(true);
          window.removeEventListener("message", handleMessage);
        }
      }
      window.addEventListener("message", handleMessage);
      window.postMessage({ type: "COPIE_PASTE_PING" }, "*");
      timerRef.current = setTimeout(() => {
        if (window.__COPIE_PASTE_INSTALLED__ === true) {
          persist(true);
        } else {
          persist(false);
        }
        window.removeEventListener("message", handleMessage);
      }, 5e3);
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [mobile]);
  reactExports.useEffect(() => {
    if (mobile) return;
    function handleStorage(e) {
      if (e.key === "ext_installed") {
        setIsInstalled(e.newValue === "true");
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [mobile]);
  return { isInstalled, isMobileDevice: mobile };
}
export {
  isMobile as i,
  useExtensionDetection as u
};

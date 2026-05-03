import { r as reactExports } from "./index-CDYDluDX.js";
function isMobile() {
  if (typeof navigator === "undefined") return false;
  return /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent);
}
const DEFAULT_CAPABILITIES = ["facebook", "mercari"];
const READY_MESSAGE_TYPES = [
  "COPIE_PASTE_EXT_PRESENT",
  "EXTENSION_READY",
  "COPIE_EXTENSION_READY"
];
const STORAGE_KEY = "ext_state";
function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
  }
  return {
    isInstalled: false,
    version: "",
    capabilities: DEFAULT_CAPABILITIES
  };
}
function savePersistedState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    localStorage.setItem("ext_installed", state.isInstalled ? "true" : "false");
  } catch {
  }
}
function useExtensionDetection() {
  const mobile = isMobile();
  const [extState, setExtState] = reactExports.useState(() => {
    if (mobile) return { isInstalled: false, version: "", capabilities: [] };
    return loadPersistedState();
  });
  const extStateRef = reactExports.useRef(extState);
  extStateRef.current = extState;
  const timerRef = reactExports.useRef(null);
  const debounceRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    function persist(state) {
      savePersistedState(state);
      setExtState(state);
    }
    if (mobile) {
      persist({ isInstalled: false, version: "", capabilities: [] });
      return;
    }
    debounceRef.current = setTimeout(() => {
      if (window.__COPIE_PASTE_INSTALLED__ === true) {
        persist({
          isInstalled: true,
          version: extStateRef.current.version || "",
          capabilities: extStateRef.current.capabilities.length > 0 ? extStateRef.current.capabilities : DEFAULT_CAPABILITIES
        });
        return;
      }
      function handleMessage(e) {
        var _a, _b, _c;
        const type = ((_a = e.data) == null ? void 0 : _a.type) ?? "";
        if (READY_MESSAGE_TYPES.includes(type)) {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
          const version = typeof ((_b = e.data) == null ? void 0 : _b.version) === "string" ? e.data.version : "";
          const capabilities = Array.isArray((_c = e.data) == null ? void 0 : _c.capabilities) ? e.data.capabilities : DEFAULT_CAPABILITIES;
          persist({ isInstalled: true, version, capabilities });
          window.removeEventListener("message", handleMessage);
        }
      }
      window.addEventListener("message", handleMessage);
      window.postMessage({ type: "COPIE_PASTE_PING" }, "*");
      timerRef.current = setTimeout(() => {
        if (window.__COPIE_PASTE_INSTALLED__ === true) {
          persist({
            isInstalled: true,
            version: extStateRef.current.version || "",
            capabilities: extStateRef.current.capabilities.length > 0 ? extStateRef.current.capabilities : DEFAULT_CAPABILITIES
          });
        } else {
          persist({
            isInstalled: false,
            version: "",
            capabilities: DEFAULT_CAPABILITIES
          });
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
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setExtState(JSON.parse(e.newValue));
        } catch {
        }
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [mobile]);
  return {
    isInstalled: extState.isInstalled,
    version: extState.version,
    capabilities: extState.capabilities,
    isMobileDevice: mobile
  };
}
function isPlatformSupported(platform, capabilities) {
  if (capabilities.length === 0) return true;
  return capabilities.includes(platform);
}
export {
  isMobile as a,
  isPlatformSupported as i,
  useExtensionDetection as u
};

import { r as reactExports, f as useActor, p as useQuery, g as useQueryClient, h as useMutation, i as createActor } from "./index-C4SYi2ho.js";
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
function useGetMyWebhookToken() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["myWebhookToken"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const result = await actor.getMyWebhookToken();
        if (!result) return null;
        const token = "ok" in result ? result.ok : result;
        return token ? String(token) : null;
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e5
    // 5 min — tokens don't change often
  });
}
function useGenerateWebhookToken() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.generateWebhookToken();
      if (result && "err" in result) throw new Error(result.err);
      const token = "ok" in result ? result.ok : result;
      return String(token);
    },
    onSuccess: (token) => {
      queryClient.setQueryData(["myWebhookToken"], token);
    }
  });
}
export {
  useGetMyWebhookToken as a,
  useGenerateWebhookToken as b,
  useExtensionDetection as u
};

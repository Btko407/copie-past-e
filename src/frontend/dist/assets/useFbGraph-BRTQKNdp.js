import { f as useActor, p as useQuery, g as useQueryClient, h as useMutation, i as createActor } from "./index-CxqRs8Fn.js";
function useGetMyFbCredentials() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["myFbCredentials"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const result = await actor.getMyFbCredentials();
        if (!result) return null;
        const data = "ok" in result ? result.ok : result;
        if (!data) return null;
        return {
          appId: String(data.appId ?? ""),
          accessToken: String(data.accessToken ?? "")
        };
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4
  });
}
function useSaveFbCredentials() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (creds) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.saveFbCredentials(
        creds.appId,
        creds.accessToken
      );
      if (result && "err" in result) throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myFbCredentials"] });
    }
  });
}
function useGetFbListings() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["myFbListings"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await actor.getFbListings();
        if (!result) return [];
        const data = "ok" in result ? result.ok : result;
        if (!Array.isArray(data)) return [];
        return data.map((item) => {
          var _a, _b, _c;
          return {
            id: String(item.id ?? ""),
            title: String(item.title ?? ""),
            description: ((_a = item.description) == null ? void 0 : _a[0]) ?? item.description ?? void 0,
            price: ((_b = item.price) == null ? void 0 : _b[0]) ?? item.price ?? void 0,
            category: ((_c = item.category) == null ? void 0 : _c[0]) ?? item.category ?? void 0,
            imageUrls: Array.isArray(item.imageUrls) ? item.imageUrls.map(String) : []
          };
        });
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
export {
  useSaveFbCredentials as a,
  useGetFbListings as b,
  useGetMyFbCredentials as u
};

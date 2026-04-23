import { f as useActor, p as useQuery, g as useQueryClient, h as useMutation, i as createActor } from "./index-CAvEfu6s.js";
function useListAllUsers() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllUsers();
    },
    enabled: !!actor && !isFetching
  });
}
function useAdminListProfiles() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["adminProfiles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminListProfiles();
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
function useAssignUserRole() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, role }) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.assignUserRole(userId, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    }
  });
}
function useGetCleanupSummaries() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["cleanupSummaries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCleanupSummaries();
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
function useRunLifecycleCleanup() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.runLifecycleCleanup();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cleanupSummaries"] });
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    }
  });
}
function useAdminResetUserSubscription() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ username }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.adminResetUserSubscription(username);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["adminProfiles"] });
    }
  });
}
function useAdminResetAllSubscriptions() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.adminResetAllUserSubscriptions();
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["adminProfiles"] });
    }
  });
}
function useAdminDeleteUser() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, username }) => {
      if (!actor) throw new Error("Actor not ready");
      const a = actor;
      if (typeof a.adminDeleteUser === "function") {
        const result = await a.adminDeleteUser(userId);
        const r = result;
        if (r && r.__kind__ === "err")
          throw new Error(r.err ?? "Delete failed");
      } else {
        console.warn(
          `adminDeleteUser not available on actor. Would delete userId=${userId} username=${username}`
        );
        throw new Error(
          "Delete user is not yet supported by this backend version."
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["adminProfiles"] });
    }
  });
}
export {
  useAdminListProfiles as a,
  useAssignUserRole as b,
  useAdminResetUserSubscription as c,
  useAdminResetAllSubscriptions as d,
  useAdminDeleteUser as e,
  useGetCleanupSummaries as f,
  useRunLifecycleCleanup as g,
  useListAllUsers as u
};

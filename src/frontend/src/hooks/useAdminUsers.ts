import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { UserCleanupSummary, UserSummary } from "../backend";
import type { UserProfile } from "../backend.d";

export function useListAllUsers() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<UserSummary[]>({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllUsers() as Promise<UserSummary[]>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAdminListProfiles() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<UserProfile[]>({
    queryKey: ["adminProfiles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminListProfiles();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useAssignUserRole() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<void, Error, { userId: string; role: string }>({
    mutationFn: async ({ userId, role }) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.assignUserRole(userId, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
  });
}

export function useGetCleanupSummaries() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<UserCleanupSummary[]>({
    queryKey: ["cleanupSummaries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCleanupSummaries();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useRunLifecycleCleanup() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<{ archived: bigint; deleted: bigint }, Error, void>({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.runLifecycleCleanup();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cleanupSummaries"] });
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
  });
}

export function useAdminResetUserSubscription() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<string, Error, { username: string }>({
    mutationFn: async ({ username }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.adminResetUserSubscription(username);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["adminProfiles"] });
    },
  });
}

export function useAdminResetAllSubscriptions() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<string, Error, void>({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.adminResetAllUserSubscriptions();
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["adminProfiles"] });
    },
  });
}

/** Deletes a user account and all associated data. Admin accounts cannot be deleted. */
export function useAdminDeleteUser() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<void, Error, { userId: string; username: string }>({
    mutationFn: async ({ userId, username }) => {
      if (!actor) throw new Error("Actor not ready");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const a = actor as unknown as Record<
        string,
        (...args: unknown[]) => Promise<unknown>
      >;
      if (typeof a.adminDeleteUser === "function") {
        const result = await a.adminDeleteUser(userId);
        // handle Result<ok, err> shape
        const r = result as { __kind__: string; err?: string } | null;
        if (r && r.__kind__ === "err")
          throw new Error(r.err ?? "Delete failed");
      } else {
        // Backend method not yet available — log deletion attempt
        console.warn(
          `adminDeleteUser not available on actor. Would delete userId=${userId} username=${username}`,
        );
        throw new Error(
          "Delete user is not yet supported by this backend version.",
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["adminProfiles"] });
    },
  });
}

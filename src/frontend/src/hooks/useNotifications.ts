import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { InAppNotification } from "../backend.d";
import { useAuth } from "./useAuth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorAny = any;

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface NotificationsState {
  notifications: InAppNotification[];
  unreadCount: number;
  markRead: (id: bigint) => void;
  markAllRead: () => void;
  isLoading: boolean;
}

export function useNotifications(): NotificationsState {
  const { actor, isFetching } = useActor(createActor);
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery<InAppNotification[]>(
    {
      queryKey: ["userNotifications"],
      queryFn: async (): Promise<InAppNotification[]> => {
        if (!actor) return [];
        return actor.getUserNotifications();
      },
      enabled: !!actor && !isFetching && isAuthenticated,
      staleTime: 60_000,
      refetchInterval: 60_000,
    },
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // markRead mutation — optimistic update + backend call
  const { mutate: markReadMutation } = useMutation<void, Error, bigint>({
    mutationFn: async (id: bigint) => {
      if (!actor) return;
      await actor.markNotificationRead(id);
    },
    onMutate: (id) => {
      queryClient.setQueryData<InAppNotification[]>(
        ["userNotifications"],
        (prev = []) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userNotifications"] });
    },
  });

  // markAllRead mutation
  const { mutate: markAllReadMutation } = useMutation<void, Error, void>({
    mutationFn: async () => {
      if (!actor) return;
      await actor.markAllNotificationsRead();
    },
    onMutate: () => {
      queryClient.setQueryData<InAppNotification[]>(
        ["userNotifications"],
        (prev = []) => prev.map((n) => ({ ...n, isRead: true })),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userNotifications"] });
    },
  });

  return {
    notifications,
    unreadCount,
    markRead: (id) => markReadMutation(id),
    markAllRead: () => markAllReadMutation(),
    isLoading,
  };
}

// ─── Low Fuel Notification ────────────────────────────────────────────────────

export interface CheckLowFuelArgs {
  fuelPercent: number;
  subscriptionExpirationTimestamp: bigint;
}

/**
 * Fires checkAndCreateLowFuelNotification on the backend when fuel drops below
 * 20%. The backend deduplicates — one notification per subscription period.
 * Safe to call on every page load.
 */
export function useCheckLowFuelNotification() {
  const { actor, isFetching } = useActor(createActor);
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<void, Error, CheckLowFuelArgs>({
    mutationFn: async ({ fuelPercent, subscriptionExpirationTimestamp }) => {
      if (!actor || isFetching || !isAuthenticated) return;
      // checkAndCreateLowFuelNotification(userId, fuelPercent, expirationTimestamp)
      // userId is omitted — the backend resolves the caller automatically
      try {
        await (actor as ActorAny).checkAndCreateLowFuelNotification(
          fuelPercent,
          subscriptionExpirationTimestamp,
        );
      } catch {
        // Swallow silently — this is a background notification trigger
      }
    },
    onSuccess: () => {
      // Refresh notifications so the new one appears
      queryClient.invalidateQueries({ queryKey: ["userNotifications"] });
    },
  });
}

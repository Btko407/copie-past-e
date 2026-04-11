import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { AdminNotification } from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorAny = any;

export interface AdminNotificationsState {
  notifications: AdminNotification[];
  unreadCount: number;
  loading: boolean;
  markRead: (id: number) => void;
  markAllRead: () => void;
}

export function useAdminNotifications(): AdminNotificationsState {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery<AdminNotification[]>(
    {
      queryKey: ["adminNotifications"],
      queryFn: async (): Promise<AdminNotification[]> => {
        if (!actor) return [];
        try {
          const result = await (actor as ActorAny).listAdminNotifications();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (result ?? []).map((n: any) => ({
            id: Number(n.id),
            type: n.type ?? "",
            message: n.message ?? "",
            relatedUser: n.relatedUser ?? "",
            relatedId: n.relatedId ?? undefined,
            priority: n.priority ?? "normal",
            read: Boolean(n.read),
            createdAt: BigInt(n.createdAt ?? 0),
          }));
        } catch {
          return [];
        }
      },
      enabled: !!actor && !isFetching,
      staleTime: 30_000,
      refetchInterval: 60_000,
    },
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const { mutate: markReadMutation } = useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      if (!actor) return;
      await (actor as ActorAny).markAdminNotificationRead(BigInt(id));
    },
    onMutate: (id) => {
      queryClient.setQueryData<AdminNotification[]>(
        ["adminNotifications"],
        (prev = []) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNotifications"] });
    },
  });

  const { mutate: markAllReadMutation } = useMutation<void, Error, void>({
    mutationFn: async () => {
      if (!actor) return;
      await (actor as ActorAny).markAllAdminNotificationsRead();
    },
    onMutate: () => {
      queryClient.setQueryData<AdminNotification[]>(
        ["adminNotifications"],
        (prev = []) => prev.map((n) => ({ ...n, read: true })),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNotifications"] });
    },
  });

  return {
    notifications,
    unreadCount,
    loading: isLoading,
    markRead: (id) => markReadMutation(id),
    markAllRead: () => markAllReadMutation(),
  };
}

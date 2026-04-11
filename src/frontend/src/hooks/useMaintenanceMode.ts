import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { MaintenanceStatus } from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorAny = any;

export interface MaintenanceModeState {
  isActive: boolean;
  message: string;
  eta: string;
  loading: boolean;
  toggle: (isActive: boolean, message: string, eta: string) => Promise<void>;
}

export function useMaintenanceMode(): MaintenanceModeState {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<MaintenanceStatus>({
    queryKey: ["maintenanceMode"],
    queryFn: async (): Promise<MaintenanceStatus> => {
      if (!actor) return { isActive: false, message: "", eta: "" };
      try {
        const result = await (actor as ActorAny).getMaintenanceMode();
        return {
          isActive: Boolean(result?.isActive),
          message: result?.message ?? "",
          eta: result?.eta ?? "",
        };
      } catch {
        return { isActive: false, message: "", eta: "" };
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  const { mutateAsync: toggleMutation } = useMutation<
    void,
    Error,
    { isActive: boolean; message: string; eta: string }
  >({
    mutationFn: async ({ isActive, message, eta }) => {
      if (!actor) return;
      await (actor as ActorAny).setMaintenanceMode(isActive, message, eta);
    },
    onSuccess: (_, vars) => {
      queryClient.setQueryData<MaintenanceStatus>(["maintenanceMode"], {
        isActive: vars.isActive,
        message: vars.message,
        eta: vars.eta,
      });
    },
  });

  return {
    isActive: data?.isActive ?? false,
    message: data?.message ?? "",
    eta: data?.eta ?? "",
    loading: isLoading,
    toggle: (isActive, message, eta) =>
      toggleMutation({ isActive, message, eta }),
  };
}

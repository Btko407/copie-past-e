import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { HealthStatus } from "../types";

export function useHealthStatus() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<HealthStatus>({
    queryKey: ["healthStatus"],
    queryFn: async () => {
      if (!actor) {
        return {
          status: "unknown",
          keysConfigured: true,
          criticalKeysPresent: true,
          lastBackupAt: BigInt(0),
          backupCount: BigInt(0),
        };
      }
      const a = actor as unknown as Record<
        string,
        (...args: unknown[]) => Promise<unknown>
      >;
      if (typeof a.getHealthStatus === "function") {
        return (await a.getHealthStatus()) as HealthStatus;
      }
      // Fallback: derive from stripe health if available
      if (typeof a.getStripeHealthStatus === "function") {
        const stripe = (await a.getStripeHealthStatus()) as {
          keysConfigured: boolean;
          status: string;
        };
        return {
          status: stripe.status ?? "ok",
          keysConfigured: stripe.keysConfigured ?? true,
          criticalKeysPresent: stripe.keysConfigured ?? true,
          lastBackupAt: BigInt(0),
          backupCount: BigInt(0),
        };
      }
      return {
        status: "ok",
        keysConfigured: true,
        criticalKeysPresent: true,
        lastBackupAt: BigInt(0),
        backupCount: BigInt(0),
      };
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnMount: true,
  });
}

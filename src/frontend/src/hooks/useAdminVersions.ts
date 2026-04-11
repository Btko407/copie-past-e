import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  AppVersion,
  CreateVersionArgs,
  RestoreResult,
  SiteSettings,
  VersionBackupSummary,
} from "../types";

export function useListVersionHistory() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<AppVersion[]>({
    queryKey: ["versionHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listVersionHistory() as unknown as Promise<AppVersion[]>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateVersion() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<AppVersion, Error, CreateVersionArgs>({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createVersion(args) as unknown as Promise<AppVersion>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["versionHistory"] });
    },
  });
}

export function useRollbackToVersion() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<SiteSettings, Error, bigint>({
    mutationFn: async (versionId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.rollbackToVersion(versionId) as Promise<SiteSettings>;
    },
    onSuccess: (data) => {
      queryClient.setQueryData<SiteSettings>(["adminSettings"], data);
      queryClient.invalidateQueries({ queryKey: ["versionHistory"] });
    },
  });
}

/**
 * Revert to a specific version: auto-saves current state as a new snapshot first,
 * then restores the selected version's settings.
 */
export function useRevertToVersion() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<
    { newSnapshotLabel: string; restoredLabel: string },
    Error,
    { versionId: bigint; versionNumber: number; versionLabel: string }
  >({
    mutationFn: async ({ versionId, versionLabel }) => {
      if (!actor) throw new Error("Actor not ready");

      // Step 1: auto-save current state as a new snapshot
      const allVersions =
        (await actor.listVersionHistory()) as unknown as AppVersion[];
      const latestNum = allVersions.length + 1;
      const autoLabel = `v${String(latestNum)}.0-autosave`;

      await (actor.createVersion({
        versionLabel: autoLabel,
        description: `Auto-saved before reverting to ${versionLabel}`,
      }) as unknown as Promise<AppVersion>);

      // Step 2: restore the selected version
      const restored = await (actor.rollbackToVersion(
        versionId,
      ) as Promise<SiteSettings>);
      queryClient.setQueryData<SiteSettings>(["adminSettings"], restored);

      return { newSnapshotLabel: autoLabel, restoredLabel: versionLabel };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["versionHistory"] });
    },
  });
}

// ─── Version Backups ──────────────────────────────────────────────────────────

export function useListVersionBackups() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<VersionBackupSummary[]>({
    queryKey: ["versionBackups"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listVersionBackups() as unknown as Promise<
        VersionBackupSummary[]
      >;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateVersionBackup() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<
    VersionBackupSummary,
    Error,
    { isManual: boolean; notes?: string }
  >({
    mutationFn: async ({ isManual, notes }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await (actor.createVersionBackup(
        isManual,
        notes ?? null,
      ) as unknown as Promise<
        | { __kind__: "ok"; ok: VersionBackupSummary }
        | { __kind__: "err"; err: string }
      >);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["versionBackups"] });
    },
  });
}

export function useRestoreFromVersionBackup() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<RestoreResult, Error, string>({
    mutationFn: async (backupId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.restoreFromVersionBackup(
        backupId,
      ) as unknown as Promise<RestoreResult>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["versionBackups"] });
      queryClient.invalidateQueries({ queryKey: ["versionHistory"] });
    },
  });
}

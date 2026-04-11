import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { RestoreResult, VersionBackupSummary } from "../types";

const BACKUP_QUERY_KEY = ["versionBackups"];
const VERSION_SNAPSHOT_QUERY_KEY = ["versionSnapshots"];

export function useBackupList() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<VersionBackupSummary[]>({
    queryKey: BACKUP_QUERY_KEY,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listVersionBackups() as unknown as Promise<
        VersionBackupSummary[]
      >;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateManualBackup() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<VersionBackupSummary, Error, { notes?: string }>({
    mutationFn: async ({ notes } = {}) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await (actor.createVersionBackup(
        true,
        notes ?? null,
      ) as unknown as Promise<
        | { __kind__: "ok"; ok: VersionBackupSummary }
        | { __kind__: "err"; err: string }
      >);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BACKUP_QUERY_KEY });
    },
  });
}

export function useRestoreFromBackup() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<RestoreResult, Error, string>({
    mutationFn: async (backupId: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.restoreFromVersionBackup(
        backupId,
      ) as unknown as Promise<RestoreResult>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BACKUP_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["versionHistory"] });
      queryClient.invalidateQueries({ queryKey: ["adminSettings"] });
    },
  });
}

export function useMarkBackupStable() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: async (backupId: string) => {
      if (!actor) throw new Error("Actor not ready");
      // Use dynamic access since markBackupAsStable may not be in typed interface yet
      const a = actor as unknown as Record<
        string,
        (...args: unknown[]) => Promise<unknown>
      >;
      if (typeof a.markBackupAsStable === "function") {
        return (await a.markBackupAsStable(backupId)) as boolean;
      }
      return false;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BACKUP_QUERY_KEY });
    },
  });
}

export function useDeleteBackup() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: async (backupId: string) => {
      if (!actor) throw new Error("Actor not ready");
      const a = actor as unknown as Record<
        string,
        (...args: unknown[]) => Promise<unknown>
      >;
      if (typeof a.deleteBackup === "function") {
        return (await a.deleteBackup(backupId)) as boolean;
      }
      return false;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BACKUP_QUERY_KEY });
    },
  });
}

export function useRollbackToStable() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<RestoreResult, Error, void>({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      // Fetch backup list and find most recent stable
      const backups =
        (await (actor.listVersionBackups() as unknown as Promise<
          VersionBackupSummary[]
        >)) ?? [];
      const stable = backups
        .filter((b) => b.isStable)
        .sort((a, b) => {
          if (b.createdAt > a.createdAt) return 1;
          if (b.createdAt < a.createdAt) return -1;
          return 0;
        })[0];
      if (!stable) throw new Error("No stable backup found.");
      return actor.restoreFromVersionBackup(
        stable.id,
      ) as unknown as Promise<RestoreResult>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BACKUP_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["versionHistory"] });
    },
  });
}

// ── Version Snapshot hooks ────────────────────────────────────────────────────

/**
 * Returns backups whose backupType contains 'version-snapshot'.
 * These are full data snapshots created before version changes.
 */
export function useVersionSnapshotList() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<VersionBackupSummary[]>({
    queryKey: VERSION_SNAPSHOT_QUERY_KEY,
    queryFn: async () => {
      if (!actor) return [];
      // getVersionSnapshotList returns only version-snapshot typed backups
      const a = actor as unknown as Record<
        string,
        (...args: unknown[]) => Promise<unknown>
      >;
      if (typeof a.getVersionSnapshotList === "function") {
        return (await a.getVersionSnapshotList()) as VersionBackupSummary[];
      }
      // Fallback: filter from full backup list
      const all =
        (await actor.listVersionBackups()) as unknown as VersionBackupSummary[];
      return all.filter((b) =>
        (b.backupType ?? "").toLowerCase().includes("version-snapshot"),
      );
    },
    enabled: !!actor && !isFetching,
  });
}

/**
 * Creates a manual version snapshot (backupType = 'version-snapshot-manual').
 */
export function useCreateVersionSnapshot() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<VersionBackupSummary, Error, { notes?: string }>({
    mutationFn: async ({ notes } = {}) => {
      if (!actor) throw new Error("Actor not ready");
      const a = actor as unknown as Record<
        string,
        (...args: unknown[]) => Promise<unknown>
      >;
      if (typeof a.createAdaptiveVersionSnapshot === "function") {
        // Backend returns ?VersionBackup (Option), not a Result.
        // null = skipped due to frequency limit; non-null = snapshot created.
        const result =
          (await a.createAdaptiveVersionSnapshot()) as VersionBackupSummary | null;
        if (result === null) {
          throw new Error(
            "Snapshot skipped: not yet due based on adaptive frequency. Try again later.",
          );
        }
        return result;
      }
      // Fallback: use createVersionBackup with version-snapshot type
      const result = await (actor.createVersionBackup(
        true,
        notes ?? null,
      ) as unknown as Promise<
        | { __kind__: "ok"; ok: VersionBackupSummary }
        | { __kind__: "err"; err: string }
      >);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VERSION_SNAPSHOT_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: BACKUP_QUERY_KEY });
    },
  });
}

/** Downloads a single backup as a .json file */
export function useExportBackupAsJson() {
  const { actor } = useActor(createActor);

  return useMutation<void, Error, VersionBackupSummary>({
    mutationFn: async (backup) => {
      if (!actor) throw new Error("Actor not ready");
      const json = JSON.stringify(backup, (_k, v) =>
        typeof v === "bigint" ? v.toString() : v,
      );
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `backup-${backup.id.slice(0, 8)}-${new Date(Number(backup.createdAt) / 1_000_000).toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    },
  });
}

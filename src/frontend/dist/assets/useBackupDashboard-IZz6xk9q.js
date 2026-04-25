import { c as createLucideIcon, b as useActor, d as useQueryClient, e as useMutation, i as useQuery, f as createActor } from "./index-BBOHKJcC.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  [
    "path",
    { d: "M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1", key: "1oajmo" }
  ],
  [
    "path",
    { d: "M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1", key: "mpwhp6" }
  ]
];
const FileJson = createLucideIcon("file-json", __iconNode);
const BACKUP_QUERY_KEY = ["versionBackups"];
const VERSION_SNAPSHOT_QUERY_KEY = ["versionSnapshots"];
function useBackupList() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: BACKUP_QUERY_KEY,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listVersionBackups();
    },
    enabled: !!actor && !isFetching
  });
}
function useCreateManualBackup() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ notes } = {}) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.createVersionBackup(
        true,
        notes ?? null
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BACKUP_QUERY_KEY });
    }
  });
}
function useRestoreFromBackup() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (backupId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.restoreFromVersionBackup(
        backupId
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BACKUP_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["versionHistory"] });
      queryClient.invalidateQueries({ queryKey: ["adminSettings"] });
    }
  });
}
function useMarkBackupStable() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (backupId) => {
      if (!actor) throw new Error("Actor not ready");
      const a = actor;
      if (typeof a.markBackupAsStable === "function") {
        return await a.markBackupAsStable(backupId);
      }
      return false;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BACKUP_QUERY_KEY });
    }
  });
}
function useDeleteBackup() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (backupId) => {
      if (!actor) throw new Error("Actor not ready");
      const a = actor;
      if (typeof a.deleteBackup === "function") {
        return await a.deleteBackup(backupId);
      }
      return false;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BACKUP_QUERY_KEY });
    }
  });
}
function useRollbackToStable() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const backups = await actor.listVersionBackups() ?? [];
      const stable = backups.filter((b) => b.isStable).sort((a, b) => {
        if (b.createdAt > a.createdAt) return 1;
        if (b.createdAt < a.createdAt) return -1;
        return 0;
      })[0];
      if (!stable) throw new Error("No stable backup found.");
      return actor.restoreFromVersionBackup(
        stable.id
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BACKUP_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["versionHistory"] });
    }
  });
}
function useVersionSnapshotList() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: VERSION_SNAPSHOT_QUERY_KEY,
    queryFn: async () => {
      if (!actor) return [];
      const a = actor;
      if (typeof a.getVersionSnapshotList === "function") {
        return await a.getVersionSnapshotList();
      }
      const all = await actor.listVersionBackups();
      return all.filter(
        (b) => (b.backupType ?? "").toLowerCase().includes("version-snapshot")
      );
    },
    enabled: !!actor && !isFetching
  });
}
function useCreateVersionSnapshot() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ notes } = {}) => {
      if (!actor) throw new Error("Actor not ready");
      const a = actor;
      if (typeof a.createAdaptiveVersionSnapshot === "function") {
        const result2 = await a.createAdaptiveVersionSnapshot();
        if (result2 === null) {
          throw new Error(
            "Snapshot skipped: not yet due based on adaptive frequency. Try again later."
          );
        }
        return result2;
      }
      const result = await actor.createVersionBackup(
        true,
        notes ?? null
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VERSION_SNAPSHOT_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: BACKUP_QUERY_KEY });
    }
  });
}
function useExportBackupAsJson() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (backup) => {
      if (!actor) throw new Error("Actor not ready");
      const json = JSON.stringify(
        backup,
        (_k, v) => typeof v === "bigint" ? v.toString() : v
      );
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `backup-${backup.id.slice(0, 8)}-${new Date(Number(backup.createdAt) / 1e6).toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  });
}
function useExportVersionBackup() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (backup) => {
      if (!actor) throw new Error("Actor not ready");
      const a = actor;
      if (typeof a.exportVersionBackupAsJson !== "function") {
        throw new Error("Export not supported on this deployment.");
      }
      const result = await a.exportVersionBackupAsJson(backup.id);
      const json = Array.isArray(result) && result.length > 0 ? result[0] : null;
      if (!json) throw new Error("Backup data not available.");
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a2 = document.createElement("a");
      a2.href = url;
      const date = new Date(Number(backup.createdAt) / 1e6).toISOString().split("T")[0];
      a2.download = `copie-paste-backup-${backup.id.slice(0, 8)}-${date}.json`;
      document.body.appendChild(a2);
      a2.click();
      document.body.removeChild(a2);
      URL.revokeObjectURL(url);
    }
  });
}
function useRestoreFromJsonFile() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file) => {
      if (!actor) throw new Error("Actor not ready");
      const text = await file.text();
      try {
        JSON.parse(text);
      } catch {
        throw new Error(
          "Invalid JSON file. Please upload a valid backup file."
        );
      }
      const a = actor;
      if (typeof a.restoreFromJsonBlob !== "function") {
        throw new Error(
          "File restore not supported on this deployment. Please restore from a database backup instead."
        );
      }
      return a.restoreFromJsonBlob(text);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["versionBackups"] });
      queryClient.invalidateQueries({ queryKey: ["versionHistory"] });
      queryClient.invalidateQueries({ queryKey: ["adminSettings"] });
    }
  });
}
export {
  FileJson as F,
  useVersionSnapshotList as a,
  useCreateManualBackup as b,
  useRestoreFromBackup as c,
  useMarkBackupStable as d,
  useDeleteBackup as e,
  useRollbackToStable as f,
  useExportBackupAsJson as g,
  useCreateVersionSnapshot as h,
  useRestoreFromJsonFile as i,
  useExportVersionBackup as j,
  useBackupList as u
};

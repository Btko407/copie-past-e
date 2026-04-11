import { f as useActor, p as useQuery, g as useQueryClient, h as useMutation, i as createActor } from "./index-CxqRs8Fn.js";
function useListVersionHistory() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["versionHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listVersionHistory();
    },
    enabled: !!actor && !isFetching
  });
}
function useCreateVersion() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createVersion(args);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["versionHistory"] });
    }
  });
}
function useRollbackToVersion() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (versionId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.rollbackToVersion(versionId);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["adminSettings"], data);
      queryClient.invalidateQueries({ queryKey: ["versionHistory"] });
    }
  });
}
function useRevertToVersion() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ versionId, versionLabel }) => {
      if (!actor) throw new Error("Actor not ready");
      const allVersions = await actor.listVersionHistory();
      const latestNum = allVersions.length + 1;
      const autoLabel = `v${String(latestNum)}.0-autosave`;
      await actor.createVersion({
        versionLabel: autoLabel,
        description: `Auto-saved before reverting to ${versionLabel}`
      });
      const restored = await actor.rollbackToVersion(
        versionId
      );
      queryClient.setQueryData(["adminSettings"], restored);
      return { newSnapshotLabel: autoLabel, restoredLabel: versionLabel };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["versionHistory"] });
    }
  });
}
function useListVersionBackups() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["versionBackups"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listVersionBackups();
    },
    enabled: !!actor && !isFetching
  });
}
function useRestoreFromVersionBackup() {
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
      queryClient.invalidateQueries({ queryKey: ["versionBackups"] });
      queryClient.invalidateQueries({ queryKey: ["versionHistory"] });
    }
  });
}
export {
  useCreateVersion as a,
  useListVersionBackups as b,
  useRollbackToVersion as c,
  useRevertToVersion as d,
  useRestoreFromVersionBackup as e,
  useListVersionHistory as u
};

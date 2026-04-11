import { c as createLucideIcon, f as useActor, p as useQuery, g as useQueryClient, h as useMutation, i as createActor, r as reactExports, j as jsxRuntimeExports, B as Button, S as Skeleton, R as RefreshCw, H as CircleCheck, V as TriangleAlert, a as ue, ad as Clock, Z as Zap, l as Label, I as Input, C as Copy, q as Shield } from "./index-CxqRs8Fn.js";
import { D as Database, U as Users, A as AdminLayout } from "./AdminLayout-C4UuyS2A.js";
import { A as AlertDialog, b as AlertDialogContent, c as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./alert-dialog-Yed9vYyA.js";
import { B as Badge } from "./badge-CamUHYgR.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-CCD5ijcb.js";
import { T as Textarea } from "./textarea-IQFpdPqY.js";
import { u as useListVersionHistory, a as useCreateVersion, c as useRollbackToVersion, d as useRevertToVersion } from "./useAdminVersions-3xBodG1F.js";
import { P as Plus } from "./plus-DBbPsNHG.js";
import { D as Download } from "./download-CgUy4RR3.js";
import { A as Archive } from "./archive-GcnfIcQn.js";
import { R as RotateCcw } from "./rotate-ccw-h2_-uugP.js";
import { S as Star } from "./star-BRGOh9EU.js";
import { F as FileJson } from "./file-json-DiEUGCVq.js";
import { T as Trash2 } from "./trash-2-DYMhRp-y.js";
import { C as ChevronUp } from "./chevron-up-B-z0DJgK.js";
import { C as ChevronDown } from "./chevron-down-CAh52t0j.js";
import { U as Upload } from "./upload-BOGehCel.js";
import "./credit-card-DsnG0NGQ.js";
import "./index-Bzv9z9Th.js";
import "./index-xYSDFNRz.js";
import "./index-CvuJeIlv.js";
import "./index-hB2o8KiB.js";
import "./index-BlgvJjSz.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }]
];
const History = createLucideIcon("history", __iconNode);
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
function formatDate$1(ts) {
  const ms = typeof ts === "bigint" ? Number(ts) / 1e6 : Number(ts);
  if (!ms) return "—";
  return new Date(ms).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function shortId$1(id) {
  return id.slice(0, 8);
}
function BackupStatusBar({
  backups
}) {
  const lastBackup = backups[0];
  const lastTs = lastBackup ? Number(lastBackup.createdAt) / 1e6 : null;
  const hoursSince = lastTs ? (Date.now() - lastTs) / (1e3 * 60 * 60) : Number.POSITIVE_INFINITY;
  const dotColor = hoursSince < 24 ? "bg-green-500" : hoursSince < 48 ? "bg-amber-400" : "bg-destructive";
  const totalSizeKb = backups.reduce(
    (acc, b) => acc + Number(b.sizeKb ?? 0),
    0
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap px-4 py-3 rounded-lg bg-secondary/20 border border-border/40 mb-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: `w-2.5 h-2.5 rounded-full shrink-0 ${dotColor}`,
        "aria-hidden": "true"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-foreground", children: [
      "Last backup:",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: lastBackup ? formatDate$1(lastBackup.createdAt) : "Never" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground", children: "|" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: backups.length }),
      " backups stored"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground", children: "|" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: (totalSizeKb / 1024).toFixed(1) }),
      " ",
      "MB used"
    ] })
  ] });
}
function BackupTypeBadge({ type }) {
  const isManual = type === "manual";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Badge,
    {
      variant: "outline",
      className: [
        "font-mono text-[9px] uppercase tracking-widest",
        isManual ? "border-accent/40 text-accent bg-accent/5" : "border-primary/40 text-primary bg-primary/5"
      ].join(" "),
      children: isManual ? "Manual" : "Auto"
    }
  );
}
function AdminBackupDashboard() {
  var _a, _b, _c, _d;
  const { data: backups = [], isLoading } = useBackupList();
  const createManual = useCreateManualBackup();
  const restore = useRestoreFromBackup();
  const markStable = useMarkBackupStable();
  const deleteBackup = useDeleteBackup();
  const rollbackStable = useRollbackToStable();
  const exportJson = useExportBackupAsJson();
  const [restoreTarget, setRestoreTarget] = reactExports.useState(null);
  const [restoreResult, setRestoreResult] = reactExports.useState(
    null
  );
  const [rollbackConfirm, setRollbackConfirm] = reactExports.useState(false);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(
    null
  );
  const fileInputRef = reactExports.useRef(null);
  const hasStable = backups.some((b) => b.isStable);
  async function handleCreateManualBackup() {
    try {
      await createManual.mutateAsync({});
      ue.success("Manual backup created", {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-primary" })
      });
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Backup failed.");
    }
  }
  async function handleRestore() {
    if (!restoreTarget) return;
    try {
      const result = await restore.mutateAsync(restoreTarget.id);
      if (result.success) {
        setRestoreResult(result);
        setRestoreTarget(null);
        ue.success("Restore complete!");
      } else {
        ue.error(result.errorMessage || result.message || "Restore failed.");
        setRestoreTarget(null);
      }
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Restore failed.");
      setRestoreTarget(null);
    }
  }
  async function handleRollbackStable() {
    try {
      const result = await rollbackStable.mutateAsync();
      setRollbackConfirm(false);
      if (result.success) {
        ue.success("Rolled back to last stable backup!");
      } else {
        ue.error(
          result.errorMessage || result.message || "Rollback failed."
        );
      }
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Rollback failed.");
      setRollbackConfirm(false);
    }
  }
  async function handleToggleStable(backup) {
    try {
      await markStable.mutateAsync(backup.id);
      ue.success(
        backup.isStable ? "Stable mark removed." : "Marked as stable."
      );
    } catch {
      ue.error("Could not update stable status.");
    }
  }
  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteBackup.mutateAsync(deleteTarget.id);
      ue.success("Backup deleted.");
      setDeleteTarget(null);
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Delete failed.");
      setDeleteTarget(null);
    }
  }
  function handleExportAllBackups() {
    const json = JSON.stringify(
      backups,
      (_k, v) => typeof v === "bigint" ? v.toString() : v
    );
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `all-backups-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  function handleImportFile(e) {
    var _a2;
    const file = (_a2 = e.target.files) == null ? void 0 : _a2[0];
    if (!file) return;
    ue.info(
      `Import file "${file.name}" selected. Restore via the button below.`
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(BackupStatusBar, { backups }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          onClick: handleCreateManualBackup,
          disabled: createManual.isPending,
          className: "font-mono text-xs gap-1.5 neon-border-blue glow-blue-sm",
          "data-ocid": "create-manual-backup-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
            createManual.isPending ? "Creating…" : "Create Manual Backup Now"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: handleExportAllBackups,
          disabled: backups.length === 0,
          className: "font-mono text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10",
          "data-ocid": "export-all-backups-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3 h-3" }),
            "Export All as .json"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => {
            var _a2;
            return (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
          },
          className: "font-mono text-xs gap-1.5 border-border/40",
          "data-ocid": "import-backup-file-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "w-3 h-3" }),
            "Import Backup File"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: fileInputRef,
          type: "file",
          accept: ".json,.zip",
          className: "hidden",
          onChange: handleImportFile
        }
      ),
      hasStable && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => setRollbackConfirm(true),
          disabled: rollbackStable.isPending,
          className: "font-mono text-xs gap-1.5 border-accent/40 text-accent hover:bg-accent/10 ml-auto",
          "data-ocid": "rollback-stable-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-3 h-3" }),
            "Rollback to Last Stable Version"
          ]
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-lg" }, i)) }) : backups.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl bg-card neon-border-blue p-10 text-center",
        "data-ocid": "backups-empty-state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "w-7 h-7 text-muted-foreground/40 mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs text-muted-foreground uppercase tracking-widest", children: "No backups yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground/60 mt-1", children: "Create a manual backup or wait for an automatic backup to appear." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-xl bg-card neon-border-blue", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full min-w-[700px] text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border/40", children: [
        "ID",
        "Type",
        "Created",
        "Version",
        "Users",
        "Listings",
        "Size",
        "Actions"
      ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: "font-mono text-[9px] text-muted-foreground uppercase tracking-widest px-3 py-3 whitespace-nowrap",
          children: h
        },
        h
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: backups.map((backup) => {
        var _a2, _b2;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-b border-border/20 hover:bg-secondary/10 transition-smooth",
            "data-ocid": "backup-row",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[11px] text-muted-foreground bg-secondary/30 px-1.5 py-0.5 rounded", children: shortId$1(backup.id) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BackupTypeBadge, { type: backup.backupType }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 whitespace-nowrap font-mono text-[11px] text-foreground", children: formatDate$1(backup.createdAt) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-primary", children: backup.versionLabel || "—" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs tabular-nums flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3 h-3 text-muted-foreground" }),
                ((_a2 = backup.userCount) == null ? void 0 : _a2.toString()) ?? "—"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs tabular-nums flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "w-3 h-3 text-muted-foreground" }),
                ((_b2 = backup.listingCount) == null ? void 0 : _b2.toString()) ?? "—"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 font-mono text-[11px] text-muted-foreground whitespace-nowrap", children: backup.sizeKb ? `${backup.sizeKb.toString()} KB` : "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleToggleStable(backup),
                    "aria-label": backup.isStable ? "Unmark stable" : "Mark as stable",
                    className: "p-1 rounded hover:bg-accent/10 transition-colors",
                    "data-ocid": `stable-toggle-${backup.id}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Star,
                      {
                        className: `w-3.5 h-3.5 ${backup.isStable ? "fill-accent text-accent" : "text-muted-foreground"}`
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => setRestoreTarget(backup),
                    disabled: restore.isPending,
                    className: "font-mono text-[10px] h-7 border-accent/40 text-accent hover:bg-accent/10 whitespace-nowrap",
                    "data-ocid": `restore-backup-btn-${backup.id}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3 h-3 mr-1" }),
                      "Restore"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => exportJson.mutateAsync(backup),
                    "aria-label": "Download as JSON",
                    className: "p-1.5 rounded border border-border/40 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors",
                    "data-ocid": `download-backup-${backup.id}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileJson, { className: "w-3.5 h-3.5" })
                  }
                ),
                !backup.isStable && backup.backupType !== "manual" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setDeleteTarget(backup),
                    "aria-label": "Delete backup",
                    className: "p-1.5 rounded border border-destructive/30 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors",
                    "data-ocid": `delete-backup-${backup.id}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                  }
                )
              ] }) })
            ]
          },
          backup.id
        );
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-card neon-border-blue p-5 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "w-4 h-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display text-xs font-bold tracking-widest uppercase text-primary", children: "Restore From File" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground leading-relaxed", children: "Upload a previously downloaded backup .json or .zip file to restore from a local backup — even if the database is unavailable." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "w-full border-2 border-dashed border-primary/20 hover:border-primary/40 rounded-lg p-8 text-center transition-colors cursor-pointer",
          onClick: () => {
            var _a2;
            return (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
          },
          "data-ocid": "restore-from-file-zone",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-6 h-6 text-muted-foreground/40 mx-auto mb-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: "Drag & drop or click to upload a backup file" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground/60 mt-1", children: ".json or .zip accepted" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: !!restoreTarget,
        onOpenChange: (open) => !open && setRestoreTarget(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "bg-card border-accent/30 font-body", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "font-display text-sm uppercase tracking-wider text-accent text-glow-yellow", children: "Restore from backup?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-xs text-muted-foreground leading-relaxed space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "Restore backup",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground bg-secondary/40 px-1.5 py-0.5 rounded", children: restoreTarget ? shortId$1(restoreTarget.id) : "" }),
                " ",
                "created",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: restoreTarget ? formatDate$1(restoreTarget.createdAt) : "" }),
                "?"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "This will restore",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-bold", children: [
                  ((_a = restoreTarget == null ? void 0 : restoreTarget.userCount) == null ? void 0 : _a.toString()) ?? "0",
                  " user accounts"
                ] }),
                " ",
                "and",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-bold", children: [
                  ((_b = restoreTarget == null ? void 0 : restoreTarget.listingCount) == null ? void 0 : _b.toString()) ?? "0",
                  " listings"
                ] }),
                "."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary/80", children: "Current state will be auto-saved as a new backup first." })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { className: "font-mono text-xs", children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              AlertDialogAction,
              {
                onClick: (e) => {
                  e.preventDefault();
                  handleRestore();
                },
                disabled: restore.isPending,
                className: "font-mono text-xs bg-accent text-accent-foreground hover:bg-accent/80",
                "data-ocid": "confirm-restore-backup-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3 h-3 mr-1.5" }),
                  restore.isPending ? "Restoring…" : "Restore — I Understand"
                ]
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: !!restoreResult,
        onOpenChange: (open) => !open && setRestoreResult(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "bg-card border-primary/30 font-body", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { className: "font-display text-sm uppercase tracking-wider text-primary text-glow-blue flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }),
              "Restore Complete"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-xs text-muted-foreground space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-bold", children: [
                  ((_c = restoreResult == null ? void 0 : restoreResult.usersRestored) == null ? void 0 : _c.toString()) ?? "0",
                  " users"
                ] }),
                " ",
                "and",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-bold", children: [
                  ((_d = restoreResult == null ? void 0 : restoreResult.listingsRestored) == null ? void 0 : _d.toString()) ?? "0",
                  " ",
                  "listings"
                ] }),
                " ",
                "restored."
              ] }),
              ((restoreResult == null ? void 0 : restoreResult.preRestoreBackupId) || (restoreResult == null ? void 0 : restoreResult.preSaveBackupId)) && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground/70", children: [
                "Pre-restore backup:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground bg-secondary/40 px-1.5 py-0.5 rounded", children: shortId$1(
                  restoreResult.preRestoreBackupId || restoreResult.preSaveBackupId
                ) })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            AlertDialogAction,
            {
              className: "font-mono text-xs",
              onClick: () => setRestoreResult(null),
              children: "Done"
            }
          ) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: rollbackConfirm, onOpenChange: setRollbackConfirm, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "bg-card border-accent/30 font-body", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "font-display text-sm uppercase tracking-wider text-accent", children: "Rollback to Last Stable?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { className: "font-mono text-xs text-muted-foreground", children: "This will restore the most recent backup marked as Stable. Current state will be saved as a new backup first." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { className: "font-mono text-xs", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          AlertDialogAction,
          {
            onClick: (e) => {
              e.preventDefault();
              handleRollbackStable();
            },
            disabled: rollbackStable.isPending,
            className: "font-mono text-xs bg-accent text-accent-foreground hover:bg-accent/80",
            "data-ocid": "confirm-rollback-stable-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-3 h-3 mr-1.5" }),
              rollbackStable.isPending ? "Rolling back…" : "Rollback — I Understand"
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: !!deleteTarget,
        onOpenChange: (open) => !open && setDeleteTarget(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "bg-card border-destructive/40 font-body", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { className: "font-display text-sm uppercase tracking-wider text-destructive flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4" }),
              "Delete Backup?"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { className: "font-mono text-xs text-muted-foreground", children: [
              "Delete backup",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: deleteTarget ? shortId$1(deleteTarget.id) : "" }),
              "? This cannot be undone. Manual backups are protected and cannot be deleted."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { className: "font-mono text-xs", children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              AlertDialogAction,
              {
                onClick: (e) => {
                  e.preventDefault();
                  handleDelete();
                },
                disabled: deleteBackup.isPending,
                className: "font-mono text-xs bg-destructive text-destructive-foreground hover:bg-destructive/80",
                "data-ocid": "confirm-delete-backup-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3 mr-1.5" }),
                  deleteBackup.isPending ? "Deleting…" : "Delete"
                ]
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
function formatDate(ts) {
  const num = typeof ts === "bigint" ? Number(ts) / 1e6 : Number(ts);
  return new Date(num).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function shortId(id) {
  return id.slice(0, 8);
}
function shortPrincipal(p) {
  const s = p.toString();
  return `${s.slice(0, 8)}…${s.slice(-4)}`;
}
function ColorSwatch({ color, label }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "w-3 h-3 rounded-sm border border-border/50 inline-block shrink-0",
        style: { background: color }
      }
    ),
    label
  ] });
}
function VersionSnapshot({ settings }) {
  var _a, _b, _c, _d;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-3 rounded-lg bg-secondary/20 border border-border/40", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-1", children: "App Name" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-foreground truncate", children: settings.appName })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-1.5", children: "Colors" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ColorSwatch, { color: settings.primaryColor, label: "Primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ColorSwatch, { color: settings.accentColor, label: "Accent" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-1.5", children: "Features" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: [
              "font-mono text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5",
              settings.uploadEnabled ? "bg-primary/10 text-primary" : "bg-muted/30 text-muted-foreground line-through"
            ].join(" "),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-2 h-2" }),
              "Upload"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: [
              "font-mono text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5",
              settings.copyButtonsEnabled ? "bg-primary/10 text-primary" : "bg-muted/30 text-muted-foreground line-through"
            ].join(" "),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-2 h-2" }),
              "Copy"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: [
              "font-mono text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5",
              settings.contentModerationEnabled ? "bg-accent/10 text-accent" : "bg-muted/30 text-muted-foreground line-through"
            ].join(" "),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-2 h-2" }),
              "Moderation"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-1", children: "Rate Limits" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] text-muted-foreground", children: [
        (_a = settings.maxRequestsPerMinute) == null ? void 0 : _a.toString(),
        "/min ·",
        " ",
        (_b = settings.maxUploadsPerHour) == null ? void 0 : _b.toString(),
        "/hr"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-1", children: "Session" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] text-muted-foreground", children: [
        (_c = settings.maxSessionDurationMinutes) == null ? void 0 : _c.toString(),
        " min ·",
        " ",
        (_d = settings.maxConcurrentSessions) == null ? void 0 : _d.toString(),
        " concurrent"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-1", children: "Origins" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground truncate", children: settings.allowedOrigins || "*" })
    ] })
  ] });
}
const DIFF_KEYS = [
  "appName",
  "primaryColor",
  "accentColor",
  "uploadEnabled",
  "copyButtonsEnabled",
  "contentModerationEnabled",
  "maxRequestsPerMinute",
  "maxUploadsPerHour",
  "maxSessionDurationMinutes",
  "maxConcurrentSessions",
  "allowedOrigins"
];
function VersionDiff({
  current,
  previous
}) {
  const changed = DIFF_KEYS.filter((k) => {
    const a = current[k];
    const b = previous[k];
    return typeof a === "bigint" || typeof b === "bigint" ? (a == null ? void 0 : a.toString()) !== (b == null ? void 0 : b.toString()) : a !== b;
  });
  if (changed.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground mt-2 px-3", children: "No configuration changes vs previous version." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-1 px-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-2", children: "Changed fields vs previous" }),
    changed.map((k) => {
      var _a, _b;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "grid grid-cols-3 gap-2 text-[10px] font-mono py-1 border-b border-border/30",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground truncate", children: k }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive line-through truncate", children: ((_a = previous[k]) == null ? void 0 : _a.toString()) ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary truncate", children: ((_b = current[k]) == null ? void 0 : _b.toString()) ?? "—" })
          ]
        },
        k
      );
    })
  ] });
}
function snapshotFreshness(backups) {
  const last = backups[0];
  const lastTs = last ? Number(last.createdAt) / 1e6 : null;
  const hoursSince = lastTs ? (Date.now() - lastTs) / (1e3 * 60 * 60) : Number.POSITIVE_INFINITY;
  return {
    dotColor: hoursSince < 24 ? "bg-green-500" : hoursSince < 48 ? "bg-amber-400" : "bg-destructive",
    hoursSince,
    lastTs,
    lastBackup: last
  };
}
function SnapshotTypeBadge({ type }) {
  const isManual = type.includes("manual");
  const isPreDeploy = type.includes("pre-deploy");
  const label = isManual ? "Manual" : isPreDeploy ? "Pre-Deploy" : "Auto";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Badge,
    {
      variant: "outline",
      className: [
        "font-mono text-[9px] uppercase tracking-widest",
        isManual ? "border-accent/40 text-accent bg-accent/5" : isPreDeploy ? "border-primary/40 text-primary bg-primary/5" : "border-border/40 text-muted-foreground bg-muted/5"
      ].join(" "),
      children: label
    }
  );
}
function DataSnapshotDashboard() {
  var _a, _b, _c, _d;
  const { data: snapshots = [], isLoading } = useVersionSnapshotList();
  const createSnapshot = useCreateVersionSnapshot();
  const restore = useRestoreFromBackup();
  const markStable = useMarkBackupStable();
  const exportJson = useExportBackupAsJson();
  const [restoreTarget, setRestoreTarget] = reactExports.useState(null);
  const [restoreResult, setRestoreResult] = reactExports.useState(
    null
  );
  const { dotColor, lastBackup } = snapshotFreshness(snapshots);
  const totalSizeKb = snapshots.reduce(
    (acc, b) => acc + Number(b.sizeKb ?? 0),
    0
  );
  async function handleCreate() {
    try {
      await createSnapshot.mutateAsync({ notes: "Manual version snapshot" });
      ue.success("Version snapshot created", {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-primary" })
      });
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Snapshot failed.");
    }
  }
  async function handleRestore() {
    if (!restoreTarget) return;
    try {
      const result = await restore.mutateAsync(restoreTarget.id);
      if (result.success) {
        setRestoreResult(result);
        setRestoreTarget(null);
        ue.success("Restore complete!");
      } else {
        ue.error(result.errorMessage || "Restore failed.");
        setRestoreTarget(null);
      }
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Restore failed.");
      setRestoreTarget(null);
    }
  }
  async function handleToggleStable(snapshot) {
    try {
      await markStable.mutateAsync(snapshot.id);
      ue.success(
        snapshot.isStable ? "Stable mark removed." : "Marked as stable."
      );
    } catch {
      ue.error("Could not update stable status.");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap px-4 py-3 rounded-lg bg-secondary/20 border border-border/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: `w-2.5 h-2.5 rounded-full shrink-0 ${dotColor}`,
          "aria-hidden": "true"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-foreground", children: [
        "Last snapshot:",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: lastBackup ? new Date(
          Number(lastBackup.createdAt) / 1e6
        ).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }) : "Never" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground", children: "|" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: snapshots.length }),
        " snapshots stored"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground", children: "|" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: (totalSizeKb / 1024).toFixed(1) }),
        " ",
        "MB used"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        size: "sm",
        onClick: handleCreate,
        disabled: createSnapshot.isPending,
        className: "font-mono text-xs gap-1.5 neon-border-blue glow-blue-sm",
        "data-ocid": "create-version-snapshot-btn",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
          createSnapshot.isPending ? "Creating…" : "Create Version Snapshot Now"
        ]
      }
    ),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-lg" }, i)) }) : snapshots.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl bg-card neon-border-blue p-10 text-center",
        "data-ocid": "version-snapshots-empty-state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "w-7 h-7 text-muted-foreground/40 mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs text-muted-foreground uppercase tracking-widest", children: "No version snapshots yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground/60 mt-1", children: "Snapshots are created automatically before each version change. Create one manually above." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-xl bg-card neon-border-blue", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full min-w-[680px] text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border/40", children: [
        "ID",
        "Type",
        "Created",
        "Version",
        "Users",
        "Listings",
        "Size",
        "Actions"
      ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: "font-mono text-[9px] text-muted-foreground uppercase tracking-widest px-3 py-3 whitespace-nowrap",
          children: h
        },
        h
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: snapshots.map((snap) => {
        var _a2, _b2;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-b border-border/20 hover:bg-secondary/10 transition-smooth",
            "data-ocid": "version-snapshot-row",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[11px] text-muted-foreground bg-secondary/30 px-1.5 py-0.5 rounded", children: snap.id.slice(0, 8) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SnapshotTypeBadge, { type: snap.backupType ?? "" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 whitespace-nowrap font-mono text-[11px] text-foreground", children: new Date(
                Number(snap.createdAt) / 1e6
              ).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-primary", children: snap.versionLabel || "—" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs tabular-nums flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3 h-3 text-muted-foreground" }),
                ((_a2 = snap.userCount) == null ? void 0 : _a2.toString()) ?? "—"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs tabular-nums flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "w-3 h-3 text-muted-foreground" }),
                ((_b2 = snap.listingCount) == null ? void 0 : _b2.toString()) ?? "—"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 font-mono text-[11px] text-muted-foreground whitespace-nowrap", children: snap.sizeKb ? `${snap.sizeKb.toString()} KB` : "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleToggleStable(snap),
                    "aria-label": snap.isStable ? "Unmark stable" : "Mark as stable",
                    className: "p-1 rounded hover:bg-accent/10 transition-colors",
                    "data-ocid": `snap-stable-toggle-${snap.id}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Star,
                      {
                        className: `w-3.5 h-3.5 ${snap.isStable ? "fill-accent text-accent" : "text-muted-foreground"}`
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => setRestoreTarget(snap),
                    disabled: restore.isPending,
                    className: "font-mono text-[10px] h-7 border-accent/40 text-accent hover:bg-accent/10 whitespace-nowrap",
                    "data-ocid": `snap-restore-btn-${snap.id}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3 h-3 mr-1" }),
                      "Restore"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => exportJson.mutateAsync(snap),
                    "aria-label": "Download as JSON",
                    className: "p-1.5 rounded border border-border/40 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors",
                    "data-ocid": `snap-download-${snap.id}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileJson, { className: "w-3.5 h-3.5" })
                  }
                )
              ] }) })
            ]
          },
          snap.id
        );
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: !!restoreTarget,
        onOpenChange: (open) => !open && setRestoreTarget(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "bg-card border-accent/30 font-body", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "font-display text-sm uppercase tracking-wider text-accent text-glow-yellow", children: "Restore from version snapshot?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-xs text-muted-foreground leading-relaxed space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "Restore snapshot",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground bg-secondary/40 px-1.5 py-0.5 rounded", children: restoreTarget ? restoreTarget.id.slice(0, 8) : "" }),
                " ",
                "— this will restore",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-bold", children: [
                  ((_a = restoreTarget == null ? void 0 : restoreTarget.userCount) == null ? void 0 : _a.toString()) ?? "0",
                  " user accounts"
                ] }),
                " ",
                "and",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-bold", children: [
                  ((_b = restoreTarget == null ? void 0 : restoreTarget.listingCount) == null ? void 0 : _b.toString()) ?? "0",
                  " listings"
                ] }),
                "."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary/80", children: "Current state will be auto-saved as a new backup first." })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { className: "font-mono text-xs", children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              AlertDialogAction,
              {
                onClick: (e) => {
                  e.preventDefault();
                  handleRestore();
                },
                disabled: restore.isPending,
                className: "font-mono text-xs bg-accent text-accent-foreground hover:bg-accent/80",
                "data-ocid": "confirm-snap-restore-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3 h-3 mr-1.5" }),
                  restore.isPending ? "Restoring…" : "Restore — I Understand"
                ]
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: !!restoreResult,
        onOpenChange: (open) => !open && setRestoreResult(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "bg-card border-primary/30 font-body", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { className: "font-display text-sm uppercase tracking-wider text-primary text-glow-blue flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }),
              "Restore Complete"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs text-muted-foreground space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-bold", children: [
                ((_c = restoreResult == null ? void 0 : restoreResult.usersRestored) == null ? void 0 : _c.toString()) ?? "0",
                " users"
              ] }),
              " ",
              "and",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-bold", children: [
                ((_d = restoreResult == null ? void 0 : restoreResult.listingsRestored) == null ? void 0 : _d.toString()) ?? "0",
                " ",
                "listings"
              ] }),
              " ",
              "restored."
            ] }) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            AlertDialogAction,
            {
              className: "font-mono text-xs",
              onClick: () => setRestoreResult(null),
              children: "Done"
            }
          ) })
        ] })
      }
    )
  ] });
}
function AdminVersionsPage() {
  const { data: versions = [], isLoading } = useListVersionHistory();
  const createVersion = useCreateVersion();
  const rollback = useRollbackToVersion();
  const revert = useRevertToVersion();
  const [activeTab, setActiveTab] = reactExports.useState(
    "snapshots"
  );
  const [createOpen, setCreateOpen] = reactExports.useState(false);
  const [newLabel, setNewLabel] = reactExports.useState("");
  const [newDesc, setNewDesc] = reactExports.useState("");
  const [revertTarget, setRevertTarget] = reactExports.useState(null);
  const [expandedId, setExpandedId] = reactExports.useState(null);
  function getAutoLabel() {
    if (versions.length === 0) return "v1.0";
    const labels = versions.map((v) => v.versionLabel).filter((l) => /^v\d+\.\d+$/.test(l));
    if (labels.length === 0) return `v${String(versions.length + 1)}.0`;
    const nums = labels.map((l) => Number.parseFloat(l.replace("v", ""))).sort((a, b) => b - a);
    const latest = nums[0];
    const minor = Math.round(latest % 1 * 10) + 1;
    const major = Math.floor(latest);
    return `v${String(major)}.${String(minor)}`;
  }
  function openCreateModal() {
    setNewLabel(getAutoLabel());
    setNewDesc("");
    setCreateOpen(true);
  }
  async function handleCreate() {
    if (!newLabel.trim()) return;
    try {
      await createVersion.mutateAsync({
        versionLabel: newLabel.trim(),
        description: newDesc.trim()
      });
      ue.success("Version created", {
        description: `Snapshot ${newLabel} saved.`,
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-primary" })
      });
      setCreateOpen(false);
    } catch {
      ue.error("Failed to create version snapshot.");
    }
  }
  async function handleRevert() {
    if (!revertTarget) return;
    const versionNumber = versions.length - versions.indexOf(revertTarget);
    try {
      const result = await revert.mutateAsync({
        versionId: revertTarget.id,
        versionNumber,
        versionLabel: revertTarget.versionLabel
      });
      ue.success(`Reverted to ${revertTarget.versionLabel}`, {
        description: `Current settings saved as ${result.newSnapshotLabel}. Configuration restored.`,
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 text-accent" })
      });
      setRevertTarget(null);
    } catch {
      try {
        await rollback.mutateAsync(revertTarget.id);
        ue.success("Rollback complete", {
          description: `Configuration restored to ${revertTarget.versionLabel}.`,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 text-accent" })
        });
        setRevertTarget(null);
      } catch {
        ue.error("Revert failed", {
          description: "Could not restore version."
        });
      }
    }
  }
  function toggleExpand(id) {
    setExpandedId((prev) => prev === id ? null : id);
  }
  const isReverting = revert.isPending || rollback.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { title: "Versions", subtitle: "History & Rollback", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 mb-6 bg-secondary/20 p-1 rounded-lg w-fit", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setActiveTab("snapshots"),
          className: [
            "flex items-center gap-1.5 px-4 py-2 rounded-md font-mono text-xs font-medium transition-smooth",
            activeTab === "snapshots" ? "bg-card text-primary shadow-sm neon-border-blue" : "text-muted-foreground hover:text-foreground"
          ].join(" "),
          "data-ocid": "tab-version-snapshots",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "w-3.5 h-3.5" }),
            "Version Snapshots"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setActiveTab("backups"),
          className: [
            "flex items-center gap-1.5 px-4 py-2 rounded-md font-mono text-xs font-medium transition-smooth",
            activeTab === "backups" ? "bg-card text-primary shadow-sm neon-border-blue" : "text-muted-foreground hover:text-foreground"
          ].join(" "),
          "data-ocid": "tab-data-backups",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "w-3.5 h-3.5" }),
            "Data Backups"
          ]
        }
      )
    ] }),
    activeTab === "backups" ? /* @__PURE__ */ jsxRuntimeExports.jsx(AdminBackupDashboard, {}) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center glow-blue-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "w-3.5 h-3.5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-sm font-bold tracking-wider uppercase text-foreground", children: "Section A — Version Snapshots" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground mt-0.5", children: "App configuration snapshots" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 mb-6 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-bold tracking-wider uppercase text-foreground", children: "Version History" }),
          !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "outline",
              className: "font-mono text-[10px] text-primary border-primary/50 bg-primary/5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "w-2.5 h-2.5 mr-1" }),
                versions.length,
                " snapshots"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: openCreateModal,
            className: "font-mono text-xs gap-1.5 neon-border-blue glow-blue-sm",
            "data-ocid": "create-version-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
              "Create Snapshot"
            ]
          }
        )
      ] }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-xl" }, i)) }) : versions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-xl bg-card neon-border-blue p-12 text-center",
          "data-ocid": "versions-empty-state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-8 h-8 text-muted-foreground/40 mx-auto mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs text-muted-foreground uppercase tracking-widest", children: "No snapshots yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground/60 mt-1", children: "Create your first version snapshot to enable rollback" })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: versions.map((version, index) => {
        const isExpanded = expandedId === version.id;
        const prevVersion = versions[index + 1];
        const isLatest = index === 0;
        const versionNum = versions.length - index;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: [
              "rounded-xl bg-card overflow-hidden transition-smooth",
              version.isRollback ? "neon-border-yellow" : "neon-border-blue"
            ].join(" "),
            "data-ocid": "version-card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: "flex items-start gap-3 px-5 py-4 cursor-pointer hover:bg-secondary/20 transition-smooth w-full text-left",
                  onClick: () => toggleExpand(version.id),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 mt-0.5", children: version.isRollback ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center glow-yellow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5 text-accent" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center glow-blue-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3.5 h-3.5 text-primary" }) }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: [
                              "font-display text-sm font-bold tracking-wider",
                              version.isRollback ? "text-accent text-glow-yellow" : "text-primary text-glow-blue"
                            ].join(" "),
                            children: version.versionLabel
                          }
                        ),
                        version.isRollback && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Badge,
                          {
                            variant: "outline",
                            className: "font-mono text-[9px] text-accent border-accent/40 bg-accent/5 uppercase tracking-widest",
                            children: "Rollback"
                          }
                        ),
                        isLatest && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Badge,
                          {
                            variant: "outline",
                            className: "font-mono text-[9px] text-primary border-primary/40 bg-primary/5 uppercase tracking-widest",
                            children: "Latest"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-1 flex-wrap", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] text-muted-foreground", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-2.5 h-2.5 inline mr-1 mb-0.5" }),
                          formatDate(version.createdAt)
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] text-muted-foreground", children: [
                          "By ",
                          shortPrincipal(version.createdBy)
                        ] }),
                        version.description && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] text-muted-foreground/70 truncate max-w-xs", children: [
                          "“",
                          version.description,
                          "”"
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                      !isLatest && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Button,
                        {
                          variant: "outline",
                          size: "sm",
                          onClick: (e) => {
                            e.stopPropagation();
                            setRevertTarget(version);
                          },
                          className: "font-mono text-[10px] h-7 border-accent/40 text-accent hover:bg-accent/10 gap-1 whitespace-nowrap",
                          "data-ocid": `revert-btn-${version.id.toString()}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3 h-3" }),
                            "Revert to V",
                            versionNum
                          ]
                        }
                      ),
                      isExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-4 h-4 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4 text-muted-foreground" })
                    ] })
                  ]
                }
              ),
              isExpanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/30 px-5 py-4 bg-secondary/10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-1", children: "Configuration Snapshot" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(VersionSnapshot, { settings: version.settingsSnapshot }),
                prevVersion && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-1", children: [
                    "Changes vs ",
                    prevVersion.versionLabel
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    VersionDiff,
                    {
                      current: version.settingsSnapshot,
                      previous: prevVersion.settingsSnapshot
                    }
                  )
                ] })
              ] })
            ]
          },
          version.id.toString()
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center glow-yellow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "w-3.5 h-3.5 text-accent" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-sm font-bold tracking-wider uppercase text-foreground", children: "Section B — Data Snapshots" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground mt-0.5", children: "Full-state backups for safe version rollback — restore users, listings, and config to any saved point" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DataSnapshotDashboard, {})
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: createOpen, onOpenChange: setCreateOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-card border-primary/30 font-body sm:max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-sm uppercase tracking-wider text-primary text-glow-blue", children: "Create Version Snapshot" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: "versionLabel",
              className: "font-mono text-xs text-foreground tracking-wide",
              children: "Version Label"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "versionLabel",
              value: newLabel,
              onChange: (e) => setNewLabel(e.target.value),
              className: "mt-2 font-mono text-sm bg-secondary/30 border-primary/30 focus:border-primary/60",
              placeholder: "v1.0",
              "data-ocid": "version-label-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Label,
            {
              htmlFor: "versionDesc",
              className: "font-mono text-xs text-foreground tracking-wide",
              children: [
                "Description",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "(optional)" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "versionDesc",
              value: newDesc,
              onChange: (e) => setNewDesc(e.target.value),
              className: "mt-2 font-mono text-xs bg-secondary/30 border-primary/30 focus:border-primary/60 resize-none",
              placeholder: "What changed in this version…",
              rows: 3,
              "data-ocid": "version-desc-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => setCreateOpen(false),
              className: "font-mono text-xs",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              onClick: handleCreate,
              disabled: !newLabel.trim() || createVersion.isPending,
              className: "font-mono text-xs gap-1.5 neon-border-blue glow-blue-sm",
              "data-ocid": "confirm-create-version-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
                createVersion.isPending ? "Creating…" : "Create Snapshot"
              ]
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: !!revertTarget,
        onOpenChange: (open) => !open && setRevertTarget(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "bg-card border-accent/30 font-body", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { className: "font-display text-sm uppercase tracking-wider text-accent text-glow-yellow", children: [
              "Revert to ",
              revertTarget == null ? void 0 : revertTarget.versionLabel,
              "?"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { className: "font-mono text-xs text-muted-foreground leading-relaxed", children: [
              "Your current settings will be",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-bold", children: "auto-saved as a new snapshot" }),
              " ",
              "first, then",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-bold", children: revertTarget == null ? void 0 : revertTarget.versionLabel }),
              " ",
              "settings will be restored.",
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-bold", children: "User data and listings will NOT be affected." }),
              " ",
              "Only app configuration will be restored."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { className: "font-mono text-xs", children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              AlertDialogAction,
              {
                onClick: handleRevert,
                disabled: isReverting,
                className: "font-mono text-xs bg-accent text-accent-foreground hover:bg-accent/80",
                "data-ocid": "confirm-revert-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3 h-3 mr-1.5" }),
                  isReverting ? "Reverting…" : `Revert to ${(revertTarget == null ? void 0 : revertTarget.versionLabel) ?? ""}`
                ]
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  AdminVersionsPage,
  shortId
};

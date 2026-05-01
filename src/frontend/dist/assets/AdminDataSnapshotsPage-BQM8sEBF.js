import { b as useActor, r as reactExports, l as useQuery, j as jsxRuntimeExports, f as createActor } from "./index-B_oOf7NU.js";
import { D as Download } from "./download-Dt9Q1v_8.js";
import { R as RotateCcw } from "./rotate-ccw-Bzeoltor.js";
function AdminDataSnapshotsPage() {
  const { actor } = useActor(createActor);
  const [searchFilter, setSearchFilter] = reactExports.useState(
    "all"
  );
  const { data: index } = useQuery({
    queryKey: ["versionBackupIndex"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      return await actor.getVersionBackupIndex();
    },
    enabled: !!actor
  });
  const { data: snapshots = [], isLoading: snapshotsLoading } = useQuery({
    queryKey: ["versionSnapshots", searchFilter],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const filter = searchFilter === "all" ? [] : [searchFilter];
      return await actor.searchVersionSnapshots(filter, [], []);
    },
    enabled: !!actor
  });
  const downloadSnapshot = async (snapshotId) => {
    if (!actor) return;
    try {
      const result = await actor.downloadDataSnapshot(snapshotId);
      if (result && result.length > 0) {
        const snapshot = result[0];
        const blob = new Blob([snapshot.data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `snapshot-${snapshotId.slice(0, 8)}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Download failed:", err);
    }
  };
  const restoreSnapshot = async (snapshotId) => {
    var _a;
    if (!actor || !window.confirm(
      "Restore from this snapshot? Current data will be backed up first."
    ))
      return;
    try {
      const result = await actor.restoreFromVersionBackupWithSafety(
        snapshotId
      );
      if (result.success) {
        window.alert(
          `Restored ${result.usersRestored} users, ${result.listingsRestored} listings`
        );
      } else {
        window.alert(
          `Restore failed: ${((_a = result.errorMessage) == null ? void 0 : _a[0]) ?? "Unknown error"}`
        );
      }
    } catch (err) {
      console.error("Restore failed:", err);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 p-6", "data-ocid": "admin.data_snapshots.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Data Snapshots" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2", children: "Version snapshots double as complete data backups for restore and debugging" })
    ] }),
    index && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border p-4 rounded-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground text-sm", children: "Total Snapshots" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-foreground", children: Number(index.totalSnapshots) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border p-4 rounded-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground text-sm", children: "Auto Snapshots" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-foreground", children: Number(index.autoSnapshots) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border p-4 rounded-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground text-sm", children: "Manual Snapshots" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-foreground", children: Number(index.manualSnapshots) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border p-4 rounded-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground text-sm", children: "Total Size" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-foreground", children: [
          (Number(index.totalDataSize) / 1024 / 1024).toFixed(2),
          " MB"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", "data-ocid": "admin.data_snapshots.filter", children: ["all", "auto", "manual"].map((filter) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        "data-ocid": `admin.data_snapshots.filter.${filter}`,
        type: "button",
        onClick: () => setSearchFilter(filter),
        className: `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${searchFilter === filter ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`,
        children: filter === "all" ? "All" : filter === "auto" ? "Auto" : "Manual"
      },
      filter
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "admin.data_snapshots.list", children: snapshotsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "text-muted-foreground py-8 text-center",
        "data-ocid": "admin.data_snapshots.loading_state",
        children: "Loading snapshots..."
      }
    ) : snapshots.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "text-muted-foreground py-8 text-center",
        "data-ocid": "admin.data_snapshots.empty_state",
        children: "No snapshots found"
      }
    ) : snapshots.map((snap, i) => {
      var _a;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": `admin.data_snapshots.item.${i + 1}`,
          className: "bg-card border border-border p-4 rounded-lg flex items-center justify-between hover:bg-accent/30 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-sm text-foreground truncate", children: [
                String(snap.id).slice(0, 16),
                "…"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-1", children: [
                new Date(
                  Number(snap.createdAt) / 1e6
                ).toLocaleString(),
                " ",
                "• ",
                Number(snap.userCount),
                " users • ",
                Number(snap.listingCount),
                " ",
                "listings"
              ] }),
              ((_a = snap.notes) == null ? void 0 : _a[0]) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1 truncate", children: snap.notes[0] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 ml-4 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  "data-ocid": `admin.data_snapshots.download_button.${i + 1}`,
                  type: "button",
                  onClick: () => downloadSnapshot(snap.id),
                  className: "p-2 bg-muted hover:bg-muted/70 rounded-lg transition-colors",
                  title: "Download snapshot as JSON",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 text-foreground" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  "data-ocid": `admin.data_snapshots.restore_button.${i + 1}`,
                  type: "button",
                  onClick: () => restoreSnapshot(snap.id),
                  className: "p-2 bg-destructive/80 hover:bg-destructive rounded-lg transition-colors",
                  title: "Restore from snapshot",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-4 w-4 text-destructive-foreground" })
                }
              )
            ] })
          ]
        },
        snap.id
      );
    }) })
  ] });
}
export {
  AdminDataSnapshotsPage
};

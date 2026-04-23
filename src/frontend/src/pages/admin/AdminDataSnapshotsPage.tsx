import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Download, RotateCcw } from "lucide-react";
import { useState } from "react";
import { createActor } from "../../backend";

export function AdminDataSnapshotsPage() {
  const { actor } = useActor(createActor);
  const [searchFilter, setSearchFilter] = useState<"auto" | "manual" | "all">(
    "all",
  );

  const { data: index } = useQuery({
    queryKey: ["versionBackupIndex"],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      return await (actor as any).getVersionBackupIndex();
    },
    enabled: !!actor,
  });

  const { data: snapshots = [], isLoading: snapshotsLoading } = useQuery({
    queryKey: ["versionSnapshots", searchFilter],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const filter = searchFilter === "all" ? [] : [searchFilter];
      return await (actor as any).searchVersionSnapshots(filter, [], []);
    },
    enabled: !!actor,
  });

  const downloadSnapshot = async (snapshotId: string) => {
    if (!actor) return;
    try {
      const result = await (actor as any).downloadDataSnapshot(snapshotId);
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

  const restoreSnapshot = async (snapshotId: string) => {
    if (
      !actor ||
      !window.confirm(
        "Restore from this snapshot? Current data will be backed up first.",
      )
    )
      return;
    try {
      const result = await (actor as any).restoreFromVersionBackupWithSafety(
        snapshotId,
      );
      if (result.success) {
        window.alert(
          `Restored ${result.usersRestored} users, ${result.listingsRestored} listings`,
        );
      } else {
        window.alert(
          `Restore failed: ${result.errorMessage?.[0] ?? "Unknown error"}`,
        );
      }
    } catch (err) {
      console.error("Restore failed:", err);
    }
  };

  return (
    <div className="space-y-6 p-6" data-ocid="admin.data_snapshots.page">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Data Snapshots</h1>
        <p className="text-muted-foreground mt-2">
          Version snapshots double as complete data backups for restore and
          debugging
        </p>
      </div>

      {index && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border p-4 rounded-lg">
            <div className="text-muted-foreground text-sm">Total Snapshots</div>
            <div className="text-2xl font-bold text-foreground">
              {Number(index.totalSnapshots)}
            </div>
          </div>
          <div className="bg-card border border-border p-4 rounded-lg">
            <div className="text-muted-foreground text-sm">Auto Snapshots</div>
            <div className="text-2xl font-bold text-foreground">
              {Number(index.autoSnapshots)}
            </div>
          </div>
          <div className="bg-card border border-border p-4 rounded-lg">
            <div className="text-muted-foreground text-sm">
              Manual Snapshots
            </div>
            <div className="text-2xl font-bold text-foreground">
              {Number(index.manualSnapshots)}
            </div>
          </div>
          <div className="bg-card border border-border p-4 rounded-lg">
            <div className="text-muted-foreground text-sm">Total Size</div>
            <div className="text-2xl font-bold text-foreground">
              {(Number(index.totalDataSize) / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2" data-ocid="admin.data_snapshots.filter">
        {(["all", "auto", "manual"] as const).map((filter) => (
          <button
            key={filter}
            data-ocid={`admin.data_snapshots.filter.${filter}`}
            type="button"
            onClick={() => setSearchFilter(filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              searchFilter === filter
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {filter === "all" ? "All" : filter === "auto" ? "Auto" : "Manual"}
          </button>
        ))}
      </div>

      <div className="space-y-3" data-ocid="admin.data_snapshots.list">
        {snapshotsLoading ? (
          <div
            className="text-muted-foreground py-8 text-center"
            data-ocid="admin.data_snapshots.loading_state"
          >
            Loading snapshots...
          </div>
        ) : (snapshots as any[]).length === 0 ? (
          <div
            className="text-muted-foreground py-8 text-center"
            data-ocid="admin.data_snapshots.empty_state"
          >
            No snapshots found
          </div>
        ) : (
          (snapshots as any[]).map((snap, i) => (
            <div
              key={snap.id}
              data-ocid={`admin.data_snapshots.item.${i + 1}`}
              className="bg-card border border-border p-4 rounded-lg flex items-center justify-between hover:bg-accent/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="font-mono text-sm text-foreground truncate">
                  {String(snap.id).slice(0, 16)}…
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {new Date(
                    Number(snap.createdAt) / 1_000_000,
                  ).toLocaleString()}{" "}
                  • {Number(snap.userCount)} users • {Number(snap.listingCount)}{" "}
                  listings
                </div>
                {snap.notes?.[0] && (
                  <div className="text-xs text-muted-foreground mt-1 truncate">
                    {snap.notes[0]}
                  </div>
                )}
              </div>
              <div className="flex gap-2 ml-4 shrink-0">
                <button
                  data-ocid={`admin.data_snapshots.download_button.${i + 1}`}
                  type="button"
                  onClick={() => downloadSnapshot(snap.id)}
                  className="p-2 bg-muted hover:bg-muted/70 rounded-lg transition-colors"
                  title="Download snapshot as JSON"
                >
                  <Download className="h-4 w-4 text-foreground" />
                </button>
                <button
                  data-ocid={`admin.data_snapshots.restore_button.${i + 1}`}
                  type="button"
                  onClick={() => restoreSnapshot(snap.id)}
                  className="p-2 bg-destructive/80 hover:bg-destructive rounded-lg transition-colors"
                  title="Restore from snapshot"
                >
                  <RotateCcw className="h-4 w-4 text-destructive-foreground" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

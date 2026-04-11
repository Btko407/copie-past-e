import { MaintenanceBanner } from "@/components/MaintenanceBanner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAdminDeleteUser,
  useAdminListProfiles,
  useAdminResetAllSubscriptions,
  useAdminResetUserSubscription,
  useAssignUserRole,
  useListAllUsers,
} from "@/hooks/useAdminUsers";
import { useListVersionBackups } from "@/hooks/useAdminVersions";
import { useExportAllUsers, useExportUserData } from "@/hooks/useUserExport";
import type { UserSummary } from "@/types";
import type { VersionBackupSummary } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Download,
  Image,
  LayoutDashboard,
  Loader2,
  RefreshCcw,
  RotateCcw,
  Search,
  Shield,
  ShieldOff,
  Trash2,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { createActor } from "../../backend";
import type { UserProfile } from "../../backend.d";

type SortKey =
  | "username"
  | "role"
  | "registrationDate"
  | "lastLoginDate"
  | "listingCount"
  | "imageCount";

interface MergedUser {
  userId: string;
  username: string;
  role: string;
  registrationDate: bigint;
  lastLoginDate?: bigint;
  listingCount: bigint;
  imageCount: bigint;
}

type DialogState =
  | {
      type: "role";
      userId: string;
      username: string;
      newRole: string;
      label: string;
    }
  | { type: "reset-single"; username: string }
  | { type: "reset-all-confirm1" }
  | { type: "reset-all-confirm2" }
  | { type: "delete"; userId: string; username: string }
  | { type: "restore-account"; userId: string; username: string }
  | null;

function formatDate(ts: bigint | undefined) {
  if (!ts) return "—";
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function RoleBadge({ role }: { role: string }) {
  if (role === "admin") {
    return (
      <Badge
        variant="outline"
        className="font-mono text-[10px] uppercase tracking-widest text-accent border-accent/50 bg-accent/5 glow-yellow-sm"
      >
        <Shield className="w-2.5 h-2.5 mr-1" />
        Admin
      </Badge>
    );
  }
  if (role === "user") {
    return (
      <Badge
        variant="outline"
        className="font-mono text-[10px] uppercase tracking-widest text-primary border-primary/50 bg-primary/5"
      >
        User
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground border-border bg-muted/20"
    >
      Guest
    </Badge>
  );
}

function SortIcon({
  active,
  direction,
}: { active: boolean; direction: "asc" | "desc" }) {
  if (!active) return <ArrowUpDown className="w-3 h-3 opacity-40" />;
  return direction === "asc" ? (
    <ChevronUp className="w-3 h-3 text-primary" />
  ) : (
    <ChevronDown className="w-3 h-3 text-primary" />
  );
}

// ─── Restore Account Modal ────────────────────────────────────────────────────

interface RestoreAccountModalProps {
  userId: string;
  username: string;
  open: boolean;
  onClose: () => void;
}

function RestoreAccountModal({
  userId,
  username,
  open,
  onClose,
}: RestoreAccountModalProps) {
  const { actor } = useActor(createActor);
  const { data: backups = [], isLoading } = useListVersionBackups();
  const [selectedBackupId, setSelectedBackupId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const selectedBackup = backups.find((b) => b.id === selectedBackupId);

  async function handleRestore() {
    if (!actor || !selectedBackupId) return;
    setRestoring(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (actor as any).restoreUserAccountFromBackup(
        userId,
        selectedBackupId,
      );
      if (result?.__kind__ === "err") throw new Error(result.err);
      const msg = result?.ok ?? "Account restored successfully.";
      toast.success(`Restored ${username}`, { description: msg });
      onClose();
    } catch (err) {
      toast.error("Restore failed", {
        description: err instanceof Error ? err.message : "Unknown error.",
      });
    } finally {
      setRestoring(false);
      setConfirming(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-card border-primary/30 font-body max-w-lg w-full">
        <DialogHeader>
          <DialogTitle className="font-display text-sm uppercase tracking-wider text-primary text-glow-blue">
            Restore @{username} from backup
          </DialogTitle>
        </DialogHeader>

        {!confirming ? (
          <div className="space-y-4 mt-2">
            <p className="font-mono text-xs text-muted-foreground">
              Select a backup to restore this user's tier, subscription, and
              listings.
            </p>

            {isLoading ? (
              <div className="space-y-2">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-12 rounded-lg" />
                ))}
              </div>
            ) : backups.length === 0 ? (
              <p className="font-mono text-xs text-muted-foreground py-4 text-center">
                No backups available.
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {backups.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBackupId(b.id)}
                    className={[
                      "w-full text-left rounded-lg border px-3 py-3 transition-smooth focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
                      selectedBackupId === b.id
                        ? "border-primary/60 bg-primary/10"
                        : "border-border/40 bg-card/60 hover:border-primary/30",
                    ].join(" ")}
                    data-ocid={`restore-backup-option-${b.id}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs text-foreground">
                        {formatDate(b.createdAt)}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`font-mono text-[10px] px-1.5 ${
                            b.backupType === "manual"
                              ? "border-accent/50 text-accent bg-accent/5"
                              : "border-border/40 text-muted-foreground"
                          }`}
                        >
                          {b.backupType}
                        </Badge>
                        {b.isStable && (
                          <Badge
                            variant="outline"
                            className="font-mono text-[10px] px-1.5 border-green-500/40 text-green-500 bg-green-500/5"
                          >
                            ★ stable
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-1.5">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {Number(b.userCount)} users
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {Number(b.listingCount)} listings
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {b.versionLabel}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="font-mono text-xs flex-1"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={!selectedBackupId}
                onClick={() => setConfirming(true)}
                className="font-mono text-xs flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                data-ocid="restore-account-next-btn"
              >
                Next
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 mt-2">
            <div className="rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 space-y-1">
              <p className="font-display text-xs tracking-widest uppercase text-accent">
                ⚡ Confirm Restore
              </p>
              <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                This will restore{" "}
                <span className="text-foreground font-bold">@{username}</span>'s
                tier, subscription, and listings to their state at{" "}
                <span className="text-foreground font-bold">
                  {selectedBackup ? formatDate(selectedBackup.createdAt) : "—"}
                </span>
                . Current state will be auto-saved first.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirming(false)}
                className="font-mono text-xs flex-1"
              >
                Back
              </Button>
              <Button
                size="sm"
                disabled={restoring}
                onClick={handleRestore}
                className="font-mono text-xs flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                data-ocid="confirm-restore-account-btn"
              >
                {restoring ? (
                  <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                ) : (
                  <RotateCcw className="w-3 h-3 mr-1.5" />
                )}
                {restoring ? "Restoring…" : "Restore"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/** Mobile card view for a single user row */
function UserCard({
  user,
  isAdmin,
  isLastAdmin,
  onRoleDialog,
  onResetDialog,
  onDeleteDialog,
  onRestoreDialog,
}: {
  user: MergedUser;
  isAdmin: boolean;
  isLastAdmin: boolean;
  adminCount?: number;
  onRoleDialog: () => void;
  onResetDialog: () => void;
  onDeleteDialog: () => void;
  onRestoreDialog: () => void;
}) {
  return (
    <div
      className="rounded-lg bg-card/60 border border-border/50 p-4 space-y-3"
      data-ocid="user-card-mobile"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-sm text-primary font-bold truncate">
          @{user.username}
        </span>
        <RoleBadge role={user.role} />
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div>
          <p className="text-muted-foreground text-[10px] uppercase tracking-widest">
            Registered
          </p>
          <p className="text-foreground mt-0.5">
            {formatDate(user.registrationDate)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-[10px] uppercase tracking-widest">
            Last Login
          </p>
          <p className="text-foreground mt-0.5">
            {user.lastLoginDate ? formatDate(user.lastLoginDate) : "—"}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-[10px] uppercase tracking-widest">
            Listings
          </p>
          <p className="text-primary mt-0.5 flex items-center gap-1">
            <LayoutDashboard className="w-3 h-3" />
            {user.listingCount.toString()}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-[10px] uppercase tracking-widest">
            Images
          </p>
          <p className="text-accent mt-0.5 flex items-center gap-1">
            <Image className="w-3 h-3" />
            {user.imageCount.toString()}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {isLastAdmin ? (
          <Button
            variant="outline"
            size="sm"
            disabled
            className="font-mono text-[10px] h-9 border-border/30 text-muted-foreground/40 cursor-not-allowed flex-1"
          >
            <ShieldOff className="w-3 h-3 mr-1" />
            Last Admin
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={onRoleDialog}
            className={[
              "font-mono text-[10px] h-9 transition-smooth flex-1",
              isAdmin
                ? "border-destructive/40 text-destructive hover:bg-destructive/10"
                : "border-accent/40 text-accent hover:bg-accent/10",
            ].join(" ")}
            data-ocid={`role-toggle-mobile-${user.username}`}
          >
            {isAdmin ? (
              <ShieldOff className="w-3 h-3 mr-1" />
            ) : (
              <Shield className="w-3 h-3 mr-1" />
            )}
            {isAdmin ? "Revoke Admin" : "Make Admin"}
          </Button>
        )}
        {!isAdmin && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetDialog}
            className="font-mono text-[10px] h-9 border-destructive/40 text-destructive hover:bg-destructive/10 transition-smooth flex-1"
            data-ocid={`reset-sub-mobile-${user.username}`}
          >
            <RefreshCcw className="w-3 h-3 mr-1" />
            Reset Sub
          </Button>
        )}
        {!isAdmin && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRestoreDialog}
            className="font-mono text-[10px] h-9 border-primary/40 text-primary hover:bg-primary/10 transition-smooth w-full"
            data-ocid={`restore-account-mobile-${user.username}`}
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Restore Account
          </Button>
        )}
        {!isAdmin && (
          <Button
            variant="outline"
            size="sm"
            onClick={onDeleteDialog}
            className="font-mono text-[10px] h-9 bg-red-600 border-red-600 text-white hover:bg-red-700 hover:border-red-700 transition-smooth w-full"
            data-ocid={`delete-user-mobile-${user.username}`}
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Delete Account
          </Button>
        )}
      </div>
    </div>
  );
}

export function AdminUsersPage() {
  const { data: userSummaries = [], isLoading: summaryLoading } =
    useListAllUsers();
  const { data: profiles = [], isLoading: profilesLoading } =
    useAdminListProfiles();
  const assignRole = useAssignUserRole();
  const resetUserSub = useAdminResetUserSubscription();
  const resetAllSubs = useAdminResetAllSubscriptions();
  const deleteUser = useAdminDeleteUser();
  const exportUser = useExportUserData();
  const exportAll = useExportAllUsers();

  const isLoading = summaryLoading || profilesLoading;

  // Local deleted user IDs so row disappears immediately after deletion
  const [deletedUserIds, setDeletedUserIds] = useState<Set<string>>(new Set());

  const users = useMemo<MergedUser[]>(() => {
    const summaryMap = new Map<string, UserSummary>();
    for (const s of userSummaries) {
      summaryMap.set(s.userId, s);
    }
    return profiles
      .filter((p: UserProfile) => !deletedUserIds.has(p.userId.toString()))
      .map((p: UserProfile) => {
        const uid = p.userId.toString();
        const summary = summaryMap.get(uid);
        return {
          userId: uid,
          username: p.username || "—",
          role: p.role,
          registrationDate: p.createdAt,
          lastLoginDate: summary?.lastLoginDate,
          listingCount: summary?.listingCount ?? BigInt(0),
          imageCount: summary?.imageCount ?? BigInt(0),
        };
      });
  }, [profiles, userSummaries, deletedUserIds]);

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("registrationDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [dialog, setDialog] = useState<DialogState>(null);

  // Restore account modal state — separate from AlertDialog to allow list
  const [restoreModal, setRestoreModal] = useState<{
    userId: string;
    username: string;
  } | null>(null);

  const adminCount = users.filter((u) => u.role === "admin").length;
  const nonAdminCount = users.filter((u) => u.role !== "admin").length;

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function getSortValue(
    user: MergedUser,
    key: SortKey,
  ): string | number | bigint {
    if (key === "registrationDate") return user.registrationDate;
    if (key === "lastLoginDate") return user.lastLoginDate ?? BigInt(0);
    if (key === "listingCount") return user.listingCount;
    if (key === "imageCount") return user.imageCount;
    if (key === "username") return user.username.toLowerCase();
    if (key === "role") return user.role;
    return "";
  }

  const filtered = users
    .filter((u) =>
      search.trim()
        ? u.username.toLowerCase().includes(search.toLowerCase())
        : true,
    )
    .sort((a, b) => {
      const av = getSortValue(a, sortKey);
      const bv = getSortValue(b, sortKey);
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  async function handleConfirmDialog() {
    if (!dialog) return;

    if (dialog.type === "role") {
      try {
        await assignRole.mutateAsync({
          userId: dialog.userId,
          role: dialog.newRole,
        });
        toast.success("Role updated", {
          description: `${dialog.username}'s role changed to ${dialog.newRole}.`,
        });
      } catch {
        toast.error("Update failed", {
          description: "Could not change user role.",
        });
      } finally {
        setDialog(null);
      }
      return;
    }

    if (dialog.type === "reset-single") {
      try {
        await resetUserSub.mutateAsync({ username: dialog.username });
        toast.success("Subscription reset.", {
          description:
            "All listings moved to archive. 30-day delete clock started.",
        });
      } catch (err) {
        toast.error("Reset failed", {
          description:
            err instanceof Error
              ? err.message
              : "Could not reset subscription.",
        });
      } finally {
        setDialog(null);
      }
      return;
    }

    if (dialog.type === "reset-all-confirm1") {
      setDialog({ type: "reset-all-confirm2" });
      return;
    }

    if (dialog.type === "reset-all-confirm2") {
      try {
        const msg = await resetAllSubs.mutateAsync();
        toast.success(msg || "All subscriptions reset.", {
          description: "All non-admin listings moved to archive.",
        });
      } catch (err) {
        toast.error("Reset failed", {
          description:
            err instanceof Error
              ? err.message
              : "Could not reset subscriptions.",
        });
      } finally {
        setDialog(null);
      }
      return;
    }

    if (dialog.type === "delete") {
      try {
        await deleteUser.mutateAsync({
          userId: dialog.userId,
          username: dialog.username,
        });
        // Remove the row immediately from local state
        setDeletedUserIds((prev) => new Set([...prev, dialog.userId]));
        toast.success("Account deleted", {
          description: `@${dialog.username}'s account and all associated data have been removed.`,
        });
      } catch (err) {
        toast.error("Delete failed", {
          description:
            err instanceof Error ? err.message : "Could not delete account.",
        });
      } finally {
        setDialog(null);
      }
    }
  }

  const isPending =
    assignRole.isPending ||
    resetUserSub.isPending ||
    resetAllSubs.isPending ||
    deleteUser.isPending;

  const COLS: { key: SortKey; label: string }[] = [
    { key: "username", label: "Username" },
    { key: "role", label: "Role" },
    { key: "registrationDate", label: "Registered" },
    { key: "lastLoginDate", label: "Last Login" },
    { key: "listingCount", label: "Listings" },
    { key: "imageCount", label: "Images" },
  ];

  return (
    <AdminLayout title="Users" subtitle="Management">
      {/* Maintenance banner reminder */}
      <MaintenanceBanner />

      {/* Header row */}
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-sm font-bold tracking-wider uppercase text-foreground">
            User Management
          </h2>
          {!isLoading && (
            <Badge
              variant="outline"
              className="font-mono text-[10px] text-primary border-primary/50 bg-primary/5"
              data-ocid="user-count-badge"
            >
              <Users className="w-2.5 h-2.5 mr-1" />
              {users.length} users
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Filter by username…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 font-mono text-xs bg-secondary/30 border-primary/30 focus:border-primary/60 w-full sm:w-64 h-10 min-h-[44px]"
              data-ocid="user-search-input"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              try {
                await exportAll.mutateAsync();
                toast.success("Export downloaded", {
                  description: "All user data packaged and downloaded.",
                });
              } catch (err) {
                toast.error(
                  err instanceof Error ? err.message : "Export failed.",
                );
              }
            }}
            disabled={exportAll.isPending}
            className="font-mono text-[10px] h-10 min-h-[44px] border-primary/40 text-primary hover:bg-primary/10 transition-smooth whitespace-nowrap"
            data-ocid="export-all-users-btn"
          >
            {exportAll.isPending ? (
              <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
            ) : (
              <Download className="w-3 h-3 mr-1.5" />
            )}
            Export All Users
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDialog({ type: "reset-all-confirm1" })}
            className="font-mono text-[10px] h-10 min-h-[44px] border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive transition-smooth whitespace-nowrap"
            data-ocid="reset-all-subscriptions-btn"
          >
            <RefreshCcw className="w-3 h-3 mr-1.5" />
            Reset All
          </Button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block rounded-xl bg-card neon-border-blue overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 rounded" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-primary/20 hover:bg-transparent">
                  {COLS.map(({ key, label }) => (
                    <TableHead
                      key={key}
                      onClick={() => toggleSort(key)}
                      className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-smooth select-none whitespace-nowrap"
                    >
                      <span className="flex items-center gap-1">
                        {label}
                        <SortIcon
                          active={sortKey === key}
                          direction={sortDir}
                        />
                      </span>
                    </TableHead>
                  ))}
                  <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center font-mono text-xs text-muted-foreground py-12"
                      data-ocid="users-empty-state"
                    >
                      No users match your search
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((user) => {
                    const isAdmin = user.role === "admin";
                    const isLastAdmin = isAdmin && adminCount <= 1;

                    return (
                      <TableRow
                        key={user.userId}
                        className="border-primary/10 hover:bg-primary/5 transition-smooth"
                        data-ocid="user-row"
                      >
                        <TableCell className="font-mono text-xs text-foreground max-w-[160px]">
                          <span className="truncate block text-primary">
                            @{user.username}
                          </span>
                        </TableCell>
                        <TableCell>
                          <RoleBadge role={user.role} />
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(user.registrationDate)}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                          {user.lastLoginDate
                            ? formatDate(user.lastLoginDate)
                            : "—"}
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1 font-mono text-xs text-primary">
                            <LayoutDashboard className="w-3 h-3" />
                            {user.listingCount.toString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1 font-mono text-xs text-accent">
                            <Image className="w-3 h-3" />
                            {user.imageCount.toString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {isLastAdmin ? (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled
                                className="font-mono text-[10px] h-7 border-border/30 text-muted-foreground/40 cursor-not-allowed"
                              >
                                <ShieldOff className="w-3 h-3 mr-1" />
                                Last Admin
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setDialog({
                                    type: "role",
                                    userId: user.userId,
                                    username: user.username,
                                    newRole: isAdmin ? "user" : "admin",
                                    label: isAdmin
                                      ? "Revoke Admin"
                                      : "Make Admin",
                                  })
                                }
                                className={[
                                  "font-mono text-[10px] h-7 transition-smooth",
                                  isAdmin
                                    ? "border-destructive/40 text-destructive hover:bg-destructive/10"
                                    : "border-accent/40 text-accent hover:bg-accent/10",
                                ].join(" ")}
                                data-ocid={`role-toggle-${user.username}`}
                              >
                                {isAdmin ? (
                                  <ShieldOff className="w-3 h-3 mr-1" />
                                ) : (
                                  <Shield className="w-3 h-3 mr-1" />
                                )}
                                {isAdmin ? "Revoke Admin" : "Make Admin"}
                              </Button>
                            )}

                            {!isAdmin && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setDialog({
                                    type: "reset-single",
                                    username: user.username,
                                  })
                                }
                                className="font-mono text-[10px] h-7 border-destructive/40 text-destructive hover:bg-destructive/10 transition-smooth"
                                data-ocid={`reset-sub-${user.username}`}
                              >
                                <RefreshCcw className="w-3 h-3 mr-1" />
                                Reset Sub
                              </Button>
                            )}

                            {/* Restore Account from Backup */}
                            {!isAdmin && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setRestoreModal({
                                    userId: user.userId,
                                    username: user.username,
                                  })
                                }
                                className="font-mono text-[10px] h-7 border-primary/40 text-primary hover:bg-primary/10 transition-smooth"
                                data-ocid={`restore-account-${user.username}`}
                              >
                                <RotateCcw className="w-3 h-3 mr-1" />
                                Restore
                              </Button>
                            )}

                            {/* Delete Account — only for non-admin users */}
                            {!isAdmin && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setDialog({
                                    type: "delete",
                                    userId: user.userId,
                                    username: user.username,
                                  })
                                }
                                className="font-mono text-[10px] h-7 bg-red-600 border-red-600 text-white hover:bg-red-700 hover:border-red-700 transition-smooth"
                                data-ocid={`delete-user-${user.username}`}
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Delete
                              </Button>
                            )}
                            {/* Export User Data */}
                            {!isAdmin && (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={exportUser.isPending}
                                onClick={async () => {
                                  try {
                                    await exportUser.mutateAsync({
                                      userId: user.userId,
                                      username: user.username,
                                    });
                                    toast.success("Export downloaded");
                                  } catch (err) {
                                    toast.error(
                                      err instanceof Error
                                        ? err.message
                                        : "Export failed.",
                                    );
                                  }
                                }}
                                className="font-mono text-[10px] h-7 border-primary/40 text-primary hover:bg-primary/10 transition-smooth"
                                data-ocid={`export-user-${user.username}`}
                              >
                                {exportUser.isPending ? (
                                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                ) : (
                                  <Download className="w-3 h-3 mr-1" />
                                )}
                                Export
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Mobile Card List */}
      <div className="sm:hidden space-y-3">
        {isLoading ? (
          [0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-36 rounded-lg" />
          ))
        ) : filtered.length === 0 ? (
          <div
            className="rounded-xl bg-card neon-border-blue p-8 text-center"
            data-ocid="users-empty-state"
          >
            <p className="font-mono text-xs text-muted-foreground">
              No users match your search
            </p>
          </div>
        ) : (
          filtered.map((user) => {
            const isAdmin = user.role === "admin";
            const isLastAdmin = isAdmin && adminCount <= 1;
            return (
              <UserCard
                key={user.userId}
                user={user}
                isAdmin={isAdmin}
                isLastAdmin={isLastAdmin}
                onRoleDialog={() =>
                  setDialog({
                    type: "role",
                    userId: user.userId,
                    username: user.username,
                    newRole: isAdmin ? "user" : "admin",
                    label: isAdmin ? "Revoke Admin" : "Make Admin",
                  })
                }
                onResetDialog={() =>
                  setDialog({ type: "reset-single", username: user.username })
                }
                onDeleteDialog={() =>
                  setDialog({
                    type: "delete",
                    userId: user.userId,
                    username: user.username,
                  })
                }
                onRestoreDialog={() =>
                  setRestoreModal({
                    userId: user.userId,
                    username: user.username,
                  })
                }
              />
            );
          })
        )}
      </div>

      {/* ── Restore Account Modal ── */}
      {restoreModal && (
        <RestoreAccountModal
          userId={restoreModal.userId}
          username={restoreModal.username}
          open={!!restoreModal}
          onClose={() => setRestoreModal(null)}
        />
      )}

      {/* ── Dialogs ── */}
      <AlertDialog
        open={dialog?.type === "role"}
        onOpenChange={(open) => !open && setDialog(null)}
      >
        <AlertDialogContent className="bg-card border-primary/30 font-body">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-sm uppercase tracking-wider text-primary text-glow-blue">
              {dialog?.type === "role" ? dialog.label : ""}
            </AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-xs text-muted-foreground">
              Change role for{" "}
              <span className="text-foreground font-bold">
                @{dialog?.type === "role" ? dialog.username : ""}
              </span>{" "}
              to{" "}
              <span className="text-accent font-bold">
                {dialog?.type === "role" ? dialog.newRole : ""}
              </span>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono text-xs">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDialog}
              className="font-mono text-xs"
              disabled={isPending}
            >
              {isPending ? "Updating…" : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={dialog?.type === "reset-single"}
        onOpenChange={(open) => !open && setDialog(null)}
      >
        <AlertDialogContent className="bg-card border-destructive/40 font-body">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-sm uppercase tracking-wider text-destructive">
              Reset Subscription
            </AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-xs text-muted-foreground">
              Reset{" "}
              <span className="text-foreground font-bold">
                @{dialog?.type === "reset-single" ? dialog.username : ""}
              </span>
              's subscription to zero? This will immediately archive all their
              active listings.{" "}
              <span className="text-destructive font-semibold">
                This cannot be undone.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono text-xs">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDialog}
              disabled={isPending}
              className="font-mono text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? "Resetting…" : "Reset"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={dialog?.type === "reset-all-confirm1"}
        onOpenChange={(open) => !open && setDialog(null)}
      >
        <AlertDialogContent className="bg-card border-destructive/40 font-body">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-sm uppercase tracking-wider text-destructive">
              Reset All Subscriptions
            </AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-xs text-muted-foreground">
              Are you sure? This will reset{" "}
              <span className="text-foreground font-bold">
                ALL {nonAdminCount} non-admin
              </span>{" "}
              user subscriptions to zero and immediately archive all their
              active listings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono text-xs">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDialog}
              className="font-mono text-xs bg-destructive/80 text-destructive-foreground hover:bg-destructive"
              data-ocid="reset-all-confirm1-btn"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={dialog?.type === "reset-all-confirm2"}
        onOpenChange={(open) => !open && setDialog(null)}
      >
        <AlertDialogContent className="bg-card border-destructive/60 font-body">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-sm uppercase tracking-wider text-destructive">
              Final Confirmation
            </AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-xs text-muted-foreground">
              This will reset{" "}
              <span className="text-destructive font-bold">
                ALL {nonAdminCount} non-admin users
              </span>
              . All their listings will be archived and the 30-day delete clock
              will start.{" "}
              <span className="text-destructive font-semibold">
                This cannot be undone.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono text-xs">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDialog}
              disabled={isPending}
              className="font-mono text-[10px] bg-destructive text-destructive-foreground hover:bg-red-800 border-0"
              data-ocid="reset-all-confirm2-btn"
            >
              {isPending ? "Resetting…" : "Reset All (cannot be undone)"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Delete Account Dialog ── */}
      <AlertDialog
        open={dialog?.type === "delete"}
        onOpenChange={(open) => !open && setDialog(null)}
      >
        <AlertDialogContent className="bg-card border-red-600/50 font-body">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-sm uppercase tracking-wider text-red-500">
              Delete Account
            </AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="text-foreground font-bold">
                @{dialog?.type === "delete" ? dialog.username : ""}
              </span>
              's account? This will permanently delete all their listings,
              images, notifications, and cancel their Stripe subscription.{" "}
              <span className="text-red-500 font-semibold">
                This cannot be undone.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono text-xs">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDialog}
              disabled={isPending}
              className="font-mono text-xs bg-red-600 text-white hover:bg-red-700 border-0"
              data-ocid="confirm-delete-user-btn"
            >
              {isPending ? "Deleting…" : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}

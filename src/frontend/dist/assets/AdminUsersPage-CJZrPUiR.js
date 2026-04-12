import { c as createLucideIcon, f as useActor, h as useMutation, i as createActor, r as reactExports, j as jsxRuntimeExports, M as MaintenanceBanner, I as Input, B as Button, a as ue, S as Skeleton, q as Shield } from "./index-C4SV0eZt.js";
import { A as AdminLayout, U as Users, L as LayoutDashboard } from "./AdminLayout-xk085F_3.js";
import { A as AlertDialog, b as AlertDialogContent, c as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./alert-dialog-rzvO0WmO.js";
import { B as Badge } from "./badge-BklfFr65.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-RYuMh8lJ.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-ClBz_VdI.js";
import { u as useListAllUsers, a as useAdminListProfiles, b as useAssignUserRole, c as useAdminResetUserSubscription, d as useAdminResetAllSubscriptions, e as useAdminDeleteUser } from "./useAdminUsers-CQIeyJwI.js";
import { b as useListVersionBackups } from "./useAdminVersions-DrRJ7ETh.js";
import { J as JSZip } from "./jszip.min-DzDIeDto.js";
import { S as Search } from "./search-CIIwGbBo.js";
import { L as LoaderCircle } from "./loader-circle-DxFOWx3f.js";
import { D as Download } from "./download-D_Nvr-2s.js";
import { R as RefreshCcw } from "./refresh-ccw-CnSfesMi.js";
import { I as Image } from "./image-T29oXYiB.js";
import { R as RotateCcw } from "./rotate-ccw-DHGkXWlJ.js";
import { T as Trash2 } from "./trash-2-CqtURlKD.js";
import { A as ArrowUpDown } from "./arrow-up-down-Bxx-m92J.js";
import { C as ChevronUp } from "./chevron-up-D_DjVKt6.js";
import { C as ChevronDown } from "./chevron-down-DMyKGXDo.js";
import "./credit-card-DLZkuiPX.js";
import "./index-_OZlumP_.js";
import "./index-doj5GH7L.js";
import "./index-RhLjeo9T.js";
import "./index-Ca5pRRPb.js";
import "./index-1keNSzgr.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  [
    "path",
    {
      d: "M5 5a1 1 0 0 0-1 1v7c0 5 3.5 7.5 7.67 8.94a1 1 0 0 0 .67.01c2.35-.82 4.48-1.97 5.9-3.71",
      key: "1jlk70"
    }
  ],
  [
    "path",
    {
      d: "M9.309 3.652A12.252 12.252 0 0 0 11.24 2.28a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v7a9.784 9.784 0 0 1-.08 1.264",
      key: "18rp1v"
    }
  ]
];
const ShieldOff = createLucideIcon("shield-off", __iconNode);
async function assembleUserZip(_username, data, onProgress) {
  const zip = new JSZip();
  zip.file("user-data.json", data.jsonData);
  const total = data.imageUrls.length;
  for (let i = 0; i < total; i++) {
    const url = data.imageUrls[i];
    try {
      const res = await fetch(url);
      if (res.ok) {
        const buf = await res.arrayBuffer();
        const ext = url.split("?")[0].split(".").pop() ?? "jpg";
        zip.file(`images/image-${i + 1}.${ext}`, buf);
      }
    } catch {
    }
  }
  return zip.generateAsync({ type: "blob" });
}
function useExportUserData() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async ({ userId, username }) => {
      if (!actor) throw new Error("Actor not ready");
      const a = actor;
      if (typeof a.exportUserData !== "function") {
        throw new Error("Export not supported by this backend version.");
      }
      const raw = await a.exportUserData(userId);
      let data = null;
      if (!raw) throw new Error("No data found for this user.");
      if ("__kind__" in raw) {
        if (raw.__kind__ === "Some") data = raw.value;
        else throw new Error("No data found for this user.");
      } else {
        data = raw;
      }
      if (!data) throw new Error("No data found for this user.");
      const blob = await assembleUserZip(username, data);
      const url = URL.createObjectURL(blob);
      const el = document.createElement("a");
      el.href = url;
      el.download = `${username}-export-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.zip`;
      el.click();
      URL.revokeObjectURL(url);
    }
  });
}
function useExportAllUsers() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const a = actor;
      if (typeof a.exportAllUsersData !== "function") {
        throw new Error(
          "Export all users not supported by this backend version."
        );
      }
      const raw = await a.exportAllUsersData();
      if (!raw) throw new Error("No data returned from export.");
      const zip = new JSZip();
      zip.file("all-users.json", raw.jsonData);
      const total = raw.imageUrls.length;
      for (let i = 0; i < total; i++) {
        const url = raw.imageUrls[i];
        try {
          const res = await fetch(url);
          if (res.ok) {
            const buf = await res.arrayBuffer();
            const ext = url.split("?")[0].split(".").pop() ?? "jpg";
            zip.file(`images/image-${i + 1}.${ext}`, buf);
          }
        } catch {
        }
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const objectUrl = URL.createObjectURL(blob);
      const el = document.createElement("a");
      el.href = objectUrl;
      el.download = `all-users-export-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.zip`;
      el.click();
      URL.revokeObjectURL(objectUrl);
    }
  });
}
function formatDate(ts) {
  if (!ts) return "—";
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function RoleBadge({ role }) {
  if (role === "admin") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Badge,
      {
        variant: "outline",
        className: "font-mono text-[10px] uppercase tracking-widest text-accent border-accent/50 bg-accent/5 glow-yellow-sm",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-2.5 h-2.5 mr-1" }),
          "Admin"
        ]
      }
    );
  }
  if (role === "user") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Badge,
      {
        variant: "outline",
        className: "font-mono text-[10px] uppercase tracking-widest text-primary border-primary/50 bg-primary/5",
        children: "User"
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Badge,
    {
      variant: "outline",
      className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground border-border bg-muted/20",
      children: "Guest"
    }
  );
}
function SortIcon({
  active,
  direction
}) {
  if (!active) return /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "w-3 h-3 opacity-40" });
  return direction === "asc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-3 h-3 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3 h-3 text-primary" });
}
function RestoreAccountModal({
  userId,
  username,
  open,
  onClose
}) {
  const { actor } = useActor(createActor);
  const { data: backups = [], isLoading } = useListVersionBackups();
  const [selectedBackupId, setSelectedBackupId] = reactExports.useState(null);
  const [confirming, setConfirming] = reactExports.useState(false);
  const [restoring, setRestoring] = reactExports.useState(false);
  const selectedBackup = backups.find((b) => b.id === selectedBackupId);
  async function handleRestore() {
    if (!actor || !selectedBackupId) return;
    setRestoring(true);
    try {
      const result = await actor.restoreUserAccountFromBackup(
        userId,
        selectedBackupId
      );
      if ((result == null ? void 0 : result.__kind__) === "err") throw new Error(result.err);
      const msg = (result == null ? void 0 : result.ok) ?? "Account restored successfully.";
      ue.success(`Restored ${username}`, { description: msg });
      onClose();
    } catch (err) {
      ue.error("Restore failed", {
        description: err instanceof Error ? err.message : "Unknown error."
      });
    } finally {
      setRestoring(false);
      setConfirming(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-card border-primary/30 font-body max-w-lg w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display text-sm uppercase tracking-wider text-primary text-glow-blue", children: [
      "Restore @",
      username,
      " from backup"
    ] }) }),
    !confirming ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: "Select a backup to restore this user's tier, subscription, and listings." }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-lg" }, i)) }) : backups.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground py-4 text-center", children: "No backups available." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-64 overflow-y-auto pr-1", children: backups.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setSelectedBackupId(b.id),
          className: [
            "w-full text-left rounded-lg border px-3 py-3 transition-smooth focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
            selectedBackupId === b.id ? "border-primary/60 bg-primary/10" : "border-border/40 bg-card/60 hover:border-primary/30"
          ].join(" "),
          "data-ocid": `restore-backup-option-${b.id}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-foreground", children: formatDate(b.createdAt) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: `font-mono text-[10px] px-1.5 ${b.backupType === "manual" ? "border-accent/50 text-accent bg-accent/5" : "border-border/40 text-muted-foreground"}`,
                    children: b.backupType
                  }
                ),
                b.isStable && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: "font-mono text-[10px] px-1.5 border-green-500/40 text-green-500 bg-green-500/5",
                    children: "★ stable"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mt-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] text-muted-foreground", children: [
                Number(b.userCount),
                " users"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] text-muted-foreground", children: [
                Number(b.listingCount),
                " listings"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground", children: b.versionLabel })
            ] })
          ]
        },
        b.id
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: onClose,
            className: "font-mono text-xs flex-1",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            disabled: !selectedBackupId,
            onClick: () => setConfirming(true),
            className: "font-mono text-xs flex-1 bg-primary text-primary-foreground hover:bg-primary/90",
            "data-ocid": "restore-account-next-btn",
            children: "Next"
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs tracking-widest uppercase text-accent", children: "⚡ Confirm Restore" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-muted-foreground leading-relaxed", children: [
          "This will restore",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-bold", children: [
            "@",
            username
          ] }),
          "'s tier, subscription, and listings to their state at",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-bold", children: selectedBackup ? formatDate(selectedBackup.createdAt) : "—" }),
          ". Current state will be auto-saved first."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setConfirming(false),
            className: "font-mono text-xs flex-1",
            children: "Back"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            disabled: restoring,
            onClick: handleRestore,
            className: "font-mono text-xs flex-1 bg-accent text-accent-foreground hover:bg-accent/90",
            "data-ocid": "confirm-restore-account-btn",
            children: [
              restoring ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3 h-3 mr-1.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-3 h-3 mr-1.5" }),
              restoring ? "Restoring…" : "Restore"
            ]
          }
        )
      ] })
    ] })
  ] }) });
}
function UserCard({
  user,
  isAdmin,
  isLastAdmin,
  onRoleDialog,
  onResetDialog,
  onDeleteDialog,
  onRestoreDialog
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-lg bg-card/60 border border-border/50 p-4 space-y-3",
      "data-ocid": "user-card-mobile",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-sm text-primary font-bold truncate", children: [
            "@",
            user.username
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(RoleBadge, { role: user.role })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 text-xs font-mono", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-[10px] uppercase tracking-widest", children: "Registered" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground mt-0.5", children: formatDate(user.registrationDate) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-[10px] uppercase tracking-widest", children: "Last Login" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground mt-0.5", children: user.lastLoginDate ? formatDate(user.lastLoginDate) : "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-[10px] uppercase tracking-widest", children: "Listings" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-primary mt-0.5 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "w-3 h-3" }),
              user.listingCount.toString()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-[10px] uppercase tracking-widest", children: "Images" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-accent mt-0.5 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-3 h-3" }),
              user.imageCount.toString()
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          isLastAdmin ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              disabled: true,
              className: "font-mono text-[10px] h-9 border-border/30 text-muted-foreground/40 cursor-not-allowed flex-1",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldOff, { className: "w-3 h-3 mr-1" }),
                "Last Admin"
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: onRoleDialog,
              className: [
                "font-mono text-[10px] h-9 transition-smooth flex-1",
                isAdmin ? "border-destructive/40 text-destructive hover:bg-destructive/10" : "border-accent/40 text-accent hover:bg-accent/10"
              ].join(" "),
              "data-ocid": `role-toggle-mobile-${user.username}`,
              children: [
                isAdmin ? /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldOff, { className: "w-3 h-3 mr-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-3 h-3 mr-1" }),
                isAdmin ? "Revoke Admin" : "Make Admin"
              ]
            }
          ),
          !isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: onResetDialog,
              className: "font-mono text-[10px] h-9 border-destructive/40 text-destructive hover:bg-destructive/10 transition-smooth flex-1",
              "data-ocid": `reset-sub-mobile-${user.username}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { className: "w-3 h-3 mr-1" }),
                "Reset Sub"
              ]
            }
          ),
          !isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: onRestoreDialog,
              className: "font-mono text-[10px] h-9 border-primary/40 text-primary hover:bg-primary/10 transition-smooth w-full",
              "data-ocid": `restore-account-mobile-${user.username}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-3 h-3 mr-1" }),
                "Restore Account"
              ]
            }
          ),
          !isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: onDeleteDialog,
              className: "font-mono text-[10px] h-9 bg-red-600 border-red-600 text-white hover:bg-red-700 hover:border-red-700 transition-smooth w-full",
              "data-ocid": `delete-user-mobile-${user.username}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3 mr-1" }),
                "Delete Account"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function AdminUsersPage() {
  const { data: userSummaries = [], isLoading: summaryLoading } = useListAllUsers();
  const { data: profiles = [], isLoading: profilesLoading } = useAdminListProfiles();
  const assignRole = useAssignUserRole();
  const resetUserSub = useAdminResetUserSubscription();
  const resetAllSubs = useAdminResetAllSubscriptions();
  const deleteUser = useAdminDeleteUser();
  const exportUser = useExportUserData();
  const exportAll = useExportAllUsers();
  const isLoading = summaryLoading || profilesLoading;
  const [deletedUserIds, setDeletedUserIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const users = reactExports.useMemo(() => {
    const summaryMap = /* @__PURE__ */ new Map();
    for (const s of userSummaries) {
      summaryMap.set(s.userId, s);
    }
    return profiles.filter((p) => !deletedUserIds.has(p.userId.toString())).map((p) => {
      const uid = p.userId.toString();
      const summary = summaryMap.get(uid);
      return {
        userId: uid,
        username: p.username || "—",
        role: p.role,
        registrationDate: p.createdAt,
        lastLoginDate: summary == null ? void 0 : summary.lastLoginDate,
        listingCount: (summary == null ? void 0 : summary.listingCount) ?? BigInt(0),
        imageCount: (summary == null ? void 0 : summary.imageCount) ?? BigInt(0)
      };
    });
  }, [profiles, userSummaries, deletedUserIds]);
  const [search, setSearch] = reactExports.useState("");
  const [sortKey, setSortKey] = reactExports.useState("registrationDate");
  const [sortDir, setSortDir] = reactExports.useState("desc");
  const [dialog, setDialog] = reactExports.useState(null);
  const [restoreModal, setRestoreModal] = reactExports.useState(null);
  const adminCount = users.filter((u) => u.role === "admin").length;
  const nonAdminCount = users.filter((u) => u.role !== "admin").length;
  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }
  function getSortValue(user, key) {
    if (key === "registrationDate") return user.registrationDate;
    if (key === "lastLoginDate") return user.lastLoginDate ?? BigInt(0);
    if (key === "listingCount") return user.listingCount;
    if (key === "imageCount") return user.imageCount;
    if (key === "username") return user.username.toLowerCase();
    if (key === "role") return user.role;
    return "";
  }
  const filtered = users.filter(
    (u) => search.trim() ? u.username.toLowerCase().includes(search.toLowerCase()) : true
  ).sort((a, b) => {
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
          role: dialog.newRole
        });
        ue.success("Role updated", {
          description: `${dialog.username}'s role changed to ${dialog.newRole}.`
        });
      } catch {
        ue.error("Update failed", {
          description: "Could not change user role."
        });
      } finally {
        setDialog(null);
      }
      return;
    }
    if (dialog.type === "reset-single") {
      try {
        await resetUserSub.mutateAsync({ username: dialog.username });
        ue.success("Subscription reset.", {
          description: "All listings moved to archive. 30-day delete clock started."
        });
      } catch (err) {
        ue.error("Reset failed", {
          description: err instanceof Error ? err.message : "Could not reset subscription."
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
        ue.success(msg || "All subscriptions reset.", {
          description: "All non-admin listings moved to archive."
        });
      } catch (err) {
        ue.error("Reset failed", {
          description: err instanceof Error ? err.message : "Could not reset subscriptions."
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
          username: dialog.username
        });
        setDeletedUserIds((prev) => /* @__PURE__ */ new Set([...prev, dialog.userId]));
        ue.success("Account deleted", {
          description: `@${dialog.username}'s account and all associated data have been removed.`
        });
      } catch (err) {
        ue.error("Delete failed", {
          description: err instanceof Error ? err.message : "Could not delete account."
        });
      } finally {
        setDialog(null);
      }
    }
  }
  const isPending = assignRole.isPending || resetUserSub.isPending || resetAllSubs.isPending || deleteUser.isPending;
  const COLS = [
    { key: "username", label: "Username" },
    { key: "role", label: "Role" },
    { key: "registrationDate", label: "Registered" },
    { key: "lastLoginDate", label: "Last Login" },
    { key: "listingCount", label: "Listings" },
    { key: "imageCount", label: "Images" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { title: "Users", subtitle: "Management", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(MaintenanceBanner, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 mb-6 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-bold tracking-wider uppercase text-foreground", children: "User Management" }),
        !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Badge,
          {
            variant: "outline",
            className: "font-mono text-[10px] text-primary border-primary/50 bg-primary/5",
            "data-ocid": "user-count-badge",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-2.5 h-2.5 mr-1" }),
              users.length,
              " users"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap w-full sm:w-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 sm:flex-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Filter by username…",
              value: search,
              onChange: (e) => setSearch(e.target.value),
              className: "pl-8 font-mono text-xs bg-secondary/30 border-primary/30 focus:border-primary/60 w-full sm:w-64 h-10 min-h-[44px]",
              "data-ocid": "user-search-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: async () => {
              try {
                await exportAll.mutateAsync();
                ue.success("Export downloaded", {
                  description: "All user data packaged and downloaded."
                });
              } catch (err) {
                ue.error(
                  err instanceof Error ? err.message : "Export failed."
                );
              }
            },
            disabled: exportAll.isPending,
            className: "font-mono text-[10px] h-10 min-h-[44px] border-primary/40 text-primary hover:bg-primary/10 transition-smooth whitespace-nowrap",
            "data-ocid": "export-all-users-btn",
            children: [
              exportAll.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3 h-3 mr-1.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3 h-3 mr-1.5" }),
              "Export All Users"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setDialog({ type: "reset-all-confirm1" }),
            className: "font-mono text-[10px] h-10 min-h-[44px] border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive transition-smooth whitespace-nowrap",
            "data-ocid": "reset-all-subscriptions-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { className: "w-3 h-3 mr-1.5" }),
              "Reset All"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden sm:block rounded-xl bg-card neon-border-blue overflow-hidden", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 space-y-3", children: [0, 1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 rounded" }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-primary/20 hover:bg-transparent", children: [
        COLS.map(({ key, label }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          TableHead,
          {
            onClick: () => toggleSort(key),
            className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-smooth select-none whitespace-nowrap",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              label,
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SortIcon,
                {
                  active: sortKey === key,
                  direction: sortDir
                }
              )
            ] })
          },
          key
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground whitespace-nowrap", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        TableCell,
        {
          colSpan: 7,
          className: "text-center font-mono text-xs text-muted-foreground py-12",
          "data-ocid": "users-empty-state",
          children: "No users match your search"
        }
      ) }) : filtered.map((user) => {
        const isAdmin = user.role === "admin";
        const isLastAdmin = isAdmin && adminCount <= 1;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableRow,
          {
            className: "border-primary/10 hover:bg-primary/5 transition-smooth",
            "data-ocid": "user-row",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs text-foreground max-w-[160px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate block text-primary", children: [
                "@",
                user.username
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(RoleBadge, { role: user.role }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs text-muted-foreground whitespace-nowrap", children: formatDate(user.registrationDate) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs text-muted-foreground whitespace-nowrap", children: user.lastLoginDate ? formatDate(user.lastLoginDate) : "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 font-mono text-xs text-primary", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "w-3 h-3" }),
                user.listingCount.toString()
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 font-mono text-xs text-accent", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-3 h-3" }),
                user.imageCount.toString()
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
                isLastAdmin ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    disabled: true,
                    className: "font-mono text-[10px] h-7 border-border/30 text-muted-foreground/40 cursor-not-allowed",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldOff, { className: "w-3 h-3 mr-1" }),
                      "Last Admin"
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => setDialog({
                      type: "role",
                      userId: user.userId,
                      username: user.username,
                      newRole: isAdmin ? "user" : "admin",
                      label: isAdmin ? "Revoke Admin" : "Make Admin"
                    }),
                    className: [
                      "font-mono text-[10px] h-7 transition-smooth",
                      isAdmin ? "border-destructive/40 text-destructive hover:bg-destructive/10" : "border-accent/40 text-accent hover:bg-accent/10"
                    ].join(" "),
                    "data-ocid": `role-toggle-${user.username}`,
                    children: [
                      isAdmin ? /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldOff, { className: "w-3 h-3 mr-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-3 h-3 mr-1" }),
                      isAdmin ? "Revoke Admin" : "Make Admin"
                    ]
                  }
                ),
                !isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => setDialog({
                      type: "reset-single",
                      username: user.username
                    }),
                    className: "font-mono text-[10px] h-7 border-destructive/40 text-destructive hover:bg-destructive/10 transition-smooth",
                    "data-ocid": `reset-sub-${user.username}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { className: "w-3 h-3 mr-1" }),
                      "Reset Sub"
                    ]
                  }
                ),
                !isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => setRestoreModal({
                      userId: user.userId,
                      username: user.username
                    }),
                    className: "font-mono text-[10px] h-7 border-primary/40 text-primary hover:bg-primary/10 transition-smooth",
                    "data-ocid": `restore-account-${user.username}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-3 h-3 mr-1" }),
                      "Restore"
                    ]
                  }
                ),
                !isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => setDialog({
                      type: "delete",
                      userId: user.userId,
                      username: user.username
                    }),
                    className: "font-mono text-[10px] h-7 bg-red-600 border-red-600 text-white hover:bg-red-700 hover:border-red-700 transition-smooth",
                    "data-ocid": `delete-user-${user.username}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3 mr-1" }),
                      "Delete"
                    ]
                  }
                ),
                !isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    disabled: exportUser.isPending,
                    onClick: async () => {
                      try {
                        await exportUser.mutateAsync({
                          userId: user.userId,
                          username: user.username
                        });
                        ue.success("Export downloaded");
                      } catch (err) {
                        ue.error(
                          err instanceof Error ? err.message : "Export failed."
                        );
                      }
                    },
                    className: "font-mono text-[10px] h-7 border-primary/40 text-primary hover:bg-primary/10 transition-smooth",
                    "data-ocid": `export-user-${user.username}`,
                    children: [
                      exportUser.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3 h-3 mr-1 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3 h-3 mr-1" }),
                      "Export"
                    ]
                  }
                )
              ] }) })
            ]
          },
          user.userId
        );
      }) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:hidden space-y-3", children: isLoading ? [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-36 rounded-lg" }, i)) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "rounded-xl bg-card neon-border-blue p-8 text-center",
        "data-ocid": "users-empty-state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: "No users match your search" })
      }
    ) : filtered.map((user) => {
      const isAdmin = user.role === "admin";
      const isLastAdmin = isAdmin && adminCount <= 1;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        UserCard,
        {
          user,
          isAdmin,
          isLastAdmin,
          onRoleDialog: () => setDialog({
            type: "role",
            userId: user.userId,
            username: user.username,
            newRole: isAdmin ? "user" : "admin",
            label: isAdmin ? "Revoke Admin" : "Make Admin"
          }),
          onResetDialog: () => setDialog({ type: "reset-single", username: user.username }),
          onDeleteDialog: () => setDialog({
            type: "delete",
            userId: user.userId,
            username: user.username
          }),
          onRestoreDialog: () => setRestoreModal({
            userId: user.userId,
            username: user.username
          })
        },
        user.userId
      );
    }) }),
    restoreModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
      RestoreAccountModal,
      {
        userId: restoreModal.userId,
        username: restoreModal.username,
        open: !!restoreModal,
        onClose: () => setRestoreModal(null)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: (dialog == null ? void 0 : dialog.type) === "role",
        onOpenChange: (open) => !open && setDialog(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "bg-card border-primary/30 font-body", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "font-display text-sm uppercase tracking-wider text-primary text-glow-blue", children: (dialog == null ? void 0 : dialog.type) === "role" ? dialog.label : "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { className: "font-mono text-xs text-muted-foreground", children: [
              "Change role for",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-bold", children: [
                "@",
                (dialog == null ? void 0 : dialog.type) === "role" ? dialog.username : ""
              ] }),
              " ",
              "to",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-bold", children: (dialog == null ? void 0 : dialog.type) === "role" ? dialog.newRole : "" }),
              "?"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { className: "font-mono text-xs", children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogAction,
              {
                onClick: handleConfirmDialog,
                className: "font-mono text-xs",
                disabled: isPending,
                children: isPending ? "Updating…" : "Confirm"
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: (dialog == null ? void 0 : dialog.type) === "reset-single",
        onOpenChange: (open) => !open && setDialog(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "bg-card border-destructive/40 font-body", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "font-display text-sm uppercase tracking-wider text-destructive", children: "Reset Subscription" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { className: "font-mono text-xs text-muted-foreground", children: [
              "Reset",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-bold", children: [
                "@",
                (dialog == null ? void 0 : dialog.type) === "reset-single" ? dialog.username : ""
              ] }),
              "'s subscription to zero? This will immediately archive all their active listings.",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive font-semibold", children: "This cannot be undone." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { className: "font-mono text-xs", children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogAction,
              {
                onClick: handleConfirmDialog,
                disabled: isPending,
                className: "font-mono text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90",
                children: isPending ? "Resetting…" : "Reset"
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: (dialog == null ? void 0 : dialog.type) === "reset-all-confirm1",
        onOpenChange: (open) => !open && setDialog(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "bg-card border-destructive/40 font-body", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "font-display text-sm uppercase tracking-wider text-destructive", children: "Reset All Subscriptions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { className: "font-mono text-xs text-muted-foreground", children: [
              "Are you sure? This will reset",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-bold", children: [
                "ALL ",
                nonAdminCount,
                " non-admin"
              ] }),
              " ",
              "user subscriptions to zero and immediately archive all their active listings."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { className: "font-mono text-xs", children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogAction,
              {
                onClick: handleConfirmDialog,
                className: "font-mono text-xs bg-destructive/80 text-destructive-foreground hover:bg-destructive",
                "data-ocid": "reset-all-confirm1-btn",
                children: "Continue"
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: (dialog == null ? void 0 : dialog.type) === "reset-all-confirm2",
        onOpenChange: (open) => !open && setDialog(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "bg-card border-destructive/60 font-body", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "font-display text-sm uppercase tracking-wider text-destructive", children: "Final Confirmation" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { className: "font-mono text-xs text-muted-foreground", children: [
              "This will reset",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-destructive font-bold", children: [
                "ALL ",
                nonAdminCount,
                " non-admin users"
              ] }),
              ". All their listings will be archived and the 30-day delete clock will start.",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive font-semibold", children: "This cannot be undone." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { className: "font-mono text-xs", children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogAction,
              {
                onClick: handleConfirmDialog,
                disabled: isPending,
                className: "font-mono text-[10px] bg-destructive text-destructive-foreground hover:bg-red-800 border-0",
                "data-ocid": "reset-all-confirm2-btn",
                children: isPending ? "Resetting…" : "Reset All (cannot be undone)"
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: (dialog == null ? void 0 : dialog.type) === "delete",
        onOpenChange: (open) => !open && setDialog(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "bg-card border-red-600/50 font-body", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "font-display text-sm uppercase tracking-wider text-red-500", children: "Delete Account" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { className: "font-mono text-xs text-muted-foreground leading-relaxed", children: [
              "Are you sure you want to delete",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-bold", children: [
                "@",
                (dialog == null ? void 0 : dialog.type) === "delete" ? dialog.username : ""
              ] }),
              "'s account? This will permanently delete all their listings, images, notifications, and cancel their Stripe subscription.",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500 font-semibold", children: "This cannot be undone." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { className: "font-mono text-xs", children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogAction,
              {
                onClick: handleConfirmDialog,
                disabled: isPending,
                className: "font-mono text-xs bg-red-600 text-white hover:bg-red-700 border-0",
                "data-ocid": "confirm-delete-user-btn",
                children: isPending ? "Deleting…" : "Delete Account"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  AdminUsersPage
};

import { r as reactExports, j as jsxRuntimeExports, V as TriangleAlert, S as Skeleton, s as Shield, T as Mail, a as ue } from "./index-CAvEfu6s.js";
import { A as AdminLayout, D as Database, U as Users } from "./AdminLayout-6l8Qb7LG.js";
import { A as AlertDialog, b as AlertDialogContent, c as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./alert-dialog-CUcEojEW.js";
import { B as Badge } from "./badge-nQZftmf8.js";
import { b as useListVersionBackups, e as useRestoreFromVersionBackup } from "./useAdminVersions-QXIdu55D.js";
import { i as useRestoreFromJsonFile, j as useExportVersionBackup, F as FileJson } from "./useBackupDashboard-bRWLlLka.js";
import { U as Upload } from "./upload-BnBWh8gc.js";
import { L as LoaderCircle } from "./loader-circle-BnrS6ZGn.js";
import { C as ChevronDown } from "./chevron-down-B2wyvFOr.js";
import { C as ChevronRight } from "./chevron-right-hw1qJuuz.js";
import { R as RotateCcw } from "./rotate-ccw-BFpfyyk-.js";
import { A as Archive } from "./archive-u3ofNYJ2.js";
import { D as Download } from "./download-BZ36m_Ut.js";
import "./credit-card-Ch6qFze_.js";
import "./trash-2-uBHlFMoE.js";
import "./index-6DK8G6wP.js";
import "./index-BIyWiIap.js";
import "./index-CO852ofZ.js";
import "./index-CjYLZFiM.js";
import "./index-CDXp9R6t.js";
function formatDate(ts) {
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
function shortId(id) {
  return id.slice(0, 8);
}
function SectionHeader({
  icon,
  letter,
  title,
  subtitle
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 mb-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 w-12 h-12 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] text-yellow-400/70 uppercase tracking-[0.2em]", children: [
        "Section ",
        letter
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-bold text-yellow-400 text-glow-yellow leading-tight", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground mt-1.5 leading-relaxed", children: subtitle })
    ] })
  ] });
}
function BackupRow({
  backup,
  onRestore,
  onExport,
  restoring,
  exporting
}) {
  var _a, _b;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl bg-secondary/20 border border-border/40 p-4 space-y-3",
      "data-ocid": "emergency-backup-row",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded", children: [
                "#",
                shortId(backup.id)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: [
                    "font-mono text-[9px] uppercase tracking-widest",
                    backup.backupType === "manual" ? "border-yellow-400/40 text-yellow-400 bg-yellow-400/5" : "border-primary/40 text-primary bg-primary/5"
                  ].join(" "),
                  children: backup.backupType === "manual" ? "Manual" : "Auto"
                }
              ),
              backup.isStable && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "font-mono text-[9px] uppercase tracking-widest border-green-500/40 text-green-400 bg-green-400/5",
                  children: "★ Stable"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs text-foreground", children: backup.versionLabel || "Unnamed backup" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[11px] text-muted-foreground", children: formatDate(backup.createdAt) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-xs font-mono text-muted-foreground flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3 h-3" }),
              ((_a = backup.userCount) == null ? void 0 : _a.toString()) ?? "0",
              " users"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "w-3 h-3" }),
              ((_b = backup.listingCount) == null ? void 0 : _b.toString()) ?? "0",
              " listings"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => onExport(backup),
              disabled: exporting,
              className: "flex-1 bg-secondary/40 hover:bg-secondary/60 disabled:opacity-50 disabled:cursor-not-allowed text-foreground font-semibold text-sm px-4 py-3 rounded-lg border border-border/40 transition-all duration-200 flex items-center justify-center gap-2",
              "data-ocid": `emergency-download-btn-${backup.id}`,
              children: [
                exporting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4" }),
                exporting ? "Downloading…" : "Download .json"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => onRestore(backup),
              disabled: restoring,
              className: "flex-[2] bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold text-lg px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 glow-yellow",
              "data-ocid": `emergency-restore-btn-${backup.id}`,
              children: [
                restoring ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-5 h-5" }),
                restoring ? "Restoring…" : "Restore to This Point"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function EmergencyRestorePage() {
  var _a, _b, _c, _d;
  const { data: backups = [], isLoading } = useListVersionBackups();
  const restoreMutation = useRestoreFromVersionBackup();
  const fileRestoreMutation = useRestoreFromJsonFile();
  const exportMutation = useExportVersionBackup();
  const [confirmTarget, setConfirmTarget] = reactExports.useState(null);
  const [restoreResult, setRestoreResult] = reactExports.useState(
    null
  );
  const [manualOpen, setManualOpen] = reactExports.useState(false);
  const fileRef = reactExports.useRef(null);
  const [selectedFile, setSelectedFile] = reactExports.useState(null);
  const [fileConfirmOpen, setFileConfirmOpen] = reactExports.useState(false);
  const [isDragOver, setIsDragOver] = reactExports.useState(false);
  async function handleConfirmRestore() {
    if (!confirmTarget) return;
    try {
      const result = await restoreMutation.mutateAsync(confirmTarget.id);
      setConfirmTarget(null);
      if (result.success) {
        setRestoreResult(result);
        ue.success("Restore complete!");
      } else {
        ue.error(result.errorMessage || result.message || "Restore failed.");
      }
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Restore failed.");
      setConfirmTarget(null);
    }
  }
  function handleFileChange(e) {
    var _a2;
    const file = (_a2 = e.target.files) == null ? void 0 : _a2[0];
    if (file) {
      setSelectedFile(file);
      if (e.target) e.target.value = "";
    }
  }
  function handleDrop(e) {
    var _a2;
    e.preventDefault();
    setIsDragOver(false);
    const file = (_a2 = e.dataTransfer.files) == null ? void 0 : _a2[0];
    if (file) setSelectedFile(file);
  }
  function handleDragOver(e) {
    e.preventDefault();
    setIsDragOver(true);
  }
  function handleUploadAndRestore() {
    if (!selectedFile) {
      ue.error("Please select a backup file first.");
      return;
    }
    setFileConfirmOpen(true);
  }
  async function handleConfirmFileRestore() {
    if (!selectedFile) return;
    setFileConfirmOpen(false);
    try {
      const result = await fileRestoreMutation.mutateAsync(selectedFile);
      if (result.success) {
        ue.success(
          `Restore complete. ${result.usersRestored} users and ${result.listingsRestored} listings restored.`
        );
        setSelectedFile(null);
      } else {
        const msg = Array.isArray(result.errorMessage) ? result.errorMessage[0] ?? "Restore failed." : result.errorMessage ?? "Restore failed.";
        ue.error(msg);
      }
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Restore failed.");
    }
  }
  function handleExport(backup) {
    exportMutation.mutate(backup, {
      onError: (err) => {
        ue.error(err.message ?? "Download failed.");
      }
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl sm:text-3xl font-black text-destructive text-glow-red flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-7 h-7 sm:w-8 sm:h-8 text-yellow-400 text-glow-yellow flex-shrink-0" }),
        "🚨 Emergency Restore"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-sm text-muted-foreground leading-relaxed", children: [
        "Use this page if your data is missing or corrupted.",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-yellow-400 font-semibold", children: "Your current state will always be saved first before any restore." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl bg-card neon-border-yellow p-5 sm:p-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SectionHeader,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "w-6 h-6 text-yellow-400" }),
          letter: "A",
          title: "Restore From a Saved Backup",
          subtitle: "Choose a backup from the list below and click Restore. Your site will return to exactly how it was at that point in time. Your current data will be saved first automatically."
        }
      ),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 rounded-xl" }, i)) }) : backups.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-secondary/20 border border-dashed border-border/40 p-8 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "w-8 h-8 text-muted-foreground/30 mx-auto mb-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs text-muted-foreground uppercase tracking-widest", children: "No backups found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[11px] text-muted-foreground/60 mt-1", children: "Go to Admin → Version History to create a manual backup." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: backups.map((backup) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        BackupRow,
        {
          backup,
          onRestore: setConfirmTarget,
          onExport: handleExport,
          restoring: restoreMutation.isPending && (confirmTarget == null ? void 0 : confirmTarget.id) === backup.id,
          exporting: exportMutation.isPending
        },
        backup.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl bg-card neon-border-yellow p-5 sm:p-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SectionHeader,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileJson, { className: "w-6 h-6 text-yellow-400" }),
          letter: "B",
          title: "Restore From a Downloaded Backup File",
          subtitle: "If you downloaded a backup file (.json or .zip) to your computer, upload it here to restore from it."
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: [
            "w-full border-2 border-dashed rounded-xl text-center transition-all duration-200",
            isDragOver ? "border-yellow-400/60 bg-yellow-400/5" : "border-border/40 hover:border-yellow-400/40 hover:bg-yellow-400/5"
          ].join(" "),
          onDrop: handleDrop,
          onDragOver: handleDragOver,
          onDragLeave: () => setIsDragOver(false),
          "data-ocid": "emergency-file-drop-zone",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "w-full p-8 sm:p-10 cursor-pointer",
              onClick: () => {
                var _a2;
                return (_a2 = fileRef.current) == null ? void 0 : _a2.click();
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-8 h-8 text-muted-foreground/40 mx-auto mb-3" }),
                selectedFile ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-yellow-400 font-semibold", children: selectedFile.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-muted-foreground", children: [
                    (selectedFile.size / 1024).toFixed(1),
                    " KB — ready to restore"
                  ] })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-muted-foreground", children: "Drag & drop or click to upload a backup file" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[11px] text-muted-foreground/60 mt-1", children: ".json or .zip accepted" })
                ] })
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: fileRef,
          type: "file",
          accept: ".json,.zip",
          className: "hidden",
          onChange: handleFileChange,
          "aria-label": "Select backup file"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: handleUploadAndRestore,
          disabled: !selectedFile || fileRestoreMutation.isPending,
          className: "w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-lg px-6 py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 glow-yellow",
          "data-ocid": "emergency-upload-restore-btn",
          children: [
            fileRestoreMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-5 h-5" }),
            fileRestoreMutation.isPending ? "Restoring…" : "Upload and Restore"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl bg-card neon-border-red p-5 sm:p-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "w-full flex items-start gap-4 text-left group",
          onClick: () => setManualOpen((v) => !v),
          "aria-expanded": manualOpen,
          "data-ocid": "emergency-manual-toggle",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 w-12 h-12 rounded-xl bg-destructive/10 border border-destructive/30 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-6 h-6 text-destructive" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 pt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-destructive/70 uppercase tracking-[0.2em]", children: "Section C" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-bold text-destructive text-glow-red", children: "If Buttons Are Not Working — Manual Steps" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-muted-foreground mt-1", children: [
                "Click to ",
                manualOpen ? "collapse" : "expand",
                " step-by-step instructions"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 pt-3", children: manualOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-5 h-5 text-destructive" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-5 h-5 text-muted-foreground" }) })
          ]
        }
      ),
      manualOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "space-y-4", children: [
          {
            step: 1,
            text: "Go to supabase.com and log in to your project."
          },
          {
            step: 2,
            text: 'Click on "Table Editor" in the left side menu.'
          },
          {
            step: 3,
            text: 'Find the "version_backups" table and click on it to open it.'
          },
          {
            step: 4,
            text: 'Find the most recent row (top of the list) and copy the contents of the "backup_data" column.'
          },
          {
            step: 5,
            text: "Contact support with your backup data and we can help restore it manually."
          }
        ].map(({ step, text }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-shrink-0 w-8 h-8 rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center font-display text-sm font-bold text-destructive", children: step }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-foreground leading-relaxed pt-1", children: text })
        ] }, step)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => {
              window.location.href = "mailto:support@example.com?subject=Emergency+Restore+Help";
            },
            className: "w-full bg-destructive hover:bg-destructive/80 text-destructive-foreground font-bold text-base px-6 py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 glow-red",
            "data-ocid": "emergency-email-support-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-5 h-5" }),
              "Email Admin Support"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-secondary/20 border border-border/40 p-4 space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[11px] text-muted-foreground leading-relaxed", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: "Emergency API endpoint:" }),
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("code", { className: "font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[10px]", children: [
          "POST ",
          window.location.origin,
          "/api/admin/emergency-restore"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[11px] text-muted-foreground", children: [
        "Protected by your",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "font-mono text-accent bg-accent/10 px-1 py-0.5 rounded text-[10px]", children: "EMERGENCY_RESTORE_TOKEN" }),
        " ",
        "environment variable. Body:",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "font-mono text-muted-foreground/80 text-[10px]", children: "{ token, backupId }" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: !!confirmTarget,
        onOpenChange: (open) => !open && setConfirmTarget(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "bg-card border-yellow-400/40 font-body", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { className: "font-display text-sm uppercase tracking-wider text-yellow-400 text-glow-yellow flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4" }),
              "Are you sure?"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-xs text-muted-foreground leading-relaxed space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "Restore backup",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-foreground bg-secondary/40 px-1.5 py-0.5 rounded", children: [
                  "#",
                  confirmTarget ? shortId(confirmTarget.id) : ""
                ] }),
                " ",
                "created",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: confirmTarget ? formatDate(confirmTarget.createdAt) : "" }),
                "?"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "This will restore",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-yellow-400 font-bold", children: [
                  ((_a = confirmTarget == null ? void 0 : confirmTarget.userCount) == null ? void 0 : _a.toString()) ?? "0",
                  " user accounts"
                ] }),
                " ",
                "and",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-yellow-400 font-bold", children: [
                  ((_b = confirmTarget == null ? void 0 : confirmTarget.listingCount) == null ? void 0 : _b.toString()) ?? "0",
                  " listings"
                ] }),
                " ",
                "to their state at that point in time."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary/80", children: "✓ Current data will be auto-saved as a backup first." })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { className: "font-mono text-xs", children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              AlertDialogAction,
              {
                onClick: (e) => {
                  e.preventDefault();
                  handleConfirmRestore();
                },
                disabled: restoreMutation.isPending,
                className: "font-mono text-xs bg-yellow-400 text-black hover:bg-yellow-300 font-bold",
                "data-ocid": "emergency-confirm-restore-btn",
                children: [
                  restoreMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3 h-3 mr-1.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-3 h-3 mr-1.5" }),
                  restoreMutation.isPending ? "Restoring…" : "Yes, Restore Now"
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
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "font-display text-sm uppercase tracking-wider text-primary text-glow-blue flex items-center gap-2", children: "✓ Restore Complete" }),
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
                "restored successfully."
              ] }),
              ((restoreResult == null ? void 0 : restoreResult.preRestoreBackupId) || (restoreResult == null ? void 0 : restoreResult.preSaveBackupId)) && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground/70", children: [
                "Pre-restore backup saved:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-foreground bg-secondary/40 px-1.5 py-0.5 rounded", children: [
                  "#",
                  shortId(
                    restoreResult.preRestoreBackupId || restoreResult.preSaveBackupId
                  )
                ] })
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
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: fileConfirmOpen, onOpenChange: setFileConfirmOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "bg-card border-yellow-400/40 font-body", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { className: "font-display text-sm uppercase tracking-wider text-yellow-400 text-glow-yellow flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }),
          "Restore from file?"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-xs text-muted-foreground space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "Upload and restore from",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: selectedFile == null ? void 0 : selectedFile.name }),
            "?"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary/80", children: "✓ Current data will be auto-saved as a backup first." })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { className: "font-mono text-xs", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          AlertDialogAction,
          {
            onClick: (e) => {
              e.preventDefault();
              handleConfirmFileRestore();
            },
            className: "font-mono text-xs bg-yellow-400 text-black hover:bg-yellow-300 font-bold",
            "data-ocid": "emergency-confirm-file-restore-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-3 h-3 mr-1.5" }),
              "Yes, Restore Now"
            ]
          }
        )
      ] })
    ] }) })
  ] }) });
}
export {
  EmergencyRestorePage
};

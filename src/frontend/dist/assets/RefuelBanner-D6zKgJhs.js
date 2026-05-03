import { c as createLucideIcon, j as jsxRuntimeExports, X, T as TriangleAlert, B as Button, u as useNavigate, K as Fuel, S as Skeleton, a as ue, b as useActor, r as reactExports, f as createActor } from "./index-Usp6K9eu.js";
import { a as useGetMyBackups, c as useDownloadBackup, d as useDeleteBackup, e as useInitiateBackupPayment, f as useConfirmBackupPayment } from "./useBackup-DDiQSX-a.js";
import { D as Download } from "./download-B2QSyBSh.js";
import { T as Trash2 } from "./trash-2-8CdU9Zw6.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
];
const Calendar = createLucideIcon("calendar", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
      key: "96xj49"
    }
  ]
];
const Flame = createLucideIcon("flame", __iconNode);
function useStripeBackupCheckout(onSuccess) {
  const { actor } = useActor(createActor);
  const initiate = useInitiateBackupPayment();
  const confirm = useConfirmBackupPayment();
  const [isProcessing, setIsProcessing] = reactExports.useState(false);
  const handlePurchase = async () => {
    setIsProcessing(true);
    try {
      const result = await initiate.mutateAsync();
      if (!result.stripeClientSecret) {
        await confirm.mutateAsync({
          paymentRecordId: result.paymentRecordId,
          stripePaymentIntentId: "pi_mock_backup"
        });
        onSuccess();
        return;
      }
      const a = actor;
      let publishableKey = "";
      if (a && typeof a.getStripePublicKey === "function") {
        try {
          const keyResult = await a.getStripePublicKey();
          publishableKey = (keyResult == null ? void 0 : keyResult.publishableKey) ?? "";
        } catch {
        }
      }
      if (!publishableKey) {
        throw new Error("Stripe not configured. Contact support.");
      }
      const StripeLib = window.Stripe;
      if (!StripeLib) throw new Error("Stripe.js not loaded");
      const stripe = StripeLib(publishableKey);
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        result.stripeClientSecret
      );
      if (error) throw new Error(error.message);
      if ((paymentIntent == null ? void 0 : paymentIntent.status) === "succeeded") {
        await confirm.mutateAsync({
          paymentRecordId: result.paymentRecordId,
          stripePaymentIntentId: paymentIntent.id
        });
        onSuccess();
      }
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Payment failed. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };
  return { handlePurchase, isProcessing };
}
function SmartBackupButton() {
  const download = useDownloadBackup();
  const { handlePurchase, isProcessing } = useStripeBackupCheckout(async () => {
    try {
      await download.mutateAsync({ includeImages: true });
      ue.success("Backup downloaded! Check your Downloads folder.");
    } catch {
      ue.error(
        "Backup purchased but download failed. Access it from your profile."
      );
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        onClick: handlePurchase,
        disabled: isProcessing || download.isPending,
        size: "sm",
        className: "shrink-0 bg-card border border-primary/50 text-primary hover:bg-primary/10 glow-blue-sm font-display font-bold tracking-wider uppercase text-xs transition-smooth w-fit flex items-center gap-1.5",
        "data-ocid": "smart-backup-purchase-btn",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "💾" }),
          isProcessing || download.isPending ? "Processing..." : "Smart Backup — $29.99"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground leading-relaxed max-w-xs", children: "Save a backup of all your listings before they are permanently deleted. Restore anytime in the future." })
  ] });
}
function BackupsSection() {
  const { data: backups = [], isLoading } = useGetMyBackups();
  const download = useDownloadBackup();
  const deleteBackup = useDeleteBackup();
  const handleReDownload = async (backupId) => {
    try {
      await download.mutateAsync({ includeImages: false });
      ue.success("Backup downloaded.");
    } catch {
      ue.error(`Could not re-download backup ${backupId}.`);
    }
  };
  const handleDelete = async (backupId) => {
    try {
      await deleteBackup.mutateAsync(backupId);
      ue.success("Backup deleted.");
    } catch {
      ue.error("Failed to delete backup.");
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full bg-primary/5 rounded-lg" }, i)) });
  }
  if (backups.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground py-3", children: "No backups yet. A backup can be purchased when your subscription expires." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "ul",
    {
      className: "divide-y divide-border/40 rounded-lg border border-border/40 overflow-hidden",
      "data-ocid": "backup-list",
      children: backups.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "li",
        {
          className: "flex items-center justify-between gap-3 px-4 py-3 bg-card/40 hover:bg-primary/5 transition-smooth",
          "data-ocid": `backup-item-${b.id}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-foreground truncate", children: new Date(b.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] text-muted-foreground mt-0.5", children: [
                b.listingCount,
                " listings",
                b.includesImages ? " · includes images" : " · text only"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "ghost",
                  onClick: () => handleReDownload(b.id),
                  disabled: download.isPending,
                  className: "h-7 w-7 p-0 text-primary hover:bg-primary/10 transition-smooth",
                  "aria-label": "Download backup",
                  "data-ocid": `backup-download-${b.id}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "ghost",
                  onClick: () => handleDelete(b.id),
                  disabled: deleteBackup.isPending,
                  className: "h-7 w-7 p-0 text-destructive hover:bg-destructive/10 transition-smooth",
                  "aria-label": "Delete backup",
                  "data-ocid": `backup-delete-${b.id}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                }
              )
            ] })
          ]
        },
        b.id
      ))
    }
  );
}
function LowFuelWarningBanner({ onDismiss }) {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg px-4 py-3 mb-4 border border-accent/50 bg-accent/8",
      style: { boxShadow: "0 0 10px oklch(0.88 0.19 84 / 0.15)" },
      role: "alert",
      "data-ocid": "low-fuel-warning-banner",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 top-0 h-0.5 rounded-t-lg bg-gradient-to-r from-accent/20 via-accent to-accent/20" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onDismiss,
            className: "absolute top-2.5 right-2.5 text-accent/50 hover:text-accent transition-smooth",
            "aria-label": "Dismiss low fuel warning",
            "data-ocid": "low-fuel-banner-dismiss",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5 min-w-0 pr-7", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Fuel, { className: "h-4 w-4 text-accent shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-[11px] font-bold tracking-widest uppercase text-accent mb-0.5", children: "Low Fuel Warning ⚠️" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-accent/80 leading-relaxed", children: "Your DeLorean is running low on gas. Refuel before your listings are archived." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => navigate({ to: "/wallet" }),
            size: "sm",
            className: "shrink-0 bg-accent/90 text-accent-foreground hover:bg-accent font-display font-bold tracking-wider uppercase text-[11px] h-8 px-3",
            "data-ocid": "low-fuel-refuel-btn",
            children: "Refuel Now"
          }
        )
      ]
    }
  );
}
function RefuelBanner({
  daysUntilDeletion,
  onRefuel,
  onDismiss
}) {
  const isWarning = daysUntilDeletion !== null && daysUntilDeletion <= 5;
  const isExpired = daysUntilDeletion !== null;
  if (!isExpired) return null;
  if (isWarning) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg px-5 py-4 mb-6 border border-accent/60 bg-accent/10 glow-yellow-sm",
        role: "alert",
        "data-ocid": "refuel-warning-banner",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onDismiss,
              className: "absolute top-3 right-3 text-accent/60 hover:text-accent transition-smooth",
              "aria-label": "Dismiss warning",
              "data-ocid": "refuel-banner-dismiss",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 min-w-0 pr-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5 text-accent shrink-0 mt-0.5 text-glow-yellow" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs font-bold tracking-widest uppercase text-accent text-glow-yellow mb-1", children: "⚠ FINAL WARNING — OUT OF GAS" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-accent/80 leading-relaxed", children: [
                "Only",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-accent font-bold", children: [
                  daysUntilDeletion,
                  " day",
                  daysUntilDeletion !== 1 ? "s" : ""
                ] }),
                " ",
                "before your listings are gone forever. The DeLorean is on empty — refuel now to save them!"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: onRefuel,
              size: "sm",
              className: "shrink-0 bg-accent text-accent-foreground hover:bg-accent/90 glow-yellow font-display font-bold tracking-wider uppercase text-xs animate-pulse",
              "data-ocid": "refuel-warning-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-3.5 h-3.5 mr-1.5" }),
                "REFUEL GAS NOW"
              ]
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative rounded-lg px-5 py-4 mb-6 border border-destructive/60 bg-destructive/10 glow-red",
      role: "alert",
      "data-ocid": "refuel-expired-banner",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 top-0 h-0.5 rounded-t-lg bg-gradient-to-r from-destructive/20 via-destructive to-destructive/20" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onDismiss,
            className: "absolute top-3 right-3 text-destructive/60 hover:text-destructive transition-smooth",
            "aria-label": "Dismiss banner",
            "data-ocid": "refuel-banner-dismiss",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start justify-between gap-4 pr-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-5 w-5 text-destructive shrink-0 mt-0.5 text-glow-red animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs font-bold tracking-widest uppercase text-destructive text-glow-red mb-1", children: "🔴 SUBSCRIPTION EXPIRED — OUT OF GAS" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-destructive/80 leading-relaxed", children: [
                "Your DeLorean is out of gas. Refuel to restore your listings before they are permanently deleted in",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-destructive font-bold text-glow-red", children: [
                  daysUntilDeletion,
                  " day",
                  daysUntilDeletion !== 1 ? "s" : ""
                ] }),
                "."
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: onRefuel,
              size: "sm",
              className: "shrink-0 bg-destructive text-destructive-foreground hover:bg-destructive/90 glow-red font-display font-bold tracking-wider uppercase text-xs",
              "data-ocid": "refuel-expired-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-3.5 h-3.5 mr-1.5" }),
                "REFUEL GAS"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 pt-4 border-t border-destructive/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SmartBackupButton, {}) })
      ]
    }
  );
}
export {
  BackupsSection as B,
  Calendar as C,
  LowFuelWarningBanner as L,
  RefuelBanner as R
};

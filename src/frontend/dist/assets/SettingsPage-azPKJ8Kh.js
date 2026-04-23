import { f as useActor, g as useQueryClient, h as useMutation, i as createActor, j as jsxRuntimeExports, B as Button, X, a as ue, H as useProfile, r as reactExports, n as Link, A as ArrowLeft, U as User, S as Skeleton, l as Label, I as Input, J as CircleCheck, K as useSubmitTicket } from "./index-CAvEfu6s.js";
import { B as Badge } from "./badge-nQZftmf8.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent, e as CircleHelp } from "./card-DYSbVx6f.js";
import { S as Separator } from "./separator-DLuDXN1l.js";
import { T as Textarea } from "./textarea-B4qlobFo.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-DhY_8FhX.js";
import { J as JSZip } from "./jszip.min-CxQCaQ2L.js";
import { A as Archive } from "./archive-u3ofNYJ2.js";
import { L as LoaderCircle } from "./loader-circle-BnrS6ZGn.js";
import { C as CreditCard } from "./credit-card-Ch6qFze_.js";
import { u as useRestoreFromBackup, a as useGetMyBackups } from "./useBackup-Ct_BOgXd.js";
import { C as CircleX } from "./circle-x-DkbLRZuB.js";
import { U as Upload } from "./upload-BnBWh8gc.js";
import { D as Download } from "./download-BZ36m_Ut.js";
import "./index-BIyWiIap.js";
import "./index-6DK8G6wP.js";
import "./index-CO852ofZ.js";
import "./index-CjYLZFiM.js";
import "./index-CDXp9R6t.js";
function useCreateStripeCheckoutForBackup() {
  const { actor, isFetching } = useActor(createActor);
  return useMutation({
    mutationFn: async () => {
      var _a, _b, _c;
      if (!actor || isFetching) throw new Error("Not ready");
      const a = actor;
      let priceId = "";
      if (typeof a.getConfig === "function") {
        try {
          priceId = await a.getConfig("stripe_price_backup") ?? "";
        } catch {
        }
      }
      if (!priceId) {
        throw new Error(
          "Backup price not configured. Ask the admin to set the Smart Backup Price ID in Admin → Payments."
        );
      }
      let userId = "";
      if (typeof a.getMyProfile === "function") {
        try {
          const p = await a.getMyProfile();
          userId = ((_b = (_a = p == null ? void 0 : p.ok) == null ? void 0 : _a.userId) == null ? void 0 : _b.toString()) ?? ((_c = p == null ? void 0 : p.userId) == null ? void 0 : _c.toString()) ?? "";
        } catch {
        }
      }
      const tryCheckout = async (methodName) => {
        if (typeof a[methodName] !== "function") return false;
        const result = await a[methodName](priceId, userId);
        if ((result == null ? void 0 : result.__kind__) === "err") throw new Error(result.err);
        const url = (result == null ? void 0 : result.ok) ?? result;
        if (typeof url === "string" && url.startsWith("http")) {
          window.location.href = url;
          return true;
        }
        return false;
      };
      if (await tryCheckout("createBackupCheckoutSession")) return;
      if (await tryCheckout("createStripeCheckoutSession")) return;
      throw new Error("Payment system not configured. Please contact support.");
    }
  });
}
function useRestoreFromZip() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, onProgress }) => {
      var _a;
      if (!actor) throw new Error("Actor not ready");
      const a = actor;
      onProgress("Reading backup file…");
      const zip = new JSZip();
      const loaded = await zip.loadAsync(file);
      const listingsFile = loaded.file("listings.json");
      if (!listingsFile)
        throw new Error("Invalid backup: listings.json not found");
      const listingsText = await listingsFile.async("text");
      const listings = JSON.parse(listingsText);
      onProgress(`Found ${listings.length} listings…`);
      let restoredCount = 0;
      let imageCount = 0;
      if (typeof a.restoreFromBackup === "function") {
        const payload = listings.map((l) => ({
          title: l.title,
          description: l.description,
          price: l.price ?? null,
          category: l.category ?? null,
          pinned: l.pinned,
          favorited: l.favorited
        }));
        const result = await a.restoreFromBackup(payload);
        if ((result == null ? void 0 : result.__kind__) === "err") throw new Error(result.err);
        restoredCount = Number(((_a = result == null ? void 0 : result.ok) == null ? void 0 : _a.restoredCount) ?? listings.length);
      } else {
        for (const l of listings) {
          try {
            await a.createListing({
              title: l.title,
              description: l.description,
              price: l.price ?? null,
              category: l.category ?? null,
              sourceUrl: null
            });
            restoredCount++;
          } catch {
          }
        }
      }
      const imageFiles = Object.keys(loaded.files).filter(
        (name) => name.startsWith("images/")
      );
      imageCount = imageFiles.length;
      return { restoredCount, imageCount };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["favorited-listings"] });
      queryClient.invalidateQueries({ queryKey: ["myBackups"] });
    }
  });
}
function BackupExportModal({ open, onClose }) {
  const checkoutForBackup = useCreateStripeCheckoutForBackup();
  function handleClose() {
    onClose();
  }
  async function handlePayAndExport() {
    try {
      await checkoutForBackup.mutateAsync();
    } catch (err) {
      ue.error("Payment setup failed", {
        description: err instanceof Error ? err.message : "Please try again."
      });
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: handleClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md bg-card border-primary/30 neon-border-blue", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-accent/10 border border-accent/40 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "w-5 h-5 text-accent" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-base tracking-wide text-foreground uppercase", children: "Export Your Listings — $29.99" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { className: "text-sm text-muted-foreground leading-relaxed mt-2", children: [
        "Your complete listing archive including all photos will be packaged into a downloadable backup file. This backup can be used to restore your listings in the future.",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground/70", children: "One-time charge of $29.99." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex-col sm:flex-row gap-2 mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          onClick: handleClose,
          className: "order-2 sm:order-1 font-mono text-xs",
          "data-ocid": "backup-cancel-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5 mr-1.5" }),
            "Cancel"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: handlePayAndExport,
          disabled: checkoutForBackup.isPending,
          className: "order-1 sm:order-2 font-display text-sm tracking-widest uppercase bg-accent text-accent-foreground hover:bg-accent/90 glow-yellow flex-1 sm:flex-none",
          "data-ocid": "backup-pay-export-btn",
          children: checkoutForBackup.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 mr-1.5 animate-spin" }),
            "Redirecting…"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-3.5 h-3.5 mr-1.5" }),
            "Pay $29.99 and Export"
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "p",
      {
        className: "text-center font-mono text-[10px] text-muted-foreground/50 -mt-1",
        "data-ocid": "backup-stripe-note",
        children: "Secured by Stripe. You'll be redirected to complete payment."
      }
    )
  ] }) });
}
const USERNAME_RE = /^[a-zA-Z0-9_]{3,30}$/;
function validateUsername(value) {
  if (value.length < 3) return "Username must be at least 3 characters.";
  if (value.length > 30) return "Username cannot exceed 30 characters.";
  if (!USERNAME_RE.test(value))
    return "Only letters, numbers, and underscores allowed.";
  return null;
}
const SUPPORT_SUBJECTS = [
  "Account Issue",
  "Billing Question",
  "Technical Problem",
  "Listing Issue",
  "Other"
];
function SettingsPage() {
  const { profile, isLoading, setUsername, isSaving } = useProfile();
  const { actor, isFetching } = useActor(createActor);
  const [inputValue, setInputValue] = reactExports.useState("");
  const [validationError, setValidationError] = reactExports.useState(null);
  const [takenError, setTakenError] = reactExports.useState(null);
  const [checkingAvailability, setCheckingAvailability] = reactExports.useState(false);
  const [isAvailable, setIsAvailable] = reactExports.useState(null);
  const seededRef = reactExports.useRef(false);
  const debounceRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if ((profile == null ? void 0 : profile.username) && !seededRef.current) {
      seededRef.current = true;
      setInputValue(profile.username);
    }
  }, [profile == null ? void 0 : profile.username]);
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    setTakenError(null);
    setIsAvailable(null);
    const err = validateUsername(val);
    setValidationError(err);
    if (err || val === (profile == null ? void 0 : profile.username)) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (!actor) return;
      setCheckingAvailability(true);
      try {
        const existing = await actor.getProfileByUsername(val);
        setIsAvailable(existing === null);
        if (existing !== null) {
          setTakenError("That username is already taken.");
        }
      } catch {
      } finally {
        setCheckingAvailability(false);
      }
    }, 500);
  };
  const handleBlur = () => {
    if (!inputValue) return;
    const err = validateUsername(inputValue);
    setValidationError(err);
  };
  const handleSave = async () => {
    const err = validateUsername(inputValue);
    if (err) {
      setValidationError(err);
      return;
    }
    if (inputValue === (profile == null ? void 0 : profile.username)) {
      ue.info("That's already your username.");
      return;
    }
    try {
      await setUsername(inputValue);
      ue.success("Username updated successfully!", {
        description: `You're now known as @${inputValue}`
      });
      setIsAvailable(null);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to update username.";
      if (msg.toLowerCase().includes("taken") || msg.toLowerCase().includes("already")) {
        setTakenError("That username is already taken.");
      } else {
        ue.error("Failed to update username", { description: msg });
      }
    }
  };
  const displayError = validationError ?? takenError;
  const isUnchanged = inputValue === (profile == null ? void 0 : profile.username);
  const canSave = !displayError && !isUnchanged && !checkingAvailability && isAvailable !== false && inputValue.length >= 3;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background retro-grid", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/dashboard",
        className: "inline-flex items-center gap-2 text-muted-foreground hover:text-primary text-sm transition-smooth mb-8 group",
        "data-ocid": "settings-back-link",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 group-hover:-translate-x-0.5 transition-smooth" }),
          "Back to Dashboard"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-primary text-glow-blue tracking-wider uppercase mb-1", children: "Account Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-body", children: "Manage your identity on the platform." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-primary/20 neon-border-blue shadow-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center neon-border-blue", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-5 h-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-base tracking-wide text-foreground uppercase", children: "Username" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-xs text-muted-foreground", children: "Unique across the platform — used for upgrades and identity." })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border/50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6 space-y-6", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24 bg-primary/10" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-full bg-primary/10" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "username-input",
                className: "font-mono text-xs text-muted-foreground tracking-widest uppercase",
                children: "Username"
              }
            ),
            profile && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "outline",
                className: "font-mono text-[10px] border-primary/40 text-primary bg-primary/10 px-2",
                children: [
                  "@",
                  profile.username
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "username-input",
                value: inputValue,
                onChange: handleInputChange,
                onBlur: handleBlur,
                placeholder: "Enter new username…",
                maxLength: 30,
                spellCheck: false,
                autoComplete: "off",
                "data-ocid": "settings-username-input",
                className: `font-mono bg-input border-border text-foreground pr-9 transition-smooth focus:ring-primary/50 ${displayError ? "border-destructive/60 focus:border-destructive neon-border-red" : isAvailable === true ? "border-green-500/60 focus:border-green-500 neon-border-green" : "border-border focus:border-primary/60"}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-3 top-1/2 -translate-y-1/2", children: [
              checkingAvailability && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-3 h-3 rounded-full border-2 border-primary/40 border-t-primary animate-spin" }),
              !checkingAvailability && isAvailable === true && !displayError && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-green-500 text-glow-green" }),
              !checkingAvailability && (displayError || isAvailable === false) && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4 text-destructive" })
            ] })
          ] }),
          displayError ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-destructive font-mono",
              "data-ocid": "settings-username-error",
              children: displayError
            }
          ) : isAvailable === true && !isUnchanged ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-green-500 font-mono text-glow-green", children: "✓ Username is available" }) : isUnchanged && inputValue ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono", children: "This is your current username." }) : null,
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground font-mono", children: "3–30 characters · letters, numbers, underscores only" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: handleSave,
            disabled: !canSave || isSaving || isFetching,
            "data-ocid": "settings-save-username-btn",
            className: `w-full font-display text-sm tracking-wider uppercase transition-smooth ${canSave && !isSaving ? "bg-primary text-primary-foreground hover:bg-primary/90 glow-blue-sm" : "bg-muted text-muted-foreground cursor-not-allowed"}`,
            children: isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-3.5 h-3.5 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" }),
              "Saving…"
            ] }) : "Save Username"
          }
        )
      ] }) })
    ] }),
    profile && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mt-6 bg-card border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-sm tracking-wide text-muted-foreground uppercase", children: "Account Info" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3 pt-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Email", value: profile.email || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          InfoRow,
          {
            label: "Role",
            value: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: `font-mono text-[10px] px-2 ${profile.role === "admin" ? "border-accent/50 text-accent bg-accent/10 text-glow-yellow" : "border-border text-muted-foreground"}`,
                children: profile.role
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          InfoRow,
          {
            label: "Member since",
            value: new Date(
              Number(profile.createdAt) / 1e6
            ).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric"
            })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          InfoRow,
          {
            label: "Email verified",
            value: profile.emailVerified ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-500 font-mono text-xs text-glow-green", children: "✓ Verified" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-mono text-xs", children: "Not verified" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(RestoreFromBackupSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ContactSupportSection, {})
  ] }) });
}
function InfoRow({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 border-b border-border/40 last:border-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground tracking-wider uppercase", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground font-body", children: value })
  ] });
}
function ContactSupportSection() {
  const { submit, loading, success } = useSubmitTicket();
  const [subject, setSubject] = reactExports.useState(SUPPORT_SUBJECTS[0]);
  const [message, setMessage] = reactExports.useState("");
  const [submitted, setSubmitted] = reactExports.useState(false);
  const maxChars = 1e3;
  const charsLeft = maxChars - message.length;
  async function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) {
      ue.error("Please enter a message before submitting.");
      return;
    }
    try {
      await submit(subject, message.trim());
      setSubmitted(true);
      setMessage("");
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to send your message."
      );
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: "mt-6 bg-card border-primary/20 neon-border-blue shadow-lg",
      "data-ocid": "settings-contact-support-section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center neon-border-blue", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleHelp, { className: "w-5 h-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-base tracking-wide text-foreground uppercase", children: "Contact Support" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-xs text-muted-foreground", children: "Have a question or issue? Send us a message and we'll respond through your notification center." })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border/50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6", children: submitted || success ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-start gap-3 rounded-lg border border-green-500/30 bg-green-500/5 px-4 py-4",
            "data-ocid": "support-success-msg",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5 text-green-500 shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-sm font-bold tracking-wide text-green-500 uppercase", children: "Message Sent" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground mt-1 leading-relaxed", children: "Your message has been received. We will respond through your notification center." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setSubmitted(false),
                    className: "font-mono text-xs text-primary hover:text-primary/80 transition-smooth mt-3 underline underline-offset-2",
                    children: "Send another message"
                  }
                )
              ] })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "support-subject",
                className: "font-mono text-xs text-muted-foreground tracking-widest uppercase",
                children: "Subject"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                id: "support-subject",
                value: subject,
                onChange: (e) => setSubject(e.target.value),
                className: "w-full rounded-md border border-border bg-input px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/60 transition-smooth min-h-[44px]",
                "data-ocid": "support-subject-select",
                children: SUPPORT_SUBJECTS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s }, s))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "support-message",
                  className: "font-mono text-xs text-muted-foreground tracking-widest uppercase",
                  children: "Message"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: `font-mono text-[10px] ${charsLeft < 100 ? "text-destructive" : "text-muted-foreground/60"}`,
                  children: [
                    charsLeft,
                    " chars left"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "support-message",
                value: message,
                onChange: (e) => setMessage(e.target.value.slice(0, maxChars)),
                placeholder: "Describe your issue or question…",
                rows: 5,
                required: true,
                className: "font-mono text-sm bg-input border-border text-foreground focus:border-primary/60 focus:ring-primary/50 resize-none transition-smooth",
                "data-ocid": "support-message-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              disabled: loading || !message.trim(),
              className: "w-full font-display text-sm tracking-wider uppercase bg-primary text-primary-foreground hover:bg-primary/90 glow-blue-sm transition-smooth disabled:opacity-50 disabled:cursor-not-allowed",
              "data-ocid": "support-submit-btn",
              children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-3.5 h-3.5 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" }),
                "Sending…"
              ] }) : "Send Message"
            }
          )
        ] }) })
      ]
    }
  );
}
function RestoreFromBackupSection() {
  const fileInputRef = reactExports.useRef(null);
  const restoreJson = useRestoreFromBackup();
  const restoreZip = useRestoreFromZip();
  const { data: backupHistory = [], isLoading: isLoadingHistory } = useGetMyBackups();
  const [showExportModal, setShowExportModal] = reactExports.useState(false);
  const [isRestoring, setIsRestoring] = reactExports.useState(false);
  const [restoreProgress, setRestoreProgress] = reactExports.useState(null);
  const [restoreMessage, setRestoreMessage] = reactExports.useState(null);
  const handleFileSelect = async (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    setIsRestoring(true);
    setRestoreMessage(null);
    setRestoreProgress(null);
    try {
      const isZip = file.name.endsWith(".zip") || file.type === "application/zip";
      if (isZip) {
        const result = await restoreZip.mutateAsync({
          file,
          onProgress: (msg) => setRestoreProgress(msg)
        });
        setRestoreMessage({
          type: "success",
          text: `${result.restoredCount} listing${result.restoredCount !== 1 ? "s" : ""} restored successfully.`
        });
        ue.success(`${result.restoredCount} listings restored from backup.`);
      } else {
        const text = await file.text();
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed.listings)) {
          setRestoreMessage({
            type: "error",
            text: "Invalid backup file. Missing listings data."
          });
          return;
        }
        const result = await restoreJson.mutateAsync(parsed.listings);
        setRestoreMessage({
          type: "success",
          text: `${result.restoredCount} listing${result.restoredCount !== 1 ? "s" : ""} restored successfully.`
        });
        ue.success(`${result.restoredCount} listings restored.`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message.toLowerCase().includes("subscription") ? "An active subscription is required to restore a backup." : err.message : "Failed to restore backup.";
      setRestoreMessage({ type: "error", text: msg });
      ue.error(msg);
    } finally {
      setIsRestoring(false);
      setRestoreProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  const isBusy = isRestoring || restoreJson.isPending || restoreZip.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      BackupExportModal,
      {
        open: showExportModal,
        onClose: () => setShowExportModal(false)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: "mt-6 bg-card border-primary/20 neon-border-blue shadow-lg",
        "data-ocid": "settings-restore-backup-section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center neon-border-blue", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "w-5 h-5 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-base tracking-wide text-foreground uppercase", children: "Restore From Backup" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-xs text-muted-foreground", children: "Upload a backup file to restore your listings. Requires an active subscription. Restoring will add listings from the backup to your active listings. Smart Backup export is a $29.99 one-time export fee." })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border/50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-6 space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-accent/5 border border-accent/20 px-4 py-4 space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs tracking-widest uppercase text-accent", children: "⚡ Smart Backup — $29.99" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Export all your listings including photos as a downloadable ZIP archive. One-time charge of $29.99." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  onClick: () => setShowExportModal(true),
                  className: "font-display text-xs tracking-widest uppercase bg-accent text-accent-foreground hover:bg-accent/90 glow-yellow transition-smooth gap-2 mt-1",
                  "data-ocid": "smart-backup-export-btn",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "w-3.5 h-3.5" }),
                    "Export My Listings — $29.99"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground uppercase tracking-widest", children: "Upload Backup File" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  disabled: isBusy,
                  onClick: () => {
                    var _a;
                    return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                  },
                  className: "w-full sm:w-auto font-display text-xs tracking-widest uppercase neon-border-blue text-primary hover:glow-blue-sm transition-smooth gap-2",
                  "data-ocid": "upload-backup-file-btn",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-3.5 h-3.5" }),
                    isBusy ? "Restoring..." : "Upload Backup File"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  ref: fileInputRef,
                  type: "file",
                  accept: ".json,.zip",
                  className: "sr-only",
                  tabIndex: -1,
                  onChange: handleFileSelect
                }
              ),
              isBusy && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-mono text-xs text-primary animate-pulse", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "⚡" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: restoreProgress ?? "Restoring your listings…" })
              ] }),
              restoreMessage && !isBusy && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: `font-mono text-xs ${restoreMessage.type === "success" ? "text-green-500" : "text-destructive"}`,
                  "data-ocid": "restore-backup-result",
                  children: [
                    restoreMessage.type === "success" ? "✓ " : "✗ ",
                    restoreMessage.text
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              BackupHistorySection,
              {
                records: backupHistory,
                isLoading: isLoadingHistory
              }
            )
          ] })
        ]
      }
    )
  ] });
}
function BackupHistorySection({
  records,
  isLoading
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-ocid": "backup-history-section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground uppercase tracking-widest", children: "Previous Exports" }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full bg-primary/5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full bg-primary/5" })
    ] }) : records.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground/60 py-2", children: "No backups yet. Purchase a Smart Backup to get started." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto -mx-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full min-w-[380px] text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border/40", children: ["Date", "Listings", "Images", "Re-download"].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: "px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
          children: h
        },
        h
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: records.map((rec, i) => {
        const expired = rec.expiresAt ? new Date(rec.expiresAt) < /* @__PURE__ */ new Date() : false;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: `border-b border-border/20 ${i % 2 === 0 ? "bg-card/60" : "bg-background/40"} ${expired ? "opacity-50" : ""}`,
            "data-ocid": `backup-history-row-${i}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 font-mono text-[10px] text-muted-foreground whitespace-nowrap", children: new Date(rec.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 font-mono text-xs text-foreground", children: rec.listingCount }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 font-mono text-xs text-foreground", children: rec.imageCount }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5", children: expired ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground/50", children: "Expired" }) : rec.downloadUrl ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: rec.downloadUrl,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "inline-flex items-center gap-1 font-mono text-[10px] text-primary hover:text-primary/80 transition-colors",
                  "data-ocid": `backup-redownload-${i}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3 h-3" }),
                    "Re-download"
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground/50", children: "—" }) })
            ]
          },
          rec.id
        );
      }) })
    ] }) })
  ] });
}
export {
  SettingsPage
};

import { c as createLucideIcon, b as useActor, d as useQueryClient, r as reactExports, i as useQuery, e as useMutation, j as jsxRuntimeExports, Z as Zap, S as Skeleton, ah as Settings, B as Button, R as RefreshCw, g as CircleCheck, a as ue, f as createActor } from "./index-wfeVo5SS.js";
import { A as AdminLayout } from "./AdminLayout-D2n0p7xs.js";
import { B as Badge } from "./badge-CMtdcaid.js";
import "./credit-card-BZU8i_bR.js";
import "./trash-2-CKLNHo19.js";
import "./dollar-sign-C9UG4Kg6.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode);
function toNum(v) {
  if (v === null || v === void 0) return 0;
  return typeof v === "bigint" ? Number(v) : v;
}
function platformDisplayName(name) {
  if (name === "facebook") return "📘 Facebook Marketplace";
  if (name === "mecari") return "🏯 Mercari";
  if (name === "offerUp") return "🛍️ OfferUp";
  return name;
}
function HealthCard({
  health,
  onToggle,
  toggling
}) {
  const rate = (health.successRate * 100).toFixed(1);
  const healthy = health.isHealthy;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `p-4 rounded-lg border ${healthy ? "bg-green-900/10 border-green-500/60" : "bg-yellow-900/10 border-yellow-500/60"}`,
      "data-ocid": `autofill-health-card.${health.platformName}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-white text-sm", children: platformDisplayName(health.platformName) }),
          healthy ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5 text-green-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-5 w-5 text-yellow-400" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-xs text-gray-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: health.enabled ? "text-green-400" : "text-red-400", children: health.enabled ? "Enabled" : "Disabled" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Success Rate" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-300", children: [
              rate,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sessions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-300", children: [
              toNum(health.activeSessions),
              " active"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-300", children: [
              toNum(health.totalSuccessful),
              "/",
              toNum(health.totalAttempts),
              " ok"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            className: "w-full mt-3 font-mono text-[10px] uppercase tracking-widest h-8",
            onClick: onToggle,
            disabled: toggling,
            "data-ocid": `autofill-health-card.${health.platformName}.toggle`,
            children: [
              toggling ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3 w-3 mr-1 animate-spin" }) : null,
              health.enabled ? "Disable" : "Enable"
            ]
          }
        )
      ]
    }
  );
}
function CheckRow({
  label,
  checked,
  onChange,
  id
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "label",
    {
      htmlFor: id,
      className: "flex items-center gap-3 cursor-pointer group",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id,
            type: "checkbox",
            checked,
            onChange: (e) => onChange(e.target.checked),
            className: "w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus-visible:ring-blue-500",
            "data-ocid": `autofill-settings.${id}.checkbox`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-300 group-hover:text-white transition-colors", children: label })
      ]
    }
  );
}
function FacebookSettingsPanel({
  config,
  onSave,
  saving
}) {
  const [s, setS] = reactExports.useState({
    prefillTitle: config.fbPrefillTitle,
    prefillDescription: config.fbPrefillDescription,
    prefillPrice: config.fbPrefillPrice,
    prefillCategory: config.fbPrefillCategory,
    prefillCondition: config.fbPrefillCondition,
    autoClickLocalPickup: config.fbAutoClickLocalPickup,
    autoClickShipping: config.fbAutoClickShipping
  });
  const set = (key) => (v) => setS((prev) => ({ ...prev, [key]: v }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-400 uppercase tracking-widest", children: "Prefill Fields" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        CheckRow,
        {
          id: "fb-title",
          label: "Title",
          checked: s.prefillTitle,
          onChange: set("prefillTitle")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        CheckRow,
        {
          id: "fb-description",
          label: "Description",
          checked: s.prefillDescription,
          onChange: set("prefillDescription")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        CheckRow,
        {
          id: "fb-price",
          label: "Price",
          checked: s.prefillPrice,
          onChange: set("prefillPrice")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        CheckRow,
        {
          id: "fb-category",
          label: "Category",
          checked: s.prefillCategory,
          onChange: set("prefillCategory")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        CheckRow,
        {
          id: "fb-condition",
          label: "Condition",
          checked: s.prefillCondition,
          onChange: set("prefillCondition")
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-gray-700 pt-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-400 uppercase tracking-widest", children: "Auto-Click" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        CheckRow,
        {
          id: "fb-local-pickup",
          label: "Local Pickup",
          checked: s.autoClickLocalPickup,
          onChange: set("autoClickLocalPickup")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        CheckRow,
        {
          id: "fb-shipping",
          label: "Shipping Available",
          checked: s.autoClickShipping,
          onChange: set("autoClickShipping")
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        className: "w-full",
        onClick: () => onSave(s),
        disabled: saving,
        "data-ocid": "autofill-settings.facebook.save_button",
        children: [
          saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 mr-2 animate-spin" }) : null,
          saving ? "Saving…" : "💾 Save Facebook Settings"
        ]
      }
    )
  ] });
}
function MecariSettingsPanel({
  config,
  onSave,
  saving
}) {
  const [s, setS] = reactExports.useState({
    prefillTitle: config.mecariPrefillTitle,
    prefillDescription: config.mecariPrefillDescription,
    prefillPrice: config.mecariPrefillPrice,
    prefillBrand: config.mecariPrefillBrand,
    prefillCategory: config.mecariPrefillCategory,
    prefillCondition: config.mecariPrefillCondition,
    autoSelectDeliveryDays: config.mecariAutoSelectDeliveryDays,
    deliveryDaysValue: toNum(config.mecariDeliveryDaysValue) || 3,
    autoSelectShipping: config.mecariAutoSelectShipping,
    shippingType: typeof config.mecariShippingType === "string" ? config.mecariShippingType : "normal"
  });
  const set = (key) => (v) => setS((prev) => ({ ...prev, [key]: v }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-400 uppercase tracking-widest", children: "Prefill Fields" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        CheckRow,
        {
          id: "mecari-title",
          label: "Title",
          checked: s.prefillTitle,
          onChange: set("prefillTitle")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        CheckRow,
        {
          id: "mecari-description",
          label: "Description",
          checked: s.prefillDescription,
          onChange: set("prefillDescription")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        CheckRow,
        {
          id: "mecari-price",
          label: "Price",
          checked: s.prefillPrice,
          onChange: set("prefillPrice")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        CheckRow,
        {
          id: "mecari-brand",
          label: "Brand (Required)",
          checked: s.prefillBrand,
          onChange: set("prefillBrand")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        CheckRow,
        {
          id: "mecari-category",
          label: "Category",
          checked: s.prefillCategory,
          onChange: set("prefillCategory")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        CheckRow,
        {
          id: "mecari-condition",
          label: "Condition (1–5 scale)",
          checked: s.prefillCondition,
          onChange: set("prefillCondition")
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-gray-700 pt-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-400 uppercase tracking-widest", children: "Auto-Select Options" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        CheckRow,
        {
          id: "mecari-delivery-auto",
          label: "Auto-Select Delivery Days",
          checked: s.autoSelectDeliveryDays,
          onChange: set("autoSelectDeliveryDays")
        }
      ),
      s.autoSelectDeliveryDays && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-7 space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "mecari-delivery-days",
            className: "text-xs text-gray-400",
            children: "Default Days (1–7):"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "mecari-delivery-days",
            type: "number",
            min: 1,
            max: 7,
            value: s.deliveryDaysValue,
            onChange: (e) => setS((prev) => ({
              ...prev,
              deliveryDaysValue: Math.min(
                7,
                Math.max(1, Number.parseInt(e.target.value) || 3)
              )
            })),
            className: "w-20 px-2 py-1 bg-gray-700 border border-gray-600 text-white rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500",
            "data-ocid": "autofill-settings.mecari.delivery_days.input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        CheckRow,
        {
          id: "mecari-shipping-auto",
          label: "Auto-Select Shipping",
          checked: s.autoSelectShipping,
          onChange: set("autoSelectShipping")
        }
      ),
      s.autoSelectShipping && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-7 space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "mecari-shipping-type",
            className: "text-xs text-gray-400",
            children: "Shipping Type:"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            id: "mecari-shipping-type",
            value: s.shippingType,
            onChange: (e) => setS((prev) => ({ ...prev, shippingType: e.target.value })),
            className: "w-full px-3 py-1.5 bg-gray-700 border border-gray-600 text-white rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500",
            "data-ocid": "autofill-settings.mecari.shipping_type.select",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "normal", children: "Normal (2–4 days)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "fast", children: "Fast (1–2 days)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "same-day", children: "Same Day" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        className: "w-full",
        onClick: () => onSave(s),
        disabled: saving,
        "data-ocid": "autofill-settings.mecari.save_button",
        children: [
          saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 mr-2 animate-spin" }) : null,
          saving ? "Saving…" : "💾 Save Mecari Settings"
        ]
      }
    )
  ] });
}
function AdminAutofillConfigPage() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [selectedPlatform, setSelectedPlatform] = reactExports.useState("facebook");
  const [testResult, setTestResult] = reactExports.useState(null);
  const enabled = !!actor && !isFetching;
  const { data: configs = [], isLoading: configsLoading } = useQuery({
    queryKey: ["autofillConfigs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAutofillConfigs();
    },
    enabled
  });
  const { data: healthStatuses = [], isLoading: healthLoading } = useQuery({
    queryKey: ["autofillHealth"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAutofillHealthStatus();
    },
    enabled,
    refetchInterval: 3e4
  });
  const toggleMutation = useMutation({
    mutationFn: async ({
      platform,
      isEnabled
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.setAutofillPlatformEnabled(
        platform,
        isEnabled
      );
      if (result == null ? void 0 : result.err) throw new Error(result.err);
      return result;
    },
    onSuccess: (_data, vars) => {
      ue.success(
        `Autofill ${vars.isEnabled ? "enabled" : "disabled"} for ${vars.platform}`
      );
      queryClient.invalidateQueries({ queryKey: ["autofillConfigs"] });
      queryClient.invalidateQueries({ queryKey: ["autofillHealth"] });
    },
    onError: (err) => ue.error(err instanceof Error ? err.message : "Toggle failed")
  });
  const fbMutation = useMutation({
    mutationFn: async (s) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.updateFacebookAutofillSettings(
        s.prefillTitle,
        s.prefillDescription,
        s.prefillPrice,
        s.prefillCategory,
        s.prefillCondition,
        s.autoClickLocalPickup,
        s.autoClickShipping
      );
      if (result == null ? void 0 : result.err) throw new Error(result.err);
    },
    onSuccess: () => {
      ue.success("Facebook autofill settings saved");
      queryClient.invalidateQueries({ queryKey: ["autofillConfigs"] });
    },
    onError: (err) => ue.error(err instanceof Error ? err.message : "Save failed")
  });
  const mecariMutation = useMutation({
    mutationFn: async (s) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.updateMecariAutofillSettings(
        s.prefillTitle,
        s.prefillDescription,
        s.prefillPrice,
        s.prefillBrand,
        s.prefillCategory,
        s.prefillCondition,
        s.autoSelectDeliveryDays,
        s.deliveryDaysValue > 0 ? [s.deliveryDaysValue] : [],
        s.autoSelectShipping,
        s.shippingType ? [s.shippingType] : []
      );
      if (result == null ? void 0 : result.err) throw new Error(result.err);
    },
    onSuccess: () => {
      ue.success("Mecari autofill settings saved");
      queryClient.invalidateQueries({ queryKey: ["autofillConfigs"] });
    },
    onError: (err) => ue.error(err instanceof Error ? err.message : "Save failed")
  });
  const testMutation = useMutation({
    mutationFn: async (platform) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.testAutofill(
        platform
      );
    },
    onSuccess: (result) => {
      setTestResult(result);
      if (result.success) {
        ue.success(`Autofill test passed for ${result.platform}`);
      } else {
        ue.warning(`Autofill test: ${result.message}`);
      }
      queryClient.invalidateQueries({ queryKey: ["autofillHealth"] });
    },
    onError: (err) => ue.error(err instanceof Error ? err.message : "Test failed")
  });
  const currentConfig = configs.find(
    (c) => c.platformName === selectedPlatform
  );
  const loading = configsLoading || healthLoading;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { title: "Autofill Config", subtitle: "Extension Settings", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 rounded-xl bg-card neon-border-blue p-5 relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 retro-grid opacity-10 pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-6 w-6 text-primary shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-bold tracking-wider text-foreground text-glow-blue uppercase", children: "Extension Autofill Control" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[11px] text-muted-foreground mt-0.5", children: "Configure autofill behaviour per platform for extension v1.3+" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "outline",
            className: "ml-auto font-mono text-[9px] uppercase tracking-widest text-primary border-primary/50 bg-primary/10",
            children: "v1.3"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-6", "data-ocid": "autofill.health_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-mono text-xs text-muted-foreground uppercase tracking-widest mb-3", children: "Platform Health" }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: ["a", "b", "c"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-lg border border-gray-700 p-4 space-y-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-3/4" })
          ]
        },
        k
      )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: healthStatuses.map((h) => {
        var _a;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          HealthCard,
          {
            health: h,
            onToggle: () => toggleMutation.mutate({
              platform: h.platformName,
              isEnabled: !h.enabled
            }),
            toggling: toggleMutation.isPending && ((_a = toggleMutation.variables) == null ? void 0 : _a.platform) === h.platformName
          },
          h.platformName
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mb-5", "data-ocid": "autofill.platform.tab", children: ["facebook", "mecari"].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => {
          setSelectedPlatform(p);
          setTestResult(null);
        },
        className: `flex-1 px-4 py-2.5 rounded font-mono text-xs uppercase tracking-widest transition-smooth ${selectedPlatform === p ? "bg-primary/20 text-primary neon-border-blue" : "bg-card border border-border/40 text-muted-foreground hover:text-foreground hover:bg-secondary/40"}`,
        "data-ocid": `autofill.platform.${p}.tab`,
        children: p === "facebook" ? "📘 Facebook" : "🏯 Mercari"
      },
      p
    )) }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl bg-card border border-border/40 p-5 space-y-4", children: [0, 1, 2, 3, 4].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }, k)) }) : currentConfig ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl bg-card border border-border/40 p-5 space-y-5",
        "data-ocid": `autofill.${selectedPlatform}.settings_panel`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-xs font-bold tracking-wider text-foreground uppercase", children: [
                selectedPlatform === "facebook" ? "Facebook Marketplace" : "Mercari",
                " ",
                "Settings"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => toggleMutation.mutate({
                  platform: selectedPlatform,
                  isEnabled: !currentConfig.enabled
                }),
                className: `font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 rounded border transition-smooth ${currentConfig.enabled ? "text-green-400 border-green-500/50 bg-green-900/20 hover:bg-green-900/40" : "text-red-400 border-red-500/50 bg-red-900/20 hover:bg-red-900/40"}`,
                "data-ocid": `autofill.${selectedPlatform}.master_toggle`,
                children: currentConfig.enabled ? "✅ Enabled" : "❌ Disabled"
              }
            )
          ] }),
          selectedPlatform === "facebook" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            FacebookSettingsPanel,
            {
              config: currentConfig,
              onSave: (s) => fbMutation.mutate(s),
              saving: fbMutation.isPending
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            MecariSettingsPanel,
            {
              config: currentConfig,
              onSave: (s) => mecariMutation.mutate(s),
              saving: mecariMutation.isPending
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl bg-card border border-border/40 p-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-muted-foreground", children: [
      "No config found for ",
      selectedPlatform,
      ". Backend may not have initialized it yet."
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "mt-5 rounded-xl bg-blue-900/10 border border-blue-500/40 p-5",
        "data-ocid": "autofill.test_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-mono text-xs text-blue-300 uppercase tracking-widest", children: "Test Autofill Configuration" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "font-mono text-[10px] uppercase tracking-widest border-blue-500/50 text-blue-300 hover:bg-blue-900/30",
                onClick: () => testMutation.mutate(selectedPlatform),
                disabled: testMutation.isPending,
                "data-ocid": "autofill.test_button",
                children: [
                  testMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5 mr-1.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5 mr-1.5" }),
                  testMutation.isPending ? "Testing…" : "Run Test"
                ]
              }
            )
          ] }),
          testResult && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs space-y-2", "data-ocid": "autofill.test_result", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: testResult.success ? "text-green-400" : "text-yellow-400",
                children: testResult.message
              }
            ),
            testResult.fieldsPrepped.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-green-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "Ready: " }),
              testResult.fieldsPrepped.join(", ")
            ] }),
            testResult.fieldsFailed.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-red-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "Disabled: " }),
              testResult.fieldsFailed.join(", ")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-gray-500", children: [
              "Duration: ",
              toNum(testResult.duration),
              "ms"
            ] })
          ] })
        ]
      }
    )
  ] });
}
export {
  AdminAutofillConfigPage
};

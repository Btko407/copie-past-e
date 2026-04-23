import { createActor } from "@/backend";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Settings,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorAny = any;

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlatformAutofillConfig {
  platformName: string;
  enabled: boolean;
  lastUpdated: bigint;
  updatedBy: string;
  fbPrefillTitle: boolean;
  fbPrefillDescription: boolean;
  fbPrefillPrice: boolean;
  fbPrefillCategory: boolean;
  fbPrefillCondition: boolean;
  fbAutoClickLocalPickup: boolean;
  fbAutoClickShipping: boolean;
  mecariPrefillTitle: boolean;
  mecariPrefillDescription: boolean;
  mecariPrefillPrice: boolean;
  mecariPrefillBrand: boolean;
  mecariPrefillCategory: boolean;
  mecariPrefillCondition: boolean;
  mecariAutoSelectDeliveryDays: boolean;
  mecariDeliveryDaysValue?: bigint | number | null;
  mecariAutoSelectShipping: boolean;
  mecariShippingType?: string | null;
}

interface AutofillHealthStatus {
  platformName: string;
  enabled: boolean;
  isHealthy: boolean;
  lastTestAt?: bigint | null;
  activeSessions: bigint | number;
  successRate: number;
  totalAttempts: bigint | number;
  totalSuccessful: bigint | number;
}

interface AutofillTestResult {
  platform: string;
  success: boolean;
  fieldsPrepped: string[];
  fieldsFailed: string[];
  duration: bigint | number;
  message: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toNum(v: bigint | number | null | undefined): number {
  if (v === null || v === undefined) return 0;
  return typeof v === "bigint" ? Number(v) : v;
}

function platformDisplayName(name: string): string {
  if (name === "facebook") return "📘 Facebook Marketplace";
  if (name === "mecari") return "🏯 Mercari";
  if (name === "offerUp") return "🛍️ OfferUp";
  return name;
}

// ─── Health card ──────────────────────────────────────────────────────────────

function HealthCard({
  health,
  onToggle,
  toggling,
}: {
  health: AutofillHealthStatus;
  onToggle: () => void;
  toggling: boolean;
}) {
  const rate = (health.successRate * 100).toFixed(1);
  const healthy = health.isHealthy;

  return (
    <div
      className={`p-4 rounded-lg border ${
        healthy
          ? "bg-green-900/10 border-green-500/60"
          : "bg-yellow-900/10 border-yellow-500/60"
      }`}
      data-ocid={`autofill-health-card.${health.platformName}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-white text-sm">
          {platformDisplayName(health.platformName)}
        </span>
        {healthy ? (
          <CheckCircle2 className="h-5 w-5 text-green-400" />
        ) : (
          <AlertCircle className="h-5 w-5 text-yellow-400" />
        )}
      </div>
      <div className="space-y-1 text-xs text-gray-400">
        <div className="flex justify-between">
          <span>Status</span>
          <span className={health.enabled ? "text-green-400" : "text-red-400"}>
            {health.enabled ? "Enabled" : "Disabled"}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Success Rate</span>
          <span className="text-gray-300">{rate}%</span>
        </div>
        <div className="flex justify-between">
          <span>Sessions</span>
          <span className="text-gray-300">
            {toNum(health.activeSessions)} active
          </span>
        </div>
        <div className="flex justify-between">
          <span>Total</span>
          <span className="text-gray-300">
            {toNum(health.totalSuccessful)}/{toNum(health.totalAttempts)} ok
          </span>
        </div>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="w-full mt-3 font-mono text-[10px] uppercase tracking-widest h-8"
        onClick={onToggle}
        disabled={toggling}
        data-ocid={`autofill-health-card.${health.platformName}.toggle`}
      >
        {toggling ? <RefreshCw className="h-3 w-3 mr-1 animate-spin" /> : null}
        {health.enabled ? "Disable" : "Enable"}
      </Button>
    </div>
  );
}

// ─── Checkbox row ─────────────────────────────────────────────────────────────

function CheckRow({
  label,
  checked,
  onChange,
  id,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-3 cursor-pointer group"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus-visible:ring-blue-500"
        data-ocid={`autofill-settings.${id}.checkbox`}
      />
      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
        {label}
      </span>
    </label>
  );
}

// ─── Facebook settings panel ──────────────────────────────────────────────────

interface FbSettings {
  prefillTitle: boolean;
  prefillDescription: boolean;
  prefillPrice: boolean;
  prefillCategory: boolean;
  prefillCondition: boolean;
  autoClickLocalPickup: boolean;
  autoClickShipping: boolean;
}

function FacebookSettingsPanel({
  config,
  onSave,
  saving,
}: {
  config: PlatformAutofillConfig;
  onSave: (s: FbSettings) => void;
  saving: boolean;
}) {
  const [s, setS] = useState<FbSettings>({
    prefillTitle: config.fbPrefillTitle,
    prefillDescription: config.fbPrefillDescription,
    prefillPrice: config.fbPrefillPrice,
    prefillCategory: config.fbPrefillCategory,
    prefillCondition: config.fbPrefillCondition,
    autoClickLocalPickup: config.fbAutoClickLocalPickup,
    autoClickShipping: config.fbAutoClickShipping,
  });

  const set = (key: keyof FbSettings) => (v: boolean) =>
    setS((prev) => ({ ...prev, [key]: v }));

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Prefill Fields
        </p>
        <CheckRow
          id="fb-title"
          label="Title"
          checked={s.prefillTitle}
          onChange={set("prefillTitle")}
        />
        <CheckRow
          id="fb-description"
          label="Description"
          checked={s.prefillDescription}
          onChange={set("prefillDescription")}
        />
        <CheckRow
          id="fb-price"
          label="Price"
          checked={s.prefillPrice}
          onChange={set("prefillPrice")}
        />
        <CheckRow
          id="fb-category"
          label="Category"
          checked={s.prefillCategory}
          onChange={set("prefillCategory")}
        />
        <CheckRow
          id="fb-condition"
          label="Condition"
          checked={s.prefillCondition}
          onChange={set("prefillCondition")}
        />
      </div>
      <div className="border-t border-gray-700 pt-4 space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Auto-Click
        </p>
        <CheckRow
          id="fb-local-pickup"
          label="Local Pickup"
          checked={s.autoClickLocalPickup}
          onChange={set("autoClickLocalPickup")}
        />
        <CheckRow
          id="fb-shipping"
          label="Shipping Available"
          checked={s.autoClickShipping}
          onChange={set("autoClickShipping")}
        />
      </div>
      <Button
        className="w-full"
        onClick={() => onSave(s)}
        disabled={saving}
        data-ocid="autofill-settings.facebook.save_button"
      >
        {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : null}
        {saving ? "Saving…" : "💾 Save Facebook Settings"}
      </Button>
    </div>
  );
}

// ─── Mecari settings panel ────────────────────────────────────────────────────

interface MecariSettings {
  prefillTitle: boolean;
  prefillDescription: boolean;
  prefillPrice: boolean;
  prefillBrand: boolean;
  prefillCategory: boolean;
  prefillCondition: boolean;
  autoSelectDeliveryDays: boolean;
  deliveryDaysValue: number;
  autoSelectShipping: boolean;
  shippingType: string;
}

function MecariSettingsPanel({
  config,
  onSave,
  saving,
}: {
  config: PlatformAutofillConfig;
  onSave: (s: MecariSettings) => void;
  saving: boolean;
}) {
  const [s, setS] = useState<MecariSettings>({
    prefillTitle: config.mecariPrefillTitle,
    prefillDescription: config.mecariPrefillDescription,
    prefillPrice: config.mecariPrefillPrice,
    prefillBrand: config.mecariPrefillBrand,
    prefillCategory: config.mecariPrefillCategory,
    prefillCondition: config.mecariPrefillCondition,
    autoSelectDeliveryDays: config.mecariAutoSelectDeliveryDays,
    deliveryDaysValue: toNum(config.mecariDeliveryDaysValue) || 3,
    autoSelectShipping: config.mecariAutoSelectShipping,
    shippingType:
      typeof config.mecariShippingType === "string"
        ? config.mecariShippingType
        : "normal",
  });

  const set = (key: keyof MecariSettings) => (v: boolean) =>
    setS((prev) => ({ ...prev, [key]: v }));

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Prefill Fields
        </p>
        <CheckRow
          id="mecari-title"
          label="Title"
          checked={s.prefillTitle}
          onChange={set("prefillTitle")}
        />
        <CheckRow
          id="mecari-description"
          label="Description"
          checked={s.prefillDescription}
          onChange={set("prefillDescription")}
        />
        <CheckRow
          id="mecari-price"
          label="Price"
          checked={s.prefillPrice}
          onChange={set("prefillPrice")}
        />
        <CheckRow
          id="mecari-brand"
          label="Brand (Required)"
          checked={s.prefillBrand}
          onChange={set("prefillBrand")}
        />
        <CheckRow
          id="mecari-category"
          label="Category"
          checked={s.prefillCategory}
          onChange={set("prefillCategory")}
        />
        <CheckRow
          id="mecari-condition"
          label="Condition (1–5 scale)"
          checked={s.prefillCondition}
          onChange={set("prefillCondition")}
        />
      </div>

      <div className="border-t border-gray-700 pt-4 space-y-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Auto-Select Options
        </p>
        <CheckRow
          id="mecari-delivery-auto"
          label="Auto-Select Delivery Days"
          checked={s.autoSelectDeliveryDays}
          onChange={set("autoSelectDeliveryDays")}
        />
        {s.autoSelectDeliveryDays && (
          <div className="ml-7 space-y-1">
            <label
              htmlFor="mecari-delivery-days"
              className="text-xs text-gray-400"
            >
              Default Days (1–7):
            </label>
            <input
              id="mecari-delivery-days"
              type="number"
              min={1}
              max={7}
              value={s.deliveryDaysValue}
              onChange={(e) =>
                setS((prev) => ({
                  ...prev,
                  deliveryDaysValue: Math.min(
                    7,
                    Math.max(1, Number.parseInt(e.target.value) || 3),
                  ),
                }))
              }
              className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 text-white rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              data-ocid="autofill-settings.mecari.delivery_days.input"
            />
          </div>
        )}
        <CheckRow
          id="mecari-shipping-auto"
          label="Auto-Select Shipping"
          checked={s.autoSelectShipping}
          onChange={set("autoSelectShipping")}
        />
        {s.autoSelectShipping && (
          <div className="ml-7 space-y-1">
            <label
              htmlFor="mecari-shipping-type"
              className="text-xs text-gray-400"
            >
              Shipping Type:
            </label>
            <select
              id="mecari-shipping-type"
              value={s.shippingType}
              onChange={(e) =>
                setS((prev) => ({ ...prev, shippingType: e.target.value }))
              }
              className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 text-white rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              data-ocid="autofill-settings.mecari.shipping_type.select"
            >
              <option value="normal">Normal (2–4 days)</option>
              <option value="fast">Fast (1–2 days)</option>
              <option value="same-day">Same Day</option>
            </select>
          </div>
        )}
      </div>

      <Button
        className="w-full"
        onClick={() => onSave(s)}
        disabled={saving}
        data-ocid="autofill-settings.mecari.save_button"
      >
        {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : null}
        {saving ? "Saving…" : "💾 Save Mecari Settings"}
      </Button>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function AdminAutofillConfigPage() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [selectedPlatform, setSelectedPlatform] = useState<
    "facebook" | "mecari"
  >("facebook");
  const [testResult, setTestResult] = useState<AutofillTestResult | null>(null);

  const enabled = !!actor && !isFetching;

  const { data: configs = [], isLoading: configsLoading } = useQuery<
    PlatformAutofillConfig[]
  >({
    queryKey: ["autofillConfigs"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as ActorAny).getAllAutofillConfigs();
    },
    enabled,
  });

  const { data: healthStatuses = [], isLoading: healthLoading } = useQuery<
    AutofillHealthStatus[]
  >({
    queryKey: ["autofillHealth"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as ActorAny).getAutofillHealthStatus();
    },
    enabled,
    refetchInterval: 30_000,
  });

  const toggleMutation = useMutation({
    mutationFn: async ({
      platform,
      isEnabled,
    }: { platform: string; isEnabled: boolean }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await (actor as ActorAny).setAutofillPlatformEnabled(
        platform,
        isEnabled,
      );
      if (result?.err) throw new Error(result.err);
      return result;
    },
    onSuccess: (_data, vars) => {
      toast.success(
        `Autofill ${vars.isEnabled ? "enabled" : "disabled"} for ${vars.platform}`,
      );
      queryClient.invalidateQueries({ queryKey: ["autofillConfigs"] });
      queryClient.invalidateQueries({ queryKey: ["autofillHealth"] });
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Toggle failed"),
  });

  const fbMutation = useMutation({
    mutationFn: async (s: FbSettings) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await (actor as ActorAny).updateFacebookAutofillSettings(
        s.prefillTitle,
        s.prefillDescription,
        s.prefillPrice,
        s.prefillCategory,
        s.prefillCondition,
        s.autoClickLocalPickup,
        s.autoClickShipping,
      );
      if (result?.err) throw new Error(result.err);
    },
    onSuccess: () => {
      toast.success("Facebook autofill settings saved");
      queryClient.invalidateQueries({ queryKey: ["autofillConfigs"] });
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Save failed"),
  });

  const mecariMutation = useMutation({
    mutationFn: async (s: MecariSettings) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await (actor as ActorAny).updateMecariAutofillSettings(
        s.prefillTitle,
        s.prefillDescription,
        s.prefillPrice,
        s.prefillBrand,
        s.prefillCategory,
        s.prefillCondition,
        s.autoSelectDeliveryDays,
        s.deliveryDaysValue > 0 ? [s.deliveryDaysValue] : [],
        s.autoSelectShipping,
        s.shippingType ? [s.shippingType] : [],
      );
      if (result?.err) throw new Error(result.err);
    },
    onSuccess: () => {
      toast.success("Mecari autofill settings saved");
      queryClient.invalidateQueries({ queryKey: ["autofillConfigs"] });
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Save failed"),
  });

  const testMutation = useMutation({
    mutationFn: async (platform: string) => {
      if (!actor) throw new Error("Actor not ready");
      return (actor as ActorAny).testAutofill(
        platform,
      ) as Promise<AutofillTestResult>;
    },
    onSuccess: (result) => {
      setTestResult(result);
      if (result.success) {
        toast.success(`Autofill test passed for ${result.platform}`);
      } else {
        toast.warning(`Autofill test: ${result.message}`);
      }
      queryClient.invalidateQueries({ queryKey: ["autofillHealth"] });
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Test failed"),
  });

  const currentConfig = configs.find(
    (c) => c.platformName === selectedPlatform,
  );
  const loading = configsLoading || healthLoading;

  return (
    <AdminLayout title="Autofill Config" subtitle="Extension Settings">
      {/* Page header */}
      <div className="mb-6 rounded-xl bg-card neon-border-blue p-5 relative overflow-hidden">
        <div className="absolute inset-0 retro-grid opacity-10 pointer-events-none" />
        <div className="relative flex items-center gap-3">
          <Zap className="h-6 w-6 text-primary shrink-0" />
          <div>
            <h2 className="font-display text-sm font-bold tracking-wider text-foreground text-glow-blue uppercase">
              Extension Autofill Control
            </h2>
            <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
              Configure autofill behaviour per platform for extension v1.3+
            </p>
          </div>
          <Badge
            variant="outline"
            className="ml-auto font-mono text-[9px] uppercase tracking-widest text-primary border-primary/50 bg-primary/10"
          >
            v1.3
          </Badge>
        </div>
      </div>

      {/* Health overview */}
      <section className="mb-6" data-ocid="autofill.health_section">
        <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-3">
          Platform Health
        </h3>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {["a", "b", "c"].map((k) => (
              <div
                key={k}
                className="rounded-lg border border-gray-700 p-4 space-y-2"
              >
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {healthStatuses.map((h) => (
              <HealthCard
                key={h.platformName}
                health={h}
                onToggle={() =>
                  toggleMutation.mutate({
                    platform: h.platformName,
                    isEnabled: !h.enabled,
                  })
                }
                toggling={
                  toggleMutation.isPending &&
                  toggleMutation.variables?.platform === h.platformName
                }
              />
            ))}
          </div>
        )}
      </section>

      {/* Platform selector tabs */}
      <div className="flex gap-2 mb-5" data-ocid="autofill.platform.tab">
        {(["facebook", "mecari"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => {
              setSelectedPlatform(p);
              setTestResult(null);
            }}
            className={`flex-1 px-4 py-2.5 rounded font-mono text-xs uppercase tracking-widest transition-smooth ${
              selectedPlatform === p
                ? "bg-primary/20 text-primary neon-border-blue"
                : "bg-card border border-border/40 text-muted-foreground hover:text-foreground hover:bg-secondary/40"
            }`}
            data-ocid={`autofill.platform.${p}.tab`}
          >
            {p === "facebook" ? "📘 Facebook" : "🏯 Mercari"}
          </button>
        ))}
      </div>

      {/* Platform settings */}
      {loading ? (
        <div className="rounded-xl bg-card border border-border/40 p-5 space-y-4">
          {[0, 1, 2, 3, 4].map((k) => (
            <Skeleton key={k} className="h-4 w-full" />
          ))}
        </div>
      ) : currentConfig ? (
        <div
          className="rounded-xl bg-card border border-border/40 p-5 space-y-5"
          data-ocid={`autofill.${selectedPlatform}.settings_panel`}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span className="font-display text-xs font-bold tracking-wider text-foreground uppercase">
                {selectedPlatform === "facebook"
                  ? "Facebook Marketplace"
                  : "Mercari"}{" "}
                Settings
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                toggleMutation.mutate({
                  platform: selectedPlatform,
                  isEnabled: !currentConfig.enabled,
                })
              }
              className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 rounded border transition-smooth ${
                currentConfig.enabled
                  ? "text-green-400 border-green-500/50 bg-green-900/20 hover:bg-green-900/40"
                  : "text-red-400 border-red-500/50 bg-red-900/20 hover:bg-red-900/40"
              }`}
              data-ocid={`autofill.${selectedPlatform}.master_toggle`}
            >
              {currentConfig.enabled ? "✅ Enabled" : "❌ Disabled"}
            </button>
          </div>

          {/* Field settings */}
          {selectedPlatform === "facebook" ? (
            <FacebookSettingsPanel
              config={currentConfig}
              onSave={(s) => fbMutation.mutate(s)}
              saving={fbMutation.isPending}
            />
          ) : (
            <MecariSettingsPanel
              config={currentConfig}
              onSave={(s) => mecariMutation.mutate(s)}
              saving={mecariMutation.isPending}
            />
          )}
        </div>
      ) : (
        <div className="rounded-xl bg-card border border-border/40 p-8 text-center">
          <p className="font-mono text-xs text-muted-foreground">
            No config found for {selectedPlatform}. Backend may not have
            initialized it yet.
          </p>
        </div>
      )}

      {/* Test autofill */}
      <div
        className="mt-5 rounded-xl bg-blue-900/10 border border-blue-500/40 p-5"
        data-ocid="autofill.test_section"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-mono text-xs text-blue-300 uppercase tracking-widest">
            Test Autofill Configuration
          </h3>
          <Button
            variant="outline"
            size="sm"
            className="font-mono text-[10px] uppercase tracking-widest border-blue-500/50 text-blue-300 hover:bg-blue-900/30"
            onClick={() => testMutation.mutate(selectedPlatform)}
            disabled={testMutation.isPending}
            data-ocid="autofill.test_button"
          >
            {testMutation.isPending ? (
              <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
            ) : (
              <Zap className="h-3.5 w-3.5 mr-1.5" />
            )}
            {testMutation.isPending ? "Testing…" : "Run Test"}
          </Button>
        </div>

        {testResult && (
          <div className="text-xs space-y-2" data-ocid="autofill.test_result">
            <div
              className={
                testResult.success ? "text-green-400" : "text-yellow-400"
              }
            >
              {testResult.message}
            </div>
            {testResult.fieldsPrepped.length > 0 && (
              <div className="text-green-300">
                <span className="text-gray-500">Ready: </span>
                {testResult.fieldsPrepped.join(", ")}
              </div>
            )}
            {testResult.fieldsFailed.length > 0 && (
              <div className="text-red-300">
                <span className="text-gray-500">Disabled: </span>
                {testResult.fieldsFailed.join(", ")}
              </div>
            )}
            <div className="text-gray-500">
              Duration: {toNum(testResult.duration)}ms
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ExtensionListingData {
  title: string;
  description?: string;
  price?: string;
  imageUrls: string[];
  platform: "facebookMarketplace" | "mecari" | "offerUp" | "unknown";
  fbCategory?: string;
  fbCondition?: string;
  mecariBrand?: string;
  mecariCondition?: string;
  mecariDeliveryDays?: number;
  imageFileTypes: string[];
}

interface ValidationResult {
  valid: boolean;
  warnings: string[];
  errors: string[];
  platformReady: boolean;
}

interface ExtensionAutofillValidatorProps {
  data: ExtensionListingData;
  onValidationResult?: (result: ValidationResult) => void;
}

// ─── Platform label helpers ───────────────────────────────────────────────────

function platformLabel(platform: ExtensionListingData["platform"]): string {
  switch (platform) {
    case "facebookMarketplace":
      return "Facebook Marketplace";
    case "mecari":
      return "Mercari";
    case "offerUp":
      return "OfferUp";
    default:
      return "Unknown Platform";
  }
}

function platformRequiredFields(
  platform: ExtensionListingData["platform"],
): string {
  switch (platform) {
    case "mecari":
      return "Required: Brand, Condition (1–5), Delivery Days (1–7), Price";
    case "facebookMarketplace":
      return "Required: Price, Category";
    case "offerUp":
      return "Required: Price";
    default:
      return "";
  }
}

// ─── Field check tile ─────────────────────────────────────────────────────────

function FieldTile({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      {ok ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0" />
      ) : (
        <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />
      )}
      <span
        className={`text-xs font-mono ${ok ? "text-green-300" : "text-red-300"}`}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ExtensionAutofillValidator({
  data,
  onValidationResult,
}: ExtensionAutofillValidatorProps) {
  const { actor, isFetching } = useActor(createActor);

  const { data: validation, isLoading } = useQuery<ValidationResult>({
    queryKey: ["validateAutofill", data],
    queryFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (actor as any).validateAutofillData(data);
      if (onValidationResult) onValidationResult(result as ValidationResult);
      return result as ValidationResult;
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });

  if (isLoading || !validation) {
    return (
      <div className="rounded-lg bg-gray-800 border border-gray-700 p-4 animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-48 mb-3" />
        <div className="h-3 bg-gray-700 rounded w-full mb-2" />
        <div className="h-3 bg-gray-700 rounded w-3/4" />
      </div>
    );
  }

  const reqFields = platformRequiredFields(data.platform);

  return (
    <div className="space-y-3 p-4 bg-gray-800 rounded-lg border border-gray-700">
      {/* Status header */}
      <div className="flex items-center gap-2">
        {validation.platformReady ? (
          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
        ) : (
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
        )}
        <span className="font-semibold text-sm text-white">
          {validation.platformReady
            ? "✅ Ready to Autofill"
            : "❌ Autofill Issues Found"}
        </span>
      </div>

      {/* Errors (critical) */}
      {validation.errors.length > 0 && (
        <div
          className="bg-red-900/20 border border-red-500/60 p-3 rounded"
          data-ocid="autofill-validator.error_state"
        >
          <h3 className="text-red-400 font-semibold text-xs mb-2 uppercase tracking-wide">
            Errors:
          </h3>
          <ul className="space-y-1">
            {validation.errors.map((error) => (
              <li key={error} className="text-red-300 text-xs flex gap-2">
                <span>•</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings (non-critical) */}
      {validation.warnings.length > 0 && (
        <div
          className="bg-yellow-900/20 border border-yellow-500/60 p-3 rounded"
          data-ocid="autofill-validator.warning_state"
        >
          <h3 className="text-yellow-400 font-semibold text-xs mb-2 uppercase tracking-wide">
            Warnings:
          </h3>
          <ul className="space-y-1">
            {validation.warnings.map((warning) => (
              <li
                key={warning}
                className="text-yellow-300 text-xs flex gap-2 items-start"
              >
                <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Platform info */}
      <div className="bg-blue-900/20 border border-blue-500/60 p-3 rounded">
        <div className="text-blue-300 font-semibold text-sm">
          {platformLabel(data.platform)}
        </div>
        {reqFields && (
          <div className="text-blue-200 text-xs mt-1">{reqFields}</div>
        )}
      </div>

      {/* Field summary grid */}
      <div className="grid grid-cols-2 gap-2">
        <FieldTile label="Title" ok={data.title.length > 0} />
        <FieldTile label="Price" ok={!!data.price} />
        <FieldTile label="Images" ok={data.imageUrls.length > 0} />
        <FieldTile label="Description" ok={!!data.description} />
      </div>
    </div>
  );
}

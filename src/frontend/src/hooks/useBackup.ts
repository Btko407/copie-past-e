/**
 * useBackup — Core backup types, helpers, and hooks.
 *
 * ZIP export is handled in useBackupExport.ts.
 * This file handles: types, JSON backup, restore, and backup history.
 */

import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface BackupListingEntry {
  id: string;
  title: string;
  description: string;
  price?: string;
  category?: string;
  subcategory?: string;
  condition?: string;
  brand?: string;
  type_model?: string;
  source_url?: string;
  created_at: string;
  archived_at?: string;
  pinned: boolean;
  favorited: boolean;
  images?: { filename: string; original_url: string }[];
}

export interface BackupFile {
  version: string;
  backupDate: string;
  userId: string;
  listings: BackupListingEntry[];
  metadata?: { includesImages: boolean };
}

export interface BackupRecord {
  id: string;
  createdAt: string;
  listingCount: number;
  imageCount: number;
  includesImages: boolean;
  downloadUrl?: string;
  /** ISO timestamp — null/undefined means no expiry */
  expiresAt?: string;
}

export interface ZipProgress {
  current: number;
  total: number;
  message: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorAny = any;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr?: string): string {
  const d = dateStr ? new Date(dateStr) : new Date();
  return d.toISOString().split("T")[0];
}

function downloadJson(data: BackupFile, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

// ─── toBackupEntriesFromRaw ────────────────────────────────────────────────────
// Exported for use by useBackupExport.ts

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toBackupEntriesFromRaw(
  rawListings: any[],
): BackupListingEntry[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return rawListings.map((l: any) => ({
    id: l.id?.toString() ?? "",
    title: l.title ?? "",
    description: l.description ?? "",
    price: l.price ?? undefined,
    category: l.category ?? undefined,
    subcategory: l.subcategory ?? undefined,
    condition: l.condition ?? undefined,
    brand: l.brand ?? undefined,
    type_model: l.typeModel ?? l.type_model ?? undefined,
    source_url: l.sourceUrl ?? l.source_url ?? undefined,
    created_at:
      typeof l.createdAt === "bigint"
        ? new Date(Number(l.createdAt) / 1_000_000).toISOString()
        : (l.createdAt ?? new Date().toISOString()),
    archived_at: l.archivedAt
      ? typeof l.archivedAt === "bigint"
        ? new Date(Number(l.archivedAt) / 1_000_000).toISOString()
        : l.archivedAt
      : undefined,
    pinned: !!l.pinned,
    favorited: !!l.favorited,
    images: [],
  }));
}

// ─── initiateBackupPayment ─────────────────────────────────────────────────────

export interface BackupPaymentResult {
  paymentRecordId: number;
  stripeClientSecret: string;
}

export function useInitiateBackupPayment() {
  const { actor } = useActor(createActor);

  return useMutation<BackupPaymentResult, Error, void>({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const a = actor as ActorAny;

      if (typeof a.initiateSmartBackup === "function") {
        const raw = await a.initiateSmartBackup();
        if (raw.__kind__ === "err") throw new Error(raw.err);
        return {
          paymentRecordId: Number(raw.ok.paymentRecordId),
          stripeClientSecret: raw.ok.stripeClientSecret ?? "",
        };
      }

      const raw = await a.initiateTierUpgrade(BigInt(1), "__backup__");
      return {
        paymentRecordId: Number(raw.paymentRecordId),
        stripeClientSecret: raw.stripeClientSecret ?? "",
      };
    },
  });
}

// ─── confirmBackupPayment ──────────────────────────────────────────────────────

export function useConfirmBackupPayment() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { paymentRecordId: number; stripePaymentIntentId: string }
  >({
    mutationFn: async ({ paymentRecordId, stripePaymentIntentId }) => {
      if (!actor) throw new Error("Actor not ready");
      const a = actor as ActorAny;

      if (typeof a.confirmSmartBackupPayment === "function") {
        const raw = await a.confirmSmartBackupPayment(
          BigInt(paymentRecordId),
          stripePaymentIntentId,
        );
        if (raw.__kind__ === "err") throw new Error(raw.err);
      } else {
        await a.confirmStripePayment(
          BigInt(paymentRecordId),
          stripePaymentIntentId,
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBackups"] });
    },
  });
}

// ─── useDownloadBackup (JSON, legacy) ─────────────────────────────────────────

export function useDownloadBackup() {
  const { actor } = useActor(createActor);

  return useMutation<void, Error, { includeImages?: boolean }>({
    mutationFn: async ({ includeImages = false }) => {
      if (!actor) throw new Error("Actor not ready");
      const a = actor as ActorAny;

      let rawListings: ActorAny[] = [];

      if (typeof a.generateBackupData === "function") {
        const result = await a.generateBackupData();
        const data = result.__kind__ === "ok" ? result.ok : result;
        rawListings = Array.isArray(data) ? data : (data?.listings ?? []);
      } else {
        rawListings = await a.listListings();
      }

      const entries = toBackupEntriesFromRaw(rawListings);
      const userId =
        typeof a.getMyProfile === "function"
          ? await a
              .getMyProfile()
              .then((r: ActorAny) => r?.ok?.userId?.toString() ?? "unknown")
              .catch(() => "unknown")
          : "unknown";

      const backupFile: BackupFile = {
        version: "1.0",
        backupDate: new Date().toISOString(),
        userId,
        listings: entries,
        metadata: { includesImages: includeImages },
      };

      const dateStr = formatDate();
      downloadJson(backupFile, `copie-paste-backup-${dateStr}.json`);

      if (typeof a.createBackupRecord === "function") {
        await a
          .createBackupRecord({
            listingCount: BigInt(entries.length),
            includesImages: includeImages,
          })
          .catch(() => null);
      }
    },
  });
}

// ─── getMyBackups ──────────────────────────────────────────────────────────────

export function useGetMyBackups() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<BackupRecord[]>({
    queryKey: ["myBackups"],
    queryFn: async () => {
      if (!actor) return [];
      const a = actor as ActorAny;
      if (typeof a.getMyBackups !== "function") return [];
      const raw = await a.getMyBackups();
      const list = Array.isArray(raw) ? raw : (raw?.ok ?? []);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return list.map((r: any): BackupRecord => {
        const createdAt =
          typeof r.createdAt === "bigint"
            ? new Date(Number(r.createdAt) / 1_000_000).toISOString()
            : (r.createdAt ?? new Date().toISOString());
        // 7-day expiry
        const createdMs = new Date(createdAt).getTime();
        const expiresAt = new Date(
          createdMs + 7 * 24 * 60 * 60 * 1000,
        ).toISOString();

        return {
          id: r.id?.toString() ?? "",
          createdAt,
          listingCount: Number(r.listingCount ?? 0),
          imageCount: Number(r.imageCount ?? 0),
          includesImages: !!r.includesImages,
          downloadUrl: r.downloadUrl ?? undefined,
          expiresAt,
        };
      });
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

// ─── deleteBackup ──────────────────────────────────────────────────────────────

export function useDeleteBackup() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (backupId) => {
      if (!actor) throw new Error("Actor not ready");
      const a = actor as ActorAny;
      if (typeof a.deleteBackupRecord !== "function") return;
      const result = await a.deleteBackupRecord(BigInt(backupId));
      if (result?.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBackups"] });
    },
  });
}

// ─── restoreFromBackup ─────────────────────────────────────────────────────────

export interface RestoreResult {
  restoredCount: number;
}

export function useRestoreFromBackup() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<RestoreResult, Error, BackupListingEntry[]>({
    mutationFn: async (listings) => {
      if (!actor) throw new Error("Actor not ready");
      const a = actor as ActorAny;

      if (typeof a.restoreFromBackup === "function") {
        const payload = listings.map((l) => ({
          title: l.title,
          description: l.description,
          price: l.price ?? null,
          category: l.category ?? null,
          pinned: l.pinned,
          favorited: l.favorited,
        }));
        const result = await a.restoreFromBackup(payload);
        if (result?.__kind__ === "err") throw new Error(result.err);
        return {
          restoredCount: Number(result?.ok?.restoredCount ?? listings.length),
        };
      }

      // Fallback: create each listing individually
      let restoredCount = 0;
      for (const l of listings) {
        try {
          await a.createListing({
            title: l.title,
            description: l.description,
            price: l.price ?? null,
            category: l.category ?? null,
            sourceUrl: null,
          });
          restoredCount++;
        } catch {
          // Continue on individual errors
        }
      }
      return { restoredCount };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["favorited-listings"] });
    },
  });
}

// ─── exportManualBackup (FREE) ─────────────────────────────────────────────────

export function useExportManualBackup() {
  const { actor } = useActor(createActor);

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const a = actor as ActorAny;

      let rawListings: ActorAny[] = [];

      if (typeof a.generateBackupData === "function") {
        const result = await a.generateBackupData();
        const data = result.__kind__ === "ok" ? result.ok : result;
        rawListings = Array.isArray(data) ? data : (data?.listings ?? []);
      } else {
        rawListings = await a.listListings();
      }

      const entries = toBackupEntriesFromRaw(rawListings);

      const backupFile: BackupFile = {
        version: "1.0",
        backupDate: new Date().toISOString(),
        userId: "unknown",
        listings: entries,
        metadata: { includesImages: false },
      };

      const dateStr = formatDate();
      downloadJson(backupFile, `copie-paste-manual-export-${dateStr}.json`);
    },
  });
}

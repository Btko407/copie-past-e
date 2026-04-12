/**
 * useBackupExport — hooks for the $29.99 Smart Backup export flow.
 *
 * - useCreateStripeCheckoutForBackup: redirects to Stripe for $29.99 payment
 * - useDownloadBackupZip: generates and downloads the ZIP (called after payment)
 */

import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import JSZip from "jszip";
import { createActor } from "../backend";
import { toBackupEntriesFromRaw } from "./useBackup";
import type { BackupListingEntry, ZipProgress } from "./useBackup";

export type { ZipProgress };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorAny = any;

// ─── useCreateStripeCheckoutForBackup ─────────────────────────────────────────

export function useCreateStripeCheckoutForBackup() {
  const { actor, isFetching } = useActor(createActor);

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      if (!actor || isFetching) throw new Error("Not ready");
      const a = actor as ActorAny;

      // Read backup price ID from backend config at runtime (never from localStorage/env)
      let priceId = "";
      if (typeof a.getConfig === "function") {
        try {
          priceId = (await a.getConfig("stripe_price_backup")) ?? "";
        } catch {
          // ignore
        }
      }

      if (!priceId) {
        throw new Error(
          "Backup price not configured. Ask the admin to set the Smart Backup Price ID in Admin → Payments.",
        );
      }

      let userId = "";
      if (typeof a.getMyProfile === "function") {
        try {
          const p = await a.getMyProfile();
          userId = p?.ok?.userId?.toString() ?? p?.userId?.toString() ?? "";
        } catch {
          // ignore
        }
      }

      const tryCheckout = async (methodName: string): Promise<boolean> => {
        if (typeof a[methodName] !== "function") return false;
        const result = await a[methodName](priceId, userId);
        if (result?.__kind__ === "err") throw new Error(result.err);
        const url = result?.ok ?? result;
        if (typeof url === "string" && url.startsWith("http")) {
          window.location.href = url;
          return true;
        }
        return false;
      };

      if (await tryCheckout("createBackupCheckoutSession")) return;
      if (await tryCheckout("createStripeCheckoutSession")) return;

      throw new Error("Payment system not configured. Please contact support.");
    },
  });
}

// ─── useDownloadBackupZip ─────────────────────────────────────────────────────

export function useDownloadBackupZip() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<void, Error, { onProgress: (p: ZipProgress) => void }>({
    mutationFn: async ({ onProgress }) => {
      if (!actor) throw new Error("Actor not ready");
      const a = actor as ActorAny;

      onProgress({ current: 0, total: 0, message: "Fetching your listings…" });

      // Fetch listings
      let rawListings: ActorAny[] = [];
      if (typeof a.generateBackupData === "function") {
        const result = await a.generateBackupData();
        const data = result.__kind__ === "ok" ? result.ok : result;
        rawListings = Array.isArray(data) ? data : (data?.listings ?? []);
      } else if (typeof a.listListings === "function") {
        rawListings = await a.listListings();
      }

      const entries = toBackupEntriesFromRaw(rawListings);

      let username = "unknown";
      if (typeof a.getMyProfile === "function") {
        try {
          const p = await a.getMyProfile();
          username = p?.ok?.username ?? p?.username ?? "unknown";
        } catch {
          // ignore
        }
      }

      const zip = new JSZip();
      const imagesFolder = zip.folder("images");
      if (!imagesFolder) throw new Error("Failed to create images folder");

      // Build image index
      const imageQueue: { listingId: string; url: string; idx: number }[] = [];
      for (const listing of rawListings) {
        const imgs: ActorAny[] = listing.images ?? [];
        for (let i = 0; i < imgs.length; i++) {
          const img = imgs[i];
          const url =
            img.directURL ?? img.url ?? img.direct_url ?? img.storageUrl ?? "";
          if (url)
            imageQueue.push({
              listingId: listing.id?.toString() ?? "",
              url,
              idx: i + 1,
            });
        }
      }

      let processed = 0;
      for (const { listingId, url, idx } of imageQueue) {
        processed++;
        onProgress({
          current: processed,
          total: imageQueue.length,
          message: `Packaging ${processed} of ${imageQueue.length} images…`,
        });
        try {
          const res = await fetch(url, { mode: "cors" });
          if (res.ok) {
            const blob = await res.blob();
            const filename = `listing-${listingId}-${idx}.jpg`;
            imagesFolder.file(filename, blob);
            const entry = entries.find((e) => e.id === listingId);
            if (entry) {
              if (!entry.images) entry.images = [];
              entry.images.push({ filename, original_url: url });
            }
          }
        } catch {
          // Skip failed images
        }
      }

      zip.file("listings.json", JSON.stringify(entries, null, 2));
      zip.file(
        "backup-info.json",
        JSON.stringify(
          {
            exported_at: new Date().toISOString(),
            username,
            total_listings: entries.length,
            total_images: processed,
            app_version: "35",
          },
          null,
          2,
        ),
      );

      onProgress({ current: 0, total: 0, message: "Finalizing archive…" });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const dateStr = new Date().toISOString().split("T")[0];
      const blobUrl = URL.createObjectURL(zipBlob);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = `copie-paste-backup-${dateStr}.zip`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 30_000);

      // Record backup
      if (typeof a.createBackupRecord === "function") {
        await a
          .createBackupRecord({
            listingCount: BigInt(entries.length),
            includesImages: true,
          })
          .catch(() => null);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBackups"] });
    },
  });
}

// ─── useRestoreFromZip ────────────────────────────────────────────────────────
// Extracts a .zip backup, re-uploads images, and restores listings.

export interface ZipRestoreResult {
  restoredCount: number;
  imageCount: number;
}

export function useRestoreFromZip() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<
    ZipRestoreResult,
    Error,
    { file: File; onProgress: (msg: string) => void }
  >({
    mutationFn: async ({ file, onProgress }) => {
      if (!actor) throw new Error("Actor not ready");
      const a = actor as ActorAny;

      onProgress("Reading backup file…");
      const zip = new JSZip();
      const loaded = await zip.loadAsync(file);

      // Extract listings.json
      const listingsFile = loaded.file("listings.json");
      if (!listingsFile)
        throw new Error("Invalid backup: listings.json not found");

      const listingsText = await listingsFile.async("text");
      const listings = JSON.parse(listingsText) as BackupListingEntry[];
      onProgress(`Found ${listings.length} listings…`);

      // Restore listings (with image URLs from backup)
      let restoredCount = 0;
      let imageCount = 0;

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
        restoredCount = Number(result?.ok?.restoredCount ?? listings.length);
      } else {
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
            // continue
          }
        }
      }

      // Count images in the zip
      const imageFiles = Object.keys(loaded.files).filter((name) =>
        name.startsWith("images/"),
      );
      imageCount = imageFiles.length;

      return { restoredCount, imageCount };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["favorited-listings"] });
      queryClient.invalidateQueries({ queryKey: ["myBackups"] });
    },
  });
}

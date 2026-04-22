import { f as useActor, h as useMutation, g as useQueryClient, p as useQuery, i as createActor } from "./index-BkwokjFY.js";
function formatDate(dateStr) {
  const d = /* @__PURE__ */ new Date();
  return d.toISOString().split("T")[0];
}
function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
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
function toBackupEntriesFromRaw(rawListings) {
  return rawListings.map((l) => {
    var _a;
    return {
      id: ((_a = l.id) == null ? void 0 : _a.toString()) ?? "",
      title: l.title ?? "",
      description: l.description ?? "",
      price: l.price ?? void 0,
      category: l.category ?? void 0,
      subcategory: l.subcategory ?? void 0,
      condition: l.condition ?? void 0,
      brand: l.brand ?? void 0,
      type_model: l.typeModel ?? l.type_model ?? void 0,
      source_url: l.sourceUrl ?? l.source_url ?? void 0,
      created_at: typeof l.createdAt === "bigint" ? new Date(Number(l.createdAt) / 1e6).toISOString() : l.createdAt ?? (/* @__PURE__ */ new Date()).toISOString(),
      archived_at: l.archivedAt ? typeof l.archivedAt === "bigint" ? new Date(Number(l.archivedAt) / 1e6).toISOString() : l.archivedAt : void 0,
      pinned: !!l.pinned,
      favorited: !!l.favorited,
      images: []
    };
  });
}
function useInitiateBackupPayment() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const a = actor;
      if (typeof a.initiateSmartBackup === "function") {
        const raw2 = await a.initiateSmartBackup();
        if (raw2.__kind__ === "err") throw new Error(raw2.err);
        return {
          paymentRecordId: Number(raw2.ok.paymentRecordId),
          stripeClientSecret: raw2.ok.stripeClientSecret ?? ""
        };
      }
      const raw = await a.initiateTierUpgrade(BigInt(1), "__backup__");
      return {
        paymentRecordId: Number(raw.paymentRecordId),
        stripeClientSecret: raw.stripeClientSecret ?? ""
      };
    }
  });
}
function useConfirmBackupPayment() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ paymentRecordId, stripePaymentIntentId }) => {
      if (!actor) throw new Error("Actor not ready");
      const a = actor;
      if (typeof a.confirmSmartBackupPayment === "function") {
        const raw = await a.confirmSmartBackupPayment(
          BigInt(paymentRecordId),
          stripePaymentIntentId
        );
        if (raw.__kind__ === "err") throw new Error(raw.err);
      } else {
        await a.confirmStripePayment(
          BigInt(paymentRecordId),
          stripePaymentIntentId
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBackups"] });
    }
  });
}
function useDownloadBackup() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async ({ includeImages = false }) => {
      if (!actor) throw new Error("Actor not ready");
      const a = actor;
      let rawListings = [];
      if (typeof a.generateBackupData === "function") {
        const result = await a.generateBackupData();
        const data = result.__kind__ === "ok" ? result.ok : result;
        rawListings = Array.isArray(data) ? data : (data == null ? void 0 : data.listings) ?? [];
      } else {
        rawListings = await a.listListings();
      }
      const entries = toBackupEntriesFromRaw(rawListings);
      const userId = typeof a.getMyProfile === "function" ? await a.getMyProfile().then((r) => {
        var _a, _b;
        return ((_b = (_a = r == null ? void 0 : r.ok) == null ? void 0 : _a.userId) == null ? void 0 : _b.toString()) ?? "unknown";
      }).catch(() => "unknown") : "unknown";
      const backupFile = {
        version: "1.0",
        backupDate: (/* @__PURE__ */ new Date()).toISOString(),
        userId,
        listings: entries,
        metadata: { includesImages: includeImages }
      };
      const dateStr = formatDate();
      downloadJson(backupFile, `copie-paste-backup-${dateStr}.json`);
      if (typeof a.createBackupRecord === "function") {
        await a.createBackupRecord({
          listingCount: BigInt(entries.length),
          includesImages: includeImages
        }).catch(() => null);
      }
    }
  });
}
function useGetMyBackups() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["myBackups"],
    queryFn: async () => {
      if (!actor) return [];
      const a = actor;
      if (typeof a.getMyBackups !== "function") return [];
      const raw = await a.getMyBackups();
      const list = Array.isArray(raw) ? raw : (raw == null ? void 0 : raw.ok) ?? [];
      return list.map((r) => {
        var _a;
        const createdAt = typeof r.createdAt === "bigint" ? new Date(Number(r.createdAt) / 1e6).toISOString() : r.createdAt ?? (/* @__PURE__ */ new Date()).toISOString();
        const createdMs = new Date(createdAt).getTime();
        const expiresAt = new Date(
          createdMs + 7 * 24 * 60 * 60 * 1e3
        ).toISOString();
        return {
          id: ((_a = r.id) == null ? void 0 : _a.toString()) ?? "",
          createdAt,
          listingCount: Number(r.listingCount ?? 0),
          imageCount: Number(r.imageCount ?? 0),
          includesImages: !!r.includesImages,
          downloadUrl: r.downloadUrl ?? void 0,
          expiresAt
        };
      });
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
function useDeleteBackup() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (backupId) => {
      if (!actor) throw new Error("Actor not ready");
      const a = actor;
      if (typeof a.deleteBackupRecord !== "function") return;
      const result = await a.deleteBackupRecord(BigInt(backupId));
      if ((result == null ? void 0 : result.__kind__) === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBackups"] });
    }
  });
}
function useRestoreFromBackup() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (listings) => {
      var _a;
      if (!actor) throw new Error("Actor not ready");
      const a = actor;
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
        return {
          restoredCount: Number(((_a = result == null ? void 0 : result.ok) == null ? void 0 : _a.restoredCount) ?? listings.length)
        };
      }
      let restoredCount = 0;
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
      return { restoredCount };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["favorited-listings"] });
    }
  });
}
function useExportManualBackup() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const a = actor;
      let rawListings = [];
      if (typeof a.generateBackupData === "function") {
        const result = await a.generateBackupData();
        const data = result.__kind__ === "ok" ? result.ok : result;
        rawListings = Array.isArray(data) ? data : (data == null ? void 0 : data.listings) ?? [];
      } else {
        rawListings = await a.listListings();
      }
      const entries = toBackupEntriesFromRaw(rawListings);
      const backupFile = {
        version: "1.0",
        backupDate: (/* @__PURE__ */ new Date()).toISOString(),
        userId: "unknown",
        listings: entries,
        metadata: { includesImages: false }
      };
      const dateStr = formatDate();
      downloadJson(backupFile, `copie-paste-manual-export-${dateStr}.json`);
    }
  });
}
export {
  useGetMyBackups as a,
  useExportManualBackup as b,
  useDownloadBackup as c,
  useDeleteBackup as d,
  useInitiateBackupPayment as e,
  useConfirmBackupPayment as f,
  useRestoreFromBackup as u
};

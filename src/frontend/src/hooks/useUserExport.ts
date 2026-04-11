import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation } from "@tanstack/react-query";
import JSZip from "jszip";
import { createActor } from "../backend";

interface UserExportData {
  jsonData: string;
  imageUrls: string[];
}

interface ExportProgress {
  current: number;
  total: number;
  label: string;
}

async function assembleUserZip(
  _username: string,
  data: UserExportData,
  onProgress?: (p: ExportProgress) => void,
): Promise<Blob> {
  const zip = new JSZip();
  zip.file("user-data.json", data.jsonData);

  const total = data.imageUrls.length;
  for (let i = 0; i < total; i++) {
    const url = data.imageUrls[i];
    onProgress?.({
      current: i + 1,
      total,
      label: `Packaging image ${i + 1} of ${total}…`,
    });
    try {
      const res = await fetch(url);
      if (res.ok) {
        const buf = await res.arrayBuffer();
        const ext = url.split("?")[0].split(".").pop() ?? "jpg";
        zip.file(`images/image-${i + 1}.${ext}`, buf);
      }
    } catch {
      // Skip failed images silently
    }
  }

  return zip.generateAsync({ type: "blob" });
}

export function useExportUserData() {
  const { actor } = useActor(createActor);

  return useMutation<void, Error, { userId: string; username: string }>({
    mutationFn: async ({ userId, username }) => {
      if (!actor) throw new Error("Actor not ready");
      const a = actor as unknown as Record<
        string,
        (...args: unknown[]) => Promise<unknown>
      >;
      if (typeof a.exportUserData !== "function") {
        throw new Error("Export not supported by this backend version.");
      }
      const raw = (await a.exportUserData(userId)) as
        | { __kind__: "Some"; value: UserExportData }
        | { __kind__: "None" }
        | UserExportData
        | null;

      let data: UserExportData | null = null;
      if (!raw) throw new Error("No data found for this user.");
      if ("__kind__" in raw) {
        if (raw.__kind__ === "Some") data = raw.value;
        else throw new Error("No data found for this user.");
      } else {
        data = raw as UserExportData;
      }
      if (!data) throw new Error("No data found for this user.");

      const blob = await assembleUserZip(username, data);
      const url = URL.createObjectURL(blob);
      const el = document.createElement("a");
      el.href = url;
      el.download = `${username}-export-${new Date().toISOString().split("T")[0]}.zip`;
      el.click();
      URL.revokeObjectURL(url);
    },
  });
}

export function useExportAllUsers() {
  const { actor } = useActor(createActor);

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const a = actor as unknown as Record<
        string,
        (...args: unknown[]) => Promise<unknown>
      >;
      if (typeof a.exportAllUsersData !== "function") {
        throw new Error(
          "Export all users not supported by this backend version.",
        );
      }
      const raw = (await a.exportAllUsersData()) as UserExportData;
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
          // Skip failed images
        }
      }

      const blob = await zip.generateAsync({ type: "blob" });
      const objectUrl = URL.createObjectURL(blob);
      const el = document.createElement("a");
      el.href = objectUrl;
      el.download = `all-users-export-${new Date().toISOString().split("T")[0]}.zip`;
      el.click();
      URL.revokeObjectURL(objectUrl);
    },
  });
}

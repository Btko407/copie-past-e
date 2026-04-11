import { useCallback, useState } from "react";
import { copyText } from "../utils/copyText";

export function useClipboard() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = useCallback(async (text: string, id?: string) => {
    await copyText(text);
    if (id) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }, []);

  return { copy, copiedId };
}

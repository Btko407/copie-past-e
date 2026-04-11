import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type ReactNode,
  createContext,
  createElement,
  useContext,
  useEffect,
  useState,
} from "react";
import { createActor } from "../backend";
import type { SiteSettings, UpdateSettingsArgs } from "../types";

// ─── Query Hooks ─────────────────────────────────────────────────────────────

export function useAdminSettings() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<SiteSettings | null>({
    queryKey: ["adminSettings"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAdminSettings() as Promise<SiteSettings>;
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 2,
  });
}

export function useGetAdminSettings() {
  return useAdminSettings();
}

export function useUpdateAdminSettings() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<SiteSettings, Error, UpdateSettingsArgs>({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateAdminSettings(args) as Promise<SiteSettings>;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["adminSettings"], data);
    },
  });
}

// ─── Admin Settings Context (app-wide feature toggles) ───────────────────────

interface AdminSettingsContextValue {
  uploadEnabled: boolean;
  copyButtonsEnabled: boolean;
  settings: SiteSettings | null;
  isLoading: boolean;
}

export const AdminSettingsContext = createContext<AdminSettingsContextValue>({
  uploadEnabled: true,
  copyButtonsEnabled: true,
  settings: null,
  isLoading: false,
});

export function useAdminSettingsContext(): AdminSettingsContextValue {
  return useContext(AdminSettingsContext);
}

interface AdminSettingsProviderProps {
  children: ReactNode;
}

export function AdminSettingsProvider({
  children,
}: AdminSettingsProviderProps) {
  const { actor, isFetching } = useActor(createActor);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!actor || isFetching) return;
    setIsLoading(true);
    (actor.getAdminSettings() as Promise<SiteSettings>)
      .then((s) => setSettings(s))
      .catch(() => {
        // silently fail — defaults apply
      })
      .finally(() => setIsLoading(false));
  }, [actor, isFetching]);

  const value: AdminSettingsContextValue = {
    uploadEnabled: settings?.uploadEnabled ?? true,
    copyButtonsEnabled: settings?.copyButtonsEnabled ?? true,
    settings,
    isLoading,
  };

  return createElement(AdminSettingsContext.Provider, { value }, children);
}

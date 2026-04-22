import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  GetProfileResult,
  SetUsernameResult,
  UpdateProfileResult,
  UserProfile,
} from "../backend.d";
import type { UpdateProfileArgs } from "../types";
import { useAuth } from "./useAuth";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function deriveDefaultUsername(principalId: string): string {
  const safe = principalId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8);
  return `user_${safe}`;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  username: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  avatarUrl: string | null;
  /** Call to update username — returns the updated profile or throws */
  setUsername: (newUsername: string) => Promise<UserProfile>;
  /** True while setUsername mutation is in flight */
  isSaving: boolean;
  /** Update display name, email, and/or phone number */
  updateMyProfile: (args: UpdateProfileArgs) => Promise<void>;
  /** True while updateMyProfile mutation is in flight */
  isUpdatingProfile: boolean;
}

export function useProfile(): ProfileState {
  const { actor, isFetching } = useActor(createActor);
  const { isAuthenticated, principalId, authReady } = useAuth();
  const queryClient = useQueryClient();

  // ── Fetch profile; auto-register if none exists ────────────────────────────
  // Query key is scoped to the principalId — prevents cross-user cache leaks.
  const { data: profile, isLoading } = useQuery<UserProfile | null>({
    queryKey: ["myProfile", principalId],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!actor) return null;

      const result: GetProfileResult = await actor.getMyProfile();

      if (result.__kind__ === "ok") {
        return result.ok;
      }

      // No profile yet — auto-register with a default username
      const defaultUsername = principalId
        ? deriveDefaultUsername(principalId)
        : `user_${Date.now()}`;

      const registerResult: SetUsernameResult = await actor.registerUserProfile(
        defaultUsername,
        "",
      );

      if (registerResult.__kind__ === "ok") {
        return registerResult.ok;
      }

      // Registration failed (e.g. duplicate default) — return null gracefully
      return null;
    },
    enabled:
      !!actor && !isFetching && isAuthenticated && authReady && !!principalId,
    staleTime: 60_000,
    retry: 1,
  });

  // ── Mutation: change username ──────────────────────────────────────────────
  const { mutateAsync: setUsernameMutation, isPending: isSaving } = useMutation<
    UserProfile,
    Error,
    string
  >({
    mutationFn: async (newUsername: string) => {
      if (!actor) throw new Error("Not connected");
      const result: SetUsernameResult = await actor.setMyUsername(newUsername);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<UserProfile | null>(
        ["myProfile", principalId],
        updated,
      );
      queryClient.invalidateQueries({ queryKey: ["myProfile", principalId] });
    },
  });

  const setUsername = async (newUsername: string): Promise<UserProfile> => {
    return setUsernameMutation(newUsername);
  };

  // ── Mutation: update profile (display name, phone, email) ─────────────────
  const { mutateAsync: updateProfileMutation, isPending: isUpdatingProfile } =
    useMutation<void, Error, UpdateProfileArgs>({
      mutationFn: async (args: UpdateProfileArgs) => {
        if (!actor) throw new Error("Not connected");
        const result: UpdateProfileResult = await actor.updateMyProfile(args);
        if (result.__kind__ === "err") throw new Error(result.err);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["myProfile", principalId] });
      },
    });

  const updateMyProfile = async (args: UpdateProfileArgs): Promise<void> => {
    await updateProfileMutation(args);
  };

  // Derive displayName / phoneNumber directly from the backend profile
  const displayName =
    profile?.displayName != null
      ? (profile.displayName as string | null)
      : null;
  const phoneNumber =
    profile?.phoneNumber != null
      ? (profile.phoneNumber as string | null)
      : null;

  return {
    profile: profile ?? null,
    isLoading,
    username: profile?.username ?? null,
    displayName,
    phoneNumber,
    avatarUrl: null,
    setUsername,
    isSaving,
    updateMyProfile,
    isUpdatingProfile,
  };
}

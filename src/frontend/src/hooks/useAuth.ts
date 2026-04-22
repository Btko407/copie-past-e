import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import type { AuthStatus } from "../types";

export interface AuthState {
  isAuthenticated: boolean;
  isInitializing: boolean;
  /** True once the identity provider has fully resolved (initializing === false). */
  authReady: boolean;
  status: AuthStatus;
  principalId?: string;
  login: () => void;
  logout: () => void;
}

export function useAuth(): AuthState {
  const { identity, login, clear, isInitializing, loginStatus } =
    useInternetIdentity();

  const principal = identity?.getPrincipal();
  const isAnonymous = !principal || principal.isAnonymous();
  const isAuthenticated =
    !isAnonymous &&
    (loginStatus === "success" ||
      (!!identity && loginStatus !== "initializing"));

  const status: AuthStatus = isInitializing
    ? "initializing"
    : isAuthenticated
      ? "authenticated"
      : "unauthenticated";

  // authReady is true as soon as the identity provider has resolved.
  // Use this to gate all backend actor calls so we never fire them with a
  // stale / anonymous identity.
  const authReady = !isInitializing;

  const principalId = !isAnonymous ? principal?.toText() : undefined;

  return {
    isAuthenticated,
    isInitializing,
    authReady,
    status,
    principalId,
    login,
    logout: clear,
  };
}

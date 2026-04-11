import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import type { AuthStatus } from "../types";

export interface AuthState {
  isAuthenticated: boolean;
  isInitializing: boolean;
  status: AuthStatus;
  principalId?: string;
  login: () => void;
  logout: () => void;
}

export function useAuth(): AuthState {
  const { identity, login, clear, isInitializing, loginStatus } =
    useInternetIdentity();

  const isAuthenticated =
    loginStatus === "success" || (!!identity && loginStatus !== "initializing");

  const status: AuthStatus = isInitializing
    ? "initializing"
    : isAuthenticated
      ? "authenticated"
      : "unauthenticated";

  const principalId = identity?.getPrincipal().toText();

  return {
    isAuthenticated,
    isInitializing,
    status,
    principalId,
    login,
    logout: clear,
  };
}

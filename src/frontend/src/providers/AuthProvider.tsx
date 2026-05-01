// AuthProvider is no longer needed — authentication is handled by
// InternetIdentityProvider from @caffeineai/core-infrastructure in main.tsx.
// This file is kept as a thin re-export so any lingering imports don't break.

export { useAuth } from "../hooks/useAuth";
export type { AuthContextValue } from "../hooks/useAuth";

import { useAuth } from "@/hooks/useAuth";
import { EMAIL_ENABLED } from "@/hooks/useEmailVerification";
import { useProfile } from "@/hooks/useProfile";
import { Navigate } from "@tanstack/react-router";
import { PageLoader } from "./LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isInitializing, authReady } = useAuth();
  const { profile, isLoading: isProfileLoading } = useProfile();

  // Block rendering until the identity provider has fully resolved.
  if (isInitializing || !authReady) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Only gate behind email verification when the feature flag is on
  if (EMAIL_ENABLED && !isProfileLoading && profile && !profile.emailVerified) {
    return <Navigate to="/verify-email" />;
  }

  return <>{children}</>;
}

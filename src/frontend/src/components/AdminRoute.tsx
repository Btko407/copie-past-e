import { useAuth } from "@/hooks/useAuth";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "@tanstack/react-router";
import { createActor } from "../backend";
import { PageLoader } from "./LoadingSpinner";

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { isAuthenticated, isInitializing, authReady, principalId } = useAuth();
  const { actor, isFetching } = useActor(createActor);

  // Query key is scoped to the principalId — ensures admin status is
  // re-evaluated whenever the active principal changes.
  const { data: isAdmin, isLoading: isAdminLoading } = useQuery<boolean>({
    queryKey: ["isCallerAdmin", principalId ?? ""],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && isAuthenticated && !!principalId,
    staleTime: 0,
  });

  if (isInitializing || !authReady || isAdminLoading || isFetching) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
}

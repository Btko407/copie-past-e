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
  const { isAuthenticated, isInitializing } = useAuth();
  const { actor, isFetching } = useActor(createActor);

  const { data: isAdmin, isLoading: isAdminLoading } = useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });

  if (isInitializing || isAdminLoading || isFetching) {
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

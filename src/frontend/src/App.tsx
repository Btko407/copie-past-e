import { useQueryClient } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
} from "@tanstack/react-router";
import { Suspense, lazy, useEffect, useRef } from "react";
import { AdminRoute } from "./components/AdminRoute";
import { FloatingHelpButton } from "./components/FloatingHelpButton";
import { PageLoader } from "./components/LoadingSpinner";
import { MaintenanceBanner } from "./components/MaintenanceBanner";
import { PostDeployVerificationBanner } from "./components/PostDeployVerificationBanner";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminSettingsProvider } from "./hooks/useAdminSettings";
import { useAuth } from "./hooks/useAuth";
import { useMaintenanceMode } from "./hooks/useMaintenanceMode";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";

// ─── Lazy-loaded pages ────────────────────────────────────────────────────────

const DashboardPage = lazy(() =>
  import("./pages/DashboardPage").then((m) => ({ default: m.DashboardPage })),
);
const ImportPage = lazy(() =>
  import("./pages/ImportPage").then((m) => ({ default: m.ImportPage })),
);
const ListingDetailPage = lazy(() =>
  import("./pages/ListingDetailPage").then((m) => ({
    default: m.ListingDetailPage,
  })),
);
const UpgradePage = lazy(() =>
  import("./pages/UpgradePage").then((m) => ({ default: m.UpgradePage })),
);
const WalletPage = lazy(() =>
  import("./pages/WalletPage").then((m) => ({ default: m.WalletPage })),
);
const SettingsPage = lazy(() =>
  import("./pages/SettingsPage").then((m) => ({ default: m.SettingsPage })),
);
const ProfilePage = lazy(() =>
  import("./pages/ProfilePage").then((m) => ({ default: m.ProfilePage })),
);
const ExtensionPage = lazy(() =>
  import("./pages/ExtensionPage").then((m) => ({ default: m.ExtensionPage })),
);
const PaymentSuccessPage = lazy(() =>
  import("./pages/PaymentSuccessPage").then((m) => ({
    default: m.PaymentSuccessPage,
  })),
);
const PaymentCancelPage = lazy(() =>
  import("./pages/PaymentCancelPage").then((m) => ({
    default: m.PaymentCancelPage,
  })),
);
const MaintenancePage = lazy(() =>
  import("./pages/MaintenancePage").then((m) => ({
    default: m.MaintenancePage,
  })),
);

// ─── Lazy-loaded admin pages ──────────────────────────────────────────────────

const AdminDashboardPage = lazy(() =>
  import("./pages/admin/AdminDashboardPage").then((m) => ({
    default: m.AdminDashboardPage,
  })),
);
const AdminSettingsPage = lazy(() =>
  import("./pages/admin/AdminSettingsPage").then((m) => ({
    default: m.AdminSettingsPage,
  })),
);
const AdminUsersPage = lazy(() =>
  import("./pages/admin/AdminUsersPage").then((m) => ({
    default: m.AdminUsersPage,
  })),
);
const AdminAnalyticsPage = lazy(() =>
  import("./pages/admin/AdminAnalyticsPage").then((m) => ({
    default: m.AdminAnalyticsPage,
  })),
);
const AdminVersionsPage = lazy(() =>
  import("./pages/admin/AdminVersionsPage").then((m) => ({
    default: m.AdminVersionsPage,
  })),
);
const AdminTiersPage = lazy(() =>
  import("./pages/admin/AdminTiersPage").then((m) => ({
    default: m.AdminTiersPage,
  })),
);
const AdminCleanupPage = lazy(() =>
  import("./pages/admin/AdminCleanupPage").then((m) => ({
    default: m.AdminCleanupPage,
  })),
);
const AdminPaymentsPage = lazy(() =>
  import("./pages/admin/AdminPaymentsPage").then((m) => ({
    default: m.AdminPaymentsPage,
  })),
);
const AdminDebuggerPage = lazy(() =>
  import("./pages/admin/AdminDebuggerPage").then((m) => ({
    default: m.AdminDebuggerPage,
  })),
);
const AdminNotificationsPage = lazy(() =>
  import("./pages/admin/AdminNotificationsPage").then((m) => ({
    default: m.AdminNotificationsPage,
  })),
);
const AdminSupportInboxPage = lazy(() =>
  import("./pages/admin/AdminSupportInboxPage").then((m) => ({
    default: m.AdminSupportInboxPage,
  })),
);
const EmergencyRestorePage = lazy(() =>
  import("./pages/admin/EmergencyRestorePage").then((m) => ({
    default: m.EmergencyRestorePage,
  })),
);
const AdminActivityFeedPage = lazy(() =>
  import("./pages/admin/AdminActivityFeedPage").then((m) => ({
    default: m.AdminActivityFeedPage,
  })),
);
const AdminDataSnapshotsPage = lazy(() =>
  import("./pages/admin/AdminDataSnapshotsPage").then((m) => ({
    default: m.AdminDataSnapshotsPage,
  })),
);
const AdminAutofillConfigPage = lazy(() =>
  import("./pages/admin/AdminAutofillConfigPage").then((m) => ({
    default: m.AdminAutofillConfigPage,
  })),
);

// ─── Maintenance Guard ────────────────────────────────────────────────────────

/**
 * Wraps protected user-facing pages. If maintenance mode is active and the
 * current user is NOT an admin, redirects to /maintenance.
 */
function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const { isActive } = useMaintenanceMode();
  const navigate = useNavigate();

  useEffect(() => {
    if (isActive) {
      navigate({ to: "/maintenance" });
    }
  }, [isActive, navigate]);

  if (isActive) return <PageLoader />;
  return <>{children}</>;
}

// ─── Principal-change cache invalidation ─────────────────────────────────────

/**
 * Watches principalId. When the active identity changes (login, logout, or
 * account switch), ALL React Query caches are invalidated so no stale data
 * from the previous user can leak to the new session.
 */
function PrincipalCacheGuard() {
  const { principalId, authReady } = useAuth();
  const queryClient = useQueryClient();
  // Track the previous principalId so we only invalidate on actual changes.
  const prevPrincipalRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!authReady) return;
    if (prevPrincipalRef.current !== principalId) {
      // Principal changed — wipe all cached query data.
      queryClient.invalidateQueries();
      prevPrincipalRef.current = principalId;
    }
  }, [principalId, authReady, queryClient]);

  return null;
}

// ─── Root layout ──────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: () => {
    // Global extension detection — must run on every page load.
    useEffect(() => {
      function handleMessage(e: MessageEvent) {
        if (e.data?.type === "COPIE_PASTE_EXT_PRESENT") {
          localStorage.setItem("ext_installed", "true");
          window.dispatchEvent(
            new StorageEvent("storage", {
              key: "ext_installed",
              newValue: "true",
              storageArea: localStorage,
            }),
          );
        }
      }
      window.addEventListener("message", handleMessage);
      return () => window.removeEventListener("message", handleMessage);
    }, []);

    return (
      <AdminSettingsProvider>
        <PrincipalCacheGuard />
        <PostDeployVerificationBanner />
        <MaintenanceBanner />
        <Outlet />
        <FloatingHelpButton />
      </AdminSettingsProvider>
    );
  },
  notFoundComponent: NotFoundPage,
});

// ─── User routes ──────────────────────────────────────────────────────────────

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LoginPage,
});

const verifyEmailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/verify-email",
  component: VerifyEmailPage,
});

const maintenanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/maintenance",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <MaintenancePage />
    </Suspense>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <ProtectedRoute>
      <MaintenanceGuard>
        <Suspense fallback={<PageLoader />}>
          <DashboardPage />
        </Suspense>
      </MaintenanceGuard>
    </ProtectedRoute>
  ),
});

const importRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/import",
  component: () => (
    <ProtectedRoute>
      <MaintenanceGuard>
        <Suspense fallback={<PageLoader />}>
          <ImportPage />
        </Suspense>
      </MaintenanceGuard>
    </ProtectedRoute>
  ),
});

const listingDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/listing/$id",
  component: () => (
    <ProtectedRoute>
      <MaintenanceGuard>
        <Suspense fallback={<PageLoader />}>
          <ListingDetailPage />
        </Suspense>
      </MaintenanceGuard>
    </ProtectedRoute>
  ),
});

const upgradeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/upgrade",
  component: () => (
    <ProtectedRoute>
      <MaintenanceGuard>
        <Suspense fallback={<PageLoader />}>
          <UpgradePage />
        </Suspense>
      </MaintenanceGuard>
    </ProtectedRoute>
  ),
});

const walletRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wallet",
  component: () => (
    <ProtectedRoute>
      <MaintenanceGuard>
        <Suspense fallback={<PageLoader />}>
          <WalletPage />
        </Suspense>
      </MaintenanceGuard>
    </ProtectedRoute>
  ),
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: () => (
    <ProtectedRoute>
      <MaintenanceGuard>
        <Suspense fallback={<PageLoader />}>
          <SettingsPage />
        </Suspense>
      </MaintenanceGuard>
    </ProtectedRoute>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: () => (
    <ProtectedRoute>
      <MaintenanceGuard>
        <Suspense fallback={<PageLoader />}>
          <ProfilePage />
        </Suspense>
      </MaintenanceGuard>
    </ProtectedRoute>
  ),
});

const extensionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/extension",
  component: () => (
    <ProtectedRoute>
      <MaintenanceGuard>
        <Suspense fallback={<PageLoader />}>
          <ExtensionPage />
        </Suspense>
      </MaintenanceGuard>
    </ProtectedRoute>
  ),
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-success",
  component: () => (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <PaymentSuccessPage />
      </Suspense>
    </ProtectedRoute>
  ),
});

const paymentCancelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-cancel",
  component: () => (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <PaymentCancelPage />
      </Suspense>
    </ProtectedRoute>
  ),
});

// ─── Admin routes ─────────────────────────────────────────────────────────────

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => (
    <AdminRoute>
      <Suspense fallback={<PageLoader />}>
        <AdminDashboardPage />
      </Suspense>
    </AdminRoute>
  ),
});

const adminSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/settings",
  component: () => (
    <AdminRoute>
      <Suspense fallback={<PageLoader />}>
        <AdminSettingsPage />
      </Suspense>
    </AdminRoute>
  ),
});

const adminUsersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/users",
  component: () => (
    <AdminRoute>
      <Suspense fallback={<PageLoader />}>
        <AdminUsersPage />
      </Suspense>
    </AdminRoute>
  ),
});

const adminAnalyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/analytics",
  component: () => (
    <AdminRoute>
      <Suspense fallback={<PageLoader />}>
        <AdminAnalyticsPage />
      </Suspense>
    </AdminRoute>
  ),
});

const adminVersionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/versions",
  component: () => (
    <AdminRoute>
      <Suspense fallback={<PageLoader />}>
        <AdminVersionsPage />
      </Suspense>
    </AdminRoute>
  ),
});

const adminTiersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/tiers",
  component: () => (
    <AdminRoute>
      <Suspense fallback={<PageLoader />}>
        <AdminTiersPage />
      </Suspense>
    </AdminRoute>
  ),
});

const adminCleanupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/cleanup",
  component: () => (
    <AdminRoute>
      <Suspense fallback={<PageLoader />}>
        <AdminCleanupPage />
      </Suspense>
    </AdminRoute>
  ),
});

const adminPaymentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/payments",
  component: () => (
    <AdminRoute>
      <Suspense fallback={<PageLoader />}>
        <AdminPaymentsPage />
      </Suspense>
    </AdminRoute>
  ),
});

const adminDebuggerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/debugger",
  component: () => (
    <AdminRoute>
      <Suspense fallback={<PageLoader />}>
        <AdminDebuggerPage />
      </Suspense>
    </AdminRoute>
  ),
});

const adminNotificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/notifications",
  component: () => (
    <AdminRoute>
      <Suspense fallback={<PageLoader />}>
        <AdminNotificationsPage />
      </Suspense>
    </AdminRoute>
  ),
});

const adminSupportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/support",
  component: () => (
    <AdminRoute>
      <Suspense fallback={<PageLoader />}>
        <AdminSupportInboxPage />
      </Suspense>
    </AdminRoute>
  ),
});

const adminEmergencyRestoreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/emergency-restore",
  component: () => (
    <AdminRoute>
      <Suspense fallback={<PageLoader />}>
        <EmergencyRestorePage />
      </Suspense>
    </AdminRoute>
  ),
});

const adminActivityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/activity",
  component: () => (
    <AdminRoute>
      <Suspense fallback={<PageLoader />}>
        <AdminActivityFeedPage />
      </Suspense>
    </AdminRoute>
  ),
});

const adminDataSnapshotsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/data-snapshots",
  component: () => (
    <AdminRoute>
      <Suspense fallback={<PageLoader />}>
        <AdminDataSnapshotsPage />
      </Suspense>
    </AdminRoute>
  ),
});

const adminAutofillRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/autofill",
  component: () => (
    <AdminRoute>
      <Suspense fallback={<PageLoader />}>
        <AdminAutofillConfigPage />
      </Suspense>
    </AdminRoute>
  ),
});

// ─── Router ───────────────────────────────────────────────────────────────────

const routeTree = rootRoute.addChildren([
  loginRoute,
  verifyEmailRoute,
  maintenanceRoute,
  dashboardRoute,
  importRoute,
  listingDetailRoute,
  upgradeRoute,
  walletRoute,
  settingsRoute,
  profileRoute,
  extensionRoute,
  paymentSuccessRoute,
  paymentCancelRoute,
  adminRoute,
  adminSettingsRoute,
  adminUsersRoute,
  adminAnalyticsRoute,
  adminVersionsRoute,
  adminTiersRoute,
  adminCleanupRoute,
  adminPaymentsRoute,
  adminDebuggerRoute,
  adminNotificationsRoute,
  adminSupportRoute,
  adminEmergencyRestoreRoute,
  adminActivityRoute,
  adminDataSnapshotsRoute,
  adminAutofillRoute,
]);

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFoundPage,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

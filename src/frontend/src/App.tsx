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
const ExtensionSetupPage = lazy(() =>
  import("./pages/ExtensionSetupPage").then((m) => ({
    default: m.ExtensionSetupPage,
  })),
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
const AdminExtensionVersionsPage = lazy(() =>
  import("./pages/admin/AdminExtensionVersionsPage").then((m) => ({
    default: m.AdminExtensionVersionsPage,
  })),
);
const CrossListingAnalyticsPage = lazy(() =>
  import("./pages/CrossListingAnalyticsPage").then((m) => ({
    default: m.CrossListingAnalyticsPage,
  })),
);

const TermsOfServicePage = lazy(() =>
  import("./pages/TermsOfServicePage").then((m) => ({
    default: m.TermsOfServicePage,
  })),
);

const PrivacyPolicyPage = lazy(() =>
  import("./pages/PrivacyPolicyPage").then((m) => ({
    default: m.PrivacyPolicyPage,
  })),
);

// ─── Maintenance Guard ────────────────────────────────────────────────────────

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

function PrincipalCacheGuard() {
  const { principalId, authReady } = useAuth();
  const queryClient = useQueryClient();
  const prevPrincipalRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!authReady) return;
    if (prevPrincipalRef.current !== principalId) {
      queryClient.invalidateQueries();
      prevPrincipalRef.current = principalId;
    }
  }, [principalId, authReady, queryClient]);

  return null;
}

// ─── Root layout ──────────────────────────────────────────────────────────────

// Global window extension flags
interface ExtWindow extends Window {
  __extensionReady?: boolean;
  __extensionVersion?: string;
}

const rootRoute = createRootRoute({
  component: () => {
    // Extension detection — EXTENSION_READY postMessage handshake (primary)
    // plus legacy COPIE_PASTE_EXT_PRESENT for backward compatibility.
    useEffect(() => {
      function handleMessage(e: MessageEvent) {
        // Primary: new EXTENSION_READY handshake from extension v1.3+
        if (
          e.data?.type === "EXTENSION_READY" &&
          e.data?.source === "copie-extension"
        ) {
          (window as ExtWindow).__extensionReady = true;
          (window as ExtWindow).__extensionVersion = e.data.version as string;
          window.dispatchEvent(
            new CustomEvent("copie-extension-ready", {
              detail: { version: e.data.version },
            }),
          );
        }
        // Legacy: older extension versions
        if (e.data?.type === "COPIE_PASTE_EXT_PRESENT") {
          (window as ExtWindow).__extensionReady = true;
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

// Default route: authenticated users land directly on Dashboard.
// Unauthenticated users are redirected to /login by ProtectedRoute.
const dashboardIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
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

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
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

const extensionSetupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/extension-setup",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ExtensionSetupPage />
    </Suspense>
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

const adminExtensionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/extension",
  component: () => (
    <AdminRoute>
      <Suspense fallback={<PageLoader />}>
        <AdminExtensionVersionsPage />
      </Suspense>
    </AdminRoute>
  ),
});

const crossListingAnalyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analytics/cross-listing",
  component: () => (
    <ProtectedRoute>
      <MaintenanceGuard>
        <Suspense fallback={<PageLoader />}>
          <CrossListingAnalyticsPage />
        </Suspense>
      </MaintenanceGuard>
    </ProtectedRoute>
  ),
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <TermsOfServicePage />
    </Suspense>
  ),
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <PrivacyPolicyPage />
    </Suspense>
  ),
});

// ─── Router ───────────────────────────────────────────────────────────────────

const routeTree = rootRoute.addChildren([
  dashboardIndexRoute,
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
  extensionSetupRoute,
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
  adminExtensionRoute,
  crossListingAnalyticsRoute,
  termsRoute,
  privacyRoute,
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

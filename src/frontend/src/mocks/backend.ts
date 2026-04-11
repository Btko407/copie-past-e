import type { backendInterface } from "../backend.d";
import { ExternalBlob, UserRole, ListingStatus, DiscountType, GasPurchaseStatus, PaymentMethod, MarketplaceSource, VerificationStatus } from "../backend";
import type { Image, Listing, SiteSettings, SiteAnalytics, AppVersion, UserSummary, UserTierSubscription, TierConfig, DiscountCode, PaymentRecord, BulkGasDiscount, UserProfile, VerificationRecord, GetProfileResult, SetUsernameResult, ScrapeResult, ResendResult, VerifyEmailResult, InAppNotification, NotificationType, MarkReadResult, UpdateProfileResult, AuditLogEntry } from "../backend";
import type { PaymentStatus } from "../declarations/backend.did.d";

const mockPrincipal = {
  toText: () => "2vxsx-fae",
  isAnonymous: () => false,
} as any;

const mockProfile: UserProfile = {
  userId: mockPrincipal,
  username: "delorean_driver",
  displayName: "Marty McFly",
  email: "marty@copie-paste.app",
  emailVerified: true,
  role: "admin",
  createdAt: BigInt(Date.now() * 1_000_000),
  updatedAt: BigInt(Date.now() * 1_000_000),
};

const mockListings: Listing[] = [
  {
    id: BigInt(1),
    title: "DeLorean DMC-12 — Time Machine Edition",
    userId: mockPrincipal,
    createdAt: BigInt(Date.now() * 1_000_000),
    description:
      "Stainless steel body, flux capacitor installed, Mr. Fusion conversion complete. 1.21 gigawatts ready. 88mph achievable. Perfect condition for temporal displacement.",
    sourceUrl: "https://marketplace.example.com/listings/1",
    price: "$4,200",
    status: ListingStatus.active,
    tierLevel: BigInt(1),
    expirationDate: BigInt((Date.now() + 30 * 86400000) * 1_000_000),
    archivedManually: false,
    pinned: true,
    favorited: false,
    pinnedAt: BigInt((Date.now() - 3600000) * 1_000_000),
  },
  {
    id: BigInt(2),
    title: "Arcade Cabinet — 1983 Galaga Original",
    userId: mockPrincipal,
    createdAt: BigInt((Date.now() - 86400000) * 1_000_000),
    description:
      "Original Galaga cabinet from 1983. Full working order, original PCB board, authentic joystick and buttons. Neon tube lighting intact.",
    sourceUrl: "https://marketplace.example.com/listings/2",
    price: "$850",
    status: ListingStatus.active,
    tierLevel: BigInt(1),
    expirationDate: BigInt((Date.now() + 29 * 86400000) * 1_000_000),
    archivedManually: false,
    pinned: false,
    favorited: true,
  },
  {
    id: BigInt(3),
    title: "Retro PC Setup — IBM 5150 Complete",
    userId: mockPrincipal,
    createdAt: BigInt((Date.now() - 172800000) * 1_000_000),
    description:
      "Complete IBM 5150 Personal Computer setup with original monitor, keyboard, and dual 5.25\" floppy drives. DOS 1.0 included.",
    price: "$1,100",
    status: ListingStatus.active,
    tierLevel: BigInt(1),
    expirationDate: BigInt((Date.now() + 28 * 86400000) * 1_000_000),
    archivedManually: false,
    pinned: false,
    favorited: false,
  },
  {
    id: BigInt(4),
    title: "Vintage Synthesizer — Moog Model D",
    userId: mockPrincipal,
    createdAt: BigInt((Date.now() - 45 * 86400000) * 1_000_000),
    description:
      "Classic Moog Model D synthesizer, fully serviced. All oscillators tuned and stable. Original knobs and case.",
    price: "$3,500",
    status: ListingStatus.archived,
    tierLevel: BigInt(1),
    expirationDate: BigInt((Date.now() - 15 * 86400000) * 1_000_000),
    archivedAt: BigInt((Date.now() - 15 * 86400000) * 1_000_000),
    archivedManually: false,
    pinned: false,
    favorited: false,
  },
  {
    id: BigInt(5),
    title: "Atari 2600 Console — Complete Set",
    userId: mockPrincipal,
    createdAt: BigInt((Date.now() - 65 * 86400000) * 1_000_000),
    description:
      "Original Atari 2600 with 32 game cartridges. Joysticks included. Light Sixer model in excellent cosmetic condition.",
    price: "$320",
    status: ListingStatus.archived,
    tierLevel: BigInt(1),
    expirationDate: BigInt((Date.now() - 5 * 86400000) * 1_000_000),
    archivedAt: BigInt((Date.now() - 5 * 86400000) * 1_000_000),
    archivedManually: true,
    pinned: false,
    favorited: false,
  },
];
const mockSettings: SiteSettings = {
  appName: "Copie Past-e",
  primaryColor: "oklch(0.65 0.22 262)",
  accentColor: "oklch(0.88 0.19 84)",
  uploadEnabled: true,
  copyButtonsEnabled: true,
  contentModerationEnabled: false,
  maxRequestsPerMinute: BigInt(60),
  maxUploadsPerHour: BigInt(20),
  maxSessionDurationMinutes: BigInt(1440),
  maxConcurrentSessions: BigInt(3),
  allowedOrigins: "*",
  createdAt: BigInt(Date.now() * 1_000_000),
  updatedAt: BigInt(Date.now() * 1_000_000),
};

export const mockBackend: backendInterface = {
  addImage: async (args) => ({
    id: BigInt(1),
    order: args.order,
    blob: ExternalBlob.fromURL("https://placehold.co/400x300"),
    listingId: args.listingId,
    altText: args.altText,
  }),
  adminCreateBackupNow: async () => ({
    __kind__: "ok" as const,
    ok: {
      backupId: "mock-backup-" + Date.now(),
      createdAt: BigInt(Date.now() * 1_000_000),
    },
  }),
  adminCreateDiscountCode: async (code, discountType, discountValue, expirationDate, maxUses, tierRestriction): Promise<DiscountCode> => ({
    id: BigInt(1),
    active: true,
    discountValue,
    code,
    discountType,
    usageCount: BigInt(0),
    expirationDate,
    tierRestriction: tierRestriction ?? undefined,
    maxUses,
  }),
  adminDeactivateDiscountCode: async () => undefined,
  adminExtendUserTier: async (userId, tierId, daysAdded): Promise<UserTierSubscription> => ({
    userId,
    tier: tierId,
    autoRenewal: false,
    updatedAt: BigInt(Date.now() * 1_000_000),
    expirationDate: BigInt((Date.now() + Number(daysAdded) * 86400000) * 1_000_000),
  }),
  adminExtendUserTierByUsername: async (_username, tierLevel, extraDays) => ({
    __kind__: "ok" as const,
    ok: {
      userId: mockPrincipal,
      tier: tierLevel,
      autoRenewal: false,
      updatedAt: BigInt(Date.now() * 1_000_000),
      expirationDate: BigInt((Date.now() + Number(extraDays) * 86400000) * 1_000_000),
    },
  }),
  adminGetUserSubscription: async (): Promise<UserTierSubscription | null> => null,
  adminListDiscountCodes: async (): Promise<DiscountCode[]> => [],
  adminListPayments: async (): Promise<PaymentRecord[]> => [],
  adminListSubscriptions: async (): Promise<UserTierSubscription[]> => [],
  adminListTierActions: async () => [],
  adminResetAllUserSubscriptions: async () => ({ __kind__: "ok" as const, ok: "All subscriptions reset." }),
  adminResetUserSubscription: async (_username) => ({ __kind__: "ok" as const, ok: "Subscription reset." }),
  adminUpsertTier: async () => undefined,
  confirmStripePayment: async () => undefined,
  failStripePayment: async () => undefined,
  getMyPayments: async (): Promise<PaymentRecord[]> => [],
  getMySubscription: async (): Promise<UserTierSubscription | null> => ({
    userId: mockPrincipal,
    tier: BigInt(2),
    autoRenewal: false,
    updatedAt: BigInt(Date.now() * 1_000_000),
    expirationDate: BigInt((Date.now() + 5 * 86400000) * 1_000_000),
  }),
  getTier: async (): Promise<TierConfig | null> => null,
  getTiers: async (): Promise<TierConfig[]> => [
    { tierId: BigInt(1), name: "Free", durationDays: BigInt(30), priceUSD: 0 },
    { tierId: BigInt(2), name: "Explorer", durationDays: BigInt(90), priceUSD: 9.99 },
    { tierId: BigInt(3), name: "Traveler", durationDays: BigInt(180), priceUSD: 19.99 },
  ],
  initiateTierUpgrade: async (_tierId) => ({
    tierDurationDays: BigInt(30),
    discountApplied: false,
    paymentRecordId: BigInt(Date.now()),
    finalAmountUSD: 9.99,
  }),
  validateDiscountCode: async (): Promise<DiscountCode | null> => null,
  assignCallerUserRole: async () => undefined,
  assignUserRole: async () => undefined,
  createVersion: async (args) => ({
    id: BigInt(1),
    versionLabel: args.versionLabel,
    createdAt: BigInt(Date.now() * 1_000_000),
    createdBy: mockPrincipal,
    description: args.description,
    settingsSnapshot: mockSettings,
    isRollback: false,
  }),
  createListing: async (args) => ({
    id: BigInt(Date.now()),
    title: args.title,
    userId: mockPrincipal,
    createdAt: BigInt(Date.now() * 1_000_000),
    description: args.description,
    sourceUrl: args.sourceUrl,
    price: args.price,
    status: ListingStatus.active,
    tierLevel: BigInt(1),
    expirationDate: BigInt((Date.now() + 30 * 86400000) * 1_000_000),
    archivedManually: false,
    pinned: false,
    favorited: false,
  }),
  deleteListing: async () => undefined,
  getCallerUserRole: async () => UserRole.admin,
  getAdminSettings: async () => mockSettings,
  getSiteAnalytics: async (): Promise<SiteAnalytics> => ({
    totalUsers: BigInt(1),
    totalListings: BigInt(mockListings.length),
    totalImages: BigInt(0),
    avgListingsPerUser: mockListings.length,
    avgImagesPerListing: 0,
    totalArchivedListings: BigInt(0),
    totalActiveListings: BigInt(mockListings.length),
    paymentRevenue: 0,
  }),
  getListing: async (id) => mockListings.find((l) => l.id === id) ?? null,
  getCleanupSummaries: async () => [],
  runLifecycleCleanup: async () => ({ deleted: BigInt(0), archived: BigInt(0) }),
  isCallerAdmin: async () => true,
  listImages: async () => [],
  listListings: async () => mockListings,  listAllUsers: async (): Promise<UserSummary[]> => ([
    {
      userId: "2vxsx-fae",
      role: "admin",
      registrationDate: BigInt(Date.now() * 1_000_000),
      lastLoginDate: BigInt(Date.now() * 1_000_000),
      listingCount: BigInt(mockListings.length),
      imageCount: BigInt(0),
    },
  ]),
  listVersionHistory: async (): Promise<AppVersion[]> => ([
    {
      id: BigInt(0),
      versionLabel: "v1.0",
      createdAt: BigInt(Date.now() * 1_000_000),
      createdBy: mockPrincipal,
      description: "Initial version",
      settingsSnapshot: mockSettings,
      isRollback: false,
    },
  ]),
  removeImage: async () => undefined,
  rollbackToVersion: async () => mockSettings,
  updateAdminSettings: async () => mockSettings,
  updateListing: async (args) => ({
    id: args.id,
    title: args.title,
    userId: mockPrincipal,
    createdAt: BigInt(Date.now() * 1_000_000),
    description: args.description,
    price: args.price,
    status: ListingStatus.active,
    tierLevel: BigInt(1),
    expirationDate: BigInt((Date.now() + 30 * 86400000) * 1_000_000),
    archivedManually: false,
    pinned: false,
    favorited: false,
  }),
  getMyGasWallet: async () => ({
    __kind__: "ok" as const,
    ok: {
      userId: mockPrincipal,
      gasBalance: BigInt(250),
      autoRenewal: false,
      autoRenewalTierId: BigInt(1),
      updatedAt: BigInt(Date.now() * 1_000_000),
    },
  }),
  getGasPackages: async () => [
    { packageId: BigInt(1), name: "Starter Pack", gasAmount: BigInt(100), priceUSD: 4.99, stripeProductId: "prod_starter" },
    { packageId: BigInt(2), name: "Road Trip Pack", gasAmount: BigInt(300), priceUSD: 12.99, stripeProductId: "prod_road" },
    { packageId: BigInt(3), name: "Full Tank", gasAmount: BigInt(1000), priceUSD: 39.99, stripeProductId: "prod_full" },
  ],
  getMyGasPurchases: async () => [],
  initiateGasPurchase: async (_packageId, _discountCode) => ({
    __kind__: "ok" as const,
    ok: {
      gasAmount: BigInt(100),
      purchaseRecordId: BigInt(1),
      finalAmountUSD: 4.99,
      stripeClientSecret: "pi_mock_secret",
    },
  }),
  confirmGasPurchase: async () => ({
    __kind__: "ok" as const,
    ok: {
      userId: mockPrincipal,
      gasBalance: BigInt(350),
      autoRenewal: false,
      autoRenewalTierId: BigInt(1),
      updatedAt: BigInt(Date.now() * 1_000_000),
    },
  }),
  failGasPurchase: async () => undefined,
  setAutoRenewal: async (_enabled, _tierId) => ({
    __kind__: "ok" as const,
    ok: {
      userId: mockPrincipal,
      gasBalance: BigInt(250),
      autoRenewal: _enabled,
      autoRenewalTierId: _tierId,
      updatedAt: BigInt(Date.now() * 1_000_000),
    },
  }),
  archiveListing: async (id) => {
    const listing = mockListings.find((l) => l.id === id);
    if (!listing) throw new Error("Listing not found");
    listing.status = ListingStatus.archived;
    listing.archivedAt = BigInt(Date.now() * 1_000_000);
    listing.archivedManually = true;
    return listing;
  },
  restoreListing: async (id) => {
    const listing = mockListings.find((l) => l.id === id);
    if (!listing) return { __kind__: "err" as const, err: "Listing not found" };
    listing.status = ListingStatus.active;
    listing.archivedAt = undefined;
    listing.archivedManually = false;
    return { __kind__: "ok" as const, ok: listing };
  },
  permanentDeleteListing: async (id) => {
    const idx = mockListings.findIndex((l) => l.id === id);
    if (idx === -1) return { __kind__: "err" as const, err: "Listing not found" };
    mockListings.splice(idx, 1);
    return { __kind__: "ok" as const, ok: null };
  },
  listFavoritedListings: async () => mockListings.filter((l) => l.favorited),
  toggleListingPinned: async (listingId) => {
    const listing = mockListings.find((l) => l.id === listingId);
    if (!listing) return { __kind__: "err" as const, err: "Listing not found" };
    listing.pinned = !listing.pinned;
    listing.pinnedAt = listing.pinned ? BigInt(Date.now() * 1_000_000) : undefined;
    return { __kind__: "ok" as const, ok: listing.pinned };
  },
  toggleListingFavorited: async (listingId) => {
    const listing = mockListings.find((l) => l.id === listingId);
    if (!listing) return { __kind__: "err" as const, err: "Listing not found" };
    listing.favorited = !listing.favorited;
    return { __kind__: "ok" as const, ok: listing.favorited };
  },
  getBulkGasDiscounts: async (): Promise<BulkGasDiscount[]> => [
    { minGasAmount: BigInt(300), description: "10% off 300+ Gas", discountPercent: BigInt(10) },
    { minGasAmount: BigInt(1000), description: "20% off 1000+ Gas", discountPercent: BigInt(20) },
  ],
  initiatePayPalPayment: async (_tierId, _discountCode): Promise<{ __kind__: "ok"; ok: PaymentRecord } | { __kind__: "err"; err: string }> => ({
    __kind__: "ok" as const,
    ok: {
      id: BigInt(Date.now()),
      status: { pending: null } as PaymentStatus,
      paymentMethod: PaymentMethod.paypal,
      tierId: _tierId,
      userId: mockPrincipal,
      createdAt: BigInt(Date.now() * 1_000_000),
      amountUSD: 9.99,
      externalOrderId: "PAYPAL_MOCK_ORDER_123",
    },
  }),
  confirmPayPalPayment: async (_paymentId, _paypalOrderId) => ({
    __kind__: "ok" as const,
    ok: null,
  }),
  initiateCryptoPayment: async (_tierId, _discountCode): Promise<{ __kind__: "ok"; ok: PaymentRecord } | { __kind__: "err"; err: string }> => ({
    __kind__: "ok" as const,
    ok: {
      id: BigInt(Date.now()),
      status: { pending: null } as PaymentStatus,
      paymentMethod: PaymentMethod.crypto,
      tierId: _tierId,
      userId: mockPrincipal,
      createdAt: BigInt(Date.now() * 1_000_000),
      amountUSD: 9.99,
      externalOrderId: "CRYPTO_MOCK_TX_0xabc",
    },
  }),
  confirmCryptoPayment: async (_paymentId, _txHash) => ({
    __kind__: "ok" as const,
    ok: null,
  }),
  adminGetUserIdByUsername: async (username: string) => ({
    __kind__: "ok" as const,
    ok: "2vxsx-fae",
  }),
  adminListProfiles: async (): Promise<UserProfile[]> => [mockProfile],
  detectMarketplaceSource: async (url: string): Promise<MarketplaceSource> => {
    if (url.includes("facebook")) return MarketplaceSource.facebookMarketplace;
    if (url.includes("offerup")) return MarketplaceSource.offerUp;
    return MarketplaceSource.unknown_;
  },
  getMyProfile: async (): Promise<GetProfileResult> => ({
    __kind__: "ok" as const,
    ok: mockProfile,
  }),
  getProfileByUsername: async (_username: string): Promise<UserProfile | null> => mockProfile,
  getVerificationStatus: async (): Promise<VerificationRecord | null> => ({
    userId: mockPrincipal,
    email: "marty@copie-paste.app",
    token: "mock-token-123",
    status: VerificationStatus.verified,
    createdAt: BigInt(Date.now() * 1_000_000),
    expiresAt: BigInt((Date.now() + 3600000) * 1_000_000),
    resendCount: BigInt(0),
  }),
  initiateEmailVerification: async (_email: string) => ({
    __kind__: "ok" as const,
    ok: "Verification email sent",
  }),
  registerUserProfile: async (_username: string, _email: string): Promise<SetUsernameResult> => ({
    __kind__: "ok" as const,
    ok: mockProfile,
  }),
  resendVerificationEmail: async (_email: string): Promise<ResendResult> => ({
    __kind__: "ok" as const,
    ok: { resendCount: BigInt(1), cooldownSecondsRemaining: BigInt(0) },
  }),
  scrapeListing: async (_url: string): Promise<ScrapeResult> => ({
    __kind__: "ok" as const,
    ok: {
      title: "Scraped Listing Title",
      description: "Auto-filled from marketplace URL",
      price: "$999",
      imageUrls: [],
      sourceUrl: _url,
      source: MarketplaceSource.unknown_,
      category: undefined,
    },
  }),
  setMyUsername: async (_username: string): Promise<SetUsernameResult> => ({
    __kind__: "ok" as const,
    ok: { ...mockProfile, username: _username },
  }),
  verifyEmail: async (_token: string): Promise<VerifyEmailResult> => ({
    __kind__: "ok" as const,
    ok: null,
  }),
  adminSendAnnouncement: async (_title: string, _message: string) => ({
    __kind__: "ok" as const,
    ok: null,
  }),
  getUserNotifications: async (): Promise<InAppNotification[]> => [],
  markAllNotificationsRead: async (): Promise<void> => undefined,
  markNotificationRead: async (_notificationId: bigint): Promise<MarkReadResult> => ({
    __kind__: "ok" as const,
    ok: null,
  }),
  updateMyProfile: async (_args): Promise<UpdateProfileResult> => ({
    __kind__: "ok" as const,
    ok: { ...mockProfile },
  }),
  adminGetPaymentConfig: async () => ({
    stripePublishableKey: undefined,
    stripeSecretKey: undefined,
    stripeWebhookSecret: undefined,
    stripeWebhookSecretTest: undefined,
    stripeWebhookSecretLive: undefined,
    stripeProPriceId: undefined,
    stripeMaxPriceId: undefined,
    stripeWalkerPriceId: undefined,
    stripeBackupPriceId: undefined,
    stripeMode: "test",
    paypalClientId: undefined,
    paypalClientSecret: undefined,
    paypalMode: "sandbox",
  }),
  adminSavePaymentConfig: async (_config) => ({
    __kind__: "ok" as const,
    ok: null,
  }),
  adminTestStripeConnection: async () => ({
    success: true,
    message: "Connected (Test Mode) — Account: acct_mock — charges_enabled: true",
  }),
  adminTestPaypalConnection: async (_clientId, _clientSecret, _mode) => ({
    __kind__: "ok" as const,
    ok: "Connected",
  }),
  claimLoyaltyReward: async (_tier) => ({
    __kind__: "ok" as const,
    ok: null,
  }),
  generateWebhookToken: async () => ({
    __kind__: "ok" as const,
    ok: "mock-webhook-token-" + Date.now(),
  }),
  getMyWebhookToken: async () => ({
    __kind__: "ok" as const,
    ok: "mock-webhook-token-123",
  }),
  getFbListings: async () => ({
    __kind__: "ok" as const,
    ok: [],
  }),
  getLoyaltyStatus: async () => ({
    refuelCount: BigInt(0),
    rewardClaimedForTiers: [],
    currentTier: "TimeWalker",
  }),
  getMyFbCredentials: async () => null,
  getRefuelHistory: async () => [],
  parsePastedText: async (_text) => ({
    title: undefined,
    price: undefined,
    description: undefined,
    category: undefined,
  }),
  receiveExtensionData: async (_data, _token) => ({
    __kind__: "ok" as const,
    ok: BigInt(1),
  }),
  saveFbCredentials: async (_appId, _accessToken) => ({
    __kind__: "ok" as const,
    ok: null,
  }),
  getAuditLog: async (): Promise<AuditLogEntry[]> => [],
  checkAndCreateLowFuelNotification: async () => null,
  confirmSmartBackupPayment: async () => ({
    __kind__: "ok" as const,
    ok: {
      id: "mock-backup-id",
      downloadExpiresAt: BigInt(Date.now() * 1_000_000 + 7 * 24 * 60 * 60 * 1_000_000_000),
      userId: mockPrincipal,
      imageCount: BigInt(0),
      exportedAt: BigInt(Date.now() * 1_000_000),
      downloadToken: "mock-download-token",
      listingCount: BigInt(0),
      paymentIntentId: "mock-payment-intent",
    },
  }),
  createBackupRecord: async (fileSize) => ({
    id: BigInt(1),
    status: "completed" as any,
    userId: mockPrincipal,
    createdAt: BigInt(Date.now() * 1_000_000),
    downloadUrl: "",
    fileSize,
  }),
  deleteBackupRecord: async () => ({ __kind__: "ok" as const, ok: null }),
  getMyBackups: async () => [],
  generateBackupData: async () => [],
  initiateSmartBackup: async () => ({
    paymentRecordId: BigInt(1),
    amountUSD: 2.99,
    stripeClientSecret: undefined,
  }),
  restoreFromBackup: async () => ({ __kind__: "ok" as const, ok: BigInt(0) }),
  // ── New Stripe payment backend methods ───────────────────────────────────
  createStripeCheckoutSession: async (_priceId: string, _userId: string) => ({
    __kind__: "ok" as const,
    ok: "https://checkout.stripe.com/mock-session",
  }),
  createStripePortalSession: async () => ({
    __kind__: "ok" as const,
    ok: "https://billing.stripe.com/mock-portal",
  }),
  dismissPaymentBanner: async () => undefined,
  getPaymentBanner: async () => null,
  getRevenueStats: async () => ({
    today: BigInt(0),
    week: BigInt(0),
    month: BigInt(0),
    activeSubscribers: BigInt(0),
  }),
  getStripeHealthStatus: async () => ({
    status: "ok",
    keysConfigured: false,
    webhookConfigured: false,
    lastWebhookReceived: undefined,
  }),
  // ── Version Backup methods ───────────────────────────────────────────────────
  createVersionBackup: async (_isManual: boolean, _notes: string | null) => ({
    __kind__: "ok" as const,
    ok: {
      id: "mock-backup-" + Date.now(),
      versionLabel: "v1.0",
      createdAt: BigInt(Date.now() * 1_000_000),
      createdBy: "admin",
      backupData: "{}",
      backupType: _isManual ? "manual" : "auto",
      isStable: false,
      notes: _notes ?? undefined,
    },
  }),
  listVersionBackups: async () => [
    {
      id: "backup-aabb1234-xxxx",
      versionLabel: "v1.0",
      createdAt: BigInt(Date.now() * 1_000_000),
      createdBy: "auto",
      backupType: "auto",
      isStable: false,
      configCount: BigInt(0),
      sizeKb: BigInt(0),
      notes: undefined,
      userCount: BigInt(1),
      listingCount: BigInt(3),
    },
  ],
  restoreFromVersionBackup: async (_backupId: string) => ({
    success: true,
    usersRestored: BigInt(1),
    listingsRestored: BigInt(3),
    preSaveBackupId: "backup-presave-" + Date.now(),
    errorMessage: "",
  }),
  generateFullBackupEntries: async () => [],
  getBackupDownloadInfo: async () => null,
  getBackupHistory: async () => [],
  restoreFromZipBackup: async () => ({
    success: true,
    listingsRestored: BigInt(0),
    errorMessage: undefined,
  }),
  // ── Gemini OCR methods ───────────────────────────────────────────────────
  adminGetGeminiConfig: async () => ({
    configured: false,
    model: "gemini-2.5-flash-lite",
  }),
  adminSaveGeminiConfig: async (_apiKey: string) => ({
    __kind__: "ok" as const,
    ok: null,
  }),
  adminTestGeminiConnection: async () => ({
    success: true,
    message: "Connected — OCR Active",
  }),
  ocrScanImage: async (_imageBase64: string) => ({
    __kind__: "ok" as const,
    ok: {
      title: "",
      price: "",
      description: "",
      category: "",
      condition: "",
      brand: "",
    },
  }),
  // ── Missing stubs (pre-existing backend methods) ─────────────────────────────
  adminDeleteUser: async (_userId: string) => ({ __kind__: "ok" as const, ok: "deleted" }),
  deleteBackup: async (_backupId: string) => true,
  deleteConfig: async (_key: string) => {},
  exportAllUsersData: async () => ({ imageUrls: [] as string[], jsonData: "{}" }),
  exportUserData: async (_userId: string) => ({ imageUrls: [] as string[], jsonData: "{}" }),
  getAllConfig: async () => [] as import("../backend.d").ConfigEntry[],
  markBackupAsStable: async (_backupId: string) => true,
  initConfigFromPaymentConfig: async () => {},
  getConfig: async (_key: string) => null as string | null,
  getHealthStatus: async () => ({
    status: "ok",
    backupCount: BigInt(0),
    keysConfigured: false,
    lastBackupAt: BigInt(0),
    criticalKeysPresent: false,
  }),
  setConfig: async (
    _key: string,
    _value: string,
    _encrypted: boolean,
    _category: string,
    _updatedBy: string,
  ) => {},
  // ── Support Tickets ──────────────────────────────────────────────────────
  closeSupportTicket: async (_id: bigint) => ({ __kind__: "ok" as const, ok: null }),
  getSupportTicket: async (_id: bigint) => null,
  listSupportTickets: async () => [],
  replySupportTicket: async (_id: bigint, _reply: string) => ({ __kind__: "ok" as const, ok: null }),
  submitSupportTicket: async (_subject: string, _message: string) => ({ __kind__: "ok" as const, ok: "mock-ticket-id" }),
  // ── Broadcast Notifications ──────────────────────────────────────────────
  createBroadcastNotification: async (
    _title: string,
    _message: string,
    _priority: string,
    _targetType: string,
    _targetUserId: string | null,
  ) => ({ __kind__: "ok" as const, ok: BigInt(1) }),
  // ── Admin Notifications ──────────────────────────────────────────────────
  listAdminNotifications: async () => [],
  markAdminNotificationRead: async (_id: bigint) => undefined,
  markAllAdminNotificationsRead: async () => undefined,
  getUnreadAdminNotificationCount: async () => BigInt(0),
  // ── Maintenance Mode ─────────────────────────────────────────────────────
  getMaintenanceMode: async () => ({ isActive: false, message: "", eta: "" }),
  setMaintenanceMode: async (_isActive: boolean, _message: string, _eta: string) => undefined,
  // ── System Health ────────────────────────────────────────────────────────
  getSystemHealthStatus: async () => ({
    stripe: {
      status: "unconfigured",
      hasPublishableKey: false,
      hasSecretKey: false,
      hasPriceIds: false,
      lastWebhookAt: undefined,
    },
    gemini: { status: "unconfigured", hasApiKey: false },
    database: { status: "ok", canReadUsers: true, canReadConfig: true },
    backup: { status: "no-backup", backupCount: BigInt(0), lastBackupAt: undefined, freshnessHours: undefined },
    maintenance: { isActive: false },
    signups: { total: BigInt(1), lastSignupAt: undefined },
    paypal: { status: "unconfigured", isConfigured: false },
  }),
  // ── Adaptive Backup ──────────────────────────────────────────────────────
  getAdaptiveBackupSchedule: async () => ({ intervalHours: BigInt(24), nextBackupAt: BigInt(Date.now() * 1_000_000), userCount: BigInt(1) }),
  triggerAdaptiveAutoBackup: async () => ({ __kind__: "ok" as const, ok: null }),
  // ── Stripe public key ────────────────────────────────────────────────────
  getStripePublicKey: async () => ({ publishableKey: "" }),
  // ── User account restore ─────────────────────────────────────────────────
  restoreUserAccountFromBackup: async (_userId: string, _backupId: string) => ({ __kind__: "ok" as const, ok: "Restored" }),
  // ── ICP HTTPS Outcall transform functions ─────────────────────────────────
  // These are called by the ICP runtime to strip non-deterministic fields
  // from external API responses before consensus. In the mock, they pass through.
  transformGeminiResponse: async (raw) => raw.response,
  transformPaypalTokenResponse: async (raw) => raw.response,
  transformStripeAccountResponse: async (raw) => raw.response,
  transformStripeCheckoutResponse: async (raw) => raw.response,
  transformStripeCustomerResponse: async (raw) => raw.response,
  transformStripePaymentIntentResponse: async (raw) => raw.response,
  transformStripePortalResponse: async (raw) => raw.response,
  transformGeminiTestResponse: async (raw) => raw.response,
  // ── Version Snapshots ─────────────────────────────────────────────────────
  createAdaptiveVersionSnapshot: async () => null,
  getVersionSnapshotList: async () => [],
  // ── Config API (admin-only setters) ──────────────────────────────────────
  adminSetStripeKeys: async (_publishable: string, _secret: string, _mode: string) => undefined,
  adminSetStripePrices: async (_walker: string, _traveler: string, _lord: string, _backup: string) => undefined,
  adminSetGeminiKey: async (_key: string) => undefined,
  adminSetMaintenanceMode: async (_enabled: boolean, _message: string) => undefined,
  // ── Public config query ───────────────────────────────────────────────────
  getPublicConfig: async () => ({
    publishableKey: "",
    mode: "test",
    maintenanceMode: false,
    maintenanceMessage: "Copie Past-e is temporarily offline for maintenance.",
    gasWalkerPriceId: "",
    gasTravelerPriceId: "",
    gasLordPriceId: "",
  }),
  // ── Canister cycles balance ───────────────────────────────────────────────
  getCanisterCyclesBalance: async () => BigInt(5_000_000_000_000),
  // ── Verify and grant payment ──────────────────────────────────────────────
  verifyAndGrantPayment: async (_sessionId: string) => ({
    __kind__: "ok" as const,
    ok: "Payment verified. 30 days added.",
  }),
  // ── Pending session helpers ───────────────────────────────────────────────
  getPendingSession: async () => null,
  clearPendingSession: async () => undefined,
  // ── Transform for Stripe verify response ─────────────────────────────────
  transformStripeVerifyResponse: async (raw: { context: Uint8Array; response: { status: bigint; body: Uint8Array; headers: Array<{ value: string; name: string }> } }) => raw.response,
  debugCheckStripeKeyLength: async () => 0n,
};

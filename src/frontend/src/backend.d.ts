import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface UserCleanupSummary {
    hasExpiredListings: boolean;
    userId: Principal;
    email: string;
    archivedListingCount: bigint;
    oldestActiveExpirationDate?: Timestamp;
    activeListingCount: bigint;
}
export interface PlatformListingDraft {
    status: DraftStatus;
    lastEditedAt: bigint;
    createdAt: bigint;
    validationErrors: Array<{
        field: string;
        error: string;
    }>;
    platform: Platform__2;
    manualPostingLog: Array<ManualPostEntry>;
    isValid: boolean;
    platformFields: PlatformFields;
    draftId: string;
    completenessPercent: bigint;
}
export interface VersionBackup {
    id: string;
    versionLabel: string;
    createdAt: Timestamp;
    createdBy: string;
    isStable: boolean;
    backupData: string;
    backupType: string;
    notes?: string;
}
export interface PlatformCapabilities {
    supportsAutoSync: boolean;
    supportsCondition: boolean;
    maxPhotos: bigint;
    maxTitleLength: bigint;
    supportsShipping: boolean;
    priceFormat: string;
    supportedCategories: Array<string>;
    apiAvailable: boolean;
    maxDescriptionLength: bigint;
    name: string;
    supportsBulkListing: boolean;
    supportsLocalPickup: boolean;
    requiresCategory: boolean;
    supportsBrand: boolean;
}
export interface HealthStatus {
    status: string;
    backupCount: bigint;
    keysConfigured: boolean;
    lastBackupAt: Timestamp;
    criticalKeysPresent: boolean;
}
export interface MonitoringLogEntry {
    component: string;
    level: string;
    message: string;
    timestamp: bigint;
    cyclesAvailable: bigint;
}
export interface DepopFields {
    title: string;
    color?: string;
    size?: string;
    description: string;
    category?: string;
    brand?: string;
    price?: string;
    photos: Array<Uint8Array>;
    condition?: string;
}
export interface OcrFailureEntry {
    imageHash: string;
    errorType: string;
    userPrincipal: string;
    timestamp: bigint;
    errorReason: string;
}
export interface UserSummary {
    lastLoginDate?: Timestamp;
    userId: string;
    role: string;
    imageCount: bigint;
    registrationDate: Timestamp;
    listingCount: bigint;
}
export interface UserTierSubscription {
    stripeSubscriptionId?: string;
    userId: Principal;
    tier: bigint;
    autoRenewal: boolean;
    updatedAt: bigint;
    expirationDate: bigint;
}
export interface UniversalListing {
    id: string;
    status: ListingStatus__1;
    soldOnPlatforms: Array<string>;
    title: string;
    publishSchedule?: PublishSchedule;
    metrics: ListingMetrics;
    userId: Principal;
    createdAt: bigint;
    publishedAt?: bigint;
    description: string;
    pricingRules: PricingRules;
    quantitySold: bigint;
    quantity: bigint;
    category?: string;
    brand?: string;
    lastSyncAt?: bigint;
    price?: string;
    photos: Array<Uint8Array>;
    targetPlatforms: Array<PlatformTarget>;
    condition: string;
}
export interface LoyaltyStatus {
    rewardClaimedForTiers: Array<TierName>;
    currentTier: TierName;
    refuelCount: bigint;
}
export interface PoshmarkFields {
    title: string;
    color?: string;
    size?: string;
    description: string;
    category?: string;
    brand?: string;
    department?: string;
    price?: string;
    photos: Array<Uint8Array>;
    condition?: string;
}
export interface ExtensionConfigResult {
    chromeWebStoreUrl: string;
    capabilities: ExtensionCapabilities;
    downloadMode: string;
    localDownloadUrl: string;
    downloadUrl: string;
    releaseNotes: string;
    latestVersion: string;
    supportedPlatforms: Array<string>;
    buildNumber: bigint;
    isForceUpdate: boolean;
}
export type ResendResult = {
    __kind__: "ok";
    ok: {
        resendCount: bigint;
        cooldownSecondsRemaining: bigint;
    };
} | {
    __kind__: "err";
    err: string;
};
export interface ZipRestoreResult {
    errorMessage?: string;
    listingsRestored: bigint;
    success: boolean;
}
export type GetProfileResult = {
    __kind__: "ok";
    ok: UserProfile;
} | {
    __kind__: "err";
    err: string;
};
export interface PublishSchedule {
    scheduledTime?: bigint;
    scheduleType: Variant_scheduled_batch_immediate;
    batchNumber?: bigint;
    itemsPerBatch?: bigint;
}
export interface MasterListing {
    id: string;
    status: ListingStatus__2;
    title: string;
    platformDrafts: Array<PlatformListingDraft>;
    userId: Principal;
    createdAt: bigint;
    tags: Array<string>;
    description: string;
    auditLog: Array<AuditEntry>;
    updatedAt: bigint;
    pinned: boolean;
    expirationDate?: bigint;
    pinnedAt?: bigint;
    category?: string;
    archivedReason?: string;
    price?: string;
    photos: Array<Uint8Array>;
    favoriteCount: bigint;
    archivedAt?: bigint;
}
export interface ScrapedListing {
    title?: string;
    imageUrls: Array<string>;
    source: MarketplaceSource;
    description?: string;
    sourceUrl: string;
    category?: string;
    price?: string;
}
export interface CreateMasterListingArgs {
    title: string;
    tags: Array<string>;
    description: string;
    clientRequestId: string;
    category?: string;
    price?: string;
    photos: Array<Uint8Array>;
}
export type PlatformFields = {
    __kind__: "poshmark";
    poshmark: PoshmarkFields;
} | {
    __kind__: "ebay";
    ebay: EbayFields;
} | {
    __kind__: "etsy";
    etsy: EtsyFields;
} | {
    __kind__: "facebook";
    facebook: FacebookFields;
} | {
    __kind__: "depop";
    depop: DepopFields;
} | {
    __kind__: "mecari";
    mecari: MecariFields;
};
export type UserId = Principal;
export interface GasWallet {
    userId: UserId;
    autoRenewal: boolean;
    updatedAt: Timestamp;
    autoRenewalTierId: bigint;
    gasBalance: bigint;
}
export interface ParsedListingResult {
    title?: string;
    description?: string;
    category?: string;
    price?: string;
}
export interface VersionBackupSummary {
    id: string;
    versionLabel: string;
    createdAt: Timestamp;
    createdBy: string;
    isStable: boolean;
    backupType: string;
    notes?: string;
    configCount: bigint;
    sizeKb: bigint;
    listingCount: bigint;
    userCount: bigint;
}
export interface ExtensionUpdateCheck {
    needsUpdate: boolean;
    downloadUrl: string;
    releaseNotes: string;
    currentVersion: string;
    latestVersion: string;
    buildNumber: bigint;
    isForceUpdate: boolean;
}
export interface AppError {
    code: ErrorCode;
    message: string;
}
export interface AddImageArgs {
    order: bigint;
    blob: ExternalBlob;
    listingId: ListingId;
    altText: string;
}
export interface DiscountCode {
    id: bigint;
    active: boolean;
    discountValue: number;
    code: string;
    discountType: DiscountType;
    usageCount: bigint;
    expirationDate: bigint;
    tierRestriction?: bigint;
    maxUses: bigint;
}
export interface ListingSnapshot {
    title: string;
    favorited: boolean;
    description: string;
    pinned: boolean;
    category?: string;
    price?: string;
}
export interface EtsyFields {
    whoMade?: string;
    title: string;
    tags: Array<string>;
    description: string;
    whenMade?: string;
    materials: Array<string>;
    category?: string;
    price?: string;
    photos: Array<Uint8Array>;
    isSupply: boolean;
}
export interface UpdateListingArgs {
    id: ListingId;
    mecariCondition?: Condition;
    tierLevel?: bigint;
    title: string;
    fbLocalPickup?: boolean;
    description: string;
    platform?: Platform__1;
    mecariDeliveryDays?: bigint;
    fbShipping?: boolean;
    fbCondition?: Condition;
    category?: string;
    mecariShippingType?: string;
    mecariBrand?: string;
    price?: string;
}
export type ScrapeResult = {
    __kind__: "ok";
    ok: ScrapedListing;
} | {
    __kind__: "err";
    err: string;
};
export interface CrossListingCampaign {
    id: string;
    status: Variant_active_completed_draft_failed;
    listings: Array<string>;
    userId: Principal;
    name: string;
    createdAt: bigint;
    results: CampaignResults;
    targetPlatforms: Array<string>;
}
export interface SystemIssue {
    id: string;
    resolved: boolean;
    title: string;
    description: string;
    affectedComponent: string;
    suggestedFix: string;
    severity: Variant_warning_info_error_critical;
    discoveredAt: Timestamp;
}
export type ListingId = bigint;
export interface PaymentBannerState {
    expiresAt?: bigint;
    bannerType: string;
    userId: Principal;
    createdAt: bigint;
    message: string;
}
export interface CreateListingArgs {
    mecariCondition?: Condition;
    tierLevel?: bigint;
    title: string;
    fbLocalPickup?: boolean;
    description: string;
    platform?: Platform__1;
    sourceUrl?: string;
    mecariDeliveryDays?: bigint;
    fbShipping?: boolean;
    fbCondition?: Condition;
    category?: string;
    mecariShippingType?: string;
    mecariBrand?: string;
    price?: string;
}
export interface FbCredentials {
    appId: string;
    accessToken: string;
}
export type DraftListingId = bigint;
export interface SupportTicket {
    id: bigint;
    status: string;
    adminReply?: string;
    username: string;
    subject: string;
    userId: UserId;
    createdAt: Timestamp;
    repliedAt?: Timestamp;
    message: string;
    attachmentUrls?: Array<string>;
}
export interface Listing {
    id: ListingId;
    mecariCondition?: Condition;
    status: ListingStatus;
    tierLevel: bigint;
    title: string;
    fbLocalPickup?: boolean;
    favorited: boolean;
    userId: UserId;
    createdAt: Timestamp;
    description: string;
    platform?: Platform__1;
    sourceUrl?: string;
    mecariDeliveryDays?: bigint;
    pinned: boolean;
    expirationDate: Timestamp;
    fbShipping?: boolean;
    fbCondition?: Condition;
    archivedManually: boolean;
    pinnedAt?: Timestamp;
    restoredAt?: Timestamp;
    category?: string;
    mecariShippingType?: string;
    brand?: string;
    mecariBrand?: string;
    price?: string;
    condition?: string;
    archivedAt?: Timestamp;
}
export interface MecariFields {
    title: string;
    deliveryDays?: bigint;
    description: string;
    shippingType?: Variant_normal_fast_sameDay;
    category?: string;
    brand: string;
    price?: string;
    photos: Array<Uint8Array>;
    condition?: MecariCondition5Scale;
}
export interface ExtensionVersion {
    downloadUrl: string;
    releaseNotes: string;
    version: string;
    releasedAt: Timestamp;
    supportedPlatforms: Array<string>;
    buildNumber: bigint;
    isForceUpdate: boolean;
}
export interface GasPurchase {
    id: bigint;
    status: GasPurchaseStatus;
    userId: UserId;
    gasAmount: bigint;
    createdAt: Timestamp;
    stripePaymentIntentId: string;
    priceUSD: number;
}
export interface UpdateMasterListingArgs {
    title?: string;
    tags?: Array<string>;
    description?: string;
    category?: string;
    price?: string;
}
export interface OcrResult {
    title: string;
    description: string;
    category: string;
    brand: string;
    price: string;
    condition: string;
}
export interface FieldMapping {
    weight?: string;
    title: string;
    condition5Scale?: string;
    localPickup?: boolean;
    color?: string;
    size?: string;
    shipping?: boolean;
    deliveryDays?: bigint;
    description: string;
    shippingCost?: string;
    shippingType?: string;
    category?: string;
    brand?: string;
    dimensions?: string;
    condition?: string;
}
export type VerifyEmailResult = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export interface AutofillTestResult {
    fieldsFailed: Array<string>;
    duration: bigint;
    platform: string;
    message: string;
    success: boolean;
    fieldsPrepped: Array<string>;
}
export interface ExtensionListingData {
    mecariCondition?: ItemCondition;
    totalImageSize?: bigint;
    title: string;
    fbLocalPickup?: boolean;
    imageUrls: Array<string>;
    mecariCategory?: string;
    description?: string;
    platform: Platform;
    sourceUrl?: string;
    mecariDeliveryDays?: bigint;
    fbShipping?: boolean;
    fbCondition?: ItemCondition;
    offerUpCondition?: ItemCondition;
    mecariShippingType?: string;
    mecariBrand?: string;
    price?: string;
    fbCategory?: string;
    imageFileTypes: Array<string>;
    offerUpCategory?: string;
}
export interface PaymentRecord {
    id: bigint;
    status: PaymentStatus;
    paymentMethod: PaymentMethod;
    tierId: bigint;
    userId: Principal;
    createdAt: bigint;
    stripePaymentIntentId?: string;
    amountUSD: number;
    externalOrderId?: string;
}
export interface AuditEntry {
    action: string;
    timestamp: bigint;
    details?: string;
    caller: Principal;
}
export type TierName = string;
export interface BackupRecord {
    id: bigint;
    status: BackupStatus;
    userId: UserId;
    createdAt: Timestamp;
    downloadUrl: string;
    fileSize: bigint;
}
export interface ComponentMetrics {
    successCount: bigint;
    uptime: number;
    errorCount: bigint;
    responseTime: bigint;
}
export interface PlatformAutofillConfig {
    fbPrefillDescription: boolean;
    fbAutoClickLocalPickup: boolean;
    mecariPrefillDescription: boolean;
    lastUpdated: Timestamp;
    mecariPrefillCondition: boolean;
    enabled: boolean;
    updatedBy: string;
    mecariAutoSelectDeliveryDays: boolean;
    mecariAutoSelectShipping: boolean;
    mecariPrefillBrand: boolean;
    fbPrefillPrice: boolean;
    mecariPrefillPrice: boolean;
    mecariShippingType?: string;
    fbPrefillCondition: boolean;
    fbAutoClickShipping: boolean;
    mecariDeliveryDaysValue?: bigint;
    fbPrefillCategory: boolean;
    fbPrefillTitle: boolean;
    platformName: string;
    mecariPrefillCategory: boolean;
    mecariPrefillTitle: boolean;
}
export interface IntegrationStatus {
    configPresent: boolean;
    name: string;
    errorMessage?: string;
    lastTestResult?: boolean;
    lastTestAt?: Timestamp;
    connected: boolean;
}
export interface ComponentStatus {
    status: Variant_warning_healthy_error_offline;
    metrics: ComponentMetrics;
    name: string;
    lastCheck: Timestamp;
    message: string;
    category: string;
}
export interface BackupListingEntry {
    id: bigint;
    title: string;
    favorited: boolean;
    subcategory?: string;
    createdAt: Timestamp;
    description: string;
    sourceUrl?: string;
    pinned: boolean;
    category?: string;
    brand?: string;
    price?: string;
    typeModel?: string;
    condition?: string;
    images: Array<BackupImageEntry>;
    archivedAt?: Timestamp;
}
export interface FbListing {
    id: string;
    title: string;
    imageUrls: Array<string>;
    description?: string;
    category?: string;
    price?: string;
}
export interface AutofillValidation {
    valid: boolean;
    errors: Array<string>;
    warnings: Array<string>;
    platformReady: boolean;
}
export interface PricingRules {
    maxPrice?: string;
    priceAdjustmentPerPlatform: Array<[string, string]>;
    minPrice?: string;
    priceMarkupPercent?: number;
    basePrice: string;
    autoRepricing: boolean;
}
export type MarkReadResult = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export interface ManualPostEntry {
    action: ManualPostAction;
    message: string;
    remoteUrl?: string;
    timestamp: bigint;
}
export interface InAppNotification {
    id: bigint;
    title: string;
    userId: UserId;
    notificationType: NotificationType;
    createdAt: Timestamp;
    isRead: boolean;
    message: string;
}
export interface BackupImageEntry {
    originalUrl: string;
    filename: string;
}
export type SetUsernameResult = {
    __kind__: "ok";
    ok: UserProfile;
} | {
    __kind__: "err";
    err: string;
};
export interface RestoreResult {
    errorMessage?: string;
    preSaveBackupId: string;
    usersRestored: bigint;
    listingsRestored: bigint;
    success: boolean;
}
export interface AutofillHealthStatus {
    successRate: number;
    isHealthy: boolean;
    enabled: boolean;
    totalAttempts: bigint;
    lastTestResult?: string;
    lastTestAt?: Timestamp;
    totalSuccessful: bigint;
    activeSessions: bigint;
    platformName: string;
}
export interface AuditLogEntry {
    id: bigint;
    action: string;
    timestamp: Timestamp;
    details: string;
    adminId: UserId;
    targetUserId?: UserId;
}
export interface RefuelEntry {
    tierAtRefuel: TierName;
    date: bigint;
}
export interface SiteSettings {
    maxSessionDurationMinutes: bigint;
    appName: string;
    primaryColor: string;
    contentModerationEnabled: boolean;
    createdAt: Timestamp;
    accentColor: string;
    updatedAt: Timestamp;
    copyButtonsEnabled: boolean;
    maxRequestsPerMinute: bigint;
    maxConcurrentSessions: bigint;
    allowedOrigins: string;
    uploadEnabled: boolean;
    maxUploadsPerHour: bigint;
}
export interface ExtensionCapabilities {
    poshmark: boolean;
    ebay: boolean;
    etsy: boolean;
    facebook: boolean;
    depop: boolean;
    mercari: boolean;
}
export interface AppVersion {
    id: bigint;
    versionLabel: string;
    createdAt: Timestamp;
    createdBy: UserId;
    description: string;
    settingsSnapshot: SiteSettings;
    isRollback: boolean;
}
export type UpdateProfileResult = {
    __kind__: "ok";
    ok: UserProfile;
} | {
    __kind__: "err";
    err: string;
};
export interface BackupHistoryRecord {
    id: string;
    downloadExpiresAt: Timestamp;
    userId: UserId;
    imageCount: bigint;
    exportedAt: Timestamp;
    downloadToken: string;
    listingCount: bigint;
    paymentIntentId: string;
}
export interface UserProfile {
    fbWebhookToken?: string;
    emailVerified: boolean;
    username: string;
    displayName?: string;
    userId: UserId;
    createdAt: Timestamp;
    role: string;
    email: string;
    fbAppId?: string;
    fbAccessToken?: string;
    updatedAt: Timestamp;
    stripeCustomerId?: string;
    phoneNumber?: string;
}
export interface ListingMetrics {
    viewsPerPlatform: Array<[string, bigint]>;
    totalOffers: bigint;
    offersPerPlatform: Array<[string, bigint]>;
    totalViews: bigint;
    salesPerPlatform: Array<[string, bigint]>;
    totalLikes: bigint;
    totalSales: bigint;
    conversionRate?: number;
    avgTimeToSale?: bigint;
    likesPerPlatform: Array<[string, bigint]>;
}
export interface ConfigEntry {
    key: string;
    value: string;
    encrypted: boolean;
    updatedAt: Timestamp;
    updatedBy: string;
    category: string;
}
export type Timestamp = bigint;
export interface CampaignResults {
    totalListingsPublished: bigint;
    publishedAt?: bigint;
    totalSales: bigint;
    totalListingsFailed: bigint;
    avgConversionRate?: number;
    totalRevenue?: string;
    avgViewsPerListing?: number;
    totalListingsSucceeded: bigint;
}
export interface FacebookFields {
    title: string;
    localPickup: boolean;
    shipping: boolean;
    description: string;
    category?: string;
    price?: string;
    photos: Array<Uint8Array>;
    condition?: FacebookCondition;
}
export interface UpdateProfileArgs {
    displayName?: string;
    email?: string;
    phoneNumber?: string;
}
export interface GasPackage {
    gasAmount: bigint;
    name: string;
    stripeProductId: string;
    priceUSD: number;
    packageId: bigint;
}
export interface SavePlatformDraftArgs {
    platform: Platform__2;
    platformFields: PlatformFields;
    photos: Array<Uint8Array>;
}
export interface EbayFields {
    title: string;
    description: string;
    shippingCost?: string;
    quantity: bigint;
    category?: string;
    price?: string;
    photos: Array<Uint8Array>;
    condition?: FacebookCondition;
}
export interface UpdateSettingsArgs {
    maxSessionDurationMinutes: bigint;
    appName: string;
    primaryColor: string;
    contentModerationEnabled: boolean;
    accentColor: string;
    copyButtonsEnabled: boolean;
    maxRequestsPerMinute: bigint;
    maxConcurrentSessions: bigint;
    allowedOrigins: string;
    uploadEnabled: boolean;
    maxUploadsPerHour: bigint;
}
export interface VerificationRecord {
    status: VerificationStatus;
    token: string;
    expiresAt: Timestamp;
    userId: UserId;
    createdAt: Timestamp;
    resendCount: bigint;
    email: string;
    lastResendAt?: Timestamp;
}
export interface TierConfig {
    durationDays: bigint;
    tierId: bigint;
    name: string;
    stripeProductId?: string;
    priceUSD: number;
}
export interface PaymentConfig {
    stripeProPriceId?: string;
    stripeBackupPriceId?: string;
    paypalMode: string;
    stripeSecretKey?: string;
    stripeWebhookSecretLive?: string;
    stripeWebhookSecretTest?: string;
    stripePublishableKey?: string;
    stripeMode: string;
    stripeMaxPriceId?: string;
    paypalClientId?: string;
    paypalClientSecret?: string;
    stripeWebhookSecret?: string;
    stripeWalkerPriceId?: string;
}
export interface SiteAnalytics {
    totalListings: bigint;
    avgImagesPerListing: number;
    totalArchivedListings: bigint;
    totalUsers: bigint;
    totalImages: bigint;
    paymentRevenue: number;
    totalActiveListings: bigint;
    avgListingsPerUser: number;
}
export interface SystemDiagnostics {
    recommendations: Array<string>;
    criticalFailures: Array<string>;
    components: Array<ComponentStatus>;
    issues: Array<SystemIssue>;
    timestamp: Timestamp;
    overallStatus: Variant_warning_healthy_critical;
}
export type ImageId = bigint;
export interface CreateVersionArgs {
    versionLabel: string;
    description: string;
}
export interface AdminNotification {
    id: bigint;
    notifType: string;
    createdAt: Timestamp;
    isRead: boolean;
    message: string;
    priority: string;
    relatedId?: string;
    relatedUser: string;
    targetAdminId?: string;
}
export interface Image {
    id: ImageId;
    order: bigint;
    blob: ExternalBlob;
    listingId: ListingId;
    altText: string;
}
export interface PlatformTarget {
    status: RemoteListingStatus;
    listingId?: string;
    publishedAt?: bigint;
    customPrice?: string;
    platform: string;
    enabled: boolean;
    syncedAt?: bigint;
    mappedFields: FieldMapping;
    customCategory?: string;
}
export interface BulkGasDiscount {
    minGasAmount: bigint;
    description: string;
    discountPercent: bigint;
}
export interface AdminTierAction {
    tierId: bigint;
    userId: Principal;
    createdAt: bigint;
    newExpirationDate: bigint;
    daysAdded: bigint;
    adminId: Principal;
}
export enum BackupStatus {
    pending = "pending",
    complete = "complete",
    failed = "failed"
}
export enum DiscountType {
    fixedUSD = "fixedUSD",
    percentage = "percentage"
}
export enum DraftStatus {
    preparing = "preparing",
    unsaved = "unsaved",
    saved = "saved",
    ready = "ready",
    posted = "posted"
}
export enum ErrorCode {
    platformNotSupported = "platformNotSupported",
    invalidInput = "invalidInput",
    duplicateEntry = "duplicateEntry",
    systemError = "systemError",
    notFound = "notFound",
    quotaExceeded = "quotaExceeded",
    unauthorized = "unauthorized",
    draftNotFound = "draftNotFound"
}
export enum GasPurchaseStatus {
    pending = "pending",
    completed = "completed",
    failed = "failed"
}
export enum ItemCondition {
    new_ = "new",
    fair = "fair",
    good = "good",
    poor = "poor",
    likeNew = "likeNew",
    unknown_ = "unknown"
}
export enum ListingStatus {
    active = "active",
    archived = "archived"
}
export enum ListingStatus__1 {
    active = "active",
    pending = "pending",
    sold = "sold",
    draft = "draft",
    archived = "archived"
}
export enum ListingStatus__2 {
    active = "active",
    draft = "draft",
    archived = "archived"
}
export enum ManualPostAction {
    submitted = "submitted",
    edited = "edited",
    error = "error",
    saved = "saved",
    drafted = "drafted"
}
export enum MarketplaceSource {
    facebookMarketplace = "facebookMarketplace",
    offerUp = "offerUp",
    unknown_ = "unknown"
}
export enum MecariCondition5Scale {
    new_ = "new",
    fair = "fair",
    good = "good",
    poor = "poor",
    likeNew = "likeNew"
}
export enum NotificationType {
    refuelSuccess = "refuelSuccess",
    lowFuelWarning = "lowFuelWarning",
    subscriptionExpiry = "subscriptionExpiry",
    listingDeletionWarning = "listingDeletionWarning",
    subscriptionRenewed = "subscriptionRenewed",
    subscriptionCancelled = "subscriptionCancelled",
    adminAnnouncement = "adminAnnouncement",
    listingArchived = "listingArchived",
    paymentFailed = "paymentFailed"
}
export enum PaymentMethod {
    stripe = "stripe",
    crypto = "crypto",
    paypal = "paypal"
}
export enum Platform {
    facebookMarketplace = "facebookMarketplace",
    offerUp = "offerUp",
    unknown_ = "unknown",
    mecari = "mecari"
}
export enum Platform__1 {
    facebook = "facebook",
    offerUp = "offerUp",
    unknown_ = "unknown",
    mecari = "mecari"
}
export enum Platform__2 {
    poshmark = "poshmark",
    ebay = "ebay",
    etsy = "etsy",
    facebook = "facebook",
    depop = "depop",
    mecari = "mecari"
}
export enum RemoteListingStatus {
    scheduled = "scheduled",
    active = "active",
    sold = "sold",
    error = "error",
    syncing = "syncing",
    delisted = "delisted"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_active_completed_draft_failed {
    active = "active",
    completed = "completed",
    draft = "draft",
    failed = "failed"
}
export enum Variant_normal_fast_sameDay {
    normal = "normal",
    fast = "fast",
    sameDay = "sameDay"
}
export enum Variant_scheduled_batch_immediate {
    scheduled = "scheduled",
    batch = "batch",
    immediate = "immediate"
}
export enum Variant_warning_healthy_critical {
    warning = "warning",
    healthy = "healthy",
    critical = "critical"
}
export enum Variant_warning_healthy_error_offline {
    warning = "warning",
    healthy = "healthy",
    error = "error",
    offline = "offline"
}
export enum Variant_warning_info_error_critical {
    warning = "warning",
    info = "info",
    error = "error",
    critical = "critical"
}
export enum VerificationStatus {
    verified = "verified",
    expired = "expired",
    pending = "pending"
}
export interface backendInterface {
    addImage(args: AddImageArgs): Promise<Image>;
    adminCreateBackupNow(): Promise<{
        __kind__: "ok";
        ok: {
            backupId: string;
            createdAt: bigint;
        };
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminCreateDiscountCode(code: string, discountType: DiscountType, discountValue: number, expirationDate: bigint, maxUses: bigint, tierRestriction: bigint | null): Promise<DiscountCode>;
    adminDeactivateDiscountCode(discountId: bigint): Promise<void>;
    adminDeleteUser(userId: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminExtendUserTier(userId: UserId, tierId: bigint, daysAdded: bigint): Promise<UserTierSubscription>;
    adminExtendUserTierByUsername(username: string, tierId: bigint, daysAdded: bigint): Promise<{
        __kind__: "ok";
        ok: UserTierSubscription;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminForceResaveStripeConfig(): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminGetGeminiConfig(): Promise<{
        model: string;
        configured: boolean;
    }>;
    adminGetPaymentConfig(): Promise<PaymentConfig>;
    adminGetUserIdByUsername(username: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminGetUserSubscription(userId: UserId): Promise<UserTierSubscription | null>;
    adminListDiscountCodes(): Promise<Array<DiscountCode>>;
    adminListExtensionVersions(): Promise<Array<ExtensionVersion>>;
    adminListPayments(): Promise<Array<PaymentRecord>>;
    adminListProfiles(): Promise<Array<UserProfile>>;
    adminListSubscriptions(): Promise<Array<UserTierSubscription>>;
    adminListTierActions(): Promise<Array<AdminTierAction>>;
    adminLockBackupPermanent(backupId: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminResetAllUserSubscriptions(): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminResetUserSubscription(username: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminSaveGeminiConfig(apiKey: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminSavePaymentConfig(config: PaymentConfig): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminSendAnnouncement(title: string, message: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminSetExtensionConfig(downloadMode: string, localDownloadUrl: string, chromeWebStoreUrl: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminSetExtensionVersion(version: string, buildNumber: bigint, releaseNotes: string, downloadUrl: string, isForceUpdate: boolean): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminSetGeminiKey(key: string): Promise<void>;
    adminSetMaintenanceMode(enabled: boolean, message: string): Promise<void>;
    adminSetPlatformCapabilities(facebook: boolean, mercari: boolean, ebay: boolean, poshmark: boolean, depop: boolean, etsy: boolean): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminSetSiteBaseUrl(url: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminSetStripeKeys(publishable: string, secret: string, mode: string): Promise<void>;
    adminSetStripePrices(walker: string, traveler: string, lord: string, backup: string): Promise<void>;
    adminTestAndVerifyStripeConfig(): Promise<{
        testPassed: boolean;
        modeCorrect: boolean;
        pubKeyPresent: boolean;
        secretKeyPresent: boolean;
        message: string;
        configValid: boolean;
    }>;
    adminTestGeminiConnection(): Promise<{
        message: string;
        success: boolean;
    }>;
    adminTestPaypalConnection(clientId: string, clientSecret: string, mode: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminTestStripeConnection(): Promise<{
        message: string;
        success: boolean;
    }>;
    adminUpsertTier(config: TierConfig): Promise<void>;
    archiveListing(listingId: ListingId): Promise<Listing>;
    archiveMasterListing(listingId: string, reason: string | null): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: AppError;
    }>;
    assertConfig(): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignUserRole(userId: string, role: string): Promise<void>;
    checkAndCreateLowFuelNotification(fuelPercent: number, subscriptionExpirationTimestamp: Timestamp): Promise<InAppNotification | null>;
    checkExtensionUpdateStatus(clientVersion: string): Promise<ExtensionUpdateCheck>;
    claimLoyaltyReward(tier: TierName): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    clearPendingSession(): Promise<void>;
    closeSupportTicket(id: bigint): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    confirmCryptoPayment(_paymentId: bigint, _txHash: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    confirmGasPurchase(purchaseRecordId: bigint): Promise<{
        __kind__: "ok";
        ok: GasWallet;
    } | {
        __kind__: "err";
        err: string;
    }>;
    confirmPayPalPayment(_paymentId: bigint, _paypalOrderId: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    confirmSmartBackupPayment(paymentRecordId: bigint, stripePaymentIntentId: string, listingCount: bigint, imageCount: bigint): Promise<{
        __kind__: "ok";
        ok: BackupHistoryRecord;
    } | {
        __kind__: "err";
        err: string;
    }>;
    confirmStripePayment(paymentRecordId: bigint, stripePaymentIntentId: string): Promise<void>;
    createAdaptiveVersionSnapshot(): Promise<VersionBackup | null>;
    createBackupRecord(fileSize: bigint): Promise<BackupRecord>;
    createBroadcastNotification(title: string, message: string, priority: string, targetType: string, targetUserId: string | null): Promise<{
        __kind__: "ok";
        ok: bigint;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createListing(args: CreateListingArgs): Promise<Listing>;
    createMasterListing(args: CreateMasterListingArgs): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: AppError;
    }>;
    createStripeCheckoutSession(priceId: string, userId: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    /**
     * / Returns a lightweight system health snapshot: cycles, heap, log count,
     * / and the 20 most recent structured log entries from the monitoring ring buffer.
     */
    createStripePortalSession(): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createUniversalListing(title: string, description: string, price: string, category: string | null, condition: string, brand: string | null, quantity: bigint, targetPlatforms: Array<string>, pricingRules: {
        platformPrices: Array<[string, string]>;
        priceMarkupPercent?: number;
        basePrice: string;
        autoRepricing: boolean;
    }, publishSchedule: {
        scheduledTime?: bigint;
        scheduleType: Variant_scheduled_batch_immediate;
        batchSize?: bigint;
    } | null, platformSpecificFields: {
        facebook?: {
            localPickup: boolean;
            shipping: boolean;
        };
        mecari?: {
            deliveryDays: bigint;
            shippingType: string;
        };
    }): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createVersion(args: CreateVersionArgs): Promise<AppVersion>;
    createVersionBackup(isManual: boolean, notes: string | null): Promise<{
        __kind__: "ok";
        ok: VersionBackup;
    } | {
        __kind__: "err";
        err: string;
    }>;
    debugCheckStripeKeyLength(): Promise<bigint>;
    debugConfigHealthReport(): Promise<{
        status: string;
        allCriticalKeysPresent: boolean;
        siteBaseUrlSet: string;
        stripePublishableKeyLength: bigint;
        geminiKeyLength: bigint;
        stripSecretKeyLength: bigint;
        stripeModeSet: string;
    }>;
    deleteBackup(backupId: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteBackupRecord(backupId: bigint): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteConfig(key: string): Promise<void>;
    deleteListing(id: ListingId): Promise<void>;
    detectMarketplaceSource(url: string): Promise<MarketplaceSource>;
    dismissPaymentBanner(): Promise<void>;
    downloadDataSnapshot(backupId: string): Promise<{
        metadata: {
            created: Timestamp;
            size: bigint;
            backupType: string;
        };
        data: string;
    } | null>;
    downloadVersionBackupAsJson(backupId: string): Promise<{
        data: string;
        size: bigint;
        filename: string;
        backupType: string;
        timestamp: Timestamp;
    } | null>;
    exportAllUsersData(): Promise<{
        imageUrls: Array<string>;
        jsonData: string;
    }>;
    exportSystemReport(): Promise<{
        issuesJson: string;
        componentsJson: string;
        recommendationsJson: string;
        timestamp: Timestamp;
        overallStatus: string;
    }>;
    exportUserData(userId: string): Promise<{
        imageUrls: Array<string>;
        jsonData: string;
    } | null>;
    exportVersionBackupAsJson(backupId: string): Promise<string | null>;
    failGasPurchase(purchaseRecordId: bigint): Promise<void>;
    failStripePayment(paymentRecordId: bigint): Promise<void>;
    generateBackupData(): Promise<Array<ListingSnapshot>>;
    generateFullBackupEntries(imageUrlPairs: Array<[bigint, Array<string>]>): Promise<Array<BackupListingEntry>>;
    generateWebhookToken(): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getAdaptiveBackupSchedule(): Promise<{
        intervalHours: bigint;
        nextBackupAt: bigint;
        userCount: bigint;
    }>;
    getAdminSettings(): Promise<SiteSettings>;
    getAllAutofillConfigs(): Promise<Array<PlatformAutofillConfig>>;
    getAllConfig(): Promise<Array<ConfigEntry>>;
    getAllPlatformCapabilities(): Promise<Array<PlatformCapabilities>>;
    getAuditLog(): Promise<Array<AuditLogEntry>>;
    getAutofillConfig(platform: string): Promise<PlatformAutofillConfig | null>;
    getAutofillHealthStatus(): Promise<Array<AutofillHealthStatus>>;
    getBackupDownloadInfo(token: string): Promise<BackupHistoryRecord | null>;
    getBackupHistory(): Promise<Array<BackupHistoryRecord>>;
    getBulkGasDiscounts(): Promise<Array<BulkGasDiscount>>;
    getCallerUserRole(): Promise<UserRole>;
    getCampaignResults(campaignId: string): Promise<CrossListingCampaign | null>;
    getCanisterCyclesBalance(): Promise<bigint>;
    getCleanupSummaries(): Promise<Array<UserCleanupSummary>>;
    getConfig(key: string): Promise<string | null>;
    getExtensionConfig(): Promise<ExtensionConfigResult>;
    getFbListings(): Promise<{
        __kind__: "ok";
        ok: Array<FbListing>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getGasPackages(): Promise<Array<GasPackage>>;
    getHealthStatus(): Promise<HealthStatus>;
    getIntegrationStatus(): Promise<Array<IntegrationStatus>>;
    getLatestExtensionVersion(): Promise<ExtensionUpdateCheck | null>;
    getListing(id: ListingId): Promise<Listing | null>;
    getListingsByPlatform(platform: Platform__2): Promise<{
        __kind__: "ok";
        ok: Array<MasterListing>;
    } | {
        __kind__: "err";
        err: AppError;
    }>;
    getLogCount(): Promise<bigint>;
    getLoyaltyStatus(): Promise<LoyaltyStatus>;
    getMaintenanceMode(): Promise<{
        eta: string;
        isActive: boolean;
        message: string;
    }>;
    getMasterListing(listingId: string): Promise<{
        __kind__: "ok";
        ok: MasterListing;
    } | {
        __kind__: "err";
        err: AppError;
    }>;
    getMasterListingStats(): Promise<{
        totalListings: bigint;
        totalDrafts: bigint;
        totalUsers: bigint;
    }>;
    getMonitoringStatus(): Promise<{
        heapSize: bigint;
        logCount: bigint;
        cyclesAvailable: bigint;
    }>;
    getMyBackups(): Promise<Array<BackupRecord>>;
    getMyFbCredentials(): Promise<FbCredentials | null>;
    getMyGasPurchases(): Promise<Array<GasPurchase>>;
    getMyGasWallet(): Promise<{
        __kind__: "ok";
        ok: GasWallet;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getMyPayments(): Promise<Array<PaymentRecord>>;
    getMyProfile(): Promise<GetProfileResult>;
    getMySubscription(): Promise<UserTierSubscription | null>;
    getMyWebhookToken(): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getOcrFailureLog(limit: bigint): Promise<Array<OcrFailureEntry>>;
    getPaymentBanner(): Promise<PaymentBannerState | null>;
    getPendingSession(): Promise<{
        tierId: bigint;
        tierDays: bigint;
        sessionId: string;
    } | null>;
    getPlatformCapabilities(platformName: string): Promise<PlatformCapabilities | null>;
    getProfileByUsername(username: string): Promise<UserProfile | null>;
    getPublicConfig(): Promise<{
        maintenanceMessage: string;
        mode: string;
        gasWalkerPriceId: string;
        maintenanceMode: boolean;
        gasLordPriceId: string;
        gasTravelerPriceId: string;
        publishableKey: string;
        siteBaseUrl: string;
    }>;
    getRecentLogs(limit: bigint): Promise<Array<MonitoringLogEntry>>;
    getRefuelHistory(): Promise<Array<RefuelEntry>>;
    getRevenueStats(): Promise<{
        month: bigint;
        today: bigint;
        week: bigint;
        activeSubscribers: bigint;
    }>;
    getSiteAnalytics(): Promise<SiteAnalytics>;
    getSiteBaseUrl(): Promise<string>;
    getStripeHealthStatus(): Promise<{
        status: string;
        lastWebhookReceived?: bigint;
        keysConfigured: boolean;
        webhookConfigured: boolean;
    }>;
    getStripePublicKey(): Promise<{
        publishableKey: string;
    }>;
    getSupportTicket(id: bigint): Promise<SupportTicket | null>;
    getSystemDiagnostics(): Promise<SystemDiagnostics>;
    getSystemHealthStatus(): Promise<{
        stripe: {
            status: string;
            hasPublishableKey: boolean;
            lastWebhookAt?: bigint;
            hasPriceIds: boolean;
            hasSecretKey: boolean;
        };
        signups: {
            total: bigint;
            lastSignupAt?: bigint;
        };
        backup: {
            status: string;
            freshnessHours?: bigint;
            backupCount: bigint;
            lastBackupAt?: bigint;
        };
        database: {
            status: string;
            canReadConfig: boolean;
            canReadUsers: boolean;
        };
        gemini: {
            status: string;
            hasApiKey: boolean;
        };
        maintenance: {
            isActive: boolean;
        };
        paypal: {
            status: string;
            isConfigured: boolean;
        };
    }>;
    /**
     * / Returns a lightweight system health snapshot: cycles, heap, log count,
     * / and the 20 most recent structured log entries from the monitoring ring buffer.
     */
    getSystemStatus(): Promise<{
        heapSize: bigint;
        logCount: bigint;
        recentLogs: Array<MonitoringLogEntry>;
        cycles: bigint;
    }>;
    getTier(tierId: bigint): Promise<TierConfig | null>;
    getTiers(): Promise<Array<TierConfig>>;
    getUniversalListing(listingId: string): Promise<UniversalListing | null>;
    getUnreadAdminNotificationCount(): Promise<bigint>;
    getUserMasterListings(): Promise<{
        __kind__: "ok";
        ok: Array<MasterListing>;
    } | {
        __kind__: "err";
        err: AppError;
    }>;
    getUserNotifications(): Promise<Array<InAppNotification>>;
    getUserUniversalListings(): Promise<Array<UniversalListing>>;
    getVerificationStatus(): Promise<VerificationRecord | null>;
    getVersionBackupIndex(): Promise<{
        latestSnapshot?: string;
        manualSnapshots: bigint;
        totalSnapshots: bigint;
        autoSnapshots: bigint;
        oldestSnapshot?: string;
        totalDataSize: bigint;
    }>;
    getVersionSnapshotList(): Promise<Array<VersionBackupSummary>>;
    initConfigFromPaymentConfig(): Promise<void>;
    initiateCryptoPayment(tierId: bigint, discountCode: string | null): Promise<{
        __kind__: "ok";
        ok: PaymentRecord;
    } | {
        __kind__: "err";
        err: string;
    }>;
    initiateEmailVerification(email: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    initiateGasPurchase(packageId: bigint, discountCode: string | null): Promise<{
        __kind__: "ok";
        ok: {
            gasAmount: bigint;
            purchaseRecordId: bigint;
            finalAmountUSD: number;
            stripeClientSecret: string;
        };
    } | {
        __kind__: "err";
        err: string;
    }>;
    initiatePayPalPayment(tierId: bigint, discountCode: string | null): Promise<{
        __kind__: "ok";
        ok: PaymentRecord;
    } | {
        __kind__: "err";
        err: string;
    }>;
    initiateSmartBackup(): Promise<{
        paymentRecordId: bigint;
        backupPriceId?: string;
        amountUSD: number;
        stripeClientSecret?: string;
    }>;
    initiateTierUpgrade(tierId: bigint, discountCode: string | null): Promise<{
        tierDurationDays: bigint;
        discountApplied: boolean;
        paymentRecordId: bigint;
        finalAmountUSD: number;
        stripeClientSecret?: string;
    }>;
    isCallerAdmin(): Promise<boolean>;
    isConfigValid(): Promise<boolean>;
    listAdminNotifications(): Promise<Array<AdminNotification>>;
    listAllUsers(): Promise<Array<UserSummary>>;
    listBackupsForDownload(): Promise<Array<{
        id: string;
        created: Timestamp;
        size: bigint;
        filename: string;
        backupType: string;
        listingCount: bigint;
        userCount: bigint;
    }>>;
    listFavoritedListings(): Promise<Array<Listing>>;
    listImages(listingId: ListingId): Promise<Array<Image>>;
    listListings(): Promise<Array<Listing>>;
    listSupportTickets(): Promise<Array<SupportTicket>>;
    listVersionBackups(): Promise<Array<VersionBackupSummary>>;
    listVersionHistory(): Promise<Array<AppVersion>>;
    logAutofillSession(platform: string, fieldsAttempted: bigint, fieldsSuccessful: bigint, errors: Array<string>): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    logEvent(level: string, component: string, message: string): Promise<void>;
    logManualPosting(listingId: string, platform: Platform__2, remoteUrl: string | null): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: AppError;
    }>;
    markAdminNotificationRead(id: bigint): Promise<void>;
    markAllAdminNotificationsRead(): Promise<void>;
    markAllNotificationsRead(): Promise<void>;
    markAsSOLD(listingId: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    markBackupAsStable(backupId: string): Promise<boolean>;
    markNotificationRead(notificationId: bigint): Promise<MarkReadResult>;
    markUniversalListingReady(listingId: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    ocrScanImage(imageBase64: string): Promise<{
        __kind__: "ok";
        ok: OcrResult;
    } | {
        __kind__: "err";
        err: string;
    }>;
    parsePastedText(text: string): Promise<ParsedListingResult>;
    permanentDeleteListing(listingId: ListingId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    previewVersionRestoreSnapshot(backupId: string): Promise<{
        snapshotCreatedAt: Timestamp;
        createdBy: string;
        isManualBackup: boolean;
        notes?: string;
        listingCount: bigint;
        userCount: bigint;
    } | null>;
    receiveExtensionData(data: ExtensionListingData, webhookToken: string): Promise<{
        __kind__: "ok";
        ok: DraftListingId;
    } | {
        __kind__: "err";
        err: string;
    } | {
        __kind__: "validationError";
        validationError: {
            errors: Array<string>;
            platformReady: boolean;
        };
    } | {
        __kind__: "validationWarning";
        validationWarning: {
            warnings: Array<string>;
            draftId: DraftListingId;
        };
    }>;
    registerUserProfile(username: string, email: string): Promise<SetUsernameResult>;
    removeImage(imageId: ImageId): Promise<void>;
    replySupportTicket(id: bigint, reply: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    resendVerificationEmail(email: string): Promise<ResendResult>;
    restoreFromBackup(snapshots: Array<ListingSnapshot>): Promise<{
        __kind__: "ok";
        ok: bigint;
    } | {
        __kind__: "err";
        err: string;
    }>;
    restoreFromJsonBlob(jsonBlob: string): Promise<RestoreResult>;
    restoreFromVersionBackup(backupId: string): Promise<RestoreResult>;
    restoreFromVersionBackupWithSafety(backupId: string): Promise<RestoreResult>;
    restoreFromZipBackup(entries: Array<BackupListingEntry>): Promise<ZipRestoreResult>;
    restoreListing(listingId: ListingId): Promise<{
        __kind__: "ok";
        ok: Listing;
    } | {
        __kind__: "err";
        err: string;
    }>;
    restoreUserAccountFromBackup(userId: string, backupId: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    rollbackToVersion(versionId: bigint): Promise<SiteSettings>;
    runLifecycleCleanup(): Promise<{
        deleted: bigint;
        archived: bigint;
    }>;
    saveFbCredentials(appId: string, accessToken: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    savePlatformDraft(listingId: string, args: SavePlatformDraftArgs): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: AppError;
    }>;
    scrapeListing(url: string): Promise<ScrapeResult>;
    searchVersionSnapshots(backupTypeFilter: string | null, minUserCount: bigint | null, maxUserCount: bigint | null): Promise<Array<VersionBackupSummary>>;
    setAutoRenewal(enabled: boolean, tierId: bigint): Promise<{
        __kind__: "ok";
        ok: GasWallet;
    } | {
        __kind__: "err";
        err: string;
    }>;
    setAutofillPlatformEnabled(platform: string, enabled: boolean): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    setConfig(key: string, value: string, encrypted: boolean, category: string, updatedBy: string): Promise<void>;
    setMaintenanceMode(isActive: boolean, message: string, eta: string): Promise<void>;
    setMyUsername(username: string): Promise<SetUsernameResult>;
    submitSupportTicket(subject: string, message: string, attachmentUrls: Array<string>): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    testAutofill(platform: string): Promise<AutofillTestResult>;
    toggleListingFavorited(listingId: ListingId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    toggleListingPinned(listingId: ListingId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    transformGeminiResponse(raw: {
        context: Uint8Array;
        response: {
            status: bigint;
            body: Uint8Array;
            headers: Array<{
                value: string;
                name: string;
            }>;
        };
    }): Promise<{
        status: bigint;
        body: Uint8Array;
        headers: Array<{
            value: string;
            name: string;
        }>;
    }>;
    transformGeminiTestResponse(raw: {
        context: Uint8Array;
        response: {
            status: bigint;
            body: Uint8Array;
            headers: Array<{
                value: string;
                name: string;
            }>;
        };
    }): Promise<{
        status: bigint;
        body: Uint8Array;
        headers: Array<{
            value: string;
            name: string;
        }>;
    }>;
    transformPaypalTokenResponse(raw: {
        context: Uint8Array;
        response: {
            status: bigint;
            body: Uint8Array;
            headers: Array<{
                value: string;
                name: string;
            }>;
        };
    }): Promise<{
        status: bigint;
        body: Uint8Array;
        headers: Array<{
            value: string;
            name: string;
        }>;
    }>;
    transformStripeAccountResponse(raw: {
        context: Uint8Array;
        response: {
            status: bigint;
            body: Uint8Array;
            headers: Array<{
                value: string;
                name: string;
            }>;
        };
    }): Promise<{
        status: bigint;
        body: Uint8Array;
        headers: Array<{
            value: string;
            name: string;
        }>;
    }>;
    transformStripeBackupPaymentIntentResponse(raw: {
        context: Uint8Array;
        response: {
            status: bigint;
            body: Uint8Array;
            headers: Array<{
                value: string;
                name: string;
            }>;
        };
    }): Promise<{
        status: bigint;
        body: Uint8Array;
        headers: Array<{
            value: string;
            name: string;
        }>;
    }>;
    transformStripeCheckoutResponse(raw: {
        context: Uint8Array;
        response: {
            status: bigint;
            body: Uint8Array;
            headers: Array<{
                value: string;
                name: string;
            }>;
        };
    }): Promise<{
        status: bigint;
        body: Uint8Array;
        headers: Array<{
            value: string;
            name: string;
        }>;
    }>;
    transformStripeCustomerResponse(raw: {
        context: Uint8Array;
        response: {
            status: bigint;
            body: Uint8Array;
            headers: Array<{
                value: string;
                name: string;
            }>;
        };
    }): Promise<{
        status: bigint;
        body: Uint8Array;
        headers: Array<{
            value: string;
            name: string;
        }>;
    }>;
    transformStripeGasPaymentIntentResponse(raw: {
        context: Uint8Array;
        response: {
            status: bigint;
            body: Uint8Array;
            headers: Array<{
                value: string;
                name: string;
            }>;
        };
    }): Promise<{
        status: bigint;
        body: Uint8Array;
        headers: Array<{
            value: string;
            name: string;
        }>;
    }>;
    transformStripePaymentIntentResponse(raw: {
        context: Uint8Array;
        response: {
            status: bigint;
            body: Uint8Array;
            headers: Array<{
                value: string;
                name: string;
            }>;
        };
    }): Promise<{
        status: bigint;
        body: Uint8Array;
        headers: Array<{
            value: string;
            name: string;
        }>;
    }>;
    transformStripePortalResponse(raw: {
        context: Uint8Array;
        response: {
            status: bigint;
            body: Uint8Array;
            headers: Array<{
                value: string;
                name: string;
            }>;
        };
    }): Promise<{
        status: bigint;
        body: Uint8Array;
        headers: Array<{
            value: string;
            name: string;
        }>;
    }>;
    transformStripeVerifyResponse(raw: {
        context: Uint8Array;
        response: {
            status: bigint;
            body: Uint8Array;
            headers: Array<{
                value: string;
                name: string;
            }>;
        };
    }): Promise<{
        status: bigint;
        body: Uint8Array;
        headers: Array<{
            value: string;
            name: string;
        }>;
    }>;
    triggerAdaptiveAutoBackup(): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateAdminSettings(args: UpdateSettingsArgs): Promise<SiteSettings>;
    updateFacebookAutofillSettings(prefillTitle: boolean, prefillDescription: boolean, prefillPrice: boolean, prefillCategory: boolean, prefillCondition: boolean, autoClickLocalPickup: boolean, autoClickShipping: boolean): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateListing(args: UpdateListingArgs): Promise<Listing>;
    updateMasterListing(listingId: string, args: UpdateMasterListingArgs): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: AppError;
    }>;
    updateMecariAutofillSettings(prefillTitle: boolean, prefillDescription: boolean, prefillPrice: boolean, prefillBrand: boolean, prefillCategory: boolean, prefillCondition: boolean, autoSelectDeliveryDays: boolean, deliveryDaysValue: bigint | null, autoSelectShipping: boolean, shippingType: string | null): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateMyProfile(args: UpdateProfileArgs): Promise<UpdateProfileResult>;
    validateAutofillData(data: ExtensionListingData): Promise<AutofillValidation>;
    validateBackupIntegrity(backupId: string): Promise<{
        valid: boolean;
        error?: string;
        listingCount: bigint;
        userCount: bigint;
    }>;
    validateCriticalConfig(): Promise<{
        status: string;
        keysConfigured: boolean;
        missingKeys: Array<string>;
    }>;
    validateDiscountCode(code: string, tierId: bigint): Promise<DiscountCode | null>;
    verifyAndGrantPayment(sessionId: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    verifyEmail(token: string): Promise<VerifyEmailResult>;
}

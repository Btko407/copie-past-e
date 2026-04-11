export type ListingId = string;
export type UserId = string;
export type ImageId = string;
export type Timestamp = bigint;

export type ListingStatus = "active" | "archived";

export interface Listing {
  id: ListingId;
  userId: UserId;
  title: string;
  description: string;
  price?: string;
  sourceUrl?: string;
  createdAt: Timestamp;
  status: ListingStatus;
  expirationDate: Timestamp;
  tierLevel: number;
  category?: string;
  archivedAt?: Timestamp;
  archivedManually?: boolean;
  restoredAt?: Timestamp;
  pinned?: boolean;
  favorited?: boolean;
}

export interface CreateListingArgs {
  title: string;
  description: string;
  price?: string;
  sourceUrl?: string;
  category?: string;
}

export interface UpdateListingArgs {
  id: ListingId;
  title?: string;
  description?: string;
  price?: string;
  sourceUrl?: string;
  category?: string;
}

export interface Image {
  id: ImageId;
  listingId: ListingId;
  altText: string;
  order: number;
  directURL: string;
}

export interface AddImageArgs {
  listingId: ListingId;
  altText: string;
  order: number;
}

export type AuthStatus = "initializing" | "authenticated" | "unauthenticated";

// ─── Smart Paste Types ────────────────────────────────────────────────────────

export interface ParsedListingResult {
  title?: string;
  price?: string;
  description?: string;
  category?: string;
}

// ─── Browser Extension Types ──────────────────────────────────────────────────

export interface ExtensionListingData {
  title: string;
  description?: string;
  price?: string;
  imageUrls: string[];
  category?: string;
  sourceUrl?: string;
}

// ─── Smart Post Types ─────────────────────────────────────────────────────────

export interface SmartPostPayload {
  action: "SMART_POST";
  platform: "facebook";
  listing: {
    title: string;
    price: string; // numeric only, no $ symbol
    description: string;
    category: string;
    condition?: string;
    brand?: string;
    images: string[];
  };
}

// ─── Facebook Graph API Types ─────────────────────────────────────────────────

export interface FbListing {
  id: string;
  title: string;
  description?: string;
  price?: string;
  category?: string;
  imageUrls: string[];
}

export interface FbCredentials {
  appId: string;
  accessToken: string;
}

// ─── Loyalty Types ─────────────────────────────────────────────────────────────

export interface LoyaltyStatus {
  refuelCount: number;
  rewardClaimedForTiers: string[];
  currentTier: string;
}

export interface RefuelHistoryEntry {
  date: number;
  tier: string;
  rewardClaimed: boolean;
}

// ─── Admin Types ──────────────────────────────────────────────────────────────

export interface SiteSettings {
  appName: string;
  primaryColor: string;
  accentColor: string;
  uploadEnabled: boolean;
  copyButtonsEnabled: boolean;
  contentModerationEnabled: boolean;
  maxRequestsPerMinute: bigint;
  maxUploadsPerHour: bigint;
  maxSessionDurationMinutes: bigint;
  maxConcurrentSessions: bigint;
  allowedOrigins: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UpdateSettingsArgs {
  appName: string;
  primaryColor: string;
  accentColor: string;
  uploadEnabled: boolean;
  copyButtonsEnabled: boolean;
  contentModerationEnabled: boolean;
  maxRequestsPerMinute: bigint;
  maxUploadsPerHour: bigint;
  maxSessionDurationMinutes: bigint;
  maxConcurrentSessions: bigint;
  allowedOrigins: string;
}

export interface AppVersion {
  id: bigint;
  versionLabel: string;
  createdAt: Timestamp;
  createdBy: { toString(): string };
  settingsSnapshot: SiteSettings;
  description: string;
  isRollback: boolean;
}

export interface CreateVersionArgs {
  versionLabel: string;
  description: string;
}

export interface UserSummary {
  userId: string;
  role: string;
  registrationDate: Timestamp;
  lastLoginDate?: Timestamp;
  listingCount: bigint;
  imageCount: bigint;
}

export interface SiteAnalytics {
  totalUsers: bigint;
  totalListings: bigint;
  totalImages: bigint;
  avgListingsPerUser: number;
  avgImagesPerListing: number;
}

// ─── Tier & Subscription Types ────────────────────────────────────────────────

export interface TierConfig {
  tierId: number;
  name: string;
  durationDays: number;
  priceUSD: number;
  stripeProductId?: string;
}

export interface UserTierSubscription {
  userId: string;
  tier: number;
  expirationDate: number;
  autoRenewal: boolean;
  stripeSubscriptionId?: string;
  updatedAt: number;
}

// ─── Payment Types ─────────────────────────────────────────────────────────────

export type DiscountType = "percentage" | "fixedUSD";
export type PaymentStatus = "pending" | "succeeded" | "failed";

export interface DiscountCode {
  id: number;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  expirationDate: number;
  maxUses: number;
  usageCount: number;
  tierRestriction?: number;
  active: boolean;
}

export interface PaymentRecord {
  id: number;
  userId: string;
  tierId: number;
  amountUSD: number;
  status: PaymentStatus;
  stripePaymentIntentId?: string;
  createdAt: number;
}

export interface InitiateUpgradeResult {
  paymentRecordId: number;
  finalAmountUSD: number;
  tierDurationDays: number;
  discountApplied: boolean;
  stripeClientSecret?: string;
}

// ─── Version Backup Types ──────────────────────────────────────────────────────

export interface VersionBackupSummary {
  id: string;
  versionLabel: string;
  createdAt: Timestamp;
  createdBy: string;
  backupType: string; // "auto" | "manual"
  userCount: bigint;
  listingCount: bigint;
  configCount: bigint;
  sizeKb: bigint;
  isStable: boolean;
  notes: string | null;
}

export interface RestoreResult {
  success: boolean;
  usersRestored: bigint;
  listingsRestored: bigint;
  configRestored: bigint;
  preRestoreBackupId: string;
  preSaveBackupId: string;
  errorMessage: string;
  message: string;
}

export interface HealthStatus {
  status: string;
  keysConfigured: boolean;
  criticalKeysPresent: boolean;
  lastBackupAt: bigint;
  backupCount: bigint;
}

export interface ConfigEntry {
  key: string;
  value: string;
  encrypted: boolean;
  category: string;
  updatedAt: bigint;
  updatedBy: string;
}

// ─── Admin Cleanup Types ───────────────────────────────────────────────────────

export interface UserCleanupSummary {
  userId: string;
  email: string;
  activeListingCount: number;
  archivedListingCount: number;
  oldestActiveExpirationDate?: Timestamp;
  hasExpiredListings: boolean;
}

// ─── Notification Types ────────────────────────────────────────────────────────

export type NotificationType =
  | "subscriptionExpiry"
  | "subscriptionRenewed"
  | "listingArchived"
  | "listingDeletionWarning"
  | "adminAnnouncement"
  | "lowFuelWarning"
  | "paymentFailed"
  | "subscriptionCancelled"
  | "refuelSuccess";

export interface InAppNotification {
  id: bigint;
  notificationType: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: bigint;
}

// ─── Profile Update Types ──────────────────────────────────────────────────────

export interface UpdateProfileArgs {
  displayName?: string;
  email?: string;
  phoneNumber?: string;
}

// ─── Extended UserProfile (frontend-local augment) ────────────────────────────
// The backend UserProfile has: username, email, role, emailVerified, createdAt, updatedAt
// Frontend adds optional display fields stored locally or via backend extensions.
export interface ExtendedUserProfile {
  username: string;
  email: string;
  role: string;
  emailVerified: boolean;
  createdAt: bigint;
  updatedAt: bigint;
  displayName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  fbAppId?: string;
  fbAccessToken?: string;
}

// ─── Support Ticket Types ─────────────────────────────────────────────────────

export interface SupportTicket {
  id: number;
  userId: string;
  username: string;
  subject: string;
  message: string;
  status: "open" | "replied" | "closed";
  adminReply?: string;
  createdAt: bigint;
  repliedAt?: bigint;
}

// ─── Admin Notification Types ─────────────────────────────────────────────────

export interface AdminNotification {
  id: number;
  type: string;
  message: string;
  relatedUser: string;
  relatedId?: string;
  priority: "normal" | "important" | "urgent";
  read: boolean;
  createdAt: bigint;
}

// ─── Maintenance Mode Types ───────────────────────────────────────────────────

export interface MaintenanceStatus {
  isActive: boolean;
  message: string;
  eta: string;
}

// ─── System Health Status Types ───────────────────────────────────────────────

export interface SystemHealthStripe {
  publishableKeySet: boolean;
  secretKeySet: boolean;
  priceIdsConfigured: boolean;
  // Payment verification is polling-based on ICP — no webhooks
  connectionStatus: "ok" | "error" | "unchecked";
  errorMessage?: string;
}

export interface SystemHealthGemini {
  apiKeySet: boolean;
  connectionStatus: "ok" | "error" | "unchecked";
  errorMessage?: string;
}

export interface SystemHealthDatabase {
  canReadUsers: boolean;
  canReadConfig: boolean;
  allTablesPresent: boolean;
  errorMessage?: string;
}

export interface SystemHealthBackup {
  lastBackupAt?: bigint;
  backupCount: number;
  status: "fresh" | "stale" | "old" | "never";
}

export interface SystemHealthMaintenance {
  isActive: boolean;
}

export interface SystemHealthSignups {
  totalUsers: number;
  lastSignupAt?: bigint;
}

export interface SystemHealthPaypal {
  clientIdSet: boolean;
  clientSecretSet: boolean;
}

export interface SystemHealthStatus {
  stripe: SystemHealthStripe;
  gemini: SystemHealthGemini;
  database: SystemHealthDatabase;
  backup: SystemHealthBackup;
  maintenance: SystemHealthMaintenance;
  signups: SystemHealthSignups;
  paypal: SystemHealthPaypal;
}

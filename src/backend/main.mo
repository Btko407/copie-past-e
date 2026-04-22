import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Timer "mo:core/Timer";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import Common "types/common";
import ListingTypes "types/listings";
import ImageTypes "types/images";
import AdminTypes "types/admin";
import TierTypes "types/tiers";
import PaymentTypes "types/payments";
import GasTypes "types/gas-wallet";
import ProfileTypes "types/userprofile";
import VerifyTypes "types/emailverification";
import NotifTypes "types/notifications";
import AppConfigTypes "types/app-config";
import ListingsLib "lib/listings";
import TiersLib "lib/tiers";
import GasWalletLib "lib/gas-wallet";
import PaymentsLib "lib/payments";
import NotifLib "lib/notifications";
import BackupLib "lib/backup";
import ListingsApi "mixins/listings-api";
import ImagesApi "mixins/images-api";
import AdminApi "mixins/admin-api";
import TiersApi "mixins/tiers-api";
import PaymentsApi "mixins/payments-api";
import GasWalletApi "mixins/gas-wallet-api";
import UserProfileApi "mixins/userprofile-api";
import EmailVerificationApi "mixins/emailverification-api";
import ScraperApi "mixins/scraper-api";
import NotificationsApi "mixins/notifications-api";
import SmartPasteApi "mixins/smart-paste-api";
import ExtensionApi "mixins/extension-api";
import FacebookGraphApi "mixins/facebook-graph-api";
import LoyaltyApi "mixins/loyalty-api";
import LoyaltyTypes "types/loyalty";
import BackupTypes "types/backup";
import BackupApi "mixins/backup-api";
import StripeCheckoutApi "mixins/stripe-checkout-api";
import OcrTypes "types/ocr";
import OcrApi "mixins/ocr-api";
import ConfigApi "mixins/config-api";
import SupportTicketTypes "types/support-tickets";
import AdminNotifTypes "types/admin-notifications";
import SupportTicketsApi "mixins/support-tickets-api";
import AdminNotificationsApi "mixins/admin-notifications-api";
import MaintenanceApi "mixins/maintenance-api";
import SystemHealthApi "mixins/system-health-api";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinObjectStorage();

  // STRIPE_SECRET_KEY_GAS was previously a module-level let in gas-wallet-api.mo mixin,
  // which makes it implicitly stable in enhanced orthogonal persistence. After the fix that
  // replaces it with a call-time appConfig read, the binding no longer exists in the mixin.
  // Declared here as an explicit migration stub so the upgrade compatibility check passes.
  // This value is never read or written by any live code path.
  let STRIPE_SECRET_KEY_GAS : Text = "sk_live_CONFIGURE_IN_ADMIN";

  // ── Migration stubs ──────────────────────────────────────────────────────
  // These stable vars existed in a previous deployed version and must be
  // declared here so Motoko's compatibility check does not reject the upgrade.
  // They are never read or written by any live code path.
  stable var STRIPE_SECRET_KEY : Text = "";

  // IC_MANAGEMENT, IC_MANAGEMENT_OCR, IC_MANAGEMENT_STRIPE were previously stored
  // as stable actor references with the old http_request signature (no transform field).
  // Redeclared here with the same old type so the upgrade compatibility check passes.
  // Live code now uses local factory functions instead of these stable refs.
  stable var IC_MANAGEMENT : actor {
    http_request : shared {
      url : Text;
      max_response_bytes : ?Nat64;
      method : { #get; #head; #post };
      headers : [{ name : Text; value : Text }];
      body : ?Blob;
      is_replicated : ?Bool;
    } -> async {
      status : Nat;
      headers : [{ name : Text; value : Text }];
      body : Blob;
    };
  } = actor "aaaaa-aa";

  stable var IC_MANAGEMENT_OCR : actor {
    http_request : shared {
      url : Text;
      max_response_bytes : ?Nat64;
      method : { #get; #head; #post };
      headers : [{ name : Text; value : Text }];
      body : ?Blob;
      is_replicated : ?Bool;
    } -> async {
      status : Nat;
      headers : [{ name : Text; value : Text }];
      body : Blob;
    };
  } = actor "aaaaa-aa";

  stable var IC_MANAGEMENT_STRIPE : actor {
    http_request : shared {
      url : Text;
      max_response_bytes : ?Nat64;
      method : { #get; #head; #post };
      headers : [{ name : Text; value : Text }];
      body : ?Blob;
      is_replicated : ?Bool;
    } -> async {
      status : Nat;
      headers : [{ name : Text; value : Text }];
      body : Blob;
    };
  } = actor "aaaaa-aa";

  // IC_MANAGEMENT_BACKUP and IC_MANAGEMENT_GAS were previously stored as stable actor
  // references in backup-api.mo and gas-wallet-api.mo with the old http_request signature
  // (no transform field). Redeclared here with the same old type so the upgrade
  // compatibility check passes. Live code now uses local factory functions instead.
  stable var IC_MANAGEMENT_BACKUP : actor {
    http_request : shared {
      url : Text;
      max_response_bytes : ?Nat64;
      method : { #get; #head; #post };
      headers : [{ name : Text; value : Text }];
      body : ?Blob;
      is_replicated : ?Bool;
    } -> async {
      status : Nat;
      headers : [{ name : Text; value : Text }];
      body : Blob;
    };
  } = actor "aaaaa-aa";

  stable var IC_MANAGEMENT_GAS : actor {
    http_request : shared {
      url : Text;
      max_response_bytes : ?Nat64;
      method : { #get; #head; #post };
      headers : [{ name : Text; value : Text }];
      body : ?Blob;
      is_replicated : ?Bool;
    } -> async {
      status : Nat;
      headers : [{ name : Text; value : Text }];
      body : Blob;
    };
  } = actor "aaaaa-aa";

  let listings = Map.empty<Common.ListingId, ListingTypes.Listing>();
  let listingCounter = { var value : Nat = 0 };

  let images = Map.empty<Common.ImageId, ImageTypes.Image>();
  let imageCounter = { var value : Nat = 0 };

  let siteSettings : { var current : ?AdminTypes.SiteSettings } = { var current = null };
  let appVersions = List.empty<AdminTypes.AppVersion>();
  let versionCounter = { var value : Nat = 0 };

  let userRegistrations = Map.empty<Common.UserId, Common.Timestamp>();
  let userLastLogins = Map.empty<Common.UserId, Common.Timestamp>();

  // Tiers & subscriptions — seed defaults on first deploy
  let tiers = Map.empty<Nat, TierTypes.TierConfig>();
  let subscriptions = Map.empty<Common.UserId, TierTypes.UserTierSubscription>();
  if (tiers.isEmpty()) {
    for (cfg in TiersLib.getDefaultTiers().values()) {
      tiers.add(cfg.tierId, cfg);
    };
  };

  // Payments & discounts
  let payments = Map.empty<Nat, PaymentTypes.PaymentRecord>();
  let discounts = Map.empty<Nat, PaymentTypes.DiscountCode>();
  let adminTierActions = Map.empty<Nat, PaymentTypes.AdminTierAction>();
  let paymentCounter = { var value : Nat = 0 };
  let discountCounter = { var value : Nat = 0 };
  let adminActionCounter = { var value : Nat = 0 };
  // Payment gateway configuration (Stripe + PayPal keys, stored in canister state)
  let paymentConfig : { var current : ?PaymentTypes.PaymentConfig } = { var current = null };

  // Persistent admin-configurable key/value store — survives all redeploys.
  // All Stripe keys, API keys, and site settings are written here by admin actions.
  let appConfig = Map.empty<Text, AppConfigTypes.ConfigEntry>();

  // User profiles — username registry (usernameIndex maps lowercase username → userId)
  let profiles = Map.empty<Common.UserId, ProfileTypes.UserProfile>();
  let usernameIndex = Map.empty<Text, Common.UserId>();

  // Email verification records (feature-flagged — built but not activated)
  let verificationRecords = Map.empty<Common.UserId, VerifyTypes.VerificationRecord>();
  let emailIndex = Map.empty<Text, Common.UserId>(); // email → userId

  // Gas Wallet state — wallets, purchases, and packages
  let wallets = Map.empty<Common.UserId, GasTypes.GasWallet>();
  let gasPurchases = Map.empty<Nat, GasTypes.GasPurchase>();
  let gasPackages = Map.empty<Nat, GasTypes.GasPackage>();
  let gasPurchaseCounter = { var value : Nat = 0 };
  if (gasPackages.isEmpty()) {
    for (pkg in GasWalletLib.getDefaultPackages().values()) {
      gasPackages.add(pkg.packageId, pkg);
    };
  };

  // In-app notifications — keyed by userId, value is list of notifications
  let notifications = Map.empty<Common.UserId, List.List<NotifTypes.InAppNotification>>();
  let notifCounter = { var value : Nat = 0 };
  // Tracks the subscription expiration timestamp for which a low-fuel warning was
  // already sent per user, preventing repeated alerts within the same period.
  let lowFuelNotificationSentFor = Map.empty<Common.UserId, Common.Timestamp>();

  // Audit log — append-only log of admin actions
  let auditLog = List.empty<AdminTypes.AuditLogEntry>();
  let auditCounter = { var value : Nat = 0 };

  // Smart Backup — paid ($29.99) listing backup and restore feature
  // Declared early so versionBackups is available to AdminApi and PaymentsApi mixins.
  let backups = Map.empty<Nat, BackupTypes.BackupRecord>();
  let backupCounter = { var value : Nat = 0 };
  // Backup export history (paid exports, valid for 7-day re-download)
  let backupHistory = List.empty<BackupTypes.BackupHistoryRecord>();
  // Full-data version backups (auto + manual) — keyed by timestamp-based ID
  let versionBackups = List.empty<BackupTypes.VersionBackup>();

  // Tracks the last time an adaptive auto version snapshot was created.
  // Used by createAdaptiveVersionSnapshot to enforce frequency thresholds.
  let lastAutoSnapshotTime : { var value : Int } = { var value = 0 };

  // ── Initial backup on first load ─────────────────────────────────────────
  // If no backups exist (e.g., fresh deploy), create an initial auto backup so
  // the System Debugger never reports "0 backups" on first visit.
  if (versionBackups.isEmpty()) {
    ignore BackupLib.createVersionSnapshot(
      versionBackups, profiles, listings, subscriptions, notifications,
      siteSettings, appVersions, "version-snapshot-auto", "system",
      ?"Initial snapshot on first load", Time.now(),
    );
  };

  // Hourly lifecycle cleanup timer — archives expired listings, hard-deletes stale
  // archived listings, triggers auto-renewal for eligible wallets, and sends
  // subscription expiry alerts and in-app notifications for users expiring within 7 days.
  // Admin-owned listings are always exempt.
  let ALERT_THRESHOLD_NS : Int = 7 * 86_400_000_000_000;
  let DAY_NS : Int = 86_400_000_000_000;
  let ARCHIVE_WARN_THRESHOLD_NS : Int = 27 * 86_400_000_000_000; // >27 days archived → warn (3 days left in 30-day window)

  ignore Timer.recurringTimer<system>(
    #hours 1,
    func() : async () {
      let now = Time.now();

      // Archive expired listings
      ignore ListingsLib.archiveExpiredListings(listings, accessControlState, now);

      // Notify users about listings that just got auto-archived (status == #archived, archivedAt == now within 1 hour)
      for ((_, listing) in listings.entries()) {
        switch (listing.status) {
          case (#archived) {
            switch (listing.archivedAt) {
              case (?archivedAt) {
                // Just archived in this timer cycle (within last hour) and not manually
                if (not listing.archivedManually and now - archivedAt < DAY_NS) {
                  if (not NotifLib.hasRecentNotification(notifications, listing.userId, #listingArchived, DAY_NS, now)) {
                    ignore NotifLib.createNotification(
                      notifications,
                      notifCounter,
                      listing.userId,
                      #listingArchived,
                      "Listing Archived",
                      "Your listing '" # listing.title # "' has been archived because your subscription expired.",
                      now,
                    );
                  };
                };
                // Deletion warnings: archived > 27 days (< 3 days left in 30-day window)
                if (now - archivedAt >= ARCHIVE_WARN_THRESHOLD_NS) {
                  if (not NotifLib.hasRecentNotification(notifications, listing.userId, #listingDeletionWarning, DAY_NS, now)) {
                    ignore NotifLib.createNotification(
                      notifications,
                      notifCounter,
                      listing.userId,
                      #listingDeletionWarning,
                      "Listing Deletion Warning",
                      "Your archived listing '" # listing.title # "' will be permanently deleted in less than 3 days. Renew your subscription to restore it.",
                      now,
                    );
                  };
                };
              };
              case null {};
            };
          };
          case (#active) {};
        };
      };

      ignore ListingsLib.deleteExpiredArchivedListings(listings, images, accessControlState, now);

      // Auto-renewal: iterate all wallets that have autoRenewal=true
      for ((userId, wallet) in wallets.entries()) {
        if (wallet.autoRenewal) {
          let renewed = GasWalletLib.processAutoRenewal(wallets, subscriptions, userId, now);
          if (renewed) {
            ignore NotifLib.createNotification(
              notifications,
              notifCounter,
              userId,
              #subscriptionRenewed,
              "Subscription Renewed",
              "Your subscription has been automatically renewed. Your listings remain active.",
              now,
            );
          };
        };
      };

      // Subscription expiry alerts: notify users expiring within 7 days (once per 24h)
      for ((userId, sub) in subscriptions.entries()) {
        if (sub.expirationDate > now and sub.expirationDate - now <= ALERT_THRESHOLD_NS) {
          ignore PaymentsLib.sendSubscriptionExpiryAlert(userId);
          if (not NotifLib.hasRecentNotification(notifications, userId, #subscriptionExpiry, DAY_NS, now)) {
            let daysLeft = (sub.expirationDate - now) / DAY_NS;
            ignore NotifLib.createNotification(
              notifications,
              notifCounter,
              userId,
              #subscriptionExpiry,
              "Subscription Expiring Soon",
              "Your subscription expires in " # daysLeft.toText() # " days. Refuel your Gas Wallet to keep your listings active.",
              now,
            );
          };
        };
      };

      // Adaptive version snapshot — frequency depends on user count
      // Silently skips if not enough time has passed since last snapshot
      let userCount = profiles.size();
      let HOUR_NS : Int = 3_600_000_000_000;
      let intervalNs : Int = if (userCount > 200) {
        HOUR_NS
      } else if (userCount > 50) {
        6 * HOUR_NS
      } else if (userCount > 10) {
        12 * HOUR_NS
      } else {
        24 * HOUR_NS
      };
      if (now - lastAutoSnapshotTime.value >= intervalNs) {
        lastAutoSnapshotTime.value := now;
        ignore BackupLib.createVersionSnapshot(
          versionBackups, profiles, listings, subscriptions, notifications,
          siteSettings, appVersions, "version-snapshot-auto", "auto-adaptive",
          ?("Adaptive auto snapshot — " # userCount.toText() # " users"), now,
        );
      };
    },
  );

  include ListingsApi(accessControlState, listings, images, listingCounter, userRegistrations, userLastLogins, subscriptions);
  include ImagesApi(accessControlState, images, listings, imageCounter);
  include AdminApi(
    accessControlState,
    listings,
    images,
    siteSettings,
    appVersions,
    versionCounter,
    userRegistrations,
    userLastLogins,
    subscriptions,
    profiles,
    usernameIndex,
    auditLog,
    auditCounter,
    notifications,
    versionBackups,
  );
  include TiersApi(
    accessControlState,
    tiers,
    subscriptions,
    payments,
    discounts,
    adminTierActions,
    paymentCounter,
    discountCounter,
    adminActionCounter,
    listings,
    profiles,
    usernameIndex,
  );
  include PaymentsApi(
    accessControlState,
    payments,
    discounts,
    subscriptions,
    tiers,
    listings,
    paymentCounter,
    discountCounter,
    paymentConfig,
    profiles,
    notifications,
    siteSettings,
    appVersions,
    versionBackups,
    appConfig,
  );
  include GasWalletApi(
    accessControlState,
    appConfig,
    wallets,
    gasPurchases,
    gasPackages,
    gasPurchaseCounter,
    subscriptions,
  );
  include UserProfileApi(accessControlState, profiles, usernameIndex, subscriptions);
  include EmailVerificationApi(
    accessControlState,
    verificationRecords,
    emailIndex,
    profiles,
    usernameIndex,
    subscriptions,
  );
  include ScraperApi(accessControlState);
  include NotificationsApi(accessControlState, notifications, notifCounter, profiles, lowFuelNotificationSentFor);

  // Smart Paste — parse raw pasted listing text into structured fields
  include SmartPasteApi(accessControlState);

  // Browser Extension webhook — receives data captured by the extension
  include ExtensionApi(accessControlState, listings, listingCounter, profiles);

  // Facebook Graph API — per-user credentials to fetch owned FB listings
  include FacebookGraphApi(accessControlState, profiles);

  // Loyalty — refuel history and one-time free-gas reward tracking
  let refuelHistory  = Map.empty<Common.UserId, List.List<LoyaltyTypes.RefuelEntry>>();
  let claimedRewards = Map.empty<Common.UserId, List.List<LoyaltyTypes.TierName>>();
  include LoyaltyApi(accessControlState, refuelHistory, claimedRewards, subscriptions);

  // Smart Backup mixin — uses backups/versionBackups declared above
  include BackupApi(
    accessControlState,
    backups,
    backupCounter,
    backupHistory,
    listings,
    listingCounter,
    subscriptions,
    payments,
    paymentCounter,
    profiles,
    usernameIndex,
    notifications,
    siteSettings,
    appVersions,
    versionBackups,
    appConfig,
    lastAutoSnapshotTime,
  );

  // Config API — persistent admin-configurable key/value store
  include ConfigApi(
    accessControlState,
    appConfig,
    paymentConfig,
    versionBackups,
  );

  // ── Stripe Payment Backend ────────────────────────────────────────────────
  // webhookEventLog: ring buffer of last 50 processed payment events (kept for revenue stats)
  let webhookEventLog = List.empty<PaymentTypes.WebhookEvent>();
  // stripeCheckoutRateLimit: userId -> list of attempt timestamps
  let stripeCheckoutRateLimit = Map.empty<Text, List.List<Int>>();
  // pendingSessions: userId -> pending checkout session awaiting verifyAndGrantPayment
  let pendingSessions = Map.empty<Text, PaymentTypes.PendingSession>();
  // paymentBanners: userId+bannerType -> banner state (kept for frontend banner display)
  let paymentBanners = Map.empty<Text, PaymentTypes.PaymentBannerState>();
  // processedStripeEvents: kept for upgrade compatibility (webhooks removed, no longer written)
  let processedStripeEvents = Map.empty<Text, Int>();
  // failedWebhookEvents: kept for upgrade compatibility (webhooks removed, no longer written)
  let failedWebhookEvents = Map.empty<Text, PaymentTypes.FailedWebhookEvent>();
  // verifiedStripeSessionIds: append-only set of session IDs that have already been granted.
  // Prevents double-granting subscription days if verifyAndGrantPayment is called twice.
  let verifiedStripeSessionIds = Set.empty<Text>();

  include StripeCheckoutApi(
    accessControlState,
    appConfig,
    profiles,
    subscriptions,
    stripeCheckoutRateLimit,
    webhookEventLog,
    pendingSessions,
    notifications,
    notifCounter,
    paymentBanners,
    verifiedStripeSessionIds,
  );

  // ── Gemini OCR ────────────────────────────────────────────────────────────
  // geminiConfig: stores the Gemini API key and model (set via admin panel)
  let geminiConfig : { var current : ?OcrTypes.GeminiConfig } = { var current = null };
  // ocrFailureLog: ring buffer of OCR scan failures (capped at 500, admin-visible)
  let ocrFailureLog = List.empty<OcrTypes.OcrFailureEntry>();
  // appConfig passed so adminSaveGeminiConfig can sync gemini_api_key there too
  include OcrApi(accessControlState, geminiConfig, appConfig, ocrFailureLog);

  // ── Support Tickets ───────────────────────────────────────────────────────
  let supportTickets = List.empty<SupportTicketTypes.SupportTicket>();
  let ticketCounter  = { var value : Nat = 0 };

  // ── Admin Activity Notifications ──────────────────────────────────────────
  let adminNotifs       = List.empty<AdminNotifTypes.AdminNotification>();
  let adminNotifCounter = { var value : Nat = 0 };

  include SupportTicketsApi(
    accessControlState,
    supportTickets,
    ticketCounter,
    notifications,
    notifCounter,
    adminNotifs,
    adminNotifCounter,
    profiles,
  );

  include AdminNotificationsApi(
    accessControlState,
    adminNotifs,
    adminNotifCounter,
    notifications,
    notifCounter,
    profiles,
    subscriptions,
  );

  include MaintenanceApi(
    accessControlState,
    appConfig,
  );

  include SystemHealthApi(
    accessControlState,
    appConfig,
    versionBackups,
    profiles,
    subscriptions,
    listings,
    listingCounter,
    adminNotifs,
    adminNotifCounter,
    siteSettings,
    appVersions,
    notifications,
    usernameIndex,
  );
};

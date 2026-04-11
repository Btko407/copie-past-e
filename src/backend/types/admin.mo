import Common "common";

module {
  public type SiteSettings = {
    appName : Text;
    primaryColor : Text;
    accentColor : Text;
    uploadEnabled : Bool;
    copyButtonsEnabled : Bool;
    contentModerationEnabled : Bool;
    maxRequestsPerMinute : Nat;
    maxUploadsPerHour : Nat;
    maxSessionDurationMinutes : Nat;
    maxConcurrentSessions : Nat;
    allowedOrigins : Text;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  public type AppVersion = {
    id : Nat;
    versionLabel : Text;
    createdAt : Common.Timestamp;
    createdBy : Common.UserId;
    settingsSnapshot : SiteSettings;
    description : Text;
    isRollback : Bool;
  };

  public type UserSummary = {
    userId : Text;
    role : Text;
    registrationDate : Common.Timestamp;
    lastLoginDate : ?Common.Timestamp;
    listingCount : Nat;
    imageCount : Nat;
  };

  public type SiteAnalytics = {
    totalUsers : Nat;
    totalListings : Nat;
    totalImages : Nat;
    totalActiveListings : Nat;
    totalArchivedListings : Nat;
    paymentRevenue : Float;
    avgListingsPerUser : Float;
    avgImagesPerListing : Float;
  };

  public type UpdateSettingsArgs = {
    appName : Text;
    primaryColor : Text;
    accentColor : Text;
    uploadEnabled : Bool;
    copyButtonsEnabled : Bool;
    contentModerationEnabled : Bool;
    maxRequestsPerMinute : Nat;
    maxUploadsPerHour : Nat;
    maxSessionDurationMinutes : Nat;
    maxConcurrentSessions : Nat;
    allowedOrigins : Text;
  };

  public type CreateVersionArgs = {
    versionLabel : Text;
    description : Text;
  };

  public type UserCleanupSummary = {
    userId : Principal;
    email : Text;
    activeListingCount : Nat;
    archivedListingCount : Nat;
    oldestActiveExpirationDate : ?Common.Timestamp;
    hasExpiredListings : Bool;
  };

  public type AuditLogEntry = {
    id : Nat;
    action : Text;
    adminId : Common.UserId;
    targetUserId : ?Common.UserId;
    details : Text;
    timestamp : Common.Timestamp;
  };
};

import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import Types "../types/admin";
import ListingTypes "../types/listings";
import ImageTypes "../types/images";

module {
  public func defaultSettings(now : Common.Timestamp) : Types.SiteSettings {
    {
      appName = "Copie Past-e";
      primaryColor = "oklch(0.65 0.22 262)";
      accentColor = "oklch(0.88 0.19 84)";
      uploadEnabled = true;
      copyButtonsEnabled = true;
      contentModerationEnabled = false;
      maxRequestsPerMinute = 60;
      maxUploadsPerHour = 20;
      maxSessionDurationMinutes = 1440;
      maxConcurrentSessions = 3;
      allowedOrigins = "*";
      createdAt = now;
      updatedAt = now;
    };
  };

  public func getSettings(settings : { var current : ?Types.SiteSettings }) : Types.SiteSettings {
    switch (settings.current) {
      case (?s) s;
      case null defaultSettings(Time.now());
    };
  };

  public func updateSettings(
    settings : { var current : ?Types.SiteSettings },
    _caller : Common.UserId,
    args : Types.UpdateSettingsArgs,
  ) : Types.SiteSettings {
    let now = Time.now();
    let updated : Types.SiteSettings = {
      appName = args.appName;
      primaryColor = args.primaryColor;
      accentColor = args.accentColor;
      uploadEnabled = args.uploadEnabled;
      copyButtonsEnabled = args.copyButtonsEnabled;
      contentModerationEnabled = args.contentModerationEnabled;
      maxRequestsPerMinute = args.maxRequestsPerMinute;
      maxUploadsPerHour = args.maxUploadsPerHour;
      maxSessionDurationMinutes = args.maxSessionDurationMinutes;
      maxConcurrentSessions = args.maxConcurrentSessions;
      allowedOrigins = args.allowedOrigins;
      createdAt = switch (settings.current) {
        case (?s) s.createdAt;
        case null now;
      };
      updatedAt = now;
    };
    settings.current := ?updated;
    updated;
  };

  public func listAllUsers(
    _accessControlState : Any,
    listings : Map.Map<Common.ListingId, ListingTypes.Listing>,
    images : Map.Map<Common.ImageId, ImageTypes.Image>,
    userRegistrations : Map.Map<Common.UserId, Common.Timestamp>,
    userLastLogins : Map.Map<Common.UserId, Common.Timestamp>,
  ) : [Types.UserSummary] {
    // Count listings per user
    let listingCounts = Map.empty<Common.UserId, Nat>();
    for ((_, listing) in listings.entries()) {
      let current = switch (listingCounts.get(listing.userId)) {
        case (?n) n;
        case null 0;
      };
      listingCounts.add(listing.userId, current + 1);
    };

    // Count images per user (via listing ownership)
    let imageCounts = Map.empty<Common.UserId, Nat>();
    for ((_, image) in images.entries()) {
      // Find the listing owner
      switch (listings.get(image.listingId)) {
        case (?listing) {
          let current = switch (imageCounts.get(listing.userId)) {
            case (?n) n;
            case null 0;
          };
          imageCounts.add(listing.userId, current + 1);
        };
        case null {};
      };
    };

    // Build summaries from registered users
    let summaries = List.empty<Types.UserSummary>();
    for ((userId, registrationDate) in userRegistrations.entries()) {
      let listingCount = switch (listingCounts.get(userId)) {
        case (?n) n;
        case null 0;
      };
      let imageCount = switch (imageCounts.get(userId)) {
        case (?n) n;
        case null 0;
      };
      let lastLoginDate = userLastLogins.get(userId);
      summaries.add({
        userId = userId.toText();
        role = "user";
        registrationDate;
        lastLoginDate;
        listingCount;
        imageCount;
      });
    };
    summaries.toArray();
  };

  public func getSiteAnalytics(
    _accessControlState : Any,
    listings : Map.Map<Common.ListingId, ListingTypes.Listing>,
    images : Map.Map<Common.ImageId, ImageTypes.Image>,
    userRegistrations : Map.Map<Common.UserId, Common.Timestamp>,
  ) : Types.SiteAnalytics {
    let totalUsers = userRegistrations.size();
    let totalListings = listings.size();
    let totalImages = images.size();

    var totalActiveListings : Nat = 0;
    var totalArchivedListings : Nat = 0;
    for ((_, listing) in listings.entries()) {
      switch (listing.status) {
        case (#active) { totalActiveListings += 1 };
        case (#archived) { totalArchivedListings += 1 };
      };
    };

    let avgListingsPerUser : Float = if (totalUsers == 0) {
      0.0;
    } else {
      totalListings.toFloat() / totalUsers.toFloat();
    };

    let avgImagesPerListing : Float = if (totalListings == 0) {
      0.0;
    } else {
      totalImages.toFloat() / totalListings.toFloat();
    };

    {
      totalUsers;
      totalListings;
      totalImages;
      totalActiveListings;
      totalArchivedListings;
      paymentRevenue = 0.0;
      avgListingsPerUser;
      avgImagesPerListing;
    };
  };

  public func listVersionHistory(versions : List.List<Types.AppVersion>) : [Types.AppVersion] {
    // Sort descending by id
    let sorted = versions.sort(func(a, b) {
      if (a.id > b.id) #less
      else if (a.id < b.id) #greater
      else #equal
    });
    sorted.toArray();
  };

  // Generate version label: v1.0, v1.1, v1.2, etc.
  func versionLabel(counter : Nat) : Text {
    let major = 1;
    let minor = counter;
    "v" # major.toText() # "." # minor.toText();
  };

  public func createVersion(
    versions : List.List<Types.AppVersion>,
    versionCounter : { var value : Nat },
    caller : Common.UserId,
    settings : { var current : ?Types.SiteSettings },
    args : Types.CreateVersionArgs,
    isRollback : Bool,
  ) : Types.AppVersion {
    let id = versionCounter.value;
    versionCounter.value += 1;
    let snapshot = getSettings(settings);
    let version : Types.AppVersion = {
      id;
      versionLabel = args.versionLabel;
      createdAt = Time.now();
      createdBy = caller;
      settingsSnapshot = snapshot;
      description = args.description;
      isRollback;
    };
    versions.add(version);
    version;
  };

  public func rollbackToVersion(
    versions : List.List<Types.AppVersion>,
    settings : { var current : ?Types.SiteSettings },
    versionCounter : { var value : Nat },
    caller : Common.UserId,
    versionId : Nat,
  ) : Types.SiteSettings {
    // Find the target version
    let target = switch (versions.find(func(v : Types.AppVersion) : Bool { v.id == versionId })) {
      case (?v) v;
      case null Runtime.trap("Version not found");
    };

    // Restore settings from snapshot (never touch listings/images/user accounts)
    let now = Time.now();
    let restored : Types.SiteSettings = {
      target.settingsSnapshot with
      updatedAt = now;
    };
    settings.current := ?restored;

    // Create a new version entry recording the rollback
    let rollbackId = versionCounter.value;
    versionCounter.value += 1;
    let rollbackVersion : Types.AppVersion = {
      id = rollbackId;
      versionLabel = versionLabel(rollbackId);
      createdAt = now;
      createdBy = caller;
      settingsSnapshot = restored;
      description = "Rollback to " # target.versionLabel;
      isRollback = true;
    };
    versions.add(rollbackVersion);
    restored;
  };

  public func recordUserRegistration(
    userRegistrations : Map.Map<Common.UserId, Common.Timestamp>,
    userId : Common.UserId,
    timestamp : Common.Timestamp,
  ) {
    // Only record if not already registered
    switch (userRegistrations.get(userId)) {
      case null { userRegistrations.add(userId, timestamp) };
      case (?_) {};
    };
  };

  public func recordUserLogin(
    userLastLogins : Map.Map<Common.UserId, Common.Timestamp>,
    userId : Common.UserId,
    timestamp : Common.Timestamp,
  ) {
    userLastLogins.add(userId, timestamp);
  };

  // --- Cleanup summaries for admin dashboard ---
  // Returns per-user stats for all non-admin users.
  public func getUserCleanupSummaries(
    listings : Map.Map<Common.ListingId, ListingTypes.Listing>,
    accessControlState : AccessControl.AccessControlState,
    userRegistrations : Map.Map<Common.UserId, Common.Timestamp>,
    nowNs : Common.Timestamp,
  ) : [Types.UserCleanupSummary] {
    let summaries = List.empty<Types.UserCleanupSummary>();

    for ((userId, _) in userRegistrations.entries()) {
      // Skip admin users (safe lookup — no trap on unregistered)
      let isAdmin = switch (accessControlState.userRoles.get(userId)) {
        case (?(#admin)) true;
        case _ false;
      };
      if (not isAdmin) {
        var activeCount : Nat = 0;
        var archivedCount : Nat = 0;
        var oldestExpiration : ?Common.Timestamp = null;
        var hasExpired : Bool = false;

        for ((_, listing) in listings.entries()) {
          if (Principal.equal(listing.userId, userId)) {
            switch (listing.status) {
              case (#active) {
                activeCount += 1;
                if (listing.expirationDate < nowNs) {
                  hasExpired := true;
                };
                switch (oldestExpiration) {
                  case null { oldestExpiration := ?listing.expirationDate };
                  case (?oldest) {
                    if (listing.expirationDate < oldest) {
                      oldestExpiration := ?listing.expirationDate;
                    };
                  };
                };
              };
              case (#archived) { archivedCount += 1 };
            };
          };
        };

        summaries.add({
          userId;
          email = "";
          activeListingCount = activeCount;
          archivedListingCount = archivedCount;
          oldestActiveExpirationDate = oldestExpiration;
          hasExpiredListings = hasExpired;
        });
      };
    };

    summaries.toArray();
  };

  // --- Audit log ---
  // Appends an entry to the audit log.
  public func appendAuditLog(
    auditLog : List.List<Types.AuditLogEntry>,
    auditCounter : { var value : Nat },
    action : Text,
    adminId : Common.UserId,
    targetUserId : ?Common.UserId,
    details : Text,
    nowNs : Common.Timestamp,
  ) : () {
    let id = auditCounter.value;
    auditCounter.value += 1;
    auditLog.add({
      id;
      action;
      adminId;
      targetUserId;
      details;
      timestamp = nowNs;
    });
  };

  public func listAuditLog(auditLog : List.List<Types.AuditLogEntry>) : [Types.AuditLogEntry] {
    // Sort descending by id (most recent first)
    let sorted = auditLog.sort(func(a, b) {
      if (a.id > b.id) #less
      else if (a.id < b.id) #greater
      else #equal
    });
    sorted.toArray();
  };
};

import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Common "../types/common";
import BackupTypes "../types/backup";
import ListingTypes "../types/listings";
import ProfileTypes "../types/userprofile";
import TierTypes "../types/tiers";
import NotifTypes "../types/notifications";
import AdminTypes "../types/admin";

module {
  let SMART_BACKUP_PRICE_USD : Float = 29.99;

  /// Maximum number of automatic version backups to retain.
  let MAX_AUTO_BACKUPS : Nat = 50;

  // ── Legacy per-user backup helpers ─────────────────────────────────────────

  /// Create a new pending backup record and store it.
  public func createBackupRecord(
    backups : Map.Map<Nat, BackupTypes.BackupRecord>,
    counter : { var value : Nat },
    userId : Common.UserId,
    fileSize : Nat,
    nowNs : Common.Timestamp,
  ) : BackupTypes.BackupRecord {
    let id = counter.value;
    counter.value += 1;
    let record : BackupTypes.BackupRecord = {
      id;
      userId;
      createdAt = nowNs;
      fileSize;
      status = #complete;
      downloadUrl = "";
    };
    backups.add(id, record);
    record;
  };

  /// Return all backup records owned by the given user, newest first.
  public func listUserBackups(
    backups : Map.Map<Nat, BackupTypes.BackupRecord>,
    userId : Common.UserId,
  ) : [BackupTypes.BackupRecord] {
    let results = backups.values()
      .filter(func(r : BackupTypes.BackupRecord) : Bool {
        Principal.equal(r.userId, userId)
      })
      .toArray();
    results.sort(func(a : BackupTypes.BackupRecord, b : BackupTypes.BackupRecord) : { #less; #equal; #greater } {
      if (a.createdAt > b.createdAt) { #less }
      else if (a.createdAt < b.createdAt) { #greater }
      else { #equal }
    });
  };

  /// Remove a backup record.  No-op if the record does not exist or belongs to a different user.
  public func deleteBackupRecord(
    backups : Map.Map<Nat, BackupTypes.BackupRecord>,
    backupId : Nat,
    callerUserId : Common.UserId,
  ) : { #ok; #err : Text } {
    switch (backups.get(backupId)) {
      case null { #err("Backup not found") };
      case (?record) {
        if (not Principal.equal(record.userId, callerUserId)) {
          return #err("Unauthorized");
        };
        backups.remove(backupId);
        #ok;
      };
    };
  };

  /// Collect all active and archived listings for a user as a restore-friendly snapshot array.
  public func generateBackupData(
    listings : Map.Map<Common.ListingId, ListingTypes.Listing>,
    userId : Common.UserId,
  ) : [BackupTypes.ListingSnapshot] {
    listings.values()
      .filter(func(l : ListingTypes.Listing) : Bool {
        Principal.equal(l.userId, userId)
      })
      .map<ListingTypes.Listing, BackupTypes.ListingSnapshot>(func(l) : BackupTypes.ListingSnapshot {
        {
          title       = l.title;
          description = l.description;
          price       = l.price;
          category    = l.category;
          pinned      = l.pinned;
          favorited   = l.favorited;
        }
      })
      .toArray();
  };

  /// Generate full backup listing entries (for ZIP export) including image placeholders.
  /// Image URLs are passed in as a parallel array of (listingId, [imageUrl]) pairs.
  public func generateFullBackupEntries(
    listings  : Map.Map<Common.ListingId, ListingTypes.Listing>,
    userId    : Common.UserId,
    imageMap  : Map.Map<Common.ListingId, [Text]>,
  ) : [BackupTypes.BackupListingEntry] {
    listings.values()
      .filter(func(l : ListingTypes.Listing) : Bool {
        Principal.equal(l.userId, userId)
      })
      .map<ListingTypes.Listing, BackupTypes.BackupListingEntry>(func(l) : BackupTypes.BackupListingEntry {
        let urls : [Text] = switch (imageMap.get(l.id)) {
          case (?arr) { arr };
          case null   { [] };
        };
        let imageEntries : [BackupTypes.BackupImageEntry] = urls.values()
          .enumerate()
          .map<(Nat, Text), BackupTypes.BackupImageEntry>(func((idx, url)) : BackupTypes.BackupImageEntry {
            {
              filename    = "images/listing-" # l.id.toText() # "-" # idx.toText() # ".jpg";
              originalUrl = url;
            }
          })
          .toArray();
        {
          id          = l.id;
          title       = l.title;
          description = l.description;
          price       = l.price;
          category    = l.category;
          subcategory = null;   // field added in v19; stored in listings if present
          condition   = null;
          brand       = null;
          typeModel   = null;
          sourceUrl   = l.sourceUrl;
          createdAt   = l.createdAt;
          archivedAt  = l.archivedAt;
          pinned      = l.pinned;
          favorited   = l.favorited;
          images      = imageEntries;
        }
      })
      .toArray();
  };

  // ── Backup History (paid export records) ───────────────────────────────────

  let SEVEN_DAYS_NS : Int = 604_800_000_000_000;

  /// Generate a simple pseudo-unique token from timestamp + userId.
  public func generateToken(nowNs : Common.Timestamp, userId : Principal) : Text {
    "bkp-" # nowNs.toText() # "-" # userId.toText()
  };

  /// Store a new backup history record after a successful paid export.
  public func recordBackupExport(
    backupHistory  : List.List<BackupTypes.BackupHistoryRecord>,
    userId         : Principal,
    listingCount   : Nat,
    imageCount     : Nat,
    paymentIntentId : Text,
    nowNs          : Common.Timestamp,
  ) : BackupTypes.BackupHistoryRecord {
    let token = generateToken(nowNs, userId);
    let record : BackupTypes.BackupHistoryRecord = {
      id                 = token;
      userId;
      exportedAt         = nowNs;
      listingCount;
      imageCount;
      paymentIntentId;
      downloadToken      = token;
      downloadExpiresAt  = nowNs + SEVEN_DAYS_NS;
    };
    backupHistory.add(record);
    record;
  };

  /// Return all backup history records for a specific user, newest first.
  public func getUserBackupHistory(
    backupHistory : List.List<BackupTypes.BackupHistoryRecord>,
    userId        : Principal,
  ) : [BackupTypes.BackupHistoryRecord] {
    let arr = backupHistory
      .filter(func(r : BackupTypes.BackupHistoryRecord) : Bool {
        Principal.equal(r.userId, userId)
      })
      .toArray();
    arr.sort(func(a : BackupTypes.BackupHistoryRecord, b : BackupTypes.BackupHistoryRecord) : { #less; #equal; #greater } {
      if (a.exportedAt > b.exportedAt) { #less }
      else if (a.exportedAt < b.exportedAt) { #greater }
      else { #equal }
    });
  };

  /// Find a backup history record by its download token, if not expired.
  public func findValidDownloadRecord(
    backupHistory : List.List<BackupTypes.BackupHistoryRecord>,
    token         : Text,
    nowNs         : Common.Timestamp,
  ) : ?BackupTypes.BackupHistoryRecord {
    backupHistory.find(func(r : BackupTypes.BackupHistoryRecord) : Bool {
      r.downloadToken == token and r.downloadExpiresAt > nowNs
    })
  };

  // ── ZIP-based restore (user-facing) ────────────────────────────────────────

  /// Restore listings from a ZIP backup payload (frontend pre-parses the ZIP).
  /// Accepts full BackupListingEntry records plus optional image URL remapping.
  /// Returns the count of listings restored.
  public func restoreFromZipBackup(
    listings       : Map.Map<Common.ListingId, ListingTypes.Listing>,
    listingCounter : { var value : Nat },
    userId         : Common.UserId,
    entries        : [BackupTypes.BackupListingEntry],
    expirationDate : Common.Timestamp,
    nowNs          : Common.Timestamp,
  ) : Nat {
    var count = 0;
    for (entry in entries.values()) {
      let id = listingCounter.value;
      listingCounter.value += 1;
      listings.add(id, {
        id;
        userId;
        title            = entry.title;
        description      = entry.description;
        price            = entry.price;
        sourceUrl        = entry.sourceUrl;
        createdAt        = nowNs;
        status           = #active;
        expirationDate;
        tierLevel        = 1;
        category         = entry.category;
        archivedAt       = null;
        archivedManually = false;
        restoredAt       = ?nowNs;
        pinned           = entry.pinned;
        favorited        = entry.favorited;
        pinnedAt         = null;
      });
      count += 1;
    };
    count;
  };

  /// Restore listings from a backup snapshot.  Each snapshot becomes a fresh active
  /// listing for the caller, with the supplied expiration date.
  /// Returns the count of listings successfully created.
  public func restoreFromBackup(
    listings : Map.Map<Common.ListingId, ListingTypes.Listing>,
    listingCounter : { var value : Nat },
    userId : Common.UserId,
    snapshots : [BackupTypes.ListingSnapshot],
    expirationDate : Common.Timestamp,
    nowNs : Common.Timestamp,
  ) : Nat {
    var count = 0;
    for (snap in snapshots.values()) {
      let id = listingCounter.value;
      listingCounter.value += 1;
      listings.add(id, {
        id;
        userId;
        title       = snap.title;
        description = snap.description;
        price       = snap.price;
        sourceUrl   = null;
        createdAt   = nowNs;
        status      = #active;
        expirationDate;
        tierLevel   = 1;
        category    = snap.category;
        archivedAt  = null;
        archivedManually = false;
        restoredAt  = null;
        pinned      = snap.pinned;
        favorited   = snap.favorited;
        pinnedAt    = null;
      });
      count += 1;
    };
    count;
  };

  // ── JSON serialisation helpers ──────────────────────────────────────────────

  func escapeJson(s : Text) : Text {
    s
      .replace(#text "\\", "\\\\")
      .replace(#text "\"", "\\\"")
      .replace(#text "\n", "\\n")
      .replace(#text "\r", "\\r")
      .replace(#text "\t", "\\t")
  };

  func optText(v : ?Text) : Text {
    switch v {
      case null  { "null" };
      case (?t)  { "\"" # escapeJson(t) # "\"" };
    }
  };

  func optInt(v : ?Common.Timestamp) : Text {
    switch v {
      case null  { "null" };
      case (?n)  { n.toText() };
    }
  };

  func boolText(b : Bool) : Text {
    if (b) "true" else "false"
  };

  // Serialise a single listing to a JSON object string
  func listingToJson(l : ListingTypes.Listing) : Text {
    let statusStr = switch (l.status) {
      case (#active)   { "active" };
      case (#archived) { "archived" };
    };
    "{\"id\":" # l.id.toText()
    # ",\"userId\":\"" # l.userId.toText() # "\""
    # ",\"title\":\"" # escapeJson(l.title) # "\""
    # ",\"description\":\"" # escapeJson(l.description) # "\""
    # ",\"price\":" # optText(l.price)
    # ",\"category\":" # optText(l.category)
    # ",\"status\":\"" # statusStr # "\""
    # ",\"pinned\":" # boolText(l.pinned)
    # ",\"favorited\":" # boolText(l.favorited)
    # ",\"archivedManually\":" # boolText(l.archivedManually)
    # ",\"createdAt\":" # l.createdAt.toText()
    # ",\"archivedAt\":" # optInt(l.archivedAt)
    # ",\"expirationDate\":" # l.expirationDate.toText()
    # ",\"tierLevel\":" # l.tierLevel.toText()
    # ",\"sourceUrl\":" # optText(l.sourceUrl)
    # "}"
  };

  // Serialise a user profile to a JSON object string
  func profileToJson(p : ProfileTypes.UserProfile) : Text {
    "{\"userId\":\"" # p.userId.toText() # "\""
    # ",\"username\":\"" # escapeJson(p.username) # "\""
    # ",\"email\":\"" # escapeJson(p.email) # "\""
    # ",\"role\":\"" # escapeJson(p.role) # "\""
    # ",\"emailVerified\":" # boolText(p.emailVerified)
    # ",\"createdAt\":" # p.createdAt.toText()
    # ",\"stripeCustomerId\":" # optText(p.stripeCustomerId)
    # "}"
  };

  // Serialise a subscription to a JSON object string
  func subscriptionToJson(s : TierTypes.UserTierSubscription) : Text {
    "{\"userId\":\"" # s.userId.toText() # "\""
    # ",\"tier\":" # s.tier.toText()
    # ",\"expirationDate\":" # s.expirationDate.toText()
    # ",\"autoRenewal\":" # boolText(s.autoRenewal)
    # ",\"updatedAt\":" # s.updatedAt.toText()
    # ",\"stripeSubscriptionId\":" # optText(s.stripeSubscriptionId)
    # "}"
  };

  // Serialise a notification to a JSON object string
  func notifToJson(n : NotifTypes.InAppNotification) : Text {
    let typStr = switch (n.notificationType) {
      case (#subscriptionExpiry)      { "subscriptionExpiry" };
      case (#subscriptionRenewed)     { "subscriptionRenewed" };
      case (#listingArchived)         { "listingArchived" };
      case (#listingDeletionWarning)  { "listingDeletionWarning" };
      case (#adminAnnouncement)       { "adminAnnouncement" };
      case (#lowFuelWarning)          { "lowFuelWarning" };
      case (#paymentFailed)           { "paymentFailed" };
      case (#subscriptionCancelled)   { "subscriptionCancelled" };
      case (#refuelSuccess)           { "refuelSuccess" };
    };
    "{\"id\":" # n.id.toText()
    # ",\"userId\":\"" # n.userId.toText() # "\""
    # ",\"notificationType\":\"" # typStr # "\""
    # ",\"title\":\"" # escapeJson(n.title) # "\""
    # ",\"message\":\"" # escapeJson(n.message) # "\""
    # ",\"isRead\":" # boolText(n.isRead)
    # ",\"createdAt\":" # n.createdAt.toText()
    # "}"
  };

  // Serialise SiteSettings to JSON
  func siteSettingsToJson(s : AdminTypes.SiteSettings) : Text {
    "{\"appName\":\"" # escapeJson(s.appName) # "\""
    # ",\"primaryColor\":\"" # escapeJson(s.primaryColor) # "\""
    # ",\"accentColor\":\"" # escapeJson(s.accentColor) # "\""
    # ",\"uploadEnabled\":" # boolText(s.uploadEnabled)
    # ",\"copyButtonsEnabled\":" # boolText(s.copyButtonsEnabled)
    # ",\"contentModerationEnabled\":" # boolText(s.contentModerationEnabled)
    # ",\"maxRequestsPerMinute\":" # s.maxRequestsPerMinute.toText()
    # ",\"maxUploadsPerHour\":" # s.maxUploadsPerHour.toText()
    # ",\"maxSessionDurationMinutes\":" # s.maxSessionDurationMinutes.toText()
    # ",\"maxConcurrentSessions\":" # s.maxConcurrentSessions.toText()
    # ",\"allowedOrigins\":\"" # escapeJson(s.allowedOrigins) # "\""
    # ",\"createdAt\":" # s.createdAt.toText()
    # ",\"updatedAt\":" # s.updatedAt.toText()
    # "}"
  };

  /// Join an array of JSON strings into a JSON array string.
  func jsonArray(items : [Text]) : Text {
    "[" # items.values().join(",") # "]"
  };

  // ── Version Backup core functions ───────────────────────────────────────────

  /// Generate a unique backup ID from the current timestamp.
  func generateBackupId(now : Common.Timestamp) : Text {
    "vb-" # now.toText()
  };

  /// Count how many users appear in a backupData JSON blob.
  /// We count occurrences of "\"userId\":" inside the "users" section (simple heuristic).
  public func countUsersInBackup(backupData : Text) : Nat {
    // Locate the users array and count objects
    let marker = "\"users\":[";
    let parts = backupData.split(#text marker);
    ignore parts.next(); // skip before
    switch (parts.next()) {
      case null { 0 };
      case (?usersSection) {
        // Count occurrences of "\"userId\":" in the users section
        var count = 0;
        let subparts = usersSection.split(#text "\"userId\":");
        ignore subparts.next();
        label iter loop {
          switch (subparts.next()) {
            case null { break iter };
            case (?_) { count += 1 };
          }
        };
        count
      };
    }
  };

  /// Count how many listings appear in a backupData JSON blob.
  public func countListingsInBackup(backupData : Text) : Nat {
    let marker = "\"listings\":[";
    let parts = backupData.split(#text marker);
    ignore parts.next();
    switch (parts.next()) {
      case null { 0 };
      case (?section) {
        var count = 0;
        let subparts = section.split(#text "\"id\":");
        ignore subparts.next();
        label iter2 loop {
          switch (subparts.next()) {
            case null { break iter2 };
            case (?_) { count += 1 };
          }
        };
        count
      };
    }
  };

  /// Collect all state into a single JSON text blob.
  public func serializeAllData(
    profiles      : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
    listings      : Map.Map<Common.ListingId, ListingTypes.Listing>,
    subscriptions : Map.Map<Common.UserId, TierTypes.UserTierSubscription>,
    notifications : Map.Map<Common.UserId, List.List<NotifTypes.InAppNotification>>,
    siteSettings  : { var current : ?AdminTypes.SiteSettings },
    versionLabel  : Text,
    nowNs         : Common.Timestamp,
  ) : Text {
    let userJsons = profiles.values()
      .map(profileToJson)
      .toArray();

    let listingJsons = listings.values()
      .map(listingToJson)
      .toArray();

    let subJsons = subscriptions.values()
      .map(subscriptionToJson)
      .toArray();

    // Flatten all notifications across users into one array
    let notifJsons = List.empty<Text>();
    for ((_, userNotifs) in notifications.entries()) {
      for (n in userNotifs.values()) {
        notifJsons.add(notifToJson(n));
      };
    };

    let settingsJson = switch (siteSettings.current) {
      case null  { "null" };
      case (?s)  { siteSettingsToJson(s) };
    };

    "{\"versionLabel\":\"" # escapeJson(versionLabel) # "\""
    # ",\"timestamp\":" # nowNs.toText()
    # ",\"users\":" # jsonArray(userJsons)
    # ",\"listings\":" # jsonArray(listingJsons)
    # ",\"subscriptions\":" # jsonArray(subJsons)
    # ",\"notifications\":" # jsonArray(notifJsons.toArray())
    # ",\"appConfig\":" # settingsJson
    # "}"
  };

  /// Create a version backup and store it, enforcing the auto-rotation cap.
  /// Manual backups are never auto-deleted.
  public func createVersionBackup(
    versionBackups : List.List<BackupTypes.VersionBackup>,
    profiles       : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
    listings       : Map.Map<Common.ListingId, ListingTypes.Listing>,
    subscriptions  : Map.Map<Common.UserId, TierTypes.UserTierSubscription>,
    notifications  : Map.Map<Common.UserId, List.List<NotifTypes.InAppNotification>>,
    siteSettings   : { var current : ?AdminTypes.SiteSettings },
    appVersions    : List.List<AdminTypes.AppVersion>,
    isManual       : Bool,
    createdBy      : Text,
    notes          : ?Text,
    nowNs          : Common.Timestamp,
  ) : BackupTypes.VersionBackup {
    // Derive version label from latest app version or timestamp
    let versionLabel : Text = switch (appVersions.last()) {
      case (?v) { v.versionLabel };
      case null { "v-" # nowNs.toText() };
    };

    let backupData = serializeAllData(
      profiles, listings, subscriptions, notifications, siteSettings, versionLabel, nowNs,
    );

    let backup : BackupTypes.VersionBackup = {
      id          = generateBackupId(nowNs);
      versionLabel;
      createdAt   = nowNs;
      createdBy;
      backupData;
      backupType  = if (isManual) "manual" else "auto";
      notes;
      isStable    = false;
    };

    versionBackups.add(backup);

    // Rotate: if this was an auto backup, prune oldest auto/version-snapshot backups beyond cap
    if (not isManual) {
      // Count current auto-type backups (auto + version-snapshot-auto)
      let autoCount = versionBackups.filter(
        func(b : BackupTypes.VersionBackup) : Bool {
          b.backupType == "auto" or b.backupType.startsWith(#text "version-snapshot")
        }
      ).size();

      if (autoCount > MAX_AUTO_BACKUPS) {
        // Find and remove the oldest auto backup (auto or version-snapshot-auto)
        let oldestIdx = versionBackups.findIndex(
          func(b : BackupTypes.VersionBackup) : Bool {
            b.backupType == "auto" or b.backupType.startsWith(#text "version-snapshot")
          }
        );
        switch (oldestIdx) {
          case (?idx) {
            // Rebuild list without that index
            let keep = List.empty<BackupTypes.VersionBackup>();
            versionBackups.forEachEntry(func(i : Nat, b : BackupTypes.VersionBackup) {
              if (i != idx) { keep.add(b) };
            });
            versionBackups.clear();
            versionBackups.append(keep);
          };
          case null {};
        };
      };
    };

    backup;
  };

  /// Count how many app_config rows appear in a backupData JSON blob.
  public func countConfigInBackup(backupData : Text) : Nat {
    let marker = "\"appConfig\":{";
    let parts = backupData.split(#text marker);
    ignore parts.next();
    switch (parts.next()) {
      case null { 0 };
      case (?_) { 1 }; // one settings object = 1 config block
    }
  };

  /// Build a summary (no backupData blob) from a VersionBackup.
  public func toVersionBackupSummary(b : BackupTypes.VersionBackup) : BackupTypes.VersionBackupSummary {
    let sizeKb = if (b.backupData.size() == 0) 0 else (b.backupData.size() / 1024) + 1;
    {
      id           = b.id;
      versionLabel = b.versionLabel;
      createdAt    = b.createdAt;
      createdBy    = b.createdBy;
      backupType   = b.backupType;
      userCount    = countUsersInBackup(b.backupData);
      listingCount = countListingsInBackup(b.backupData);
      configCount  = countConfigInBackup(b.backupData);
      sizeKb;
      isStable     = b.isStable;
      notes        = b.notes;
    }
  };

  /// Create a version SNAPSHOT backup with a specific snapshot type string.
  /// snapshotType must be one of: "version-snapshot-auto", "version-snapshot-manual", "version-snapshot-pre-upgrade"
  /// Manual snapshots are never auto-deleted; auto snapshots follow the rotation cap.
  public func createVersionSnapshot(
    versionBackups : List.List<BackupTypes.VersionBackup>,
    profiles       : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
    listings       : Map.Map<Common.ListingId, ListingTypes.Listing>,
    subscriptions  : Map.Map<Common.UserId, TierTypes.UserTierSubscription>,
    notifications  : Map.Map<Common.UserId, List.List<NotifTypes.InAppNotification>>,
    siteSettings   : { var current : ?AdminTypes.SiteSettings },
    appVersions    : List.List<AdminTypes.AppVersion>,
    snapshotType   : Text,
    createdBy      : Text,
    notes          : ?Text,
    nowNs          : Common.Timestamp,
  ) : BackupTypes.VersionBackup {
    let versionLabel : Text = switch (appVersions.last()) {
      case (?v) { v.versionLabel };
      case null { "v-" # nowNs.toText() };
    };

    let backupData = serializeAllData(
      profiles, listings, subscriptions, notifications, siteSettings, versionLabel, nowNs,
    );

    let backup : BackupTypes.VersionBackup = {
      id          = generateBackupId(nowNs);
      versionLabel;
      createdAt   = nowNs;
      createdBy;
      backupData;
      backupType  = snapshotType;
      notes;
      isStable    = false;
    };

    versionBackups.add(backup);

    // Rotate: auto snapshots count against the rotation cap
    let isAuto = snapshotType == "version-snapshot-auto";
    if (isAuto) {
      let autoCount = versionBackups.filter(
        func(b : BackupTypes.VersionBackup) : Bool {
          b.backupType == "auto" or b.backupType.startsWith(#text "version-snapshot")
        }
      ).size();

      if (autoCount > MAX_AUTO_BACKUPS) {
        let oldestIdx = versionBackups.findIndex(
          func(b : BackupTypes.VersionBackup) : Bool {
            b.backupType == "auto" or b.backupType.startsWith(#text "version-snapshot")
          }
        );
        switch (oldestIdx) {
          case (?idx) {
            let keep = List.empty<BackupTypes.VersionBackup>();
            versionBackups.forEachEntry(func(i : Nat, b : BackupTypes.VersionBackup) {
              if (i != idx) { keep.add(b) };
            });
            versionBackups.clear();
            versionBackups.append(keep);
          };
          case null {};
        };
      };
    };

    backup;
  };

  /// List all version backups as summaries, newest first.
  public func listVersionBackupSummaries(
    versionBackups : List.List<BackupTypes.VersionBackup>
  ) : [BackupTypes.VersionBackupSummary] {
    let arr = versionBackups
      .map<BackupTypes.VersionBackup, BackupTypes.VersionBackupSummary>(toVersionBackupSummary)
      .toArray();
    arr.sort(func(a : BackupTypes.VersionBackupSummary, b : BackupTypes.VersionBackupSummary) : { #less; #equal; #greater } {
      if (a.createdAt > b.createdAt) { #less }
      else if (a.createdAt < b.createdAt) { #greater }
      else { #equal }
    });
  };

  // ── JSON parse helpers for restore ─────────────────────────────────────────
  // Simple field extractors — enough for restoring the structured fields we
  // serialised above. Not a general-purpose JSON parser.

  /// Extract a string field value from a JSON object fragment.
  func parseStringField(json : Text, field : Text) : ?Text {
    let marker = "\"" # field # "\":\"";
    let parts = json.split(#text marker);
    ignore parts.next();
    switch (parts.next()) {
      case null { null };
      case (?after) {
        // Find the closing quote, accounting for escaped quotes
        var result = "";
        var escaped = false;
        var done = false;
        for (c in after.toIter()) {
          if (done) {}
          else if (escaped) {
            result := result # Text.fromChar(c);
            escaped := false;
          } else if (c == '\\') {
            escaped := true;
          } else if (c == '\"') {
            done := true;
          } else {
            result := result # Text.fromChar(c);
          };
        };
        if (done) ?result else null
      };
    }
  };

  /// Extract an integer field value from a JSON object fragment.
  func parseIntField(json : Text, field : Text) : ?Int {
    let marker = "\"" # field # "\":";
    let parts = json.split(#text marker);
    ignore parts.next();
    switch (parts.next()) {
      case null { null };
      case (?after) {
        // Read until non-digit (or '-' for negative)
        var numStr = "";
        var first = true;
        var done = false;
        for (c in after.toIter()) {
          if (done) {}
          else if (first and c == '-') { numStr := "-"; first := false }
          else if (c >= '0' and c <= '9') { numStr := numStr # Text.fromChar(c); first := false }
          else if (not first) { done := true }
          else { done := true };
        };
        Int.fromText(numStr)
      };
    }
  };

  /// Extract a boolean field value.
  func parseBoolField(json : Text, field : Text) : Bool {
    let marker = "\"" # field # "\":";
    let parts = json.split(#text marker);
    ignore parts.next();
    switch (parts.next()) {
      case null { false };
      case (?after) {
        after.startsWith(#text "true")
      };
    }
  };

  /// Split the top-level JSON array value for a given key into element strings.
  /// Each element is a {...} JSON object.
  func extractJsonArray(json : Text, key : Text) : [Text] {
    let marker = "\"" # key # "\":[";
    let parts = json.split(#text marker);
    ignore parts.next();
    switch (parts.next()) {
      case null { [] };
      case (?arrayContent) {
        // Walk character by character, tracking brace depth
        let items = List.empty<Text>();
        var depth = 0;
        var start = 0;
        var pos = 0;
        var inString = false;
        var escaped = false;
        var current = "";

        for (c in arrayContent.toIter()) {
          if (escaped) {
            current := current # Text.fromChar(c);
            escaped := false;
          } else if (inString) {
            current := current # Text.fromChar(c);
            if (c == '\\') { escaped := true }
            else if (c == '\"') { inString := false };
          } else {
            if (c == '\"') {
              inString := true;
              current := current # Text.fromChar(c);
            } else if (c == '{') {
              depth += 1;
              current := current # Text.fromChar(c);
            } else if (c == '}') {
              current := current # Text.fromChar(c);
              if (depth > 0) { depth -= 1 };
              if (depth == 0 and current != "") {
                items.add(current);
                current := "";
              };
            } else if (depth == 0 and c == ']') {
              // end of array
              // break not available, ignore remaining
            } else {
              if (depth > 0) {
                current := current # Text.fromChar(c);
              };
            };
          };
        };
        items.toArray()
      };
    }
  };

  // ── Restore implementation ─────────────────────────────────────────────────

  /// Parse a listing JSON object and upsert it into the listings map.
  /// Does NOT delete listings created after the backup.
  func restoreListingFromJson(
    listings       : Map.Map<Common.ListingId, ListingTypes.Listing>,
    listingCounter : { var value : Nat },
    json           : Text,
    nowNs          : Common.Timestamp,
  ) : Bool {
    let idOpt = switch (parseIntField(json, "id")) {
      case (?n) { ?Int.abs(n) };
      case null { null };
    };
    let userIdText = switch (parseStringField(json, "userId")) {
      case (?t) { t };
      case null { return false };
    };
    let title = switch (parseStringField(json, "title")) {
      case (?t) { t };
      case null { return false };
    };
    let description = switch (parseStringField(json, "description")) {
      case (?t) { t };
      case null { "" };
    };
    let price       = parseStringField(json, "price");
    let category    = parseStringField(json, "category");
    let sourceUrl   = parseStringField(json, "sourceUrl");

    let statusStr = switch (parseStringField(json, "status")) {
      case (?s) { s };
      case null { "active" };
    };
    let status : ListingTypes.ListingStatus = if (statusStr == "archived") #archived else #active;

    let pinned   = parseBoolField(json, "pinned");
    let favorited = parseBoolField(json, "favorited");
    let archivedManually = parseBoolField(json, "archivedManually");

    let createdAt = switch (parseIntField(json, "createdAt")) {
      case (?n) { n };
      case null { nowNs };
    };
    let expirationDate = switch (parseIntField(json, "expirationDate")) {
      case (?n) { n };
      case null { nowNs };
    };
    let archivedAt : ?Common.Timestamp = switch (parseIntField(json, "archivedAt")) {
      case (?n) { if (n == 0) null else ?n };
      case null { null };
    };
    let tierLevel = switch (parseIntField(json, "tierLevel")) {
      case (?n) { Int.abs(n) };
      case null { 1 };
    };

    let userId = Principal.fromText(userIdText);

    switch (idOpt) {
      case (?id) {
        let listing : ListingTypes.Listing = {
          id;
          userId;
          title;
          description;
          price;
          sourceUrl;
          createdAt;
          status;
          expirationDate;
          tierLevel;
          category;
          archivedAt;
          archivedManually;
          restoredAt = ?nowNs;
          pinned;
          favorited;
          pinnedAt = null;
        };
        // Only upsert — never delete listings added after backup
        listings.add(id, listing);
        if (id >= listingCounter.value) {
          listingCounter.value := id + 1;
        };
        true
      };
      case null {
        // No ID in backup — create as new listing
        let newId = listingCounter.value;
        listingCounter.value += 1;
        listings.add(newId, {
          id          = newId;
          userId;
          title;
          description;
          price;
          sourceUrl;
          createdAt;
          status;
          expirationDate;
          tierLevel;
          category;
          archivedAt;
          archivedManually;
          restoredAt  = ?nowNs;
          pinned;
          favorited;
          pinnedAt    = null;
        });
        true
      };
    }
  };

  /// Parse a user profile JSON object and upsert it into the profiles map.
  func restoreProfileFromJson(
    profiles      : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
    usernameIndex : Map.Map<Text, Common.UserId>,
    json          : Text,
    nowNs         : Common.Timestamp,
  ) : Bool {
    let userIdText = switch (parseStringField(json, "userId")) {
      case (?t) { t };
      case null { return false };
    };
    let username = switch (parseStringField(json, "username")) {
      case (?t) { t };
      case null { return false };
    };
    let email = switch (parseStringField(json, "email")) {
      case (?t) { t };
      case null { "" };
    };
    let role = switch (parseStringField(json, "role")) {
      case (?t) { t };
      case null { "user" };
    };
    let emailVerified = parseBoolField(json, "emailVerified");
    let createdAt = switch (parseIntField(json, "createdAt")) {
      case (?n) { n };
      case null { nowNs };
    };
    // Stripe customer ID — do NOT overwrite with a blank if it wasn't in backup
    let stripeCustomerId = parseStringField(json, "stripeCustomerId");

    let userId = Principal.fromText(userIdText);

    let existing = profiles.get(userId);
    let profile : ProfileTypes.UserProfile = switch (existing) {
      case (?p) {
        // Keep live Stripe key and FB tokens — never overwrite from backup
        {
          p with
          username      = username;
          email         = email;
          role          = role;
          emailVerified = emailVerified;
        }
      };
      case null {
        {
          userId;
          username;
          displayName    = null;
          email;
          phoneNumber    = null;
          emailVerified;
          role;
          createdAt;
          updatedAt      = nowNs;
          fbAppId        = null;
          fbAccessToken  = null;
          fbWebhookToken = null;
          stripeCustomerId;
        }
      };
    };
    profiles.add(userId, profile);
    usernameIndex.add(username.toLower(), userId);
    true
  };

  /// Restore site settings from the backup JSON.
  func restoreSiteSettingsFromJson(
    siteSettings : { var current : ?AdminTypes.SiteSettings },
    json         : Text,
    nowNs        : Common.Timestamp,
  ) {
    let appName = switch (parseStringField(json, "appName")) {
      case (?t) { t };
      case null { return };
    };
    let primaryColor = switch (parseStringField(json, "primaryColor")) {
      case (?t) { t };
      case null { "#0088ff" };
    };
    let accentColor = switch (parseStringField(json, "accentColor")) {
      case (?t) { t };
      case null { "#ffcc00" };
    };
    let allowedOrigins = switch (parseStringField(json, "allowedOrigins")) {
      case (?t) { t };
      case null { "*" };
    };
    let uploadEnabled             = parseBoolField(json, "uploadEnabled");
    let copyButtonsEnabled        = parseBoolField(json, "copyButtonsEnabled");
    let contentModerationEnabled  = parseBoolField(json, "contentModerationEnabled");

    let maxRequestsPerMinute = switch (parseIntField(json, "maxRequestsPerMinute")) {
      case (?n) { Int.abs(n) };
      case null { 60 };
    };
    let maxUploadsPerHour = switch (parseIntField(json, "maxUploadsPerHour")) {
      case (?n) { Int.abs(n) };
      case null { 20 };
    };
    let maxSessionDurationMinutes = switch (parseIntField(json, "maxSessionDurationMinutes")) {
      case (?n) { Int.abs(n) };
      case null { 60 };
    };
    let maxConcurrentSessions = switch (parseIntField(json, "maxConcurrentSessions")) {
      case (?n) { Int.abs(n) };
      case null { 5 };
    };
    let createdAt = switch (parseIntField(json, "createdAt")) {
      case (?n) { n };
      case null { nowNs };
    };

    siteSettings.current := ?{
      appName;
      primaryColor;
      accentColor;
      uploadEnabled;
      copyButtonsEnabled;
      contentModerationEnabled;
      maxRequestsPerMinute;
      maxUploadsPerHour;
      maxSessionDurationMinutes;
      maxConcurrentSessions;
      allowedOrigins;
      createdAt;
      updatedAt = nowNs;
    };
  };

  /// Restore all state from a VersionBackup.
  /// - Upserts users and listings that exist in the backup.
  /// - Does NOT delete users/listings created after the backup.
  /// - Does NOT overwrite Stripe keys or FB credentials.
  /// Returns RestoreResult with counts.
  public func restoreFromVersionBackup(
    versionBackups : List.List<BackupTypes.VersionBackup>,
    backupId       : Text,
    profiles       : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
    usernameIndex  : Map.Map<Text, Common.UserId>,
    listings       : Map.Map<Common.ListingId, ListingTypes.Listing>,
    listingCounter : { var value : Nat },
    subscriptions  : Map.Map<Common.UserId, TierTypes.UserTierSubscription>,
    notifications  : Map.Map<Common.UserId, List.List<NotifTypes.InAppNotification>>,
    siteSettings   : { var current : ?AdminTypes.SiteSettings },
    appVersions    : List.List<AdminTypes.AppVersion>,
    isManual       : Bool,
    createdBy      : Text,
    nowNs          : Common.Timestamp,
  ) : BackupTypes.RestoreResult {
    // Find the requested backup
    let backupOpt = versionBackups.find(func(b : BackupTypes.VersionBackup) : Bool {
      b.id == backupId
    });
    switch (backupOpt) {
      case null {
        {
          success          = false;
          usersRestored    = 0;
          listingsRestored = 0;
          preSaveBackupId  = "";
          errorMessage     = ?("Backup not found: " # backupId);
        }
      };
      case (?backup) {
        // Step 1: auto-create a backup of current state before restoring
        let preSave = createVersionSnapshot(
          versionBackups,
          profiles,
          listings,
          subscriptions,
          notifications,
          siteSettings,
          appVersions,
          "version-snapshot-auto",
          "auto-pre-restore",
          ?("Auto-save before restore " # backupId),
          nowNs,
        );

        let json = backup.backupData;

        // Step 2: restore users
        var usersRestored = 0;
        let userJsons = extractJsonArray(json, "users");
        for (userJson in userJsons.values()) {
          if (restoreProfileFromJson(profiles, usernameIndex, userJson, nowNs)) {
            usersRestored += 1;
          };
        };

        // Step 3: restore listings
        var listingsRestored = 0;
        let listingJsons = extractJsonArray(json, "listings");
        for (listingJson in listingJsons.values()) {
          if (restoreListingFromJson(listings, listingCounter, listingJson, nowNs)) {
            listingsRestored += 1;
          };
        };

        // Step 4: restore app config (non-payment fields only)
        let configMarker = "\"appConfig\":";
        let configParts = json.split(#text configMarker);
        ignore configParts.next();
        switch (configParts.next()) {
          case (?cfgJson) {
            if (not cfgJson.startsWith(#text "null")) {
              restoreSiteSettingsFromJson(siteSettings, cfgJson, nowNs);
            };
          };
          case null {};
        };

        {
          success          = true;
          usersRestored;
          listingsRestored;
          preSaveBackupId  = preSave.id;
          errorMessage     = null;
        }
      };
    }
  };
};

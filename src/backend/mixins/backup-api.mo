import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Blob "mo:core/Blob";
import Text "mo:core/Text";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import BackupTypes "../types/backup";
import ListingTypes "../types/listings";
import TierTypes "../types/tiers";
import PaymentTypes "../types/payments";
import ProfileTypes "../types/userprofile";
import NotifTypes "../types/notifications";
import AdminTypes "../types/admin";
import BackupLib "../lib/backup";
import PaymentsLib "../lib/payments";
import AppConfigTypes "../types/app-config";

mixin (
  accessControlState : AccessControl.AccessControlState,
  backups            : Map.Map<Nat, BackupTypes.BackupRecord>,
  backupCounter      : { var value : Nat },
  backupHistory      : List.List<BackupTypes.BackupHistoryRecord>,
  listings           : Map.Map<Common.ListingId, ListingTypes.Listing>,
  listingCounter     : { var value : Nat },
  subscriptions      : Map.Map<Common.UserId, TierTypes.UserTierSubscription>,
  payments           : Map.Map<Nat, PaymentTypes.PaymentRecord>,
  paymentCounter     : { var value : Nat },
  profiles           : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
  usernameIndex      : Map.Map<Text, Common.UserId>,
  notifications      : Map.Map<Common.UserId, List.List<NotifTypes.InAppNotification>>,
  siteSettings       : { var current : ?AdminTypes.SiteSettings },
  appVersions        : List.List<AdminTypes.AppVersion>,
  versionBackups     : List.List<BackupTypes.VersionBackup>,
  appConfig          : Map.Map<Text, AppConfigTypes.ConfigEntry>,
  lastAutoSnapshotTime : { var value : Int },
) {
  /// Price for a paid Smart Backup export ($29.99).
  let SMART_BACKUP_PRICE_USD : Float = 29.99;
  // Smart Backup uses tierId=0 to distinguish it from tier upgrades in the payments table
  let BACKUP_TIER_ID : Nat = 0;

  // Management canister reference factory — instantiated locally per call to avoid
  // stable type compatibility issues on upgrade (actor refs at mixin scope are stable state).
  type IcHttpArg = {
    url              : Text;
    max_response_bytes : ?Nat64;
    method           : { #get; #head; #post };
    headers          : [{ name : Text; value : Text }];
    body             : ?Blob;
    is_replicated    : ?Bool;
    transform        : ?{
      function : shared query ({
        response : {
          status  : Nat;
          headers : [{ name : Text; value : Text }];
          body    : Blob;
        };
        context : Blob;
      }) -> async {
        status  : Nat;
        headers : [{ name : Text; value : Text }];
        body    : Blob;
      };
      context : Blob;
    };
  };
  type IcHttpResp = {
    status  : Nat;
    headers : [{ name : Text; value : Text }];
    body    : Blob;
  };

  func icManagementBackup() : actor { http_request : IcHttpArg -> async IcHttpResp } {
    actor "aaaaa-aa"
  };

  func backupGetConfig(key : Text) : Text {
    switch (appConfig.get(key)) {
      case (?entry) { entry.value };
      case null { "" };
    };
  };

  func activeStripeSecretKeyForBackup() : Text {
    backupGetConfig("stripe_secret_key")
  };

  /// Return the STRIPE_PRICE_BACKUP price ID from admin config.
  func backupPriceId() : ?Text {
    let v = backupGetConfig("stripe_price_backup");
    if (v == "") { null } else { ?v };
  };

  func parseJsonStringFieldForBackup(json : Text, field : Text) : ?Text {
    let marker = "\"" # field # "\":\"";
    let parts = json.split(#text marker);
    ignore parts.next();
    switch (parts.next()) {
      case null { null };
      case (?afterMarker) {
        let valueParts = afterMarker.split(#char '\"');
        valueParts.next();
      };
    };
  };

  /// Transform for Stripe payment intent (backup module) — strips all non-deterministic fields.
  /// Keeps only: id, client_secret, status. Headers are always stripped.
  public query func transformStripeBackupPaymentIntentResponse(raw : {
    response : {
      status  : Nat;
      headers : [{ name : Text; value : Text }];
      body    : Blob;
    };
    context : Blob;
  }) : async {
    status  : Nat;
    headers : [{ name : Text; value : Text }];
    body    : Blob;
  } {
    let stableBody : Blob = switch (raw.response.body.decodeUtf8()) {
      case null { "{}".encodeUtf8() };
      case (?bodyText) {
        let clientSecret = switch (parseJsonStringFieldForBackup(bodyText, "client_secret")) {
          case (?v) v;
          case null "";
        };
        let id = switch (parseJsonStringFieldForBackup(bodyText, "id")) {
          case (?v) v;
          case null "";
        };
        let status = switch (parseJsonStringFieldForBackup(bodyText, "status")) {
          case (?v) v;
          case null "";
        };
        let stableJson = "{\"id\":\"" # id # "\",\"client_secret\":\"" # clientSecret # "\",\"status\":\"" # status # "\"}";
        stableJson.encodeUtf8()
      };
    };
    {
      status  = raw.response.status;
      headers = [];
      body    = stableBody;
    }
  };

  func createStripePaymentIntentForBackup(amountCents : Nat, paymentRecordId : Nat) : async ?Text {
    let body = "amount=" # debug_show(amountCents)
      # "&currency=usd"
      # "&metadata[paymentRecordId]=" # debug_show(paymentRecordId)
      # "&automatic_payment_methods[enabled]=true";
    try {
      // Cycles: 49_140_000_000 for Stripe POST calls (required by ICP for outbound POST).
      // is_replicated = ?false: only one replica makes the call — bypasses ICP consensus for non-deterministic Stripe responses.
      let response = await (with cycles = 49_140_000_000) icManagementBackup().http_request({
        url    = "https://api.stripe.com/v1/payment_intents";
        method = #post;
        body   = ?body.encodeUtf8();
        headers = [
          { name = "Authorization"; value = "Bearer " # activeStripeSecretKeyForBackup() },
          { name = "Content-Type";  value = "application/x-www-form-urlencoded" },
          { name = "Stripe-Version"; value = "2023-10-16" },
        ];
        max_response_bytes = ?10_000;
        is_replicated      = ?false;
        transform = ?{
          function = transformStripeBackupPaymentIntentResponse;
          context  = Blob.fromArray([]);
        };
      });
      if (response.status >= 200 and response.status < 300) {
        switch (response.body.decodeUtf8()) {
          case (?text) { parseJsonStringFieldForBackup(text, "client_secret") };
          case null    { null };
        };
      } else { null };
    } catch (_) { null };
  };

  /// Initiate a $29.99 Smart Backup export payment.
  /// Creates a pending payment record and returns a Stripe client_secret.
  public shared ({ caller }) func initiateSmartBackup() : async {
    paymentRecordId  : Nat;
    amountUSD        : Float;
    stripeClientSecret : ?Text;
    backupPriceId    : ?Text;
  } {
    let now = Time.now();
    let record = PaymentsLib.createPaymentRecord(
      payments,
      paymentCounter,
      caller,
      BACKUP_TIER_ID,
      SMART_BACKUP_PRICE_USD,
      #stripe,
      null,
      null,
      now,
    );
    let amountCents = (SMART_BACKUP_PRICE_USD * 100.0).toInt().toNat();
    let stripeClientSecret = await createStripePaymentIntentForBackup(amountCents, record.id);
    {
      paymentRecordId  = record.id;
      amountUSD        = SMART_BACKUP_PRICE_USD;
      stripeClientSecret;
      backupPriceId    = backupPriceId();
    };
  };

  /// Confirm Smart Backup payment and record the export in backup history.
  /// The frontend generates the ZIP file after this confirmation.
  public shared ({ caller }) func confirmSmartBackupPayment(
    paymentRecordId      : Nat,
    stripePaymentIntentId : Text,
    listingCount         : Nat,
    imageCount           : Nat,
  ) : async { #ok : BackupTypes.BackupHistoryRecord; #err : Text } {
    switch (payments.get(paymentRecordId)) {
      case null { return #err("Payment record not found") };
      case (?record) {
        if (not Principal.equal(record.userId, caller)) {
          return #err("Unauthorized");
        };
        payments.add(paymentRecordId, {
          record with
          status                = #completed;
          stripePaymentIntentId = ?stripePaymentIntentId;
        });
        let now = Time.now();
        let historyRecord = BackupLib.recordBackupExport(
          backupHistory,
          caller,
          listingCount,
          imageCount,
          stripePaymentIntentId,
          now,
        );
        #ok(historyRecord);
      };
    };
  };

  /// Return the backup export history for the authenticated caller.
  public query ({ caller }) func getBackupHistory() : async [BackupTypes.BackupHistoryRecord] {
    BackupLib.getUserBackupHistory(backupHistory, caller);
  };

  /// Check if a download token is still valid (within 7 days of export).
  /// Returns the matching record if valid, null otherwise.
  public query ({ caller }) func getBackupDownloadInfo(
    token : Text,
  ) : async ?BackupTypes.BackupHistoryRecord {
    let now = Time.now();
    let recordOpt = BackupLib.findValidDownloadRecord(backupHistory, token, now);
    switch (recordOpt) {
      case null { null };
      case (?record) {
        // Only the owning user may retrieve their download info
        if (not Principal.equal(record.userId, caller)) { null }
        else { ?record };
      };
    };
  };

  /// Return all listing data for the caller as a backup-friendly snapshot array.
  /// No payment required — the caller proves ownership via Internet Identity.
  public query ({ caller }) func generateBackupData() : async [BackupTypes.ListingSnapshot] {
    BackupLib.generateBackupData(listings, caller);
  };

  /// Return full listing entries for ZIP export (includes image references).
  /// imageMap: array of (listingId, imageUrls) pairs provided by the frontend.
  public shared ({ caller }) func generateFullBackupEntries(
    imageUrlPairs : [(Nat, [Text])],
  ) : async [BackupTypes.BackupListingEntry] {
    // Build a temporary map from the supplied pairs
    let imageMap = Map.empty<Common.ListingId, [Text]>();
    for ((lid, urls) in imageUrlPairs.values()) {
      imageMap.add(lid, urls);
    };
    BackupLib.generateFullBackupEntries(listings, caller, imageMap);
  };

  /// Store a backup record after the frontend has packaged and uploaded the file.
  public shared ({ caller }) func createBackupRecord(fileSize : Nat) : async BackupTypes.BackupRecord {
    let now = Time.now();
    BackupLib.createBackupRecord(backups, backupCounter, caller, fileSize, now);
  };

  /// Return all backup records for the authenticated caller.
  public query ({ caller }) func getMyBackups() : async [BackupTypes.BackupRecord] {
    BackupLib.listUserBackups(backups, caller);
  };

  /// Delete a backup record owned by the caller.
  public shared ({ caller }) func deleteBackupRecord(backupId : Nat) : async { #ok; #err : Text } {
    BackupLib.deleteBackupRecord(backups, backupId, caller);
  };

  /// Restore listings from a legacy JSON backup payload.
  /// Requires an active subscription; creates fresh active listings for each snapshot.
  public shared ({ caller }) func restoreFromBackup(
    snapshots : [BackupTypes.ListingSnapshot]
  ) : async { #ok : Nat; #err : Text } {
    let now = Time.now();
    // Subscription check — caller must have an active subscription
    let expirationDate : Common.Timestamp = switch (subscriptions.get(caller)) {
      case null { return #err("No active subscription. Please renew to restore listings.") };
      case (?sub) {
        if (sub.expirationDate <= now) {
          return #err("Subscription expired. Please renew to restore listings.");
        };
        sub.expirationDate;
      };
    };
    let count = BackupLib.restoreFromBackup(
      listings,
      listingCounter,
      caller,
      snapshots,
      expirationDate,
      now,
    );
    #ok(count);
  };

  /// Restore listings from a ZIP backup (frontend parses the ZIP, sends entries here).
  /// Requires an active subscription.
  public shared ({ caller }) func restoreFromZipBackup(
    entries : [BackupTypes.BackupListingEntry],
  ) : async BackupTypes.ZipRestoreResult {
    let now = Time.now();
    let expirationDate : Common.Timestamp = switch (subscriptions.get(caller)) {
      case null {
        return {
          success          = false;
          listingsRestored = 0;
          errorMessage     = ?"No active subscription. Please renew to restore listings.";
        };
      };
      case (?sub) {
        if (sub.expirationDate <= now) {
          return {
            success          = false;
            listingsRestored = 0;
            errorMessage     = ?"Subscription expired. Please renew to restore listings.";
          };
        };
        sub.expirationDate;
      };
    };
    let count = BackupLib.restoreFromZipBackup(
      listings,
      listingCounter,
      caller,
      entries,
      expirationDate,
      now,
    );
    {
      success          = true;
      listingsRestored = count;
      errorMessage     = null;
    };
  };

  // ── Version Backup endpoints (admin full-data snapshots) ───────────────────

  /// List only version-snapshot backups (backupType starts with "version-snapshot").
  /// Admin-only.
  public query ({ caller }) func getVersionSnapshotList() : async [BackupTypes.VersionBackupSummary] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: admin only");
    };
    let all = BackupLib.listVersionBackupSummaries(versionBackups);
    all.values()
      .filter(func(s : BackupTypes.VersionBackupSummary) : Bool {
        s.backupType.startsWith(#text "version-snapshot")
      })
      .toArray()
  };

  /// Preview what will be restored from a backup WITHOUT applying it.
  public query ({ caller }) func previewVersionRestoreSnapshot(
    backupId : Text,
  ) : async ?{
    userCount         : Nat;
    listingCount      : Nat;
    snapshotCreatedAt : Common.Timestamp;
    createdBy         : Text;
    notes             : ?Text;
    isManualBackup    : Bool;
  } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return null;
    };
    switch (versionBackups.find(func(b : BackupTypes.VersionBackup) : Bool { b.id == backupId })) {
      case null { null };
      case (?b) {
        ?{
          userCount         = BackupLib.countUsersInBackup(b.backupData);
          listingCount      = BackupLib.countListingsInBackup(b.backupData);
          snapshotCreatedAt = b.createdAt;
          createdBy         = b.createdBy;
          notes             = b.notes;
          isManualBackup    = b.backupType == "version-snapshot-manual"
                              or b.backupType == "version-snapshot-manual-locked";
        }
      };
    };
  };

  /// Validate a backup's JSON is not corrupted and can be restored.
  public shared ({ caller }) func validateBackupIntegrity(backupId : Text) : async {
    valid        : Bool;
    userCount    : Nat;
    listingCount : Nat;
    error        : ?Text;
  } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return { valid = false; userCount = 0; listingCount = 0; error = ?"Unauthorized" };
    };
    switch (versionBackups.find(func(b : BackupTypes.VersionBackup) : Bool { b.id == backupId })) {
      case null { { valid = false; userCount = 0; listingCount = 0; error = ?"Backup not found" } };
      case (?b) {
        let hasUsers    = b.backupData.contains(#text "\"users\"");
        let hasListings = b.backupData.contains(#text "\"listings\"");
        if (hasUsers and hasListings) {
          { valid = true; userCount = BackupLib.countUsersInBackup(b.backupData); listingCount = BackupLib.countListingsInBackup(b.backupData); error = null }
        } else {
          { valid = false; userCount = 0; listingCount = 0; error = ?"JSON missing users or listings" }
        }
      };
    };
  };

  /// Admin: lock a backup permanently (cannot be deleted or modified).
  public shared ({ caller }) func adminLockBackupPermanent(backupId : Text) : async { #ok; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return #err("Unauthorized: admin only");
    };
    var found = false;
    versionBackups.mapInPlace(func(b : BackupTypes.VersionBackup) : BackupTypes.VersionBackup {
      if (b.id == backupId
          and (b.backupType == "version-snapshot-manual"
               or b.backupType == "version-snapshot-auto")) {
        found := true;
        { b with isStable = true; backupType = "version-snapshot-manual-locked" }
      } else { b }
    });
    if (found) { #ok } else { #err("Backup not found or already locked") }
  };

  /// Create a version snapshot with adaptive frequency control.
  /// Checks lastAutoSnapshotTime against user count thresholds.
  /// Safe to call on a timer — silently skips if not yet due.
  public shared ({ caller }) func createAdaptiveVersionSnapshot() : async ?BackupTypes.VersionBackup {
    let now = Time.now();
    let userCount = profiles.size();

    // Determine interval in nanoseconds based on user count
    let HOUR_NS : Int = 3_600_000_000_000;
    let intervalNs : Int = if (userCount > 200) {
      HOUR_NS          // 200+ users: every hour
    } else if (userCount > 50) {
      6 * HOUR_NS      // 51-200 users: every 6 hours
    } else if (userCount > 10) {
      12 * HOUR_NS     // 11-50 users: every 12 hours
    } else {
      24 * HOUR_NS     // 0-10 users: daily
    };

    // Skip if not enough time has passed since last auto snapshot
    if (now - lastAutoSnapshotTime.value < intervalNs) {
      return null;
    };

    lastAutoSnapshotTime.value := now;

    let backup = BackupLib.createVersionSnapshot(
      versionBackups,
      profiles,
      listings,
      subscriptions,
      notifications,
      siteSettings,
      appVersions,
      "version-snapshot-auto",
      "auto-adaptive",
      ?("Adaptive auto snapshot — " # userCount.toText() # " users"),
      now,
    );
    ?backup
  };

  /// Create a version backup.
  /// isManual=true → manual (never auto-deleted); isManual=false → auto (capped at 50).
  /// Admin-only for manual; system can call with isManual=false for auto.
  public shared ({ caller }) func createVersionBackup(
    isManual : Bool,
    notes    : ?Text,
  ) : async { #ok : BackupTypes.VersionBackup; #err : Text } {
    let now = Time.now();
    // Only admins may create manual backups; auto backups are triggered by internal logic
    if (isManual) {
      if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
        return #err("Unauthorized: admin only");
      };
    };
    let createdBy = if (isManual) caller.toText() else "auto";
    let snapshotType = if (isManual) "version-snapshot-manual" else "version-snapshot-auto";
    let backup = BackupLib.createVersionSnapshot(
      versionBackups,
      profiles,
      listings,
      subscriptions,
      notifications,
      siteSettings,
      appVersions,
      snapshotType,
      createdBy,
      notes,
      now,
    );
    #ok(backup)
  };

  /// List all version backups as summaries (no raw JSON blob).
  public query ({ caller }) func listVersionBackups() : async [BackupTypes.VersionBackupSummary] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: admin only");
    };
    BackupLib.listVersionBackupSummaries(versionBackups)
  };

  /// Admin: export the full JSON blob for a specific version backup.
  /// Returns null if the backup ID is not found.
  /// The returned text is the complete JSON snapshot of all data
  /// at the time the backup was created.
  public query ({ caller }) func exportVersionBackupAsJson(
    backupId : Text,
  ) : async ?Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: admin only");
    };
    switch (versionBackups.find(func(b : BackupTypes.VersionBackup) : Bool {
      b.id == backupId
    })) {
      case null { null };
      case (?b) { ?b.backupData };
    };
  };

  /// Admin: restore the full canister state from a JSON blob
  /// that was previously exported via exportVersionBackupAsJson.
  /// Automatically creates a pre-restore snapshot before applying.
  /// Never deletes records created after the backup.
  public shared ({ caller }) func restoreFromJsonBlob(
    jsonBlob : Text,
  ) : async BackupTypes.RestoreResult {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return {
        success          = false;
        usersRestored    = 0;
        listingsRestored = 0;
        preSaveBackupId  = "";
        errorMessage     = ?"Unauthorized: admin only";
      };
    };
    let now = Time.now();
    // Delegate to the existing backup lib restore logic,
    // passing the raw JSON blob directly.
    BackupLib.restoreFromJsonBlob(
      versionBackups,
      jsonBlob,
      profiles,
      usernameIndex,
      listings,
      listingCounter,
      subscriptions,
      notifications,
      siteSettings,
      appVersions,
      false,
      caller.toText(),
      now,
    )
  };

  /// Restore all data from a version backup.
  /// Step 0: creates a pre-restore safety snapshot before applying the restore.
  /// Steps 1-5: restore users, listings, site settings from backup JSON.
  /// Never deletes post-backup records. Never overwrites Stripe/webhook credentials.
  public shared ({ caller }) func restoreFromVersionBackup(
    backupId : Text,
  ) : async BackupTypes.RestoreResult {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return {
        success          = false;
        usersRestored    = 0;
        listingsRestored = 0;
        preSaveBackupId  = "";
        errorMessage     = ?"Unauthorized: admin only";
      };
    };
    let now = Time.now();

    // STEP 0: Create a pre-restore safety snapshot so we can roll back if needed
    let preSnapshot = BackupLib.createVersionSnapshot(
      versionBackups, profiles, listings, subscriptions, notifications,
      siteSettings, appVersions, "version-snapshot-pre-restore",
      caller.toText(),
      ?("PRE-RESTORE SAFETY SNAPSHOT — Rolling back to backup: " # backupId),
      now,
    );

    // STEP 1: Validate the target backup exists
    let targetExists = versionBackups.find(func(b : BackupTypes.VersionBackup) : Bool {
      b.id == backupId
    });
    switch (targetExists) {
      case null {
        return {
          success          = false;
          usersRestored    = 0;
          listingsRestored = 0;
          preSaveBackupId  = preSnapshot.id;
          errorMessage     = ?"Target backup not found";
        };
      };
      case (?_) {};
    };

    // STEP 2: Execute the actual restore and attach the pre-restore snapshot ID
    let result = BackupLib.restoreFromVersionBackup(
      versionBackups,
      backupId,
      profiles,
      usernameIndex,
      listings,
      listingCounter,
      subscriptions,
      notifications,
      siteSettings,
      appVersions,
      false,
      caller.toText(),
      now,
    );
    { result with preSaveBackupId = preSnapshot.id }
  };

  /// Admin: mark a backup as the stable/known-good version.
  public shared ({ caller }) func markBackupAsStable(backupId : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return false;
    };
    var found = false;
    versionBackups.mapInPlace(func(b : BackupTypes.VersionBackup) : BackupTypes.VersionBackup {
      if (b.id == backupId) {
        found := true;
        { b with isStable = true }
      } else { b }
    });
    found
  };

  /// Admin: delete an auto backup (only if it is not marked stable, manual, or locked).
  /// Manual backups, locked backups, and stable backups cannot be deleted.
  public shared ({ caller }) func deleteBackup(backupId : Text) : async { #ok; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return #err("Unauthorized: admin only");
    };
    let target = versionBackups.find(func(b : BackupTypes.VersionBackup) : Bool {
      b.id == backupId
    });
    switch (target) {
      case null { #err("Backup not found") };
      case (?b) {
        if (b.backupType == "version-snapshot-manual"
            or b.backupType == "version-snapshot-manual-locked"
            or b.isStable) {
          return #err("Cannot delete: Manual/locked/stable backups are protected. Use adminLockBackupPermanent to manage protection.");
        };
        if (b.backupType.startsWith(#text "version-snapshot-auto")
            or b.backupType == "version-snapshot-pre-restore") {
          let keep = versionBackups.filter(func(x : BackupTypes.VersionBackup) : Bool {
            x.id != backupId
          });
          versionBackups.clear();
          versionBackups.append(keep);
          #ok
        } else {
          #err("Cannot delete: Unknown backup type")
        }
      };
    }
  };

  /// Export a single user's data as JSON plus their image storage URLs.
  /// Admin-only.
  public query ({ caller }) func exportUserData(
    userId : Text,
  ) : async ?{ jsonData : Text; imageUrls : [Text] } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: admin only");
    };
    let uid = Principal.fromText(userId);
    switch (profiles.get(uid)) {
      case null { null };
      case (?_) {
        let userListings = listings.values()
          .filter(func(l : ListingTypes.Listing) : Bool { Principal.equal(l.userId, uid) })
          .toArray();
        let imageUrls : [Text] = []; // image URLs come from object storage, not inline
        let listingJsons = userListings.values()
          .map(func(l : ListingTypes.Listing) : Text {
            "{\"id\":" # l.id.toText()
            # ",\"title\":\"" # l.title # "\""
            # ",\"description\":\"" # l.description # "\""
            # "}"
          })
          .toArray();
        let jsonData = "{\"userId\":\"" # userId # "\""
          # ",\"listings\":[" # listingJsons.values().join(",") # "]"
          # "}";
        ?{ jsonData; imageUrls }
      };
    }
  };

  /// Export all users' data as JSON plus all image storage URLs.
  /// Admin-only.
  public query ({ caller }) func exportAllUsersData() : async { jsonData : Text; imageUrls : [Text] } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: admin only");
    };
    let userJsons = profiles.values()
      .map(func(p : ProfileTypes.UserProfile) : Text {
        "{\"userId\":\"" # p.userId.toText() # "\""
        # ",\"username\":\"" # p.username # "\""
        # ",\"email\":\"" # p.email # "\""
        # "}"
      })
      .toArray();
    let imageUrls : [Text] = [];
    let jsonData = "{\"users\":[" # userJsons.values().join(",") # "]}";
    { jsonData; imageUrls }
  };
};

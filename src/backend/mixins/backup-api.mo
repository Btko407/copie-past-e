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
) {
  /// Price for a paid Smart Backup export ($29.99).
  let SMART_BACKUP_PRICE_USD : Float = 29.99;
  // Smart Backup uses tierId=0 to distinguish it from tier upgrades in the payments table
  let BACKUP_TIER_ID : Nat = 0;

  let IC_MANAGEMENT_BACKUP : actor {
    http_request : ({
      url              : Text;
      max_response_bytes : ?Nat64;
      method           : { #get; #head; #post };
      headers          : [{ name : Text; value : Text }];
      body             : ?Blob;
      is_replicated    : ?Bool;
    }) -> async {
      status  : Nat;
      headers : [{ name : Text; value : Text }];
      body    : Blob;
    };
  } = actor "aaaaa-aa";

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

  func createStripePaymentIntentForBackup(amountCents : Nat, paymentRecordId : Nat) : async ?Text {
    let body = "amount=" # debug_show(amountCents)
      # "&currency=usd"
      # "&metadata[paymentRecordId]=" # debug_show(paymentRecordId)
      # "&automatic_payment_methods[enabled]=true";
    try {
      let response = await IC_MANAGEMENT_BACKUP.http_request({
        url    = "https://api.stripe.com/v1/payment_intents";
        method = #post;
        body   = ?body.encodeUtf8();
        headers = [
          { name = "Authorization"; value = "Bearer " # activeStripeSecretKeyForBackup() },
          { name = "Content-Type";  value = "application/x-www-form-urlencoded" },
          { name = "Stripe-Version"; value = "2023-10-16" },
        ];
        max_response_bytes = ?10_000;
        is_replicated      = null;
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
    let backup = BackupLib.createVersionBackup(
      versionBackups,
      profiles,
      listings,
      subscriptions,
      notifications,
      siteSettings,
      appVersions,
      isManual,
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

  /// Restore all data from a version backup.
  /// Automatically saves current state before restoring.
  /// Step 0: auto-backup current state. If fails, abort.
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
    BackupLib.restoreFromVersionBackup(
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
    )
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

  /// Admin: delete an auto backup (only if it is not marked stable).
  /// Manual backups and stable backups cannot be deleted this way.
  public shared ({ caller }) func deleteBackup(backupId : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return false;
    };
    let target = versionBackups.find(func(b : BackupTypes.VersionBackup) : Bool {
      b.id == backupId
    });
    switch (target) {
      case null { false };
      case (?b) {
        if (b.backupType == "manual" or b.isStable) {
          false // refuse to delete manual or stable backups
        } else {
          let keep = versionBackups.filter(func(x : BackupTypes.VersionBackup) : Bool {
            x.id != backupId
          });
          versionBackups.clear();
          versionBackups.append(keep);
          true
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

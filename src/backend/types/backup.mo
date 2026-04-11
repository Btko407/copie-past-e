import Common "common";

module {
  public type BackupStatus = {
    #pending;
    #complete;
    #failed;
  };

  public type BackupRecord = {
    id : Nat;
    userId : Common.UserId;
    createdAt : Common.Timestamp;
    fileSize : Nat;
    status : BackupStatus;
    downloadUrl : Text;
  };

  /// Lightweight snapshot of a single listing, used in backup/restore payloads.
  /// Intentionally omits internal IDs and timestamps — those are regenerated on restore.
  public type ListingSnapshot = {
    title : Text;
    description : Text;
    price : ?Text;
    category : ?Text;
    pinned : Bool;
    favorited : Bool;
  };

  /// Full listing entry for ZIP backup export — includes all fields + image metadata.
  public type BackupImageEntry = {
    filename : Text;      // e.g. "images/listing-42-0.jpg"
    originalUrl : Text;   // original storage URL
  };

  public type BackupListingEntry = {
    id : Nat;
    title : Text;
    description : Text;
    price : ?Text;
    category : ?Text;
    subcategory : ?Text;
    condition : ?Text;
    brand : ?Text;
    typeModel : ?Text;
    sourceUrl : ?Text;
    createdAt : Common.Timestamp;
    archivedAt : ?Common.Timestamp;
    pinned : Bool;
    favorited : Bool;
    images : [BackupImageEntry];
  };

  /// History record for a paid export backup — stored per user for 7-day re-download.
  public type BackupHistoryRecord = {
    id : Text;                        // UUID-style token used as the record key
    userId : Common.UserId;
    exportedAt : Common.Timestamp;
    listingCount : Nat;
    imageCount : Nat;
    paymentIntentId : Text;
    downloadToken : Text;             // same as id, used in re-download URL
    downloadExpiresAt : Common.Timestamp; // exportedAt + 7 days in nanoseconds
  };

  // ── Version Backup (full data snapshot for admin auto/manual backups) ───────

  /// Full-data backup record stored in canister state.
  /// backupData is a JSON blob containing all users, listings, notifications,
  /// subscription history, and app config captured at backup time.
  /// New fields (backupData, isStable) have defaults: "" and false for backward compat.
  public type VersionBackup = {
    id : Text;
    versionLabel : Text;
    createdAt : Common.Timestamp;
    createdBy : Text;         // "auto" or admin principal text
    backupData : Text;        // JSON blob (full snapshot; default "" for old records)
    backupType : Text;        // "auto" | "manual" | "pre-deploy-auto" | "pre-restore-auto" | "scheduled" | "admin-action"
    notes : ?Text;
    isStable : Bool;          // admin-marked stable version; default false
  };

  /// Summary record returned to callers — avoids sending the full JSON blob over the wire.
  /// New fields (sizeKb, isStable) have defaults: 0 and false for backward compat.
  public type VersionBackupSummary = {
    id : Text;
    versionLabel : Text;
    createdAt : Common.Timestamp;
    createdBy : Text;
    backupType : Text;
    userCount : Nat;
    listingCount : Nat;
    configCount : Nat;         // number of app_config rows in this backup
    sizeKb : Nat;             // approximate size of backupData in KB; default 0
    isStable : Bool;          // mirrors VersionBackup.isStable; default false
    notes : ?Text;
  };

  /// Result returned from a restore operation.
  public type RestoreResult = {
    success : Bool;
    usersRestored : Nat;
    listingsRestored : Nat;
    preSaveBackupId : Text;
    errorMessage : ?Text;
  };

  /// Result from a ZIP-based restore (user-facing restore from their own export).
  public type ZipRestoreResult = {
    success : Bool;
    listingsRestored : Nat;
    errorMessage : ?Text;
  };
};

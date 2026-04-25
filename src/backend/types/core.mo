import Debug "mo:core/Debug";

module {
  // ══════════════════════════════════════════════════════════════════════════════
  // CORE TYPES — Golden Master Build
  // Foundation types shared across the Master Listing + Platform Draft architecture
  // ══════════════════════════════════════════════════════════════════════════════

  /// Supported marketplace platforms
  public type Platform = {
    #facebook;
    #mecari;
    #ebay;
    #poshmark;
    #depop;
    #etsy;
  };

  /// Status of a master listing on Copie Past-E (not on external platforms)
  public type ListingStatus = {
    #draft;     // Created but not visible
    #active;    // Visible on Copie Past-E
    #archived;  // User archived
  };

  /// Status of a platform-specific draft (preparation for manual posting)
  public type DraftStatus = {
    #unsaved;   // Partially filled
    #saved;     // Ready for extension
    #preparing; // User preparing to post
    #ready;     // Complete, awaiting manual submission
    #posted;    // User manually posted (tracking only)
  };

  /// Immutable audit record for all listing and draft changes
  public type AuditEntry = {
    timestamp : Int;      // Time.now() nanoseconds
    caller    : Principal; // Principal that performed the action (avoid 'actor' reserved)
    action    : Text;
    details   : ?Text;
  };

  /// Structured error codes — no magic strings
  public type ErrorCode = {
    #unauthorized;
    #notFound;
    #invalidInput;
    #duplicateEntry;
    #quotaExceeded;
    #systemError;
    #draftNotFound;
    #platformNotSupported;
  };

  /// Structured application error returned by all public functions
  public type AppError = {
    code    : ErrorCode;
    message : Text;
  };

  /// Platform capability descriptor — static per-platform constraints
  public type PlatformCapability = {
    platform             : Platform;
    maxTitleLength       : Nat;
    maxDescriptionLength : Nat;
    maxPhotos            : Nat;
    requiredFields       : [Text];
    optionalFields       : [Text];
  };
};

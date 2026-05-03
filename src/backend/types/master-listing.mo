import Debug "mo:core/Debug";
import Core "core";

module {
  // ══════════════════════════════════════════════════════════════════════════════
  // MASTER LISTING TYPES — Golden Master Build
  // Platform-specific field structures with exact character limits.
  // Master Listing is the single source of truth; Platform Drafts are derived.
  // ══════════════════════════════════════════════════════════════════════════════

  // ── Condition Enums ──────────────────────────────────────────────────────────

  /// Mercari 1–5 condition scale (#new_ avoids reserved keyword 'new')
  public type MecariCondition5Scale = {
    #new_;    // 1 — New, never used
    #likeNew; // 2 — Like new, no signs of wear
    #good;    // 3 — Good condition, minor wear
    #fair;    // 4 — Fair condition, visible flaws
    #poor;    // 5 — Poor condition, major flaws
  };

  /// Generic condition for Facebook, eBay (#new_ avoids reserved keyword)
  public type FacebookCondition = {
    #new_;
    #likeNew;
    #good;
    #fair;
    #poor;
  };

  // ── Platform-Specific Field Structures ──────────────────────────────────────

  /// Facebook Marketplace draft fields — exact platform limits
  public type FacebookFields = {
    title       : Text;              // MAX 200 chars
    description : Text;              // MAX 5000 chars
    price       : ?Text;
    category    : ?Text;
    condition   : ?FacebookCondition;
    localPickup : Bool;
    shipping    : Bool;
    photos      : [Blob];            // MAX 10 photos
  };

  /// Mercari draft fields — exact platform limits
  public type MecariFields = {
    title        : Text;                   // MAX 80 chars, REQUIRED
    description  : Text;                   // MAX 1000 chars
    price        : ?Text;
    brand        : Text;                   // REQUIRED for Mercari
    condition    : ?MecariCondition5Scale; // REQUIRED
    category     : ?Text;
    deliveryDays : ?Nat;                   // 1–7 days
    shippingType : ?{ #normal; #fast; #sameDay };
    photos       : [Blob];                 // MAX 12 photos
  };

  /// eBay draft fields — exact platform limits
  public type EbayFields = {
    title        : Text;              // MAX 80 chars
    description  : Text;              // MAX 4000 chars
    price        : ?Text;
    category     : ?Text;
    condition    : ?FacebookCondition; // reuses shared condition enum
    quantity     : Nat;               // default 1
    shippingCost : ?Text;
    photos       : [Blob];            // MAX 12 photos
  };

  /// Poshmark draft fields — exact platform limits
  public type PoshmarkFields = {
    title       : Text;  // MAX 141 chars
    description : Text;  // MAX 2000 chars
    price       : ?Text;
    brand       : ?Text;
    size        : ?Text;
    department  : ?Text; // "Women", "Men", "Kids", "Home"
    color       : ?Text; // primary color
    category    : ?Text;
    condition   : ?Text;
    photos      : [Blob]; // MAX 11 photos
  };

  /// Depop draft fields — exact platform limits
  public type DepopFields = {
    title       : Text;  // MAX 70 chars
    description : Text;  // MAX 500 chars
    price       : ?Text;
    brand       : ?Text;
    condition   : ?Text;
    size        : ?Text;
    color       : ?Text; // item color
    category    : ?Text;
    photos      : [Blob]; // MAX 12 photos
  };

  /// Etsy draft fields — exact platform limits
  public type EtsyFields = {
    title       : Text;   // MAX 140 chars
    description : Text;   // MAX 10000 chars
    price       : ?Text;
    category    : ?Text;
    tags        : [Text]; // up to 13 tags
    materials   : [Text]; // e.g. ["cotton", "linen"]
    whoMade     : ?Text;  // "i_did", "someone_else", "collective"
    whenMade    : ?Text;  // "made_to_order", "2020_2024", "2010_2019", etc.
    isSupply    : Bool;   // true if this is a craft supply or tool
    photos      : [Blob]; // MAX 10 photos
  };

  /// Discriminated union of all platform field structures
  public type PlatformFields = {
    #facebook : FacebookFields;
    #mecari   : MecariFields;
    #ebay     : EbayFields;
    #poshmark : PoshmarkFields;
    #depop    : DepopFields;
    #etsy     : EtsyFields;
  };

  // ── Manual Posting Log ───────────────────────────────────────────────────────

  /// Actions a user can take on a platform draft (manual, never automated)
  public type ManualPostAction = {
    #drafted;
    #saved;
    #edited;
    #submitted;
    #error;
  };

  /// Single entry in the manual posting log
  public type ManualPostEntry = {
    timestamp : Int; // Time.now() nanoseconds
    action    : ManualPostAction;
    message   : Text;
    remoteUrl : ?Text; // URL user provides after manually posting
  };

  // ── Platform Listing Draft ────────────────────────────────────────────────────

  /// A prepared, platform-specific draft — ready for Chrome extension autofill
  public type PlatformListingDraft = {
    draftId            : Text;
    platform           : Core.Platform;
    createdAt          : Int;
    lastEditedAt       : Int;
    platformFields     : PlatformFields;
    status             : Core.DraftStatus;
    completenessPercent : Nat;          // 0–100
    manualPostingLog   : [ManualPostEntry];
    validationErrors   : [{ field : Text; error : Text }];
    isValid            : Bool;
  };

  // ── Master Listing ────────────────────────────────────────────────────────────

  /// Single source of truth for a user's item on Copie Past-E
  public type MasterListing = {
    // ── Identity ──────────────────────────────────────────────────────────────
    id        : Text;      // "lst_<timestamp>_<principalPrefix>"
    userId    : Principal;
    createdAt : Int;
    updatedAt : Int;

    // ── Universal Fields (not platform-specific) ──────────────────────────────
    title       : Text;   // MAX 200 chars
    description : Text;   // MAX 5000 chars
    price       : ?Text;
    category    : ?Text;
    tags        : [Text];
    photos      : [Blob]; // MAX 12

    // ── Status ────────────────────────────────────────────────────────────────
    status        : Core.ListingStatus;
    archivedAt    : ?Int;
    archivedReason : ?Text;

    // ── Favorites & Pinning ───────────────────────────────────────────────────
    pinned        : Bool;
    pinnedAt      : ?Int;
    favoriteCount : Nat;

    // ── Platform Drafts (prepared, not published) ─────────────────────────────
    platformDrafts : [PlatformListingDraft];

    // ── Audit Trail ───────────────────────────────────────────────────────────
    auditLog : [Core.AuditEntry];

    // ── Metadata ─────────────────────────────────────────────────────────────
    expirationDate : ?Int; // 30 days from creation (nanoseconds)
  };

  // ── Operation Arguments ───────────────────────────────────────────────────────

  /// Arguments for creating a new master listing
  public type CreateMasterListingArgs = {
    clientRequestId : Text;  // Client-generated idempotency key (UUID). Same caller+key returns original listing ID.
    title           : Text;
    description     : Text;
    price           : ?Text;
    category        : ?Text;
    tags            : [Text];
    photos          : [Blob];
  };

  /// Arguments for updating an existing master listing (all fields optional)
  public type UpdateMasterListingArgs = {
    title       : ?Text;
    description : ?Text;
    price       : ?Text;
    category    : ?Text;
    tags        : ?[Text];
  };

  /// Arguments for saving a platform-specific draft
  public type SavePlatformDraftArgs = {
    platform       : Core.Platform;
    platformFields : PlatformFields;
    photos         : [Blob];
  };
};

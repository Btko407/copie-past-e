import Common "common";

module {
  public type ListingStatus = {
    #active;
    #archived;
  };

  /// Platform identifier — optional on existing listings for migration compat
  public type Platform = {
    #facebook;
    #mecari;
    #offerUp;
    #unknown;
  };

  /// Condition variant — #new_ avoids reserved keyword 'new'
  public type Condition = {
    #new_;
    #likeNew;
    #good;
    #fair;
    #poor;
    #unknown;
  };

  public type Listing = {
    id : Common.ListingId;
    userId : Common.UserId;
    title : Text;
    description : Text;
    price : ?Text;
    sourceUrl : ?Text;
    createdAt : Common.Timestamp;
    status : ListingStatus;
    expirationDate : Common.Timestamp;
    tierLevel : Nat;
    category : ?Text;
    archivedAt : ?Common.Timestamp;
    archivedManually : Bool;
    restoredAt : ?Common.Timestamp;
    // Pin/favorite fields — default false/null for backward compat
    pinned : Bool;
    favorited : Bool;
    pinnedAt : ?Common.Timestamp;
    // Legacy backward-compat fields (kept; pre-platform free-form text)
    condition : ?Text;
    brand     : ?Text;
    // ── PLATFORM SUPPORT (NEW) ──────────────────────────────────────────────
    // All new fields are optional so existing stable data migrates seamlessly.
    platform : ?Platform;
    // Facebook Marketplace specific
    fbCondition   : ?Condition;
    fbLocalPickup : ?Bool;
    fbShipping    : ?Bool;
    // Mecari specific
    mecariCondition    : ?Condition;
    mecariBrand        : ?Text;
    mecariDeliveryDays : ?Nat;
    mecariShippingType : ?Text;
  };

  public type CreateListingArgs = {
    title : Text;
    description : Text;
    price : ?Text;
    sourceUrl : ?Text;
    category : ?Text;
    tierLevel : ?Nat;
    // Platform selection — optional so existing callers keep working
    platform : ?Platform;
    // Facebook-specific
    fbCondition   : ?Condition;
    fbLocalPickup : ?Bool;
    fbShipping    : ?Bool;
    // Mecari-specific
    mecariBrand        : ?Text;
    mecariCondition    : ?Condition;
    mecariDeliveryDays : ?Nat;
    mecariShippingType : ?Text;
  };

  public type UpdateListingArgs = {
    id : Common.ListingId;
    title : Text;
    description : Text;
    price : ?Text;
    category : ?Text;
    tierLevel : ?Nat;
    // Platform — optional so callers that don't set it leave it unchanged
    platform : ?Platform;
    // Facebook-specific
    fbCondition   : ?Condition;
    fbLocalPickup : ?Bool;
    fbShipping    : ?Bool;
    // Mecari-specific
    mecariBrand        : ?Text;
    mecariCondition    : ?Condition;
    mecariDeliveryDays : ?Nat;
    mecariShippingType : ?Text;
  };

  /// Lightweight summary for list queries (platform badge, pin/fav state)
  public type ListingSummary = {
    id        : Common.ListingId;
    title     : Text;
    platform  : ?Platform;
    status    : ListingStatus;
    pinned    : Bool;
    favorited : Bool;
    createdAt : Common.Timestamp;
  };
};

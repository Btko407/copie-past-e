/// Migration: adds platform-specific fields to Listing records.
///
/// Old Listing had:
///   platform : ?Text   (free-form text, e.g. "facebook", "mecari")
///   No fb* / mecari* structured fields.
///
/// New Listing has:
///   platform           : ?Platform   (variant)
///   fbCondition        : ?Condition
///   fbLocalPickup      : ?Bool
///   fbShipping         : ?Bool
///   mecariCondition    : ?Condition
///   mecariBrand        : ?Text
///   mecariDeliveryDays : ?Nat
///   mecariShippingType : ?Text
///
/// All new fields default to null; the old ?Text platform is mapped to the
/// appropriate variant (null → null, "facebook" → ?#facebook, "mecari" → ?#mecari,
/// anything else → ?#unknown).

import Map "mo:core/Map";
import Common "types/common";
import ListingTypes "types/listings";
import AppConfigTypes "types/app-config";
import ProfileTypes "types/userprofile";
import TierTypes "types/tiers";

module {

  // ── Old types (inline — do not import from .old/) ───────────────────────────

  type OldListingStatus = { #active; #archived };

  type OldListing = {
    id               : Common.ListingId;
    userId           : Common.UserId;
    title            : Text;
    description      : Text;
    price            : ?Text;
    sourceUrl        : ?Text;
    createdAt        : Common.Timestamp;
    status           : OldListingStatus;
    expirationDate   : Common.Timestamp;
    tierLevel        : Nat;
    category         : ?Text;
    archivedAt       : ?Common.Timestamp;
    archivedManually : Bool;
    restoredAt       : ?Common.Timestamp;
    pinned           : Bool;
    favorited        : Bool;
    pinnedAt         : ?Common.Timestamp;
    condition        : ?Text;
    brand            : ?Text;
    platform         : ?Text;
  };

  // ── Actor state shapes ───────────────────────────────────────────────────────

  public type OldActor = {
    listings        : Map.Map<Common.ListingId, OldListing>;
    listingsBackup  : Map.Map<Common.ListingId, OldListing>;
  };

  public type NewActor = {
    listings        : Map.Map<Common.ListingId, ListingTypes.Listing>;
    listingsBackup  : Map.Map<Common.ListingId, ListingTypes.Listing>;
  };

  // ── Helpers ──────────────────────────────────────────────────────────────────

  func migratePlatform(old : ?Text) : ?ListingTypes.Platform {
    switch old {
      case (?"facebook") { ?#facebook };
      case (?"mecari")   { ?#mecari   };
      case (?"offerUp")  { ?#offerUp  };
      case (?_)          { ?#unknown  };
      case null          { null       };
    };
  };

  func migrateListing(old : OldListing) : ListingTypes.Listing {
    {
      id               = old.id;
      userId           = old.userId;
      title            = old.title;
      description      = old.description;
      price            = old.price;
      sourceUrl        = old.sourceUrl;
      createdAt        = old.createdAt;
      status           = old.status;
      expirationDate   = old.expirationDate;
      tierLevel        = old.tierLevel;
      category         = old.category;
      archivedAt       = old.archivedAt;
      archivedManually = old.archivedManually;
      restoredAt       = old.restoredAt;
      pinned           = old.pinned;
      favorited        = old.favorited;
      pinnedAt         = old.pinnedAt;
      condition        = old.condition;
      brand            = old.brand;
      platform         = migratePlatform(old.platform);
      // New optional fields — default null
      fbCondition        = null;
      fbLocalPickup      = null;
      fbShipping         = null;
      mecariCondition    = null;
      mecariBrand        = null;
      mecariDeliveryDays = null;
      mecariShippingType = null;
    };
  };

  // ── Entry point ──────────────────────────────────────────────────────────────

  public func run(old : OldActor) : NewActor {
    let listings = old.listings.map<Common.ListingId, OldListing, ListingTypes.Listing>(
      func(_id, l) { migrateListing(l) }
    );
    let listingsBackup = old.listingsBackup.map<Common.ListingId, OldListing, ListingTypes.Listing>(
      func(_id, l) { migrateListing(l) }
    );
    { listings; listingsBackup };
  };
};

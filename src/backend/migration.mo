import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import ListingTypes "types/listings";
import Common "types/common";

/// Migration from pre-v1.3 schema to v1.3.
///
/// Changes:
///   1. Listing — add optional fields: condition, brand, platform (default null)
///   2. listingsBackup — same as listings
///   3. extensionVersions — dropped (old List<OldVersion> → new Map<Text,NewVersion>
///      initialized fresh by the mixin seed logic on first access)
module {
  // ── Old type definitions (copied from .old/src/backend/types/listings.mo) ──
  type OldListingStatus = { #active; #archived };
  type OldListing = {
    id               : Nat;
    userId           : Principal;
    title            : Text;
    description      : Text;
    price            : ?Text;
    sourceUrl        : ?Text;
    createdAt        : Int;
    status           : OldListingStatus;
    expirationDate   : Int;
    tierLevel        : Nat;
    category         : ?Text;
    archivedAt       : ?Int;
    archivedManually : Bool;
    restoredAt       : ?Int;
    pinned           : Bool;
    favorited        : Bool;
    pinnedAt         : ?Int;
  };

  // Old ExtensionVersion — no supportedPlatforms field, used in List
  type OldExtensionVersion = {
    version       : Text;
    buildNumber   : Nat;
    releaseNotes  : Text;
    downloadUrl   : Text;
    isForceUpdate : Bool;
    releasedAt    : Int;
  };

  // ── Migration actor shapes ──
  type OldActor = {
    listings           : Map.Map<Nat, OldListing>;
    var listingsBackup : Map.Map<Nat, OldListing>;
    // Consumed and dropped: old List<ExtensionVersion>
    extensionVersions  : List.List<OldExtensionVersion>;
  };

  type NewActor = {
    listings           : Map.Map<Common.ListingId, ListingTypes.Listing>;
    var listingsBackup : Map.Map<Common.ListingId, ListingTypes.Listing>;
    // extensionVersions not in output — mixin re-seeds a fresh Map on upgrade
  };

  // ── Migration function ──
  public func run(old : OldActor) : NewActor {
    // Migrate listings map — add condition/brand/platform = null
    let listings = old.listings.map<Nat, OldListing, ListingTypes.Listing>(
      func(_id, l) {
        {
          l with
          condition = null : ?Text;
          brand     = null : ?Text;
          platform  = null : ?Text;
        }
      }
    );

    // Migrate listingsBackup map — same transformation
    let listingsBackup = old.listingsBackup.map<Nat, OldListing, ListingTypes.Listing>(
      func(_id, l) {
        {
          l with
          condition = null : ?Text;
          brand     = null : ?Text;
          platform  = null : ?Text;
        }
      }
    );

    // extensionVersions intentionally dropped — mixin seeds v1.3 entry on first access
    {
      listings;
      var listingsBackup;
    }
  };
};

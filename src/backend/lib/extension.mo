import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat32 "mo:core/Nat32";
import Char "mo:core/Char";
import Common "../types/common";
import Types "../types/extension";
import ListingTypes "../types/listings";
import ProfileTypes "../types/userprofile";

module {
  /// Validate the per-user webhook token against the stored token on the profile.
  /// Returns true if the token matches; false if not found or no token set.
  public func validateWebhookToken(
    profiles    : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
    userId      : Common.UserId,
    token       : Text,
  ) : Bool {
    switch (profiles.get(userId)) {
      case null { false };
      case (?profile) {
        switch (profile.fbWebhookToken) {
          case null { false };
          case (?stored) { stored == token };
        };
      };
    };
  };

  /// Find a user ID by matching their webhook token across all profiles.
  /// Used when the caller is anonymous but provides a token.
  public func findUserByToken(
    profiles : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
    token    : Text,
  ) : ?Common.UserId {
    for ((userId, profile) in profiles.entries()) {
      switch (profile.fbWebhookToken) {
        case (?stored) {
          if (stored == token) return ?userId;
        };
        case null {};
      };
    };
    null;
  };

  /// Derived input type for creating a draft listing from extension data.
  /// Platform-specific fields are already resolved before calling this function.
  public type DraftInput = {
    title                : Text;
    description          : ?Text;
    price                : ?Text;
    imageUrls            : [Text];
    category             : ?Text;
    sourceUrl            : ?Text;
    condition            : ?Text;
    brand                : ?Text;
    platform             : ?Text;
    deliveryDays         : ?Nat;
    localPickupAvailable : ?Bool;
  };

  /// Create a draft (not yet active/published) listing from extension data.
  /// The listing is created with #active status and a 30-day review window.
  public func createDraftListing(
    listings       : Map.Map<Common.ListingId, ListingTypes.Listing>,
    listingCounter : { var value : Nat },
    userId         : Common.UserId,
    data           : DraftInput,
    now            : Int,
  ) : Types.DraftListingId {
    listingCounter.value += 1;
    let id = listingCounter.value;
    // 30-day expiry from now — user must review and save before then
    let expirationDate : Int = now + 30 * 86_400_000_000_000;
    let resolvedPlatform : ?ListingTypes.Platform = switch (data.platform) {
      case (?"facebook") { ?#facebook };
      case (?"mecari")   { ?#mecari };
      case (?"offerUp")  { ?#offerUp };
      case _             { ?#unknown };
    };
    let listing : ListingTypes.Listing = {
      id;
      userId;
      title            = data.title;
      description      = switch (data.description) { case (?d) d; case null "" };
      price            = data.price;
      sourceUrl        = data.sourceUrl;
      createdAt        = now;
      status           = #active;
      expirationDate;
      tierLevel        = 1;
      category         = data.category;
      condition        = data.condition;
      brand            = data.brand;
      platform         = resolvedPlatform;
      archivedAt       = null;
      archivedManually = false;
      restoredAt       = null;
      pinned           = false;
      pinnedAt         = null;
      favorited        = false;
      fbCondition      = null;
      fbLocalPickup    = data.localPickupAvailable;
      fbShipping       = null;
      mecariBrand      = data.brand;
      mecariCondition  = null;
      mecariDeliveryDays = data.deliveryDays;
      mecariShippingType = null;
    };
    listings.add(id, listing);
    id;
  };

  /// Generate a pseudo-random webhook token from the userId and current time.
  /// Returns a 32-character hex string suitable for webhook authentication.
  public func generateToken(userId : Common.UserId, now : Int) : Text {
    let seed = userId.toText() # now.toText();
    var h0 : Nat = 0x12345678;
    var h1 : Nat = 0x9ABCDEF0;
    var h2 : Nat = 0xFEEDCAFE;
    var h3 : Nat = 0xDEADBEEF;
    var idx = 0;
    for (c in seed.toIter()) {
      let v = c.toNat32().toNat();
      switch (idx % 4) {
        case 0 { h0 := (h0 * 31 + v) % 0xFFFFFFFF };
        case 1 { h1 := (h1 * 37 + v) % 0xFFFFFFFF };
        case 2 { h2 := (h2 * 41 + v) % 0xFFFFFFFF };
        case _ { h3 := (h3 * 43 + v) % 0xFFFFFFFF };
      };
      idx += 1;
    };
    natToHex8(h0) # natToHex8(h1) # natToHex8(h2) # natToHex8(h3);
  };

  // ── Private helpers ──────────────────────────────────────────────────────────

  func natToHex8(n : Nat) : Text {
    let digits = "0123456789abcdef";
    let arr : [Char] = digits.toArray();
    var parts : [var Char] = [var '0', '0', '0', '0', '0', '0', '0', '0'];
    var remaining = n % 0xFFFFFFFF;
    var i = 0;
    while (i < 8) {
      parts[7 - i] := arr[remaining % 16];
      remaining := remaining / 16;
      i += 1;
    };
    var result = "";
    for (ch in parts.vals()) {
      result := result # Text.fromChar(ch);
    };
    result;
  };
};

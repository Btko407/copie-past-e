import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import Types "../types/listings";
import ImageTypes "../types/images";

module {
  public func createListing(
    listings : Map.Map<Common.ListingId, Types.Listing>,
    counter : { var value : Nat },
    caller : Common.UserId,
    args : Types.CreateListingArgs,
  ) : Types.Listing {
    let id = counter.value;
    counter.value += 1;
    let now = Time.now();
    let tierLevel = switch (args.tierLevel) { case (?t) t; case null 1 };
    // Tier 1 = 30 days, Tier 2 = 90 days, Tier 3 = 180 days
    let daysNs : Int = switch (tierLevel) {
      case 2 { 90 * 86_400_000_000_000 };
      case 3 { 180 * 86_400_000_000_000 };
      case _ { 30 * 86_400_000_000_000 };
    };
    let listing : Types.Listing = {
      id;
      userId = caller;
      title = args.title;
      description = args.description;
      price = args.price;
      sourceUrl = args.sourceUrl;
      createdAt = now;
      status = #active;
      expirationDate = now + daysNs;
      tierLevel;
      category = args.category;
      archivedAt = null;
      archivedManually = false;
      restoredAt = null;
      pinned = false;
      favorited = false;
      pinnedAt = null;
    };
    listings.add(id, listing);
    listing;
  };

  public func listUserListings(
    listings : Map.Map<Common.ListingId, Types.Listing>,
    caller : Common.UserId,
  ) : [Types.Listing] {
    let userListings = List.empty<Types.Listing>();
    for ((_, listing) in listings.entries()) {
      if (Principal.equal(listing.userId, caller)) {
        userListings.add(listing);
      };
    };
    // Pinned listings first (ordered by pinnedAt ascending — first pinned = first shown),
    // then unpinned in descending createdAt order.
    let sorted = userListings.sort(func(a, b) {
      switch (a.pinned, b.pinned) {
        // Both pinned — order by pinnedAt ascending (earlier pin = higher in list)
        case (true, true) {
          let aPinnedAt = switch (a.pinnedAt) { case (?t) t; case null 0 };
          let bPinnedAt = switch (b.pinnedAt) { case (?t) t; case null 0 };
          Int.compare(aPinnedAt, bPinnedAt);
        };
        // a pinned, b not — a comes first
        case (true, false) #less;
        // b pinned, a not — b comes first
        case (false, true) #greater;
        // Both unpinned — descending createdAt
        case (false, false) {
          if (a.createdAt > b.createdAt) #less
          else if (a.createdAt < b.createdAt) #greater
          else #equal
        };
      };
    });
    sorted.toArray();
  };

  public func getListing(
    listings : Map.Map<Common.ListingId, Types.Listing>,
    caller : Common.UserId,
    id : Common.ListingId,
  ) : ?Types.Listing {
    switch (listings.get(id)) {
      case (?listing) {
        if (Principal.equal(listing.userId, caller)) ?listing
        else Runtime.trap("Unauthorized: Listing belongs to another user");
      };
      case null null;
    };
  };

  public func updateListing(
    listings : Map.Map<Common.ListingId, Types.Listing>,
    caller : Common.UserId,
    args : Types.UpdateListingArgs,
  ) : Types.Listing {
    let existing = switch (listings.get(args.id)) {
      case (?l) l;
      case null Runtime.trap("Listing not found");
    };
    if (not Principal.equal(existing.userId, caller)) {
      Runtime.trap("Unauthorized: Listing belongs to another user");
    };
    let updated : Types.Listing = {
      existing with
      title = args.title;
      description = args.description;
      price = args.price;
    };
    listings.add(args.id, updated);
    updated;
  };

  public func deleteListing(
    listings : Map.Map<Common.ListingId, Types.Listing>,
    caller : Common.UserId,
    id : Common.ListingId,
  ) : () {
    let existing = switch (listings.get(id)) {
      case (?l) l;
      case null Runtime.trap("Listing not found");
    };
    if (not Principal.equal(existing.userId, caller)) {
      Runtime.trap("Unauthorized: Listing belongs to another user");
    };
    listings.remove(id);
  };

  // --- User-initiated manual archive ---
  // Caller must own the listing (admin bypass is handled in the mixin layer).
  // Sets status to #archived and records archivedAt timestamp.
  // Returns the updated listing or an error text.
  public func archiveListing(
    listings : Map.Map<Common.ListingId, Types.Listing>,
    listingId : Common.ListingId,
    userId : Common.UserId,
    isAdmin : Bool,
  ) : { #ok : Types.Listing; #err : Text } {
    let existing = switch (listings.get(listingId)) {
      case (?l) l;
      case null return #err("Listing not found");
    };
    if (not isAdmin and not Principal.equal(existing.userId, userId)) {
      return #err("Unauthorized: Listing belongs to another user");
    };
    let now = Time.now();
    let updated : Types.Listing = {
      existing with
      status = #archived;
      archivedAt = ?now;
      archivedManually = true;
    };
    listings.add(listingId, updated);
    #ok(updated);
  };

  // --- Lifecycle: archive expired active listings ---
  // Skips listings owned by admin users.
  // Returns count of listings archived.
  public func archiveExpiredListings(
    listings : Map.Map<Common.ListingId, Types.Listing>,
    accessControlState : AccessControl.AccessControlState,
    nowNs : Common.Timestamp,
  ) : Nat {
    var count : Nat = 0;
    let toArchive = List.empty<Common.ListingId>();
    for ((id, listing) in listings.entries()) {
      switch (listing.status) {
        case (#active) {
          // Skip admin-owned listings (safe lookup — no trap on unregistered)
          let isAdmin = switch (accessControlState.userRoles.get(listing.userId)) {
            case (?(#admin)) true;
            case _ false;
          };
          if (not isAdmin and listing.expirationDate < nowNs) {
            toArchive.add(id);
          };
        };
        case (#archived) {};
      };
    };
    for (id in toArchive.values()) {
      switch (listings.get(id)) {
        case (?listing) {
          listings.add(id, { listing with status = #archived; archivedAt = ?nowNs; archivedManually = false });
          count += 1;
        };
        case null {};
      };
    };
    count;
  };

  // --- Lifecycle: hard-delete archived listings older than 30 days ---
  // Cascades to delete all images for each deleted listing.
  // Skips listings owned by admin users.
  // Returns count of listings deleted.
  public func deleteExpiredArchivedListings(
    listings : Map.Map<Common.ListingId, Types.Listing>,
    images : Map.Map<Common.ImageId, ImageTypes.Image>,
    accessControlState : AccessControl.AccessControlState,
    nowNs : Common.Timestamp,
  ) : Nat {
    let thirtyDaysNs : Int = 30 * 86_400_000_000_000;
    var count : Nat = 0;
    let toDelete = List.empty<Common.ListingId>();
    for ((id, listing) in listings.entries()) {
      switch (listing.status) {
        case (#archived) {
          // Skip admin-owned listings (safe lookup — no trap on unregistered)
          let isAdmin = switch (accessControlState.userRoles.get(listing.userId)) {
            case (?(#admin)) true;
            case _ false;
          };
          if (not isAdmin) {
            switch (listing.archivedAt) {
              case (?archivedAt) {
                if (archivedAt + thirtyDaysNs < nowNs) {
                  toDelete.add(id);
                };
              };
              // Listings archived before archivedAt was tracked: use expirationDate + 30d
              case null {
                if (listing.expirationDate + thirtyDaysNs < nowNs) {
                  toDelete.add(id);
                };
              };
            };
          };
        };
        case (#active) {};
      };
    };
    for (id in toDelete.values()) {
      listings.remove(id);
      // Cascade-delete images
      let imageIdsToRemove = List.empty<Common.ImageId>();
      for ((imgId, img) in images.entries()) {
        if (img.listingId == id) {
          imageIdsToRemove.add(imgId);
        };
      };
      for (imgId in imageIdsToRemove.values()) {
        images.remove(imgId);
      };
      count += 1;
    };
    count;
  };

  // --- Restore an archived listing to active ---
  // Only allowed when the caller's subscription is still active (expirationDate > now).
  // Manually-archived listings can be restored freely while subscription is active.
  // Listings archived due to expired subscription require renewed subscription/gas.
  // Returns the restored listing or an error text.
  public func restoreListing(
    listings : Map.Map<Common.ListingId, Types.Listing>,
    subscriptions : Map.Map<Common.UserId, Common.Timestamp>,
    listingId : Common.ListingId,
    userId : Common.UserId,
    isAdmin : Bool,
    nowNs : Common.Timestamp,
  ) : { #ok : Types.Listing; #err : Text } {
    let existing = switch (listings.get(listingId)) {
      case (?l) l;
      case null return #err("Listing not found");
    };
    if (not isAdmin and not Principal.equal(existing.userId, userId)) {
      return #err("Unauthorized: Listing belongs to another user");
    };
    switch (existing.status) {
      case (#active) return #err("Listing is already active");
      case (#archived) {};
    };
    // Admins bypass subscription check
    if (not isAdmin) {
      let subExpiry = switch (subscriptions.get(userId)) {
        case (?exp) exp;
        case null return #err("No active subscription — please refuel gas to restore listing");
      };
      if (subExpiry <= nowNs) {
        return #err("Subscription expired — please refuel gas to restore listing");
      };
    };
    let restored : Types.Listing = {
      existing with
      status = #active;
      archivedAt = null;
      archivedManually = false;
      restoredAt = ?nowNs;
    };
    listings.add(listingId, restored);
    #ok(restored);
  };

  // --- Admin subscription reset: archive ALL active listings for a user ---
  // Used when an admin resets a user's subscription to zero.
  // Sets status=#archived, archivedAt=nowNs, archivedManually=false for every active listing.
  // Returns the count of listings archived.
  public func archiveAllUserListings(
    listings : Map.Map<Common.ListingId, Types.Listing>,
    userId : Common.UserId,
    nowNs : Common.Timestamp,
  ) : Nat {
    var count : Nat = 0;
    let toArchive = List.empty<Common.ListingId>();
    for ((id, listing) in listings.entries()) {
      if (Principal.equal(listing.userId, userId)) {
        switch (listing.status) {
          case (#active) { toArchive.add(id) };
          case (#archived) {};
        };
      };
    };
    for (id in toArchive.values()) {
      switch (listings.get(id)) {
        case (?listing) {
          listings.add(id, { listing with status = #archived; archivedAt = ?nowNs; archivedManually = false });
          count += 1;
        };
        case null {};
      };
    };
    count;
  };

  // --- Permanently delete a listing (hard remove) ---
  // Only the listing owner or an admin may call this.
  // Caller must pass the images map so cascade cleanup happens here.
  public func permanentDeleteListing(
    listings : Map.Map<Common.ListingId, Types.Listing>,
    images : Map.Map<Common.ImageId, ImageTypes.Image>,
    listingId : Common.ListingId,
    userId : Common.UserId,
    isAdmin : Bool,
  ) : { #ok; #err : Text } {
    let existing = switch (listings.get(listingId)) {
      case (?l) l;
      case null return #err("Listing not found");
    };
    if (not isAdmin and not Principal.equal(existing.userId, userId)) {
      return #err("Unauthorized: Listing belongs to another user");
    };
    listings.remove(listingId);
    // Cascade-delete images
    let imageIdsToRemove = List.empty<Common.ImageId>();
    for ((imgId, img) in images.entries()) {
      if (img.listingId == listingId) {
        imageIdsToRemove.add(imgId);
      };
    };
    for (imgId in imageIdsToRemove.values()) {
      images.remove(imgId);
    };
    #ok;
  };

  // --- Toggle pinned state for a listing ---
  // Only the listing owner can pin/unpin.
  // Returns the new pinned state: true = now pinned, false = now unpinned.
  public func toggleListingPinned(
    listings : Map.Map<Common.ListingId, Types.Listing>,
    caller : Common.UserId,
    listingId : Common.ListingId,
  ) : { #ok : Bool; #err : Text } {
    let existing = switch (listings.get(listingId)) {
      case (?l) l;
      case null return #err("Listing not found");
    };
    if (not Principal.equal(existing.userId, caller)) {
      return #err("Unauthorized: Listing belongs to another user");
    };
    let now = Time.now();
    let (newPinned, newPinnedAt) : (Bool, ?Common.Timestamp) =
      if (existing.pinned) (false, null)
      else (true, ?now);
    let updated : Types.Listing = {
      existing with
      pinned = newPinned;
      pinnedAt = newPinnedAt;
    };
    listings.add(listingId, updated);
    #ok(newPinned);
  };

  // --- Toggle favorited state for a listing ---
  // Only the listing owner can favorite/unfavorite.
  // Returns the new favorited state: true = now favorited, false = now unfavorited.
  public func toggleListingFavorited(
    listings : Map.Map<Common.ListingId, Types.Listing>,
    caller : Common.UserId,
    listingId : Common.ListingId,
  ) : { #ok : Bool; #err : Text } {
    let existing = switch (listings.get(listingId)) {
      case (?l) l;
      case null return #err("Listing not found");
    };
    if (not Principal.equal(existing.userId, caller)) {
      return #err("Unauthorized: Listing belongs to another user");
    };
    let newFavorited = not existing.favorited;
    let updated : Types.Listing = {
      existing with
      favorited = newFavorited;
    };
    listings.add(listingId, updated);
    #ok(newFavorited);
  };

  // --- List favorited listings for a user ---
  // Returns only listings where favorited=true for the caller, sorted descending by createdAt.
  public func listUserFavoritedListings(
    listings : Map.Map<Common.ListingId, Types.Listing>,
    caller : Common.UserId,
  ) : [Types.Listing] {
    let result = List.empty<Types.Listing>();
    for ((_, listing) in listings.entries()) {
      if (Principal.equal(listing.userId, caller) and listing.favorited) {
        result.add(listing);
      };
    };
    // Sort descending by createdAt
    let sorted = result.sort(func(a, b) {
      if (a.createdAt > b.createdAt) #less
      else if (a.createdAt < b.createdAt) #greater
      else #equal
    });
    sorted.toArray();
  };
};

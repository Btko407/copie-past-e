import Map "mo:core/Map";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import Types "../types/listings";
import TierTypes "../types/tiers";
import ImageTypes "../types/images";
import ListingsLib "../lib/listings";
import ImagesLib "../lib/images";
import AdminLib "../lib/admin";

mixin (
  accessControlState : AccessControl.AccessControlState,
  listings : Map.Map<Common.ListingId, Types.Listing>,
  images : Map.Map<Common.ImageId, ImageTypes.Image>,
  listingCounter : { var value : Nat },
  userRegistrations : Map.Map<Common.UserId, Common.Timestamp>,
  userLastLogins : Map.Map<Common.UserId, Common.Timestamp>,
  subscriptions : Map.Map<Common.UserId, TierTypes.UserTierSubscription>,
) {
  // ── CallerGuard — reentrancy + anonymous principal protection ────────────
  let listingsInProgress = Set.empty<Principal>();

  func listingsGuard(caller : Principal) {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: anonymous principal not allowed");
    };
    if (listingsInProgress.contains(caller)) {
      Runtime.trap("Reentrant call detected");
    };
    listingsInProgress.add(caller);
  };

  func listingsRelease(caller : Principal) {
    listingsInProgress.remove(caller);
  };

  public shared ({ caller }) func createListing(args : Types.CreateListingArgs) : async Types.Listing {
    listingsGuard(caller);
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      listingsRelease(caller);
      Runtime.trap("Unauthorized: Must be logged in to create a listing");
    };
    let now = Time.now();
    AdminLib.recordUserRegistration(userRegistrations, caller, now);
    AdminLib.recordUserLogin(userLastLogins, caller, now);
    let result = ListingsLib.createListing(listings, listingCounter, caller, args);
    listingsRelease(caller);
    result;
  };

  public query ({ caller }) func listListings() : async [Types.Listing] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to view listings");
    };
    ListingsLib.listUserListings(listings, caller);
  };

  public query ({ caller }) func getListing(id : Common.ListingId) : async ?Types.Listing {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to view a listing");
    };
    ListingsLib.getListing(listings, caller, id);
  };

  public shared ({ caller }) func updateListing(args : Types.UpdateListingArgs) : async Types.Listing {
    listingsGuard(caller);
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      listingsRelease(caller);
      Runtime.trap("Unauthorized: Must be logged in to update a listing");
    };
    AdminLib.recordUserLogin(userLastLogins, caller, Time.now());
    let result = ListingsLib.updateListing(listings, caller, args);
    listingsRelease(caller);
    result;
  };

  public shared ({ caller }) func deleteListing(id : Common.ListingId) : async () {
    listingsGuard(caller);
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      listingsRelease(caller);
      Runtime.trap("Unauthorized: Must be logged in to delete a listing");
    };
    AdminLib.recordUserLogin(userLastLogins, caller, Time.now());
    ListingsLib.deleteListing(listings, caller, id);
    ImagesLib.deleteImagesForListing(images, id);
    listingsRelease(caller);
  };

  public shared ({ caller }) func archiveListing(listingId : Common.ListingId) : async Types.Listing {
    listingsGuard(caller);
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      listingsRelease(caller);
      Runtime.trap("Unauthorized: Must be logged in to archive a listing");
    };
    let isAdmin = AccessControl.hasPermission(accessControlState, caller, #admin);
    AdminLib.recordUserLogin(userLastLogins, caller, Time.now());
    let result = switch (ListingsLib.archiveListing(listings, listingId, caller, isAdmin)) {
      case (#ok listing) listing;
      case (#err msg) { listingsRelease(caller); Runtime.trap(msg) };
    };
    listingsRelease(caller);
    result;
  };

  // Restore an archived listing to active.
  // Requires an active subscription unless caller is admin.
  // Manually-archived listings can be restored freely while subscription is active.
  // Listings archived due to expired subscription require renewed gas/subscription.
  public shared ({ caller }) func restoreListing(listingId : Common.ListingId) : async { #ok : Types.Listing; #err : Text } {
    listingsGuard(caller);
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      listingsRelease(caller);
      return #err("Unauthorized: Must be logged in to restore a listing");
    };
    let isAdmin = AccessControl.hasPermission(accessControlState, caller, #admin);
    let now = Time.now();
    // Build a subscriptionExpiries map: userId -> expirationDate
    let subExpiries = Map.empty<Common.UserId, Common.Timestamp>();
    for ((userId, sub) in subscriptions.entries()) {
      subExpiries.add(userId, sub.expirationDate);
    };
    let result = ListingsLib.restoreListing(listings, subExpiries, listingId, caller, isAdmin, now);
    listingsRelease(caller);
    result;
  };

  // Permanently and immediately hard-delete a listing and all its images.
  // Only the listing owner or an admin may call this.
  public shared ({ caller }) func permanentDeleteListing(listingId : Common.ListingId) : async { #ok; #err : Text } {
    listingsGuard(caller);
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      listingsRelease(caller);
      return #err("Unauthorized: Must be logged in to delete a listing");
    };
    let isAdmin = AccessControl.hasPermission(accessControlState, caller, #admin);
    let result = ListingsLib.permanentDeleteListing(listings, images, listingId, caller, isAdmin);
    listingsRelease(caller);
    result;
  };

  // Toggle pinned state for a listing — only the owner can call this.
  // Returns the new pinned state (true = pinned, false = unpinned).
  public shared ({ caller }) func toggleListingPinned(listingId : Common.ListingId) : async { #ok : Bool; #err : Text } {
    listingsGuard(caller);
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      listingsRelease(caller);
      return #err("Unauthorized: Must be logged in to pin a listing");
    };
    let result = ListingsLib.toggleListingPinned(listings, caller, listingId);
    listingsRelease(caller);
    result;
  };

  // Toggle favorited state for a listing — only the owner can call this.
  // Returns the new favorited state (true = favorited, false = unfavorited).
  public shared ({ caller }) func toggleListingFavorited(listingId : Common.ListingId) : async { #ok : Bool; #err : Text } {
    listingsGuard(caller);
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      listingsRelease(caller);
      return #err("Unauthorized: Must be logged in to favorite a listing");
    };
    let result = ListingsLib.toggleListingFavorited(listings, caller, listingId);
    listingsRelease(caller);
    result;
  };

  // Returns all favorited listings for the caller, sorted descending by createdAt.
  public query ({ caller }) func listFavoritedListings() : async [Types.Listing] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to view favorites");
    };
    ListingsLib.listUserFavoritedListings(listings, caller);
  };

  // Admin-only: manually trigger lifecycle cleanup
  public shared ({ caller }) func runLifecycleCleanup() : async { archived : Nat; deleted : Nat } {
    listingsGuard(caller);
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      listingsRelease(caller);
      Runtime.trap("Unauthorized: Admin role required");
    };
    let now = Time.now();
    let archived = ListingsLib.archiveExpiredListings(listings, accessControlState, now);
    let deleted = ListingsLib.deleteExpiredArchivedListings(listings, images, accessControlState, now);
    listingsRelease(caller);
    { archived; deleted };
  };
};

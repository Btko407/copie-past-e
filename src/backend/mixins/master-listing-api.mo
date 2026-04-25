import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import Core "../types/core";
import MasterListingTypes "../types/master-listing";

mixin (
  accessControlState : AccessControl.AccessControlState,
  masterListings : Map.Map<Text, MasterListingTypes.MasterListing>,
) {
  // ── HELPERS ──────────────────────────────────────────────────────────────────

  /// Validate platform-specific draft fields. Returns list of validation errors.
  func validatePlatformFields(
    fields : MasterListingTypes.PlatformFields
  ) : [{ field : Text; error : Text }] {
    let errors = List.empty<{ field : Text; error : Text }>();

    switch (fields) {
      case (#facebook(fb)) {
        if (fb.title.size() == 0) {
          errors.add({ field = "title"; error = "Title is required" });
        };
        if (fb.title.size() > 200) {
          errors.add({ field = "title"; error = "Title exceeds 200 characters" });
        };
        if (fb.description.size() == 0) {
          errors.add({ field = "description"; error = "Description is required" });
        };
        if (fb.description.size() > 5000) {
          errors.add({ field = "description"; error = "Description exceeds 5000 characters" });
        };
      };
      case (#mecari(m)) {
        if (m.title.size() == 0) {
          errors.add({ field = "title"; error = "Title is required" });
        };
        if (m.title.size() > 80) {
          errors.add({ field = "title"; error = "Title exceeds 80 characters" });
        };
        if (m.brand.size() == 0) {
          errors.add({ field = "brand"; error = "Brand is required for Mercari" });
        };
        if (m.description.size() > 1000) {
          errors.add({ field = "description"; error = "Description exceeds 1000 characters" });
        };
        switch (m.condition) {
          case null {
            errors.add({ field = "condition"; error = "Condition is required for Mercari" });
          };
          case _ {};
        };
      };
      case (#ebay(e)) {
        if (e.title.size() == 0) {
          errors.add({ field = "title"; error = "Title is required" });
        };
        if (e.title.size() > 80) {
          errors.add({ field = "title"; error = "Title exceeds 80 characters" });
        };
        if (e.description.size() > 4000) {
          errors.add({ field = "description"; error = "Description exceeds 4000 characters" });
        };
      };
      case (#poshmark(p)) {
        if (p.title.size() == 0) {
          errors.add({ field = "title"; error = "Title is required" });
        };
        if (p.title.size() > 141) {
          errors.add({ field = "title"; error = "Title exceeds 141 characters" });
        };
        if (p.description.size() > 2000) {
          errors.add({ field = "description"; error = "Description exceeds 2000 characters" });
        };
      };
      case (#depop(d)) {
        if (d.title.size() == 0) {
          errors.add({ field = "title"; error = "Title is required" });
        };
        if (d.title.size() > 70) {
          errors.add({ field = "title"; error = "Title exceeds 70 characters" });
        };
        if (d.description.size() > 500) {
          errors.add({ field = "description"; error = "Description exceeds 500 characters" });
        };
      };
      case (#etsy(et)) {
        if (et.title.size() == 0) {
          errors.add({ field = "title"; error = "Title is required" });
        };
        if (et.title.size() > 140) {
          errors.add({ field = "title"; error = "Title exceeds 140 characters" });
        };
        if (et.description.size() > 10000) {
          errors.add({ field = "description"; error = "Description exceeds 10000 characters" });
        };
      };
    };

    errors.toArray()
  };

  /// Calculate completeness percent based on optional fields filled.
  /// Simple heuristic: count non-null optional fields / total optional fields * 100.
  func calcCompletenessPercent(fields : MasterListingTypes.PlatformFields) : Nat {
    switch (fields) {
      case (#facebook(fb)) {
        var filled : Nat = 0;
        let total : Nat = 4; // price, category, condition, localPickup/shipping
        switch (fb.price) { case (?_) { filled += 1 }; case null {} };
        switch (fb.category) { case (?_) { filled += 1 }; case null {} };
        switch (fb.condition) { case (?_) { filled += 1 }; case null {} };
        if (fb.localPickup or fb.shipping) { filled += 1 };
        (filled * 100) / total
      };
      case (#mecari(m)) {
        var filled : Nat = 0;
        let total : Nat = 4; // price, category, deliveryDays, shippingType
        switch (m.price) { case (?_) { filled += 1 }; case null {} };
        switch (m.category) { case (?_) { filled += 1 }; case null {} };
        switch (m.deliveryDays) { case (?_) { filled += 1 }; case null {} };
        switch (m.shippingType) { case (?_) { filled += 1 }; case null {} };
        (filled * 100) / total
      };
      case (#ebay(e)) {
        var filled : Nat = 0;
        let total : Nat = 4; // price, category, condition, shippingCost
        switch (e.price) { case (?_) { filled += 1 }; case null {} };
        switch (e.category) { case (?_) { filled += 1 }; case null {} };
        switch (e.condition) { case (?_) { filled += 1 }; case null {} };
        switch (e.shippingCost) { case (?_) { filled += 1 }; case null {} };
        (filled * 100) / total
      };
      case (#poshmark(p)) {
        var filled : Nat = 0;
        let total : Nat = 5; // price, brand, size, category, condition
        switch (p.price) { case (?_) { filled += 1 }; case null {} };
        switch (p.brand) { case (?_) { filled += 1 }; case null {} };
        switch (p.size) { case (?_) { filled += 1 }; case null {} };
        switch (p.category) { case (?_) { filled += 1 }; case null {} };
        switch (p.condition) { case (?_) { filled += 1 }; case null {} };
        (filled * 100) / total
      };
      case (#depop(d)) {
        var filled : Nat = 0;
        let total : Nat = 5; // price, brand, condition, size, category
        switch (d.price) { case (?_) { filled += 1 }; case null {} };
        switch (d.brand) { case (?_) { filled += 1 }; case null {} };
        switch (d.condition) { case (?_) { filled += 1 }; case null {} };
        switch (d.size) { case (?_) { filled += 1 }; case null {} };
        switch (d.category) { case (?_) { filled += 1 }; case null {} };
        (filled * 100) / total
      };
      case (#etsy(et)) {
        var filled : Nat = 0;
        let total : Nat = 3; // price, category, tags
        switch (et.price) { case (?_) { filled += 1 }; case null {} };
        switch (et.category) { case (?_) { filled += 1 }; case null {} };
        if (et.tags.size() > 0) { filled += 1 };
        (filled * 100) / total
      };
    }
  };

  /// Get the platform label from a Core.Platform variant.
  func platformLabel(platform : Core.Platform) : Text {
    switch (platform) {
      case (#facebook)  { "facebook"  };
      case (#mecari)    { "mecari"    };
      case (#ebay)      { "ebay"      };
      case (#poshmark)  { "poshmark"  };
      case (#depop)     { "depop"     };
      case (#etsy)      { "etsy"      };
    }
  };

  /// True when a platform draft's platform matches the given Core.Platform.
  func draftMatchesPlatform(
    draft : MasterListingTypes.PlatformListingDraft,
    platform : Core.Platform,
  ) : Bool {
    switch (draft.platform, platform) {
      case (#facebook, #facebook) true;
      case (#mecari,   #mecari)   true;
      case (#ebay,     #ebay)     true;
      case (#poshmark, #poshmark) true;
      case (#depop,    #depop)    true;
      case (#etsy,     #etsy)     true;
      case _                      false;
    }
  };

  // ── PUBLIC API ────────────────────────────────────────────────────────────────

  /// Create a Master Listing — the single source of truth for a user's item.
  /// NO direct publishing; platform drafts are prepared separately for manual posting.
  public shared ({ caller }) func createMasterListing(
    args : MasterListingTypes.CreateMasterListingArgs
  ) : async { #ok : Text; #err : Core.AppError } {
    if (caller.isAnonymous()) {
      return #err({ code = #unauthorized; message = "Must be authenticated to create a listing" });
    };
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err({ code = #unauthorized; message = "Must be logged in to create a listing" });
    };
    if (args.title.size() == 0) {
      return #err({ code = #invalidInput; message = "Title is required" });
    };
    if (args.title.size() > 200) {
      return #err({ code = #invalidInput; message = "Title exceeds 200 characters" });
    };
    if (args.description.size() == 0) {
      return #err({ code = #invalidInput; message = "Description is required" });
    };
    if (args.photos.size() == 0) {
      return #err({ code = #invalidInput; message = "At least one photo is required" });
    };
    if (args.photos.size() > 12) {
      return #err({ code = #invalidInput; message = "Maximum 12 photos allowed" });
    };

    let now = Time.now();
    let listingId = "lst_" # now.toText();
    let expirationDate : Int = now + (30 * 24 * 60 * 60 * 1_000_000_000);

    let listing : MasterListingTypes.MasterListing = {
      id             = listingId;
      userId         = caller;
      createdAt      = now;
      updatedAt      = now;
      title          = args.title;
      description    = args.description;
      price          = args.price;
      category       = args.category;
      tags           = args.tags;
      photos         = args.photos;
      status         = #active;
      archivedAt     = null;
      archivedReason = null;
      pinned         = false;
      pinnedAt       = null;
      favoriteCount  = 0;
      platformDrafts = [];
      auditLog       = [{
        timestamp = now;
        caller    = caller;
        action    = "Master listing created";
        details   = ?("Title: " # args.title);
      }];
      expirationDate = ?expirationDate;
    };

    masterListings.add(listingId, listing);
    #ok(listingId)
  };

  /// Save or replace a platform-specific draft for a master listing.
  /// Validates fields per-platform. One draft per platform (replaces existing).
  public shared ({ caller }) func savePlatformDraft(
    listingId : Text,
    args : MasterListingTypes.SavePlatformDraftArgs,
  ) : async { #ok : Text; #err : Core.AppError } {
    if (caller.isAnonymous()) {
      return #err({ code = #unauthorized; message = "Must be authenticated" });
    };
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err({ code = #unauthorized; message = "Must be logged in" });
    };

    let existing = switch (masterListings.get(listingId)) {
      case null {
        return #err({ code = #notFound; message = "Listing not found" });
      };
      case (?l) {
        if (not Principal.equal(l.userId, caller)) {
          return #err({ code = #unauthorized; message = "Unauthorized: listing belongs to another user" });
        };
        l
      };
    };

    let now = Time.now();
    let draftId = platformLabel(args.platform) # "_" # now.toText();
    let validationErrors = validatePlatformFields(args.platformFields);
    let isValid = validationErrors.size() == 0;
    let completeness = calcCompletenessPercent(args.platformFields);

    let newDraft : MasterListingTypes.PlatformListingDraft = {
      draftId             = draftId;
      platform            = args.platform;
      createdAt           = now;
      lastEditedAt        = now;
      platformFields      = args.platformFields;
      status              = if (isValid) #saved else #unsaved;
      completenessPercent = completeness;
      manualPostingLog    = [{
        timestamp = now;
        action    = #drafted;
        message   = "Draft created for " # platformLabel(args.platform);
        remoteUrl = null;
      }];
      validationErrors = validationErrors;
      isValid          = isValid;
    };

    // Replace existing draft for this platform, then append the new one
    let filteredDrafts = existing.platformDrafts.filter(
      func(d : MasterListingTypes.PlatformListingDraft) : Bool {
        not draftMatchesPlatform(d, args.platform)
      }
    );
    let updatedDrafts = filteredDrafts.concat([newDraft]);

    let updatedListing : MasterListingTypes.MasterListing = {
      existing with
      platformDrafts = updatedDrafts;
      updatedAt      = now;
      auditLog       = existing.auditLog.concat([{
        timestamp = now;
        caller    = caller;
        action    = "Platform draft saved for " # platformLabel(args.platform);
        details   = if (isValid) ?"Draft is valid" else ?("Draft has " # validationErrors.size().toText() # " error(s)");
      }]);
    };

    masterListings.add(listingId, updatedListing);

    if (isValid) {
      #ok("Draft saved successfully for " # platformLabel(args.platform))
    } else {
      #ok("Draft saved with " # validationErrors.size().toText() # " validation error(s). Fix before posting.")
    }
  };

  /// Get a single master listing by ID. Caller must be the owner.
  public query ({ caller }) func getMasterListing(
    listingId : Text
  ) : async { #ok : MasterListingTypes.MasterListing; #err : Core.AppError } {
    if (caller.isAnonymous()) {
      return #err({ code = #unauthorized; message = "Must be authenticated" });
    };
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err({ code = #unauthorized; message = "Must be logged in" });
    };
    switch (masterListings.get(listingId)) {
      case null {
        #err({ code = #notFound; message = "Listing not found" })
      };
      case (?l) {
        if (not Principal.equal(l.userId, caller)) {
          #err({ code = #unauthorized; message = "Unauthorized: listing belongs to another user" })
        } else {
          #ok(l)
        }
      };
    }
  };

  /// Get all master listings for the authenticated caller, newest first.
  public query ({ caller }) func getUserMasterListings() : async { #ok : [MasterListingTypes.MasterListing]; #err : Core.AppError } {
    if (caller.isAnonymous()) {
      return #err({ code = #unauthorized; message = "Must be authenticated" });
    };
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err({ code = #unauthorized; message = "Must be logged in" });
    };

    let results = List.empty<MasterListingTypes.MasterListing>();
    for ((_, listing) in masterListings.entries()) {
      if (Principal.equal(listing.userId, caller)) {
        results.add(listing);
      };
    };

    // Sort newest first
    let sorted = results.sort(func(a : MasterListingTypes.MasterListing, b : MasterListingTypes.MasterListing) : { #less; #equal; #greater } {
      if (a.createdAt > b.createdAt) #less
      else if (a.createdAt < b.createdAt) #greater
      else #equal
    });

    #ok(sorted.toArray())
  };

  /// Get all master listings for the caller that have a saved draft for the given platform.
  public query ({ caller }) func getListingsByPlatform(
    platform : Core.Platform
  ) : async { #ok : [MasterListingTypes.MasterListing]; #err : Core.AppError } {
    if (caller.isAnonymous()) {
      return #err({ code = #unauthorized; message = "Must be authenticated" });
    };
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err({ code = #unauthorized; message = "Must be logged in" });
    };

    let results = List.empty<MasterListingTypes.MasterListing>();
    for ((_, listing) in masterListings.entries()) {
      if (Principal.equal(listing.userId, caller)) {
        let hasDraft = listing.platformDrafts.any(
          func(d : MasterListingTypes.PlatformListingDraft) : Bool {
            draftMatchesPlatform(d, platform) and d.status != #unsaved
          }
        );
        if (hasDraft) {
          results.add(listing);
        };
      };
    };

    #ok(results.toArray())
  };

  /// Log that the user manually posted a draft to an external platform.
  /// Appends to the manual posting log and updates draft status to #posted.
  public shared ({ caller }) func logManualPosting(
    listingId : Text,
    platform  : Core.Platform,
    remoteUrl : ?Text,
  ) : async { #ok : Text; #err : Core.AppError } {
    if (caller.isAnonymous()) {
      return #err({ code = #unauthorized; message = "Must be authenticated" });
    };
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err({ code = #unauthorized; message = "Must be logged in" });
    };

    let existing = switch (masterListings.get(listingId)) {
      case null {
        return #err({ code = #notFound; message = "Listing not found" });
      };
      case (?l) {
        if (not Principal.equal(l.userId, caller)) {
          return #err({ code = #unauthorized; message = "Unauthorized: listing belongs to another user" });
        };
        l
      };
    };

    let now = Time.now();
    let newEntry : MasterListingTypes.ManualPostEntry = {
      timestamp = now;
      action    = #submitted;
      message   = "Manually posted to " # platformLabel(platform);
      remoteUrl = remoteUrl;
    };

    let updatedDrafts = existing.platformDrafts.map(
      func(draft : MasterListingTypes.PlatformListingDraft) : MasterListingTypes.PlatformListingDraft {
        if (draftMatchesPlatform(draft, platform)) {
          {
            draft with
            status           = #posted;
            lastEditedAt     = now;
            manualPostingLog = draft.manualPostingLog.concat([newEntry]);
          }
        } else {
          draft
        }
      }
    );

    let updatedListing : MasterListingTypes.MasterListing = {
      existing with
      platformDrafts = updatedDrafts;
      updatedAt      = now;
      auditLog       = existing.auditLog.concat([{
        timestamp = now;
        caller    = caller;
        action    = "Manual posting logged for " # platformLabel(platform);
        details   = switch (remoteUrl) {
          case (?url) ?("URL: " # url);
          case null   ?"No URL provided";
        };
      }]);
    };

    masterListings.add(listingId, updatedListing);
    #ok("Manual posting logged for " # platformLabel(platform))
  };

  /// Update universal fields on a master listing. All fields are optional.
  public shared ({ caller }) func updateMasterListing(
    listingId : Text,
    args      : MasterListingTypes.UpdateMasterListingArgs,
  ) : async { #ok : Text; #err : Core.AppError } {
    if (caller.isAnonymous()) {
      return #err({ code = #unauthorized; message = "Must be authenticated" });
    };
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err({ code = #unauthorized; message = "Must be logged in" });
    };

    let existing = switch (masterListings.get(listingId)) {
      case null {
        return #err({ code = #notFound; message = "Listing not found" });
      };
      case (?l) {
        if (not Principal.equal(l.userId, caller)) {
          return #err({ code = #unauthorized; message = "Unauthorized: listing belongs to another user" });
        };
        l
      };
    };

    let newTitle = switch (args.title) {
      case (?t) t;
      case null existing.title;
    };
    let newDescription = switch (args.description) {
      case (?d) d;
      case null existing.description;
    };

    // Validate updated fields
    if (newTitle.size() == 0) {
      return #err({ code = #invalidInput; message = "Title cannot be empty" });
    };
    if (newTitle.size() > 200) {
      return #err({ code = #invalidInput; message = "Title exceeds 200 characters" });
    };
    if (newDescription.size() == 0) {
      return #err({ code = #invalidInput; message = "Description cannot be empty" });
    };

    let now = Time.now();
    let updatedListing : MasterListingTypes.MasterListing = {
      existing with
      title       = newTitle;
      description = newDescription;
      price       = switch (args.price)    { case (?v) ?v; case null existing.price };
      category    = switch (args.category) { case (?v) ?v; case null existing.category };
      tags        = switch (args.tags)     { case (?v) v;  case null existing.tags };
      updatedAt   = now;
      auditLog    = existing.auditLog.concat([{
        timestamp = now;
        caller    = caller;
        action    = "Master listing updated";
        details   = ?("Title: " # newTitle);
      }]);
    };

    masterListings.add(listingId, updatedListing);
    #ok("Master listing updated")
  };

  /// Archive a master listing. Sets status to #archived; does not delete data.
  public shared ({ caller }) func archiveMasterListing(
    listingId : Text,
    reason    : ?Text,
  ) : async { #ok : Text; #err : Core.AppError } {
    if (caller.isAnonymous()) {
      return #err({ code = #unauthorized; message = "Must be authenticated" });
    };
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err({ code = #unauthorized; message = "Must be logged in" });
    };

    let existing = switch (masterListings.get(listingId)) {
      case null {
        return #err({ code = #notFound; message = "Listing not found" });
      };
      case (?l) {
        if (not Principal.equal(l.userId, caller)) {
          return #err({ code = #unauthorized; message = "Unauthorized: listing belongs to another user" });
        };
        l
      };
    };

    let now = Time.now();
    let updatedListing : MasterListingTypes.MasterListing = {
      existing with
      status         = #archived;
      archivedAt     = ?now;
      archivedReason = reason;
      updatedAt      = now;
      auditLog       = existing.auditLog.concat([{
        timestamp = now;
        caller    = caller;
        action    = "Master listing archived";
        details   = reason;
      }]);
    };

    masterListings.add(listingId, updatedListing);
    #ok("Listing archived")
  };

  /// Get aggregate stats for all master listings (no auth required).
  public query func getMasterListingStats() : async {
    totalListings : Nat;
    totalDrafts   : Nat;
    totalUsers    : Nat;
  } {
    var totalListings : Nat = 0;
    var totalDrafts   : Nat = 0;
    let seenUsers = List.empty<Principal>();

    for ((_, listing) in masterListings.entries()) {
      totalListings += 1;
      totalDrafts   += listing.platformDrafts.size();
      let already = seenUsers.any(func(p : Principal) : Bool { Principal.equal(p, listing.userId) });
      if (not already) {
        seenUsers.add(listing.userId);
      };
    };

    {
      totalListings = totalListings;
      totalDrafts   = totalDrafts;
      totalUsers    = seenUsers.size();
    }
  };
};

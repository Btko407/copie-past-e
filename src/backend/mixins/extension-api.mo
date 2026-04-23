import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import Types "../types/extension";
import ProfileTypes "../types/userprofile";
import ListingTypes "../types/listings";
import ExtensionLib "../lib/extension";

/// Browser Extension API v1.3 — receives listing data captured by the
/// Copie Past-e Chrome/Safari extension from Facebook Marketplace, Mecari,
/// or OfferUp. Validates platform-specific fields and creates a draft listing.
mixin (
  accessControlState : AccessControl.AccessControlState,
  listings           : Map.Map<Common.ListingId, ListingTypes.Listing>,
  listingCounter     : { var value : Nat },
  profiles           : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
) {
  // ── Extension Version Registry (admin-managed) ───────────────────────────
  // Keyed by version string — add() replaces existing entry for same version
  let extensionVersions = Map.empty<Text, Types.ExtensionVersion>();

  // Seed v1.3 on first load
  if (extensionVersions.isEmpty()) {
    extensionVersions.add(
      "1.3",
      {
        version            = "1.3";
        buildNumber        = 3;
        releaseNotes       = "Complete autofill v1.3 — Facebook Marketplace (price, category, condition, description) + Mecari (brand, pricing, condition) — 100% reliable extraction with image validation";
        downloadUrl        = "https://chrome.google.com/webstore/detail/copie-past-e/YOUR_EXTENSION_ID";
        isForceUpdate      = true;
        releasedAt         = Time.now();
        supportedPlatforms = ["facebook", "mecari", "offerUp"];
      },
    );
  };

  // ── Helper: find the latest version entry ─────────────────────────────────
  func latestVersion() : ?Types.ExtensionVersion {
    // Walk all entries, keep the one with the highest buildNumber
    extensionVersions.foldLeft(
      null,
      func(acc : ?Types.ExtensionVersion, _k : Text, v : Types.ExtensionVersion) : ?Types.ExtensionVersion {
        switch acc {
          case null { ?v };
          case (?best) {
            if (v.buildNumber > best.buildNumber) ?v else ?best
          };
        }
      },
    )
  };

  // ── Extension Version Queries ─────────────────────────────────────────────

  /// Get the latest extension version (for update banners).
  public query func getLatestExtensionVersion() : async ?Types.ExtensionUpdateCheck {
    switch (latestVersion()) {
      case null { null };
      case (?latest) {
        ?{
          currentVersion = "";
          latestVersion  = latest.version;
          needsUpdate    = true;
          isForceUpdate  = latest.isForceUpdate;
          buildNumber    = latest.buildNumber;
          releaseNotes   = latest.releaseNotes;
          downloadUrl    = latest.downloadUrl;
        }
      };
    }
  };

  /// Check update status by comparing the client's installed version with latest.
  public query func checkExtensionUpdateStatus(clientVersion : Text) : async Types.ExtensionUpdateCheck {
    switch (latestVersion()) {
      case null {
        {
          currentVersion = clientVersion;
          latestVersion  = "1.3";
          needsUpdate    = false;
          isForceUpdate  = false;
          buildNumber    = 0;
          releaseNotes   = "";
          downloadUrl    = "";
        }
      };
      case (?latest) {
        {
          currentVersion = clientVersion;
          latestVersion  = latest.version;
          needsUpdate    = clientVersion != latest.version;
          isForceUpdate  = latest.isForceUpdate;
          buildNumber    = latest.buildNumber;
          releaseNotes   = latest.releaseNotes;
          downloadUrl    = latest.downloadUrl;
        }
      };
    }
  };

  /// Admin: publish a new extension version and optionally force-update all users.
  public shared ({ caller }) func adminSetExtensionVersion(
    version       : Text,
    buildNumber   : Nat,
    releaseNotes  : Text,
    downloadUrl   : Text,
    isForceUpdate : Bool,
  ) : async { #ok : Text; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: admin only");
    };
    extensionVersions.add(
      version,
      {
        version;
        buildNumber;
        releaseNotes;
        downloadUrl;
        isForceUpdate;
        releasedAt         = Time.now();
        supportedPlatforms = ["facebook", "mecari", "offerUp"];
      },
    );
    #ok("Extension version " # version # " published — force update: " # (if isForceUpdate "YES" else "NO"))
  };

  /// Admin: list the full extension version history.
  public query ({ caller }) func adminListExtensionVersions() : async [Types.ExtensionVersion] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return [];
    };
    extensionVersions.values().toArray()
  };

  // ── Private Validation Helpers ────────────────────────────────────────────

  /// Validate image MIME types — rejects non-image types (fix for Mecari rejection).
  func validateImageTypes(imageFileTypes : [Text]) : { valid : Bool; errors : [Text] } {
    let allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    var errors = List.empty<Text>();
    for (fileType in imageFileTypes.vals()) {
      let ok = allowed.find(func(t : Text) : Bool { t == fileType }) != null;
      if (not ok) {
        errors.add("Invalid image type: " # fileType # ". Allowed: image/jpeg, image/png, image/webp");
      };
    };
    { valid = errors.size() == 0; errors = errors.toArray() }
  };

  /// Validate Facebook Marketplace specific fields.
  func validateFacebookMarketplaceFields(data : Types.ExtensionListingData) : Types.AutofillValidation {
    var warnings = List.empty<Text>();
    var errors   = List.empty<Text>();

    if (data.title.size() == 0)   errors.add("Title required");
    if (data.title.size() > 200)  errors.add("Title too long (max 200 chars)");

    switch (data.price) {
      case null    { errors.add("Price required for Facebook Marketplace") };
      case (?p)    { if (p.size() == 0) errors.add("Price cannot be empty") };
    };

    switch (data.fbCategory) {
      case null    { warnings.add("Category not detected — will need manual selection") };
      case (?cat)  { if (cat.size() == 0) errors.add("Category empty") };
    };

    switch (data.description) {
      case null    { warnings.add("Description recommended for better results") };
      case (?desc) {
        if (desc.size() == 0)    errors.add("Description cannot be empty");
        if (desc.size() > 5000)  errors.add("Description too long (max 5000 chars)");
      };
    };

    switch (data.fbCondition) {
      case null { warnings.add("Condition not detected") };
      case _    {};
    };

    {
      valid         = errors.size() == 0;
      warnings      = warnings.toArray();
      errors        = errors.toArray();
      platformReady = errors.size() == 0;
    }
  };

  /// Validate Mecari specific fields.
  func validateMecariFields(data : Types.ExtensionListingData) : Types.AutofillValidation {
    var warnings = List.empty<Text>();
    var errors   = List.empty<Text>();

    if (data.title.size() == 0)  errors.add("Title required");
    if (data.title.size() > 80)  errors.add("Mecari title limit: 80 chars (current: " # data.title.size().toText() # ")");

    switch (data.price) {
      case null   { errors.add("Price required for Mecari") };
      case (?p)   { if (p.size() == 0) errors.add("Price cannot be empty") };
    };

    switch (data.mecariBrand) {
      case null      { errors.add("Brand REQUIRED for Mecari — must be extracted or specified") };
      case (?brand)  { if (brand.size() == 0) errors.add("Brand cannot be empty") };
    };

    switch (data.mecariCondition) {
      case null { errors.add("Condition REQUIRED for Mecari (1-5 scale)") };
      case _    {};
    };

    switch (data.mecariDeliveryDays) {
      case null      { errors.add("Delivery days REQUIRED for Mecari (1-7 days)") };
      case (?days)   {
        if (days == 0 or days > 7) errors.add("Delivery days must be 1-7");
      };
    };

    switch (data.description) {
      case null    { warnings.add("Description recommended") };
      case (?desc) { if (desc.size() > 1000) warnings.add("Mecari description is long (max 1000 recommended)") };
    };

    // Image type validation (fix for Mecari file type rejection)
    let imgCheck = validateImageTypes(data.imageFileTypes);
    if (not imgCheck.valid) {
      for (err in imgCheck.errors.vals()) {
        errors.add("Image: " # err);
      };
    };

    {
      valid         = errors.size() == 0;
      warnings      = warnings.toArray();
      errors        = errors.toArray();
      platformReady = errors.size() == 0;
    }
  };

  /// Validate OfferUp specific fields.
  func validateOfferUpFields(data : Types.ExtensionListingData) : Types.AutofillValidation {
    var warnings = List.empty<Text>();
    var errors   = List.empty<Text>();

    if (data.title.size() == 0)  errors.add("Title required");
    if (data.title.size() > 150) errors.add("Title too long (max 150 chars)");

    switch (data.price) {
      case null  { errors.add("Price required") };
      case (?p)  { if (p.size() == 0) errors.add("Price cannot be empty") };
    };

    switch (data.description) {
      case null    { warnings.add("Description recommended") };
      case (?desc) { if (desc.size() == 0) errors.add("Description cannot be empty") };
    };

    {
      valid         = errors.size() == 0;
      warnings      = warnings.toArray();
      errors        = errors.toArray();
      platformReady = errors.size() == 0;
    }
  };

  // ── Helper: map ItemCondition variant to platform string ──────────────────

  func conditionToFbText(c : Types.ItemCondition) : Text {
    switch c {
      case (#new)      { "new" };
      case (#likeNew)  { "like_new" };
      case (#good)     { "good" };
      case (#fair)     { "fair" };
      case (#poor)     { "poor" };
      case (#unknown)  { "unknown" };
    }
  };

  func conditionToMecariScale(c : Types.ItemCondition) : Text {
    switch c {
      case (#new)      { "1" };
      case (#likeNew)  { "2" };
      case (#good)     { "3" };
      case (#fair)     { "4" };
      case (#poor)     { "5" };
      case (#unknown)  { "unknown" };
    }
  };

  // ── Public API ────────────────────────────────────────────────────────────

  /// Validate autofill data before creating draft (query — no state change).
  public query func validateAutofillData(
    data : Types.ExtensionListingData,
  ) : async Types.AutofillValidation {
    switch (data.platform) {
      case (#facebookMarketplace) { validateFacebookMarketplaceFields(data) };
      case (#mecari)              { validateMecariFields(data) };
      case (#offerUp)             { validateOfferUpFields(data) };
      case (#unknown) {
        {
          valid         = false;
          warnings      = [];
          errors        = ["Platform not detected"];
          platformReady = false;
        }
      };
    }
  };

  /// Receive listing data from extension v1.3+ with complete validation.
  /// Returns the draft listing ID, validation warnings, validation errors, or error.
  public shared ({ caller }) func receiveExtensionData(
    data         : Types.ExtensionListingData,
    webhookToken : Text,
  ) : async {
    #ok : Types.DraftListingId;
    #validationWarning : { warnings : [Text]; draftId : Types.DraftListingId };
    #validationError   : { errors : [Text]; platformReady : Bool };
    #err : Text;
  } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized: Must be logged in");
    };

    if (not ExtensionLib.validateWebhookToken(profiles, caller, webhookToken)) {
      return #err("Invalid webhook token");
    };

    // Platform-specific validation
    let validation = switch (data.platform) {
      case (#facebookMarketplace) { validateFacebookMarketplaceFields(data) };
      case (#mecari)              { validateMecariFields(data) };
      case (#offerUp)             { validateOfferUpFields(data) };
      case (#unknown) {
        return #validationError({
          errors        = ["Platform not detected — cannot autofill"];
          platformReady = false;
        });
      };
    };

    if (not validation.platformReady) {
      return #validationError({
        errors        = validation.errors;
        platformReady = false;
      });
    };

    // Build platform-mapped draft data
    let category = switch (data.platform) {
      case (#facebookMarketplace) { data.fbCategory };
      case (#mecari)              { data.mecariCategory };
      case (#offerUp)             { data.offerUpCategory };
      case (#unknown)             { null };
    };

    let conditionText : ?Text = switch (data.platform) {
      case (#facebookMarketplace) {
        switch (data.fbCondition) {
          case null    { null };
          case (?c)    { ?conditionToFbText(c) };
        }
      };
      case (#mecari) {
        switch (data.mecariCondition) {
          case null    { null };
          case (?c)    { ?conditionToMecariScale(c) };
        }
      };
      case (#offerUp) {
        switch (data.offerUpCondition) {
          case null    { null };
          case (?c)    { ?conditionToFbText(c) };
        }
      };
      case (#unknown) { null };
    };

    let brand = switch (data.platform) {
      case (#mecari)  { data.mecariBrand };
      case _          { null };
    };

    let platformTag : ?Text = ?(switch (data.platform) {
      case (#facebookMarketplace) { "facebook" };
      case (#mecari)              { "mecari" };
      case (#offerUp)             { "offerUp" };
      case (#unknown)             { "unknown" };
    });

    let deliveryDays = switch (data.platform) {
      case (#mecari) { data.mecariDeliveryDays };
      case _         { null };
    };

    let localPickup = switch (data.platform) {
      case (#facebookMarketplace) { data.fbLocalPickup };
      case _                      { null };
    };

    let now     = Time.now();
    let draftId = ExtensionLib.createDraftListing(
      listings,
      listingCounter,
      caller,
      {
        title                = data.title;
        description          = data.description;
        price                = data.price;
        imageUrls            = data.imageUrls;
        category;
        sourceUrl            = data.sourceUrl;
        condition            = conditionText;
        brand;
        platform             = platformTag;
        deliveryDays;
        localPickupAvailable = localPickup;
      },
      now,
    );

    if (validation.warnings.size() > 0) {
      #validationWarning({ warnings = validation.warnings; draftId })
    } else {
      #ok(draftId)
    }
  };

  /// Generate (or regenerate) a webhook token for the authenticated user.
  public shared ({ caller }) func generateWebhookToken() : async { #ok : Text; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized: Must be logged in");
    };
    switch (profiles.get(caller)) {
      case null         { #err("Profile not found — please complete registration first") };
      case (?existing)  {
        let now   = Time.now();
        let token = ExtensionLib.generateToken(caller, now);
        let updated : ProfileTypes.UserProfile = { existing with fbWebhookToken = ?token };
        profiles.add(caller, updated);
        #ok(token);
      };
    }
  };

  /// Return the current webhook token for the authenticated user.
  public query ({ caller }) func getMyWebhookToken() : async { #ok : Text; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized: Must be logged in");
    };
    switch (profiles.get(caller)) {
      case null        { #err("Profile not found") };
      case (?profile)  {
        switch (profile.fbWebhookToken) {
          case null        { #err("No webhook token — click Generate to create one") };
          case (?token)    { #ok(token) };
        }
      };
    }
  };
};

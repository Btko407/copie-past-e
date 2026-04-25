import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import AccessControl "mo:caffeineai-authorization/access-control";
import UniversalTypes "../types/universal-listing";

mixin (
  accessControlState : AccessControl.AccessControlState,
) {
  // ── STABLE STORAGE ──────────────────────────────────────────────────────────
  // Universal listings stored as a growable list (persists via enhanced orthogonal persistence)
  let universalListings = List.empty<UniversalTypes.UniversalListing>();
  // Campaigns stored as a growable list
  let universalCampaigns = List.empty<UniversalTypes.CrossListingCampaign>();

  // ── PLATFORM CAPABILITIES (static, initialized once) ────────────────────────
  let platformCapabilitiesData : [UniversalTypes.PlatformCapabilities] = [
    {
      name = "facebook";
      maxPhotos = 10;
      maxTitleLength = 200;
      maxDescriptionLength = 5000;
      supportsCondition = true;
      supportsBrand = false;
      supportsShipping = true;
      supportsLocalPickup = true;
      requiresCategory = true;
      supportedCategories = [];
      priceFormat = "$X.XX";
      supportsBulkListing = true;
      supportsAutoSync = false;
      apiAvailable = false;
    },
    {
      name = "mecari";
      maxPhotos = 12;
      maxTitleLength = 80;
      maxDescriptionLength = 1000;
      supportsCondition = true;
      supportsBrand = true;
      supportsShipping = true;
      supportsLocalPickup = false;
      requiresCategory = true;
      supportedCategories = [];
      priceFormat = "$X";
      supportsBulkListing = false;
      supportsAutoSync = false;
      apiAvailable = false;
    },
    {
      name = "ebay";
      maxPhotos = 12;
      maxTitleLength = 80;
      maxDescriptionLength = 4000;
      supportsCondition = true;
      supportsBrand = true;
      supportsShipping = true;
      supportsLocalPickup = false;
      requiresCategory = true;
      supportedCategories = [];
      priceFormat = "$X.XX";
      supportsBulkListing = false;
      supportsAutoSync = false;
      apiAvailable = false;
    },
    {
      name = "poshmark";
      maxPhotos = 11;
      maxTitleLength = 141;
      maxDescriptionLength = 2000;
      supportsCondition = true;
      supportsBrand = true;
      supportsShipping = false;
      supportsLocalPickup = false;
      requiresCategory = true;
      supportedCategories = [];
      priceFormat = "$X.XX";
      supportsBulkListing = false;
      supportsAutoSync = false;
      apiAvailable = false;
    },
    {
      name = "depop";
      maxPhotos = 12;
      maxTitleLength = 70;
      maxDescriptionLength = 500;
      supportsCondition = true;
      supportsBrand = true;
      supportsShipping = true;
      supportsLocalPickup = false;
      requiresCategory = true;
      supportedCategories = [];
      priceFormat = "$X.XX";
      supportsBulkListing = false;
      supportsAutoSync = false;
      apiAvailable = false;
    },
    {
      name = "etsy";
      maxPhotos = 10;
      maxTitleLength = 140;
      maxDescriptionLength = 10000;
      supportsCondition = false;
      supportsBrand = false;
      supportsShipping = true;
      supportsLocalPickup = false;
      requiresCategory = true;
      supportedCategories = [];
      priceFormat = "$X.XX";
      supportsBulkListing = false;
      supportsAutoSync = false;
      apiAvailable = false;
    },
  ];

  // ── HELPERS ──────────────────────────────────────────────────────────────────

  // Truncate text to maxLen characters
  func truncateText(text : Text, maxLen : Nat) : Text {
    if (text.size() <= maxLen) {
      text
    } else {
      var count = 0;
      var result = "";
      for (c in text.toIter()) {
        if (count < maxLen) {
          result := result # Text.fromChar(c);
          count += 1;
        };
      };
      result
    }
  };

  // Map condition string to Mecari 1-5 scale
  func ulConditionToMecariScale(condition : Text) : Text {
    switch (condition) {
      case "new"     { "1" };
      case "likeNew" { "2" };
      case "good"    { "3" };
      case "fair"    { "4" };
      case "poor"    { "5" };
      case _         { "3" };
    }
  };

  // Get max title length for a platform from static data
  func getPlatformMaxTitle(platformName : Text) : Nat {
    for (cap in platformCapabilitiesData.values()) {
      if (cap.name == platformName) { return cap.maxTitleLength };
    };
    200 // default
  };

  // Get max description length for a platform from static data
  func getPlatformMaxDesc(platformName : Text) : Nat {
    for (cap in platformCapabilitiesData.values()) {
      if (cap.name == platformName) { return cap.maxDescriptionLength };
    };
    1000 // default
  };

  // Build a PlatformTarget for a given platform
  func buildPlatformTarget(
    platformName : Text,
    title : Text,
    description : Text,
    category : ?Text,
    condition : Text,
    brand : ?Text,
    customPrice : ?Text,
    fbLocalPickup : ?Bool,
    fbShipping : ?Bool,
    mecariDeliveryDays : ?Nat,
    mecariShippingType : ?Text,
  ) : UniversalTypes.PlatformTarget {
    let mappedTitle = truncateText(title, getPlatformMaxTitle(platformName));
    let mappedDesc = truncateText(description, getPlatformMaxDesc(platformName));

    let condition5Scale : ?Text = if (platformName == "mecari") {
      ?ulConditionToMecariScale(condition)
    } else {
      null
    };

    let localPickup : ?Bool = if (platformName == "facebook") {
      fbLocalPickup
    } else {
      null
    };

    let shipping : ?Bool = if (platformName == "facebook") {
      fbShipping
    } else {
      null
    };

    let deliveryDays : ?Nat = if (platformName == "mecari") {
      mecariDeliveryDays
    } else {
      null
    };

    let shippingType : ?Text = if (platformName == "mecari") {
      mecariShippingType
    } else {
      null
    };

    {
      platform = platformName;
      enabled = true;
      listingId = null;
      // REMOVED: status = #active (publishing) → now always #scheduled until user manually posts
      // REASON: Violates Manual-Only-Autofill + No-Direct-Publishing directive
      // REPLACEMENT: Users post manually via Chrome extension (autofill only)
      status = #scheduled;
      mappedFields = {
        title = mappedTitle;
        description = mappedDesc;
        category = category;
        condition = ?condition;
        condition5Scale = condition5Scale;
        localPickup = localPickup;
        shipping = shipping;
        brand = brand;
        size = null;
        color = null;
        weight = null;
        dimensions = null;
        shippingCost = null;
        deliveryDays = deliveryDays;
        shippingType = shippingType;
      };
      customPrice = customPrice;
      customCategory = null;
      publishedAt = null;
      syncedAt = null;
    }
  };

  // ── PUBLIC API ────────────────────────────────────────────────────────────────

  /// Create a universal listing targeting multiple platforms.
  /// Stores the listing with platform-mapped fields for Chrome extension autofill.
  /// NOTE: No direct publishing — all posting is manual via the Chrome extension.
  public shared ({ caller }) func createUniversalListing(
    title : Text,
    description : Text,
    price : Text,
    category : ?Text,
    condition : Text,
    brand : ?Text,
    quantity : Nat,
    targetPlatforms : [Text],
    pricingRules : {
      basePrice : Text;
      priceMarkupPercent : ?Float;
      platformPrices : [(Text, Text)];
      autoRepricing : Bool;
    },
    publishSchedule : ?{
      scheduleType : { #immediate; #scheduled; #batch };
      scheduledTime : ?Int;
      batchSize : ?Nat;
    },
    platformSpecificFields : {
      facebook : ?{ localPickup : Bool; shipping : Bool };
      mecari : ?{ deliveryDays : Nat; shippingType : Text };
    },
  ) : async { #ok : Text; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized: Must be logged in");
    };
    if (targetPlatforms.size() == 0) {
      return #err("Select at least one platform");
    };
    if (title.size() == 0) {
      return #err("Title is required");
    };
    if (description.size() == 0) {
      return #err("Description is required");
    };

    let now = Time.now();
    let listingId = "ul_" # now.toText() # "_" # caller.toText();

    // Resolve platform-specific fields
    let fbLocalPickup : ?Bool = switch (platformSpecificFields.facebook) {
      case (?fb) { ?fb.localPickup };
      case null  { null };
    };
    let fbShipping : ?Bool = switch (platformSpecificFields.facebook) {
      case (?fb) { ?fb.shipping };
      case null  { null };
    };
    let mecariDeliveryDays : ?Nat = switch (platformSpecificFields.mecari) {
      case (?m) { ?m.deliveryDays };
      case null { null };
    };
    let mecariShippingType : ?Text = switch (platformSpecificFields.mecari) {
      case (?m) { ?m.shippingType };
      case null { null };
    };

    // Build platform targets
    let builtTargets = List.empty<UniversalTypes.PlatformTarget>();
    for (platformName in targetPlatforms.values()) {
      let customPrice : ?Text = do {
        var found : ?Text = null;
        for ((pName, pPrice) in pricingRules.platformPrices.values()) {
          if (pName == platformName) {
            found := ?pPrice;
          };
        };
        found
      };

      builtTargets.add(
        buildPlatformTarget(
          platformName,
          title,
          description,
          category,
          condition,
          brand,
          customPrice,
          fbLocalPickup,
          fbShipping,
          mecariDeliveryDays,
          mecariShippingType,
        )
      );
    };

    // Build publish schedule
    let schedule : ?UniversalTypes.PublishSchedule = switch (publishSchedule) {
      case null { null };
      case (?s) {
        ?{
          scheduleType = s.scheduleType;
          scheduledTime = s.scheduledTime;
          batchNumber = null;
          itemsPerBatch = s.batchSize;
        }
      };
    };

    let listing : UniversalTypes.UniversalListing = {
      id = listingId;
      userId = caller;
      createdAt = now;
      title = title;
      description = description;
      price = ?price;
      photos = [];
      category = category;
      condition = condition;
      brand = brand;
      targetPlatforms = builtTargets.toArray();
      quantity = quantity;
      quantitySold = 0;
      soldOnPlatforms = [];
      pricingRules = {
        basePrice = pricingRules.basePrice;
        priceMarkupPercent = pricingRules.priceMarkupPercent;
        priceAdjustmentPerPlatform = pricingRules.platformPrices;
        autoRepricing = pricingRules.autoRepricing;
        minPrice = null;
        maxPrice = null;
      };
      publishSchedule = schedule;
      status = #pending;
      publishedAt = null;
      lastSyncAt = null;
      metrics = {
        totalViews = 0;
        totalLikes = 0;
        totalOffers = 0;
        totalSales = 0;
        viewsPerPlatform = [];
        likesPerPlatform = [];
        offersPerPlatform = [];
        salesPerPlatform = [];
        avgTimeToSale = null;
        conversionRate = null;
      };
    };

    universalListings.add(listing);
    #ok("Universal listing created: " # listingId # ". Drafts prepared for " # targetPlatforms.size().toText() # " platform(s). Use the Chrome extension to autofill forms manually.")
  };

  /// Get a universal listing by ID (owner or admin only)
  public query ({ caller }) func getUniversalListing(listingId : Text) : async ?UniversalTypes.UniversalListing {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return null;
    };
    let isAdmin = AccessControl.hasPermission(accessControlState, caller, #admin);
    universalListings.find(func(l : UniversalTypes.UniversalListing) : Bool {
      l.id == listingId and (l.userId == caller or isAdmin)
    })
  };

  /// Get all universal listings for the caller
  public query ({ caller }) func getUserUniversalListings() : async [UniversalTypes.UniversalListing] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to view listings");
    };
    universalListings.filter(func(l : UniversalTypes.UniversalListing) : Bool {
      l.userId == caller
    }).toArray()
  };

  /// Get capabilities for a specific platform
  public query func getPlatformCapabilities(platformName : Text) : async ?UniversalTypes.PlatformCapabilities {
    platformCapabilitiesData.find(func(c : UniversalTypes.PlatformCapabilities) : Bool {
      c.name == platformName
    })
  };

  /// Get all platform capabilities
  public query func getAllPlatformCapabilities() : async [UniversalTypes.PlatformCapabilities] {
    platformCapabilitiesData
  };

  // REMOVED: publishUniversalListing (marks platform targets as #active immediately)
  // REASON: Violates Manual-Only-Autofill + No-Direct-Publishing directive
  // REPLACEMENT: Users post manually via Chrome extension (autofill only)
  // The function below replaces it — it only marks the listing status as #active
  // locally on Copie Past-e to indicate the user has prepared it for posting.
  /// Mark a universal listing as prepared/ready — does NOT publish to any platform.
  /// Use the Chrome extension to autofill the form and submit manually.
  public shared ({ caller }) func markUniversalListingReady(listingId : Text) : async { #ok : Text; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized: Must be logged in");
    };

    var found = false;

    universalListings.mapInPlace(func(l : UniversalTypes.UniversalListing) : UniversalTypes.UniversalListing {
      if (l.id == listingId and l.userId == caller) {
        found := true;
        { l with status = #active }
      } else {
        l
      }
    });

    if (found) {
      #ok("Listing marked as ready. Use the Chrome extension to autofill forms and post manually.")
    } else {
      #err("Listing not found or unauthorized")
    }
  };

  /// Mark a listing as sold — updates local status only.
  /// Does NOT delist from any external platform automatically.
  public shared ({ caller }) func markAsSOLD(listingId : Text) : async { #ok : Text; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized: Must be logged in");
    };

    var found = false;
    var platformCount = 0;

    universalListings.mapInPlace(func(l : UniversalTypes.UniversalListing) : UniversalTypes.UniversalListing {
      if (l.id == listingId and l.userId == caller) {
        found := true;
        platformCount := l.targetPlatforms.size();
        let updatedTargets = l.targetPlatforms.map(
          func(pt : UniversalTypes.PlatformTarget) : UniversalTypes.PlatformTarget {
            { pt with status = #sold }
          }
        );
        { l with status = #sold; quantitySold = l.quantity; targetPlatforms = updatedTargets }
      } else {
        l
      }
    });

    if (found) {
      #ok("Marked as sold on " # platformCount.toText() # " platform draft(s). Remember to manually delist from each marketplace.")
    } else {
      #err("Listing not found or unauthorized")
    }
  };

  /// Get a cross-listing campaign by ID (owner or admin only)
  public query ({ caller }) func getCampaignResults(campaignId : Text) : async ?UniversalTypes.CrossListingCampaign {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return null;
    };
    let isAdmin = AccessControl.hasPermission(accessControlState, caller, #admin);
    universalCampaigns.find(func(c : UniversalTypes.CrossListingCampaign) : Bool {
      c.id == campaignId and (c.userId == caller or isAdmin)
    })
  };
};

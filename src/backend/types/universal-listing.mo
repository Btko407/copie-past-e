module {
  /// Remote listing status on a specific platform
  public type RemoteListingStatus = {
    #active;
    #scheduled;
    #sold;
    #delisted;
    #error;
    #syncing;
  };

  /// Overall listing status
  public type ListingStatus = {
    #draft;
    #pending;
    #active;
    #archived;
    #sold;
  };

  /// Smart field mapping for each platform
  public type FieldMapping = {
    title : Text;
    description : Text;
    category : ?Text;
    condition : ?Text;
    condition5Scale : ?Text;
    localPickup : ?Bool;
    shipping : ?Bool;
    brand : ?Text;
    size : ?Text;
    color : ?Text;
    weight : ?Text;
    dimensions : ?Text;
    shippingCost : ?Text;
    deliveryDays : ?Nat;
    shippingType : ?Text;
  };

  /// Target platform with mapping
  public type PlatformTarget = {
    platform : Text;
    enabled : Bool;
    listingId : ?Text;
    status : RemoteListingStatus;
    mappedFields : FieldMapping;
    customPrice : ?Text;
    customCategory : ?Text;
    publishedAt : ?Int;
    syncedAt : ?Int;
  };

  /// Pricing strategy
  public type PricingRules = {
    basePrice : Text;
    priceMarkupPercent : ?Float;
    priceAdjustmentPerPlatform : [(Text, Text)];
    autoRepricing : Bool;
    minPrice : ?Text;
    maxPrice : ?Text;
  };

  /// Publish scheduling
  public type PublishSchedule = {
    scheduleType : { #immediate; #scheduled; #batch };
    scheduledTime : ?Int;
    batchNumber : ?Nat;
    itemsPerBatch : ?Nat;
  };

  /// Analytics per listing
  public type ListingMetrics = {
    totalViews : Nat;
    totalLikes : Nat;
    totalOffers : Nat;
    totalSales : Nat;
    viewsPerPlatform : [(Text, Nat)];
    likesPerPlatform : [(Text, Nat)];
    offersPerPlatform : [(Text, Nat)];
    salesPerPlatform : [(Text, Nat)];
    avgTimeToSale : ?Nat;
    conversionRate : ?Float;
  };

  /// Universal listing that maps to multiple platforms
  public type UniversalListing = {
    id : Text;
    userId : Principal;
    createdAt : Int;
    title : Text;
    description : Text;
    price : ?Text;
    photos : [Blob];
    category : ?Text;
    condition : Text;
    brand : ?Text;
    targetPlatforms : [PlatformTarget];
    quantity : Nat;
    quantitySold : Nat;
    soldOnPlatforms : [Text];
    pricingRules : PricingRules;
    publishSchedule : ?PublishSchedule;
    status : ListingStatus;
    publishedAt : ?Int;
    lastSyncAt : ?Int;
    metrics : ListingMetrics;
  };

  /// Platform capability info (what fields it supports)
  public type PlatformCapabilities = {
    name : Text;
    maxPhotos : Nat;
    maxTitleLength : Nat;
    maxDescriptionLength : Nat;
    supportsCondition : Bool;
    supportsBrand : Bool;
    supportsShipping : Bool;
    supportsLocalPickup : Bool;
    requiresCategory : Bool;
    supportedCategories : [Text];
    priceFormat : Text;
    supportsBulkListing : Bool;
    supportsAutoSync : Bool;
    apiAvailable : Bool;
  };

  /// Campaign results
  public type CampaignResults = {
    totalListingsPublished : Nat;
    totalListingsSucceeded : Nat;
    totalListingsFailed : Nat;
    totalSales : Nat;
    totalRevenue : ?Text;
    avgViewsPerListing : ?Float;
    avgConversionRate : ?Float;
    publishedAt : ?Int;
  };

  /// Cross-listing campaign
  public type CrossListingCampaign = {
    id : Text;
    userId : Principal;
    name : Text;
    listings : [Text];
    targetPlatforms : [Text];
    createdAt : Int;
    status : { #draft; #active; #completed; #failed };
    results : CampaignResults;
  };
};

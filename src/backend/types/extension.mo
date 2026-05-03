import Common "common";

module {
  /// ID of a draft listing created by the browser extension webhook.
  public type DraftListingId = Nat;

  /// Platform-specific condition enum
  public type ItemCondition = {
    #new;
    #likeNew;
    #good;
    #fair;
    #poor;
    #unknown;
  };

  /// Platform identifier
  public type Platform = {
    #facebookMarketplace;
    #mecari;
    #offerUp;
    #unknown;
  };

  /// Complete payload sent by browser extension v1.3+
  /// Now includes ALL fields needed for complete autofill
  public type ExtensionListingData = {
    // ── CORE FIELDS (all platforms) ──
    title           : Text;
    description     : ?Text;
    price           : ?Text;
    imageUrls       : [Text];
    platform        : Platform;
    sourceUrl       : ?Text;

    // ── FACEBOOK MARKETPLACE SPECIFIC ──
    fbCategory      : ?Text;
    fbCondition     : ?ItemCondition;
    fbLocalPickup   : ?Bool;
    fbShipping      : ?Bool;

    // ── MECARI SPECIFIC ──
    mecariCategory     : ?Text;
    mecariCondition    : ?ItemCondition;
    mecariBrand        : ?Text;
    mecariDeliveryDays : ?Nat;
    mecariShippingType : ?Text;

    // ── OFFERUP SPECIFIC ──
    offerUpCategory  : ?Text;
    offerUpCondition : ?ItemCondition;

    // ── FILE METADATA ──
    imageFileTypes  : [Text];
    totalImageSize  : ?Nat;
  };

  /// Versioned release of browser extension
  public type ExtensionVersion = {
    version            : Text;
    buildNumber        : Nat;
    releaseNotes       : Text;
    downloadUrl        : Text;
    isForceUpdate      : Bool;
    releasedAt         : Common.Timestamp;
    supportedPlatforms : [Text];
  };

  /// Result returned by checkExtensionUpdateStatus
  public type ExtensionUpdateCheck = {
    currentVersion : Text;
    latestVersion  : Text;
    needsUpdate    : Bool;
    isForceUpdate  : Bool;
    buildNumber    : Nat;
    releaseNotes   : Text;
    downloadUrl    : Text;
  };

  /// Autofill validation result
  public type AutofillValidation = {
    valid          : Bool;
    warnings       : [Text];
    errors         : [Text];
    platformReady  : Bool;
  };

  /// Platform capability flags (admin-configurable)
  public type ExtensionCapabilities = {
    facebook : Bool;
    mercari  : Bool;
    ebay     : Bool;
    poshmark : Bool;
    depop    : Bool;
    etsy     : Bool;
  };

  /// Admin-managed extension release config (separate from version history)
  public type ExtensionConfig = {
    downloadMode       : Text;  // "local" | "webstore" | "both"
    localDownloadUrl   : Text;
    chromeWebStoreUrl  : Text;
    supportedPlatforms : [Text];
    capabilities       : ExtensionCapabilities;
  };

  /// Public result for getExtensionConfig
  public type ExtensionConfigResult = {
    latestVersion      : Text;
    buildNumber        : Nat;
    downloadUrl        : Text;
    isForceUpdate      : Bool;
    releaseNotes       : Text;
    downloadMode       : Text;
    localDownloadUrl   : Text;
    chromeWebStoreUrl  : Text;
    supportedPlatforms : [Text];
    capabilities       : ExtensionCapabilities;
  };
};

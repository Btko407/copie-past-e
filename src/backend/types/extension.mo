import Common "common";
module {
  /// ID of a draft listing created by the browser extension webhook.
  public type DraftListingId = Nat;

  /// Payload sent by the browser extension when the user activates it on a
  /// Facebook Marketplace or OfferUp listing page.
  public type ExtensionListingData = {
    title       : Text;
    description : ?Text;
    price       : ?Text;
    imageUrls   : [Text];
    category    : ?Text;
    sourceUrl   : ?Text;
    condition   : ?Text;
    brand       : ?Text;
    platform    : ?Text;
    deliveryDays     : ?Nat;
    localPickupAvailable : ?Bool;
  };

  /// A versioned release of the browser extension.
  public type ExtensionVersion = {
    version      : Text;
    buildNumber  : Nat;
    releaseNotes : Text;
    downloadUrl  : Text;
    isForceUpdate : Bool;
    releasedAt   : Common.Timestamp;
  };

  /// Result returned by checkExtensionUpdateStatus.
  public type ExtensionUpdateCheck = {
    currentVersion : Text;
    latestVersion  : Text;
    needsUpdate    : Bool;
    isForceUpdate  : Bool;
    buildNumber    : Nat;
    releaseNotes   : Text;
    downloadUrl    : Text;
  };
};

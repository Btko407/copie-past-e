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
  };
};

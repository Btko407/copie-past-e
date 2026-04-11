import Common "common";

module {
  /// Supported marketplace sources for URL-based import
  public type MarketplaceSource = {
    #facebookMarketplace;
    #offerUp;
    #unknown;
  };

  /// The pre-filled data extracted from a public listing page.
  /// All fields are optional — scrapers return what they can find.
  public type ScrapedListing = {
    source : MarketplaceSource;
    sourceUrl : Text;
    title : ?Text;
    description : ?Text;
    price : ?Text;          // raw string, e.g. "45" or "45.00"
    category : ?Text;
    imageUrls : [Text];     // public image URLs found on the page
  };

  public type ScrapeArgs = {
    url : Text;
  };

  public type ScrapeResult = {
    #ok : ScrapedListing;
    #err : Text; // #unsupportedSource | #fetchFailed | #parseFailed | #privateOrNotFound
  };
};

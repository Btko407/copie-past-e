module {
  /// Result of parsing raw pasted listing text from Facebook Marketplace,
  /// OfferUp, or any generic marketplace listing.
  /// All fields are optional — null means the parser could not extract it;
  /// the frontend shows a blank field for the user to fill in manually.
  public type ParsedListingResult = {
    title       : ?Text;
    price       : ?Text;
    description : ?Text;
    category    : ?Text;
  };
};

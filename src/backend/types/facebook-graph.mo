module {
  /// A listing retrieved from the Facebook Graph API using the user's own
  /// stored credentials (app ID + access token).
  public type FbListing = {
    id          : Text;
    title       : Text;
    description : ?Text;
    price       : ?Text;
    category    : ?Text;
    imageUrls   : [Text];
  };

  /// Stored per-user Facebook Graph API credentials.
  /// Persisted on the UserProfile record.
  public type FbCredentials = {
    appId       : Text;
    accessToken : Text;
  };
};

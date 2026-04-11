import Common "common";

module {
  public type ListingStatus = {
    #active;
    #archived;
  };

  public type Listing = {
    id : Common.ListingId;
    userId : Common.UserId;
    title : Text;
    description : Text;
    price : ?Text;
    sourceUrl : ?Text;
    createdAt : Common.Timestamp;
    status : ListingStatus;
    expirationDate : Common.Timestamp;
    tierLevel : Nat;
    category : ?Text;
    archivedAt : ?Common.Timestamp;
    archivedManually : Bool;
    restoredAt : ?Common.Timestamp;
    // Pin/favorite fields — default false/null for backward compat
    pinned : Bool;
    favorited : Bool;
    pinnedAt : ?Common.Timestamp;
  };

  public type CreateListingArgs = {
    title : Text;
    description : Text;
    price : ?Text;
    sourceUrl : ?Text;
    category : ?Text;
    tierLevel : ?Nat;
  };

  public type UpdateListingArgs = {
    id : Common.ListingId;
    title : Text;
    description : Text;
    price : ?Text;
    category : ?Text;
    tierLevel : ?Nat;
  };
};

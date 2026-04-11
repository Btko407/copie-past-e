import Common "common";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type Image = {
    id : Common.ImageId;
    listingId : Common.ListingId;
    blob : Storage.ExternalBlob;
    altText : Text;
    order : Nat;
  };

  public type AddImageArgs = {
    listingId : Common.ListingId;
    blob : Storage.ExternalBlob;
    altText : Text;
    order : Nat;
  };
};

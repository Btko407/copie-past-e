import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Common "../types/common";
import ListingTypes "../types/listings";
import Types "../types/images";

module {
  public func addImage(
    images : Map.Map<Common.ImageId, Types.Image>,
    listings : Map.Map<Common.ListingId, ListingTypes.Listing>,
    counter : { var value : Nat },
    caller : Common.UserId,
    args : Types.AddImageArgs,
  ) : Types.Image {
    // Verify caller owns the listing
    let listing = switch (listings.get(args.listingId)) {
      case (?l) l;
      case null Runtime.trap("Listing not found");
    };
    if (not Principal.equal(listing.userId, caller)) {
      Runtime.trap("Unauthorized: Listing belongs to another user");
    };
    let id = counter.value;
    counter.value += 1;
    let image : Types.Image = {
      id;
      listingId = args.listingId;
      blob = args.blob;
      altText = args.altText;
      order = args.order;
    };
    images.add(id, image);
    image;
  };

  public func removeImage(
    images : Map.Map<Common.ImageId, Types.Image>,
    listings : Map.Map<Common.ListingId, ListingTypes.Listing>,
    caller : Common.UserId,
    imageId : Common.ImageId,
  ) : () {
    let image = switch (images.get(imageId)) {
      case (?img) img;
      case null Runtime.trap("Image not found");
    };
    let listing = switch (listings.get(image.listingId)) {
      case (?l) l;
      case null Runtime.trap("Listing not found");
    };
    if (not Principal.equal(listing.userId, caller)) {
      Runtime.trap("Unauthorized: Listing belongs to another user");
    };
    images.remove(imageId);
  };

  public func listImagesForListing(
    images : Map.Map<Common.ImageId, Types.Image>,
    listings : Map.Map<Common.ListingId, ListingTypes.Listing>,
    caller : Common.UserId,
    listingId : Common.ListingId,
  ) : [Types.Image] {
    // Verify caller owns the listing
    let listing = switch (listings.get(listingId)) {
      case (?l) l;
      case null Runtime.trap("Listing not found");
    };
    if (not Principal.equal(listing.userId, caller)) {
      Runtime.trap("Unauthorized: Listing belongs to another user");
    };
    let result = List.empty<Types.Image>();
    for ((_, image) in images.entries()) {
      if (image.listingId == listingId) {
        result.add(image);
      };
    };
    let sorted = result.sort(func(a, b) {
      if (a.order < b.order) #less
      else if (a.order > b.order) #greater
      else #equal
    });
    sorted.toArray();
  };

  // Cascade-delete all images for a listing (called by deleteListing)
  public func deleteImagesForListing(
    images : Map.Map<Common.ImageId, Types.Image>,
    listingId : Common.ListingId,
  ) : () {
    let toRemove = List.empty<Common.ImageId>();
    for ((id, image) in images.entries()) {
      if (image.listingId == listingId) {
        toRemove.add(id);
      };
    };
    for (id in toRemove.values()) {
      images.remove(id);
    };
  };
};

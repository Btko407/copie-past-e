import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import ListingTypes "../types/listings";
import Types "../types/images";
import ImagesLib "../lib/images";

mixin (
  accessControlState : AccessControl.AccessControlState,
  images : Map.Map<Common.ImageId, Types.Image>,
  listings : Map.Map<Common.ListingId, ListingTypes.Listing>,
  imageCounter : { var value : Nat },
) {
  public shared ({ caller }) func addImage(args : Types.AddImageArgs) : async Types.Image {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to add an image");
    };
    ImagesLib.addImage(images, listings, imageCounter, caller, args);
  };

  public shared ({ caller }) func removeImage(imageId : Common.ImageId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to remove an image");
    };
    ImagesLib.removeImage(images, listings, caller, imageId);
  };

  public query ({ caller }) func listImages(listingId : Common.ListingId) : async [Types.Image] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to view images");
    };
    ImagesLib.listImagesForListing(images, listings, caller, listingId);
  };
};

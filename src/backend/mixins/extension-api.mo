import Map "mo:core/Map";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import Types "../types/extension";
import ProfileTypes "../types/userprofile";
import ListingTypes "../types/listings";
import ExtensionLib "../lib/extension";

/// Browser Extension Webhook API — receives listing data captured by the
/// Copie Past-e Chrome/Safari extension from Facebook Marketplace or OfferUp.
/// Creates a draft listing (not published) for the authenticated user.
mixin (
  accessControlState : AccessControl.AccessControlState,
  listings           : Map.Map<Common.ListingId, ListingTypes.Listing>,
  listingCounter     : { var value : Nat },
  profiles           : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
) {
  /// Receive listing data from the browser extension.
  /// webhookToken must match the per-user token stored on the profile.
  /// On success, returns the draft listing ID the user can navigate to for review.
  public shared ({ caller }) func receiveExtensionData(
    data         : Types.ExtensionListingData,
    webhookToken : Text,
  ) : async { #ok : Types.DraftListingId; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized: Must be logged in to receive extension data");
    };
    if (not ExtensionLib.validateWebhookToken(profiles, caller, webhookToken)) {
      return #err("Invalid webhook token — generate a new one from your profile settings");
    };
    let now = Time.now();
    let draftId = ExtensionLib.createDraftListing(listings, listingCounter, caller, data, now);
    #ok(draftId);
  };

  /// Generate (or regenerate) a webhook token for the authenticated user.
  /// The token is stored on the profile and must be provided by the extension.
  public shared ({ caller }) func generateWebhookToken() : async { #ok : Text; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized: Must be logged in to generate a webhook token");
    };
    switch (profiles.get(caller)) {
      case null { #err("Profile not found — please complete registration first") };
      case (?existing) {
        let now = Time.now();
        let token = ExtensionLib.generateToken(caller, now);
        let updated : ProfileTypes.UserProfile = { existing with fbWebhookToken = ?token };
        profiles.add(caller, updated);
        #ok(token);
      };
    };
  };

  /// Return the current webhook token for the authenticated user so the
  /// frontend can display it in the profile / extension settings page.
  public query ({ caller }) func getMyWebhookToken() : async { #ok : Text; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized: Must be logged in to view your webhook token");
    };
    switch (profiles.get(caller)) {
      case null { #err("Profile not found") };
      case (?profile) {
        switch (profile.fbWebhookToken) {
          case null { #err("No webhook token — click Generate to create one") };
          case (?token) { #ok(token) };
        };
      };
    };
  };
};

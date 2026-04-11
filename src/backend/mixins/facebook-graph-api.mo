import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import Types "../types/facebook-graph";
import ProfileTypes "../types/userprofile";
import FbGraphLib "../lib/facebook-graph";
import Map "mo:core/Map";

/// Facebook Graph API mixin — lets users store their own FB App credentials
/// and fetch listings they own via the Graph API `/me/commerce_listings` endpoint.
/// Only works for listings the authenticated user owns on Facebook.
mixin (
  accessControlState : AccessControl.AccessControlState,
  profiles           : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
) {
  /// HTTP outcalls management actor (shared with scraper).
  let IC_HTTP : actor {
    http_request : ({
      url              : Text;
      max_response_bytes : ?Nat64;
      method           : { #get; #head; #post };
      headers          : [{ name : Text; value : Text }];
      body             : ?Blob;
      is_replicated    : ?Bool;
    }) -> async {
      status  : Nat;
      headers : [{ name : Text; value : Text }];
      body    : Blob;
    };
  } = actor "aaaaa-aa";

  /// Save the caller's Facebook App ID and access token to their profile.
  /// These are used to call the FB Graph API on their behalf.
  public shared ({ caller }) func saveFbCredentials(
    appId       : Text,
    accessToken : Text,
  ) : async { #ok; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized: Must be logged in to save credentials");
    };
    if (appId.size() == 0 or accessToken.size() == 0) {
      return #err("App ID and access token cannot be empty");
    };
    FbGraphLib.saveFbCredentials(profiles, caller, appId, accessToken);
  };

  /// Retrieve the caller's stored Facebook credentials.
  /// Returns null if no credentials have been saved yet.
  public query ({ caller }) func getMyFbCredentials() : async ?Types.FbCredentials {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to view credentials");
    };
    FbGraphLib.getFbCredentials(profiles, caller);
  };

  /// Call the Facebook Graph API using the stored access token to fetch
  /// all commerce listings owned by the authenticated user.
  /// Endpoint: GET https://graph.facebook.com/v18.0/me/marketplace_listings
  public shared ({ caller }) func getFbListings() : async { #ok : [Types.FbListing]; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized: Must be logged in to fetch Facebook listings");
    };
    let creds = FbGraphLib.getFbCredentials(profiles, caller);
    switch (creds) {
      case null {
        return #err("No Facebook credentials saved — add your App ID and access token in profile settings");
      };
      case (?{ appId = _; accessToken }) {
        let url = "https://graph.facebook.com/v18.0/me/marketplace_listings?fields=id,name,description,price,category_name,images&access_token=" # accessToken;
        let response = try {
          await IC_HTTP.http_request({
            url;
            max_response_bytes = ?1_000_000;
            method = #get;
            headers = [
              { name = "Accept"; value = "application/json" },
            ];
            body = null;
            is_replicated = ?false;
          });
        } catch (_) {
          return #err("Failed to reach Facebook Graph API — check your internet connection or try again later");
        };
        if (response.status < 200 or response.status >= 300) {
          return #err("Facebook Graph API returned status " # response.status.toText() # " — check your access token");
        };
        let rawJson = switch (response.body.decodeUtf8()) {
          case null { return #err("Failed to decode Facebook API response") };
          case (?text) { text };
        };
        // Check for FB API error response
        if (rawJson.contains(#text "\"error\"")) {
          return #err("Facebook API error — your access token may be expired or invalid");
        };
        let listings = FbGraphLib.parseFbListingsResponse(rawJson);
        #ok(listings);
      };
    };
  };
};

import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Char "mo:core/Char";
import Common "../types/common";
import Types "../types/facebook-graph";
import ProfileTypes "../types/userprofile";

module {
  /// Persist Facebook Graph API credentials on the user's profile.
  /// Returns #err if the user has no profile yet.
  public func saveFbCredentials(
    profiles    : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
    userId      : Common.UserId,
    appId       : Text,
    accessToken : Text,
  ) : { #ok; #err : Text } {
    switch (profiles.get(userId)) {
      case null { #err("Profile not found — please complete registration first") };
      case (?existing) {
        let updated : ProfileTypes.UserProfile = {
          existing with
          fbAppId       = ?appId;
          fbAccessToken = ?accessToken;
        };
        profiles.add(userId, updated);
        #ok;
      };
    };
  };

  /// Return stored FB credentials for a user, or null if none saved.
  public func getFbCredentials(
    profiles : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
    userId   : Common.UserId,
  ) : ?Types.FbCredentials {
    switch (profiles.get(userId)) {
      case null { null };
      case (?profile) {
        switch (profile.fbAppId, profile.fbAccessToken) {
          case (?appId, ?accessToken) { ?{ appId; accessToken } };
          case _ { null };
        };
      };
    };
  };

  /// Parse the raw JSON response from the Facebook Graph API
  /// `/me/commerce_listings` endpoint into a list of FbListings.
  /// Handles the standard FB Graph API response shape:
  ///   { "data": [ { "id": "...", "name": "...", ... }, ... ] }
  public func parseFbListingsResponse(rawJson : Text) : [Types.FbListing] {
    let results = List.empty<Types.FbListing>();
    // Find the "data" array opening bracket
    let dataMarker = "\"data\":[";
    if (not rawJson.contains(#text dataMarker)) return [];

    // Split on object boundaries — each item starts with "{"
    let parts = rawJson.split(#text dataMarker);
    ignore parts.next(); // discard before marker
    let afterData = switch (parts.next()) {
      case null { return [] };
      case (?s) s;
    };

    // Split individual objects (naive: split on },{)
    let objectParts = afterData.split(#text "},{");
    for (objRaw in objectParts) {
      // Clean up stray brackets
      var obj = objRaw.trim(#predicate(func c { c == '[' or c == ']' or c == '{' or c == '}' or c == ' ' or c == '\n' }));
      if (obj.size() > 0) {
        let id          = extractJsonString(obj, "id");
        let title       = extractJsonString(obj, "name");
        let description = extractJsonString(obj, "description");
        let price       = extractJsonString(obj, "price");
        let category    = extractJsonString(obj, "category_name");
        let imageUrls   = extractJsonStringArray(obj, "images");
        switch (id, title) {
          case (?fbId, ?fbTitle) {
            results.add({
              id          = fbId;
              title       = fbTitle;
              description;
              price;
              category;
              imageUrls;
            });
          };
          case _ {}; // skip malformed entries
        };
      };
    };

    results.toArray();
  };

  // ── Private JSON helpers ─────────────────────────────────────────────────────

  /// Extract a JSON string value for a given key from a flat JSON object fragment.
  /// Handles: "key":"value" patterns.
  func extractJsonString(obj : Text, key : Text) : ?Text {
    let needle = "\"" # key # "\":\"";
    if (not obj.contains(#text needle)) return null;
    let parts = obj.split(#text needle);
    ignore parts.next();
    switch (parts.next()) {
      case null { null };
      case (?after) {
        // Value ends at next unescaped quote
        var value = "";
        var prevEscape = false;
        var done = false;
        for (c in after.toIter()) {
          if (not done) {
            if (prevEscape) {
              value := value # Text.fromChar(c);
              prevEscape := false;
            } else if (c == '\\') {
              prevEscape := true;
            } else if (c.toNat32() == 34) {
              done := true;
            } else {
              value := value # Text.fromChar(c);
            };
          };
        };
        if (value.size() == 0) null else ?value;
      };
    };
  };

  /// Extract an array of strings from a JSON array field.
  /// Simplified: looks for "key":["url1","url2"] patterns.
  func extractJsonStringArray(obj : Text, key : Text) : [Text] {
    let needle = "\"" # key # "\":[";
    if (not obj.contains(#text needle)) return [];
    let parts = obj.split(#text needle);
    ignore parts.next();
    let arrayContent = switch (parts.next()) {
      case null { return [] };
      case (?s) s;
    };
    // Take until closing bracket
    var content = "";
    var done = false;
    for (c in arrayContent.toIter()) {
      if (not done) {
        if (c == ']') { done := true } else { content := content # Text.fromChar(c) };
      };
    };
    // Split on commas, strip quotes
    let items = List.empty<Text>();
    for (item in content.split(#text ",")) {
      let stripped = item.trim(#predicate(func c { c.toNat32() == 34 or c == ' ' or c == '\n' }));
      if (stripped.size() > 0) items.add(stripped);
    };
    items.toArray();
  };
};

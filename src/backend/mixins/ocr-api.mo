import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Blob "mo:core/Blob";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import AppConfigTypes "../types/app-config";
import OcrTypes "../types/ocr";
import OcrLib "../lib/ocr";

mixin (
  accessControlState : AccessControl.AccessControlState,
  geminiConfig : { var current : ?OcrTypes.GeminiConfig },
  appConfig    : Map.Map<Text, AppConfigTypes.ConfigEntry>,
) {
  // Management canister reference for HTTP outcalls
  let IC_MANAGEMENT_OCR : actor {
    http_request : ({
      url : Text;
      max_response_bytes : ?Nat64;
      method : { #get; #head; #post };
      headers : [{ name : Text; value : Text }];
      body : ?Blob;
      is_replicated : ?Bool;
    }) -> async {
      status : Nat;
      headers : [{ name : Text; value : Text }];
      body : Blob;
    };
  } = actor "aaaaa-aa";

  /// Get the active Gemini API key exclusively from appConfig (stable, survives upgrades).
  func activeGeminiApiKey() : ?Text {
    switch (appConfig.get("gemini_api_key")) {
      case (?entry) {
        if (entry.value.size() > 0) { ?entry.value } else { null };
      };
      case null { null };
    };
  };

  /// Scan an image with Gemini OCR — accepts a base64-encoded JPEG image and returns extracted fields.
  /// The image should be pre-processed (resized to max 1024x1024, converted to JPEG)
  /// before being sent here. imageBase64 is a standard base64-encoded string (no data URI prefix).
  public shared ({ caller }) func ocrScanImage(
    imageBase64 : Text,
  ) : async { #ok : OcrTypes.OcrResult; #err : Text } {
    // Require authentication
    if (caller.isAnonymous()) {
      return #err("Authentication required");
    };

    // Read API key from appConfig at call time (never cached)
    let apiKey = switch (activeGeminiApiKey()) {
      case null {
        return #err("OCR not configured. Add Gemini API key in admin Settings.");
      };
      case (?k) { k };
    };

    // Build request body
    let requestBody = OcrLib.buildGeminiRequestBody(imageBase64);
    let url = OcrLib.geminiUrl(apiKey);

    // Call Gemini API via HTTP outcall — attach cycles required by ICP
    let response = try {
      await (with cycles = 2_000_000_000) IC_MANAGEMENT_OCR.http_request({
        url;
        method = #post;
        body = ?requestBody.encodeUtf8();
        headers = [
          { name = "Content-Type"; value = "application/json" },
        ];
        max_response_bytes = ?50_000;
        is_replicated = null;
      });
    } catch (e) {
      return #err("OCR scan failed: " # e.message());
    };

    // Handle HTTP status codes
    if (response.status == 429) {
      return #err("Rate limit reached. Try again in 60 seconds.");
    };

    if (response.status == 403) {
      return #err("API key invalid or quota exceeded.");
    };

    if (response.status < 200 or response.status >= 300) {
      let errBody = switch (response.body.decodeUtf8()) {
        case (?t) { t };
        case null { "status " # debug_show(response.status) };
      };
      return #err("OCR scan failed: " # errBody);
    };

    // Decode and parse the response
    let responseText = switch (response.body.decodeUtf8()) {
      case null { return #err("Could not read listing data from this image.") };
      case (?t) { t };
    };

    switch (OcrLib.parseGeminiResponse(responseText)) {
      case null { #err("Could not read listing data from this image.") };
      case (?result) { #ok(result) };
    };
  };

  // ── Admin: Gemini Config ──────────────────────────────────────────────────

  /// Admin: get Gemini OCR configuration status.
  /// Reads exclusively from appConfig (stable). NEVER returns the raw API key.
  public query ({ caller }) func adminGetGeminiConfig() : async {
    configured : Bool;
    model : Text;
  } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized");
    };
    let configured = switch (appConfig.get("gemini_api_key")) {
      case (?entry) { entry.value.size() > 0 };
      case null { false };
    };
    { configured; model = "gemini-2.5-flash-lite" };
  };

  /// Admin: save the Gemini API key.
  /// Writes ONLY to appConfig (stable Map). Never touches geminiConfig.current.
  public shared ({ caller }) func adminSaveGeminiConfig(
    apiKey : Text,
  ) : async { #ok; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized");
    };
    let now = Time.now();
    appConfig.add("gemini_api_key", {
      key       = "gemini_api_key";
      value     = apiKey;
      encrypted = true;
      category  = "ocr";
      updatedAt = now;
      updatedBy = caller.toText();
    });
    #ok;
  };

  /// Admin: test the Gemini connection by sending a minimal 1x1 white JPEG image.
  /// Reads the API key exclusively from appConfig.
  public shared ({ caller }) func adminTestGeminiConnection() : async {
    #ok : Text;
    #err : Text;
  } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized");
    };

    let apiKey = switch (activeGeminiApiKey()) {
      case null {
        return #err("API key not configured. Set it in admin Settings.");
      };
      case (?k) { k };
    };

    // Minimal 1x1 white JPEG (base64) to test the actual vision API path
    let testImageBase64 = "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUEB//EAB0QAAICAgMBAAAAAAAAAAAAAAECAAMEBRESIf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDJ2e7LK7bdkqjKLFYlVAA4PJpSlKVKAUpSlKAUpSlKAUpSlKA/9k=";

    let testBody = "{\"contents\":[{\"parts\":[{\"inlineData\":{\"mimeType\":\"image/jpeg\",\"data\":\"" # testImageBase64 # "\"}},{\"text\":\"Respond with the word: ok\"}]}]}";
    let url = OcrLib.geminiUrl(apiKey);

    let response = try {
      await (with cycles = 2_000_000_000) IC_MANAGEMENT_OCR.http_request({
        url;
        method = #post;
        body = ?testBody.encodeUtf8();
        headers = [
          { name = "Content-Type"; value = "application/json" },
        ];
        max_response_bytes = ?8_192;
        is_replicated = null;
      });
    } catch (e) {
      return #err("Connection failed: " # e.message());
    };

    if (response.status == 403) {
      return #err("Connection failed: API key invalid or quota exceeded.");
    };

    if (response.status == 429) {
      return #err("Connection failed: Rate limit reached. Try again in 60 seconds.");
    };

    if (response.status < 200 or response.status >= 300) {
      let errBody = switch (response.body.decodeUtf8()) {
        case (?t) { t };
        case null { "HTTP " # debug_show(response.status) };
      };
      return #err("Connection failed: " # errBody);
    };

    let responseText = switch (response.body.decodeUtf8()) {
      case null { return #err("Connection failed: empty response") };
      case (?t) { t };
    };

    // Check if response contains "ok" (case-insensitive via toLower)
    if (responseText.toLower().contains(#text "ok")) {
      #ok("Connected — OCR Active. Model: gemini-2.5-flash-lite");
    } else {
      #err("Connection failed: unexpected response — " # responseText);
    };
  };
};

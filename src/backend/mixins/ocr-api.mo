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
  // Management canister reference factory — instantiated locally per call to avoid
  // stable type compatibility issues on upgrade (actor refs at mixin scope are stable state).
  func icManagementOcr() : actor {
    http_request : ({
      url : Text;
      max_response_bytes : ?Nat64;
      method : { #get; #head; #post };
      headers : [{ name : Text; value : Text }];
      body : ?Blob;
      is_replicated : ?Bool;
      transform : ?{
        function : shared query ({
          response : {
            status : Nat;
            headers : [{ name : Text; value : Text }];
            body : Blob;
          };
          context : Blob;
        }) -> async {
          status : Nat;
          headers : [{ name : Text; value : Text }];
          body : Blob;
        };
        context : Blob;
      };
    }) -> async {
      status : Nat;
      headers : [{ name : Text; value : Text }];
      body : Blob;
    };
  } {
    actor "aaaaa-aa"
  };

  /// Transform function for Gemini OCR responses.
  /// Strips all headers and variable metadata (usageMetadata, modelVersion, etc.).
  /// Extracts ONLY candidates[0].content.parts[0].text — the stable listing JSON.
  /// Every replica must return identical data for ICP consensus.
  public query func transformGeminiResponse(raw : {
    response : {
      status : Nat;
      headers : [{ name : Text; value : Text }];
      body : Blob;
    };
    context : Blob;
  }) : async {
    status : Nat;
    headers : [{ name : Text; value : Text }];
    body : Blob;
  } {
    // Extract only the stable text content from the Gemini response.
    // Strips usageMetadata, modelVersion, and all other variable fields.
    // On error responses, preserve the error message for debugging.
    let stableBody : Blob = switch (raw.response.body.decodeUtf8()) {
      case null {
        "{}".encodeUtf8()
      };
      case (?bodyText) {
        // Check for candidates array (success path)
        let textMarker = "\"text\":\"";
        let parts = bodyText.split(#text textMarker);
        ignore parts.next(); // skip preamble
        switch (parts.next()) {
          case null {
            // No text field found — preserve error body for debugging
            // Strip only non-deterministic metadata fields; keep error message
            let errMarker = "\"message\":\"";
            let errParts = bodyText.split(#text errMarker);
            ignore errParts.next();
            switch (errParts.next()) {
              case null {
                // Return status-only wrapper so error is not completely lost
                ("{\"error\":\"status_" # raw.response.status.toText() # "\"}").encodeUtf8()
              };
              case (?afterErr) {
                let errMsgParts = afterErr.split(#char '\"');
                let errMsg = switch (errMsgParts.next()) {
                  case null { "unknown" };
                  case (?m) { m };
                };
                ("{\"error\":\"" # OcrLib.escapeJsonString(errMsg) # "\"}").encodeUtf8()
              };
            };
          };
          case (?afterText) {
            // Un-escape the JSON string to get the actual inner JSON text
            let innerJson = OcrLib.unescapeJsonString(afterText);
            let cleaned = OcrLib.stripMarkdownFences(innerJson);
            // Return as { "text": "<stable-listing-json>" }
            let stableJson = "{\"text\":\"" # OcrLib.escapeJsonString(cleaned) # "\"}";
            stableJson.encodeUtf8()
          };
        };
      };
    };
    {
      status = raw.response.status;
      headers = []; // ALWAYS strip all headers for ICP consensus
      body = stableBody;
    }
  };

  /// Transform function for Gemini test connection responses.
  /// Strips headers and non-deterministic fields (usageMetadata, modelVersion, promptTokenCount, etc.)
  /// but KEEPS the candidates[0].content.parts[0].text field, which is stable.
  /// Also preserves error messages from the error response body.
  public query func transformGeminiTestResponse(raw : {
    response : {
      status : Nat;
      headers : [{ name : Text; value : Text }];
      body : Blob;
    };
    context : Blob;
  }) : async {
    status : Nat;
    headers : [{ name : Text; value : Text }];
    body : Blob;
  } {
    let stableBody : Blob = switch (raw.response.body.decodeUtf8()) {
      case null { "{}".encodeUtf8() };
      case (?bodyText) {
        // Try to extract the text field from candidates (success path)
        let textMarker = "\"text\":\"";
        let parts = bodyText.split(#text textMarker);
        ignore parts.next();
        switch (parts.next()) {
          case (?afterText) {
            // Un-escape to get the actual response word
            let textValue = OcrLib.unescapeJsonString(afterText);
            ("{\"text\":\"" # OcrLib.escapeJsonString(textValue) # "\"}").encodeUtf8()
          };
          case null {
            // Error response — extract the error message field
            let errMarker = "\"message\":\"";
            let errParts = bodyText.split(#text errMarker);
            ignore errParts.next();
            switch (errParts.next()) {
              case null {
                ("{\"status\":" # raw.response.status.toText() # "}").encodeUtf8()
              };
              case (?afterErr) {
                let errMsg = OcrLib.unescapeJsonString(afterErr);
                ("{\"error\":\"" # OcrLib.escapeJsonString(errMsg) # "\"}").encodeUtf8()
              };
            };
          };
        };
      };
    };
    {
      status = raw.response.status;
      headers = [];
      body = stableBody;
    }
  };

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

    // Call Gemini API via HTTP outcall.
    // Cycles: 100_000_000_000 required for a POST request with image data.
    // transform: strips all variable fields (usageMetadata, headers) so every replica
    // receives identical data — required for ICP consensus.
    let response = try {
      await (with cycles = 100_000_000_000) icManagementOcr().http_request({
        url;
        method = #post;
        body = ?requestBody.encodeUtf8();
        headers = [
          { name = "Content-Type"; value = "application/json" },
        ];
        max_response_bytes = ?50_000;
        is_replicated = ?false;
        transform = ?{
          function = transformGeminiResponse;
          context = Blob.fromArray([]);
        };
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
        case (?t) {
          // Transform extracts error message into {"error":"<msg>"} format
          switch (OcrLib.parseTestResponseError(t)) {
            case (?msg) { msg };
            case null { t };
          };
        };
        case null { "status " # debug_show(response.status) };
      };
      return #err("OCR scan failed: " # errBody);
    };

    // The transform function already extracted the stable text content.
    // Response body is now: {"text":"<listing-fields-json>"}
    let responseText = switch (response.body.decodeUtf8()) {
      case null { return #err("Could not read listing data from this image.") };
      case (?t) { t };
    };

    // parseGeminiResponse expects the transform-produced {"text":"..."} format
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
  /// Returns { success, message } — never returns empty {}.
  public shared ({ caller }) func adminTestGeminiConnection() : async {
    success : Bool;
    message : Text;
  } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return { success = false; message = "Unauthorized" };
    };

    let apiKey = switch (activeGeminiApiKey()) {
      case null {
        return { success = false; message = "API key not configured. Set it in admin Settings." };
      };
      case (?k) { k };
    };

    // Minimal 1x1 white JPEG (base64) to test the actual vision API path
    let testImageBase64 = "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUEB//EAB0QAAICAgMBAAAAAAAAAAAAAAECAAMEBRESIf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDJ2e7LK7bdkqjKLFYlVAA4PJpSlKVKAUpSlKAUpSlKAUpSlKA/9k=";

    let testBody = "{\"contents\":[{\"parts\":[{\"inlineData\":{\"mimeType\":\"image/jpeg\",\"data\":\"" # testImageBase64 # "\"}},{\"text\":\"Describe this image in one word.\"}]}]}";
    let url = OcrLib.geminiUrl(apiKey);

    let response = try {
      await (with cycles = 20_949_972_000) icManagementOcr().http_request({
        url;
        method = #post;
        body = ?testBody.encodeUtf8();
        headers = [
          { name = "Content-Type"; value = "application/json" },
        ];
        max_response_bytes = ?8_192;
        is_replicated = ?false;
        transform = ?{
          function = transformGeminiTestResponse;
          context = Blob.fromArray([]);
        };
      });
    } catch (e) {
      return { success = false; message = "Connection failed: " # e.message() };
    };

    let responseText = switch (response.body.decodeUtf8()) {
      case null { return { success = false; message = "Connection failed: empty response" } };
      case (?t) { t };
    };

    if (response.status == 400) {
      let errMsg = switch (OcrLib.parseTestResponseError(responseText)) {
        case (?m) { m };
        case null { "Invalid API key or request" };
      };
      return { success = false; message = "Connection failed: HTTP 400 - " # errMsg };
    };

    if (response.status == 403) {
      let errMsg = switch (OcrLib.parseTestResponseError(responseText)) {
        case (?m) { m };
        case null { "API key invalid or quota exceeded" };
      };
      return { success = false; message = "Connection failed: HTTP 403 - " # errMsg };
    };

    if (response.status == 429) {
      return { success = false; message = "Connection failed: HTTP 429 - Rate limit reached. Try again in 60 seconds." };
    };

    if (response.status < 200 or response.status >= 300) {
      let errMsg = switch (OcrLib.parseTestResponseError(responseText)) {
        case (?m) { m };
        case null { "Unknown error" };
      };
      return { success = false; message = "Connection failed: HTTP " # response.status.toText() # " - " # errMsg };
    };

    // Parse the text field from the transformed response
    let responseWord = switch (OcrLib.parseTestResponseText(responseText)) {
      case (?word) { word };
      case null { responseText };
    };

    if (responseWord.size() > 0) {
      { success = true; message = "Connected — OCR Active. Model: gemini-2.5-flash-lite. Response: " # responseWord }
    } else {
      { success = false; message = "Connection failed: HTTP " # response.status.toText() # " - Empty or unreadable response from Gemini" }
    };
  };
};

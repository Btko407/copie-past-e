import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Blob "mo:core/Blob";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import AppConfigTypes "../types/app-config";
import OcrTypes "../types/ocr";
import OcrLib "../lib/ocr";
import MonitoringLib "../lib/monitoring";

mixin (
  accessControlState : AccessControl.AccessControlState,
  geminiConfig : { var current : ?OcrTypes.GeminiConfig },
  appConfig    : Map.Map<Text, AppConfigTypes.ConfigEntry>,
  ocrFailureLog : List.List<OcrTypes.OcrFailureEntry>,
  monLogs        : Map.Map<Nat, MonitoringLib.MonitoringLogEntry>,
  monNextIndex   : { var value : Nat },
  monTotalLogged : { var value : Nat },
) {
  let OCR_FAILURE_LOG_MAX : Nat = 500;

  /// Classify an error text into one of the standard error type labels.
  func classifyOcrError(errText : Text) : Text {
    let lower = errText.toLower();
    if (lower.contains(#text "401") or lower.contains(#text "403")
        or lower.contains(#text "api key") or lower.contains(#text "apikey")) {
      "auth_error"
    } else if (lower.contains(#text "429") or lower.contains(#text "rate")) {
      "rate_limit"
    } else if (lower.contains(#text "quota")) {
      "quota_error"
    } else if (lower.contains(#text "parse") or lower.contains(#text "empty")
               or lower.contains(#text "{}")) {
      "parse_error"
    } else if (lower.contains(#text "empty_response")) {
      "empty_response"
    } else {
      "api_error"
    }
  };

  /// Extract first 32 characters of a text as a fingerprint hash.
  func imageFingerprint(s : Text) : Text {
    var result = "";
    var count = 0;
    label scan for (c in s.toIter()) {
      if (count >= 32) { break scan };
      result #= Text.fromChar(c);
      count += 1;
    };
    result
  };

  /// Append a failure entry to the ring buffer; drop oldest entries when over cap.
  func logOcrFailure(imageBase64 : Text, errorReason : Text, userPrincipal : Text) {
    let entry : OcrTypes.OcrFailureEntry = {
      imageHash     = imageFingerprint(imageBase64);
      errorReason;
      errorType     = classifyOcrError(errorReason);
      timestamp     = Time.now();
      userPrincipal;
    };
    ocrFailureLog.add(entry);
    // Cap at OCR_FAILURE_LOG_MAX by dropping the oldest (front) entries
    if (ocrFailureLog.size() > OCR_FAILURE_LOG_MAX) {
      let excess = ocrFailureLog.size() - OCR_FAILURE_LOG_MAX;
      let kept = ocrFailureLog.sliceToArray(excess.toInt(), ocrFailureLog.size().toInt());
      ocrFailureLog.clear();
      for (e in kept.values()) { ocrFailureLog.add(e) };
    };
  };
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

  /// Config validation gate: traps if Gemini API key is not configured.
  /// Call at the start of every function that makes Gemini API calls.
  func assertGeminiConfig() {
    switch (appConfig.get("gemini_api_key")) {
      case (?entry) {
        if (entry.value.size() == 0) {
          Runtime.trap("CONFIG_INVALID: Missing required API keys");
        };
      };
      case null {
        Runtime.trap("CONFIG_INVALID: Missing required API keys");
      };
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

    MonitoringLib.logEvent(monLogs, monNextIndex, monTotalLogged, "info", "OCR", "ocrScanImage called");

    assertGeminiConfig();

    let principalText = caller.toText();

    // Read API key from appConfig at call time (never cached)
    let apiKey = switch (activeGeminiApiKey()) {
      case null {
        let reason = "OCR not configured. Add Gemini API key in admin Settings.";
        logOcrFailure(imageBase64, reason, principalText);
        return #err(reason);
      };
      case (?k) { k };
    };

    // Build request body
    let requestBody = OcrLib.buildGeminiRequestBody(imageBase64);
    let url = OcrLib.geminiUrl(apiKey);

    // Call Gemini API via HTTP outcall.
    // Cycles: 100_000_000_000 (100B) required for a POST request with image data.
    // is_replicated = ?false: non-replicated call — only one replica makes the request.
    // max_response_bytes = ?(2 * 1024 * 1024): 2 MiB cap prevents runaway responses.
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
        max_response_bytes = ?(2 * 1024 * 1024);
        is_replicated = ?false;
        transform = ?{
          function = transformGeminiResponse;
          context = Blob.fromArray([]);
        };
      });
    } catch (e) {
      let reason = "OCR scan failed: " # e.message();
      MonitoringLib.logEvent(monLogs, monNextIndex, monTotalLogged, "error", "OCR", "Scan failed: " # reason);
      logOcrFailure(imageBase64, reason, principalText);
      return #err(reason);
    };

    // Handle HTTP status codes
    if (response.status == 429) {
      let reason = "Rate limit reached. Try again in 60 seconds.";
      logOcrFailure(imageBase64, reason, principalText);
      return #err(reason);
    };

    if (response.status == 403) {
      let reason = "API key invalid or quota exceeded.";
      logOcrFailure(imageBase64, reason, principalText);
      return #err(reason);
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
      let reason = "OCR scan failed: " # errBody;
      logOcrFailure(imageBase64, reason, principalText);
      return #err(reason);
    };

    // The transform function already extracted the stable text content.
    // Response body is now: {"text":"<listing-fields-json>"}
    let responseText = switch (response.body.decodeUtf8()) {
      case null {
        let reason = "Could not read listing data from this image.";
        logOcrFailure(imageBase64, reason, principalText);
        return #err(reason);
      };
      case (?t) { t };
    };

    // parseGeminiResponse expects the transform-produced {"text":"..."} format
    switch (OcrLib.parseGeminiResponse(responseText)) {
      case null {
        let reason = "Could not read listing data from this image.";
        logOcrFailure(imageBase64, reason, principalText);
        #err(reason)
      };
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

  // ── OCR Failure Log ───────────────────────────────────────────────────────

  /// Admin: retrieve recent OCR failures (most recent last, up to `limit` entries).
  /// Returns entries in insertion order (oldest first when limit < total).
  public query ({ caller }) func getOcrFailureLog(limit : Nat) : async [OcrTypes.OcrFailureEntry] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized");
    };
    let total = ocrFailureLog.size();
    if (total == 0 or limit == 0) {
      return [];
    };
    let start : Int = if (total > limit) { (total - limit).toInt() } else { 0 };
    ocrFailureLog.sliceToArray(start, total.toInt())
  };
};

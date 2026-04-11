import Text "mo:core/Text";
import OcrTypes "../types/ocr";

module {
  /// Returns a default (unconfigured) GeminiConfig.
  public func emptyConfig() : OcrTypes.GeminiConfig = {
    apiKey = null;
    model = "gemini-2.5-flash-lite";
  };

  /// Escape special characters in a string for safe JSON embedding.
  public func escapeJsonString(s : Text) : Text {
    var result = "";
    for (c in s.toIter()) {
      let escaped = switch (c) {
        case ('\"') { "\\\"" };
        case ('\\') { "\\\\" };
        case ('\n') { "\\n" };
        case ('\r') { "\\r" };
        case ('\t') { "\\t" };
        case (other) { Text.fromChar(other) };
      };
      result := result # escaped;
    };
    result;
  };

  /// Build the JSON request body for Gemini generateContent.
  /// imageBase64 must already be a standard base64-encoded JPEG string.
  public func buildGeminiRequestBody(imageBase64 : Text) : Text {
    let extractionPrompt = "You are a marketplace listing data extractor. Extract the following fields from this listing image. title: the item name or listing title. price: the numeric price only, no currency symbols. description: the full item description text. category: must be exactly one of: Appliances, Automotive, Baby & Kids, Books & Magazines, Clothing & Shoes, Collectibles, Electronics & Media, Furniture, Home & Garden, Jewelry & Accessories, Tools & Machinery, Office Supplies, Services. Choose the closest match. condition: must be exactly one of: New, Used -- Good, Used -- Fair, Used -- Normal Wear. Use empty string if not visible. brand: the brand name if visible. Empty string if not. Use empty string for any field not visible in the image. Never invent data not present in the image.";

    "{\"generationConfig\":{\"responseMimeType\":\"application/json\",\"responseSchema\":{\"type\":\"object\",\"properties\":{\"title\":{\"type\":\"string\"},\"price\":{\"type\":\"string\"},\"description\":{\"type\":\"string\"},\"category\":{\"type\":\"string\"},\"condition\":{\"type\":\"string\"},\"brand\":{\"type\":\"string\"}}}},\"contents\":[{\"parts\":[{\"text\":\"" # escapeJsonString(extractionPrompt) # "\"},{\"inlineData\":{\"mimeType\":\"image/jpeg\",\"data\":\"" # imageBase64 # "\"}}]}]}";
  };

  /// Parse a JSON string field from a flat JSON object.
  /// Returns the raw string value (unescaped) for the given key, or "" if not found.
  public func parseJsonField(json : Text, field : Text) : Text {
    let marker = "\"" # field # "\":\"";
    let parts = json.split(#text marker);
    ignore parts.next(); // skip content before the field
    switch (parts.next()) {
      case null { "" };
      case (?afterMarker) {
        // Read until the first closing quote
        let valueParts = afterMarker.split(#char '\"');
        switch (valueParts.next()) {
          case null { "" };
          case (?value) { value };
        };
      };
    };
  };

  /// Un-escape a JSON-string-encoded value: converts \" → ", \\ → \, \n → newline, etc.
  /// Stops at the first unescaped closing quote.
  public func unescapeJsonString(s : Text) : Text {
    var result = "";
    var escape = false;
    var done = false;
    for (c in s.toIter()) {
      if (not done) {
        if (escape) {
          let unescaped = switch (c) {
            case ('\"') { "\"" };
            case ('\\') { "\\" };
            case ('n') { "\n" };
            case ('r') { "\r" };
            case ('t') { "\t" };
            case (other) { Text.fromChar(other) };
          };
          result := result # unescaped;
          escape := false;
        } else if (c == '\\') {
          escape := true;
        } else if (c == '\"') {
          done := true; // closing quote — stop
        } else {
          result := result # Text.fromChar(c);
        };
      };
    };
    result;
  };

  /// Strip markdown code fences (```json / ```) from a string and trim whitespace.
  public func stripMarkdownFences(s : Text) : Text {
    var result = s;
    result := result.replace(#text "```json", "");
    result := result.replace(#text "```", "");
    result := result.trim(#char ' ');
    result := result.trim(#char '\n');
    result;
  };

  /// Parse a Gemini generateContent response body into OcrResult.
  /// Returns null if the response cannot be parsed.
  public func parseGeminiResponse(responseBody : Text) : ?OcrTypes.OcrResult {
    // Find the text field value inside candidates[0].content.parts[0].text
    let textMarker = "\"text\":\"";
    let parts = responseBody.split(#text textMarker);
    ignore parts.next(); // skip preamble
    let innerJson = switch (parts.next()) {
      case null { return null };
      case (?afterText) {
        // Un-escape the JSON string value (stops at closing quote)
        unescapeJsonString(afterText);
      };
    };

    let cleaned = stripMarkdownFences(innerJson);
    if (cleaned.size() == 0) { return null };

    let title = parseJsonField(cleaned, "title");
    let price = parseJsonField(cleaned, "price");
    let description = parseJsonField(cleaned, "description");
    let category = parseJsonField(cleaned, "category");
    let condition = parseJsonField(cleaned, "condition");
    let brand = parseJsonField(cleaned, "brand");

    ?{
      title;
      price;
      description;
      category;
      condition;
      brand;
    };
  };

  /// Build the Gemini API URL from an API key.
  public func geminiUrl(apiKey : Text) : Text {
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=" # apiKey;
  };
};

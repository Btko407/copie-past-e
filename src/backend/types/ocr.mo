module {
  /// Gemini OCR configuration stored in canister state.
  /// The API key is stored as opt Text — absent means "not configured".
  /// The model name is hardcoded to gemini-2.5-flash-lite.
  public type GeminiConfig = {
    apiKey : ?Text;
    model : Text; // always "gemini-2.5-flash-lite"
  };

  /// The structured result returned by OCR scan.
  public type OcrResult = {
    title : Text;
    price : Text;
    description : Text;
    category : Text;
    condition : Text;
    brand : Text;
  };

  /// A single OCR failure log entry.
  /// Stored in the ocrFailureLog ring buffer (capped at 500 entries).
  public type OcrFailureEntry = {
    imageHash    : Text; // first 32 chars of imageBase64 as a fingerprint
    errorReason  : Text; // exact error text
    errorType    : Text; // "api_error" | "parse_error" | "auth_error" | "rate_limit" | "quota_error" | "empty_response"
    timestamp    : Int;  // Time.now() at the time of failure
    userPrincipal: Text; // caller.toText()
  };
};

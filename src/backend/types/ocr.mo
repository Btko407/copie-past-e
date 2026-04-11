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
};

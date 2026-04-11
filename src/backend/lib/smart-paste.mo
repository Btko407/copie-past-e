import Text "mo:core/Text";
import List "mo:core/List";
import Types "../types/smart-paste";

module {
  /// Parse arbitrary pasted listing text and extract structured fields.
  /// Returns null for any field that cannot be reliably identified.
  public func parsePastedText(text : Text) : Types.ParsedListingResult {
    let lines = text.split(#text "\n").toArray();

    let title = extractTitle(lines, text);
    let price = extractPrice(text);
    let category = extractCategory(text);
    let description = extractDescription(lines, text);

    { title; price; description; category };
  };

  // ── Private helpers ──────────────────────────────────────────────────────────

  /// Extract a title: use the first non-empty line that looks like a product name.
  /// Skips very short lines (<3 chars) and lines that are just prices.
  func extractTitle(lines : [Text], _text : Text) : ?Text {
    for (line in lines.vals()) {
      let trimmed = line.trim(#predicate(func c { c == ' ' or c == '\t' or c == '\r' }));
      if (trimmed.size() >= 3 and not isPriceLine(trimmed)) {
        return ?trimmed;
      };
    };
    null;
  };

  /// Detect if a line is purely a price string (e.g. "$25", "25.00", "FREE").
  func isPriceLine(line : Text) : Bool {
    let lower = line.toLower();
    if (lower == "free" or lower == "free!" or lower == "$0") return true;
    // Line starts with $ and rest is numeric
    if (line.startsWith(#text "$")) {
      let rest = switch (line.stripStart(#text "$")) {
        case (?r) r;
        case null { return false };
      };
      return isNumericish(rest);
    };
    // Line is just a number (possibly with decimal)
    isNumericish(line);
  };

  /// Returns true if the text looks like a plain number (e.g. "25", "25.00").
  func isNumericish(t : Text) : Bool {
    if (t.size() == 0) return false;
    var hasDot = false;
    for (c in t.toIter()) {
      if (c >= '0' and c <= '9') {
        // fine
      } else if (c == '.' and not hasDot) {
        hasDot := true;
      } else {
        return false;
      };
    };
    true;
  };

  /// Extract the first price-like token ($X, $X.XX, "FREE") from the full text.
  func extractPrice(text : Text) : ?Text {
    // Check for FREE keyword first
    let lower = text.toLower();
    if (lower.contains(#text "free")) {
      // Only if "free" appears as a word-like token (not part of "freeway" etc.)
      // Simple heuristic: check for "free" bounded by spaces/punctuation
    };

    // Look for $amount patterns by scanning tokens
    let tokens = text.split(#predicate(func c {
      c == ' ' or c == '\t' or c == '\n' or c == '\r' or c == ',' or c == '(' or c == ')'
    }));
    for (token in tokens) {
      let trimmed = token.trim(#predicate(func c { c == '.' or c == '!' or c == '?' }));
      if (trimmed.startsWith(#text "$") and trimmed.size() > 1) {
        let afterDollar = switch (trimmed.stripStart(#text "$")) {
          case (?r) r;
          case null { "" };
        };
        if (isNumericish(afterDollar) or isDecimalPrice(afterDollar)) {
          return ?trimmed;
        };
      };
    };

    // No $ found — look for "Price:" or "Asking:" labels
    let priceLabelPrefixes = ["price:", "asking:", "cost:", "priced at "];
    for (prefix in priceLabelPrefixes.vals()) {
      if (lower.contains(#text prefix)) {
        let parts = lower.split(#text prefix);
        ignore parts.next();
        switch (parts.next()) {
          case null {};
          case (?after) {
            // Extract next token from after
            let afterTrimmed = after.trim(#predicate(func c { c == ' ' or c == '\t' }));
            let subTokens = afterTrimmed.split(#predicate(func c {
              c == ' ' or c == '\t' or c == '\n'
            }));
            switch (subTokens.next()) {
              case null {};
              case (?tok) {
                let tokTrimmed = tok.trim(#predicate(func c { c == '.' or c == '!' }));
                if (tokTrimmed.startsWith(#text "$")) return ?tokTrimmed;
                if (isNumericish(tokTrimmed)) return ?("$" # tokTrimmed);
                if (isDecimalPrice(tokTrimmed)) return ?("$" # tokTrimmed);
              };
            };
          };
        };
      };
    };

    null;
  };

  /// Returns true if text looks like decimal price (e.g. "25.00", "1500.50").
  func isDecimalPrice(t : Text) : Bool {
    if (t.size() == 0) return false;
    var hasDot = false;
    var digitCount = 0;
    for (c in t.toIter()) {
      if (c >= '0' and c <= '9') {
        digitCount += 1;
      } else if (c == '.' and not hasDot) {
        hasDot := true;
      } else {
        return false;
      };
    };
    digitCount > 0 and hasDot;
  };

  /// Identify a category from keywords in the full text.
  /// Returns the best-match category or null.
  func extractCategory(text : Text) : ?Text {
    let lower = text.toLower();

    // Category keywords mapped to canonical names
    let categories : [(Text, [Text])] = [
      ("Electronics", ["iphone", "samsung", "laptop", "computer", "tablet", "ipad", "phone", "tv", "television", "monitor", "keyboard", "mouse", "headphone", "speaker", "camera", "gaming", "xbox", "playstation", "nintendo", "console", "charger", "cable", "electronic"]),
      ("Vehicles", ["car", "truck", "motorcycle", "bike", "suv", "van", "vehicle", "auto", "jeep", "honda", "toyota", "ford", "chevy", "bmw", "tesla", "mileage", "miles", "engine", "transmission"]),
      ("Furniture", ["sofa", "couch", "chair", "table", "desk", "bed", "dresser", "shelf", "bookcase", "cabinet", "wardrobe", "mattress", "furniture", "ottoman", "recliner", "sectional"]),
      ("Clothing", ["shirt", "pants", "dress", "jeans", "jacket", "coat", "shoes", "boots", "sneakers", "clothing", "apparel", "size", "xs", "small", "medium", "large", "xl", "xxl", "hoodie", "sweater"]),
      ("Sports", ["bike", "bicycle", "weights", "gym", "fitness", "treadmill", "yoga", "golf", "tennis", "basketball", "football", "soccer", "sports", "exercise", "workout"]),
      ("Home", ["kitchen", "appliance", "refrigerator", "washer", "dryer", "microwave", "blender", "vacuum", "lamp", "rug", "curtain", "decor", "home", "garden", "outdoor", "patio"]),
      ("Garden", ["lawn", "garden", "mower", "plant", "flower", "soil", "shovel", "rake", "hose", "outdoor", "yard"]),
      ("Tools", ["drill", "saw", "hammer", "wrench", "toolbox", "screwdriver", "power tool", "tool", "ladder", "level", "measuring"]),
      ("Toys", ["toy", "lego", "doll", "game", "puzzle", "kids", "children", "baby", "stroller", "playpen"]),
      ("Books", ["book", "novel", "textbook", "magazine", "comic", "fiction", "nonfiction", "paperback", "hardcover"]),
    ];

    for ((catName, keywords) in categories.vals()) {
      for (keyword in keywords.vals()) {
        if (lower.contains(#text keyword)) {
          return ?catName;
        };
      };
    };

    null;
  };

  /// Extract description: everything after the first line (title), excluding the price line.
  /// Returns null if there is no meaningful description content.
  func extractDescription(lines : [Text], _text : Text) : ?Text {
    // Skip the first line (used as title) and collect the rest
    var skippedFirst = false;
    let descLines = List.empty<Text>();
    for (line in lines.vals()) {
      let trimmed = line.trim(#predicate(func c { c == ' ' or c == '\t' or c == '\r' }));
      if (not skippedFirst) {
        if (trimmed.size() >= 3) {
          skippedFirst := true;
          // Don't add the title line
        };
      } else {
        // Include non-empty lines that aren't just price tokens
        if (trimmed.size() > 0 and not isPriceLine(trimmed)) {
          descLines.add(trimmed);
        };
      };
    };

    let arr = descLines.toArray();
    if (arr.size() == 0) return null;

    var result = "";
    for (i in arr.keys()) {
      if (i > 0) result := result # "\n";
      result := result # arr[i];
    };

    let final = result.trim(#predicate(func c { c == ' ' or c == '\t' or c == '\n' or c == '\r' }));
    if (final.size() == 0) null else ?final;
  };
};

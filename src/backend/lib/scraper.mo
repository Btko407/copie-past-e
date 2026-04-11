import Text "mo:core/Text";
import List "mo:core/List";
import Types "../types/scraper";

module {
  /// Detect which marketplace the URL belongs to.
  public func detectSource(url : Text) : Types.MarketplaceSource {
    let lower = url.toLower();
    if (lower.contains(#text "facebook.com/marketplace") or lower.contains(#text "fb.com/marketplace")) {
      #facebookMarketplace;
    } else if (lower.contains(#text "offerup.com") or lower.contains(#text "offerup.co")) {
      #offerUp;
    } else {
      #unknown;
    };
  };

  /// Parse a raw HTML body fetched from a Facebook Marketplace listing.
  /// Extracts og:title, og:description, og:image, and price meta tags.
  public func parseFacebookMarketplace(url : Text, htmlBody : Text) : Types.ScrapedListing {
    let title = extractMetaContent(htmlBody, "og:title");
    let description = extractMetaContent(htmlBody, "og:description");
    let rawPrice = extractMetaContent(htmlBody, "product:price:amount");
    let price = switch (rawPrice) {
      case null null;
      case (?p) ?normalisePrice(p);
    };
    let category = extractBreadcrumbCategory(htmlBody);
    let imageUrls = extractOgImages(htmlBody);
    {
      source = #facebookMarketplace;
      sourceUrl = url;
      title;
      description;
      price;
      category;
      imageUrls;
    };
  };

  /// Parse a raw HTML body fetched from an OfferUp listing.
  /// Uses ld+json schema.org Product data first; falls back to og: meta tags if ld+json returns empty fields.
  public func parseOfferUp(url : Text, htmlBody : Text) : Types.ScrapedListing {
    let ldTitle = switch (extractLdJsonField(htmlBody, "\"name\"")) {
      case (?t) ?t;
      case null extractTitleTag(htmlBody);
    };
    let ldDescription = extractLdJsonField(htmlBody, "\"description\"");
    let ldPrice = extractLdJsonField(htmlBody, "\"price\"");

    // Fall back to og: meta tags when ld+json yields nothing
    let title = switch (ldTitle) {
      case (?t) ?t;
      case null extractMetaContent(htmlBody, "og:title");
    };
    let description = switch (ldDescription) {
      case (?d) ?d;
      case null extractMetaContent(htmlBody, "og:description");
    };
    let rawPrice = switch (ldPrice) {
      case (?p) ?p;
      case null extractMetaContent(htmlBody, "og:price:amount");
    };
    let price = switch (rawPrice) {
      case null null;
      case (?p) ?normalisePrice(p);
    };
    let category = extractLdJsonField(htmlBody, "\"category\"");
    // Collect og:image URLs; supplement with any ld+json image fields
    let imageUrls = extractOgImages(htmlBody);
    {
      source = #offerUp;
      sourceUrl = url;
      title;
      description;
      price;
      category;
      imageUrls;
    };
  };

  /// Normalise a raw price string: strip non-numeric chars except dot, then prepend '$'.
  public func normalisePrice(rawPrice : Text) : Text {
    var result = "";
    var hasDot = false;
    for (c in rawPrice.toIter()) {
      if (c >= '0' and c <= '9') {
        result := result # Text.fromChar(c);
      } else if (c == '.' and not hasDot) {
        result := result # ".";
        hasDot := true;
      };
    };
    if (result == "" or result == ".") {
      return rawPrice; // fallback to original if nothing extracted
    };
    "$" # result;
  };

  // ── Private helpers ─────────────────────────────────────────────────────────

  /// Extract the `content` attribute from an og or meta tag with the given property.
  /// Handles: <meta property="og:title" content="..."> and similar.
  func extractMetaContent(html : Text, property : Text) : ?Text {
    // Look for property="<property>" or name="<property>"
    let needle1 = "property=\"" # property # "\"";
    let needle2 = "name=\"" # property # "\"";
    let found = if (html.contains(#text needle1)) {
      ?needle1;
    } else if (html.contains(#text needle2)) {
      ?needle2;
    } else {
      null;
    };
    switch (found) {
      case null null;
      case (?needle) {
        let parts = html.split(#text needle);
        ignore parts.next(); // discard part before needle
        switch (parts.next()) {
          case null null;
          case (?after) extractContentAttr(after);
        };
      };
    };
  };

  /// Given HTML fragment starting after the property declaration,
  /// extract the value of the nearest content="..." attribute.
  func extractContentAttr(fragment : Text) : ?Text {
    let marker = "content=\"";
    if (not fragment.contains(#text marker)) return null;
    let parts = fragment.split(#text marker);
    ignore parts.next();
    switch (parts.next()) {
      case null null;
      case (?afterMarker) {
        // Take up to the next closing quote
        let valueParts = afterMarker.split(#text "\"");
        valueParts.next();
      };
    };
  };

  /// Extract all og:image URLs from meta tags.
  func extractOgImages(html : Text) : [Text] {
    let images = List.empty<Text>();
    let needle = "property=\"og:image\"";
    // Split on every occurrence of og:image property
    var parts = html.split(#text needle);
    ignore parts.next(); // skip content before first match
    for (after in parts) {
      switch (extractContentAttr(after)) {
        case (?url) {
          if (url.size() > 0) images.add(url);
        };
        case null {};
      };
    };
    images.toArray();
  };

  /// Extract category from breadcrumb text (basic heuristic for Facebook Marketplace).
  func extractBreadcrumbCategory(html : Text) : ?Text {
    // Facebook Marketplace breadcrumbs appear near class="breadcrumbs" or aria-label
    let marker = "\"category\":\"";
    if (not html.contains(#text marker)) return null;
    let parts = html.split(#text marker);
    ignore parts.next();
    switch (parts.next()) {
      case null null;
      case (?after) {
        let valueParts = after.split(#text "\"");
        valueParts.next();
      };
    };
  };

  /// Extract a field value from inline ld+json schema (OfferUp).
  /// Looks for patterns like "name":"VALUE" in JSON-LD script blocks.
  func extractLdJsonField(html : Text, fieldKey : Text) : ?Text {
    let needle = fieldKey # ":\"";
    if (not html.contains(#text needle)) {
      // Try without quotes around value (numeric fields like price)
      let numNeedle = fieldKey # ":";
      if (not html.contains(#text numNeedle)) return null;
      let parts = html.split(#text numNeedle);
      ignore parts.next();
      switch (parts.next()) {
        case null null;
        case (?after) {
          // Extract until comma or closing brace
          var value = "";
          var done = false;
          for (c in after.toIter()) {
            if (not done) {
              if (c == ',' or c == '}' or c == '\n') {
                done := true;
              } else {
                value := value # Text.fromChar(c);
              };
            };
          };
          let trimmed = value.trim(#char ' ');
          if (trimmed.size() == 0) null else ?trimmed;
        };
      };
    } else {
      let parts = html.split(#text needle);
      ignore parts.next();
      switch (parts.next()) {
        case null null;
        case (?after) {
          let valueParts = after.split(#text "\"");
          valueParts.next();
        };
      };
    };
  };

  /// Extract the HTML <title> tag value.
  func extractTitleTag(html : Text) : ?Text {
    let open = "<title>";
    let close = "</title>";
    if (not html.contains(#text open)) return null;
    let parts = html.split(#text open);
    ignore parts.next();
    switch (parts.next()) {
      case null null;
      case (?after) {
        let titleParts = after.split(#text close);
        titleParts.next();
      };
    };
  };
};

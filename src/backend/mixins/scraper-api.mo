import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/scraper";
import ScraperLib "../lib/scraper";

/// Scraper API — only public listings; no login-required pages.
/// Uses http-outcalls extension to fetch and parse Facebook Marketplace and OfferUp pages.
mixin (
  accessControlState : AccessControl.AccessControlState,
) {
  /// The management canister actor for HTTP outcalls (scraper).
  /// Uses a unique name to avoid collision with Stripe's IC_MANAGEMENT binding.
  let IC_MANAGEMENT_SCRAPER : actor {
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

  /// Resolve an OfferUp short URL (offerup.co) to its canonical listing URL.
  /// Makes a HEAD request and follows the Location redirect header.
  /// Returns the resolved URL, or the original if no redirect found.
  func resolveOfferUpShortUrl(shortUrl : Text) : async Text {
    let headResponse = try {
      await IC_MANAGEMENT_SCRAPER.http_request({
        url = shortUrl;
        max_response_bytes = ?4096;
        method = #head;
        headers = [
          { name = "User-Agent"; value = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1" },
          { name = "Accept"; value = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" },
          { name = "Accept-Language"; value = "en-US,en;q=0.9" },
        ];
        body = null;
        is_replicated = ?false;
      });
    } catch (_) {
      return shortUrl; // fall back to original on error
    };

    // Follow Location header if present (3xx redirect)
    if (headResponse.status >= 300 and headResponse.status < 400) {
      for (header in headResponse.headers.vals()) {
        if (header.name.toLower() == "location") {
          return header.value;
        };
      };
    };
    shortUrl; // no redirect found, use original
  };

  /// Scrape a public listing URL (Facebook Marketplace or OfferUp).
  /// Returns pre-filled listing data; never auto-posts.
  /// On failure returns #err with a human-readable reason.
  public shared ({ caller }) func scrapeListing(url : Text) : async Types.ScrapeResult {
    let source = ScraperLib.detectSource(url);
    switch (source) {
      case (#unknown) {
        return #err("Unsupported marketplace. Currently supported: Facebook Marketplace, OfferUp");
      };
      case _ {};
    };

    // Resolve OfferUp short URLs (offerup.co) to canonical listing URLs
    let canonicalUrl : Text = switch (source) {
      case (#offerUp) {
        let lower = url.toLower();
        if (lower.contains(#text "offerup.co") and not lower.contains(#text "offerup.com")) {
          await resolveOfferUpShortUrl(url);
        } else {
          url;
        };
      };
      case _ { url };
    };

    // Build browser-like headers to pass anti-bot checks
    let fetchHeaders : [{ name : Text; value : Text }] = switch (source) {
      case (#facebookMarketplace) {
        [
          { name = "User-Agent"; value = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1" },
          { name = "Accept"; value = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8" },
          { name = "Accept-Language"; value = "en-US,en;q=0.9" },
          { name = "Referer"; value = "https://www.facebook.com/" },
          { name = "Sec-Fetch-Dest"; value = "document" },
          { name = "Sec-Fetch-Mode"; value = "navigate" },
          { name = "Sec-Fetch-Site"; value = "same-origin" },
        ];
      };
      case _ {
        [
          { name = "User-Agent"; value = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1" },
          { name = "Accept"; value = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" },
          { name = "Accept-Language"; value = "en-US,en;q=0.9" },
        ];
      };
    };

    // Fetch the public listing page
    let response = try {
      await IC_MANAGEMENT_SCRAPER.http_request({
        url = canonicalUrl;
        max_response_bytes = ?2_000_000; // 2 MB limit
        method = #get;
        headers = fetchHeaders;
        body = null;
        is_replicated = ?false;
      });
    } catch (_) {
      switch (source) {
        case (#facebookMarketplace) {
          return #err("Facebook Marketplace blocks server requests — paste the details manually instead");
        };
        case (#offerUp) {
          return #err("Could not load this OfferUp listing — try the full offerup.com link instead of a short link");
        };
        case (#unknown) {
          return #err("Failed to fetch listing page");
        };
      };
    };

    if (response.status < 200 or response.status >= 300) {
      switch (source) {
        case (#facebookMarketplace) {
          return #err("Facebook Marketplace blocks server requests — paste the details manually instead");
        };
        case (#offerUp) {
          return #err("Could not load this OfferUp listing — try the full offerup.com link instead of a short link");
        };
        case (#unknown) {
          return #err("Listing page returned status " # response.status.toText() # " — may be private or removed");
        };
      };
    };

    let htmlBody = switch (response.body.decodeUtf8()) {
      case null { return #err("Failed to decode listing page as UTF-8") };
      case (?text) {
        if (text.size() == 0) {
          return #err("Empty response from listing page");
        };
        text;
      };
    };

    let scraped = switch (source) {
      case (#facebookMarketplace) ScraperLib.parseFacebookMarketplace(canonicalUrl, htmlBody);
      case (#offerUp) ScraperLib.parseOfferUp(canonicalUrl, htmlBody);
      case (#unknown) { return #err("Unsupported source") };
    };

    #ok(scraped);
  };

  /// Detect the marketplace source from a URL without fetching it.
  /// Useful for frontend validation before calling scrapeListing.
  public query func detectMarketplaceSource(url : Text) : async Types.MarketplaceSource {
    ScraperLib.detectSource(url);
  };
};

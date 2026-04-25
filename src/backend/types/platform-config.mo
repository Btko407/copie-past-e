import Debug "mo:core/Debug";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Core "core";

module {
  // ══════════════════════════════════════════════════════════════════════════════
  // PLATFORM CONFIGURATION — Golden Master Build
  // Authoritative specs for each supported marketplace.
  // All values are compile-time constants — no stable vars, no actor.
  // ══════════════════════════════════════════════════════════════════════════════

  /// Static configuration record for a marketplace platform
  public type PlatformConfig = {
    name                 : Text;
    maxTitleLength       : Nat;
    maxDescriptionLength : Nat;
    maxPhotos            : Nat;
    requiredFields       : [Text];
    optionalFields       : [Text];
    helpUrl              : Text;
  };

  /// Authoritative platform config table — index by platform variant
  public let platformConfigs : [(Core.Platform, PlatformConfig)] = [
    (
      #facebook,
      {
        name                 = "Facebook Marketplace";
        maxTitleLength       = 200;
        maxDescriptionLength = 5000;
        maxPhotos            = 10;
        requiredFields       = ["title", "description"];
        optionalFields       = ["price", "category", "condition", "localPickup", "shipping"];
        helpUrl              = "https://www.facebook.com/marketplace/";
      },
    ),
    (
      #mecari,
      {
        name                 = "Mercari";
        maxTitleLength       = 80;
        maxDescriptionLength = 1000;
        maxPhotos            = 12;
        requiredFields       = ["title", "brand", "condition"];
        optionalFields       = ["price", "category", "deliveryDays", "shippingType"];
        helpUrl              = "https://www.mercari.com/";
      },
    ),
    (
      #ebay,
      {
        name                 = "eBay";
        maxTitleLength       = 80;
        maxDescriptionLength = 4000;
        maxPhotos            = 12;
        requiredFields       = ["title"];
        optionalFields       = ["price", "category", "condition", "quantity", "shippingCost"];
        helpUrl              = "https://www.ebay.com/";
      },
    ),
    (
      #poshmark,
      {
        name                 = "Poshmark";
        maxTitleLength       = 141;
        maxDescriptionLength = 2000;
        maxPhotos            = 11;
        requiredFields       = ["title"];
        optionalFields       = ["price", "brand", "size", "category", "condition"];
        helpUrl              = "https://poshmark.com/";
      },
    ),
    (
      #depop,
      {
        name                 = "Depop";
        maxTitleLength       = 70;
        maxDescriptionLength = 500;
        maxPhotos            = 12;
        requiredFields       = ["title"];
        optionalFields       = ["price", "brand", "condition", "size", "category"];
        helpUrl              = "https://www.depop.com/";
      },
    ),
    (
      #etsy,
      {
        name                 = "Etsy";
        maxTitleLength       = 140;
        maxDescriptionLength = 10000;
        maxPhotos            = 10;
        requiredFields       = ["title"];
        optionalFields       = ["price", "category", "tags"];
        helpUrl              = "https://www.etsy.com/";
      },
    ),
  ];

  // ── Lookup ────────────────────────────────────────────────────────────────────

  /// Find the config for a given platform. Returns null if not registered.
  public func getPlatformConfig(platform : Core.Platform) : ?PlatformConfig {
    Debug.todo()
  };

  // ── Validation ────────────────────────────────────────────────────────────────

  /// Returns an error message if `value` exceeds the platform's limit for `fieldName`,
  /// or null if the field length is within bounds.
  ///
  /// Checked fields: "title" (vs maxTitleLength), "description" (vs maxDescriptionLength).
  public func validateFieldLength(
    platform  : Core.Platform,
    fieldName : Text,
    value     : Text,
  ) : ?Text {
    Debug.todo()
  };

  /// Returns a list of `{ field; error }` records for each required field that is
  /// absent from `presentFields`. An empty list means all required fields are present.
  public func validateRequiredFields(
    platform      : Core.Platform,
    presentFields : [Text],
  ) : [{ field : Text; error : Text }] {
    Debug.todo()
  };
};

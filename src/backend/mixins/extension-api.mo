import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import Types "../types/extension";
import ProfileTypes "../types/userprofile";
import ListingTypes "../types/listings";
import ExtensionLib "../lib/extension";

/// Browser Extension Webhook API — receives listing data captured by the
/// Copie Past-e Chrome/Safari extension from Facebook Marketplace or OfferUp.
/// Creates a draft listing (not published) for the authenticated user.
mixin (
  accessControlState : AccessControl.AccessControlState,
  listings           : Map.Map<Common.ListingId, ListingTypes.Listing>,
  listingCounter     : { var value : Nat },
  profiles           : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
) {
  // ── Extension Version Management ─────────────────────────────────────────
  let extensionVersions = List.empty<Types.ExtensionVersion>();

  // Seed v1.2.0 on first load if list is empty
  if (extensionVersions.isEmpty()) {
    extensionVersions.add({
      version      = "1.2.0";
      buildNumber  = 2;
      releaseNotes = "Facebook Marketplace & Mecari autofill v1.2.0 — Fixed platform-specific field validation, improved extraction accuracy";
      downloadUrl  = "https://chrome.google.com/webstore/detail/copie-past-e/YOUR_EXTENSION_ID";
      isForceUpdate = true;
      releasedAt   = Time.now();
    });
  };

  /// Get the latest extension version available (for update banners).
  public query func getLatestExtensionVersion() : async ?Types.ExtensionUpdateCheck {
    switch (extensionVersions.last()) {
      case null { null };
      case (?latest) {
        ?{
          currentVersion = "";
          latestVersion  = latest.version;
          needsUpdate    = true;
          isForceUpdate  = latest.isForceUpdate;
          buildNumber    = latest.buildNumber;
          releaseNotes   = latest.releaseNotes;
          downloadUrl    = latest.downloadUrl;
        }
      };
    };
  };

  /// Check update status by comparing the client's installed version with the latest.
  public query func checkExtensionUpdateStatus(clientVersion : Text) : async Types.ExtensionUpdateCheck {
    switch (extensionVersions.last()) {
      case null {
        {
          currentVersion = clientVersion;
          latestVersion  = "1.2.0";
          needsUpdate    = false;
          isForceUpdate  = false;
          buildNumber    = 0;
          releaseNotes   = "";
          downloadUrl    = "";
        }
      };
      case (?latest) {
        {
          currentVersion = clientVersion;
          latestVersion  = latest.version;
          needsUpdate    = clientVersion != latest.version;
          isForceUpdate  = latest.isForceUpdate;
          buildNumber    = latest.buildNumber;
          releaseNotes   = latest.releaseNotes;
          downloadUrl    = latest.downloadUrl;
        }
      };
    };
  };

  /// Admin: publish a new extension version and force-update all users.
  public shared ({ caller }) func adminSetExtensionVersion(
    version      : Text,
    buildNumber  : Nat,
    releaseNotes : Text,
    downloadUrl  : Text,
    isForceUpdate : Bool,
  ) : async { #ok : Text; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: admin only");
    };
    extensionVersions.add({
      version;
      buildNumber;
      releaseNotes;
      downloadUrl;
      isForceUpdate;
      releasedAt = Time.now();
    });
    #ok("Extension version " # version # " published — force update: " # (if isForceUpdate "YES" else "NO"))
  };

  /// Admin: list the full extension version history.
  public query ({ caller }) func adminListExtensionVersions() : async [Types.ExtensionVersion] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return [];
    };
    extensionVersions.toArray()
  };

  // ── Extension Data Receiver ───────────────────────────────────────────────

  /// Receive listing data from the browser extension.
  /// webhookToken must match the per-user token stored on the profile.
  /// On success, returns the draft listing ID the user can navigate to for review.
  public shared ({ caller }) func receiveExtensionData(
    data         : Types.ExtensionListingData,
    webhookToken : Text,
  ) : async { #ok : Types.DraftListingId; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized: Must be logged in to receive extension data");
    };
    if (not ExtensionLib.validateWebhookToken(profiles, caller, webhookToken)) {
      return #err("Invalid webhook token — generate a new one from your profile settings");
    };
    let now = Time.now();
    let draftId = ExtensionLib.createDraftListing(listings, listingCounter, caller, data, now);
    #ok(draftId);
  };

  /// Generate (or regenerate) a webhook token for the authenticated user.
  /// The token is stored on the profile and must be provided by the extension.
  public shared ({ caller }) func generateWebhookToken() : async { #ok : Text; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized: Must be logged in to generate a webhook token");
    };
    switch (profiles.get(caller)) {
      case null { #err("Profile not found — please complete registration first") };
      case (?existing) {
        let now = Time.now();
        let token = ExtensionLib.generateToken(caller, now);
        let updated : ProfileTypes.UserProfile = { existing with fbWebhookToken = ?token };
        profiles.add(caller, updated);
        #ok(token);
      };
    };
  };

  /// Return the current webhook token for the authenticated user so the
  /// frontend can display it in the profile / extension settings page.
  public query ({ caller }) func getMyWebhookToken() : async { #ok : Text; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized: Must be logged in to view your webhook token");
    };
    switch (profiles.get(caller)) {
      case null { #err("Profile not found") };
      case (?profile) {
        switch (profile.fbWebhookToken) {
          case null { #err("No webhook token — click Generate to create one") };
          case (?token) { #ok(token) };
        };
      };
    };
  };
};

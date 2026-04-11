import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import ListingTypes "../types/listings";
import ImageTypes "../types/images";
import Types "../types/admin";
import TierTypes "../types/tiers";
import ProfileTypes "../types/userprofile";
import BackupTypes "../types/backup";
import NotifTypes "../types/notifications";
import AdminLib "../lib/admin";
import TiersLib "../lib/tiers";
import ListingsLib "../lib/listings";
import ProfileLib "../lib/userprofile";
import BackupLib "../lib/backup";

mixin (
  accessControlState : AccessControl.AccessControlState,
  listings : Map.Map<Common.ListingId, ListingTypes.Listing>,
  images : Map.Map<Common.ImageId, ImageTypes.Image>,
  siteSettings : { var current : ?Types.SiteSettings },
  appVersions : List.List<Types.AppVersion>,
  versionCounter : { var value : Nat },
  userRegistrations : Map.Map<Common.UserId, Common.Timestamp>,
  userLastLogins : Map.Map<Common.UserId, Common.Timestamp>,
  subscriptions : Map.Map<Common.UserId, TierTypes.UserTierSubscription>,
  profiles : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
  usernameIndex : Map.Map<Text, Common.UserId>,
  auditLog : List.List<Types.AuditLogEntry>,
  auditCounter : { var value : Nat },
  notifications : Map.Map<Common.UserId, List.List<NotifTypes.InAppNotification>>,
  versionBackups : List.List<BackupTypes.VersionBackup>,
) {
  public query ({ caller }) func getAdminSettings() : async Types.SiteSettings {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin role required");
    };
    AdminLib.getSettings(siteSettings);
  };

  public shared ({ caller }) func updateAdminSettings(args : Types.UpdateSettingsArgs) : async Types.SiteSettings {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin role required");
    };
    // Auto-backup before saving settings
    let now = Time.now();
    ignore BackupLib.createVersionBackup(
      versionBackups, profiles, listings, subscriptions, notifications,
      siteSettings, appVersions, false, "auto",
      ?"Pre-settings-save backup", now,
    );
    AdminLib.updateSettings(siteSettings, caller, args);
  };

  public query ({ caller }) func listAllUsers() : async [Types.UserSummary] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin role required");
    };
    AdminLib.listAllUsers(accessControlState, listings, images, userRegistrations, userLastLogins);
  };

  public shared ({ caller }) func assignUserRole(userId : Text, role : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin role required");
    };
    // Role assignment is handled by the authorization extension — this is a no-op stub
    // since the authorization mixin exposes its own role management endpoints
  };

  public query ({ caller }) func getSiteAnalytics() : async Types.SiteAnalytics {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin role required");
    };
    AdminLib.getSiteAnalytics(accessControlState, listings, images, userRegistrations);
  };

  public query ({ caller }) func listVersionHistory() : async [Types.AppVersion] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin role required");
    };
    AdminLib.listVersionHistory(appVersions);
  };

  public shared ({ caller }) func createVersion(args : Types.CreateVersionArgs) : async Types.AppVersion {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin role required");
    };
    AdminLib.createVersion(appVersions, versionCounter, caller, siteSettings, args, false);
  };

  public shared ({ caller }) func rollbackToVersion(versionId : Nat) : async Types.SiteSettings {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin role required");
    };
    AdminLib.rollbackToVersion(appVersions, siteSettings, versionCounter, caller, versionId);
  };

  // Admin-only: get per-user cleanup summaries (active/archived counts, expiration info)
  public query ({ caller }) func getCleanupSummaries() : async [Types.UserCleanupSummary] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin role required");
    };
    AdminLib.getUserCleanupSummaries(listings, accessControlState, userRegistrations, Time.now());
  };

  // Admin-only: get the full audit log (most recent first).
  public query ({ caller }) func getAuditLog() : async [Types.AuditLogEntry] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin role required");
    };
    AdminLib.listAuditLog(auditLog);
  };

  // Admin-only: reset a single user's subscription to NOW by username.
  // Immediately archives all their active listings and logs the action.
  // Returns #ok with a confirmation message, or #err if the user is not found or caller is not admin.
  public shared ({ caller }) func adminResetUserSubscription(
    username : Text
  ) : async { #ok : Text; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return #err("Unauthorized");
    };
    switch (ProfileLib.getProfileByUsername(usernameIndex, profiles, username)) {
      case null { #err("User not found") };
      case (?profile) {
        let now = Time.now();
        TiersLib.resetUserSubscription(subscriptions, profile.userId, now);
        let archived = ListingsLib.archiveAllUserListings(listings, profile.userId, now);
        AdminLib.appendAuditLog(
          auditLog,
          auditCounter,
          "ADMIN_RESET_SUBSCRIPTION",
          caller,
          ?profile.userId,
          "Reset subscription for username=" # username # ". Listings archived: " # archived.toText(),
          now,
        );
        #ok("Subscription reset. All listings moved to archive. 30-day delete clock started.");
      };
    };
  };

  // Admin-only: reset ALL non-admin user subscriptions to NOW.
  // Archives all active listings for every non-admin user and logs each action.
  // Returns #ok with a count of users reset, or #err if caller is not admin.
  public shared ({ caller }) func adminResetAllUserSubscriptions() : async { #ok : Text; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return #err("Unauthorized");
    };
    let now = Time.now();
    var resetCount : Nat = 0;
    for ((userId, _) in userRegistrations.entries()) {
      // Skip admin accounts
      let isAdmin = switch (accessControlState.userRoles.get(userId)) {
        case (?(#admin)) true;
        case _ false;
      };
      if (not isAdmin) {
        TiersLib.resetUserSubscription(subscriptions, userId, now);
        let archived = ListingsLib.archiveAllUserListings(listings, userId, now);
        AdminLib.appendAuditLog(
          auditLog,
          auditCounter,
          "ADMIN_RESET_SUBSCRIPTION",
          caller,
          ?userId,
          "Bulk reset. Listings archived: " # archived.toText(),
          now,
        );
        resetCount += 1;
      };
    };
    #ok("Reset " # resetCount.toText() # " users. All their listings archived.");
  };

  /// Admin: delete a user account.
  /// Removes all their listings, images, notifications, subscriptions, and profile.
  /// Admin accounts cannot be deleted. Logs the action to the audit log.
  public shared ({ caller }) func adminDeleteUser(userId : Text) : async { #ok : Text; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return #err("Unauthorized");
    };
    let uid = Principal.fromText(userId);
    // Prevent deleting admin accounts
    let targetIsAdmin = switch (accessControlState.userRoles.get(uid)) {
      case (?(#admin)) true;
      case _ false;
    };
    if (targetIsAdmin) {
      return #err("Cannot delete an admin account");
    };
    let now = Time.now();
    // Auto-backup before deletion
    ignore BackupLib.createVersionBackup(
      versionBackups, profiles, listings, subscriptions, notifications,
      siteSettings, appVersions, false, "auto",
      ?("Pre-user-delete backup: " # userId), now,
    );
    // Remove all listings owned by this user, collecting their IDs
    let listingIds = List.empty<Common.ListingId>();
    for ((lid, l) in listings.entries()) {
      if (Principal.equal(l.userId, uid)) {
        listingIds.add(lid);
      };
    };
    for (lid in listingIds.values()) {
      // Remove images belonging to this listing
      let imgToRemove = images.values()
        .filter(func(img : ImageTypes.Image) : Bool { img.listingId == lid })
        .map(func(img : ImageTypes.Image) : Common.ImageId { img.id })
        .toArray();
      for (iid in imgToRemove.values()) {
        images.remove(iid);
      };
      listings.remove(lid);
    };
    let listingCount = listingIds.size();
    // Remove subscriptions, registrations, logins
    subscriptions.remove(uid);
    userRegistrations.remove(uid);
    userLastLogins.remove(uid);
    // Remove notifications
    notifications.remove(uid);
    // Remove profile and username index
    switch (profiles.get(uid)) {
      case (?p) {
        usernameIndex.remove(p.username.toLower());
        profiles.remove(uid);
      };
      case null {};
    };
    AdminLib.appendAuditLog(
      auditLog,
      auditCounter,
      "ADMIN_DELETE_USER",
      caller,
      ?uid,
      "Deleted user account userId=" # userId # ". Listings removed: " # listingCount.toText(),
      now,
    );
    #ok("User account deleted. " # listingCount.toText() # " listings removed.");
  };
};

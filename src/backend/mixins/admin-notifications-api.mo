import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import AdminNotifTypes "../types/admin-notifications";
import NotifTypes "../types/notifications";
import TierTypes "../types/tiers";
import ProfileTypes "../types/userprofile";
import AdminNotifLib "../lib/admin-notifications";
import NotifLib "../lib/notifications";

mixin (
  accessControlState : AccessControl.AccessControlState,
  adminNotifs        : List.List<AdminNotifTypes.AdminNotification>,
  adminNotifCounter  : { var value : Nat },
  notifications      : Map.Map<Common.UserId, List.List<NotifTypes.InAppNotification>>,
  notifCounter       : { var value : Nat },
  profiles           : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
  subscriptions      : Map.Map<Common.UserId, TierTypes.UserTierSubscription>,
) {
  /// Admin: list all admin activity notifications.
  public query ({ caller }) func listAdminNotifications() : async [AdminNotifTypes.AdminNotification] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: admin only");
    };
    AdminNotifLib.listAdminNotifications(adminNotifs)
  };

  /// Admin: mark a single admin notification as read.
  public shared ({ caller }) func markAdminNotificationRead(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: admin only");
    };
    AdminNotifLib.markAdminNotificationRead(adminNotifs, id)
  };

  /// Admin: mark all admin notifications as read.
  public shared ({ caller }) func markAllAdminNotificationsRead() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: admin only");
    };
    AdminNotifLib.markAllAdminNotificationsRead(adminNotifs)
  };

  /// Get unread admin notification count (admin only).
  public query ({ caller }) func getUnreadAdminNotificationCount() : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: admin only");
    };
    AdminNotifLib.getUnreadAdminNotificationCount(adminNotifs)
  };

  /// Admin: broadcast a notification to users.
  /// targetType: "all" | "specific" | "free_tier" | "expired"
  /// Returns count of users notified.
  public shared ({ caller }) func createBroadcastNotification(
    title        : Text,
    message      : Text,
    priority     : Text,
    targetType   : Text,
    targetUserId : ?Text,
  ) : async { #ok : Nat; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return #err("Unauthorized: admin only");
    };
    let now = Time.now();
    var count : Nat = 0;

    // Collect target user IDs based on targetType
    let targets = List.empty<Common.UserId>();

    if (targetType == "specific") {
      switch (targetUserId) {
        case null { return #err("targetUserId required for specific target") };
        case (?uid) {
          targets.add(Principal.fromText(uid));
        };
      };
    } else {
      // Iterate all profiles
      for ((userId, _) in profiles.entries()) {
        let shouldInclude : Bool = if (targetType == "all") {
          true
        } else if (targetType == "free_tier") {
          // Free tier = no subscription or tier == 0
          switch (subscriptions.get(userId)) {
            case null { true };
            case (?sub) { sub.tier == 0 };
          }
        } else if (targetType == "expired") {
          switch (subscriptions.get(userId)) {
            case null { true };
            case (?sub) { sub.expirationDate <= now };
          }
        } else { false };
        if (shouldInclude) { targets.add(userId) };
      };
    };

    for (uid in targets.values()) {
      ignore NotifLib.createNotification(
        notifications, notifCounter, uid,
        #adminAnnouncement,
        title,
        message,
        now,
      );
      count += 1;
    };

    // Log admin notification about the broadcast
    ignore AdminNotifLib.createAdminNotification(
      adminNotifs, adminNotifCounter,
      "broadcast",
      "Broadcast sent: \"" # title # "\" to " # count.toText() # " users",
      caller.toText(),
      null,
      priority,
      null,
      now,
    );

    #ok(count)
  };
};

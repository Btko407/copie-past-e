import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import ProfileTypes "../types/userprofile";
import Types "../types/notifications";
import NotifLib "../lib/notifications";
import ProfileLib "../lib/userprofile";

mixin (
  accessControlState : AccessControl.AccessControlState,
  notifications : Map.Map<Common.UserId, List.List<Types.InAppNotification>>,
  notifCounter : { var value : Nat },
  profiles : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
  lowFuelNotificationSentFor : Map.Map<Common.UserId, Common.Timestamp>,
) {
  /// Return all notifications for the calling user, newest first.
  public query ({ caller }) func getUserNotifications() : async [Types.InAppNotification] {
    NotifLib.getUserNotifications(notifications, caller);
  };

  /// Mark a single notification as read for the calling user.
  public shared ({ caller }) func markNotificationRead(
    notificationId : Nat,
  ) : async Types.MarkReadResult {
    NotifLib.markRead(notifications, caller, notificationId);
  };

  /// Mark all notifications as read for the calling user.
  public shared ({ caller }) func markAllNotificationsRead() : async () {
    NotifLib.markAllRead(notifications, caller);
  };

  /// Admin: broadcast an announcement notification to all registered users.
  public shared ({ caller }) func adminSendAnnouncement(
    title : Text,
    message : Text,
  ) : async { #ok; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return #err("Unauthorized: Admin role required");
    };
    let now = Time.now();
    let userIds = ProfileLib.listAllProfiles(profiles).map(
      func(p) { p.userId }
    );
    NotifLib.broadcastAnnouncement(notifications, notifCounter, userIds, title, message, now);
    #ok;
  };

  /// Check the caller's fuel level and create a low-fuel warning notification
  /// if fuel is below 20 % and none has been sent for the current subscription period.
  /// fuelPercent must be a value between 0.0 and 100.0.
  /// subscriptionExpirationTimestamp is the caller's current subscription expiry (nanoseconds).
  /// Returns the newly created notification, or null if no notification was needed.
  public shared ({ caller }) func checkAndCreateLowFuelNotification(
    fuelPercent : Float,
    subscriptionExpirationTimestamp : Common.Timestamp,
  ) : async ?Types.InAppNotification {
    let now = Time.now();
    NotifLib.checkAndCreateLowFuelNotification(
      notifications,
      notifCounter,
      lowFuelNotificationSentFor,
      caller,
      fuelPercent,
      subscriptionExpirationTimestamp,
      now,
    );
  };
};

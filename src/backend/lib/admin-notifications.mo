import List "mo:core/List";
import Nat "mo:core/Nat";
import Common "../types/common";
import Types "../types/admin-notifications";

module {
  /// Maximum admin notifications to retain.
  let MAX_ADMIN_NOTIFS : Nat = 500;

  /// Create and store a new admin notification.
  public func createAdminNotification(
    adminNotifs   : List.List<Types.AdminNotification>,
    counter       : { var value : Nat },
    notifType     : Text,
    message       : Text,
    relatedUser   : Text,
    relatedId     : ?Text,
    priority      : Text,
    targetAdminId : ?Text,
    now           : Common.Timestamp,
  ) : Types.AdminNotification {
    let id = counter.value;
    counter.value += 1;
    let notif : Types.AdminNotification = {
      id;
      notifType;
      message;
      relatedUser;
      relatedId;
      priority;
      isRead        = false;
      createdAt     = now;
      targetAdminId;
    };
    adminNotifs.add(notif);
    // Trim oldest entries — keep only the most recent MAX_ADMIN_NOTIFS
    if (adminNotifs.size() > MAX_ADMIN_NOTIFS) {
      // removeLast isn't what we want — rebuild keeping the last MAX entries
      let arr = adminNotifs.toArray();
      adminNotifs.clear();
      let start = arr.size() - MAX_ADMIN_NOTIFS;
      for (i in Nat.range(start, arr.size())) {
        adminNotifs.add(arr[i]);
      };
    };
    notif
  };

  /// List all admin notifications, newest first.
  public func listAdminNotifications(
    adminNotifs : List.List<Types.AdminNotification>,
  ) : [Types.AdminNotification] {
    let arr = adminNotifs.toArray();
    arr.sort(func(a : Types.AdminNotification, b : Types.AdminNotification) : { #less; #equal; #greater } {
      if (a.createdAt > b.createdAt) #less
      else if (a.createdAt < b.createdAt) #greater
      else #equal
    })
  };

  /// Mark a single admin notification as read.
  public func markAdminNotificationRead(
    adminNotifs : List.List<Types.AdminNotification>,
    id          : Nat,
  ) {
    adminNotifs.mapInPlace(func(n : Types.AdminNotification) : Types.AdminNotification {
      if (n.id == id) { { n with isRead = true } } else { n }
    });
  };

  /// Mark all admin notifications as read.
  public func markAllAdminNotificationsRead(
    adminNotifs : List.List<Types.AdminNotification>,
  ) {
    adminNotifs.mapInPlace(func(n : Types.AdminNotification) : Types.AdminNotification {
      { n with isRead = true }
    });
  };

  /// Count unread admin notifications.
  public func getUnreadAdminNotificationCount(
    adminNotifs : List.List<Types.AdminNotification>,
  ) : Nat {
    var count : Nat = 0;
    adminNotifs.forEach(func(n : Types.AdminNotification) {
      if (not n.isRead) { count += 1 };
    });
    count
  };
};

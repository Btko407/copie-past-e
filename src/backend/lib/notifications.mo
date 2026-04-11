import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Common "../types/common";
import Types "../types/notifications";

module {
  /// Create a new notification and append it to the store.
  public func createNotification(
    notifications : Map.Map<Common.UserId, List.List<Types.InAppNotification>>,
    notifCounter : { var value : Nat },
    userId : Common.UserId,
    notificationType : Types.NotificationType,
    title : Text,
    message : Text,
    now : Common.Timestamp,
  ) : Types.InAppNotification {
    notifCounter.value += 1;
    let notif : Types.InAppNotification = {
      id = notifCounter.value;
      userId;
      notificationType;
      title;
      message;
      isRead = false;
      createdAt = now;
    };
    let existing = switch (notifications.get(userId)) {
      case null { List.empty<Types.InAppNotification>() };
      case (?lst) { lst };
    };
    existing.add(notif);
    notifications.add(userId, existing);
    notif;
  };

  /// Check whether a matching notification was already created within the last
  /// `windowNs` nanoseconds (used to deduplicate subscription-expiry alerts).
  public func hasRecentNotification(
    notifications : Map.Map<Common.UserId, List.List<Types.InAppNotification>>,
    userId : Common.UserId,
    notificationType : Types.NotificationType,
    windowNs : Int,
    now : Common.Timestamp,
  ) : Bool {
    switch (notifications.get(userId)) {
      case null { false };
      case (?lst) {
        let cutoff = now - windowNs;
        lst.any(func(n : Types.InAppNotification) : Bool {
          n.notificationType == notificationType and n.createdAt >= cutoff
        });
      };
    };
  };

  /// Return all notifications for a user, newest first.
  public func getUserNotifications(
    notifications : Map.Map<Common.UserId, List.List<Types.InAppNotification>>,
    userId : Common.UserId,
  ) : [Types.InAppNotification] {
    switch (notifications.get(userId)) {
      case null { [] };
      case (?lst) {
        let arr = lst.toArray();
        arr.sort(func(a : Types.InAppNotification, b : Types.InAppNotification) : Order.Order {
          Int.compare(b.createdAt, a.createdAt)
        });
      };
    };
  };

  /// Mark a single notification as read.
  public func markRead(
    notifications : Map.Map<Common.UserId, List.List<Types.InAppNotification>>,
    userId : Common.UserId,
    notificationId : Nat,
  ) : Types.MarkReadResult {
    switch (notifications.get(userId)) {
      case null { #err("Notification not found") };
      case (?lst) {
        var found = false;
        lst.mapInPlace(func(n : Types.InAppNotification) : Types.InAppNotification {
          if (n.id == notificationId) {
            found := true;
            { n with isRead = true };
          } else { n };
        });
        if (found) { #ok } else { #err("Notification not found") };
      };
    };
  };

  /// Mark every notification for a user as read.
  public func markAllRead(
    notifications : Map.Map<Common.UserId, List.List<Types.InAppNotification>>,
    userId : Common.UserId,
  ) {
    switch (notifications.get(userId)) {
      case null {};
      case (?lst) {
        lst.mapInPlace(func(n : Types.InAppNotification) : Types.InAppNotification {
          { n with isRead = true };
        });
      };
    };
  };

  /// Create an admin-announcement notification for every user in the userIds list.
  public func broadcastAnnouncement(
    notifications : Map.Map<Common.UserId, List.List<Types.InAppNotification>>,
    notifCounter : { var value : Nat },
    userIds : [Common.UserId],
    title : Text,
    message : Text,
    now : Common.Timestamp,
  ) {
    for (userId in userIds.values()) {
      ignore createNotification(notifications, notifCounter, userId, #adminAnnouncement, title, message, now);
    };
  };

  /// Check whether a low-fuel warning should be sent for this subscription period
  /// and, if so, create the notification and record the period in the sent-for store.
  ///
  /// A notification is created only when:
  ///   - fuelPercent < 20
  ///   - No lowFuelWarning has been sent for the same subscriptionExpirationTimestamp.
  ///
  /// The subscription period is keyed by the exact expiration timestamp so that
  /// a new subscription period (new expiration) resets eligibility.
  public func checkAndCreateLowFuelNotification(
    notifications : Map.Map<Common.UserId, List.List<Types.InAppNotification>>,
    notifCounter : { var value : Nat },
    lowFuelSentFor : Map.Map<Common.UserId, Common.Timestamp>,
    userId : Common.UserId,
    fuelPercent : Float,
    subscriptionExpirationTimestamp : Common.Timestamp,
    now : Common.Timestamp,
  ) : ?Types.InAppNotification {
    // Only fire below 20 % fuel
    if (fuelPercent >= 20.0) { return null };

    // Check whether we already sent a warning for this exact subscription period
    let alreadySent = switch (lowFuelSentFor.get(userId)) {
      case null { false };
      case (?storedExpiry) { storedExpiry == subscriptionExpirationTimestamp };
    };
    if (alreadySent) { return null };

    // Record that we have now sent a warning for this period
    lowFuelSentFor.add(userId, subscriptionExpirationTimestamp);

    // Create and return the notification
    let notif = createNotification(
      notifications,
      notifCounter,
      userId,
      #lowFuelWarning,
      "Low Fuel Warning ⚠️",
      "Your DeLorean is running low on gas. Refuel before your listings are archived.",
      now,
    );
    ?notif;
  };
};

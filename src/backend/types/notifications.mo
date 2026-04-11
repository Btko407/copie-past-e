import Common "common";

module {
  /// Variant representing the category of an in-app notification.
  public type NotificationType = {
    #subscriptionExpiry;
    #subscriptionRenewed;
    #listingArchived;
    #listingDeletionWarning;
    #adminAnnouncement;
    #lowFuelWarning;
    #paymentFailed;
    #subscriptionCancelled;
    #refuelSuccess;
  };

  /// A single in-app notification for a user.
  public type InAppNotification = {
    id : Nat;
    userId : Common.UserId;
    notificationType : NotificationType;
    title : Text;
    message : Text;
    isRead : Bool;
    createdAt : Common.Timestamp;
  };

  /// Result type for marking a notification read.
  public type MarkReadResult = {
    #ok;
    #err : Text;
  };
};

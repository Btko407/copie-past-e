import Common "common";

module {
  /// An admin-only activity feed notification.
  public type AdminNotification = {
    id            : Nat;
    notifType     : Text;    // "signup" | "payment" | "listing" | "backup" | "error" | "support" | "broadcast"
    message       : Text;
    relatedUser   : Text;    // username or userId text
    relatedId     : ?Text;   // e.g. listingId, paymentId
    priority      : Text;    // "normal" | "important" | "urgent"
    isRead        : Bool;
    createdAt     : Common.Timestamp;
    targetAdminId : ?Text;   // null = all admins, specific principal text = only that admin
  };
};

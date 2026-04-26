import Common "common";

module {
  /// A support ticket submitted by a user.
  public type SupportTicket = {
    id             : Nat;
    userId         : Common.UserId;
    username       : Text;
    subject        : Text;
    message        : Text;
    status         : Text;         // "open" | "replied" | "closed"
    adminReply     : ?Text;
    createdAt      : Common.Timestamp;
    repliedAt      : ?Common.Timestamp;
    attachmentUrls : ?[Text];      // object-storage URLs for screenshots/files (optional for upgrade compat)
  };
};

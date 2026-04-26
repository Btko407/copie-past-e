import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import SupportTypes "../types/support-tickets";
import NotifTypes "../types/notifications";
import AdminNotifTypes "../types/admin-notifications";
import ProfileTypes "../types/userprofile";
import SupportLib "../lib/support-tickets";
import NotifLib "../lib/notifications";
import AdminNotifLib "../lib/admin-notifications";

mixin (
  accessControlState : AccessControl.AccessControlState,
  supportTickets     : List.List<SupportTypes.SupportTicket>,
  ticketCounter      : { var value : Nat },
  notifications      : Map.Map<Common.UserId, List.List<NotifTypes.InAppNotification>>,
  notifCounter       : { var value : Nat },
  adminNotifs        : List.List<AdminNotifTypes.AdminNotification>,
  adminNotifCounter  : { var value : Nat },
  profiles           : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
) {
  /// User: submit a support ticket with optional file attachment URLs.
  public shared ({ caller }) func submitSupportTicket(
    subject        : Text,
    message        : Text,
    attachmentUrls : [Text],
  ) : async { #ok : Text; #err : Text } {
    let now = Time.now();
    let username : Text = switch (profiles.get(caller)) {
      case (?p) { p.username };
      case null { caller.toText() };
    };
    let result = SupportLib.submitSupportTicket(
      supportTickets, ticketCounter, caller, username, subject, message, attachmentUrls, now,
    );
    switch (result) {
      case (#ok(msg)) {
        // Notify admins of new ticket
        ignore AdminNotifLib.createAdminNotification(
          adminNotifs, adminNotifCounter,
          "support",
          "New support ticket from " # username # ": " # subject,
          username,
          null,
          "important",
          null,
          now,
        );
        #ok(msg)
      };
      case (#err(e)) #err(e);
    }
  };

  /// Admin: list all support tickets.
  public query ({ caller }) func listSupportTickets() : async [SupportTypes.SupportTicket] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: admin only");
    };
    SupportLib.listSupportTickets(supportTickets)
  };

  /// Admin: get a single support ticket by id.
  public query ({ caller }) func getSupportTicket(id : Nat) : async ?SupportTypes.SupportTicket {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: admin only");
    };
    SupportLib.getSupportTicket(supportTickets, id)
  };

  /// Admin: reply to a support ticket and notify the user.
  public shared ({ caller }) func replySupportTicket(
    id    : Nat,
    reply : Text,
  ) : async { #ok; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return #err("Unauthorized: admin only");
    };
    let now = Time.now();
    switch (SupportLib.replySupportTicket(supportTickets, id, reply, now)) {
      case (#err(e)) { #err(e) };
      case (#ok(ticket)) {
        // Create user notification with the reply
        ignore NotifLib.createNotification(
          notifications, notifCounter,
          ticket.userId,
          #adminAnnouncement,
          "Support Reply: " # ticket.subject,
          "Admin replied: " # reply,
          now,
        );
        #ok
      };
    }
  };

  /// Admin: close a support ticket.
  public shared ({ caller }) func closeSupportTicket(id : Nat) : async { #ok; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return #err("Unauthorized: admin only");
    };
    SupportLib.closeSupportTicket(supportTickets, id)
  };
};

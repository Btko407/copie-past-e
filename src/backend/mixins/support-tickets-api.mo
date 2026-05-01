import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
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
  // ── CallerGuard — reentrancy + anonymous principal protection ────────────
  let ticketsInProgress = Set.empty<Principal>();

  func ticketsGuard(caller : Principal) {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: anonymous principal not allowed");
    };
    if (ticketsInProgress.contains(caller)) {
      Runtime.trap("Reentrant call detected");
    };
    ticketsInProgress.add(caller);
  };

  func ticketsRelease(caller : Principal) {
    ticketsInProgress.remove(caller);
  };

  /// User: submit a support ticket with optional file attachment URLs.
  public shared ({ caller }) func submitSupportTicket(
    subject        : Text,
    message        : Text,
    attachmentUrls : [Text],
  ) : async { #ok : Text; #err : Text } {
    ticketsGuard(caller);
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
        ticketsRelease(caller);
        #ok(msg)
      };
      case (#err(e)) { ticketsRelease(caller); #err(e) };
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
    ticketsGuard(caller);
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      ticketsRelease(caller);
      return #err("Unauthorized: admin only");
    };
    let now = Time.now();
    let result = switch (SupportLib.replySupportTicket(supportTickets, id, reply, now)) {
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
    };
    ticketsRelease(caller);
    result;
  };

  /// Admin: close a support ticket.
  public shared ({ caller }) func closeSupportTicket(id : Nat) : async { #ok; #err : Text } {
    ticketsGuard(caller);
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      ticketsRelease(caller);
      return #err("Unauthorized: admin only");
    };
    let result = SupportLib.closeSupportTicket(supportTickets, id);
    ticketsRelease(caller);
    result;
  };
};

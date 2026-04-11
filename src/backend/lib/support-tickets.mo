import List "mo:core/List";
import Common "../types/common";
import Types "../types/support-tickets";

module {
  /// Submit a new support ticket.
  public func submitSupportTicket(
    tickets  : List.List<Types.SupportTicket>,
    counter  : { var value : Nat },
    userId   : Common.UserId,
    username : Text,
    subject  : Text,
    message  : Text,
    now      : Common.Timestamp,
  ) : { #ok : Text; #err : Text } {
    let id = counter.value;
    counter.value += 1;
    let ticket : Types.SupportTicket = {
      id;
      userId;
      username;
      subject;
      message;
      status     = "open";
      adminReply = null;
      createdAt  = now;
      repliedAt  = null;
    };
    tickets.add(ticket);
    #ok("Ticket submitted with id: " # id.toText())
  };

  /// Return all tickets, newest first. (Admin use.)
  public func listSupportTickets(
    tickets : List.List<Types.SupportTicket>,
  ) : [Types.SupportTicket] {
    let arr = tickets.toArray();
    arr.sort(func(a : Types.SupportTicket, b : Types.SupportTicket) : { #less; #equal; #greater } {
      if (a.createdAt > b.createdAt) #less
      else if (a.createdAt < b.createdAt) #greater
      else #equal
    })
  };

  /// Return a single ticket by id. (Admin use.)
  public func getSupportTicket(
    tickets  : List.List<Types.SupportTicket>,
    id       : Nat,
  ) : ?Types.SupportTicket {
    tickets.find(func(t : Types.SupportTicket) : Bool { t.id == id })
  };

  /// Admin replies to a ticket; sets status=replied, repliedAt=now.
  public func replySupportTicket(
    tickets : List.List<Types.SupportTicket>,
    id      : Nat,
    reply   : Text,
    now     : Common.Timestamp,
  ) : { #ok : Types.SupportTicket; #err : Text } {
    var found : ?Types.SupportTicket = null;
    tickets.mapInPlace(func(t : Types.SupportTicket) : Types.SupportTicket {
      if (t.id == id) {
        let updated = { t with
          adminReply = ?reply;
          status     = "replied";
          repliedAt  = ?now;
        };
        found := ?updated;
        updated
      } else { t }
    });
    switch (found) {
      case (?t) #ok(t);
      case null  #err("Ticket not found: " # id.toText());
    }
  };

  /// Admin closes a ticket.
  public func closeSupportTicket(
    tickets : List.List<Types.SupportTicket>,
    id      : Nat,
  ) : { #ok; #err : Text } {
    var found = false;
    tickets.mapInPlace(func(t : Types.SupportTicket) : Types.SupportTicket {
      if (t.id == id) {
        found := true;
        { t with status = "closed" }
      } else { t }
    });
    if (found) #ok else #err("Ticket not found: " # id.toText())
  };
};

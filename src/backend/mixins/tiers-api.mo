import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import TierTypes "../types/tiers";
import PaymentTypes "../types/payments";
import ListingTypes "../types/listings";
import Common "../types/common";
import TiersLib "../lib/tiers";
import ProfileTypes "../types/userprofile";
import ProfileLib "../lib/userprofile";

mixin (
  accessControlState : AccessControl.AccessControlState,
  tiers : Map.Map<Nat, TierTypes.TierConfig>,
  subscriptions : Map.Map<Common.UserId, TierTypes.UserTierSubscription>,
  payments : Map.Map<Nat, PaymentTypes.PaymentRecord>,
  discounts : Map.Map<Nat, PaymentTypes.DiscountCode>,
  adminTierActions : Map.Map<Nat, PaymentTypes.AdminTierAction>,
  paymentCounter : { var value : Nat },
  discountCounter : { var value : Nat },
  adminActionCounter : { var value : Nat },
  listings : Map.Map<Common.ListingId, ListingTypes.Listing>,
  profiles : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
  usernameIndex : Map.Map<Text, Common.UserId>,
) {
  /// Get all tier configurations (public).
  public query func getTiers() : async [TierTypes.TierConfig] {
    let arr = tiers.toArray();
    arr.map<(Nat, TierTypes.TierConfig), TierTypes.TierConfig>(func((_, cfg)) { cfg });
  };

  /// Get a single tier config by ID (public).
  public query func getTier(tierId : Nat) : async ?TierTypes.TierConfig {
    TiersLib.getTier(tiers, tierId);
  };

  /// Admin: update or create a tier configuration.
  public shared ({ caller }) func adminUpsertTier(config : TierTypes.TierConfig) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) Runtime.trap("Unauthorized");
    TiersLib.upsertTier(tiers, config);
  };

  /// Get the caller's current tier subscription.
  public query ({ caller }) func getMySubscription() : async ?TierTypes.UserTierSubscription {
    TiersLib.getUserSubscription(subscriptions, caller);
  };

  /// Get a specific user's subscription (admin only).
  public query ({ caller }) func adminGetUserSubscription(userId : Common.UserId) : async ?TierTypes.UserTierSubscription {
    if (not AccessControl.isAdmin(accessControlState, caller)) Runtime.trap("Unauthorized");
    TiersLib.getUserSubscription(subscriptions, userId);
  };

  /// Admin: extend a user's tier subscription and cascade the extension to their listings.
  public shared ({ caller }) func adminExtendUserTier(
    userId : Common.UserId,
    tierId : Nat,
    daysAdded : Nat,
  ) : async TierTypes.UserTierSubscription {
    if (not AccessControl.isAdmin(accessControlState, caller)) Runtime.trap("Unauthorized");
    let nowNs : Int = Time.now();
    let addedNs : Int = daysAdded * 24 * 3600 * 1_000_000_000;

    // Extend or create the subscription
    let newSub = TiersLib.extendSubscription(subscriptions, userId, tierId, daysAdded, nowNs);

    // Record the admin action
    let actionId = adminActionCounter.value;
    adminActionCounter.value += 1;
    let action : PaymentTypes.AdminTierAction = {
      adminId = caller;
      userId;
      tierId;
      daysAdded;
      newExpirationDate = newSub.expirationDate;
      createdAt = nowNs;
    };
    adminTierActions.add(actionId, action);

    // Extend active listings; re-activate archived listings for this user
    listings.forEach(func(listingId, listing) {
      if (Principal.equal(listing.userId, userId)) {
        switch (listing.status) {
          case (#active) {
            listings.add(
              listingId,
              { listing with expirationDate = listing.expirationDate + addedNs },
            );
          };
          case (#archived) {
            listings.add(
              listingId,
              { listing with status = #active; expirationDate = nowNs + addedNs },
            );
          };
        };
      };
    });

    newSub;
  };

  /// Admin: extend a user's tier subscription by username (resolves username → Principal internally).
  /// Admins use usernames, not Principal IDs, to identify users in the admin panel.
  /// Returns #ok(subscription) on success or #err(reason) if the username is not found.
  public shared ({ caller }) func adminExtendUserTierByUsername(
    username : Text,
    tierId : Nat,
    daysAdded : Nat,
  ) : async { #ok : TierTypes.UserTierSubscription; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) Runtime.trap("Unauthorized");
    switch (ProfileLib.getProfileByUsername(usernameIndex, profiles, username)) {
      case null { #err("User not found: " # username) };
      case (?profile) {
        let nowNs : Int = Time.now();
        let addedNs : Int = daysAdded * 24 * 3600 * 1_000_000_000;

        let newSub = TiersLib.extendSubscription(subscriptions, profile.userId, tierId, daysAdded, nowNs);

        let actionId = adminActionCounter.value;
        adminActionCounter.value += 1;
        let action : PaymentTypes.AdminTierAction = {
          adminId = caller;
          userId = profile.userId;
          tierId;
          daysAdded;
          newExpirationDate = newSub.expirationDate;
          createdAt = nowNs;
        };
        adminTierActions.add(actionId, action);

        listings.forEach(func(listingId, listing) {
          if (Principal.equal(listing.userId, profile.userId)) {
            switch (listing.status) {
              case (#active) {
                listings.add(
                  listingId,
                  { listing with expirationDate = listing.expirationDate + addedNs },
                );
              };
              case (#archived) {
                listings.add(
                  listingId,
                  { listing with status = #active; expirationDate = nowNs + addedNs },
                );
              };
            };
          };
        });

        #ok(newSub);
      };
    };
  };

  /// Admin: list all tier actions taken by admins.
  public query ({ caller }) func adminListTierActions() : async [PaymentTypes.AdminTierAction] {
    if (not AccessControl.isAdmin(accessControlState, caller)) Runtime.trap("Unauthorized");
    let arr = adminTierActions.toArray();
    arr.map<(Nat, PaymentTypes.AdminTierAction), PaymentTypes.AdminTierAction>(func((_, a)) { a });
  };

  /// Admin: get all user subscriptions.
  public query ({ caller }) func adminListSubscriptions() : async [TierTypes.UserTierSubscription] {
    if (not AccessControl.isAdmin(accessControlState, caller)) Runtime.trap("Unauthorized");
    let arr = subscriptions.toArray();
    arr.map<(Common.UserId, TierTypes.UserTierSubscription), TierTypes.UserTierSubscription>(func((_, s)) { s });
  };
};

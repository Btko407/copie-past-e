import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import Types "../types/loyalty";
import TierTypes "../types/tiers";
import LoyaltyLib "../lib/loyalty";
import TiersLib "../lib/tiers";

/// Loyalty API — tracks refuel history per user, enforces one-time rewards
/// per tier, and allows users to claim 30 free days when thresholds are met.
mixin (
  accessControlState : AccessControl.AccessControlState,
  refuelHistory      : Map.Map<Common.UserId, List.List<Types.RefuelEntry>>,
  claimedRewards     : Map.Map<Common.UserId, List.List<Types.TierName>>,
  subscriptions      : Map.Map<Common.UserId, TierTypes.UserTierSubscription>,
) {
  /// Return the caller's full loyalty status: refuel count, claimed tiers,
  /// and current tier name. The frontend uses this to decide whether to show
  /// the 'Activate Free Gas' button.
  public query ({ caller }) func getLoyaltyStatus() : async Types.LoyaltyStatus {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to view loyalty status");
    };
    LoyaltyLib.getLoyaltyStatus(refuelHistory, claimedRewards, subscriptions, caller);
  };

  /// Claim the free 30-day loyalty reward for the given tier.
  /// Adds 30 days to the caller's subscription and marks the reward as claimed.
  /// Returns #err if:
  ///   - the reward was already claimed for this tier
  ///   - the user has not yet met the refuel threshold for this tier
  public shared ({ caller }) func claimLoyaltyReward(tier : Types.TierName) : async { #ok; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized: Must be logged in to claim a loyalty reward");
    };
    if (not LoyaltyLib.isRewardEligible(refuelHistory, claimedRewards, caller, tier)) {
      // Determine more specific error
      let claimed = LoyaltyLib.getClaimedTiers(claimedRewards, caller);
      for (t in claimed.vals()) {
        if (t == tier) {
          return #err("You have already claimed the free gas reward for " # tier);
        };
      };
      let count = LoyaltyLib.getRefuelCount(refuelHistory, caller);
      let threshold = LoyaltyLib.refuelThreshold(tier);
      return #err(
        "You need " # threshold.toText() # " refuels to unlock this reward — you have " # count.toText()
      );
    };
    // Mark reward as claimed
    LoyaltyLib.markRewardClaimed(claimedRewards, caller, tier);
    // Add 30 days to subscription
    let now = Time.now();
    let currentTierId = switch (subscriptions.get(caller)) {
      case null { 1 };
      case (?sub) { sub.tier };
    };
    ignore TiersLib.extendSubscription(subscriptions, caller, currentTierId, 30, now);
    #ok;
  };

  /// Return the caller's full refuel history log (date + tier at time of refuel),
  /// most recent first.
  public query ({ caller }) func getRefuelHistory() : async [Types.RefuelEntry] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to view refuel history");
    };
    LoyaltyLib.getRefuelHistory(refuelHistory, caller);
  };
};

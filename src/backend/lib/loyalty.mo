import Map "mo:core/Map";
import List "mo:core/List";
import Common "../types/common";
import Types "../types/loyalty";
import TierTypes "../types/tiers";

module {
  /// Append a refuel entry to the user's refuel history.
  public func recordRefuel(
    refuelHistory : Map.Map<Common.UserId, List.List<Types.RefuelEntry>>,
    userId        : Common.UserId,
    tierName      : Types.TierName,
    now           : Int,
  ) : () {
    let entry : Types.RefuelEntry = { date = now; tierAtRefuel = tierName };
    switch (refuelHistory.get(userId)) {
      case null {
        let list = List.empty<Types.RefuelEntry>();
        list.add(entry);
        refuelHistory.add(userId, list);
      };
      case (?existing) {
        existing.add(entry);
      };
    };
  };

  /// Return the count of past refuels for a user.
  public func getRefuelCount(
    refuelHistory : Map.Map<Common.UserId, List.List<Types.RefuelEntry>>,
    userId        : Common.UserId,
  ) : Nat {
    switch (refuelHistory.get(userId)) {
      case null { 0 };
      case (?list) { list.size() };
    };
  };

  /// Return the set of tiers for which the loyalty reward has already been claimed.
  public func getClaimedTiers(
    claimedRewards : Map.Map<Common.UserId, List.List<Types.TierName>>,
    userId         : Common.UserId,
  ) : [Types.TierName] {
    switch (claimedRewards.get(userId)) {
      case null { [] };
      case (?list) { list.toArray() };
    };
  };

  /// Mark the loyalty reward as claimed for the given tier.
  public func markRewardClaimed(
    claimedRewards : Map.Map<Common.UserId, List.List<Types.TierName>>,
    userId         : Common.UserId,
    tier           : Types.TierName,
  ) : () {
    switch (claimedRewards.get(userId)) {
      case null {
        let list = List.empty<Types.TierName>();
        list.add(tier);
        claimedRewards.add(userId, list);
      };
      case (?existing) {
        // Only add if not already claimed
        var alreadyClaimed = false;
        for (t in existing.values()) {
          if (t == tier) { alreadyClaimed := true };
        };
        if (not alreadyClaimed) existing.add(tier);
      };
    };
  };

  /// Build the full LoyaltyStatus record for a user.
  public func getLoyaltyStatus(
    refuelHistory  : Map.Map<Common.UserId, List.List<Types.RefuelEntry>>,
    claimedRewards : Map.Map<Common.UserId, List.List<Types.TierName>>,
    subscriptions  : Map.Map<Common.UserId, TierTypes.UserTierSubscription>,
    userId         : Common.UserId,
  ) : Types.LoyaltyStatus {
    let refuelCount = getRefuelCount(refuelHistory, userId);
    let rewardClaimedForTiers = getClaimedTiers(claimedRewards, userId);
    let currentTier = switch (subscriptions.get(userId)) {
      case null { "time_walker" };
      case (?sub) { tierIdToName(sub.tier) };
    };
    { refuelCount; rewardClaimedForTiers; currentTier };
  };

  /// Resolve a numeric tier ID to its canonical TierName string.
  public func tierIdToName(tierId : Nat) : Types.TierName {
    switch (tierId) {
      case 1 { "time_walker" };
      case 2 { "time_traveler" };
      case 3 { "time_lord" };
      case _ { "time_walker" };  // default to base tier
    };
  };

  /// Return the refuel threshold for a tier (minimum refuels to unlock reward).
  public func refuelThreshold(tierName : Types.TierName) : Nat {
    switch (tierName) {
      case "time_lord"     { 1 };
      case "time_traveler" { 2 };
      case _               { 3 }; // time_walker and default
    };
  };

  /// Check whether the user has met the refuel threshold for the given tier
  /// AND the reward has not been claimed yet.
  public func isRewardEligible(
    refuelHistory  : Map.Map<Common.UserId, List.List<Types.RefuelEntry>>,
    claimedRewards : Map.Map<Common.UserId, List.List<Types.TierName>>,
    userId         : Common.UserId,
    tierName       : Types.TierName,
  ) : Bool {
    let count = getRefuelCount(refuelHistory, userId);
    let threshold = refuelThreshold(tierName);
    if (count < threshold) return false;
    // Check not already claimed
    let claimed = getClaimedTiers(claimedRewards, userId);
    for (t in claimed.vals()) {
      if (t == tierName) return false;
    };
    true;
  };

  /// Return full refuel history for a user as an array (most recent first).
  public func getRefuelHistory(
    refuelHistory : Map.Map<Common.UserId, List.List<Types.RefuelEntry>>,
    userId        : Common.UserId,
  ) : [Types.RefuelEntry] {
    switch (refuelHistory.get(userId)) {
      case null { [] };
      case (?list) { list.reverse().toArray() };
    };
  };
};

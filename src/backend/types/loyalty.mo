module {
  /// Tier name alias used to identify which tier a loyalty reward applies to.
  public type TierName = Text; // "time_walker" | "time_traveler" | "time_lord"

  /// A single entry in the user's refuel (gas purchase) history.
  public type RefuelEntry = {
    date         : Int;     // Timestamp (nanoseconds)
    tierAtRefuel : TierName;
  };

  /// Full loyalty status returned to the frontend so it can show the
  /// 'Activate Free Gas' button when thresholds are met.
  public type LoyaltyStatus = {
    refuelCount           : Nat;
    rewardClaimedForTiers : [TierName];
    currentTier           : TierName;
  };
};

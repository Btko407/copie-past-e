import Map "mo:core/Map";
import TierTypes "../types/tiers";
import Common "../types/common";

module {
  /// Returns the 3 default tier configurations.
  public func getDefaultTiers() : [TierTypes.TierConfig] {
    [
      { tierId = 1; name = "Free"; durationDays = 30; priceUSD = 0.0; stripeProductId = null },
      { tierId = 2; name = "Traveler"; durationDays = 90; priceUSD = 9.99; stripeProductId = null },
      { tierId = 3; name = "Time Lord"; durationDays = 180; priceUSD = 19.99; stripeProductId = null },
    ];
  };

  /// Look up a tier by its ID.
  public func getTier(
    tiers : Map.Map<Nat, TierTypes.TierConfig>,
    tierId : Nat,
  ) : ?TierTypes.TierConfig {
    tiers.get(tierId);
  };

  /// Insert or overwrite a tier configuration.
  public func upsertTier(
    tiers : Map.Map<Nat, TierTypes.TierConfig>,
    config : TierTypes.TierConfig,
  ) : () {
    tiers.add(config.tierId, config);
  };

  /// Retrieve a user's subscription, if any.
  public func getUserSubscription(
    subscriptions : Map.Map<Common.UserId, TierTypes.UserTierSubscription>,
    userId : Common.UserId,
  ) : ?TierTypes.UserTierSubscription {
    subscriptions.get(userId);
  };

  /// Insert or overwrite a subscription record.
  public func upsertSubscription(
    subscriptions : Map.Map<Common.UserId, TierTypes.UserTierSubscription>,
    sub : TierTypes.UserTierSubscription,
  ) : () {
    subscriptions.add(sub.userId, sub);
  };

  /// Extend (or create) a user's subscription by daysAdded.
  /// If the user already has an active subscription, the days are added on top.
  /// Otherwise the countdown starts from nowNs.
  public func extendSubscription(
    subscriptions : Map.Map<Common.UserId, TierTypes.UserTierSubscription>,
    userId : Common.UserId,
    tierId : Nat,
    daysAdded : Nat,
    nowNs : Int,
  ) : TierTypes.UserTierSubscription {
    let addedNs : Int = daysAdded * 24 * 3600 * 1_000_000_000;
    let base : Int = switch (subscriptions.get(userId)) {
      case (?existing) {
        // Add on top of the existing expiration (whether active or past)
        if (existing.expirationDate > nowNs) existing.expirationDate else nowNs;
      };
      case null { nowNs };
    };
    let newSub : TierTypes.UserTierSubscription = {
      userId;
      tier = tierId;
      expirationDate = base + addedNs;
      autoRenewal = false;
      stripeSubscriptionId = null;
      updatedAt = nowNs;
    };
    subscriptions.add(userId, newSub);
    newSub;
  };

  /// Returns true if the subscription's expiration is in the future.
  public func isSubscriptionActive(
    sub : TierTypes.UserTierSubscription,
    nowNs : Int,
  ) : Bool {
    sub.expirationDate > nowNs;
  };

  /// Reset a user's subscription to now (sets expirationDate = nowNs, effectively zeroing time).
  /// Creates a zeroed subscription record if none exists.
  public func resetUserSubscription(
    subscriptions : Map.Map<Common.UserId, TierTypes.UserTierSubscription>,
    userId : Common.UserId,
    nowNs : Int,
  ) : () {
    let existing = switch (subscriptions.get(userId)) {
      case (?sub) sub;
      case null {
        { userId; tier = 1; expirationDate = nowNs; autoRenewal = false; stripeSubscriptionId = null; updatedAt = nowNs };
      };
    };
    subscriptions.add(userId, { existing with expirationDate = nowNs; updatedAt = nowNs });
  };

  /// Returns the user's tier level if they have an active subscription, else 1 (free).
  public func effectiveTierLevel(
    subscriptions : Map.Map<Common.UserId, TierTypes.UserTierSubscription>,
    userId : Common.UserId,
    nowNs : Int,
  ) : Nat {
    switch (subscriptions.get(userId)) {
      case (?sub) {
        if (isSubscriptionActive(sub, nowNs)) sub.tier else 1;
      };
      case null { 1 };
    };
  };
};

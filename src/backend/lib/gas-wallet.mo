import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import TierTypes "../types/tiers";
import GasTypes "../types/gas-wallet";
import Common "../types/common";
import TiersLib "../lib/tiers";

module {
  /// Gas cost per tier renewal
  public let GAS_COST_TIER_1 : Nat = 5;
  public let GAS_COST_TIER_2 : Nat = 10;
  public let GAS_COST_TIER_3 : Nat = 50;

  // Days until expiry threshold for auto-renewal
  public let AUTO_RENEWAL_THRESHOLD_DAYS : Int = 7;
  public let DAYS_NS : Int = 86_400_000_000_000;

  /// Bulk Gas discount tiers — display-only in this build.
  /// Full pricing engine activation (applying discounts at checkout) is deferred.
  public func getDefaultBulkDiscounts() : [GasTypes.BulkGasDiscount] {
    [
      { minGasAmount = 50;  discountPercent = 10; description = "50+ Gas: 10% off"  },
      { minGasAmount = 100; discountPercent = 15; description = "100+ Gas: 15% off" },
    ];
  };

  /// Seed the 3 default gas packages.
  public func getDefaultPackages() : [GasTypes.GasPackage] {
    [
      { packageId = 1; name = "Starter Fuel"; gasAmount = 5;  priceUSD = 5.0;  stripeProductId = "" },
      { packageId = 2; name = "Road Trip";    gasAmount = 10; priceUSD = 10.0; stripeProductId = "" },
      { packageId = 3; name = "Full Tank";    gasAmount = 50; priceUSD = 50.0; stripeProductId = "" },
    ];
  };

  /// Get a user's wallet, returning null if not initialized.
  public func getWallet(
    wallets : Map.Map<Common.UserId, GasTypes.GasWallet>,
    userId : Common.UserId,
  ) : ?GasTypes.GasWallet {
    wallets.get(userId);
  };

  /// Initialize a new wallet for a user with zero balance.
  public func initWallet(
    wallets : Map.Map<Common.UserId, GasTypes.GasWallet>,
    userId : Common.UserId,
    nowNs : Common.Timestamp,
  ) : GasTypes.GasWallet {
    let wallet : GasTypes.GasWallet = {
      userId;
      gasBalance = 0;
      autoRenewal = false;
      autoRenewalTierId = 1;
      updatedAt = nowNs;
    };
    wallets.add(userId, wallet);
    wallet;
  };

  /// Get wallet or create it if not found.
  public func getOrInitWallet(
    wallets : Map.Map<Common.UserId, GasTypes.GasWallet>,
    userId : Common.UserId,
    nowNs : Common.Timestamp,
  ) : GasTypes.GasWallet {
    switch (wallets.get(userId)) {
      case (?w) w;
      case null { initWallet(wallets, userId, nowNs) };
    };
  };

  /// Add gas to a user's wallet.
  public func addGas(
    wallets : Map.Map<Common.UserId, GasTypes.GasWallet>,
    userId : Common.UserId,
    amount : Nat,
    nowNs : Common.Timestamp,
  ) : GasTypes.GasWallet {
    let wallet = getOrInitWallet(wallets, userId, nowNs);
    let updated : GasTypes.GasWallet = { wallet with gasBalance = wallet.gasBalance + amount; updatedAt = nowNs };
    wallets.add(userId, updated);
    updated;
  };

  /// Deduct gas from a user's wallet. Returns false if insufficient balance.
  public func deductGas(
    wallets : Map.Map<Common.UserId, GasTypes.GasWallet>,
    userId : Common.UserId,
    amount : Nat,
    nowNs : Common.Timestamp,
  ) : Bool {
    let wallet = getOrInitWallet(wallets, userId, nowNs);
    if (wallet.gasBalance < amount) {
      return false;
    };
    let updated : GasTypes.GasWallet = { wallet with gasBalance = wallet.gasBalance - amount; updatedAt = nowNs };
    wallets.add(userId, updated);
    true;
  };

  /// Set auto-renewal preference for a user's wallet.
  public func setAutoRenewal(
    wallets : Map.Map<Common.UserId, GasTypes.GasWallet>,
    userId : Common.UserId,
    enabled : Bool,
    tierId : Nat,
    nowNs : Common.Timestamp,
  ) : GasTypes.GasWallet {
    let wallet = getOrInitWallet(wallets, userId, nowNs);
    let updated : GasTypes.GasWallet = { wallet with autoRenewal = enabled; autoRenewalTierId = tierId; updatedAt = nowNs };
    wallets.add(userId, updated);
    updated;
  };

  /// Get all gas purchases for a user.
  public func getGasPurchases(
    purchases : Map.Map<Nat, GasTypes.GasPurchase>,
    userId : Common.UserId,
  ) : [GasTypes.GasPurchase] {
    purchases.values()
      .filter(func(p) { Principal.equal(p.userId, userId) })
      .toArray();
  };

  /// Create a pending gas purchase record.
  public func createGasPurchase(
    purchases : Map.Map<Nat, GasTypes.GasPurchase>,
    counter : { var value : Nat },
    userId : Common.UserId,
    pkg : GasTypes.GasPackage,
    stripePaymentIntentId : Text,
    nowNs : Common.Timestamp,
  ) : GasTypes.GasPurchase {
    let id = counter.value;
    counter.value += 1;
    let purchase : GasTypes.GasPurchase = {
      id;
      userId;
      gasAmount = pkg.gasAmount;
      priceUSD = pkg.priceUSD;
      stripePaymentIntentId;
      status = #pending;
      createdAt = nowNs;
    };
    purchases.add(id, purchase);
    purchase;
  };

  /// Update the status of a gas purchase record.
  public func updateGasPurchaseStatus(
    purchases : Map.Map<Nat, GasTypes.GasPurchase>,
    purchaseId : Nat,
    status : GasTypes.GasPurchaseStatus,
  ) : () {
    switch (purchases.get(purchaseId)) {
      case (?p) { purchases.add(purchaseId, { p with status }) };
      case null {};
    };
  };

  /// Gas cost for a given tier ID.
  public func gasCostForTier(tierId : Nat) : Nat {
    if (tierId == 1) { GAS_COST_TIER_1 }
    else if (tierId == 2) { GAS_COST_TIER_2 }
    else { GAS_COST_TIER_3 };
  };

  /// Process auto-renewal for a single user.
  /// Returns true if renewal was applied, false otherwise.
  public func processAutoRenewal(
    wallets : Map.Map<Common.UserId, GasTypes.GasWallet>,
    subscriptions : Map.Map<Common.UserId, TierTypes.UserTierSubscription>,
    userId : Common.UserId,
    nowNs : Common.Timestamp,
  ) : Bool {
    let wallet = switch (wallets.get(userId)) {
      case (?w) w;
      case null { return false };
    };
    if (not wallet.autoRenewal) { return false };

    let sub = switch (subscriptions.get(userId)) {
      case (?s) s;
      case null { return false };
    };

    // Only renew if within 7 days of expiry (or already expired)
    let daysUntilExpiry = (sub.expirationDate - nowNs) / DAYS_NS;
    if (daysUntilExpiry > AUTO_RENEWAL_THRESHOLD_DAYS) { return false };

    let tierId = wallet.autoRenewalTierId;
    let cost = gasCostForTier(tierId);
    if (wallet.gasBalance < cost) { return false };

    // Deduct gas
    let deducted = deductGas(wallets, userId, cost, nowNs);
    if (not deducted) { return false };

    // Extend subscription using the tier's duration
    let daysToAdd : Nat = if (tierId == 1) { 30 } else if (tierId == 2) { 90 } else { 180 };
    ignore TiersLib.extendSubscription(subscriptions, userId, tierId, daysToAdd, nowNs);
    true;
  };
};

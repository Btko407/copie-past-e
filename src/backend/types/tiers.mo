module {
  public type TierConfig = {
    tierId : Nat;
    name : Text;
    durationDays : Nat;
    priceUSD : Float;
    stripeProductId : ?Text;
  };

  public type UserTierSubscription = {
    userId : Principal;
    tier : Nat;
    expirationDate : Int;
    autoRenewal : Bool;
    stripeSubscriptionId : ?Text;
    updatedAt : Int;
  };
};

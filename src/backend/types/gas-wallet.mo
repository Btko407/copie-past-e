import Common "common";

module {
  public type GasWallet = {
    userId : Common.UserId;
    gasBalance : Nat;
    autoRenewal : Bool;
    autoRenewalTierId : Nat;
    updatedAt : Common.Timestamp;
  };

  public type GasPurchaseStatus = {
    #pending;
    #completed;
    #failed;
  };

  public type GasPurchase = {
    id : Nat;
    userId : Common.UserId;
    gasAmount : Nat;
    priceUSD : Float;
    stripePaymentIntentId : Text;
    status : GasPurchaseStatus;
    createdAt : Common.Timestamp;
  };

  public type GasPackage = {
    packageId : Nat;
    name : Text;
    gasAmount : Nat;
    priceUSD : Float;
    stripeProductId : Text;
  };

  public type BulkGasDiscount = {
    minGasAmount : Nat;
    discountPercent : Nat;
    description : Text;
  };
};

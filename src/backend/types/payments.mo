module {
  /// Payment gateway configuration stored in canister state.
  /// Secret keys are stored as opt Text — absent means "not configured".
  /// stripeMode / paypalMode default to "test" / "sandbox" when absent.
  public type PaymentConfig = {
    stripePublishableKey : ?Text;
    stripeSecretKey : ?Text;
    stripeWebhookSecret : ?Text;
    /// Separate webhook secrets for test vs live mode
    stripeWebhookSecretTest : ?Text;
    stripeWebhookSecretLive : ?Text;
    stripeProPriceId : ?Text;
    stripeMaxPriceId : ?Text;
    /// Walker (starter) price ID
    stripeWalkerPriceId : ?Text;
    /// Backup price ID
    stripeBackupPriceId : ?Text;
    stripeMode : Text; // "test" or "live"
    paypalClientId : ?Text;
    paypalClientSecret : ?Text;
    paypalMode : Text; // "sandbox" or "live"
  };

  public type DiscountType = {
    #percentage;
    #fixedUSD;
  };

  public type DiscountCode = {
    id : Nat;
    code : Text;
    discountType : DiscountType;
    discountValue : Float;
    expirationDate : Int;
    maxUses : Nat;
    usageCount : Nat;
    tierRestriction : ?Nat;
    active : Bool;
  };

  public type PaymentStatus = {
    #pending;
    #completed;
    #failed;
  };

  public type PaymentMethod = {
    #stripe;
    #paypal;
    #crypto;
  };

  public type PaymentRecord = {
    id : Nat;
    userId : Principal;
    tierId : Nat;
    amountUSD : Float;
    status : PaymentStatus;
    paymentMethod : PaymentMethod;
    stripePaymentIntentId : ?Text;
    externalOrderId : ?Text;
    createdAt : Int;
  };

  public type AdminTierAction = {
    adminId : Principal;
    userId : Principal;
    tierId : Nat;
    daysAdded : Nat;
    newExpirationDate : Int;
    createdAt : Int;
  };

  /// A processed or failed webhook event entry for the admin log.
  public type WebhookEvent = {
    id : Text;
    eventType : Text;
    stripeCustomerId : ?Text;
    userId : ?Text;
    amount : ?Nat;
    status : Text; // "success" | "failed" | "duplicate"
    processedAt : Int;
    error : ?Text;
  };

  /// A failed webhook event stored for admin retry.
  public type FailedWebhookEvent = {
    id : Text;
    stripeEventId : Text;
    eventType : Text;
    payload : Text;
    errorMessage : Text;
    retryCount : Nat;
    createdAt : Int;
  };

  /// A payment success/failure banner state for a user.
  public type PaymentBannerState = {
    userId : Principal;
    bannerType : Text; // "success" | "failure"
    message : Text;
    expiresAt : ?Int;
    createdAt : Int;
  };

  /// A pending Stripe checkout session awaiting verification.
  /// Stored per user; cleared after verifyAndGrantPayment succeeds.
  public type PendingSession = {
    sessionId : Text;
    priceId   : Text;
    tierDays  : Nat;
    tierId    : Nat;
    createdAt : Int;
  };
};

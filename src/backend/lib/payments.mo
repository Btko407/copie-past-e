import Map "mo:core/Map";
import PaymentTypes "../types/payments";
import Common "../types/common";

module {
  public func createPaymentRecord(
    payments : Map.Map<Nat, PaymentTypes.PaymentRecord>,
    counter : { var value : Nat },
    userId : Common.UserId,
    tierId : Nat,
    amountUSD : Float,
    paymentMethod : PaymentTypes.PaymentMethod,
    stripePaymentIntentId : ?Text,
    externalOrderId : ?Text,
    nowNs : Int,
  ) : PaymentTypes.PaymentRecord {
    let id = counter.value;
    counter.value += 1;
    let record : PaymentTypes.PaymentRecord = {
      id;
      userId;
      tierId;
      amountUSD;
      status = #pending;
      paymentMethod;
      stripePaymentIntentId;
      externalOrderId;
      createdAt = nowNs;
    };
    payments.add(id, record);
    record;
  };

  public func updatePaymentStatus(
    payments : Map.Map<Nat, PaymentTypes.PaymentRecord>,
    paymentId : Nat,
    status : PaymentTypes.PaymentStatus,
  ) : () {
    switch (payments.get(paymentId)) {
      case (?record) {
        payments.add(paymentId, { record with status });
      };
      case null { /* no-op: payment not found */ };
    };
  };

  public func getPaymentRecord(
    payments : Map.Map<Nat, PaymentTypes.PaymentRecord>,
    paymentId : Nat,
  ) : ?PaymentTypes.PaymentRecord {
    payments.get(paymentId);
  };

  public func findPaymentByIntentId(
    payments : Map.Map<Nat, PaymentTypes.PaymentRecord>,
    stripePaymentIntentId : Text,
  ) : ?PaymentTypes.PaymentRecord {
    payments.values().find(func(r) { r.stripePaymentIntentId == ?stripePaymentIntentId });
  };

  public func totalRevenue(
    payments : Map.Map<Nat, PaymentTypes.PaymentRecord>,
  ) : Float {
    payments.values().foldLeft<PaymentTypes.PaymentRecord, Float>(
      0.0,
      func(acc, record) {
        switch (record.status) {
          case (#completed) { acc + record.amountUSD };
          case _ { acc };
        };
      },
    );
  };

  public func createDiscountCode(
    discounts : Map.Map<Nat, PaymentTypes.DiscountCode>,
    counter : { var value : Nat },
    code : Text,
    discountType : PaymentTypes.DiscountType,
    discountValue : Float,
    expirationDate : Int,
    maxUses : Nat,
    tierRestriction : ?Nat,
  ) : PaymentTypes.DiscountCode {
    let id = counter.value;
    counter.value += 1;
    let discount : PaymentTypes.DiscountCode = {
      id;
      code;
      discountType;
      discountValue;
      expirationDate;
      maxUses;
      usageCount = 0;
      tierRestriction;
      active = true;
    };
    discounts.add(id, discount);
    discount;
  };

  public func validateDiscountCode(
    discounts : Map.Map<Nat, PaymentTypes.DiscountCode>,
    code : Text,
    tierId : Nat,
    nowNs : Int,
  ) : ?PaymentTypes.DiscountCode {
    discounts.values().find(func(d) {
      d.code == code
      and d.active
      and d.expirationDate > nowNs
      and d.usageCount < d.maxUses
      and (switch (d.tierRestriction) { case (?t) { t == tierId }; case null { true } })
    });
  };

  public func applyDiscount(
    discounts : Map.Map<Nat, PaymentTypes.DiscountCode>,
    discountId : Nat,
  ) : () {
    switch (discounts.get(discountId)) {
      case (?d) {
        discounts.add(discountId, { d with usageCount = d.usageCount + 1 });
      };
      case null {};
    };
  };

  public func deactivateDiscountCode(
    discounts : Map.Map<Nat, PaymentTypes.DiscountCode>,
    discountId : Nat,
  ) : () {
    switch (discounts.get(discountId)) {
      case (?d) {
        discounts.add(discountId, { d with active = false });
      };
      case null {};
    };
  };

  public func recordAdminTierAction(
    actions : Map.Map<Nat, PaymentTypes.AdminTierAction>,
    counter : { var value : Nat },
    action : PaymentTypes.AdminTierAction,
  ) : () {
    let id = counter.value;
    counter.value += 1;
    actions.add(id, action);
  };

  public func applyDiscountToPrice(basePrice : Float, discount : PaymentTypes.DiscountCode) : Float {
    switch (discount.discountType) {
      case (#percentage) {
        let reduction = basePrice * (discount.discountValue / 100.0);
        let result = basePrice - reduction;
        if (result < 0.0) { 0.0 } else { result };
      };
      case (#fixedUSD) {
        let result = basePrice - discount.discountValue;
        if (result < 0.0) { 0.0 } else { result };
      };
    };
  };

  // --- PayPal stub ---
  // Creates a pending PaymentRecord with paymentMethod=#paypal and a placeholder orderId.
  // Returns the record so the mixin layer can expose it via the public API.
  // Full PayPal webhook integration activates by implementing confirmPayPalPayment below.
  public func initiatePayPalPaymentRecord(
    payments : Map.Map<Nat, PaymentTypes.PaymentRecord>,
    counter : { var value : Nat },
    userId : Common.UserId,
    tierId : Nat,
    amountUSD : Float,
    nowNs : Int,
  ) : PaymentTypes.PaymentRecord {
    let orderId = "PAYPAL-PENDING-" # debug_show(counter.value);
    createPaymentRecord(payments, counter, userId, tierId, amountUSD, #paypal, null, ?orderId, nowNs);
  };

  // --- Crypto stub ---
  // Creates a pending PaymentRecord with paymentMethod=#crypto.
  // Full on-chain webhook integration activates by wiring confirmCryptoPayment.
  public func initiateCryptoPaymentRecord(
    payments : Map.Map<Nat, PaymentTypes.PaymentRecord>,
    counter : { var value : Nat },
    userId : Common.UserId,
    tierId : Nat,
    amountUSD : Float,
    nowNs : Int,
  ) : PaymentTypes.PaymentRecord {
    let placeholder = "CRYPTO-PENDING-" # debug_show(counter.value);
    createPaymentRecord(payments, counter, userId, tierId, amountUSD, #crypto, null, ?placeholder, nowNs);
  };

  // --- Email alert stub ---
  // No-op until the platform email extension is enabled.
  // TODO: Wire to email extension when platform email is enabled.
  // Call this for users whose subscription expires within 7 days.
  public func sendSubscriptionExpiryAlert(
    _userId : Common.UserId,
  ) : { #ok; #err : Text } {
    // TODO: Wire to email extension when platform email is enabled.
    #ok;
  };
};

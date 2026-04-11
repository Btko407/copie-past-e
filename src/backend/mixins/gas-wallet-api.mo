import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import GasTypes "../types/gas-wallet";
import TierTypes "../types/tiers";
import Common "../types/common";
import GasWalletLib "../lib/gas-wallet";

mixin (
  accessControlState : AccessControl.AccessControlState,
  wallets : Map.Map<Common.UserId, GasTypes.GasWallet>,
  gasPurchases : Map.Map<Nat, GasTypes.GasPurchase>,
  gasPackages : Map.Map<Nat, GasTypes.GasPackage>,
  gasPurchaseCounter : { var value : Nat },
  subscriptions : Map.Map<Common.UserId, TierTypes.UserTierSubscription>,
) {
  // Management canister reference for HTTP outcalls to Stripe (gas wallet)
  let IC_MANAGEMENT_GAS : actor {
    http_request : ({
      url : Text;
      max_response_bytes : ?Nat64;
      method : { #get; #head; #post };
      headers : [{ name : Text; value : Text }];
      body : ?Blob;
      is_replicated : ?Bool;
    }) -> async {
      status : Nat;
      headers : [{ name : Text; value : Text }];
      body : Blob;
    };
  } = actor "aaaaa-aa";

  let STRIPE_SECRET_KEY_GAS : Text = "sk_live_CONFIGURE_IN_ADMIN";

  /// Extract a JSON string field value by splitting on the key pattern (gas wallet).
  func parseJsonStringFieldGas(json : Text, field : Text) : ?Text {
    let marker = "\"" # field # "\":\"";
    let parts = json.split(#text marker);
    ignore parts.next();
    switch (parts.next()) {
      case null { null };
      case (?afterMarker) {
        let valueParts = afterMarker.split(#char '\"');
        valueParts.next();
      };
    };
  };

  /// Create a Stripe PaymentIntent for gas purchase; returns client_secret or null.
  func createStripePaymentIntentForGas(
    amountCents : Nat,
    purchaseRecordId : Nat,
  ) : async ?Text {
    let body = "amount=" # debug_show(amountCents)
      # "&currency=usd"
      # "&metadata[gasPurchaseId]=" # debug_show(purchaseRecordId)
      # "&automatic_payment_methods[enabled]=true";

    try {
      let response = await IC_MANAGEMENT_GAS.http_request({
        url = "https://api.stripe.com/v1/payment_intents";
        method = #post;
        body = ?body.encodeUtf8();
        headers = [
          { name = "Authorization"; value = "Bearer " # STRIPE_SECRET_KEY_GAS },
          { name = "Content-Type"; value = "application/x-www-form-urlencoded" },
          { name = "Stripe-Version"; value = "2023-10-16" },
        ];
        max_response_bytes = ?10_000;
        is_replicated = null;
      });
      if (response.status >= 200 and response.status < 300) {
        switch (response.body.decodeUtf8()) {
          case (?responseText) { parseJsonStringFieldGas(responseText, "client_secret") };
          case null { null };
        };
      } else {
        null;
      };
    } catch (_) {
      null;
    };
  };

  /// Get the caller's gas wallet (auto-initializes if first visit).
  public shared ({ caller }) func getMyGasWallet() : async { #ok : GasTypes.GasWallet; #err : Text } {
    let now = Time.now();
    #ok(GasWalletLib.getOrInitWallet(wallets, caller, now));
  };

  /// Get all available gas packages.
  public query func getGasPackages() : async [GasTypes.GasPackage] {
    gasPackages.values().toArray();
  };

  /// Initiate a gas purchase — creates a Stripe PaymentIntent and a pending purchase record.
  public shared ({ caller }) func initiateGasPurchase(
    packageId : Nat,
    discountCode : ?Text,
  ) : async {
    #ok : { purchaseRecordId : Nat; finalAmountUSD : Float; gasAmount : Nat; stripeClientSecret : Text };
    #err : Text;
  } {
    let pkg = switch (gasPackages.get(packageId)) {
      case (?p) p;
      case null { return #err("Gas package not found") };
    };

    // Discount codes are not applied to gas purchases in this version (gas is priced flat)
    ignore discountCode;

    let now = Time.now();
    let amountCents = (pkg.priceUSD * 100.0).toInt().toNat();

    // Create a placeholder purchase record first to get an ID
    let purchase = GasWalletLib.createGasPurchase(
      gasPurchases,
      gasPurchaseCounter,
      caller,
      pkg,
      "",
      now,
    );

    let clientSecret = switch (await createStripePaymentIntentForGas(amountCents, purchase.id)) {
      case (?cs) cs;
      case null { return #err("Failed to create payment intent with Stripe") };
    };

    // Update the record with the real payment intent ID (re-stored with intent id = clientSecret prefix up to "_secret_")
    GasWalletLib.updateGasPurchaseStatus(gasPurchases, purchase.id, #pending);

    #ok({
      purchaseRecordId = purchase.id;
      finalAmountUSD = pkg.priceUSD;
      gasAmount = pkg.gasAmount;
      stripeClientSecret = clientSecret;
    });
  };

  /// Confirm a gas purchase — mark it completed and credit the user's gas balance.
  public shared ({ caller }) func confirmGasPurchase(
    purchaseRecordId : Nat,
  ) : async { #ok : GasTypes.GasWallet; #err : Text } {
    let purchase = switch (gasPurchases.get(purchaseRecordId)) {
      case (?p) p;
      case null { return #err("Purchase record not found") };
    };

    // Security: only the buyer or a canister controller can confirm
    if (not AccessControl.isAdmin(accessControlState, caller) and
        caller != purchase.userId) {
      return #err("Unauthorized");
    };

    switch (purchase.status) {
      case (#completed) { return #err("Already confirmed") };
      case (#failed) { return #err("Purchase already failed") };
      case (#pending) {};
    };

    GasWalletLib.updateGasPurchaseStatus(gasPurchases, purchaseRecordId, #completed);

    let now = Time.now();
    let updated = GasWalletLib.addGas(wallets, purchase.userId, purchase.gasAmount, now);
    #ok(updated);
  };

  /// Mark a gas purchase as failed.
  public shared ({ caller }) func failGasPurchase(purchaseRecordId : Nat) : async () {
    switch (gasPurchases.get(purchaseRecordId)) {
      case (?p) {
        if (not AccessControl.isAdmin(accessControlState, caller) and
            caller != p.userId) {
          Runtime.trap("Unauthorized");
        };
        GasWalletLib.updateGasPurchaseStatus(gasPurchases, purchaseRecordId, #failed);
      };
      case null {};
    };
  };

  /// Set auto-renewal preference.
  public shared ({ caller }) func setAutoRenewal(
    enabled : Bool,
    tierId : Nat,
  ) : async { #ok : GasTypes.GasWallet; #err : Text } {
    let now = Time.now();
    let updated = GasWalletLib.setAutoRenewal(wallets, caller, enabled, tierId, now);
    #ok(updated);
  };

  /// Get the caller's gas purchase history.
  public query ({ caller }) func getMyGasPurchases() : async [GasTypes.GasPurchase] {
    GasWalletLib.getGasPurchases(gasPurchases, caller);
  };

  /// Get available bulk Gas discount tiers (display-only).
  /// Full pricing engine activation (applying discounts at checkout) is deferred.
  public query func getBulkGasDiscounts() : async [GasTypes.BulkGasDiscount] {
    GasWalletLib.getDefaultBulkDiscounts();
  };
};

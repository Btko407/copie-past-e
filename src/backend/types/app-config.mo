import Common "common";

module {
  /// A single admin-configurable key/value setting persisted in canister state.
  /// Sensitive values (Stripe keys, API secrets) should have encrypted = true
  /// as a hint to the admin UI — the canister stores the raw value; encryption
  /// at rest is handled by the IC's node-level confidentiality guarantees.
  public type ConfigEntry = {
    key       : Text;
    value     : Text;
    encrypted : Bool;
    category  : Text;
    updatedAt : Common.Timestamp;
    updatedBy : Text;
  };
};

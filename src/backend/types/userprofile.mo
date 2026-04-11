import Common "common";

module {
  /// Public-facing user profile with username as the display identity.
  /// Principal (UserId) is kept as the internal key only.
  /// displayName is a separate editable label (distinct from username).
  public type UserProfile = {
    userId         : Common.UserId;
    username       : Text;
    displayName    : ?Text;
    email          : Text;
    phoneNumber    : ?Text;
    emailVerified  : Bool;
    role           : Text;
    createdAt      : Common.Timestamp;
    updatedAt      : Common.Timestamp;
    /// Facebook Graph API credentials (stored per-user for FB-owned listings).
    fbAppId        : ?Text;
    fbAccessToken  : ?Text;
    /// Per-user webhook token for the browser extension.
    fbWebhookToken : ?Text;
    /// Stripe customer ID — set when a checkout session is created.
    stripeCustomerId : ?Text;
  };

  /// Args for user-editable profile fields.
  public type UpdateProfileArgs = {
    displayName : ?Text;
    email : ?Text;
    phoneNumber : ?Text;
  };

  public type UpdateProfileResult = {
    #ok : UserProfile;
    #err : Text;
  };

  public type SetUsernameArgs = {
    username : Text;
  };

  public type SetUsernameResult = {
    #ok : UserProfile;
    #err : Text; // #duplicate | #invalid | #unauthorized
  };

  public type GetProfileResult = {
    #ok : UserProfile;
    #err : Text;
  };
};

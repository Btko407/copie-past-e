import Common "common";

module {
  public type VerificationStatus = {
    #pending;
    #verified;
    #expired;
  };

  /// One record per signup attempt.  The token is a short-lived code.
  public type VerificationRecord = {
    userId : Common.UserId;
    email : Text;
    token : Text;
    status : VerificationStatus;
    createdAt : Common.Timestamp;
    expiresAt : Common.Timestamp;
    resendCount : Nat; // max 3 per signup session
    lastResendAt : ?Common.Timestamp;
  };

  public type VerifyEmailArgs = {
    token : Text;
  };

  public type ResendVerificationArgs = {
    email : Text;
  };

  public type VerifyEmailResult = {
    #ok;       // verified — account now active, free tier started
    #err : Text; // #invalidToken | #expired | #alreadyVerified
  };

  public type ResendResult = {
    #ok : { resendCount : Nat; cooldownSecondsRemaining : Nat };
    #err : Text; // #maxResendsReached | #cooldown | #alreadyVerified | #notFound
  };
};

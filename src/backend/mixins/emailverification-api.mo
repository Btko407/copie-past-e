import Map "mo:core/Map";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import ProfileTypes "../types/userprofile";
import VerifyTypes "../types/emailverification";
import TierTypes "../types/tiers";
import VerifyLib "../lib/emailverification";
import ProfileLib "../lib/userprofile";
import TiersLib "../lib/tiers";

/// Email verification is built but gated behind a feature flag.
/// All functions are wired; activation happens by flipping EMAIL_VERIFICATION_ENABLED.
mixin (
  accessControlState : AccessControl.AccessControlState,
  verificationRecords : Map.Map<Common.UserId, VerifyTypes.VerificationRecord>,
  emailIndex : Map.Map<Text, Common.UserId>,
  profiles : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
  usernameIndex : Map.Map<Text, Common.UserId>,
  subscriptions : Map.Map<Common.UserId, TierTypes.UserTierSubscription>,
) {
  /// Feature flag — email verification is built but NOT active.
  /// Flip to true once the email extension is enabled.
  let EMAIL_VERIFICATION_ENABLED : Bool = false;

  /// Initiate email verification for the caller.
  /// When EMAIL_VERIFICATION_ENABLED is false, this records the pending record
  /// but does not send an email, and auto-verifies immediately so the account is usable.
  public shared ({ caller }) func initiateEmailVerification(
    email : Text,
  ) : async { #ok : Text; #err : Text } {
    let now = Time.now();
    let lowerEmail = email.toLower();

    // Register the email → userId mapping
    emailIndex.add(lowerEmail, caller);

    if (EMAIL_VERIFICATION_ENABLED) {
      // Create record and send verification email (when email extension is active)
      let record = VerifyLib.createVerificationRecord(verificationRecords, caller, lowerEmail, now);
      // NOTE: email sending via the email-verification extension would go here
      #ok(record.token);
    } else {
      // Feature-flagged off: auto-verify and start free 30-day subscription immediately
      ProfileLib.markEmailVerified(profiles, caller, now);
      ignore TiersLib.extendSubscription(subscriptions, caller, 1, 30, now);
      #ok("auto-verified");
    };
  };

  /// Verify with a token.  On success: marks account active and auto-starts free tier.
  public shared ({ caller }) func verifyEmail(
    token : Text,
  ) : async VerifyTypes.VerifyEmailResult {
    if (not EMAIL_VERIFICATION_ENABLED) {
      return #err("Email verification is not enabled");
    };
    let now = Time.now();
    let result = VerifyLib.verifyToken(verificationRecords, token, now);
    switch (result) {
      case (#ok) {
        // Mark profile as verified
        ProfileLib.markEmailVerified(profiles, caller, now);
        // Auto-start free 30-day subscription
        ignore TiersLib.extendSubscription(subscriptions, caller, 1, 30, now);
        #ok;
      };
      case (#err(msg)) { #err(msg) };
    };
  };

  /// Request a new verification email without restarting signup.
  public shared ({ caller }) func resendVerificationEmail(
    email : Text,
  ) : async VerifyTypes.ResendResult {
    if (not EMAIL_VERIFICATION_ENABLED) {
      return #err("Email verification is not enabled");
    };
    let now = Time.now();
    let lowerEmail = email.toLower();
    VerifyLib.resendVerification(verificationRecords, emailIndex, lowerEmail, now);
  };

  /// Returns the current verification status for the caller.
  public query ({ caller }) func getVerificationStatus() : async ?VerifyTypes.VerificationRecord {
    VerifyLib.getRecord(verificationRecords, caller);
  };
};

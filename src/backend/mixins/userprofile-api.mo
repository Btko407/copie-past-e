import Map "mo:core/Map";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import Types "../types/userprofile";
import TierTypes "../types/tiers";
import ProfileLib "../lib/userprofile";
import TiersLib "../lib/tiers";

mixin (
  accessControlState : AccessControl.AccessControlState,
  profiles : Map.Map<Common.UserId, Types.UserProfile>,
  usernameIndex : Map.Map<Text, Common.UserId>,
  subscriptions : Map.Map<Common.UserId, TierTypes.UserTierSubscription>,
) {
  // ── CallerGuard — reentrancy + anonymous principal protection ────────────
  let profileInProgress = Set.empty<Principal>();

  func profileGuard(caller : Principal) {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: anonymous principal not allowed");
    };
    if (profileInProgress.contains(caller)) {
      Runtime.trap("Reentrant call detected");
    };
    profileInProgress.add(caller);
  };

  func profileRelease(caller : Principal) {
    profileInProgress.remove(caller);
  };

  /// Called on first login / signup to create the user's profile with a username.
  /// Auto-starts the free 30-day subscription immediately on success.
  ///
  /// NFID PRINCIPAL COMPATIBILITY NOTE:
  /// NFID uses Internet Identity under the hood for authentication. The Principal
  /// returned by NFID — whether via Google Social Login or the native II path — is
  /// structurally identical to a standard Internet Identity Principal. No mapping
  /// transformation is required: the caller Principal from NFID is used directly as
  /// the UserProfile.userId key, and all Map lookups by Principal work as-is.
  public shared ({ caller }) func registerUserProfile(
    username : Text,
    email : Text,
  ) : async Types.SetUsernameResult {
    profileGuard(caller);
    let now = Time.now();
    let result = ProfileLib.registerProfile(profiles, usernameIndex, caller, username, email, now);
    switch (result) {
      case (#ok(_)) {
        // Auto-start free 30-day subscription for every new account
        ignore TiersLib.extendSubscription(subscriptions, caller, 1, 30, now);
      };
      case (#err(_)) {};
    };
    profileRelease(caller);
    result;
  };

  /// Change the caller's username at any time (no cooldown, no audit log).
  public shared ({ caller }) func setMyUsername(
    username : Text,
  ) : async Types.SetUsernameResult {
    profileGuard(caller);
    let now = Time.now();
    let result = ProfileLib.setUsername(profiles, usernameIndex, caller, username, now);
    profileRelease(caller);
    result;
  };

  /// Get the caller's own profile.
  ///
  /// NFID PRINCIPAL COMPATIBILITY NOTE:
  /// NFID principals are structurally identical to Internet Identity principals.
  /// The Principal returned by NFID is used directly as the Map key — no
  /// transformation is needed. This function works transparently for both
  /// Google Social Login (NFID) and classic Internet Identity users.
  public query ({ caller }) func getMyProfile() : async Types.GetProfileResult {
    switch (ProfileLib.getProfileById(profiles, caller)) {
      case null { #err("Profile not found") };
      case (?profile) { #ok(profile) };
    };
  };

  /// Look up any user's public profile by username.
  /// Used by the admin panel to find users without exposing Principal IDs.
  public query func getProfileByUsername(username : Text) : async ?Types.UserProfile {
    ProfileLib.getProfileByUsername(usernameIndex, profiles, username);
  };

  /// Admin: list all user profiles.
  public query ({ caller }) func adminListProfiles() : async [Types.UserProfile] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin role required");
    };
    ProfileLib.listAllProfiles(profiles);
  };

  /// Admin: resolve a username to a Text principal ID for tier upgrade grant.
  /// Returns #err if username not found.
  public shared ({ caller }) func adminGetUserIdByUsername(
    username : Text,
  ) : async { #ok : Text; #err : Text } {
    profileGuard(caller);
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      profileRelease(caller);
      Runtime.trap("Unauthorized: Admin role required");
    };
    let result = switch (ProfileLib.getProfileByUsername(usernameIndex, profiles, username)) {
      case null { #err("User not found: " # username) };
      case (?profile) { #ok(profile.userId.toText()) };
    };
    profileRelease(caller);
    result;
  };

  /// Update the caller's mutable profile fields (displayName, email, phoneNumber).
  public shared ({ caller }) func updateMyProfile(
    args : Types.UpdateProfileArgs,
  ) : async Types.UpdateProfileResult {
    profileGuard(caller);
    let now = Time.now();
    let result = ProfileLib.updateProfile(profiles, caller, args, now);
    profileRelease(caller);
    result;
  };
};

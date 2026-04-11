import Map "mo:core/Map";
import Time "mo:core/Time";
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
  /// Called on first login / signup to create the user's profile with a username.
  /// Auto-starts the free 30-day subscription immediately on success.
  public shared ({ caller }) func registerUserProfile(
    username : Text,
    email : Text,
  ) : async Types.SetUsernameResult {
    let now = Time.now();
    let result = ProfileLib.registerProfile(profiles, usernameIndex, caller, username, email, now);
    switch (result) {
      case (#ok(_)) {
        // Auto-start free 30-day subscription for every new account
        ignore TiersLib.extendSubscription(subscriptions, caller, 1, 30, now);
      };
      case (#err(_)) {};
    };
    result;
  };

  /// Change the caller's username at any time (no cooldown, no audit log).
  public shared ({ caller }) func setMyUsername(
    username : Text,
  ) : async Types.SetUsernameResult {
    let now = Time.now();
    ProfileLib.setUsername(profiles, usernameIndex, caller, username, now);
  };

  /// Get the caller's own profile.
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
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Admin role required");
    };
    switch (ProfileLib.getProfileByUsername(usernameIndex, profiles, username)) {
      case null { #err("User not found: " # username) };
      case (?profile) { #ok(profile.userId.toText()) };
    };
  };

  /// Update the caller's mutable profile fields (displayName, email, phoneNumber).
  public shared ({ caller }) func updateMyProfile(
    args : Types.UpdateProfileArgs,
  ) : async Types.UpdateProfileResult {
    let now = Time.now();
    ProfileLib.updateProfile(profiles, caller, args, now);
  };
};

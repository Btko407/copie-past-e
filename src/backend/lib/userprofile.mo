import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Common "../types/common";
import Types "../types/userprofile";

module {
  /// Register a brand-new profile for a user.
  /// Returns #err if the username is already taken or invalid.
  public func registerProfile(
    profiles : Map.Map<Common.UserId, Types.UserProfile>,
    usernameIndex : Map.Map<Text, Common.UserId>,
    userId : Common.UserId,
    username : Text,
    email : Text,
    nowNs : Common.Timestamp,
  ) : Types.SetUsernameResult {
    if (not validateUsername(username)) {
      return #err("Invalid username: must be 3-30 characters, alphanumeric and underscores only");
    };
    let lowerUsername = username.toLower();
    if (isUsernameTaken(usernameIndex, lowerUsername, null)) {
      return #err("Username is already taken");
    };
    let profile : Types.UserProfile = {
      userId;
      username;
      displayName = null;
      email;
      phoneNumber = null;
      emailVerified = false;
      role = "user";
      createdAt = nowNs;
      updatedAt = nowNs;
      fbAppId = null;
      fbAccessToken = null;
      fbWebhookToken = null;
      stripeCustomerId = null;
    };
    profiles.add(userId, profile);
    usernameIndex.add(lowerUsername, userId);
    #ok(profile);
  };

  /// Update mutable profile fields: displayName, email, and/or phoneNumber.
  /// Returns #err if the profile does not exist.
  public func updateProfile(
    profiles : Map.Map<Common.UserId, Types.UserProfile>,
    userId : Common.UserId,
    args : Types.UpdateProfileArgs,
    nowNs : Common.Timestamp,
  ) : Types.UpdateProfileResult {
    switch (profiles.get(userId)) {
      case null { #err("Profile not found") };
      case (?existing) {
        let newDisplayName = switch (args.displayName) {
          case null { existing.displayName };
          case (?v) { ?v };
        };
        let newEmail = switch (args.email) {
          case null { existing.email };
          case (?v) { v };
        };
        let newPhone = switch (args.phoneNumber) {
          case null { existing.phoneNumber };
          case (?v) { ?v };
        };
        let updated : Types.UserProfile = {
          existing with
          displayName = newDisplayName;
          email = newEmail;
          phoneNumber = newPhone;
          updatedAt = nowNs;
        };
        profiles.add(userId, updated);
        #ok(updated);
      };
    };
  };

  /// Update username for an existing profile.
  /// No cooldown, no audit log.  Returns #err if duplicate or invalid.
  public func setUsername(
    profiles : Map.Map<Common.UserId, Types.UserProfile>,
    usernameIndex : Map.Map<Text, Common.UserId>,
    userId : Common.UserId,
    newUsername : Text,
    nowNs : Common.Timestamp,
  ) : Types.SetUsernameResult {
    if (not validateUsername(newUsername)) {
      return #err("Invalid username: must be 3-30 characters, alphanumeric and underscores only");
    };
    let lowerNew = newUsername.toLower();
    if (isUsernameTaken(usernameIndex, lowerNew, ?userId)) {
      return #err("Username is already taken");
    };
    switch (profiles.get(userId)) {
      case null { #err("Profile not found") };
      case (?existing) {
        // Remove old username from index
        let lowerOld = existing.username.toLower();
        usernameIndex.remove(lowerOld);
        // Store updated profile
        let updated : Types.UserProfile = { existing with username = newUsername; updatedAt = nowNs };
        profiles.add(userId, updated);
        usernameIndex.add(lowerNew, userId);
        #ok(updated);
      };
    };
  };

  /// Look up a profile by Principal.
  public func getProfileById(
    profiles : Map.Map<Common.UserId, Types.UserProfile>,
    userId : Common.UserId,
  ) : ?Types.UserProfile {
    profiles.get(userId);
  };

  /// Look up a profile by username (case-insensitive lookup via index).
  public func getProfileByUsername(
    usernameIndex : Map.Map<Text, Common.UserId>,
    profiles : Map.Map<Common.UserId, Types.UserProfile>,
    username : Text,
  ) : ?Types.UserProfile {
    let lowerUsername = username.toLower();
    switch (usernameIndex.get(lowerUsername)) {
      case null null;
      case (?uid) profiles.get(uid);
    };
  };

  /// Returns true if `username` is already registered by a different user.
  public func isUsernameTaken(
    usernameIndex : Map.Map<Text, Common.UserId>,
    username : Text,
    exceptUserId : ?Common.UserId,
  ) : Bool {
    let lowerUsername = username.toLower();
    switch (usernameIndex.get(lowerUsername)) {
      case null false;
      case (?existingUid) {
        switch (exceptUserId) {
          case null true;
          case (?excludeId) not Principal.equal(existingUid, excludeId);
        };
      };
    };
  };

  /// Validate username format (length 3-30, alphanumeric + underscores).
  public func validateUsername(username : Text) : Bool {
    let size = username.size();
    if (size < 3 or size > 30) return false;
    for (c in username.toIter()) {
      if (not (c.isAlphabetic() or c.isDigit() or c == '_')) {
        return false;
      };
    };
    true;
  };

  /// Mark a profile's email as verified and set role to "user".
  public func markEmailVerified(
    profiles : Map.Map<Common.UserId, Types.UserProfile>,
    userId : Common.UserId,
    nowNs : Common.Timestamp,
  ) : () {
    switch (profiles.get(userId)) {
      case null {};
      case (?existing) {
        let updated : Types.UserProfile = {
          existing with
          emailVerified = true;
          role = "user";
          updatedAt = nowNs;
        };
        profiles.add(userId, updated);
      };
    };
  };

  /// List all profiles — used by admin panel.
  public func listAllProfiles(
    profiles : Map.Map<Common.UserId, Types.UserProfile>,
  ) : [Types.UserProfile] {
    profiles.values().toArray();
  };
};

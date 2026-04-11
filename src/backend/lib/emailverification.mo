import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Common "../types/common";
import Types "../types/emailverification";

module {
  let RESEND_COOLDOWN_NS : Int = 60_000_000_000;       // 1 minute
  let MAX_RESENDS : Nat = 3;
  let TOKEN_TTL_NS : Int = 86_400_000_000_000;          // 24 hours

  /// Create a new verification record and return it.
  /// If one already exists for this user it is overwritten (resend path).
  public func createVerificationRecord(
    records : Map.Map<Common.UserId, Types.VerificationRecord>,
    userId : Common.UserId,
    email : Text,
    nowNs : Common.Timestamp,
  ) : Types.VerificationRecord {
    // Use a deterministic seed derived from userId + nowNs for token generation
    let seedText = userId.toText() # nowNs.toText();
    let seed = seedText.encodeUtf8();
    let token = generateToken(seed);
    let record : Types.VerificationRecord = {
      userId;
      email;
      token;
      status = #pending;
      createdAt = nowNs;
      expiresAt = nowNs + TOKEN_TTL_NS;
      resendCount = 0;
      lastResendAt = null;
    };
    records.add(userId, record);
    record;
  };

  /// Request a token resend.  Enforces cooldown and max-resend limits.
  public func resendVerification(
    records : Map.Map<Common.UserId, Types.VerificationRecord>,
    emailIndex : Map.Map<Text, Common.UserId>,
    email : Text,
    nowNs : Common.Timestamp,
  ) : Types.ResendResult {
    let lowerEmail = email.toLower();
    let userId = switch (emailIndex.get(lowerEmail)) {
      case null { return #err("No account found for this email") };
      case (?uid) uid;
    };
    let existing = switch (records.get(userId)) {
      case null { return #err("No verification record found") };
      case (?r) r;
    };
    if (existing.status == #verified) {
      return #err("Email is already verified");
    };
    if (existing.resendCount >= MAX_RESENDS) {
      return #err("Maximum resend limit reached");
    };
    // Enforce cooldown
    switch (existing.lastResendAt) {
      case (?lastResend) {
        let elapsed : Int = nowNs - lastResend;
        if (elapsed < RESEND_COOLDOWN_NS) {
          let remainingNs : Int = RESEND_COOLDOWN_NS - elapsed;
          let remainingSecs : Nat = (remainingNs / 1_000_000_000).toNat();
          return #ok({ resendCount = existing.resendCount; cooldownSecondsRemaining = remainingSecs });
        };
      };
      case null {};
    };
    // Generate new token
    let seedText = userId.toText() # nowNs.toText() # existing.resendCount.toText();
    let seed = seedText.encodeUtf8();
    let newToken = generateToken(seed);
    let newCount = existing.resendCount + 1;
    let updated : Types.VerificationRecord = {
      existing with
      token = newToken;
      status = #pending;
      expiresAt = nowNs + TOKEN_TTL_NS;
      resendCount = newCount;
      lastResendAt = ?nowNs;
    };
    records.add(userId, updated);
    #ok({ resendCount = newCount; cooldownSecondsRemaining = 0 });
  };

  /// Attempt to verify with a token.  Returns #ok on success.
  public func verifyToken(
    records : Map.Map<Common.UserId, Types.VerificationRecord>,
    token : Text,
    nowNs : Common.Timestamp,
  ) : Types.VerifyEmailResult {
    // Scan all records to find matching token (tokens are unique enough for this)
    var found : ?Types.VerificationRecord = null;
    for ((_, record) in records.entries()) {
      if (record.token == token) {
        found := ?record;
      };
    };
    switch (found) {
      case null { #err("Invalid or unknown token") };
      case (?record) {
        if (record.status == #verified) {
          return #err("Email is already verified");
        };
        if (nowNs > record.expiresAt) {
          // Mark as expired
          let expired : Types.VerificationRecord = { record with status = #expired };
          records.add(record.userId, expired);
          return #err("Token has expired");
        };
        // Mark as verified
        let verified : Types.VerificationRecord = { record with status = #verified };
        records.add(record.userId, verified);
        #ok;
      };
    };
  };

  /// Return the current verification record for a user, if any.
  public func getRecord(
    records : Map.Map<Common.UserId, Types.VerificationRecord>,
    userId : Common.UserId,
  ) : ?Types.VerificationRecord {
    records.get(userId);
  };

  /// Generate a short hex token from a seed blob.
  /// Uses the first 8 bytes to produce a compact but unique token string.
  public func generateToken(seed : Blob) : Text {
    let bytes = seed.toArray();
    var acc : Nat = 0;
    // Fold up to 8 bytes into a Nat for the token
    let limit = if (bytes.size() < 8) bytes.size() else 8;
    var i = 0;
    while (i < limit) {
      acc := acc * 256 + Nat.fromNat8(bytes[i]);
      i += 1;
    };
    toHex(acc);
  };

  /// Convert a Nat to a lowercase hex string (up to 16 digits).
  func toHex(n : Nat) : Text {
    let digits = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
    if (n == 0) return "0000000000000000";
    var result = "";
    var remaining = n;
    var count = 0;
    while (remaining > 0 and count < 16) {
      let digit = remaining % 16;
      result := digits[digit] # result;
      remaining := remaining / 16;
      count += 1;
    };
    // Pad to 16 chars
    while (result.size() < 16) {
      result := "0" # result;
    };
    result;
  };
};

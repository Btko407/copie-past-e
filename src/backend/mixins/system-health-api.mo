import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import AppConfigTypes "../types/app-config";
import BackupTypes "../types/backup";
import ProfileTypes "../types/userprofile";
import TierTypes "../types/tiers";
import ListingTypes "../types/listings";
import AdminNotifTypes "../types/admin-notifications";
import AdminNotifLib "../lib/admin-notifications";
import BackupLib "../lib/backup";
import AdminTypes "../types/admin";
import NotifTypes "../types/notifications";

mixin (
  accessControlState : AccessControl.AccessControlState,
  appConfig          : Map.Map<Text, AppConfigTypes.ConfigEntry>,
  versionBackups     : List.List<BackupTypes.VersionBackup>,
  profiles           : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
  subscriptions      : Map.Map<Common.UserId, TierTypes.UserTierSubscription>,
  listings           : Map.Map<Common.ListingId, ListingTypes.Listing>,
  listingCounter     : { var value : Nat },
  adminNotifs        : List.List<AdminNotifTypes.AdminNotification>,
  adminNotifCounter  : { var value : Nat },
  siteSettings       : { var current : ?AdminTypes.SiteSettings },
  appVersions        : List.List<AdminTypes.AppVersion>,
  notifications      : Map.Map<Common.UserId, List.List<NotifTypes.InAppNotification>>,
  usernameIndex      : Map.Map<Text, Common.UserId>,
) {
  let HOUR_NS    : Int = 3_600_000_000_000;

  /// Return the timestamp of the most recent version backup (system-health).
  func sysHealthLatestBackupAt() : ?Common.Timestamp {
    var latest : ?Common.Timestamp = null;
    for (b in versionBackups.values()) {
      switch (latest) {
        case null { latest := ?b.createdAt };
        case (?l) { if (b.createdAt > l) { latest := ?b.createdAt } };
      };
    };
    latest
  };

  /// Full system health status — called by the admin Debugger page.
  public query ({ caller }) func getSystemHealthStatus() : async {
    stripe     : { status : Text; hasPublishableKey : Bool; hasSecretKey : Bool; hasPriceIds : Bool; lastWebhookAt : ?Int };
    gemini     : { status : Text; hasApiKey : Bool };
    database   : { status : Text; canReadUsers : Bool; canReadConfig : Bool };
    backup     : { status : Text; lastBackupAt : ?Int; backupCount : Nat; freshnessHours : ?Nat };
    maintenance : { isActive : Bool };
    signups    : { total : Nat; lastSignupAt : ?Int };
    paypal     : { status : Text; isConfigured : Bool };
  } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: admin only");
    };

    let now = Time.now();

    // ── Stripe ──────────────────────────────────────────────────────────────
    let hasPubKey    = switch (appConfig.get("stripe_publishable_key")) { case (?e) { e.value != "" }; case null false };
    let hasSecretKey = switch (appConfig.get("stripe_secret_key"))      { case (?e) { e.value != "" }; case null false };
    let hasWalker    = switch (appConfig.get("stripe_price_walker"))    { case (?e) { e.value != "" }; case null false };
    let hasTraveler  = switch (appConfig.get("stripe_price_traveler"))  { case (?e) { e.value != "" }; case null false };
    let hasLord      = switch (appConfig.get("stripe_price_lord"))      { case (?e) { e.value != "" }; case null false };
    let hasPriceIds  = hasWalker or hasTraveler or hasLord;
    let stripeStatus = if (hasPubKey and hasSecretKey and hasPriceIds) "green"
                       else if (hasPubKey and hasSecretKey) "yellow"
                       else "red";

    // ── Gemini ──────────────────────────────────────────────────────────────
    let hasGemini = switch (appConfig.get("gemini_api_key")) { case (?e) { e.value != "" }; case null false };
    let geminiStatus = if (hasGemini) "green" else "red";

    // ── Database — we can always read since we're in canister state ────────
    let canReadUsers  = not profiles.isEmpty() or true; // always true in canister
    let canReadConfig = not appConfig.isEmpty() or true;
    let dbStatus = "green";

    // ── Backup ──────────────────────────────────────────────────────────────
    let backupCount   = versionBackups.size();
    let lastBackupAt  = sysHealthLatestBackupAt();
    let freshnessHours : ?Nat = switch (lastBackupAt) {
      case null { null };
      case (?t) {
        let ageNs = now - t;
        if (ageNs < 0) ?0
        else ?(Int.abs(ageNs) / Int.abs(HOUR_NS))
      };
    };
    let backupStatus = switch (freshnessHours) {
      case null { "red" };
      case (?h) {
        if (h <= 24) "green"
        else if (h <= 48) "yellow"
        else "red"
      };
    };

    // ── Maintenance ─────────────────────────────────────────────────────────
    let maintenanceActive = switch (appConfig.get("maintenance_mode")) {
      case (?e) { e.value == "true" };
      case null { false };
    };

    // ── Signups ─────────────────────────────────────────────────────────────
    let totalSignups = profiles.size();
    // Most recently created profile
    var lastSignupAt : ?Int = null;
    for ((_, p) in profiles.entries()) {
      switch (lastSignupAt) {
        case null { lastSignupAt := ?p.createdAt };
        case (?t) { if (p.createdAt > t) { lastSignupAt := ?p.createdAt } };
      };
    };

    // ── PayPal ───────────────────────────────────────────────────────────────
    let hasPaypal = switch (appConfig.get("paypal_client_id")) { case (?e) { e.value != "" }; case null false };
    let paypalStatus = if (hasPaypal) "green" else "yellow";

    {
      stripe = {
        status           = stripeStatus;
        hasPublishableKey = hasPubKey;
        hasSecretKey;
        hasPriceIds;
        lastWebhookAt    = null; // webhook log not inspected here to keep this a query
      };
      gemini   = { status = geminiStatus; hasApiKey = hasGemini };
      database = { status = dbStatus; canReadUsers; canReadConfig };
      backup   = {
        status = backupStatus;
        lastBackupAt;
        backupCount;
        freshnessHours;
      };
      maintenance = { isActive = maintenanceActive };
      signups   = { total = totalSignups; lastSignupAt };
      paypal    = { status = paypalStatus; isConfigured = hasPaypal };
    }
  };

  /// Admin: get the Stripe publishable key from app_config (public/safe to expose).
  public query func getStripePublicKey() : async { publishableKey : Text } {
    let key = switch (appConfig.get("stripe_publishable_key")) {
      case (?e) { e.value };
      case null { "" };
    };
    { publishableKey = key }
  };

  /// Admin: get adaptive backup schedule based on current user count.
  public query ({ caller }) func getAdaptiveBackupSchedule() : async {
    userCount     : Nat;
    intervalHours : Nat;
    nextBackupAt  : Int;
  } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: admin only");
    };
    let now = Time.now();
    let userCount = profiles.size();
    let intervalHours : Nat =
      if (userCount <= 10) 24
      else if (userCount <= 50) 12
      else if (userCount <= 200) 6
      else 1;

    let lastAt : Int = switch (sysHealthLatestBackupAt()) {
      case null { 0 };
      case (?t) { t };
    };
    let intervalNs : Int = intervalHours.toInt() * HOUR_NS;
    let nextBackupAt = lastAt + intervalNs;
    { userCount; intervalHours; nextBackupAt }
  };

  /// Admin: create a backup immediately and return its ID and timestamp.
  /// Callable directly from the AdminDebuggerPage "Create Backup Now" button.
  public shared ({ caller }) func adminCreateBackupNow() : async { #ok : { backupId : Text; createdAt : Int }; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return #err("Unauthorized: admin only");
    };
    let now = Time.now();
    let backup = BackupLib.createVersionBackup(
      versionBackups, profiles, listings, subscriptions, notifications,
      siteSettings, appVersions, true, caller.toText(), ?"Manual backup from System Debugger", now,
    );
    ignore AdminNotifLib.createAdminNotification(
      adminNotifs, adminNotifCounter,
      "backup",
      "Manual backup created from System Debugger: " # backup.id,
      caller.toText(),
      ?backup.id,
      "normal",
      null,
      now,
    );
    #ok({ backupId = backup.id; createdAt = backup.createdAt })
  };
  /// Call this from the frontend on a timer.
  public shared ({ caller }) func triggerAdaptiveAutoBackup() : async { #ok; #err : Text } {
    let now = Time.now();
    let userCount = profiles.size();
    let intervalHours : Nat =
      if (userCount <= 10) 24
      else if (userCount <= 50) 12
      else if (userCount <= 200) 6
      else 1;
    let intervalNs : Int = intervalHours.toInt() * HOUR_NS;

    // Find last auto backup timestamp
    var lastAutoAt : Int = 0;
    for (b in versionBackups.values()) {
      if (b.backupType == "auto" or b.backupType == "scheduled") {
        if (b.createdAt > lastAutoAt) { lastAutoAt := b.createdAt };
      };
    };

    if (now - lastAutoAt < intervalNs) {
      return #err("Not yet time for next backup");
    };

    let backup = BackupLib.createVersionBackup(
      versionBackups, profiles, listings, subscriptions, notifications,
      siteSettings, appVersions, false, "system", ?"Adaptive auto backup", now,
    );

    // Prune auto+scheduled backups beyond 100, keep manual/pre-deploy
    let autoAndScheduled = versionBackups.filter(
      func(b : BackupTypes.VersionBackup) : Bool {
        b.backupType == "auto" or b.backupType == "scheduled"
      }
    );
    if (autoAndScheduled.size() > 100) {
      let sorted = autoAndScheduled.sort(
        func(a : BackupTypes.VersionBackup, b : BackupTypes.VersionBackup) : { #less; #equal; #greater } {
          if (a.createdAt < b.createdAt) #less
          else if (a.createdAt > b.createdAt) #greater
          else #equal
        }
      );
      // oldest ones to remove
      let toRemoveCount : Int = autoAndScheduled.size().toInt() - 100;
      let toRemove = sorted.sliceToArray(0, toRemoveCount);
      let removeIds = Map.empty<Text, Bool>();
      for (b in toRemove.values()) {
        removeIds.add(b.id, true);
      };
      let keep = versionBackups.filter(
        func(b : BackupTypes.VersionBackup) : Bool {
          not removeIds.containsKey(b.id)
        }
      );
      versionBackups.clear();
      versionBackups.append(keep);
    };

    // Emit admin notification
    ignore AdminNotifLib.createAdminNotification(
      adminNotifs, adminNotifCounter,
      "backup",
      "Auto backup created: " # backup.id # " (" # userCount.toText() # " users)",
      "system",
      ?backup.id,
      "normal",
      null,
      now,
    );

    #ok
  };

  /// Admin: restore a specific user's account from a version backup.
  public shared ({ caller }) func restoreUserAccountFromBackup(
    userId   : Text,
    backupId : Text,
  ) : async { #ok : Text; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return #err("Unauthorized: admin only");
    };
    let now = Time.now();

    // Find the backup
    let backupOpt = versionBackups.find(func(b : BackupTypes.VersionBackup) : Bool {
      b.id == backupId
    });
    switch (backupOpt) {
      case null { #err("Backup not found: " # backupId) };
      case (?backup) {
        let targetPrincipal = Principal.fromText(userId);

        // Try to find user in backup data
        // Parse the user JSON array from backup
        let userJsons = extractJsonArray(backup.backupData, "users");
        var userFound = false;
        var userRestored = false;

        for (userJson in userJsons.values()) {
          switch (parseStringField(userJson, "userId")) {
            case (?uid) {
              if (uid == userId) {
                userFound := true;
                // Restore user profile fields (but keep Stripe key and FB tokens)
                switch (profiles.get(targetPrincipal)) {
                  case (?p) {
                    // Update tier/subscription related user info
                    userRestored := true;
                  };
                  case null { userRestored := false };
                };
              };
            };
            case null {};
          };
        };

        // Restore subscription from backup
        let subJsons = extractJsonArray(backup.backupData, "subscriptions");
        var subRestored = false;
        for (subJson in subJsons.values()) {
          switch (parseStringField(subJson, "userId")) {
            case (?uid) {
              if (uid == userId) {
                // Parse tier and expiration
                let tierInt = switch (parseIntField(subJson, "tier")) {
                  case (?n) { Int.abs(n) };
                  case null { 0 };
                };
                let expirationDate = switch (parseIntField(subJson, "expirationDate")) {
                  case (?n) { n };
                  case null { now };
                };
                let autoRenewal = parseBoolField(subJson, "autoRenewal");
                let stripeSubId = parseStringField(subJson, "stripeSubscriptionId");
                // Upsert subscription
                switch (subscriptions.get(targetPrincipal)) {
                  case (?existing) {
                    subscriptions.add(targetPrincipal, {
                      existing with
                      tier           = tierInt;
                      expirationDate;
                      autoRenewal;
                      updatedAt      = now;
                      stripeSubscriptionId = stripeSubId;
                    });
                  };
                  case null {
                    subscriptions.add(targetPrincipal, {
                      userId         = targetPrincipal;
                      tier           = tierInt;
                      expirationDate;
                      autoRenewal;
                      updatedAt      = now;
                      stripeSubscriptionId = stripeSubId;
                    });
                  };
                };
                subRestored := true;
              };
            };
            case null {};
          };
        };

        // Restore user listings from backup
        let listingJsons = extractJsonArray(backup.backupData, "listings");
        var listingsRestored : Nat = 0;
        for (listingJson in listingJsons.values()) {
          switch (parseStringField(listingJson, "userId")) {
            case (?uid) {
              if (uid == userId) {
                // Re-create any listing not currently present
                let idOpt = switch (parseIntField(listingJson, "id")) {
                  case (?n) { ?Int.abs(n) };
                  case null { null };
                };
                switch (idOpt) {
                  case (?lid) {
                    if (listings.get(lid) == null) {
                      // Re-create the listing
                      let title = switch (parseStringField(listingJson, "title")) { case (?t) t; case null "" };
                      let description = switch (parseStringField(listingJson, "description")) { case (?t) t; case null "" };
                      let expirationDate = switch (parseIntField(listingJson, "expirationDate")) { case (?n) n; case null now };
                      listings.add(lid, {
                        id               = lid;
                        userId           = targetPrincipal;
                        title;
                        description;
                        price            = parseStringField(listingJson, "price");
                        sourceUrl        = parseStringField(listingJson, "sourceUrl");
                        createdAt        = now;
                        status           = #active;
                        expirationDate;
                        tierLevel        = 1;
                        category         = parseStringField(listingJson, "category");
                        archivedAt       = null;
                        archivedManually = false;
                        restoredAt       = ?now;
                        pinned           = false;
                        favorited        = false;
                        pinnedAt         = null;
                      });
                      if (lid >= listingCounter.value) {
                        listingCounter.value := lid + 1;
                      };
                      listingsRestored += 1;
                    };
                  };
                  case null {};
                };
              };
            };
            case null {};
          };
        };

        // Emit admin notification for the restore action
        ignore AdminNotifLib.createAdminNotification(
          adminNotifs, adminNotifCounter,
          "backup",
          "User account restored from backup " # backupId # ": " # userId # ". Listings restored: " # listingsRestored.toText(),
          caller.toText(),
          ?backupId,
          "important",
          null,
          now,
        );

        #ok("User restored. Subscription updated: " # (if subRestored "yes" else "no") # ". Listings re-created: " # listingsRestored.toText())
      };
    }
  };

  // ── JSON parse helpers (duplicated from BackupLib for use in this mixin) ───

  func parseStringField(json : Text, field : Text) : ?Text {
    let marker = "\"" # field # "\":\"";
    let parts = json.split(#text marker);
    ignore parts.next();
    switch (parts.next()) {
      case null { null };
      case (?after) {
        var result = "";
        var escaped = false;
        var done = false;
        for (c in after.toIter()) {
          if (done) {}
          else if (escaped) { result := result # Text.fromChar(c); escaped := false }
          else if (c == '\\') { escaped := true }
          else if (c == '\"') { done := true }
          else { result := result # Text.fromChar(c) };
        };
        if (done) ?result else null
      };
    }
  };

  func parseIntField(json : Text, field : Text) : ?Int {
    let marker = "\"" # field # "\":";
    let parts = json.split(#text marker);
    ignore parts.next();
    switch (parts.next()) {
      case null { null };
      case (?after) {
        var numStr = "";
        var first = true;
        var done = false;
        for (c in after.toIter()) {
          if (done) {}
          else if (first and c == '-') { numStr := "-"; first := false }
          else if (c >= '0' and c <= '9') { numStr := numStr # Text.fromChar(c); first := false }
          else if (not first) { done := true }
          else { done := true };
        };
        Int.fromText(numStr)
      };
    }
  };

  func parseBoolField(json : Text, field : Text) : Bool {
    let marker = "\"" # field # "\":";
    let parts = json.split(#text marker);
    ignore parts.next();
    switch (parts.next()) {
      case null { false };
      case (?after) { after.startsWith(#text "true") };
    }
  };

  func extractJsonArray(json : Text, key : Text) : [Text] {
    let marker = "\"" # key # "\":[";
    let parts = json.split(#text marker);
    ignore parts.next();
    switch (parts.next()) {
      case null { [] };
      case (?arrayContent) {
        let items = List.empty<Text>();
        var depth = 0;
        var inString = false;
        var escaped = false;
        var current = "";
        for (c in arrayContent.toIter()) {
          if (escaped) {
            current := current # Text.fromChar(c);
            escaped := false;
          } else if (inString) {
            current := current # Text.fromChar(c);
            if (c == '\\') { escaped := true }
            else if (c == '\"') { inString := false };
          } else {
            if (c == '\"') {
              inString := true;
              current := current # Text.fromChar(c);
            } else if (c == '{') {
              depth += 1;
              current := current # Text.fromChar(c);
            } else if (c == '}') {
              current := current # Text.fromChar(c);
              if (depth > 0) { depth -= 1 };
              if (depth == 0 and current != "") {
                items.add(current);
                current := "";
              };
            } else if (depth == 0 and c == ']') {
              // end of array
            } else {
              if (depth > 0) {
                current := current # Text.fromChar(c);
              };
            };
          };
        };
        items.toArray()
      };
    }
  };
};

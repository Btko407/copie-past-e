import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import DiagnosticsTypes "../types/system-diagnostics";
import AppConfigTypes "../types/app-config";

mixin (
  accessControlState : AccessControl.AccessControlState,
  appConfig          : Map.Map<Text, AppConfigTypes.ConfigEntry>,
) {

  // ── Private helpers ────────────────────────────────────────────────────

  /// Check if a config key exists and has a non-empty value.
  func checkConfigPresent(key : Text) : { present : Bool; valid : Bool } {
    switch (appConfig.get(key)) {
      case null    { { present = false; valid = false } };
      case (?entry) { { present = true; valid = entry.value.size() > 0 } };
    };
  };

  /// Build ComponentStatus for Stripe integration.
  func buildStripeStatus() : DiagnosticsTypes.ComponentStatus {
    let secretKey = checkConfigPresent("stripe_secret_key");
    let pubKey    = checkConfigPresent("stripe_publishable_key");
    let mode      = checkConfigPresent("stripe_mode");

    let allOk = secretKey.valid and pubKey.valid and mode.valid;
    let anyPresent = secretKey.present or pubKey.present;

    let status : { #healthy; #warning; #error; #offline } =
      if (allOk) { #healthy }
      else if (anyPresent) { #warning }
      else { #error };

    let missing = (if (not secretKey.valid) "secret_key " else "")
      # (if (not pubKey.valid) "publishable_key " else "")
      # (if (not mode.valid) "mode" else "");

    {
      name     = "Stripe Payment";
      category = "payment";
      status;
      lastCheck = Time.now();
      message   = if (allOk) {
        "All Stripe keys configured"
      } else {
        "Missing Stripe config: " # missing
      };
      metrics = {
        uptime       = if (allOk) 1.0 else 0.0;
        responseTime = 0;
        errorCount   = if (allOk) 0 else 1;
        successCount = if (allOk) 1 else 0;
      };
    }
  };

  /// Build ComponentStatus for Gemini OCR integration.
  func buildGeminiStatus() : DiagnosticsTypes.ComponentStatus {
    let key = checkConfigPresent("gemini_api_key");

    {
      name     = "Gemini OCR";
      category = "ocr";
      status   = if (key.valid) { #healthy } else { #warning };
      lastCheck = Time.now();
      message   = if (key.valid) {
        "Gemini API key configured"
      } else {
        "Gemini OCR disabled (optional — configure gemini_api_key to enable)"
      };
      metrics = {
        uptime       = if (key.valid) 1.0 else 0.0;
        responseTime = 0;
        errorCount   = if (key.valid) 0 else 0;
        successCount = if (key.valid) 1 else 0;
      };
    }
  };

  /// Build ComponentStatus for site configuration.
  func buildSiteStatus() : DiagnosticsTypes.ComponentStatus {
    let maintenanceMode = switch (appConfig.get("maintenance_mode")) {
      case (?entry) { entry.value == "true" };
      case null     { false };
    };

    {
      name     = "Site Configuration";
      category = "config";
      status   = if (maintenanceMode) { #warning } else { #healthy };
      lastCheck = Time.now();
      message   = if (maintenanceMode) {
        "MAINTENANCE MODE ACTIVE — users cannot access the site"
      } else {
        "Site running normally"
      };
      metrics = {
        uptime       = if (maintenanceMode) 0.5 else 1.0;
        responseTime = 0;
        errorCount   = if (maintenanceMode) 1 else 0;
        successCount = if (maintenanceMode) 0 else 1;
      };
    }
  };

  // ── Public API ─────────────────────────────────────────────────────────

  /// Get complete system diagnostics. Admin-only.
  /// Returns component health, detected issues, recommendations, and critical failures.
  public shared ({ caller }) func getSystemDiagnostics() : async DiagnosticsTypes.SystemDiagnostics {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return {
        timestamp        = Time.now();
        overallStatus    = #critical;
        components       = [];
        issues           = [];
        recommendations  = [];
        criticalFailures = ["Unauthorized: admin only"];
      };
    };

    let components   = List.empty<DiagnosticsTypes.ComponentStatus>();
    let issues       = List.empty<DiagnosticsTypes.SystemIssue>();
    let recs         = List.empty<Text>();
    let criticals    = List.empty<Text>();
    let now          = Time.now();

    // ── Stripe ──
    let stripeStatus = buildStripeStatus();
    components.add(stripeStatus);
    if (stripeStatus.status == #error or stripeStatus.status == #warning) {
      criticals.add("Stripe not fully configured — payments may fail");
      issues.add({
        id                = "stripe_001";
        severity          = #critical;
        title             = "Stripe Payment Not Configured";
        description       = "Stripe secret key, publishable key, or mode is missing or empty";
        affectedComponent = "Stripe Payment";
        suggestedFix      = "Go to Admin > Payments > Configure Stripe Keys";
        discoveredAt      = now;
        resolved          = false;
      });
      recs.add("Configure Stripe keys immediately (Admin > Payments)");
    };

    // ── Gemini ──
    let geminiStatus = buildGeminiStatus();
    components.add(geminiStatus);
    if (geminiStatus.status == #warning) {
      recs.add("Optional: Enable Gemini OCR for auto-extraction (Admin > Settings > Gemini API Key)");
    };

    // ── Site config ──
    let siteStatus = buildSiteStatus();
    components.add(siteStatus);
    if (siteStatus.status == #warning) {
      issues.add({
        id                = "site_001";
        severity          = #warning;
        title             = "Maintenance Mode Active";
        description       = "Site is in maintenance mode — regular users cannot access the app";
        affectedComponent = "Site Configuration";
        suggestedFix      = "Disable maintenance mode (Admin > Settings > Maintenance Mode OFF)";
        discoveredAt      = now;
        resolved          = false;
      });
    };

    let overallStatus : { #healthy; #warning; #critical } =
      if (criticals.size() > 0) { #critical }
      else if (issues.size() > 0) { #warning }
      else { #healthy };

    {
      timestamp        = now;
      overallStatus;
      components       = components.toArray();
      issues           = issues.toArray();
      recommendations  = recs.toArray();
      criticalFailures = criticals.toArray();
    }
  };

  /// Get integration status for all external APIs. Admin-only.
  public shared ({ caller }) func getIntegrationStatus() : async [DiagnosticsTypes.IntegrationStatus] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return [];
    };

    let statuses = List.empty<DiagnosticsTypes.IntegrationStatus>();

    // Stripe
    let stripeSecret = checkConfigPresent("stripe_secret_key");
    let stripePub    = checkConfigPresent("stripe_publishable_key");
    let stripeOk     = stripeSecret.valid and stripePub.valid;
    statuses.add({
      name          = "Stripe";
      connected     = stripeOk;
      lastTestAt    = null;
      lastTestResult = null;
      configPresent = stripeOk;
      errorMessage  = if (not stripeOk) { ?"Missing API keys" } else { null };
    });

    // Gemini OCR
    let geminiKey = checkConfigPresent("gemini_api_key");
    statuses.add({
      name          = "Gemini OCR";
      connected     = geminiKey.valid;
      lastTestAt    = null;
      lastTestResult = null;
      configPresent = geminiKey.valid;
      errorMessage  = if (not geminiKey.valid) { ?"Not configured (optional)" } else { null };
    });

    // Facebook Graph API — platform-side, always reported connected
    statuses.add({
      name          = "Facebook Graph API";
      connected     = true;
      lastTestAt    = null;
      lastTestResult = null;
      configPresent = true;
      errorMessage  = null;
    });

    // Mecari Platform — platform-side, always reported connected
    statuses.add({
      name          = "Mecari Platform";
      connected     = true;
      lastTestAt    = null;
      lastTestResult = null;
      configPresent = true;
      errorMessage  = null;
    });

    statuses.toArray()
  };

  /// Export a system report as simple JSON-compatible text fields. Admin-only.
  public shared ({ caller }) func exportSystemReport() : async {
    timestamp          : Common.Timestamp;
    overallStatus      : Text;
    componentsJson     : Text;
    issuesJson         : Text;
    recommendationsJson : Text;
  } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return {
        timestamp           = Time.now();
        overallStatus       = "error";
        componentsJson      = "[]";
        issuesJson          = "[]";
        recommendationsJson = "[\"Unauthorized: admin only\"]";
      };
    };

    let diag = await getSystemDiagnostics();

    // Build components JSON array
    let compParts = List.empty<Text>();
    for (c in diag.components.vals()) {
      let statusText = switch (c.status) {
        case (#healthy) { "healthy" };
        case (#warning) { "warning" };
        case (#error)   { "error" };
        case (#offline) { "offline" };
      };
      compParts.add(
        "{\"name\":\"" # c.name
        # "\",\"category\":\"" # c.category
        # "\",\"status\":\"" # statusText
        # "\",\"message\":\"" # c.message
        # "\",\"uptime\":" # c.metrics.uptime.toText()
        # "}"
      );
    };

    // Build issues JSON array
    let issParts = List.empty<Text>();
    for (i in diag.issues.vals()) {
      let sevText = switch (i.severity) {
        case (#info)     { "info" };
        case (#warning)  { "warning" };
        case (#error)    { "error" };
        case (#critical) { "critical" };
      };
      issParts.add(
        "{\"id\":\"" # i.id
        # "\",\"severity\":\"" # sevText
        # "\",\"title\":\"" # i.title
        # "\",\"suggestedFix\":\"" # i.suggestedFix
        # "\"}"
      );
    };

    // Build recommendations JSON array
    let recParts = List.empty<Text>();
    for (r in diag.recommendations.vals()) {
      recParts.add("\"" # r # "\"");
    };

    func joinParts(parts : List.List<Text>) : Text {
      let arr = parts.toArray();
      var result = "[";
      var i = 0;
      for (p in arr.vals()) {
        if (i > 0) { result := result # "," };
        result := result # p;
        i += 1;
      };
      result # "]"
    };

    let overallText = switch (diag.overallStatus) {
      case (#healthy)  { "healthy" };
      case (#warning)  { "warning" };
      case (#critical) { "critical" };
    };

    {
      timestamp           = diag.timestamp;
      overallStatus       = overallText;
      componentsJson      = joinParts(compParts);
      issuesJson          = joinParts(issParts);
      recommendationsJson = joinParts(recParts);
    }
  };
};

import Map "mo:core/Map";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import AppConfigTypes "../types/app-config";

mixin (
  accessControlState : AccessControl.AccessControlState,
  appConfig          : Map.Map<Text, AppConfigTypes.ConfigEntry>,
) {
  /// Get maintenance mode state from app_config.
  public query func getMaintenanceMode() : async {
    isActive : Bool;
    message  : Text;
    eta      : Text;
  } {
    let isActive = switch (appConfig.get("maintenance_mode")) {
      case (?e) { e.value == "true" };
      case null { false };
    };
    let message = switch (appConfig.get("maintenance_message")) {
      case (?e) { e.value };
      case null { "Copie Past-e is temporarily down for maintenance. We will be back shortly. Thank you for your patience." };
    };
    let eta = switch (appConfig.get("maintenance_eta")) {
      case (?e) { e.value };
      case null { "" };
    };
    { isActive; message; eta }
  };

  /// Admin: set maintenance mode.
  public shared ({ caller }) func setMaintenanceMode(
    isActive : Bool,
    message  : Text,
    eta      : Text,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: admin only");
    };
    let now = Time.now();
    let by = caller.toText();
    appConfig.add("maintenance_mode", {
      key       = "maintenance_mode";
      value     = if (isActive) "true" else "false";
      encrypted = false;
      category  = "site";
      updatedAt = now;
      updatedBy = by;
    });
    appConfig.add("maintenance_message", {
      key       = "maintenance_message";
      value     = message;
      encrypted = false;
      category  = "site";
      updatedAt = now;
      updatedBy = by;
    });
    appConfig.add("maintenance_eta", {
      key       = "maintenance_eta";
      value     = eta;
      encrypted = false;
      category  = "site";
      updatedAt = now;
      updatedBy = by;
    });
  };
};

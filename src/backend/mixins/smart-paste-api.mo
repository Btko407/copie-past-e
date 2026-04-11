import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/smart-paste";
import SmartPasteLib "../lib/smart-paste";

/// Smart Paste API — parses raw pasted listing text from Facebook Marketplace,
/// OfferUp, or any generic marketplace into structured listing fields.
mixin (
  accessControlState : AccessControl.AccessControlState,
) {
  /// Parse raw pasted listing text and return structured pre-fill data.
  /// The caller must be authenticated. All fields in the result are optional;
  /// null means the parser could not find a value — the frontend shows a blank
  /// input so the user can fill it in manually.
  public shared ({ caller }) func parsePastedText(text : Text) : async Types.ParsedListingResult {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to parse listing text");
    };
    SmartPasteLib.parsePastedText(text);
  };
};

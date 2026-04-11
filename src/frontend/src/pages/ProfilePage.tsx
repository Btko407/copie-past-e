import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useGetMyGasWallet } from "@/hooks/useGasWallet";
import { useNotifications } from "@/hooks/useNotifications";
import { useProfile } from "@/hooks/useProfile";
import { useCreateStripePortalSession } from "@/hooks/useStripePayments";
import { useGetMySubscription, useGetTiers } from "@/hooks/useTiers";
import { Link, Navigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  EyeOff,
  Facebook,
  Mail,
  Phone,
  User,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { DeLoreanTierDisplay } from "../components/DeLoreanTierDisplay";
import { NotificationCenter } from "../components/NotificationCenter";
import { BackupsSection } from "../components/RefuelBanner";
import { useExportManualBackup } from "../hooks/useBackup";
import {
  useGetFbListings,
  useGetMyFbCredentials,
  useSaveFbCredentials,
} from "../hooks/useFbGraph";
import type { FbListing, UpdateProfileArgs } from "../types";

// ─── Avatar ────────────────────────────────────────────────────────────────────

function AvatarDisplay({
  avatarUrl,
  displayName,
  username,
  onAvatarChange,
}: {
  avatarUrl: string | null;
  displayName: string | null;
  username: string | null;
  onAvatarChange: (url: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initials = (displayName || username || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    // Create object URL for preview (in production, upload via object-storage)
    const url = URL.createObjectURL(file);
    onAvatarChange(url);
    toast.success("Profile picture updated");
  };

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="relative w-24 h-24 rounded-full overflow-hidden neon-border-blue glow-blue-sm transition-smooth hover:glow-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Change profile picture"
        data-ocid="avatar-upload-btn"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/10 font-display text-2xl font-black text-primary text-glow-blue">
            {initials}
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 group-hover:opacity-100 transition-smooth">
          <Camera className="w-6 h-6 text-primary" />
        </div>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        onChange={handleFileChange}
      />
    </div>
  );
}

// ─── Tier badge ────────────────────────────────────────────────────────────────

function TierBadge({ tierName }: { tierName: string }) {
  const name = tierName.toUpperCase();
  const isLord = name.includes("LORD");
  const isTraveler = name.includes("TRAVELER");
  const cls = isLord
    ? "neon-border-yellow text-accent text-glow-yellow bg-accent/10"
    : isTraveler
      ? "neon-border-blue text-primary text-glow-blue bg-primary/10"
      : "border border-border text-muted-foreground bg-secondary/20";
  return (
    <span
      className={`font-display text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded ${cls}`}
    >
      {tierName}
    </span>
  );
}

// ─── Facebook Marketplace Integration ─────────────────────────────────────────

function FacebookIntegrationSection() {
  const { data: savedCreds, isLoading: credsLoading } = useGetMyFbCredentials();
  const saveCreds = useSaveFbCredentials();
  const [appId, setAppId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [showListings, setShowListings] = useState(false);

  const isConnected = !!(savedCreds?.appId && savedCreds?.accessToken);

  // Populate fields when saved creds load
  useEffect(() => {
    if (savedCreds) {
      setAppId(savedCreds.appId ?? "");
      setAccessToken(savedCreds.accessToken ?? "");
    }
  }, [savedCreds]);

  const handleSave = async () => {
    if (!appId.trim() || !accessToken.trim()) {
      toast.error("Both App ID and Access Token are required");
      return;
    }
    try {
      await saveCreds.mutateAsync({
        appId: appId.trim(),
        accessToken: accessToken.trim(),
      });
      toast.success("Facebook credentials saved");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save credentials",
      );
    }
  };

  return (
    <motion.section
      className="rounded-xl bg-card/60 overflow-hidden"
      style={{
        border: "1px solid rgba(24,119,242,0.4)",
        boxShadow: "0 0 12px rgba(24,119,242,0.15)",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      data-ocid="profile-fb-section"
    >
      {/* Section header */}
      <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Facebook className="w-4 h-4 text-[#1877F2]" />
          <h2
            className="font-display text-sm font-bold tracking-wide uppercase"
            style={{ color: "#1877F2" }}
          >
            Facebook Marketplace Integration
          </h2>
        </div>
        {/* Connection status badge */}
        {credsLoading ? (
          <Skeleton className="h-5 w-24 bg-primary/10 rounded-full" />
        ) : isConnected ? (
          <Badge
            className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full"
            data-ocid="fb-status-connected"
          >
            <CheckCircle2 className="w-3 h-3" />
            Connected
          </Badge>
        ) : (
          <Badge
            className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded-full"
            data-ocid="fb-status-not-configured"
          >
            <XCircle className="w-3 h-3" />
            Not Configured
          </Badge>
        )}
      </div>

      <div className="p-6 space-y-5">
        {/* Subtitle */}
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          Connect your Facebook account to import your own listings via the
          official API. Only your own listings will be accessible.
        </p>

        {/* Helper text */}
        <div className="rounded-lg bg-primary/5 border border-primary/20 px-4 py-3 flex gap-2.5 items-start">
          <Facebook className="w-3.5 h-3.5 text-[#1877F2] mt-0.5 shrink-0" />
          <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">
            You can get your App ID and Access Token from the{" "}
            <a
              href="https://developers.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1877F2] underline underline-offset-2 hover:opacity-80 transition-smooth"
            >
              Facebook Developer Console
            </a>
            . Only your own listings will be accessible via the Graph API.
          </p>
        </div>

        {/* App ID */}
        <div className="space-y-1.5">
          <Label
            htmlFor="fb-app-id"
            className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider"
          >
            Facebook App ID
          </Label>
          <Input
            id="fb-app-id"
            value={appId}
            onChange={(e) => setAppId(e.target.value)}
            placeholder="Enter your Facebook App ID"
            className="bg-input/30 border-input font-mono text-sm focus:glow-blue-sm transition-smooth"
            style={{ borderColor: "rgba(24,119,242,0.35)" }}
            data-ocid="fb-app-id-input"
          />
        </div>

        {/* Access Token */}
        <div className="space-y-1.5">
          <Label
            htmlFor="fb-access-token"
            className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider"
          >
            Access Token
          </Label>
          <div className="relative">
            <Input
              id="fb-access-token"
              type={showToken ? "text" : "password"}
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="Paste your access token"
              className="bg-input/30 border-input font-mono text-sm pr-10 focus:glow-blue-sm transition-smooth"
              style={{ borderColor: "rgba(24,119,242,0.35)" }}
              data-ocid="fb-access-token-input"
            />
            <button
              type="button"
              onClick={() => setShowToken((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
              aria-label={showToken ? "Hide token" : "Reveal token"}
              data-ocid="fb-toggle-token-visibility"
            >
              {showToken ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Save button */}
        <Button
          onClick={handleSave}
          disabled={saveCreds.isPending}
          className="w-full sm:w-auto font-display text-xs tracking-widest uppercase transition-smooth"
          style={{ background: "#1877F2", color: "#fff" }}
          data-ocid="fb-save-credentials-btn"
        >
          {saveCreds.isPending ? "Saving..." : "Save Facebook Credentials"}
        </Button>

        {/* Import listings — only shown when connected */}
        {isConnected && (
          <div className="pt-2 space-y-3 border-t border-border/40">
            <Button
              variant="outline"
              onClick={() => setShowListings((v) => !v)}
              className="w-full flex items-center justify-between gap-2 font-display text-xs tracking-widest uppercase transition-smooth"
              style={{ borderColor: "rgba(24,119,242,0.5)", color: "#1877F2" }}
              data-ocid="fb-import-listings-btn"
            >
              <span className="flex items-center gap-2">
                <Download className="w-3.5 h-3.5" />
                Import My Facebook Listings
              </span>
              {showListings ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </Button>

            <AnimatePresence>
              {showListings && <FbListingsPanel />}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.section>
  );
}

// ─── FB Listings Panel ────────────────────────────────────────────────────────

function FbListingsPanel() {
  const { data: listings = [], isLoading, isError } = useGetFbListings();

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden"
    >
      <div className="rounded-lg border border-border/60 bg-background/40 overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full bg-primary/5 rounded" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-6 text-center">
            <XCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
            <p className="font-mono text-xs text-muted-foreground">
              Could not fetch listings. Check your credentials and try again.
            </p>
          </div>
        ) : listings.length === 0 ? (
          <div className="p-6 text-center">
            <Facebook className="w-8 h-8 text-[#1877F2]/50 mx-auto mb-2" />
            <p className="font-mono text-xs text-muted-foreground">
              No listings found. Make sure your access token has the correct
              permissions.
            </p>
          </div>
        ) : (
          <ul
            className="divide-y divide-border/40"
            data-ocid="fb-listings-list"
          >
            {listings.map((listing: FbListing) => (
              <li
                key={listing.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-smooth"
                data-ocid={`fb-listing-item-${listing.id}`}
              >
                {/* Thumbnail */}
                {listing.imageUrls[0] ? (
                  <img
                    src={listing.imageUrls[0]}
                    alt={listing.title}
                    className="w-10 h-10 rounded object-cover shrink-0 border border-border/40"
                  />
                ) : (
                  <div className="w-10 h-10 rounded bg-muted/30 flex items-center justify-center shrink-0">
                    <Facebook className="w-4 h-4 text-[#1877F2]/50" />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm text-foreground truncate">
                    {listing.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {listing.price && (
                      <span className="font-mono text-[11px] text-accent">
                        {listing.price}
                      </span>
                    )}
                    {listing.category && (
                      <span className="font-mono text-[10px] text-muted-foreground/60 truncate">
                        {listing.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* Import CTA */}
                <Link
                  to="/import"
                  className="shrink-0"
                  data-ocid={`fb-listing-import-${listing.id}`}
                >
                  <Button
                    size="sm"
                    variant="outline"
                    className="font-display text-[10px] tracking-widest uppercase transition-smooth"
                    style={{
                      borderColor: "rgba(24,119,242,0.4)",
                      color: "#1877F2",
                    }}
                  >
                    Import
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}

// ─── Account Info Card ─────────────────────────────────────────────────────────

function AccountInfoCard({
  email,
  phone,
  tierName,
  daysRemaining,
  memberSince,
}: {
  email: string | null;
  phone: string | null;
  tierName: string;
  daysRemaining: number | null;
  memberSince: bigint | null;
}) {
  const memberSinceStr = memberSince
    ? (() => {
        const ms =
          memberSince > BigInt(1e15)
            ? Number(memberSince / BigInt(1_000_000))
            : Number(memberSince);
        return new Date(ms).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      })()
    : null;

  const subscriptionLabel =
    daysRemaining !== null && daysRemaining > 0
      ? `${tierName} — ${daysRemaining} day${daysRemaining !== 1 ? "s" : ""} remaining`
      : daysRemaining === 0
        ? `${tierName} — EXPIRED`
        : tierName;

  return (
    <motion.section
      className="rounded-xl bg-card/60 neon-border-blue overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      data-ocid="profile-account-info-section"
    >
      <div className="px-5 py-3 border-b border-border/60">
        <h2 className="font-display text-sm font-bold text-primary text-glow-blue tracking-wide uppercase">
          Account Info
        </h2>
      </div>
      <div className="px-5 py-4 space-y-3">
        {/* Subscription tier — most prominent */}
        <div className="rounded-lg bg-primary/5 border border-primary/20 px-4 py-3">
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">
            Membership
          </p>
          <p
            className={`font-display text-sm font-bold tracking-wide ${
              daysRemaining === 0
                ? "text-destructive"
                : daysRemaining !== null && daysRemaining <= 7
                  ? "text-accent text-glow-yellow"
                  : "text-primary text-glow-blue"
            }`}
            data-ocid="account-subscription-label"
          >
            {subscriptionLabel}
          </p>
        </div>

        {/* Info rows */}
        <div className="space-y-2.5">
          {email && (
            <div className="flex items-center gap-2.5 min-w-0">
              <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <p className="font-mono text-xs text-foreground truncate">
                {email}
              </p>
            </div>
          )}
          {phone && (
            <div className="flex items-center gap-2.5 min-w-0">
              <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <p className="font-mono text-xs text-foreground">{phone}</p>
            </div>
          )}
          {memberSinceStr && (
            <div className="flex items-center gap-2.5 min-w-0">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <p className="font-mono text-xs text-muted-foreground">
                Member since {memberSinceStr}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}

// ─── Role badge ────────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: string }) {
  const isAdmin = role.toLowerCase() === "admin";
  return (
    <span
      className={`font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded ${
        isAdmin
          ? "neon-border-yellow text-accent text-glow-yellow bg-accent/10"
          : "border border-border text-muted-foreground"
      }`}
    >
      {isAdmin ? "⚡ Admin" : role}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ProfilePage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const {
    profile,
    isLoading: profileLoading,
    username,
    displayName: savedDisplayName,
    phoneNumber: savedPhoneNumber,
    avatarUrl: savedAvatarUrl,
    updateMyProfile,
    isUpdatingProfile,
    setUsername,
    isSaving,
  } = useProfile();

  const { data: subscription } = useGetMySubscription();
  const { data: tiers = [] } = useGetTiers();
  const { data: gasWallet } = useGetMyGasWallet();
  const portalSession = useCreateStripePortalSession();
  const {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
    isLoading: notifLoading,
  } = useNotifications();
  const exportManualBackup = useExportManualBackup();

  // Form state
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);

  // Sync form when profile loads
  useEffect(() => {
    if (profile) {
      setEmail(profile.email ?? "");
      setNewUsername(profile.username ?? "");
    }
    if (savedDisplayName) setDisplayName(savedDisplayName);
    if (savedPhoneNumber) setPhoneNumber(savedPhoneNumber);
    if (savedAvatarUrl) setLocalAvatarUrl(savedAvatarUrl);
  }, [profile, savedDisplayName, savedPhoneNumber, savedAvatarUrl]);

  // Derive tier info
  const currentTierId = subscription ? Number(subscription.tier) : 0;
  const tierConfig = tiers.find((t) => Number(t.tierId) === currentTierId);
  const tierName =
    tierConfig?.name ??
    (currentTierId === 0 ? "Free" : `Tier ${currentTierId}`);
  const expiryRaw = subscription?.expirationDate;
  const expiryBigint = expiryRaw ? BigInt(Math.round(Number(expiryRaw))) : null;
  // gasBalance kept for wallet display elsewhere; not used for tank fill level
  const _gasBalance = gasWallet ? Number(gasWallet.gasBalance) : 0;

  // Days remaining — for AccountInfoCard and profile header label
  const daysRemaining = expiryRaw
    ? (() => {
        const expiryMs =
          Number(expiryRaw) > 1e15
            ? Number(expiryRaw) / 1_000_000
            : Number(expiryRaw);
        return Math.max(0, Math.floor((expiryMs - Date.now()) / 86_400_000));
      })()
    : null;

  if (isInitializing || profileLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Skeleton className="h-24 w-24 rounded-full bg-primary/10" />
        <Skeleton className="h-6 w-40 bg-primary/10 rounded" />
        <Skeleton className="h-4 w-24 bg-muted/20 rounded" />
      </div>
    );
  }

  if (!isInitializing && !isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleSaveProfile = async () => {
    const args: UpdateProfileArgs = {};
    if (displayName !== (savedDisplayName ?? ""))
      args.displayName = displayName;
    if (phoneNumber !== (savedPhoneNumber ?? ""))
      args.phoneNumber = phoneNumber;

    try {
      // Save display name + phone via local storage layer
      if (Object.keys(args).length > 0) {
        await updateMyProfile(args);
      }
      // Save username via backend if changed
      if (newUsername && newUsername !== profile?.username) {
        await setUsername(newUsername);
      }
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update profile",
      );
    }
  };

  const handleAvatarChange = (url: string) => {
    setLocalAvatarUrl(url);
    updateMyProfile({ displayName, phoneNumber }).catch(() => null);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Back navigation */}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary transition-smooth"
        data-ocid="profile-back-link"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Dashboard
      </Link>

      {/* ── A. PROFILE HEADER ─────────────────────────────────────────────── */}
      <motion.section
        className="rounded-xl bg-card/60 neon-border-blue overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        data-ocid="profile-header-section"
      >
        <div className="retro-grid p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar */}
          <AvatarDisplay
            avatarUrl={localAvatarUrl}
            displayName={savedDisplayName}
            username={username}
            onAvatarChange={handleAvatarChange}
          />

          {/* Identity info */}
          <div className="flex flex-col items-center sm:items-start gap-1.5 min-w-0">
            {savedDisplayName ? (
              <h1 className="font-display text-2xl font-black text-foreground text-glow-blue truncate max-w-full">
                {savedDisplayName}
              </h1>
            ) : (
              <h1 className="font-display text-2xl font-black text-primary text-glow-blue truncate max-w-full">
                {profile?.username ?? "Your Profile"}
              </h1>
            )}

            {username && (
              <p className="font-mono text-sm text-muted-foreground">
                @{username}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 mt-1">
              {profile?.role && <RoleBadge role={profile.role} />}
              <TierBadge tierName={tierName} />
            </div>

            {/* Subscription summary — visible on all screen sizes (mobile & desktop) */}
            {daysRemaining !== null && (
              <p
                className={`font-mono text-xs mt-1 ${
                  daysRemaining === 0
                    ? "text-destructive"
                    : daysRemaining <= 7
                      ? "text-accent"
                      : "text-primary"
                }`}
                data-ocid="profile-tier-days-label"
              >
                {daysRemaining === 0
                  ? "⚠ Expired — Refuel Now"
                  : `⚡ ${tierName} — ${daysRemaining} day${daysRemaining !== 1 ? "s" : ""} remaining`}
              </p>
            )}

            {profile?.email && (
              <p className="font-mono text-xs text-muted-foreground/70 mt-1">
                {profile.email}
              </p>
            )}
          </div>
        </div>
      </motion.section>

      {/* ── A2. ACCOUNT INFO ──────────────────────────────────────────────── */}
      {/* Shows email, phone, tier, days remaining, member since — on all screen sizes */}
      <AccountInfoCard
        email={profile?.email ?? null}
        phone={savedPhoneNumber ?? null}
        tierName={tierName}
        daysRemaining={daysRemaining}
        memberSince={profile?.createdAt ?? null}
      />

      {/* ── B. SUBSCRIPTION CARD ──────────────────────────────────────────── */}
      <motion.section
        className="rounded-xl bg-card/60 neon-border-blue overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        data-ocid="profile-subscription-section"
      >
        <div className="px-6 py-4 border-b border-border/60">
          <h2 className="font-display text-sm font-bold text-primary text-glow-blue tracking-wide uppercase">
            Subscription & Gas
          </h2>
        </div>
        <div className="p-6 flex justify-center">
          <DeLoreanTierDisplay
            tierName={tierName}
            subscriptionExpiry={expiryBigint}
          />
        </div>
        <div className="px-6 pb-5 flex flex-col sm:flex-row gap-3">
          <Link to="/wallet" className="flex-1">
            <Button
              variant="outline"
              className="w-full font-display text-xs tracking-widest uppercase neon-border-yellow text-accent hover:glow-yellow-sm transition-smooth"
              data-ocid="profile-refuel-btn"
            >
              ⛽ Refuel Gas
            </Button>
          </Link>
          <Link to="/upgrade" className="flex-1">
            <Button
              variant="default"
              className="w-full font-display text-xs tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 glow-blue-sm transition-smooth"
              data-ocid="profile-upgrade-btn"
            >
              ⚡ Upgrade Tier
            </Button>
          </Link>
        </div>
        <div className="px-6 pb-5">
          <Button
            variant="outline"
            onClick={async () => {
              try {
                await portalSession.mutateAsync();
              } catch (err) {
                toast.error(
                  err instanceof Error
                    ? err.message
                    : "Failed to open billing portal",
                );
              }
            }}
            disabled={portalSession.isPending}
            className="w-full font-display text-xs tracking-widest uppercase neon-border-blue text-primary hover:glow-blue-sm transition-smooth gap-2"
            data-ocid="profile-manage-billing-btn"
          >
            🧾{" "}
            {portalSession.isPending
              ? "Opening..."
              : "Manage Billing & Invoices"}
          </Button>
        </div>
      </motion.section>

      {/* ── C. EDIT PROFILE FORM ──────────────────────────────────────────── */}
      <motion.section
        className="rounded-xl bg-card/60 neon-border-blue overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        data-ocid="profile-edit-section"
      >
        <div className="px-6 py-4 border-b border-border/60">
          <h2 className="font-display text-sm font-bold text-primary text-glow-blue tracking-wide uppercase">
            Edit Profile
          </h2>
        </div>
        <div className="p-6 space-y-5">
          {/* Display Name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="displayName"
              className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider"
            >
              <User className="w-3.5 h-3.5" />
              Display Name
            </Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="How you want to appear"
              className="bg-input/30 border-input neon-border-blue font-body text-sm focus:glow-blue-sm transition-smooth"
              data-ocid="profile-display-name-input"
            />
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <Label
              htmlFor="username"
              className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider"
            >
              @Username
            </Label>
            <Input
              id="username"
              value={newUsername}
              onChange={(e) =>
                setNewUsername(
                  e.target.value.toLowerCase().replace(/\s+/g, "_"),
                )
              }
              placeholder="unique_username"
              className="bg-input/30 border-input neon-border-blue font-mono text-sm focus:glow-blue-sm transition-smooth"
              data-ocid="profile-username-input"
            />
            <p className="font-mono text-[10px] text-muted-foreground/60">
              Unique. Used for account upgrades and referrals.
            </p>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider"
            >
              <Mail className="w-3.5 h-3.5" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-input/30 border-input neon-border-blue font-body text-sm focus:glow-blue-sm transition-smooth"
              data-ocid="profile-email-input"
            />
            {profile?.emailVerified && (
              <p className="font-mono text-[10px] text-primary text-glow-blue">
                ✓ Email verified
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <Label
              htmlFor="phoneNumber"
              className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider"
            >
              <Phone className="w-3.5 h-3.5" />
              Phone Number
              <span className="font-mono text-[10px] text-muted-foreground/50 normal-case tracking-normal">
                (for SMS alerts)
              </span>
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="bg-input/30 border-input neon-border-blue font-body text-sm focus:glow-blue-sm transition-smooth"
              data-ocid="profile-phone-input"
            />
            <p className="font-mono text-[10px] text-muted-foreground/60">
              SMS notifications coming soon. Add your number now to be ready.
            </p>
          </div>

          {/* Save button */}
          <div className="pt-2">
            <Button
              onClick={handleSaveProfile}
              disabled={isUpdatingProfile || isSaving}
              className="w-full sm:w-auto font-display text-xs tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 glow-blue-sm transition-smooth disabled:opacity-50"
              data-ocid="profile-save-btn"
            >
              {isUpdatingProfile || isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </motion.section>

      {/* ── D. FACEBOOK MARKETPLACE INTEGRATION ──────────────────────────── */}
      <FacebookIntegrationSection />

      {/* ── E. NOTIFICATION CENTER ────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        id="notifications"
        data-ocid="profile-notifications-section"
      >
        <NotificationCenter
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkRead={markRead}
          onMarkAllRead={markAllRead}
          isLoading={notifLoading}
        />
      </motion.section>

      {/* ── F. BACKUPS ────────────────────────────────────────────────────── */}
      <motion.section
        className="rounded-xl bg-card/60 neon-border-blue overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        data-ocid="profile-backups-section"
      >
        <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between gap-3">
          <h2 className="font-display text-sm font-bold text-primary text-glow-blue tracking-wide uppercase">
            💾 Backups
          </h2>
          <Button
            variant="outline"
            size="sm"
            disabled={exportManualBackup.isPending}
            onClick={() =>
              exportManualBackup
                .mutateAsync()
                .then(() => toast.success("Export downloaded!"))
                .catch(() => toast.error("Export failed."))
            }
            className="font-display text-[10px] tracking-widest uppercase border-border/60 hover:border-primary/50 hover:text-primary transition-smooth h-7 px-2.5"
            data-ocid="manual-export-btn"
          >
            <Download className="w-3 h-3 mr-1" />
            {exportManualBackup.isPending
              ? "Exporting..."
              : "Export Listings (Free)"}
          </Button>
        </div>
        <div className="p-6">
          <BackupsSection />
        </div>
      </motion.section>

      {/* ── G. RESTORE FROM BACKUP ── moved to Account Settings ────────── */}
    </div>
  );
}

import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { createActor } from "../backend";
import type {
  ResendResult,
  VerificationRecord,
  VerifyEmailResult,
} from "../backend.d";
import { useAuth } from "./useAuth";

// ─── Feature Flag ─────────────────────────────────────────────────────────────
// When false, backend auto-verifies and no verification screen is shown.
export const EMAIL_ENABLED = false;

// ─── Types ────────────────────────────────────────────────────────────────────

export type VerificationState =
  | "idle"
  | "sending"
  | "sent"
  | "verifying"
  | "verified"
  | "error";

export interface EmailVerificationState {
  /** Email currently being verified */
  email: string;
  /** Current verification state */
  status: VerificationState;
  /** Error message if status === 'error' */
  errorMessage: string | null;
  /** How many resends have been used (0-3) */
  resendCount: number;
  /** Seconds remaining on resend cooldown (0 = can resend) */
  cooldownRemaining: number;
  /** Call to start verification for the given email */
  initiateVerification: (email: string) => Promise<void>;
  /** Call to verify with the token the user typed */
  submitToken: (token: string) => Promise<boolean>;
  /** Resend the verification email */
  resend: () => Promise<void>;
  /** Whether a network call is in-flight */
  isLoading: boolean;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useEmailVerification(): EmailVerificationState {
  const { actor, isFetching } = useActor(createActor);
  const { isAuthenticated, principalId, authReady } = useAuth();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<VerificationState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendCount, setResendCount] = useState(0);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Poll existing verification status on mount ─────────────────────────────
  const { data: verificationRecord } = useQuery<VerificationRecord | null>({
    queryKey: ["verificationStatus", principalId],
    queryFn: async (): Promise<VerificationRecord | null> => {
      if (!actor) return null;
      return actor.getVerificationStatus();
    },
    enabled:
      !!actor && !isFetching && isAuthenticated && authReady && !!principalId,
    staleTime: 30_000,
  });

  // Sync resend count from existing record
  useEffect(() => {
    if (verificationRecord) {
      setResendCount(Number(verificationRecord.resendCount));
      setEmail(verificationRecord.email);
      if (verificationRecord.status === "pending") {
        setStatus("sent");
      } else if (verificationRecord.status === "verified") {
        setStatus("verified");
      }
    }
  }, [verificationRecord]);

  // ── Cooldown timer ─────────────────────────────────────────────────────────
  const startCooldown = useCallback((seconds: number) => {
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    setCooldownRemaining(seconds);
    if (seconds <= 0) return;
    cooldownRef.current = setInterval(() => {
      setCooldownRemaining((prev) => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  // ── Initiate mutation ──────────────────────────────────────────────────────
  const { mutateAsync: initiateMutation, isPending: isInitiating } =
    useMutation<
      { __kind__: "ok"; ok: string } | { __kind__: "err"; err: string },
      Error,
      string
    >({
      mutationFn: async (targetEmail: string) => {
        if (!actor) throw new Error("Not connected");
        return actor.initiateEmailVerification(targetEmail);
      },
    });

  const initiateVerification = async (targetEmail: string): Promise<void> => {
    setEmail(targetEmail);
    setStatus("sending");
    setErrorMessage(null);
    try {
      const result = await initiateMutation(targetEmail);
      if (result.__kind__ === "err") {
        setStatus("error");
        setErrorMessage(result.err);
        return;
      }
      setStatus("sent");
      startCooldown(60);
      queryClient.invalidateQueries({
        queryKey: ["verificationStatus", principalId],
      });
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Failed to send verification email",
      );
    }
  };

  // ── Verify token mutation ──────────────────────────────────────────────────
  const { mutateAsync: verifyMutation, isPending: isVerifying } = useMutation<
    VerifyEmailResult,
    Error,
    string
  >({
    mutationFn: async (token: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.verifyEmail(token);
    },
  });

  const submitToken = async (token: string): Promise<boolean> => {
    setStatus("verifying");
    setErrorMessage(null);
    try {
      const result = await verifyMutation(token);
      if (result.__kind__ === "err") {
        setStatus("error");
        setErrorMessage(result.err);
        return false;
      }
      setStatus("verified");
      queryClient.invalidateQueries({
        queryKey: ["verificationStatus", principalId],
      });
      queryClient.invalidateQueries({ queryKey: ["myProfile", principalId] });
      return true;
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Verification failed",
      );
      return false;
    }
  };

  // ── Resend mutation ────────────────────────────────────────────────────────
  const { mutateAsync: resendMutation, isPending: isResending } = useMutation<
    ResendResult,
    Error,
    string
  >({
    mutationFn: async (targetEmail: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.resendVerificationEmail(targetEmail);
    },
  });

  const resend = async (): Promise<void> => {
    if (cooldownRemaining > 0 || resendCount >= 3) return;
    setErrorMessage(null);
    try {
      const result = await resendMutation(email);
      if (result.__kind__ === "err") {
        setErrorMessage(result.err);
        return;
      }
      setResendCount(Number(result.ok.resendCount));
      startCooldown(Number(result.ok.cooldownSecondsRemaining) || 60);
      setStatus("sent");
      queryClient.invalidateQueries({
        queryKey: ["verificationStatus", principalId],
      });
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to resend");
    }
  };

  const isLoading = isInitiating || isVerifying || isResending;

  return {
    email,
    status,
    errorMessage,
    resendCount,
    cooldownRemaining,
    initiateVerification,
    submitToken,
    resend,
    isLoading,
  };
}

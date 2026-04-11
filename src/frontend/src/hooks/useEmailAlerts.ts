/**
 * useEmailAlerts — stub hooks for email notification features.
 *
 * Email is currently disabled on the platform. These hooks are no-ops today
 * and are ready to be wired to real backend methods once email is re-enabled.
 */

/**
 * Fires an alert when a user's subscription is about to expire.
 * No-op until the email extension is enabled and the backend method is available.
 */
export function useSubscriptionExpiryAlert(): {
  sendAlert: (userId: string, daysRemaining: number) => Promise<void>;
} {
  const sendAlert = async (
    _userId: string,
    _daysRemaining: number,
  ): Promise<void> => {
    // TODO: wire to actor.sendSubscriptionExpiryAlert({ userId, daysRemaining })
    // when the email extension is enabled on this project.
  };

  return { sendAlert };
}

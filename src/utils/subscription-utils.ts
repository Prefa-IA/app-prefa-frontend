export const hasValidSubscription = (subscription: unknown): boolean => {
  return (
    !!subscription &&
    typeof subscription === 'object' &&
    'planId' in subscription &&
    'status' in subscription &&
    !!(subscription as { planId?: unknown }).planId &&
    !!(subscription as { status?: unknown }).status
  );
};

export const getSubscriptionData = (subscription: unknown) => {
  const subscriptionObj =
    subscription && typeof subscription === 'object'
      ? (subscription as Record<string, unknown>)
      : null;

  const renewsAt =
    subscriptionObj?.['currentPeriodEnd'] && typeof subscriptionObj['currentPeriodEnd'] === 'string'
      ? new Date(subscriptionObj['currentPeriodEnd']).toLocaleDateString()
      : '—';

  const planName = (subscriptionObj?.['planId'] as string | undefined) || '—';
  const status = (subscriptionObj?.['status'] as string | undefined) || '—';
  const subscriptionId = (subscriptionObj?.['_id'] as string | undefined) || '';

  return { renewsAt, planName, status, subscriptionId };
};

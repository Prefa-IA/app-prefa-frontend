const isValidBillingSubscription = (sub: Record<string, unknown>): boolean => {
  return 'planId' in sub && 'status' in sub && !!sub['planId'] && !!sub['status'];
};

const isValidUserSubscription = (sub: Record<string, unknown>): boolean => {
  if (!('suscripcion' in sub)) {
    return false;
  }

  const suscripcion = sub['suscripcion'] as Record<string, unknown> | undefined;
  if (!suscripcion || typeof suscripcion !== 'object') {
    return false;
  }

  const hasPlan = !!(suscripcion['plan'] || suscripcion['nombrePlan']);
  const fechaFin = suscripcion['fechaFin'];
  if (!hasPlan || !fechaFin) {
    return false;
  }

  const fechaFinDate = typeof fechaFin === 'string' ? new Date(fechaFin) : fechaFin;
  return fechaFinDate instanceof Date && fechaFinDate > new Date();
};

export const hasValidSubscription = (subscription: unknown): boolean => {
  if (!subscription || typeof subscription !== 'object') {
    return false;
  }

  const sub = subscription as Record<string, unknown>;
  return isValidBillingSubscription(sub) || isValidUserSubscription(sub);
};

const formatDate = (date: unknown): string => {
  if (!date) return '—';
  if (typeof date === 'string') {
    return new Date(date).toLocaleDateString();
  }
  if (date instanceof Date) {
    return date.toLocaleDateString();
  }
  return '—';
};

const getBillingSubscriptionData = (subscriptionObj: Record<string, unknown>) => {
  const renewsAt = formatDate(subscriptionObj['currentPeriodEnd']);
  const planName = (subscriptionObj['planId'] as string | undefined) || '—';
  const status = (subscriptionObj['status'] as string | undefined) || '—';
  const subscriptionId = (subscriptionObj['_id'] as string | undefined) || '';

  return { renewsAt, planName, status, subscriptionId };
};

const getUserSubscriptionStatus = (fechaFin: unknown): string => {
  if (!fechaFin) return '—';
  const fechaFinDate = typeof fechaFin === 'string' ? new Date(fechaFin) : fechaFin;
  if (fechaFinDate instanceof Date) {
    return fechaFinDate > new Date() ? 'active' : 'expired';
  }
  return '—';
};

const getUserSubscriptionData = (subscriptionObj: Record<string, unknown>) => {
  const suscripcion = subscriptionObj['suscripcion'] as Record<string, unknown> | undefined;
  if (!suscripcion || typeof suscripcion !== 'object') {
    return { renewsAt: '—', planName: '—', status: '—', subscriptionId: '' };
  }

  const fechaFin = suscripcion['fechaFin'];
  const renewsAt = formatDate(fechaFin);
  const planName = (suscripcion['nombrePlan'] as string | undefined) || '—';
  const status = getUserSubscriptionStatus(fechaFin);
  const subscriptionId = (suscripcion['plan'] as string | undefined) || '';

  return { renewsAt, planName, status, subscriptionId };
};

export const getSubscriptionData = (subscription: unknown) => {
  const subscriptionObj =
    subscription && typeof subscription === 'object'
      ? (subscription as Record<string, unknown>)
      : null;

  if (!subscriptionObj) {
    return { renewsAt: '—', planName: '—', status: '—', subscriptionId: '' };
  }

  // Caso 1: Respuesta de Subscription del billing-ms
  if ('planId' in subscriptionObj && 'status' in subscriptionObj) {
    return getBillingSubscriptionData(subscriptionObj);
  }

  // Caso 2: Respuesta del auth-ms con objeto usuario
  if ('suscripcion' in subscriptionObj) {
    return getUserSubscriptionData(subscriptionObj);
  }

  return { renewsAt: '—', planName: '—', status: '—', subscriptionId: '' };
};

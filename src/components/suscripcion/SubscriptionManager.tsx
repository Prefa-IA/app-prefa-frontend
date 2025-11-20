import React from 'react';

import { useSubscription } from '../../hooks/use-subscription';
import { useSubscriptionHandler } from '../../hooks/use-subscription-handler';
import { subscriptionService } from '../../services/subscription-service';
import { getSubscriptionData, hasValidSubscription } from '../../utils/subscription-utils';

import SubscriptionActions from './SubscriptionActions';
import SubscriptionEmptyState from './SubscriptionEmptyState';
import SubscriptionInfo from './SubscriptionInfo';

const SubscriptionManager: React.FC = () => {
  const { subscription, loading, refresh } = useSubscription();
  const { handle } = useSubscriptionHandler({ refresh });

  if (loading) return <p className="text-center py-10">Cargando...</p>;

  if (!hasValidSubscription(subscription)) {
    return <SubscriptionEmptyState />;
  }

  const { renewsAt, planName, status, subscriptionId } = getSubscriptionData(subscription);

  const handlePause = () => {
    void handle(() => subscriptionService.pause(subscriptionId), 'Suscripción pausada');
  };

  const handleCancel = () => {
    void handle(() => subscriptionService.cancel(subscriptionId), 'Suscripción cancelada');
  };

  return (
    <div className="max-w-xl mx-auto py-10 space-y-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
        Mi suscripción
      </h2>
      <SubscriptionInfo planName={planName} status={status} renewsAt={renewsAt} />
      <SubscriptionActions
        subscriptionId={subscriptionId}
        onPause={handlePause}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default SubscriptionManager;

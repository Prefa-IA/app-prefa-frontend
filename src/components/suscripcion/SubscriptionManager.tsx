import React from 'react';
import { toast } from 'react-toastify';

import { usePlanes } from '../../hooks/use-planes';
import { useSubscription } from '../../hooks/use-subscription';
import { useSubscriptionHandler } from '../../hooks/use-subscription-handler';
import { subscriptionService } from '../../services/subscription-service';
import { getSubscriptionData, hasValidSubscription } from '../../utils/subscription-utils';

import SubscriptionActions from './SubscriptionActions';
import SubscriptionEmptyState from './SubscriptionEmptyState';
import SubscriptionInfo from './SubscriptionInfo';

const SubscriptionManager: React.FC = () => {
  const { subscription, loading, refresh } = useSubscription();
  const { planes, loading: planesLoading } = usePlanes();
  const { handle } = useSubscriptionHandler({ refresh });

  if (loading || planesLoading) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando información de suscripción...</p>
        </div>
      </div>
    );
  }

  if (!hasValidSubscription(subscription)) {
    return <SubscriptionEmptyState />;
  }

  const { renewsAt, planName, status, subscriptionId } = getSubscriptionData(subscription);

  const currentPlan =
    planes.find(
      (p) =>
        p.name.toLowerCase() === planName.toLowerCase() ||
        p.id.toLowerCase() === planName.toLowerCase()
    ) || null;

  const handlePause = () => {
    if (!subscriptionId) {
      toast.error('No se pudo identificar la suscripción');
      return;
    }
    void handle(() => subscriptionService.pause(subscriptionId), 'Suscripción pausada');
  };

  const handleCancel = () => {
    if (!subscriptionId) {
      toast.error('No se pudo identificar la suscripción');
      return;
    }
    void handle(() => subscriptionService.cancel(subscriptionId), 'Suscripción cancelada');
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Mi suscripción
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gestiona tu plan y configuración de suscripción
        </p>
      </div>

      <div className="space-y-6">
        <SubscriptionInfo
          planName={planName}
          status={status}
          renewsAt={renewsAt}
          planTag={currentPlan?.tag}
        />
        <SubscriptionActions
          subscriptionId={subscriptionId}
          onPause={handlePause}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default SubscriptionManager;

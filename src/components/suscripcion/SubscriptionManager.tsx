import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useSubscription } from '../../hooks/use-subscription';
import { subscriptionService } from '../../services/subscription-service';

const SubscriptionManager: React.FC = () => {
  const { subscription, loading, refresh } = useSubscription();
  const navigate = useNavigate();

  if (loading) return <p className="text-center py-10">Cargando...</p>;

  const hasValidSubscription =
    subscription &&
    typeof subscription === 'object' &&
    'planId' in subscription &&
    'status' in subscription &&
    subscription.planId &&
    subscription.status;

  if (!hasValidSubscription) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Mi suscripción</h2>
        <p className="text-xl sm:text-2xl font-semibold dark:text-white mb-6">
          No tienes una suscripción activa.
        </p>
        <button
          className="btn-primary px-8 py-3 text-lg"
          onClick={() => navigate('/suscripciones')}
        >
          Ver planes
        </button>
      </div>
    );
  }

  const handle = async (action: () => Promise<unknown>, success: string) => {
    try {
      await action();
      toast.success(success);
      void refresh();
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Error';
      toast.error(errorMessage);
    }
  };

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

  return (
    <div className="max-w-xl mx-auto py-10 space-y-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
        Mi suscripción
      </h2>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded shadow-sm space-y-2 text-gray-800 dark:text-gray-200">
        <p className="flex justify-between">
          <span className="font-semibold text-gray-600 dark:text-gray-300">Plan:</span>{' '}
          <span className="text-gray-900 dark:text-gray-100">{planName}</span>
        </p>
        <p className="flex justify-between">
          <span className="font-semibold text-gray-600 dark:text-gray-300">Estado:</span>{' '}
          <span className="capitalize text-gray-900 dark:text-gray-100">{status}</span>
        </p>
        <p className="flex justify-between">
          <span className="font-semibold text-gray-600 dark:text-gray-300">Renueva el:</span>{' '}
          <span className="text-gray-900 dark:text-gray-100">{renewsAt}</span>
        </p>
      </div>
      <div className="flex gap-4 justify-center">
        <button
          className="btn-secondary dark:text-white"
          onClick={() => {
            void handle(
              () => subscriptionService.pause((subscriptionObj?.['_id'] as string) || ''),
              'Suscripción pausada'
            );
          }}
        >
          Pausar
        </button>
        <button
          className="btn-danger dark:text-white"
          onClick={() => {
            void handle(
              () => subscriptionService.cancel((subscriptionObj?.['_id'] as string) || ''),
              'Suscripción cancelada'
            );
          }}
        >
          Cancelar
        </button>
        <button className="btn-primary" onClick={() => navigate('/suscripciones')}>
          Cambiar plan
        </button>
      </div>
    </div>
  );
};

export default SubscriptionManager;

import React, { useState } from 'react';
import { useSubscription } from '../../hooks/useSubscription';
import { subscriptionService } from '../../services/subscriptionService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SubscriptionManager: React.FC = () => {
  const { subscription, loading, refresh } = useSubscription();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  if (loading) return <p className="text-center py-10">Cargando...</p>;

  const hasValidSubscription = subscription && subscription.planId && subscription.status;

  if (!hasValidSubscription) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Mi suscripción</h2>
        <p className="text-xl sm:text-2xl font-semibold dark:text-white mb-6">No tienes una suscripción activa.</p>
        <button className="btn-primary px-8 py-3 text-lg" onClick={() => navigate('/suscripciones')}>Ver planes</button>
      </div>
    );
  }

  const handle = async (action: () => Promise<any>, success: string) => {
    try {
      await action();
      toast.success(success);
      refresh();
    } catch (e: any) {
      toast.error(e.message || 'Error');
    }
  };

  const renewsAt = subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : '—';
  const planName = subscription?.planId || '—';
  const status = subscription?.status || '—';

  return (
    <div className="max-w-xl mx-auto py-10 space-y-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">Mi suscripción</h2>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded shadow-sm space-y-2 text-gray-800 dark:text-gray-200">
        <p className="flex justify-between"><span className="font-semibold text-gray-600 dark:text-gray-300">Plan:</span> <span className="text-gray-900 dark:text-gray-100">{planName}</span></p>
        <p className="flex justify-between"><span className="font-semibold text-gray-600 dark:text-gray-300">Estado:</span> <span className="capitalize text-gray-900 dark:text-gray-100">{status}</span></p>
        <p className="flex justify-between"><span className="font-semibold text-gray-600 dark:text-gray-300">Renueva el:</span> <span className="text-gray-900 dark:text-gray-100">{renewsAt}</span></p>
      </div>
      <div className="flex gap-4 justify-center">
        <button className="btn-secondary dark:text-white" onClick={() => handle(() => subscriptionService.pause(subscription._id), 'Suscripción pausada')}>Pausar</button>
        <button className="btn-danger dark:text-white" onClick={() => handle(() => subscriptionService.cancel(subscription._id), 'Suscripción cancelada')}>Cancelar</button>
        <button className="btn-primary" onClick={() => navigate('/suscripciones')}>Cambiar plan</button>
      </div>
    </div>
  );
};

export default SubscriptionManager;

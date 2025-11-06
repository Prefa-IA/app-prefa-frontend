import React, { useState } from 'react';
import { useSubscription } from '../../hooks/useSubscription';
import { subscriptionService } from '../../services/subscriptionService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ChangePlanModal from './ChangePlanModal';

const SubscriptionManager: React.FC = () => {
  const { subscription, loading, refresh } = useSubscription();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  if (loading) return <p className="text-center py-10">Cargando...</p>;

  if (!subscription) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
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

  return (
    <div className="max-w-xl mx-auto py-10 space-y-6">
      <h2 className="text-2xl font-bold text-center mb-6">Mi suscripción</h2>
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow space-y-2 text-gray-800 dark:text-gray-200">
        <p><strong>Plan:</strong> {subscription.planId}</p>
        <p><strong>Estado:</strong> {subscription.status}</p>
        <p><strong>Renueva el:</strong> {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</p>
      </div>
      <div className="flex gap-4 justify-center">
        <button className="btn-secondary" onClick={() => handle(() => subscriptionService.pause(subscription._id), 'Suscripción pausada')}>Pausar</button>
        <button className="btn-danger" onClick={() => handle(() => subscriptionService.cancel(subscription._id), 'Suscripción cancelada')}>Cancelar</button>
        <button className="btn-primary" onClick={() => setShowModal(true)}>Cambiar plan</button>
      </div>
      {showModal && (
        <ChangePlanModal
          onClose={() => setShowModal(false)}
          currentPlanId={subscription.planId}
          onChanged={refresh}
        />
      )}
    </div>
  );
};

export default SubscriptionManager;

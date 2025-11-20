import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubscriptionEmptyState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Mi suscripción</h2>
      <p className="text-xl sm:text-2xl font-semibold dark:text-white mb-6">
        No tienes una suscripción activa.
      </p>
      <button className="btn-primary px-8 py-3 text-lg" onClick={() => navigate('/suscripciones')}>
        Ver planes
      </button>
    </div>
  );
};

export default SubscriptionEmptyState;

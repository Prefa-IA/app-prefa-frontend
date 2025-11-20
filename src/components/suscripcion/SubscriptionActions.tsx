import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SubscriptionActionsProps {
  subscriptionId: string;
  onPause: () => void;
  onCancel: () => void;
}

const SubscriptionActions: React.FC<SubscriptionActionsProps> = ({
  subscriptionId: _subscriptionId,
  onPause,
  onCancel,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-4 justify-center">
      <button className="btn-secondary dark:text-white" onClick={onPause}>
        Pausar
      </button>
      <button className="btn-danger dark:text-white" onClick={onCancel}>
        Cancelar
      </button>
      <button className="btn-primary" onClick={() => navigate('/suscripciones')}>
        Cambiar plan
      </button>
    </div>
  );
};

export default SubscriptionActions;

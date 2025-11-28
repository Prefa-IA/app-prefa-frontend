import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SubscriptionActionsProps {
  subscriptionId: string;
  onPause: () => void;
  onCancel: () => void;
}

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmText: string;
  confirmColor: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  message,
  confirmText,
  confirmColor,
  onConfirm,
  onCancel,
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full overflow-hidden">
      <div className={`px-6 py-4 ${confirmColor} text-white`}>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <div className="p-6">
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            onClick={onCancel}
          >
            No, mantener
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${confirmColor} text-white hover:opacity-90 transition-colors`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  </div>
);

const ActionButtons: React.FC<{
  onPauseClick: () => void;
  onCancelClick: () => void;
  onChangePlanClick: () => void;
}> = ({ onPauseClick, onCancelClick, onChangePlanClick }) => (
  <div className="flex flex-col sm:flex-row gap-3 justify-center">
    <button
      className="btn-primary flex items-center justify-center gap-2 px-6 py-3 text-base font-medium shadow-md hover:shadow-lg transition-all"
      onClick={onChangePlanClick}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      Cambiar plan
    </button>
    <button
      className="flex items-center justify-center gap-2 px-6 py-3 text-base font-medium border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all rounded-lg"
      onClick={onPauseClick}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      Pausar
    </button>
    <button
      className="flex items-center justify-center gap-2 px-6 py-3 text-base font-medium border-2 border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all rounded-lg"
      onClick={onCancelClick}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
      Cancelar
    </button>
  </div>
);

const SubscriptionActions: React.FC<SubscriptionActionsProps> = ({
  subscriptionId: _subscriptionId,
  onPause,
  onCancel,
}) => {
  const navigate = useNavigate();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showPauseConfirm, setShowPauseConfirm] = useState(false);

  const handleCancelClick = () => setShowCancelConfirm(true);
  const handleCancelConfirm = () => {
    setShowCancelConfirm(false);
    onCancel();
  };

  const handlePauseClick = () => setShowPauseConfirm(true);
  const handlePauseConfirm = () => {
    setShowPauseConfirm(false);
    onPause();
  };

  return (
    <>
      <ActionButtons
        onPauseClick={handlePauseClick}
        onCancelClick={handleCancelClick}
        onChangePlanClick={() => navigate('/suscripciones?tab=planes')}
      />

      {showPauseConfirm && (
        <ConfirmModal
          title="¿Pausar suscripción?"
          message="Tu suscripción se pausará y no se realizarán más cobros hasta que la reactives."
          confirmText="Sí, pausar"
          confirmColor="bg-yellow-600 hover:bg-yellow-700"
          onConfirm={handlePauseConfirm}
          onCancel={() => setShowPauseConfirm(false)}
        />
      )}

      {showCancelConfirm && (
        <ConfirmModal
          title="¿Cancelar suscripción?"
          message="Esta acción cancelará tu suscripción permanentemente. No podrás acceder a los beneficios del plan después de la fecha de renovación."
          confirmText="Sí, cancelar"
          confirmColor="bg-red-600 hover:bg-red-700"
          onConfirm={handleCancelConfirm}
          onCancel={() => setShowCancelConfirm(false)}
        />
      )}
    </>
  );
};

export default SubscriptionActions;

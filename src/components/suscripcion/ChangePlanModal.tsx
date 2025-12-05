import React from 'react';
import { Dialog } from '@headlessui/react';

import { useChangePlanHandler } from '../../hooks/use-change-plan-handler';
import { usePlanes } from '../../hooks/use-planes';
import { ChangePlanModalProps } from '../../types/components';
import { SubscriptionPlan } from '../../types/enums';
import PlanCard from '../perfil/PlanCard';

const ChangePlanModal: React.FC<ChangePlanModalProps> = ({ onClose, currentPlanId, onChanged }) => {
  const { planes, loading } = usePlanes();
  const normales = planes.filter((p) => !p.isOverage);
  const currentPlan = normales.find((p) => p.id === currentPlanId) || null;
  const { handleSelect, selected, saving } = useChangePlanHandler({
    currentPlanId,
    currentPlan,
    onChanged,
    onClose,
  });

  return (
    <Dialog open onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <Dialog.Overlay className="fixed inset-0 bg-black/40" />
      <div className="bg-white dark:bg-gray-800 p-6 rounded max-h-[90vh] overflow-y-auto w-full max-w-4xl z-10">
        <Dialog.Title className="text-xl font-bold mb-4 text-center">
          Elegir nuevo plan
        </Dialog.Title>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {normales.map((p) => (
              <PlanCard
                key={p.id}
                plan={p as unknown as SubscriptionPlan}
                loading={saving && selected === p.id}
                onSelect={() => {
                  void handleSelect(p);
                }}
              />
            ))}
          </div>
        )}
        <div className="text-center mt-6">
          <button className="btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ChangePlanModal;

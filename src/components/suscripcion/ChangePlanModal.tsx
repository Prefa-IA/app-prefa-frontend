import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { usePlanes, Plan } from '../../hooks/usePlanes';
import PlanCard from '../perfil/PlanCard';
import { subscriptionService } from '../../services/subscriptionService';
import { toast } from 'react-toastify';
import { ChangePlanModalProps } from '../../types/components';

const ChangePlanModal: React.FC<ChangePlanModalProps> = ({ onClose, currentPlanId, onChanged }) => {
  const { planes, loading } = usePlanes();
  const normales = planes.filter(p => !p.isOverage);
  const currentPlan = normales.find(p => p.id === currentPlanId) || null;
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSelect = async (plan: Plan) => {
    if (plan.id === currentPlanId) {
      toast.info('Ya estás en este plan.');
      return;
    }

    const isUpgrade = currentPlan ? (plan.price ?? 0) > (currentPlan.price ?? 0) : true;
    setSelected(plan.id);
    setSaving(true);
    try {
      const result = await subscriptionService.changePlan(plan.id!, isUpgrade);
      if (result?.init_point) {
        window.open(result.init_point, '_blank');
      }
      const amount = typeof result?.amount === 'number' ? result.amount : null;
      if (isUpgrade) {
        toast.success(amount && amount > 0
          ? `Upgrade iniciado. Pagá ${amount.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })} para completar.`
          : 'Upgrade iniciado.');
      } else {
        toast.success('Downgrade programado para el próximo ciclo.');
      }
      onChanged?.();
      onClose();
    } catch (e: any) {
      const message = e?.response?.data?.error || e?.message || 'Error al cambiar de plan';
      toast.error(message);
    } finally {
      setSaving(false);
      setSelected(null);
    }
  };

  return (
    <Dialog open onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <Dialog.Overlay className="fixed inset-0 bg-black/40" />
      <div className="bg-white dark:bg-gray-800 p-6 rounded max-h-[90vh] overflow-y-auto w-full max-w-4xl z-10">
        <Dialog.Title className="text-xl font-bold mb-4 text-center">Elegir nuevo plan</Dialog.Title>
        {loading ? <p>Cargando...</p> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {normales.map(p => (
              <PlanCard
                key={p.id}
                plan={p}
                loading={saving && selected === p.id}
                onSelect={() => handleSelect(p)}
              />
            ))}
          </div>
        )}
        <div className="text-center mt-6"><button className="btn-secondary" onClick={onClose}>Cerrar</button></div>
      </div>
    </Dialog>
  );
};

export default ChangePlanModal;

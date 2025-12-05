import { toast } from 'react-toastify';

import { subscriptionService } from '../services/subscription-service';

import { Plan } from './use-planes';

interface HandlePlanChangeParams {
  plan: Plan;
  currentPlanId: string | null;
  currentPlan: Plan | null;
  onChanged: (() => void) | undefined;
  onClose: () => void;
  setSelected: (id: string | null) => void;
  setSaving: (saving: boolean) => void;
}

const handleUpgradeSuccess = (amount: number | null) => {
  if (amount && amount > 0) {
    toast.success(
      `Upgrade iniciado. Pagá ${amount.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })} para completar.`
    );
  } else {
    toast.success('Upgrade iniciado.');
  }
};

const handlePlanChangeSuccess = (
  isUpgrade: boolean,
  amount: number | null,
  onChanged?: () => void,
  onClose?: () => void
) => {
  if (isUpgrade) {
    handleUpgradeSuccess(amount);
  } else {
    toast.success('Downgrade programado para el próximo ciclo.');
  }
  onChanged?.();
  onClose?.();
};

const handlePlanChangeError = (e: unknown) => {
  const errorObj = e as { response?: { data?: { error?: string } }; message?: string };
  const message =
    errorObj?.response?.data?.error || errorObj?.message || 'Error al cambiar de plan';
  toast.error(message);
};

export const executePlanChange = async ({
  plan,
  currentPlanId,
  currentPlan,
  onChanged,
  onClose,
  setSelected,
  setSaving,
}: HandlePlanChangeParams) => {
  if (plan.id === currentPlanId) {
    toast.info('Ya estás en este plan.');
    return;
  }

  const isUpgrade = currentPlan ? (plan.price ?? 0) > (currentPlan.price ?? 0) : true;
  setSelected(plan.id);
  setSaving(true);
  try {
    const result = await subscriptionService.changePlan(plan.id, isUpgrade);
    if (result?.init_point) {
      window.open(result.init_point, '_blank');
    }
    const amount = typeof result?.amount === 'number' ? result.amount : null;
    handlePlanChangeSuccess(isUpgrade, amount, onChanged, onClose);
  } catch (e: unknown) {
    handlePlanChangeError(e);
  } finally {
    setSaving(false);
    setSelected(null);
  }
};

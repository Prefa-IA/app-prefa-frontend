import { PlanCardProps } from '../../types/components';

export const calculateDiscountInfo = (plan: PlanCardProps['plan']) => {
  const isDiscountActive =
    typeof plan.discountPct === 'number' &&
    plan.discountPct > 0 &&
    (!plan.discountUntil || new Date(plan.discountUntil) >= new Date());

  const discountedPrice = isDiscountActive
    ? Math.round(plan.price * (1 - (plan.discountPct || 0) / 100))
    : plan.price;

  return { isDiscountActive, discountedPrice };
};

export const getPlanBenefits = (plan: PlanCardProps['plan']) => {
  const freeCreditsDisplay = plan.freeCredits
    ? `${plan.freeCredits.toLocaleString()} créditos gratis`
    : null;

  return [
    freeCreditsDisplay,
    plan.permiteCompuestas ? 'Análisis de múltiples lotes linderos' : null,
    plan.watermarkOrg ? 'Informes con marca de agua de tu empresa' : null,
    plan.watermarkPrefas ? 'Informes con marca de agua de Prefa-IA' : null,
  ].filter(Boolean);
};

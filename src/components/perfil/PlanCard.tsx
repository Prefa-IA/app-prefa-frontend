import React from 'react';

import { PlanCardProps } from '../../types/components';
import { safeObjectAccess } from '../../utils/object-safe-access';

import PlanCardContent from './PlanCardContent';

const BADGE_CONFIGS: Record<
  string,
  (plan: PlanCardProps['plan'], icon: string) => { badge: string; badgeClasses: string }
> = {
  'free-credits': (plan, icon) => ({
    badge: `${icon}${plan.freeCredits ?? 0} créditos gratis`,
    badgeClasses:
      'bg-gradient-to-r from-violet-500 via-violet-600 to-purple-500 shadow-violet-400 text-white',
  }),
  'super-save': (_plan, icon) => ({
    badge: `${icon}Super Ahorro`,
    badgeClasses: 'bg-gradient-to-r from-red-600 via-red-500 to-red-400 shadow-red-300 text-white',
  }),
  recommended: (plan, icon) => ({
    badge: `${icon}${plan.tag?.name || ''}`,
    badgeClasses: 'bg-green-600 text-white shadow-green-300',
  }),
};

const getBadgeInfo = (
  plan: PlanCardProps['plan']
): { badge: string | undefined; badgeClasses: string } => {
  if (!plan.tag) {
    return { badge: undefined, badgeClasses: '' };
  }

  const icon = plan.tag.icon ? plan.tag.icon + ' ' : '';
  const slug = plan.tag.slug;
  const configFn = slug ? safeObjectAccess(BADGE_CONFIGS, slug) : null;

  if (configFn) {
    return configFn(plan, icon);
  }

  return {
    badge: `${icon}${plan.tag.name}`,
    badgeClasses: plan.tag.bgClass,
  };
};

const PlanCard: React.FC<PlanCardProps> = ({ plan, loading = false, onSelect }) => {
  const { badge, badgeClasses } = getBadgeInfo(plan);

  return (
    <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-500 rounded-lg shadow-sm p-6 flex flex-col transition-all duration-300 hover:cursor-pointer">
      <PlanCardContent plan={plan} badge={badge} badgeClasses={badgeClasses} />

      {onSelect && (
        <button
          onClick={onSelect}
          disabled={loading || plan.purchaseEnabled === false}
          className="w-full text-white py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#0369A1' }}
        >
          {loading
            ? 'Procesando...'
            : plan.purchaseEnabled === false
              ? 'No disponible'
              : 'Elegir Plan'}
        </button>
      )}
    </div>
  );
};

export default PlanCard;

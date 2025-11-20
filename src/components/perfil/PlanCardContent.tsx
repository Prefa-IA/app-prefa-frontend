import React from 'react';

import { PlanCardProps } from '../../types/components';

import { calculateDiscountInfo, getPlanBenefits } from './PlanCardHelpers';

interface PlanCardContentProps {
  plan: PlanCardProps['plan'];
  badge: string | undefined;
  badgeClasses: string;
}

const PlanCardContent: React.FC<PlanCardContentProps> = ({ plan, badge, badgeClasses }) => {
  const { isDiscountActive, discountedPrice } = calculateDiscountInfo(plan);
  const benefits = getPlanBenefits(plan);

  return (
    <>
      {badge && (
        <span
          className={`absolute -top-3 left-4 px-2 py-1 text-xs font-semibold rounded ${badgeClasses}`}
        >
          {badge}
        </span>
      )}

      {isDiscountActive && (
        <span className="absolute -top-3 right-4 bg-white dark:bg-gray-900 text-black dark:text-white text-xs font-semibold rounded px-2 py-1 border border-gray-300 dark:border-gray-600">
          -{Math.round(plan.discountPct || 0)}% ahora
        </span>
      )}

      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{plan.name}</h3>

      {isDiscountActive && (
        <p className="text-sm text-gray-400 dark:text-gray-500 line-through mb-1">
          ${plan.price.toLocaleString()}
        </p>
      )}
      <p className="text-4xl font-extrabold" style={{ color: '#0284C7' }}>
        ${discountedPrice.toLocaleString()}
      </p>

      <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-6 flex-1">
        {benefits.map((text, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 flex-shrink-0" />
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </>
  );
};

export default PlanCardContent;

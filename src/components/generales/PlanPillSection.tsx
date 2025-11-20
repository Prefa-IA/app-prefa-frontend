import React from 'react';

import { SubscriptionPlan } from '../../types/enums';

interface PlanPillSectionProps {
  planObj: SubscriptionPlan | null;
  className?: string;
}

const PlanPillSection: React.FC<PlanPillSectionProps> = ({ planObj, className = '' }) => {
  if (!planObj) return null;
  const planDisplay = planObj.tag?.name || planObj.name;
  const baseClasses =
    'inline-block px-3 py-1 mb-4 ml-4 rounded-full text-xs font-semibold whitespace-nowrap ';
  const additionalClasses = planObj?.tag?.bgClass
    ? (() => {
        const g = planObj.tag.bgClass;
        const colorMatch = g.match(/(?:via|to|from)-([a-z]+)/);
        const color = colorMatch?.[1];
        const solid = color && /^[a-z]+$/.test(color) ? `bg-${color}-600` : 'bg-blue-600';
        return solid + ' text-white';
      })()
    : 'bg-blue-100 text-blue-800';
  const pillClasses = baseClasses + additionalClasses;
  return <span className={`${pillClasses} ${className}`}>{planDisplay}</span>;
};

export default PlanPillSection;

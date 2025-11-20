import React from 'react';

import { SubscriptionPlan } from '../../types/enums';

interface UserNameAndPlanProps {
  nombre: string;
  plan?: string;
  planObj?: SubscriptionPlan | null;
}

const UserNameAndPlan: React.FC<UserNameAndPlanProps> = ({ nombre, plan, planObj }) => {
  const planDisplay = plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : 'Sin plan';
  const baseClasses = 'px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ';
  const additionalClasses = planObj?.tag?.bgClass
    ? (() => {
        const g = planObj.tag.bgClass;
        const m = g.match(/(?:via|to|from)-([a-z]+)-(\d{3})/);
        const solid = m ? `bg-${m[1]}-${m[2]}` : 'bg-blue-600';
        return solid + ' text-white';
      })()
    : 'bg-blue-100 text-blue-800';
  const pillClasses = baseClasses + additionalClasses;

  return (
    <>
      <span className="ml-2 mr-2 whitespace-nowrap hidden xl:inline text-gray-900 dark:text-gray-100">
        {nombre}
      </span>
      <span className={pillClasses}>{planDisplay}</span>
    </>
  );
};

export default UserNameAndPlan;

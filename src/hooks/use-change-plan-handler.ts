import { useCallback, useState } from 'react';

import { executePlanChange } from './use-change-plan-handler-helpers';
import { Plan } from './use-planes';

interface UseChangePlanHandlerProps {
  currentPlanId: string | null;
  currentPlan: Plan | null;
  onChanged: (() => void) | undefined;
  onClose: () => void;
}

export const useChangePlanHandler = ({
  currentPlanId,
  currentPlan,
  onChanged,
  onClose,
}: UseChangePlanHandlerProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSelect = useCallback(
    async (plan: Plan) => {
      await executePlanChange({
        plan,
        currentPlanId,
        currentPlan,
        onChanged,
        onClose,
        setSelected,
        setSaving,
      });
    },
    [currentPlanId, currentPlan, onChanged, onClose]
  );

  return { handleSelect, selected, saving };
};

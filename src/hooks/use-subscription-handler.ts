import { useCallback } from 'react';
import { toast } from 'react-toastify';

interface UseSubscriptionHandlerProps {
  refresh: () => Promise<void>;
}

export const useSubscriptionHandler = ({ refresh }: UseSubscriptionHandlerProps) => {
  const handle = useCallback(
    async (action: () => Promise<unknown>, success: string) => {
      try {
        await action();
        toast.success(success);
        void refresh();
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : 'Error';
        toast.error(errorMessage);
      }
    },
    [refresh]
  );

  return { handle };
};

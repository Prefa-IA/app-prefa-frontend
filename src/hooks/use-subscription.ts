import { useCallback, useEffect, useState } from 'react';

import { subscriptionService } from '../services/subscription-service';

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<unknown | null>(null);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const s = await subscriptionService.getStatus();
      setSubscription(s);
    } catch {
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { subscription, loading, refresh };
};

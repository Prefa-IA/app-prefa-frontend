import { useEffect, useState, useCallback } from 'react';
import { subscriptionService } from '../services/subscriptionService';

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<any | null>(null);
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

  useEffect(() => { refresh(); }, [refresh]);

  return { subscription, loading, refresh };
};

import { useEffect, useState, useCallback, useRef } from 'react';
import api from '../services/api';

export interface CreditStatus {
  balance: number;
  creditsUsedDay: number;
  limitDay: number;
}

export const useCreditStatus = () => {
  const [status, setStatus] = useState<CreditStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchingRef = useRef(false);

  const fetchStatus = useCallback(async () => {
    if (fetchingRef.current) return;
    
    fetchingRef.current = true;
    try {
      const { data } = await api.get<{ balance: number; creditsUsedDay: number; creditsUsedMonth: number; limitDay?: number }>('/auth/creditos/resumen');
      setStatus({
        balance: data.balance || 0,
        creditsUsedDay: data.creditsUsedDay || 0,
        limitDay: data.limitDay || 5000,
      });
    } catch {
      setStatus(null);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  useEffect(() => { 
    fetchStatus(); 
  }, [fetchStatus]);

  return { status, loading, refresh: fetchStatus };
};

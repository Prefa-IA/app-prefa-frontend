import { useEffect, useState } from 'react';

import api from '../services/api';

interface CreditCosts {
  simple: number;
  completa: number;
  compuesta: number;
  basicSearch: number;
}

const DEFAULT_COSTS: CreditCosts = {
  simple: 100,
  completa: 200,
  compuesta: 300,
  basicSearch: 5,
};

export const useCreditCosts = () => {
  const [costs, setCosts] = useState<CreditCosts>(DEFAULT_COSTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCosts = async () => {
      try {
        const { data } = await api.get<CreditCosts>('/admin/billing/creditos/costos');
        setCosts(data);
      } catch (error) {
        console.error('Error obteniendo costos de créditos:', error);
        setCosts(DEFAULT_COSTS);
      } finally {
        setLoading(false);
      }
    };

    void fetchCosts();
  }, []);

  return { costs, loading };
};

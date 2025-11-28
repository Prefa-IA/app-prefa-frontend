import { useEffect, useState } from 'react';

export interface Overage {
  _id?: string;
  id: string;
  name: string;
  price: number;
  currency: string;
  creditosTotales: number;
  parentPlan: string;
}

const cache = {
  overages: null as Overage[] | null,
  inFlight: null as Promise<Overage[]> | null,
};

export const useOverages = () => {
  const [overages, setOverages] = useState<Overage[]>(cache.overages || []);
  const [loading, setLoading] = useState(!cache.overages);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache.overages) return;

    const fetchOverages = async () => {
      try {
        if (!cache.inFlight) {
          const base = process.env['REACT_APP_API_URL'] || 'http://localhost:4000';
          cache.inFlight = fetch(${base}/suscripciones/overages, {
            credentials: 'include',
          })
            .then((res) => {
              if (!res.ok) throw new Error('Error al cargar overages');
              return res.json();
            })
            .then((data) => (Array.isArray(data) ? data : Object.values(data)));
        }
        const data = await cache.inFlight;
        cache.overages = data;
        setOverages(data);
      } catch (e) {
        setError('Error al cargar overages');
      } finally {
        setLoading(false);
        cache.inFlight = null;
      }
    };

    void fetchOverages();
  }, []);

  return { overages, loading, error };
};

import { useEffect, useState } from 'react';

export interface Plan {
  id: string;
  name: string;
  price: number;
  /*@deprecated*/ creditosMes?: number;
  /*@deprecated*/ creditosDia?: number;
  permiteCompuestas?: boolean;
  watermarkOrg?: boolean;
  watermarkPrefas?: boolean;
  maxPrefactibilidades?: number;
  discountPct?: number;
  discountUntil?: string | null;
  features?: string[];
  freeTrial?: { frequency: number; frequency_type: string };
  freeCredits?: number;
  tag?: {
    slug: string;
    name: string;
    bgClass: string;
    icon?: string;
  };
  isOverage?: boolean;
  showDiscountSticker?: boolean;
  parentPlan?: string | null;
}

// Cache simple de módulo para evitar llamadas duplicadas entre montajes
const cache = {
  planes: null as Plan[] | null,
  inFlight: null as Promise<Plan[]> | null,
};

export const usePlanes = () => {
  const [planes, setPlanes] = useState<Plan[]>(cache.planes || []);
  const [loading, setLoading] = useState(!cache.planes);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache.planes) return; // ya tenemos datos

    const fetchPlans = async () => {
      try {
        if (!cache.inFlight) {
          const base = process.env['REACT_APP_API_URL'] || 'http://localhost:4000';
          cache.inFlight = fetch(`${base}/suscripciones/planes`)
            .then((res) => res.json())
            .then((data) => (Array.isArray(data) ? data : Object.values(data)));
        }
        const data = await cache.inFlight;
        cache.planes = data;
        setPlanes(data);
      } catch (e) {
        setError('Error al cargar planes');
      } finally {
        setLoading(false);
        cache.inFlight = null;
      }
    };

    void fetchPlans();
  }, []);

  return { planes, loading, error };
};

export const separatePlanes = (planes: Plan[], userPlanId?: string) => {
  const normales = planes.filter((p) => !p.isOverage);
  const overages = planes.filter(
    (p) => p.isOverage && (!userPlanId || p.parentPlan === userPlanId)
  );
  return { normales, overages };
};

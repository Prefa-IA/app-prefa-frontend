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
let cachedPlanes: Plan[] | null = null;
let inFlight: Promise<Plan[]> | null = null;

export const usePlanes = () => {
  const [planes, setPlanes] = useState<Plan[]>(cachedPlanes || []);
  const [loading, setLoading] = useState(!cachedPlanes);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedPlanes) return; // ya tenemos datos

    const fetchPlans = async () => {
      try {
        if (!inFlight) {
          const base = process.env.REACT_APP_API_URL || 'http://localhost:4000';
          inFlight = fetch(`${base}/suscripciones/planes`)
            .then(res => res.json())
            .then((data) => Array.isArray(data) ? data : Object.values(data));
        }
        const data = await inFlight;
        cachedPlanes = data;
        setPlanes(data);
      } catch (e) {
        setError('Error al cargar planes');
      } finally {
        setLoading(false);
        inFlight = null;
      }
    };

    fetchPlans();
  }, []);

  return { planes, loading, error };
};

export const separatePlanes = (planes: Plan[], userPlanId?: string) => {
  const normales = planes.filter(p => !p.isOverage);
  const overages = planes.filter(p => p.isOverage && (!userPlanId || p.parentPlan === userPlanId));
  return { normales, overages };
}
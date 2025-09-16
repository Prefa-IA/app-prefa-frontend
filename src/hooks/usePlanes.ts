import { useEffect, useState } from 'react';

export interface Plan {
  _id?: string;
  id: string;
  name: string;
  price: number;
  creditosMes?: number;
  creditosDia?: number;
  permiteCompuestas?: boolean;
  watermarkOrg?: boolean;
  watermarkPrefas?: boolean;
  maxPrefactibilidades?: number;
  discountPct?: number;
  discountUntil?: string | null;
  features?: string[];
  prioridad?: number;
  freeTrial?: { frequency: number; frequency_type: string };
  freeCredits?: number;
  tag?: {
    _id: string;
    slug: string;
    name: string;
    bgClass: string;
    icon?: string;
  };
  showDiscountSticker?: boolean;
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
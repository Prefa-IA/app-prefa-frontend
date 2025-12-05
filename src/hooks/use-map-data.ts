import { useEffect, useRef, useState } from 'react';

import { MapData } from '../types/components';

interface UseMapDataProps {
  smp: string;
  geometriaParcela: GeoJSON.Geometry | null;
  mapDataRef: React.MutableRefObject<MapData | null>;
  onDataLoaded: () => void;
}

const getApiBase = (): string => {
  return (process.env['REACT_APP_API_URL'] || 'http://localhost:4000').replace(/\/$/, '');
};

const getAuthHeader = (): string | null => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : null;
};

const createPostRequest = (
  base: string,
  smp: string,
  geometriaParcela: GeoJSON.Geometry,
  authHeaderValue: string | null,
  signal: AbortSignal | null
): Promise<Response> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (authHeaderValue) headers['Authorization'] = authHeaderValue;

  const init: RequestInit = {
    method: 'POST',
    headers,
    body: JSON.stringify({ smp, geometriaParcela }),
  };
  if (signal) {
    init.signal = signal;
  }

  return fetch(`${base}/mapdata/process-data`, init);
};

const createGetRequest = (
  base: string,
  smp: string,
  authHeaderValue: string | null,
  signal: AbortSignal | null
): Promise<Response> => {
  const headers: Record<string, string> = {};
  if (authHeaderValue) headers['Authorization'] = authHeaderValue;

  const init: RequestInit = Object.keys(headers).length > 0 ? { headers } : {};
  if (signal) {
    init.signal = signal;
  }

  return fetch(`${base}/mapdata/smp/${encodeURIComponent(smp)}`, init);
};

const handleResponse = async (
  response: Response,
  mapDataRef: React.MutableRefObject<MapData | null>,
  setEstadisticas: React.Dispatch<React.SetStateAction<MapData['estadisticas'] | null>>,
  onDataLoaded: () => void
): Promise<void> => {
  if (!response.ok) {
    if (response.status === 429) {
      console.warn('Rate limit alcanzado. Se mostrará solo la parcela del informe.');
      onDataLoaded();
      return;
    }
    throw new Error(`Server error: ${response.status}`);
  }

  const data = await response.json();
  mapDataRef.current = data;
  setEstadisticas(data.estadisticas || null);
  onDataLoaded();
};

const handleError = (err: unknown, onDataLoaded: () => void): void => {
  if (err instanceof Error) {
    if (err.name === 'AbortError') {
      return;
    }
    if (err.message.includes('429')) {
      console.warn('Rate limit alcanzado. Se mostrará solo la parcela del informe.');
    } else {
      console.error('Error fetching map data:', err);
    }
  }
  onDataLoaded();
};

export const useMapData = ({
  smp,
  geometriaParcela,
  mapDataRef,
  onDataLoaded,
}: UseMapDataProps) => {
  const [estadisticas, setEstadisticas] = useState<MapData['estadisticas'] | null>(null);
  const lastRequestRef = useRef<{ smp: string; geometriaParcela: string | null } | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!smp) return;

    const geometriaKey = geometriaParcela ? JSON.stringify(geometriaParcela) : null;
    const lastRequest = lastRequestRef.current;

    if (
      lastRequest &&
      lastRequest.smp === smp &&
      lastRequest.geometriaParcela === geometriaKey &&
      mapDataRef.current
    ) {
      onDataLoaded();
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    const fetchData = async () => {
      try {
        const base = getApiBase();
        const authHeaderValue = getAuthHeader();
        const signal = abortControllerRef.current?.signal || null;

        const response = geometriaParcela
          ? await createPostRequest(base, smp, geometriaParcela, authHeaderValue, signal)
          : await createGetRequest(base, smp, authHeaderValue, signal);

        await handleResponse(response, mapDataRef, setEstadisticas, onDataLoaded);
        lastRequestRef.current = { smp, geometriaParcela: geometriaKey };
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          handleError(err, onDataLoaded);
        }
      }
    };

    void fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [smp, geometriaParcela, mapDataRef, onDataLoaded]);

  return { estadisticas };
};

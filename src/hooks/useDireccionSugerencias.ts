import { useCallback, useState } from 'react';
import { DireccionSugerida } from '../types/enums';
import { Coordinates } from '../utils/mapUtils';
import { useSearchDebounce } from './useSearchDebounce';
import { obtenerSugerenciasDireccion, manejarSeleccionSugerencia } from '../utils/consultaDireccionUtils';
import { AddressSuggestionsHookReturn } from '../types/address';

export function useDireccionSugerencias(
  setDireccion: (direccion: string) => void,
  setCenter: (center: Coordinates) => void,
  modoCompuesto: boolean,
  agregarDireccion: (direccion: string) => void = () => {},
  minLength = 4,
  setError?: (error: string | null) => void,
): AddressSuggestionsHookReturn {
  const [sugerencias, setSugerencias] = useState<DireccionSugerida[]>([]);
  const [buscandoSugerencias, setBuscandoSugerencias] = useState(false);

  const searchSuggestions = useCallback(async (valor: string) => {
    setBuscandoSugerencias(true);
    try {
      await obtenerSugerenciasDireccion(valor, setSugerencias, setError || (() => null));
    } finally {
      setBuscandoSugerencias(false);
    }
  }, [setError]);

  const { debouncedSearch } = useSearchDebounce(searchSuggestions, { delay: 300, minLength });

  const obtenerSugerencias = useCallback((valor: string) => {
    if (valor.length < minLength) {
      setSugerencias([]);
      setBuscandoSugerencias(false);
      if (setError) {
        setError(null);
      }
      return;
    }
    setBuscandoSugerencias(true);
    debouncedSearch(valor);
  }, [debouncedSearch, minLength, setError]);

  const seleccionarSugerencia = useCallback(async (direccionStr: string) => {
    await manejarSeleccionSugerencia(
      direccionStr,
      sugerencias,
      setDireccion,
      setCenter,
      modoCompuesto,
      agregarDireccion
    );
  }, [sugerencias, setDireccion, setCenter, modoCompuesto, agregarDireccion]);

  return { sugerencias, buscandoSugerencias, obtenerSugerencias, seleccionarSugerencia };
}


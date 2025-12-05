import { useCallback, useRef, useState } from 'react';

import { AddressSuggestionsHookReturn } from '../types/address';
import { DireccionSugerida } from '../types/enums';
import {
  manejarSeleccionSugerencia,
  obtenerSugerenciasDireccion,
} from '../utils/consulta-direccion-utils';
import { Coordinates } from '../utils/map-utils';

import { useSearchDebounce } from './use-search-debounce';

export function useDireccionSugerencias(
  setDireccion: (direccion: string) => void,
  setCenter: (center: Coordinates) => void,
  _modoCompuesto: boolean,
  _agregarDireccion: (direccion: string) => void = () => {},
  minLength = 4,
  setError?: (error: string | null) => void
): AddressSuggestionsHookReturn {
  const [sugerencias, setSugerencias] = useState<DireccionSugerida[]>([]);
  const [buscandoSugerencias, setBuscandoSugerencias] = useState(false);
  const currentSearchRef = useRef<string>('');

  const searchSuggestions = useCallback(
    async (valor: string) => {
      currentSearchRef.current = valor;
      setBuscandoSugerencias(true);
      try {
        await obtenerSugerenciasDireccion(valor, setSugerencias, setError || (() => null));
        if (currentSearchRef.current === valor) {
          setBuscandoSugerencias(false);
        }
      } catch (error: unknown) {
        if (currentSearchRef.current === valor) {
          setBuscandoSugerencias(false);
        }
        throw error;
      }
    },
    [setError]
  );

  const { debouncedSearch } = useSearchDebounce(searchSuggestions, { delay: 300, minLength });

  const obtenerSugerencias = useCallback(
    (valor: string) => {
      if (valor.length < minLength) {
        setSugerencias([]);
        setBuscandoSugerencias(false);
        currentSearchRef.current = '';
        if (setError) {
          setError(null);
        }
        return;
      }

      setBuscandoSugerencias(true);
      debouncedSearch(valor);
    },
    [debouncedSearch, minLength, setError]
  );

  const seleccionarSugerencia = useCallback(
    async (direccionStr: string) => {
      await manejarSeleccionSugerencia(direccionStr, sugerencias, setDireccion, setCenter);
    },
    [sugerencias, setDireccion, setCenter]
  );

  return { sugerencias, buscandoSugerencias, obtenerSugerencias, seleccionarSugerencia };
}

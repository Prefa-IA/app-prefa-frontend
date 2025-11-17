import { useCallback, useState } from 'react';

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

  const searchSuggestions = useCallback(
    async (valor: string) => {
      setBuscandoSugerencias(true);
      try {
        await obtenerSugerenciasDireccion(valor, setSugerencias, setError || (() => null));
      } finally {
        setBuscandoSugerencias(false);
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

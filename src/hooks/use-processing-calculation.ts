import { useCallback } from 'react';
import { toast } from 'react-toastify';

import { prefactibilidad } from '../services/api';
import { PROCESSING_CONFIG } from '../types/consulta-direccion';
import { Informe } from '../types/enums';
import { isValidProcessingResponse } from '../utils/consulta-direccion-utils';

interface DatosParcela {
  smp?: string;
  direccion?: string;
  [key: string]: unknown;
}

interface ProcessingResponse {
  [key: string]: unknown;
}

interface UseProcessingCalculationProps {
  setResultado: (resultado: Informe) => void;
  setProcessing: (processing: boolean) => void;
}

const normalizarLfiAfeccionPercent = (parcelaParaCalcular: DatosParcela): void => {
  const edificabilidad = parcelaParaCalcular['edificabilidad'] as
    | Record<string, unknown>
    | undefined;

  if (edificabilidad) {
    const lfiAfeccionPercent = edificabilidad['lfi_afeccion_percent'];

    if (lfiAfeccionPercent === null || lfiAfeccionPercent === undefined) {
      edificabilidad['lfi_afeccion_percent'] = 0;
    } else if (typeof lfiAfeccionPercent === 'string') {
      const parsed = Number.parseFloat(lfiAfeccionPercent);
      edificabilidad['lfi_afeccion_percent'] = Number.isNaN(parsed) ? 0 : parsed;
    } else if (typeof lfiAfeccionPercent !== 'number') {
      edificabilidad['lfi_afeccion_percent'] = 0;
    }
  } else {
    parcelaParaCalcular['edificabilidad'] = { lfi_afeccion_percent: 0 };
  }
};

export const useProcessingCalculation = ({
  setResultado,
  setProcessing,
}: UseProcessingCalculationProps) => {
  const procesarCalculoPrefactibilidad = useCallback(
    async (datosParcela: DatosParcela) => {
      setProcessing(true);
      try {
        const parcelaParaCalcular = { ...datosParcela };
        normalizarLfiAfeccionPercent(parcelaParaCalcular);

        let resumenValido: ProcessingResponse | null = null;

        for (let intento = 0; intento < PROCESSING_CONFIG.MAX_RETRIES; intento++) {
          const respuesta = await prefactibilidad.calcular(parcelaParaCalcular);

          if (respuesta && isValidProcessingResponse(respuesta)) {
            resumenValido = respuesta;
            break;
          }
        }

        if (resumenValido) {
          setResultado({ ...datosParcela, iaResumen: resumenValido } as unknown as Informe);
        } else {
          toast.success('Prefactibilidad generada satisfactoriamente.');
          setResultado(datosParcela as unknown as Informe);
        }
      } catch (err) {
        console.error('Error en procesamiento:', err);
        toast.error(
          'No fue posible obtener la respuesta del cálculo. Se mostrarán los datos disponibles.'
        );
        setResultado(datosParcela as unknown as Informe);
      } finally {
        // Si la consulta se resuelve antes de 60 segundos, mostrar inmediatamente
        // El contador visual ya maneja el tiempo restante
        setProcessing(false);
      }
    },
    [setResultado, setProcessing]
  );

  return { procesarCalculoPrefactibilidad };
};

import { useCallback, useRef } from 'react';
import { toast } from 'react-toastify';

import { prefactibilidad } from '../services/api';
import { PROCESSING_CONFIG, TipoPrefa } from '../types/consulta-direccion';
import { Informe, InformeCompuesto } from '../types/enums';
import { isValidProcessingResponse } from '../utils/consulta-direccion-utils';
import { validarDatosCompletos } from '../utils/report-utils';

interface ProcessingResponse {
  [key: string]: unknown;
}

interface UseProcessingCalculationProps {
  setResultado: (resultado: Informe) => void;
  setProcessing: (processing: boolean) => void;
}

const normalizarLfiAfeccionPercent = (
  parcelaParaCalcular: Informe | Record<string, unknown>
): void => {
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
  const abortControllerRef = useRef<AbortController | null>(null);

  const procesarCalculoPrefactibilidad = useCallback(
    async (informe: Informe, _tipoPrefa: TipoPrefa, _informeCompuesto?: InformeCompuesto) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setProcessing(true);
      try {
        const parcelaParaCalcular = { ...informe } as Record<string, unknown>;
        normalizarLfiAfeccionPercent(parcelaParaCalcular);

        const obtenerResumenValido = async (
          signal?: AbortSignal
        ): Promise<ProcessingResponse | null> => {
          const maxRetries = PROCESSING_CONFIG.MAX_RETRIES;
          const attempts = Array.from({ length: maxRetries }, (_, i) => i);
          for (const intento of attempts) {
            if (signal?.aborted) {
              return null;
            }

            try {
              const respuesta = await prefactibilidad.calcular(parcelaParaCalcular);
              if (respuesta && isValidProcessingResponse(respuesta)) {
                return respuesta;
              }
            } catch (error) {
              if (error instanceof Error && error.name === 'AbortError') {
                return null;
              }
            }

            if (intento < maxRetries - 1) {
              const delay = Math.min(1000 * Math.pow(2, intento), 10000);
              const jitter = Math.random() * 1000;
              await new Promise((resolve) => setTimeout(resolve, delay + jitter));
            }
          }
          return null;
        };

        const resumenValido = await obtenerResumenValido(signal);

        if (resumenValido) {
          const calculoFromResponse = resumenValido['calculo'] as
            | Record<string, unknown>
            | undefined;
          const informeConCalculo = {
            ...informe,
            ...resumenValido,
            calculo: calculoFromResponse || informe.calculo,
          } as Informe;
          setResultado(informeConCalculo);
        } else {
          const datosCompletos = validarDatosCompletos(informe);
          const datosIncompletos = Boolean(informe.datosIncompletos) || !datosCompletos;

          if (!datosIncompletos) {
            toast.success('Prefactibilidad generada satisfactoriamente.');
          }
          setResultado(informe);
        }
      } catch (err) {
        toast.error(
          'No fue posible obtener la respuesta del cálculo. Se mostrarán los datos disponibles.'
        );
        setResultado(informe);
      } finally {
        // Si la consulta se resuelve antes de 60 segundos, mostrar inmediatamente
        // El contador visual ya maneja el tiempo restante
        setProcessing(false);
        abortControllerRef.current = null;
      }
    },
    [setResultado, setProcessing]
  );

  return { procesarCalculoPrefactibilidad };
};

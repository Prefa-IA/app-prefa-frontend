import { useCallback } from 'react';
import { toast } from 'react-toastify';

import { prefactibilidad } from '../services/api';
import { PROCESSING_CONFIG, TipoPrefa } from '../types/consulta-direccion';
import { Informe, InformeCompuesto } from '../types/enums';
import { isValidProcessingResponse } from '../utils/consulta-direccion-utils';

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
  const procesarCalculoPrefactibilidad = useCallback(
    async (informe: Informe, _tipoPrefa: TipoPrefa, _informeCompuesto?: InformeCompuesto) => {
      setProcessing(true);
      try {
        const parcelaParaCalcular = { ...informe } as Record<string, unknown>;
        normalizarLfiAfeccionPercent(parcelaParaCalcular);

        const obtenerResumenValido = async (): Promise<ProcessingResponse | null> => {
          const attempts = Array.from({ length: PROCESSING_CONFIG.MAX_RETRIES }, (_, i) => i);
          for (const _intento of attempts) {
            const respuesta = await prefactibilidad.calcular(parcelaParaCalcular);

            if (respuesta && isValidProcessingResponse(respuesta)) {
              return respuesta;
            }
          }
          return null;
        };

        const resumenValido = await obtenerResumenValido();

        if (resumenValido) {
          setResultado({ ...informe, iaResumen: resumenValido } as unknown as Informe);
        } else {
          toast.success('Prefactibilidad generada satisfactoriamente.');
          setResultado(informe);
        }
      } catch (err) {
        console.error('Error en procesamiento:', err);
        toast.error(
          'No fue posible obtener la respuesta del cálculo. Se mostrarán los datos disponibles.'
        );
        setResultado(informe);
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

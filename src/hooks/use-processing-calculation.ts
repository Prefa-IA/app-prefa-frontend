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

export const useProcessingCalculation = ({
  setResultado,
  setProcessing,
}: UseProcessingCalculationProps) => {
  const procesarCalculoPrefactibilidad = useCallback(
    async (datosParcela: DatosParcela) => {
      setProcessing(true);
      try {
        let resumenValido: ProcessingResponse | null = null;

        for (let intento = 0; intento < PROCESSING_CONFIG.MAX_RETRIES; intento++) {
          const respuesta = await prefactibilidad.calcular(datosParcela);

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

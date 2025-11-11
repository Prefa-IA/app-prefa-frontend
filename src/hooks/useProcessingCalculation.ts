import { useCallback } from 'react';
import { prefactibilidad } from '../services/api';
import { Informe } from '../types/enums';
import { PROCESSING_CONFIG } from '../types/consultaDireccion';
import { isValidProcessingResponse } from '../utils/consultaDireccionUtils';
import { toast } from 'react-toastify';

interface UseProcessingCalculationProps {
  setResultado: (resultado: Informe) => void;
  setProcessing: (processing: boolean) => void;
}

export const useProcessingCalculation = ({
  setResultado,
  setProcessing
}: UseProcessingCalculationProps) => {
  const procesarCalculoPrefactibilidad = useCallback(async (datosParcela: any) => {
    setProcessing(true);
    const started = Date.now();
    try {
      let resumenValido: any = null;
      
      for (let intento = 0; intento < PROCESSING_CONFIG.MAX_RETRIES; intento++) {
        const respuesta = await prefactibilidad.calcular(datosParcela);
        
        if (respuesta && isValidProcessingResponse(respuesta)) {
          resumenValido = respuesta;
          break;
        }
      }

      if (resumenValido) {
        setResultado({ ...datosParcela, iaResumen: resumenValido } as any);
      } else {
        toast.success('Prefactibilidad generada satisfactoriamente.');
        setResultado(datosParcela);
      }
    } catch (err) {
      console.error('Error en procesamiento:', err);
      toast.error('No fue posible obtener la respuesta del cálculo. Se mostrarán los datos disponibles.');
      setResultado(datosParcela);
    } finally {
      const elapsed = Date.now() - started;
      if (elapsed < 5000) {
        await new Promise(r => setTimeout(r, 5000 - elapsed));
      }
      setProcessing(false);
    }
  }, [setResultado, setProcessing]);

  return { procesarCalculoPrefactibilidad };
};


import { useCallback } from 'react';
import { toast } from 'react-toastify';

import { prefactibilidad } from '../services/api';
import { TipoPrefa } from '../types/consulta-direccion';
import { Informe } from '../types/enums';
import { downloadReportPDF } from '../utils/report-utils';

export interface UseReportGenerationProps {
  savedId: string | null;
  resultado: Informe | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  tipoPrefa: TipoPrefa;
  setSavedId: (id: string | null) => void;
}

export const useReportGeneration = ({
  savedId,
  resultado,
  setError,
  tipoPrefa,
  setSavedId,
}: UseReportGenerationProps) => {
  const handleGenerateReport = useCallback(async () => {
    if (!resultado) {
      setError('No hay resultado para generar el reporte');
      return;
    }

    const getSavedId = async (): Promise<string | null> => {
      if (savedId) {
        return savedId;
      }

      const loadingId = toast.loading('Guardando informe antes de generar PDF...');
      try {
        const informeParaGuardar: Informe = {
          ...resultado,
          tipoPrefa,
        };

        const response = await prefactibilidad.aceptarInforme(informeParaGuardar);

        if (response.success && response.informe?._id) {
          const newSavedId = response.informe._id;
          setSavedId(newSavedId);
          toast.dismiss(loadingId);
          toast.success('Informe guardado exitosamente');
          return newSavedId;
        } else {
          toast.dismiss(loadingId);
          toast.error('Error al guardar el informe');
          setError('Error al guardar el informe antes de generar el PDF');
          return null;
        }
      } catch (err) {
        toast.dismiss(loadingId);
        const errorMessage = err instanceof Error ? err.message : 'Error al guardar el informe';
        toast.error(errorMessage);
        setError(errorMessage);
        return null;
      }
    };

    const finalSavedId = await getSavedId();

    if (finalSavedId) {
      await downloadReportPDF(finalSavedId, resultado, setError);
    } else {
      setError('No se pudo obtener el ID del informe guardado');
    }
  }, [savedId, resultado, setError, tipoPrefa, setSavedId]);

  return { handleGenerateReport };
};

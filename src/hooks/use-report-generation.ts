import { useCallback } from 'react';

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
  tipoPrefa: _tipoPrefa,
  setSavedId: _setSavedId,
}: UseReportGenerationProps) => {
  const handleGenerateReport = useCallback(async () => {
    await downloadReportPDF(savedId, resultado, setError);
  }, [savedId, resultado, setError]);

  return { handleGenerateReport };
};

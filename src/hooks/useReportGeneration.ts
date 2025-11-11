import { useCallback } from 'react';
import { Informe } from '../types/enums';
import { downloadReportPDF } from '../utils/reportUtils';

export interface UseReportGenerationProps {
  savedId: string | null;
  resultado: Informe | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useReportGeneration = ({
  savedId,
  resultado,
  setError,
}: UseReportGenerationProps) => {
  const handleGenerateReport = useCallback(async () => {
    await downloadReportPDF(savedId || '', resultado, setError);
  }, [savedId, resultado, setError]);

  return { handleGenerateReport };
};


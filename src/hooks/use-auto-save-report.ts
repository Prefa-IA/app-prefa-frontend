import { useEffect, useRef, useState } from 'react';

import { TipoPrefa } from '../types/consulta-direccion';
import { Informe } from '../types/enums';

import { useReportSave } from './use-report-save';

interface UseAutoSaveReportProps {
  resultado: Informe | null;
  tipoPrefa: TipoPrefa;
  setError: (error: string | null) => void;
  setSavedId: (id: string | null) => void;
  onSaveComplete?: (savedId: string) => void;
}

export const useAutoSaveReport = ({
  resultado,
  tipoPrefa,
  setError,
  setSavedId,
  onSaveComplete,
}: UseAutoSaveReportProps) => {
  const [savedId, setSavedIdState] = useState<string | null>(null);
  const { guardarInforme, updateOnSaveComplete, isSaving, lastSavedResultadoId } = useReportSave({
    tipoPrefa,
    setError,
    setSavedId: (id) => {
      setSavedId(id);
      setSavedIdState(id);
    },
    onSaveComplete,
  });

  useEffect(() => {
    updateOnSaveComplete(onSaveComplete);
  }, [onSaveComplete, updateOnSaveComplete]);

  const resultadoIdRef = useRef<string | null>(null);
  const resultadoRef = useRef<Informe | null>(null);

  useEffect(() => {
    if (!resultado) {
      resultadoIdRef.current = null;
      resultadoRef.current = null;
      setSavedIdState(null);
      return;
    }

    if (isSaving) {
      return;
    }

    const resultadoId = resultado._id as string | undefined;
    const resultadoIdString = resultadoId || null;

    const resultadoKey = JSON.stringify({
      smp: resultado.datosCatastrales?.smp,
      direccion: resultado.direccionesNormalizadas?.[0]?.direccion,
      tipoPrefa,
    });

    const resultadoRefKey = resultadoRef.current
      ? JSON.stringify({
          smp: resultadoRef.current.datosCatastrales?.smp,
          direccion: resultadoRef.current.direccionesNormalizadas?.[0]?.direccion,
          tipoPrefa,
        })
      : null;

    if (resultadoKey === resultadoRefKey) {
      return;
    }

    if (resultadoIdString && resultadoIdString === lastSavedResultadoId) {
      resultadoIdRef.current = resultadoIdString;
      resultadoRef.current = resultado;
      return;
    }

    resultadoIdRef.current = resultadoIdString;
    resultadoRef.current = resultado;
    void guardarInforme(resultado);
  }, [resultado, isSaving, lastSavedResultadoId, guardarInforme, tipoPrefa]);

  return {
    isSaving,
    savedId,
  };
};

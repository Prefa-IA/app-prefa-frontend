import { useEffect, useRef, useState } from 'react';

import { TipoPrefa } from '../types/consulta-direccion';
import { Informe } from '../types/enums';
import { validarDatosCompletos } from '../utils/report-utils';

import { useReportSave } from './use-report-save';

interface UseAutoSaveReportProps {
  resultado: Informe | null;
  tipoPrefa: TipoPrefa;
  processing: boolean;
  setError: (error: string | null) => void;
  setSavedId: (id: string | null) => void;
  onSaveComplete?: (savedId: string) => void;
}

const generarResultadoKey = (informe: Informe, tipoPrefa: TipoPrefa): string => {
  return JSON.stringify({
    smp: informe.datosCatastrales?.smp,
    direccion: informe.direccionesNormalizadas?.[0]?.direccion,
    tipoPrefa,
  });
};

const tieneCalculoCompleto = (informe: Informe): boolean => {
  return Boolean(
    informe.calculo &&
      typeof informe.calculo === 'object' &&
      Object.keys(informe.calculo).length > 0
  );
};

export const useAutoSaveReport = ({
  resultado,
  tipoPrefa,
  processing,
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

    if (isSaving || processing) {
      return;
    }

    const datosCompletos = validarDatosCompletos(resultado);
    const datosIncompletos = Boolean(resultado.datosIncompletos) || !datosCompletos;

    if (datosIncompletos || !tieneCalculoCompleto(resultado)) {
      return;
    }

    const resultadoId = resultado._id as string | undefined;
    const resultadoIdString = resultadoId || null;
    const resultadoKey = generarResultadoKey(resultado, tipoPrefa);
    const resultadoRefKey = resultadoRef.current
      ? generarResultadoKey(resultadoRef.current, tipoPrefa)
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
  }, [resultado, isSaving, lastSavedResultadoId, guardarInforme, tipoPrefa, processing]);

  return {
    isSaving,
    savedId,
  };
};

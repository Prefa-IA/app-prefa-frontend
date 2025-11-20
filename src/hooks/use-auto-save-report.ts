import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { prefactibilidad } from '../services/api';
import { TipoPrefa } from '../types/consulta-direccion';
import { Informe } from '../types/enums';
import { manejarErrorGuardado } from '../utils/consulta-direccion-utils';

interface UseAutoSaveReportProps {
  resultado: Informe | null;
  tipoPrefa: TipoPrefa;
  setError: (error: string | null) => void;
  setSavedId: (id: string | null) => void;
  onSaveComplete?: (savedId: string) => void;
}

interface SaveState {
  isSaving: boolean;
  savedId: string | null;
  lastSavedResultadoId: string | null;
}

export const useAutoSaveReport = ({
  resultado,
  tipoPrefa,
  setError,
  setSavedId,
  onSaveComplete,
}: UseAutoSaveReportProps) => {
  const [saveState, setSaveState] = useState<SaveState>({
    isSaving: false,
    savedId: null,
    lastSavedResultadoId: null,
  });

  const onSaveCompleteRef = useRef(onSaveComplete);

  useEffect(() => {
    onSaveCompleteRef.current = onSaveComplete;
  }, [onSaveComplete]);

  const guardarInforme = useCallback(async (): Promise<boolean> => {
    if (!resultado || saveState.isSaving) {
      return false;
    }

    const resultadoId = resultado._id as string | undefined;
    if (resultadoId && saveState.lastSavedResultadoId === resultadoId) {
      return false;
    }

    setSaveState((prev) => ({ ...prev, isSaving: true }));
    const loadingId = toast.loading('Guardando informe...');

    try {
      const informeParaGuardar: Informe = {
        ...resultado,
        tipoPrefa,
      };

      const response = await prefactibilidad.aceptarInforme(informeParaGuardar);

      if (response.success && response.informe?._id) {
        toast.success(response.message || 'Informe guardado exitosamente');

        const savedId = response.informe._id;
        setSavedId(savedId);
        setSaveState((prev) => ({
          ...prev,
          savedId,
          lastSavedResultadoId: resultadoId || savedId,
        }));
        onSaveCompleteRef.current?.(savedId);

        window.dispatchEvent(
          new CustomEvent('informe-guardado', { detail: { informeId: savedId } })
        );

        return true;
      } else {
        toast.error('Error al guardar el informe');
        setError('Error al guardar el informe');
        return false;
      }
    } catch (err) {
      manejarErrorGuardado(err, setError);
      return false;
    } finally {
      toast.dismiss(loadingId);
      setSaveState((prev) => ({ ...prev, isSaving: false }));
    }
  }, [
    resultado,
    tipoPrefa,
    saveState.isSaving,
    saveState.lastSavedResultadoId,
    setError,
    setSavedId,
  ]);

  const resultadoIdRef = useRef<string | null>(null);
  const resultadoRef = useRef<Informe | null>(null);

  useEffect(() => {
    if (!resultado) {
      resultadoIdRef.current = null;
      resultadoRef.current = null;
      setSaveState({
        isSaving: false,
        savedId: null,
        lastSavedResultadoId: null,
      });
      return;
    }

    const resultadoId = resultado._id as string | undefined;
    const resultadoIdString = resultadoId || null;

    if (
      resultadoIdString &&
      resultadoIdString !== resultadoIdRef.current &&
      resultadoIdString !== saveState.lastSavedResultadoId &&
      !saveState.isSaving &&
      resultado !== resultadoRef.current
    ) {
      resultadoIdRef.current = resultadoIdString;
      resultadoRef.current = resultado;
      void guardarInforme();
    }
  }, [resultado?._id, saveState.isSaving, saveState.lastSavedResultadoId, guardarInforme]);

  return {
    isSaving: saveState.isSaving,
    savedId: saveState.savedId,
  };
};

import { useCallback, useRef } from 'react';
import { toast } from 'react-toastify';

import { prefactibilidad } from '../services/api';
import { TipoPrefa } from '../types/consulta-direccion';
import { Informe, PrefaType } from '../types/enums';
import { manejarErrorGuardado } from '../utils/consulta-direccion-utils';

interface UseReportSaveProps {
  tipoPrefa: TipoPrefa;
  setError: (error: string | null) => void;
  setSavedId: (id: string | null) => void;
  onSaveComplete: ((savedId: string) => void) | undefined;
}

interface SaveState {
  isSaving: boolean;
  lastSavedResultadoId: string | null;
}

export const useReportSave = ({
  tipoPrefa,
  setError,
  setSavedId,
  onSaveComplete,
}: UseReportSaveProps) => {
  const saveStateRef = useRef<SaveState>({
    isSaving: false,
    lastSavedResultadoId: null,
  });
  const onSaveCompleteRef = useRef(onSaveComplete);

  const updateOnSaveComplete = useCallback((callback?: (savedId: string) => void) => {
    onSaveCompleteRef.current = callback;
  }, []);

  const guardarInforme = useCallback(
    async (resultado: Informe): Promise<boolean> => {
      if (saveStateRef.current.isSaving) {
        return false;
      }

      const resultadoId = resultado._id as string | undefined;
      if (resultadoId && saveStateRef.current.lastSavedResultadoId === resultadoId) {
        return false;
      }

      saveStateRef.current.isSaving = true;
      const loadingId = toast.loading('Guardando informe...');

      try {
        if (!tipoPrefa || (tipoPrefa !== 'prefa1' && tipoPrefa !== 'prefa2')) {
          toast.error('Debes seleccionar un tipo de informe antes de guardar');
          setError('Tipo de prefactibilidad no válido');
          return false;
        }

        const informeParaGuardar: Informe = {
          ...resultado,
          tipoPrefa: tipoPrefa as PrefaType,
        };

        const response = await prefactibilidad.aceptarInforme(informeParaGuardar);

        if (response.success && response.informe?._id) {
          toast.success(response.message || 'Informe guardado exitosamente');

          const savedId = response.informe._id;
          setSavedId(savedId);
          saveStateRef.current.lastSavedResultadoId = resultadoId || savedId;
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
        saveStateRef.current.isSaving = false;
      }
    },
    [tipoPrefa, setError, setSavedId]
  );

  return {
    guardarInforme,
    updateOnSaveComplete,
    isSaving: saveStateRef.current.isSaving,
    lastSavedResultadoId: saveStateRef.current.lastSavedResultadoId,
  };
};

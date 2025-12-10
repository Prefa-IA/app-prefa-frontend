import { useCallback, useRef } from 'react';
import { toast } from 'react-toastify';

import { prefactibilidad } from '../services/api';
import { TipoPrefa } from '../types/consulta-direccion';
import { Informe, PrefaType } from '../types/enums';
import { manejarErrorGuardado } from '../utils/consulta-direccion-utils';
import { validarDatosCompletos } from '../utils/report-utils';

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

const validarTipoPrefaHelper = (
  tipoPrefa: TipoPrefa,
  setError: (error: string | null) => void
): boolean => {
  if (!tipoPrefa || (tipoPrefa !== 'prefa1' && tipoPrefa !== 'prefa2')) {
    toast.error('Debes seleccionar un tipo de informe antes de guardar');
    setError('Tipo de prefactibilidad no válido');
    return false;
  }
  return true;
};

const procesarRespuestaGuardadoHelper = (
  response: { success: boolean; informe?: Informe; message?: string },
  resultadoId: string | undefined,
  setError: (error: string | null) => void,
  setSavedId: (id: string | null) => void,
  saveStateRef: React.MutableRefObject<SaveState>,
  onSaveCompleteRef: React.MutableRefObject<((savedId: string) => void) | undefined>
): boolean => {
  if (response.success && response.informe?._id) {
    toast.success(response.message || 'Informe guardado exitosamente');

    const savedId = response.informe._id;
    setSavedId(savedId);
    saveStateRef.current.lastSavedResultadoId = resultadoId || savedId;
    onSaveCompleteRef.current?.(savedId);

    window.dispatchEvent(new CustomEvent('informe-guardado', { detail: { informeId: savedId } }));

    return true;
  }

  const MENSAJE_ERROR_GUARDADO = 'Error al guardar el informe';
  toast.error(MENSAJE_ERROR_GUARDADO);
  setError(MENSAJE_ERROR_GUARDADO);
  return false;
};

const puedeGuardarInformeHelper = (
  resultado: Informe,
  saveStateRef: React.MutableRefObject<SaveState>,
  validarTipoPrefa: () => boolean
): boolean => {
  if (saveStateRef.current.isSaving) {
    return false;
  }

  const resultadoId = resultado._id as string | undefined;
  if (resultadoId && saveStateRef.current.lastSavedResultadoId === resultadoId) {
    return false;
  }

  const datosCompletos = validarDatosCompletos(resultado);
  const datosIncompletos = Boolean(resultado.datosIncompletos) || !datosCompletos;

  if (datosIncompletos) {
    return false;
  }

  return validarTipoPrefa();
};

const TOAST_ID_GENERAR_PDF = 'generar-pdf';

const generarPdfDespuesDeGuardar = async (informeId: string): Promise<void> => {
  toast.loading('Generando PDF...', { toastId: TOAST_ID_GENERAR_PDF });
  try {
    await prefactibilidad.generarPdf(informeId);
    toast.dismiss(TOAST_ID_GENERAR_PDF);
    toast.success('PDF generado exitosamente');
  } catch (pdfError) {
    toast.dismiss(TOAST_ID_GENERAR_PDF);
    toast.warn('El informe se guardó pero hubo un error al generar el PDF');
    console.error('Error al generar PDF:', pdfError);
  }
};

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

  const validarTipoPrefa = useCallback((): boolean => {
    return validarTipoPrefaHelper(tipoPrefa, setError);
  }, [tipoPrefa, setError]);

  const procesarRespuestaGuardado = useCallback(
    (
      response: { success: boolean; informe?: Informe; message?: string },
      resultadoId: string | undefined
    ): boolean => {
      return procesarRespuestaGuardadoHelper(
        response,
        resultadoId,
        setError,
        setSavedId,
        saveStateRef,
        onSaveCompleteRef
      );
    },
    [setError, setSavedId]
  );

  const puedeGuardarInforme = useCallback(
    (resultado: Informe): boolean => {
      return puedeGuardarInformeHelper(resultado, saveStateRef, validarTipoPrefa);
    },
    [validarTipoPrefa]
  );

  const guardarInforme = useCallback(
    async (resultado: Informe): Promise<boolean> => {
      if (!puedeGuardarInforme(resultado)) {
        return false;
      }

      saveStateRef.current.isSaving = true;
      const loadingId = toast.loading('Guardando informe...');

      try {
        const resultadoId = resultado._id as string | undefined;
        const informeParaGuardar: Informe = {
          ...resultado,
          tipoPrefa: tipoPrefa as PrefaType,
        };

        const response = await prefactibilidad.aceptarInforme(informeParaGuardar);
        const guardadoExitoso = procesarRespuestaGuardado(response, resultadoId);

        if (guardadoExitoso) {
          toast.dismiss(loadingId);
        }

        if (guardadoExitoso && response.informe?._id) {
          await generarPdfDespuesDeGuardar(response.informe._id);
        }

        return guardadoExitoso;
      } catch (err) {
        manejarErrorGuardado(err, setError);
        return false;
      } finally {
        // Solo descartar si no se descartó antes (en caso de error)
        toast.dismiss(loadingId);
        saveStateRef.current.isSaving = false;
      }
    },
    [tipoPrefa, setError, puedeGuardarInforme, procesarRespuestaGuardado]
  );

  return {
    guardarInforme,
    updateOnSaveComplete,
    isSaving: saveStateRef.current.isSaving,
    lastSavedResultadoId: saveStateRef.current.lastSavedResultadoId,
  };
};

import { useCallback } from 'react';
import { toast } from 'react-toastify';

import { prefactibilidad } from '../services/api';
import { validateLinderas } from '../services/consolidacion-informes';
import { TIPO_PREFA, TipoPrefa } from '../types/consulta-direccion';
import { Informe } from '../types/enums';
import { manejarErrorConsulta, validarDireccionConNumero } from '../utils/consulta-direccion-utils';
import { validarDatosCompletos } from '../utils/report-utils';

interface UseMultipleAddressConsultationProps {
  direcciones: string[];
  tipoPrefa: TipoPrefa;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setResultados: (resultados: Informe[]) => void;
  setProcessing: (processing: boolean) => void;
  setIsValidating: (isValidating: boolean) => void;
  refreshProfile: () => Promise<void>;
  refreshCredits: () => void;
}

const validarConsultaCompuesta = (
  direcciones: string[],
  tipoPrefa: TipoPrefa,
  setError: (error: string | null) => void
): boolean => {
  if (direcciones.length === 0) return false;

  if (direcciones.length > 3) {
    setError('Solo se permiten hasta 3 direcciones en prefactibilidades compuestas');
    return false;
  }

  if (!tipoPrefa || (tipoPrefa !== TIPO_PREFA.SIMPLE && tipoPrefa !== TIPO_PREFA.COMPLETA)) {
    setError('Debes seleccionar un tipo de informe');
    return false;
  }

  const direccionesSinNumero = direcciones.filter((dir) => !validarDireccionConNumero(dir));
  if (direccionesSinNumero.length > 0) {
    setError(
      `Las siguientes direcciones deben incluir un número (altura): ${direccionesSinNumero.join(', ')}`
    );
    return false;
  }

  return true;
};

const validarDatosDirecciones = async (direcciones: string[]): Promise<Informe[]> => {
  const informesPreliminares: Informe[] = [];

  for (const direccion of direcciones) {
    try {
      const informe = await prefactibilidad.consultarDireccion(direccion, {
        prefaCompleta: false,
        compuesta: false,
        basicSearch: true,
        skipCredits: true,
      });

      if ('inProgress' in informe && informe.inProgress) {
        throw new Error('Ya tienes una consulta en curso. Espera a que finalice.');
      }

      if (!validarDatosCompletos(informe)) {
        throw new Error(
          `La dirección "${direccion}" no tiene todos los datos necesarios para una prefactibilidad compuesta.`
        );
      }

      informesPreliminares.push(informe);
    } catch (error: unknown) {
      const err = error as { message?: string };
      if (err.message) {
        throw new Error(err.message);
      }
      throw new Error(`Error al validar la dirección "${direccion}"`);
    }
  }

  return informesPreliminares;
};

const procesarConsultasDirecciones = async (
  direcciones: string[],
  tipoPrefa: TipoPrefa
): Promise<Informe[]> => {
  try {
    const resultados = await prefactibilidad.consultarDireccionesCompuestas(direcciones, {
      prefaCompleta: tipoPrefa === TIPO_PREFA.COMPLETA,
    });
    return resultados;
  } catch (error: unknown) {
    const err = error as {
      response?: {
        status?: number;
        data?: { status?: string; error?: string; direccion?: string };
      };
      message?: string;
    };

    if (err.response?.data?.status === 'in_progress') {
      toast.info('Ya tienes una consulta en curso. Espera a que finalice.');
      throw new Error('CONSULTA_EN_CURSO');
    }

    const errorMessage =
      err.response?.data?.error || err.message || 'Error al procesar las direcciones compuestas';

    const enhancedError = new Error(errorMessage) as unknown as Error & {
      response?: {
        status?: number;
        data?: { status?: string; error?: string; direccion?: string };
      };
    };
    if (err.response) {
      enhancedError.response = err.response;
    }
    throw enhancedError;
  }
};

const guardarEnHistorial = async (direcciones: string[]): Promise<void> => {
  try {
    const { addAddressToHistory } = await import('../services/address-history');
    await Promise.all(direcciones.map((d) => addAddressToHistory(d)));
  } catch {
    // Ignorar errores al guardar en historial
  }
};

export const useMultipleAddressConsultation = ({
  direcciones,
  tipoPrefa,
  setLoading,
  setError,
  setResultados,
  setProcessing,
  setIsValidating,
  refreshProfile,
  refreshCredits,
}: UseMultipleAddressConsultationProps) => {
  const consultarDireccionesMultiples = useCallback(async () => {
    if (!validarConsultaCompuesta(direcciones, tipoPrefa, setError)) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      setIsValidating(true);
      const informesPreliminares = await validarDatosDirecciones(direcciones);

      validateLinderas(informesPreliminares);
      setIsValidating(false);

      setLoading(false);
      setProcessing(true);

      const resultadosNuevos = await procesarConsultasDirecciones(direcciones, tipoPrefa);
      setResultados(resultadosNuevos);
      await guardarEnHistorial(direcciones);
      await refreshProfile();
      refreshCredits();
    } catch (error) {
      setIsValidating(false);
      setProcessing(false);
      if (error instanceof Error && error.message === 'CONSULTA_EN_CURSO') {
        setResultados([]);
        setLoading(false);
        return;
      }
      setResultados([]);
      if (error instanceof Error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        manejarErrorConsulta(error, setError);
      }
    } finally {
      setLoading(false);
      setProcessing(false);
      setIsValidating(false);
    }
  }, [
    direcciones,
    tipoPrefa,
    refreshProfile,
    refreshCredits,
    setLoading,
    setError,
    setResultados,
    setProcessing,
    setIsValidating,
  ]);

  return { consultarDireccionesMultiples };
};

import { useCallback } from 'react';
import { toast } from 'react-toastify';

import { prefactibilidad } from '../services/api';
import { TIPO_PREFA, TipoPrefa } from '../types/consulta-direccion';
import { Informe } from '../types/enums';
import { manejarErrorConsulta, validarDireccionConNumero } from '../utils/consulta-direccion-utils';

interface UseMultipleAddressConsultationProps {
  direcciones: string[];
  tipoPrefa: TipoPrefa;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setResultados: (resultados: Informe[]) => void;
  refreshProfile: () => Promise<void>;
  refreshCredits: () => void;
}

const validarConsultaCompuesta = (
  direcciones: string[],
  tipoPrefa: TipoPrefa,
  setError: (error: string | null) => void
): boolean => {
  if (direcciones.length === 0) return false;

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
    const err = error as { response?: { status?: number; data?: { status?: string } } };
    if (err.response?.data?.status === 'in_progress') {
      toast.info('Ya tienes una consulta en curso. Espera a que finalice.');
      throw new Error('CONSULTA_EN_CURSO');
    }
    throw error;
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
      const resultadosNuevos = await procesarConsultasDirecciones(direcciones, tipoPrefa);
      setResultados(resultadosNuevos);
      await guardarEnHistorial(direcciones);
      await refreshProfile();
      refreshCredits();
    } catch (error) {
      if (error instanceof Error && error.message === 'CONSULTA_EN_CURSO') {
        setResultados([]);
        setLoading(false);
        return;
      }
      setResultados([]);
      manejarErrorConsulta(error, setError);
    } finally {
      setLoading(false);
    }
  }, [direcciones, tipoPrefa, refreshProfile, refreshCredits, setLoading, setError, setResultados]);

  return { consultarDireccionesMultiples };
};

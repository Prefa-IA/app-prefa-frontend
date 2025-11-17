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
    if (direcciones.length === 0) return;

    const direccionesSinNumero = direcciones.filter((dir) => !validarDireccionConNumero(dir));
    if (direccionesSinNumero.length > 0) {
      setError(
        `Las siguientes direcciones deben incluir un número (altura): ${direccionesSinNumero.join(', ')}`
      );
      return;
    }

    setLoading(true);
    setError('');

    try {
      const resultadosNuevos: Informe[] = [];

      for (const dir of direcciones) {
        const respuesta = await prefactibilidad.consultarDireccion(dir, {
          prefaCompleta: tipoPrefa === TIPO_PREFA.COMPLETA,
          compuesta: true,
        });

        if ('inProgress' in respuesta && respuesta.inProgress) {
          toast.info('Ya tienes una consulta en curso. Espera a que finalice.');
          setLoading(false);
          return;
        }

        resultadosNuevos.push(respuesta);
      }

      setResultados(resultadosNuevos);
      try {
        const { addAddressToHistory } = await import('../services/address-history');
        await Promise.all(direcciones.map((d) => addAddressToHistory(d)));
      } catch {}
      await refreshProfile();
      refreshCredits();
    } catch (error) {
      manejarErrorConsulta(error, setError);
    } finally {
      setLoading(false);
    }
  }, [direcciones, tipoPrefa, refreshProfile, refreshCredits, setLoading, setError, setResultados]);

  return { consultarDireccionesMultiples };
};

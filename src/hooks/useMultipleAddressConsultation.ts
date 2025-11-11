import { useCallback } from 'react';
import { prefactibilidad } from '../services/api';
import { Informe } from '../types/enums';
import { TipoPrefa } from '../types/consultaDireccion';
import { manejarErrorConsulta } from '../utils/consultaDireccionUtils';
import { toast } from 'react-toastify';

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
  refreshCredits
}: UseMultipleAddressConsultationProps) => {
  const consultarDireccionesMultiples = useCallback(async () => {
    if (direcciones.length === 0) return;
    
    setLoading(true);
    setError('');
    
    try {
      const resultadosNuevos: Informe[] = [];
      
      for (const dir of direcciones) {
        const respuesta = await prefactibilidad.consultarDireccion(dir, {
          prefaCompleta: tipoPrefa === 'prefa2',
          compuesta: true
        });
        
        if ((respuesta as any).inProgress) {
          toast.info('Ya tienes una consulta en curso. Espera a que finalice.');
          setLoading(false);
          return;
        }
        
        resultadosNuevos.push(respuesta);
      }
      
      setResultados(resultadosNuevos);
      try {
        const { addAddressToHistory } = await import('../services/addressHistory');
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


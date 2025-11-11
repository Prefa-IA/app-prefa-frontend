import { useCallback } from 'react';
import { prefactibilidad } from '../services/api';
import { Informe } from '../types/enums';
import { TipoPrefa } from '../types/consultaDireccion';
import { confirmarToast } from '../utils/consultaDireccionUtils';
import { manejarErrorGuardado } from '../utils/consultaDireccionUtils';
import { toast } from 'react-toastify';

interface UseReportAcceptanceProps {
  resultado: Informe | null;
  tipoPrefa: TipoPrefa;
  setError: (error: string | null) => void;
  setSavedId: (id: string | null) => void;
  solicitarValorUva: (valorDefault: number) => Promise<number | null>;
}

export const useReportAcceptance = ({
  resultado,
  tipoPrefa,
  setError,
  setSavedId,
  solicitarValorUva
}: UseReportAcceptanceProps) => {
  const handleAcceptReport = useCallback(async (): Promise<boolean> => {
    if (!resultado) return false;

    try {
      const smp = resultado?.datosCatastrales?.smp;
      if (smp) {
        const { exists } = await prefactibilidad.existeInforme(smp, tipoPrefa);
        if (exists) {
          const confirmar = await confirmarToast(
            'Esta prefactibilidad ya existe en tus informes. Si continúas, se sobrescribirá la anterior.'
          );
          if (!confirmar) return false;
        }
      }

      const defaultUva = resultado?.edificabilidad?.plusvalia?.incidencia_uva || 0;
      const uvaPersonalizado = await solicitarValorUva(defaultUva);
      if (uvaPersonalizado === null) return false;

      const informeConUva: Informe = {
        ...resultado,
        tipoPrefa,
        edificabilidad: {
          ...resultado.edificabilidad,
          plusvalia: {
            ...resultado.edificabilidad.plusvalia,
            uvaOriginal: defaultUva,
            uvaPersonalizado
          }
        }
      } as Informe;

      const loadingId = toast.loading('Guardando informe...');
      const response = await prefactibilidad.aceptarInforme(informeConUva);
      toast.dismiss(loadingId);

      if (response.success) {
        toast.success(response.message || 'Informe guardado exitosamente');
        if (response.informe?._id) setSavedId(response.informe._id);
        return true;
      } else {
        toast.error('Error al guardar el informe');
        setError('Error al guardar el informe');
        return false;
      }
    } catch (err) {
      manejarErrorGuardado(err, setError);
      return false;
    }
  }, [resultado, tipoPrefa, solicitarValorUva, setError, setSavedId]);

  return { handleAcceptReport };
};


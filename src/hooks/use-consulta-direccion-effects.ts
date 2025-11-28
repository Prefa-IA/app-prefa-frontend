import { useEffect } from 'react';
import { toast } from 'react-toastify';

import { Informe } from '../types/enums';

interface UseConsultaDireccionEffectsProps {
  modoCompuesto: boolean;
  resultados: Informe[];
  direcciones: string[];
  consolidarInformes: () => Promise<void>;
  error: string | null;
  setError: (error: string | null) => void;
}

export const useConsultaDireccionEffects = ({
  modoCompuesto,
  resultados,
  direcciones,
  consolidarInformes,
  error,
  setError,
}: UseConsultaDireccionEffectsProps) => {
  useEffect(() => {
    if (modoCompuesto && resultados.length > 0 && resultados.length === direcciones.length) {
      void consolidarInformes();
    }
  }, [resultados, direcciones, modoCompuesto, consolidarInformes]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }
  }, [error, setError]);
};

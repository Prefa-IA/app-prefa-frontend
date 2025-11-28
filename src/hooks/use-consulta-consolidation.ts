import { useCallback } from 'react';

import { Informe, InformeCompuesto } from '../types/enums';
import { consolidarInformesCompuestos } from '../utils/report-utils';

export interface UseConsultaConsolidationProps {
  modoCompuesto: boolean;
  resultados: Informe[];
  direcciones: string[];
  setInformeCompuesto: React.Dispatch<React.SetStateAction<InformeCompuesto | null>>;
  setResultado: React.Dispatch<React.SetStateAction<Informe | null>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setResultados: React.Dispatch<React.SetStateAction<Informe[]>>;
}

export const useConsultaConsolidation = ({
  modoCompuesto,
  resultados,
  direcciones,
  setInformeCompuesto,
  setResultado,
  setError,
  setResultados,
}: UseConsultaConsolidationProps) => {
  const consolidarInformes = useCallback(async () => {
    if (!modoCompuesto || resultados.length === 0) return;
    consolidarInformesCompuestos(
      direcciones,
      resultados,
      setInformeCompuesto,
      setResultado,
      setError,
      setResultados
    );
  }, [
    modoCompuesto,
    resultados,
    direcciones,
    setInformeCompuesto,
    setResultado,
    setError,
    setResultados,
  ]);

  return { consolidarInformes };
};

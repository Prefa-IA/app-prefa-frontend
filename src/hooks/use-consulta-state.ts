import { useCallback } from 'react';

import { TipoPrefa } from '../types/consulta-direccion';
import { Informe, InformeCompuesto } from '../types/enums';

export interface UseConsultaStateReturn {
  toggleModoCompuesto: () => void;
  resetConsulta: () => void;
  handleTipoPrefaChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleClearClick: () => void;
}

export interface UseConsultaStateProps {
  resultado: Informe | null;
  resultados: Informe[];
  informeCompuesto: InformeCompuesto | null;
  setModoCompuesto: React.Dispatch<React.SetStateAction<boolean>>;
  setDirecciones: React.Dispatch<React.SetStateAction<string[]>>;
  setResultados: React.Dispatch<React.SetStateAction<Informe[]>>;
  setInformeCompuesto: React.Dispatch<React.SetStateAction<InformeCompuesto | null>>;
  setResultado: React.Dispatch<React.SetStateAction<Informe | null>>;
  setSavedId: React.Dispatch<React.SetStateAction<string | null>>;
  setTipoPrefa: React.Dispatch<React.SetStateAction<TipoPrefa>>;
  setConfirmReset: React.Dispatch<React.SetStateAction<boolean>>;
}

// PENDIENTE PREFACTIBILIDADES COMPUESTAS
export const useConsultaState = ({
  resultado,
  resultados,
  informeCompuesto: _informeCompuesto,
  setModoCompuesto,
  setDirecciones,
  setResultados,
  setInformeCompuesto,
  setResultado,
  setSavedId,
  setTipoPrefa,
  setConfirmReset,
}: UseConsultaStateProps): UseConsultaStateReturn => {
  const toggleModoCompuesto = useCallback(() => {
    // Prefactibilidades compuestas deshabilitadas temporalmente
    // Solo permitir desactivar si ya está activo
    setModoCompuesto((prevModo) => {
      if (prevModo) {
        // Permitir desactivar
        setDirecciones([]);
        setResultados([]);
        setInformeCompuesto(null);
        return false;
      }
      // No permitir activar - mantener desactivado
      return false;
    });
  }, [setModoCompuesto, setDirecciones, setResultados, setInformeCompuesto]);

  const resetConsulta = useCallback(() => {
    setResultado(null);
    setInformeCompuesto(null);
    setResultados([]);
    setDirecciones([]);
    setSavedId(null);
    setTipoPrefa('');
    setModoCompuesto(false);
  }, [
    setResultado,
    setInformeCompuesto,
    setResultados,
    setDirecciones,
    setSavedId,
    setTipoPrefa,
    setModoCompuesto,
  ]);

  const handleTipoPrefaChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (resultado || resultados.length > 0) return;
      setTipoPrefa(e.target.value as TipoPrefa);
    },
    [resultado, resultados, setTipoPrefa]
  );

  const handleClearClick = useCallback(() => {
    setConfirmReset(true);
  }, [setConfirmReset]);

  return {
    toggleModoCompuesto,
    resetConsulta,
    handleTipoPrefaChange,
    handleClearClick,
  };
};

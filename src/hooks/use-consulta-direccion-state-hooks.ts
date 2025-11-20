import React from 'react';

import { TipoPrefa } from '../types/consulta-direccion';
import { Informe, InformeCompuesto, Usuario } from '../types/enums';

import { useConsultaDireccionStateHooksPart1 } from './use-consulta-direccion-state-hooks-part1';
import { useConsultaDireccionStateHooksPart2 } from './use-consulta-direccion-state-hooks-part2';

interface UseConsultaDireccionStateHooksProps {
  direcciones: string[];
  resultados: Informe[];
  modoCompuesto: boolean;
  tipoPrefa: TipoPrefa;
  direccion: string;
  usuario: Usuario | null;
  setDireccion: (direccion: string) => void;
  setCenter: (center: { lat: number; lng: number }) => void;
  setLoading: (loading: boolean) => void;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setResultado: React.Dispatch<React.SetStateAction<Informe | null>>;
  setResultados: React.Dispatch<React.SetStateAction<Informe[]>>;
  setProcessing: (processing: boolean) => void;
  setDirecciones: React.Dispatch<React.SetStateAction<string[]>>;
  refreshProfile: () => Promise<void>;
  refreshCredits: () => void;
  savedId: string | null;
  resultado: Informe | null;
  setSavedId: React.Dispatch<React.SetStateAction<string | null>>;
  informeCompuesto: InformeCompuesto | null;
  setInformeCompuesto: React.Dispatch<React.SetStateAction<InformeCompuesto | null>>;
  setModoCompuesto: React.Dispatch<React.SetStateAction<boolean>>;
  setTipoPrefa: React.Dispatch<React.SetStateAction<TipoPrefa>>;
  setConfirmReset: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
}

export const useConsultaDireccionStateHooks = (props: UseConsultaDireccionStateHooksProps) => {
  const part1 = useConsultaDireccionStateHooksPart1({
    direcciones: props.direcciones,
    resultados: props.resultados,
    modoCompuesto: props.modoCompuesto,
    tipoPrefa: props.tipoPrefa,
    direccion: props.direccion,
    usuario: props.usuario,
    setDireccion: props.setDireccion,
    setCenter: props.setCenter,
    setLoading: props.setLoading,
    setError: props.setError,
    setResultado: props.setResultado,
    setResultados: props.setResultados,
    setProcessing: props.setProcessing,
    setDirecciones: props.setDirecciones,
    refreshProfile: props.refreshProfile,
    refreshCredits: props.refreshCredits,
    setInformeCompuesto: props.setInformeCompuesto,
  });

  const part2 = useConsultaDireccionStateHooksPart2({
    direccion: props.direccion,
    tipoPrefa: props.tipoPrefa,
    modoCompuesto: props.modoCompuesto,
    usuario: props.usuario,
    setLoading: props.setLoading,
    setError: props.setError,
    setResultado: props.setResultado,
    setCenter: props.setCenter,
    setProcessing: props.setProcessing,
    refreshProfile: props.refreshProfile,
    refreshCredits: props.refreshCredits,
    savedId: props.savedId,
    resultado: props.resultado,
    setSavedId: props.setSavedId,
    resultados: props.resultados,
    informeCompuesto: props.informeCompuesto,
    setModoCompuesto: props.setModoCompuesto,
    setDirecciones: props.setDirecciones,
    setResultados: props.setResultados,
    setInformeCompuesto: props.setInformeCompuesto,
    setTipoPrefa: props.setTipoPrefa,
    setConfirmReset: props.setConfirmReset,
    error: props.error,
    agregarDireccion: part1.agregarDireccion,
    procesarCalculoPrefactibilidad: part1.procesarCalculoPrefactibilidad,
    consolidarInformes: part1.consolidarInformes,
  });

  return {
    sugerencias: part1.sugerencias,
    buscandoSugerencias: part1.buscandoSugerencias,
    obtenerSugerencias: part1.obtenerSugerencias,
    seleccionarSugerencia: part1.seleccionarSugerencia,
    agregarDireccion: part1.agregarDireccion,
    eliminarDireccion: part1.eliminarDireccion,
    consultarDireccionesMultiples: part1.consultarDireccionesMultiples,
    handleSearch: part2.handleSearch,
    handleGenerateReport: part2.handleGenerateReport,
    toggleModoCompuesto: part2.toggleModoCompuesto,
    resetConsulta: part2.resetConsulta,
    handleTipoPrefaChange: part2.handleTipoPrefaChange,
    handleClearClick: part2.handleClearClick,
  };
};

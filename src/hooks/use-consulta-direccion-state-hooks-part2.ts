import React from 'react';

import { TipoPrefa } from '../types/consulta-direccion';
import { Informe, InformeCompuesto, Usuario } from '../types/enums';

import { useAutoSaveReport } from './use-auto-save-report';
import { useConsultaDireccionEffects } from './use-consulta-direccion-effects';
import { useConsultaState } from './use-consulta-state';
import { useReportGeneration } from './use-report-generation';
import { useSingleAddressConsultation } from './use-single-address-consultation';

interface UseConsultaDireccionStateHooksPart2Props {
  direccion: string;
  tipoPrefa: TipoPrefa;
  modoCompuesto: boolean;
  usuario: Usuario | null;
  setLoading: (loading: boolean) => void;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setResultado: React.Dispatch<React.SetStateAction<Informe | null>>;
  setCenter: (center: { lat: number; lng: number }) => void;
  processing: boolean;
  setProcessing: (processing: boolean) => void;
  setIsValidating: (isValidating: boolean) => void;
  refreshProfile: () => Promise<void>;
  refreshCredits: () => void;
  savedId: string | null;
  resultado: Informe | null;
  setSavedId: React.Dispatch<React.SetStateAction<string | null>>;
  direcciones: string[];
  resultados: Informe[];
  informeCompuesto: InformeCompuesto | null;
  setModoCompuesto: React.Dispatch<React.SetStateAction<boolean>>;
  setDirecciones: React.Dispatch<React.SetStateAction<string[]>>;
  setResultados: React.Dispatch<React.SetStateAction<Informe[]>>;
  setInformeCompuesto: React.Dispatch<React.SetStateAction<InformeCompuesto | null>>;
  setTipoPrefa: React.Dispatch<React.SetStateAction<TipoPrefa>>;
  setConfirmReset: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  agregarDireccion: (direccion: string) => void;
  procesarCalculoPrefactibilidad: (
    informe: Informe,
    tipoPrefa: TipoPrefa,
    informeCompuesto?: InformeCompuesto
  ) => Promise<void>;
  consolidarInformes: () => Promise<void>;
}

export const useConsultaDireccionStateHooksPart2 = (
  props: UseConsultaDireccionStateHooksPart2Props
) => {
  const { procesarCalculoPrefactibilidad, tipoPrefa, informeCompuesto } = props;

  const procesarCalculoPrefactibilidadWrapper = React.useCallback(
    async (datosParcela: { smp?: string; direccion?: string; [key: string]: unknown }) => {
      const informe = datosParcela as unknown as Informe;
      await procesarCalculoPrefactibilidad(informe, tipoPrefa, informeCompuesto ?? undefined);
    },
    [procesarCalculoPrefactibilidad, tipoPrefa, informeCompuesto]
  );

  const { handleSearch, clearLastSearched } = useSingleAddressConsultation({
    usuario: props.usuario,
    direccion: props.direccion,
    tipoPrefa: props.tipoPrefa,
    modoCompuesto: props.modoCompuesto,
    setLoading: props.setLoading,
    setError: props.setError,
    setResultado: props.setResultado,
    setCenter: props.setCenter,
    setProcessing: props.setProcessing,
    setIsValidating: props.setIsValidating,
    agregarDireccion: props.agregarDireccion,
    procesarCalculoPrefactibilidad: procesarCalculoPrefactibilidadWrapper,
    refreshProfile: async () => await props.refreshProfile(),
    refreshCredits: () => void props.refreshCredits(),
  });

  const { handleGenerateReport } = useReportGeneration({
    savedId: props.savedId,
    resultado: props.resultado,
    setError: props.setError,
    tipoPrefa: props.tipoPrefa,
    setSavedId: props.setSavedId,
  });

  useAutoSaveReport({
    resultado: props.resultado,
    tipoPrefa: props.tipoPrefa,
    processing: props.processing,
    setError: props.setError,
    setSavedId: props.setSavedId,
  });

  const {
    toggleModoCompuesto,
    resetConsulta: baseResetConsulta,
    handleTipoPrefaChange,
    handleClearClick,
  } = useConsultaState({
    resultado: props.resultado,
    resultados: props.resultados,
    informeCompuesto: props.informeCompuesto,
    setModoCompuesto: props.setModoCompuesto,
    setDirecciones: props.setDirecciones,
    setResultados: props.setResultados,
    setInformeCompuesto: props.setInformeCompuesto,
    setResultado: props.setResultado,
    setSavedId: props.setSavedId,
    setTipoPrefa: props.setTipoPrefa,
    setConfirmReset: props.setConfirmReset,
  });

  const resetConsulta = React.useCallback(() => {
    baseResetConsulta();
    clearLastSearched();
  }, [baseResetConsulta, clearLastSearched]);

  useConsultaDireccionEffects({
    modoCompuesto: props.modoCompuesto,
    resultados: props.resultados,
    direcciones: props.direcciones,
    consolidarInformes: props.consolidarInformes,
    error: props.error,
    setError: props.setError,
  });

  return {
    handleSearch,
    handleGenerateReport,
    toggleModoCompuesto,
    resetConsulta,
    handleTipoPrefaChange,
    handleClearClick,
  };
};

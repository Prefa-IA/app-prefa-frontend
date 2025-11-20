import React from 'react';

import { TipoPrefa } from '../types/consulta-direccion';
import { Informe, InformeCompuesto, Usuario } from '../types/enums';

import { useAddressManagement } from './use-address-management';
import { useConsultaConsolidation } from './use-consulta-consolidation';
import { useDireccionSugerencias } from './use-direccion-sugerencias';
import { useMultipleAddressConsultation } from './use-multiple-address-consultation';
import { useProcessingCalculation } from './use-processing-calculation';

interface UseConsultaDireccionStateHooksPart1Props {
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
  setInformeCompuesto: React.Dispatch<React.SetStateAction<InformeCompuesto | null>>;
}

export const useConsultaDireccionStateHooksPart1 = (
  props: UseConsultaDireccionStateHooksPart1Props
) => {
  const { procesarCalculoPrefactibilidad } = useProcessingCalculation({
    setResultado: props.setResultado,
    setProcessing: props.setProcessing,
  });

  const { agregarDireccion, eliminarDireccion } = useAddressManagement({
    direcciones: props.direcciones,
    resultados: props.resultados,
    setDirecciones: props.setDirecciones,
    setResultados: props.setResultados,
  });

  const { sugerencias, buscandoSugerencias, obtenerSugerencias, seleccionarSugerencia } =
    useDireccionSugerencias(
      props.setDireccion,
      props.setCenter,
      props.modoCompuesto,
      agregarDireccion,
      4,
      props.setError
    );

  const { consultarDireccionesMultiples } = useMultipleAddressConsultation({
    direcciones: props.direcciones,
    tipoPrefa: props.tipoPrefa,
    setLoading: props.setLoading,
    setError: props.setError,
    setResultados: props.setResultados,
    refreshProfile: async () => {
      await props.refreshProfile();
    },
    refreshCredits: () => {
      void props.refreshCredits();
    },
  });

  const { consolidarInformes } = useConsultaConsolidation({
    modoCompuesto: props.modoCompuesto,
    resultados: props.resultados,
    direcciones: props.direcciones,
    setInformeCompuesto: props.setInformeCompuesto,
    setResultado: props.setResultado,
    setError: props.setError,
  });

  return {
    procesarCalculoPrefactibilidad,
    agregarDireccion,
    eliminarDireccion,
    sugerencias,
    buscandoSugerencias,
    obtenerSugerencias,
    seleccionarSugerencia,
    consultarDireccionesMultiples,
    consolidarInformes,
  };
};

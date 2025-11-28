import React from 'react';

import { TipoPrefa } from '../../types/consulta-direccion';
import { Informe } from '../../types/enums';

interface ConsultaDireccionContentProps {
  className?: string;
  loading: boolean;
  resultado: unknown;
  direccion: string;
  setDireccion: (value: string) => void;
  center: { lat: number; lng: number };
  savedId: string | null;
  modoCompuesto: boolean;
  direcciones: string[];
  resultados: Informe[];
  informeCompuesto: unknown;
  tipoPrefa: TipoPrefa;
  showTipoInfo: boolean;
  setShowTipoInfo: (show: boolean) => void;
  processing: boolean;
  isValidating: boolean;
  confirmReset: boolean;
  setConfirmReset: (show: boolean) => void;
  isDisabled: boolean;
  sugerencias: Array<{ direccion: string; coordenadas: { lat: number; lng: number } }>;
  buscandoSugerencias: boolean;
  obtenerSugerencias: (value: string) => Promise<void>;
  seleccionarSugerencia: (direccion: string) => Promise<void>;
  agregarDireccion: (direccion: string) => void;
  eliminarDireccion: (index: number) => void;
  consultarDireccionesMultiples: () => Promise<void>;
  handleSearch: () => Promise<void>;
  handleGenerateReport: () => Promise<void>;
  toggleModoCompuesto: () => void;
  resetConsulta: () => void;
  handleTipoPrefaChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleClearClick: () => void;
  navigate: (href: string) => void;
  navConfirm: { show: boolean; href: string | null };
  setNavConfirm: (nav: { show: boolean; href: string | null }) => void;
  processingCounter: number;
}

const mapStateToProps = (
  state: Record<string, unknown>,
  className?: string | undefined,
  navConfirm?: { show: boolean; href: string | null },
  setNavConfirm?: (nav: { show: boolean; href: string | null }) => void,
  processingCounter?: number
): ConsultaDireccionContentProps => {
  const classNameValue = className ?? (state['className'] as string | undefined);
  return {
    ...(classNameValue !== undefined && { className: classNameValue }),
    loading: state['loading'] as boolean,
    resultado: state['resultado'],
    direccion: state['direccion'] as string,
    setDireccion: state['setDireccion'] as (value: string) => void,
    center: state['center'] as { lat: number; lng: number },
    savedId: state['savedId'] as string | null,
    modoCompuesto: state['modoCompuesto'] as boolean,
    direcciones: state['direcciones'] as string[],
    resultados: state['resultados'] as Informe[],
    informeCompuesto: state['informeCompuesto'],
    tipoPrefa: state['tipoPrefa'] as TipoPrefa,
    showTipoInfo: state['showTipoInfo'] as boolean,
    setShowTipoInfo: state['setShowTipoInfo'] as (show: boolean) => void,
    processing: state['processing'] as boolean,
    isValidating: (state['isValidating'] as boolean) ?? false,
    confirmReset: state['confirmReset'] as boolean,
    setConfirmReset: state['setConfirmReset'] as (show: boolean) => void,
    isDisabled: state['isDisabled'] as boolean,
    sugerencias: state['sugerencias'] as Array<{
      direccion: string;
      coordenadas: { lat: number; lng: number };
    }>,
    buscandoSugerencias: state['buscandoSugerencias'] as boolean,
    obtenerSugerencias: state['obtenerSugerencias'] as (value: string) => Promise<void>,
    seleccionarSugerencia: state['seleccionarSugerencia'] as (direccion: string) => Promise<void>,
    agregarDireccion: state['agregarDireccion'] as (direccion: string) => void,
    eliminarDireccion: state['eliminarDireccion'] as (index: number) => void,
    consultarDireccionesMultiples: state['consultarDireccionesMultiples'] as () => Promise<void>,
    handleSearch: state['handleSearch'] as () => Promise<void>,
    handleGenerateReport: state['handleGenerateReport'] as () => Promise<void>,
    toggleModoCompuesto: state['toggleModoCompuesto'] as () => void,
    resetConsulta: state['resetConsulta'] as () => void,
    handleTipoPrefaChange: state['handleTipoPrefaChange'] as (
      e: React.ChangeEvent<HTMLSelectElement>
    ) => void,
    handleClearClick: state['handleClearClick'] as () => void,
    navigate: state['navigate'] as (href: string) => void,
    navConfirm: navConfirm ?? { show: false, href: null },
    setNavConfirm: setNavConfirm ?? (() => {}),
    processingCounter: processingCounter ?? 0,
  };
};

export const mapConsultaDireccionProps = (
  props: ConsultaDireccionContentProps | Record<string, unknown>,
  className?: string | undefined,
  navConfirm?: { show: boolean; href: string | null },
  setNavConfirm?: (nav: { show: boolean; href: string | null }) => void,
  processingCounter?: number
): ConsultaDireccionContentProps => {
  if (
    className !== undefined ||
    navConfirm !== undefined ||
    setNavConfirm !== undefined ||
    processingCounter !== undefined
  ) {
    const state = props as Record<string, unknown>;
    return mapStateToProps(state, className, navConfirm, setNavConfirm, processingCounter);
  }
  const typedProps = props as ConsultaDireccionContentProps;
  return {
    ...(typedProps.className !== undefined && { className: typedProps.className }),
    loading: typedProps.loading,
    resultado: typedProps.resultado,
    direccion: typedProps.direccion,
    setDireccion: typedProps.setDireccion,
    center: typedProps.center,
    savedId: typedProps.savedId,
    modoCompuesto: typedProps.modoCompuesto,
    direcciones: typedProps.direcciones,
    resultados: typedProps.resultados,
    informeCompuesto: typedProps.informeCompuesto,
    tipoPrefa: typedProps.tipoPrefa,
    showTipoInfo: typedProps.showTipoInfo,
    setShowTipoInfo: typedProps.setShowTipoInfo,
    processing: typedProps.processing,
    confirmReset: typedProps.confirmReset,
    setConfirmReset: typedProps.setConfirmReset,
    isDisabled: typedProps.isDisabled,
    sugerencias: typedProps.sugerencias,
    buscandoSugerencias: typedProps.buscandoSugerencias,
    obtenerSugerencias: typedProps.obtenerSugerencias,
    seleccionarSugerencia: typedProps.seleccionarSugerencia,
    agregarDireccion: typedProps.agregarDireccion,
    eliminarDireccion: typedProps.eliminarDireccion,
    consultarDireccionesMultiples: typedProps.consultarDireccionesMultiples,
    handleSearch: typedProps.handleSearch,
    handleGenerateReport: typedProps.handleGenerateReport,
    toggleModoCompuesto: typedProps.toggleModoCompuesto,
    resetConsulta: typedProps.resetConsulta,
    handleTipoPrefaChange: typedProps.handleTipoPrefaChange,
    handleClearClick: typedProps.handleClearClick,
    navigate: typedProps.navigate,
    navConfirm: typedProps.navConfirm,
    setNavConfirm: typedProps.setNavConfirm,
    processingCounter: typedProps.processingCounter,
    isValidating: typedProps.isValidating,
  };
};

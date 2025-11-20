import React from 'react';

import { TipoPrefa } from '../../types/consulta-direccion';
import { Informe } from '../../types/enums';

import ConsultaMainContent from './ConsultaMainContent';
import ConsultaModalsContent from './ConsultaModalsContent';
import ConsultaReportContent from './ConsultaReportContent';
import ProcessingOverlay from './ProcessingOverlay';

interface ConsultaDireccionContentWrapperProps {
  className?: string | undefined;
  mainContentProps: {
    direccion: string;
    setDireccion: (value: string) => void;
    center: { lat: number; lng: number };
    modoCompuesto: boolean;
    direcciones: string[];
    resultados: Informe[];
    loading: boolean;
    buscandoSugerencias: boolean;
    sugerencias: Array<{ direccion: string; coordenadas: { lat: number; lng: number } }>;
    obtenerSugerencias: (value: string) => Promise<void>;
    seleccionarSugerencia: (direccion: string) => Promise<void>;
    agregarDireccion: (direccion: string) => void;
    eliminarDireccion: (index: number) => void;
    consultarDireccionesMultiples: () => Promise<void>;
    handleTipoPrefaChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    tipoPrefa: TipoPrefa;
    setShowTipoInfo: (show: boolean) => void;
    isDisabled: boolean;
    resultado: unknown;
    handleClearClick: () => void;
    handleSearch: () => Promise<void>;
    toggleModoCompuesto: () => void;
    showTipoInfo: boolean;
  };
  reportContentProps: {
    resultado: unknown;
    informeCompuesto: unknown;
    modoCompuesto: boolean;
    direcciones: string[];
    loading: boolean;
    center: { lat: number; lng: number };
    handleGenerateReport: () => Promise<void>;
    savedId: string | null;
    tipoPrefa: TipoPrefa;
  };
  modalsContentProps: {
    confirmReset: boolean;
    setConfirmReset: (show: boolean) => void;
    navConfirm: { show: boolean; href: string | null };
    setNavConfirm: (nav: { show: boolean; href: string | null }) => void;
    resetConsulta: () => void;
    navigate: (href: string) => void;
  };
  processing: boolean;
  processingCounter: number;
}

const ConsultaDireccionContentWrapper: React.FC<ConsultaDireccionContentWrapperProps> = ({
  className,
  mainContentProps,
  reportContentProps,
  modalsContentProps,
  processing,
  processingCounter,
}) => (
  <div className={`flex flex-col items-center justify-center w-full ${className || ''}`}>
    <ConsultaMainContent {...mainContentProps} />
    <ConsultaReportContent {...reportContentProps} />
    {processing && <ProcessingOverlay seconds={processingCounter} />}
    <ConsultaModalsContent {...modalsContentProps} />
  </div>
);

export default ConsultaDireccionContentWrapper;

import React from 'react';

import { TipoPrefa } from '../../types/consulta-direccion';
import { Informe } from '../../types/enums';
import ComingSoonAlert from '../generales/ComingSoonAlert';

import ConsultaMainContent from './ConsultaMainContent';
import ConsultaModalsContent from './ConsultaModalsContent';
import ConsultaReportContent from './ConsultaReportContent';
import { CreditCostsBox } from './index';
import ProcessingOverlay from './ProcessingOverlay';
import ValidatingOverlay from './ValidatingOverlay';

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
  isValidating: boolean;
}

const ConsultaDireccionContentWrapper: React.FC<ConsultaDireccionContentWrapperProps> = ({
  className,
  mainContentProps,
  reportContentProps,
  modalsContentProps,
  processing,
  processingCounter,
  isValidating,
}) => (
  <div className={`flex flex-col w-full items-center ${className || ''}`}>
    <ComingSoonAlert />
    <div className="w-full flex justify-center items-start mt-8">
      <div className="w-full max-w-6xl">
        <CreditCostsBox />
      </div>
    </div>
    <div className="w-full flex justify-center items-start">
      <ConsultaMainContent {...mainContentProps} />
    </div>
    <div className="w-full order-3">
      <ConsultaReportContent {...reportContentProps} />
    </div>
    {isValidating && <ValidatingOverlay />}
    {processing && <ProcessingOverlay seconds={processingCounter} />}
    <ConsultaModalsContent {...modalsContentProps} />
  </div>
);

export default ConsultaDireccionContentWrapper;

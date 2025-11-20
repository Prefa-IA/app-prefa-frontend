import React from 'react';

import { TipoPrefa } from '../../types/consulta-direccion';
import { Informe } from '../../types/enums';

import ConsultaDireccionContentBody, {
  ConsultaDireccionContentBodyProps,
} from './ConsultaDireccionContentBody';

interface ConsultaDireccionContentProps {
  className?: string | undefined;
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

const ConsultaDireccionContent: React.FC<ConsultaDireccionContentProps> = ({
  className,
  loading,
  resultado,
  direccion,
  setDireccion,
  center,
  savedId,
  modoCompuesto,
  direcciones,
  resultados,
  informeCompuesto,
  tipoPrefa,
  showTipoInfo,
  setShowTipoInfo,
  processing,
  confirmReset,
  setConfirmReset,
  isDisabled,
  sugerencias,
  buscandoSugerencias,
  obtenerSugerencias,
  seleccionarSugerencia,
  agregarDireccion,
  eliminarDireccion,
  consultarDireccionesMultiples,
  handleSearch,
  handleGenerateReport,
  toggleModoCompuesto,
  resetConsulta,
  handleTipoPrefaChange,
  handleClearClick,
  navigate,
  navConfirm,
  setNavConfirm,
  processingCounter,
}) => {
  const propsToPass: Omit<ConsultaDireccionContentBodyProps, 'className'> & { className?: string } =
    {
      loading,
      resultado,
      direccion,
      setDireccion,
      center,
      savedId,
      modoCompuesto,
      direcciones,
      resultados,
      informeCompuesto,
      tipoPrefa,
      showTipoInfo,
      setShowTipoInfo,
      processing,
      confirmReset,
      setConfirmReset,
      isDisabled,
      sugerencias,
      buscandoSugerencias,
      obtenerSugerencias,
      seleccionarSugerencia,
      agregarDireccion,
      eliminarDireccion,
      consultarDireccionesMultiples,
      handleSearch,
      handleGenerateReport,
      toggleModoCompuesto,
      resetConsulta,
      handleTipoPrefaChange,
      handleClearClick,
      navigate,
      navConfirm,
      setNavConfirm,
      processingCounter,
    };

  if (className !== undefined) {
    propsToPass.className = className;
  }

  return <ConsultaDireccionContentBody {...propsToPass} />;
};

export default ConsultaDireccionContent;

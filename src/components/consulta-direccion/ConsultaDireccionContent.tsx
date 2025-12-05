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

const buildPropsToPass = (
  props: ConsultaDireccionContentProps
): Omit<ConsultaDireccionContentBodyProps, 'className'> & { className?: string } => ({
  loading: props.loading,
  resultado: props.resultado,
  direccion: props.direccion,
  setDireccion: props.setDireccion,
  center: props.center,
  savedId: props.savedId,
  modoCompuesto: props.modoCompuesto,
  direcciones: props.direcciones,
  resultados: props.resultados,
  informeCompuesto: props.informeCompuesto,
  tipoPrefa: props.tipoPrefa,
  showTipoInfo: props.showTipoInfo,
  setShowTipoInfo: props.setShowTipoInfo,
  processing: props.processing,
  isValidating: props.isValidating,
  confirmReset: props.confirmReset,
  setConfirmReset: props.setConfirmReset,
  isDisabled: props.isDisabled,
  sugerencias: props.sugerencias,
  buscandoSugerencias: props.buscandoSugerencias,
  obtenerSugerencias: props.obtenerSugerencias,
  seleccionarSugerencia: props.seleccionarSugerencia,
  agregarDireccion: props.agregarDireccion,
  eliminarDireccion: props.eliminarDireccion,
  consultarDireccionesMultiples: props.consultarDireccionesMultiples,
  handleSearch: props.handleSearch,
  handleGenerateReport: props.handleGenerateReport,
  toggleModoCompuesto: props.toggleModoCompuesto,
  resetConsulta: props.resetConsulta,
  handleTipoPrefaChange: props.handleTipoPrefaChange,
  handleClearClick: props.handleClearClick,
  navigate: props.navigate,
  navConfirm: props.navConfirm,
  setNavConfirm: props.setNavConfirm,
  processingCounter: props.processingCounter,
});

const ConsultaDireccionContent: React.FC<ConsultaDireccionContentProps> = (props) => {
  const propsToPass = buildPropsToPass(props);
  if (props.className !== undefined) {
    propsToPass.className = props.className;
  }
  return <ConsultaDireccionContentBody {...propsToPass} />;
};

export default ConsultaDireccionContent;

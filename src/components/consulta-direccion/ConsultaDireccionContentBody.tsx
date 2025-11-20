import React from 'react';

import { TipoPrefa } from '../../types/consulta-direccion';
import { Informe } from '../../types/enums';

import ConsultaDireccionContentWrapper from './ConsultaDireccionContentWrapper';
import {
  buildMainContentProps,
  buildModalsContentProps,
  buildReportContentProps,
} from './ConsultaDireccionPropsBuilders';
import { mapConsultaDireccionProps } from './ConsultaDireccionPropsMapper';

export interface ConsultaDireccionContentBodyProps {
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

const ConsultaDireccionContentBody: React.FC<ConsultaDireccionContentBodyProps> = (props) => {
  const allProps = mapConsultaDireccionProps(props);

  return (
    <ConsultaDireccionContentWrapper
      className={props.className}
      mainContentProps={buildMainContentProps(allProps)}
      reportContentProps={buildReportContentProps(allProps)}
      modalsContentProps={buildModalsContentProps(allProps)}
      processing={props.processing}
      processingCounter={props.processingCounter}
    />
  );
};

export default ConsultaDireccionContentBody;

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

export const buildMainContentProps = (props: ConsultaDireccionContentProps) => ({
  direccion: props.direccion,
  setDireccion: props.setDireccion,
  center: props.center,
  modoCompuesto: props.modoCompuesto,
  direcciones: props.direcciones,
  resultados: props.resultados,
  loading: props.loading,
  buscandoSugerencias: props.buscandoSugerencias,
  sugerencias: props.sugerencias,
  obtenerSugerencias: props.obtenerSugerencias,
  seleccionarSugerencia: props.seleccionarSugerencia,
  agregarDireccion: props.agregarDireccion,
  eliminarDireccion: props.eliminarDireccion,
  consultarDireccionesMultiples: props.consultarDireccionesMultiples,
  handleTipoPrefaChange: props.handleTipoPrefaChange,
  tipoPrefa: props.tipoPrefa,
  setShowTipoInfo: props.setShowTipoInfo,
  isDisabled: props.isDisabled,
  resultado: props.resultado,
  handleClearClick: props.handleClearClick,
  handleSearch: props.handleSearch,
  toggleModoCompuesto: props.toggleModoCompuesto,
  showTipoInfo: props.showTipoInfo,
});

export const buildReportContentProps = (props: ConsultaDireccionContentProps) => ({
  resultado: props.resultado,
  informeCompuesto: props.informeCompuesto,
  modoCompuesto: props.modoCompuesto,
  direcciones: props.direcciones,
  loading: props.loading,
  center: props.center,
  handleGenerateReport: props.handleGenerateReport,
  savedId: props.savedId,
  tipoPrefa: props.tipoPrefa,
});

export const buildModalsContentProps = (props: ConsultaDireccionContentProps) => ({
  confirmReset: props.confirmReset,
  setConfirmReset: props.setConfirmReset,
  navConfirm: props.navConfirm,
  setNavConfirm: props.setNavConfirm,
  resetConsulta: props.resetConsulta,
  navigate: props.navigate,
});

import React from 'react';

import { TipoPrefa } from '../../types/consulta-direccion';
import { Informe } from '../../types/enums';
import PrefaInfoModal from '../PrefaInfoModal';

import ConsultaContainer from './ConsultaContainer';
import ConsultaHeader from './ConsultaHeader';
import ConsultaMainSection from './ConsultaMainSection';

interface ConsultaMainContentProps {
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
}

const ConsultaMainContent: React.FC<ConsultaMainContentProps> = ({
  direccion,
  setDireccion,
  center,
  modoCompuesto,
  direcciones,
  resultados,
  loading,
  buscandoSugerencias,
  sugerencias,
  obtenerSugerencias,
  seleccionarSugerencia,
  agregarDireccion,
  eliminarDireccion,
  consultarDireccionesMultiples,
  handleTipoPrefaChange,
  tipoPrefa,
  setShowTipoInfo,
  isDisabled,
  resultado,
  handleClearClick,
  handleSearch,
  toggleModoCompuesto,
  showTipoInfo,
}) => (
  <ConsultaContainer data-tutorial="analisis-prefactibilidad">
    <ConsultaHeader />

    <ConsultaMainSection
      direccion={direccion}
      setDireccion={setDireccion}
      center={center}
      modoCompuesto={modoCompuesto}
      direcciones={direcciones}
      resultados={resultados}
      loading={loading}
      buscandoSugerencias={buscandoSugerencias}
      sugerencias={sugerencias}
      obtenerSugerencias={obtenerSugerencias}
      seleccionarSugerencia={async (direccion) => {
        await seleccionarSugerencia(direccion);
      }}
      agregarDireccion={agregarDireccion}
      eliminarDireccion={eliminarDireccion}
      consultarDireccionesMultiples={consultarDireccionesMultiples}
      onTipoPrefaChange={handleTipoPrefaChange}
      tipoPrefa={tipoPrefa}
      onShowTipoInfo={() => setShowTipoInfo(true)}
      isDisabled={isDisabled}
      hasResult={!!resultado || resultados.length > 0}
      onClear={handleClearClick}
      onSearch={() => {
        void handleSearch();
      }}
      onToggleModoCompuesto={() => {
        void toggleModoCompuesto();
      }}
    />

    {showTipoInfo && <PrefaInfoModal onClose={() => setShowTipoInfo(false)} />}
  </ConsultaContainer>
);

export default ConsultaMainContent;

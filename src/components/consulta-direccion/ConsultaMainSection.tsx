import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/solid';

import { TIPO_PREFA, TipoPrefa } from '../../types/consulta-direccion';
import { DireccionSugerida, Informe } from '../../types/enums';
import { Coordinates } from '../../utils/map-utils';

import CompoundModeToggle from './CompoundModeToggle';
import { AddressManagement, MapContainer, SearchSection } from './index';

const adaptSugerenciasToDireccionSugerida = (
  sugerencias: Array<{ direccion: string; coordenadas: Coordinates }>
): DireccionSugerida[] => {
  return sugerencias.map((sug) => ({
    direccion: sug.direccion,
    nombre_calle: sug.direccion.split(' ')[0] || sug.direccion,
    tipo: 'direccion',
  }));
};

const TipoPrefaSelector: React.FC<{
  tipoPrefa: TipoPrefa;
  onTipoPrefaChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onShowInfo: () => void;
  disabled: boolean;
}> = ({ tipoPrefa, onTipoPrefaChange, onShowInfo, disabled }) => (
  <div className="flex flex-col md:flex-row md:items-center md:space-x-2 mt-4 space-y-2 md:space-y-0">
    <label htmlFor="tipoPrefa" className="text-gray-900 dark:text-gray-100">
      Tipo de Prefactibilidad:
    </label>
    <select
      id="tipoPrefa"
      value={tipoPrefa}
      onChange={onTipoPrefaChange}
      className="border rounded px-2 py-1 pr-10 text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      disabled={disabled}
      required
    >
      <option value="">-- Seleccione un tipo --</option>
      <option value={TIPO_PREFA.SIMPLE}>Prefactibilidad Simple</option>
      <option value={TIPO_PREFA.COMPLETA}>Prefactibilidad Completa</option>
    </select>
    <button
      type="button"
      onClick={onShowInfo}
      title="Ver diferencias entre los tipos de prefactibilidad"
      className="text-blue-600 hover:text-blue-800"
    >
      <InformationCircleIcon className="h-5 w-5" />
    </button>
  </div>
);

interface ConsultaMainSectionProps {
  direccion: string;
  setDireccion: (value: string) => void;
  center: Coordinates;
  modoCompuesto: boolean;
  direcciones: string[];
  resultados: Informe[];
  loading: boolean;
  buscandoSugerencias: boolean;
  sugerencias: Array<{ direccion: string; coordenadas: Coordinates }>;
  obtenerSugerencias: (value: string) => Promise<void>;
  seleccionarSugerencia: (direccion: string) => Promise<void>;
  agregarDireccion: (direccion: string) => void;
  eliminarDireccion: (index: number) => void;
  consultarDireccionesMultiples: () => Promise<void>;
  onTipoPrefaChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  tipoPrefa: TipoPrefa;
  onShowTipoInfo: () => void;
  isDisabled: boolean;
  hasResult: boolean;
  onClear: () => void;
  onSearch: () => void;
  onToggleModoCompuesto: () => void;
}

const ConsultaMainSection: React.FC<ConsultaMainSectionProps> = ({
  direccion,
  setDireccion,
  center,
  modoCompuesto,
  direcciones,
  loading,
  buscandoSugerencias,
  sugerencias,
  obtenerSugerencias,
  seleccionarSugerencia,
  eliminarDireccion,
  consultarDireccionesMultiples,
  onTipoPrefaChange,
  tipoPrefa,
  onShowTipoInfo,
  isDisabled,
  hasResult,
  onClear,
  onSearch,
  onToggleModoCompuesto,
}) => (
  <>
    <CompoundModeToggle
      modoCompuesto={modoCompuesto}
      onToggle={onToggleModoCompuesto}
      disabled={isDisabled}
    />
    <SearchSection
      direccion={direccion}
      onDireccionChange={setDireccion}
      onSearch={onSearch}
      modoCompuesto={modoCompuesto}
      loading={loading || buscandoSugerencias}
      sugerencias={adaptSugerenciasToDireccionSugerida(sugerencias)}
      onInputChange={(value) => {
        void obtenerSugerencias(value);
      }}
      onSeleccionarSugerencia={(direccion) => {
        void seleccionarSugerencia(direccion);
      }}
      hasResult={hasResult}
      onClear={onClear}
      disabled={isDisabled}
    />
    <TipoPrefaSelector
      tipoPrefa={tipoPrefa}
      onTipoPrefaChange={onTipoPrefaChange}
      onShowInfo={onShowTipoInfo}
      disabled={isDisabled}
    />
    <MapContainer center={center} showMarker={hasResult} />
    <AddressManagement
      modoCompuesto={modoCompuesto}
      direcciones={direcciones}
      onEliminarDireccion={eliminarDireccion}
      onConsultarDirecciones={() => {
        void consultarDireccionesMultiples();
      }}
      loading={loading}
    />
  </>
);

export default ConsultaMainSection;

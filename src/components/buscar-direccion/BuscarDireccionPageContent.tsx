import React from 'react';

import { BasicInformationProps, DireccionSugerida } from '../../types/enums';
import { CreditCostsBox, MapContainer } from '../consulta-direccion';
import SearchSection from '../consulta-direccion/SearchSection';
import ConfirmModal from '../generales/ConfirmModal';

import SearchOverlay from './SearchOverlay';
import SearchResult from './SearchResult';

interface BuscarDireccionPageContentProps {
  direccion: string;
  setDireccion: (value: string) => void;
  loading: boolean;
  buscandoSugerencias: boolean;
  sugerencias: Array<{ direccion: string; coordenadas: { lat: number; lng: number } }>;
  obtenerSugerencias: (value: string) => Promise<void>;
  seleccionarSugerencia: (sugerencia: { direccion: string }) => void;
  hasResult: boolean;
  handleClear: () => void;
  isDisabled: boolean;
  center: { lat: number; lng: number };
  resultado: BasicInformationProps['informe'] | null;
  calculatedValues: BasicInformationProps['calculatedValues'];
  searchCounter: number;
  confirmClear: boolean;
  setConfirmClear: (value: boolean) => void;
  handleConfirmClear: () => void;
  onSearch: () => void;
}

const adaptSugerenciasToDireccionSugerida = (
  sugerencias: Array<{ direccion: string; coordenadas: { lat: number; lng: number } }>
): DireccionSugerida[] => {
  return sugerencias.map((sug) => ({
    direccion: sug.direccion,
    nombre_calle: sug.direccion.split(' ')[0] || sug.direccion,
    tipo: 'direccion',
  }));
};

interface BuscarDireccionFormProps {
  direccion: string;
  setDireccion: (value: string) => void;
  loading: boolean;
  buscandoSugerencias: boolean;
  sugerencias: Array<{ direccion: string; coordenadas: { lat: number; lng: number } }>;
  obtenerSugerencias: (value: string) => Promise<void>;
  seleccionarSugerencia: (sugerencia: { direccion: string }) => void;
  hasResult: boolean;
  handleClear: () => void;
  isDisabled: boolean;
  center: { lat: number; lng: number };
  onSearch: () => void;
}

const BuscarDireccionForm: React.FC<BuscarDireccionFormProps> = ({
  direccion,
  setDireccion,
  loading,
  buscandoSugerencias,
  sugerencias,
  obtenerSugerencias,
  seleccionarSugerencia,
  hasResult,
  handleClear,
  isDisabled,
  center,
  onSearch,
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 mt-4">
    <h1 className="text-2xl font-bold text-[#0369A1] mb-4">Buscar Datos básicos</h1>
    <SearchSection
      direccion={direccion}
      onDireccionChange={setDireccion}
      onSearch={() => {
        void onSearch();
      }}
      modoCompuesto={false}
      singleModeIcon
      loading={loading || buscandoSugerencias}
      sugerencias={adaptSugerenciasToDireccionSugerida(sugerencias)}
      onInputChange={(value) => {
        void obtenerSugerencias(value);
      }}
      onSeleccionarSugerencia={(direccion) => {
        seleccionarSugerencia({ direccion });
      }}
      hasResult={hasResult}
      onClear={handleClear}
      disabled={isDisabled}
    />
    <div className="mt-4">
      <MapContainer center={center} showMarker={hasResult} />
    </div>
  </div>
);

const BuscarDireccionPageContent: React.FC<BuscarDireccionPageContentProps> = ({
  direccion,
  setDireccion,
  loading,
  buscandoSugerencias,
  sugerencias,
  obtenerSugerencias,
  seleccionarSugerencia,
  hasResult,
  handleClear,
  isDisabled,
  center,
  resultado,
  calculatedValues,
  searchCounter,
  confirmClear,
  setConfirmClear,
  handleConfirmClear,
  onSearch,
}) => {
  return (
    <>
      {loading && <SearchOverlay seconds={searchCounter} />}
      <div className="w-full flex flex-col items-center justify-center">
        <div className="w-full flex justify-center items-start mt-8">
          <div className="w-full max-w-6xl">
            <CreditCostsBox />
          </div>
        </div>
        <div className="w-full flex justify-center items-start mt-4">
          <div className="w-full max-w-6xl" data-tutorial="buscar-direccion">
            <BuscarDireccionForm
              direccion={direccion}
              setDireccion={setDireccion}
              loading={loading}
              buscandoSugerencias={buscandoSugerencias}
              sugerencias={sugerencias}
              obtenerSugerencias={obtenerSugerencias}
              seleccionarSugerencia={seleccionarSugerencia}
              hasResult={hasResult}
              handleClear={handleClear}
              isDisabled={isDisabled}
              center={center}
              onSearch={onSearch}
            />
            {resultado && (
              <SearchResult resultado={resultado} calculatedValues={calculatedValues} />
            )}
          </div>
        </div>
        {confirmClear && (
          <ConfirmModal
            message="Esta acción eliminará la información de la dirección consultada. ¿Continuar?"
            onCancel={() => setConfirmClear(false)}
            onConfirm={handleConfirmClear}
          />
        )}
      </div>
    </>
  );
};

export default BuscarDireccionPageContent;

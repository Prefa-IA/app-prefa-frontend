import React from 'react';
import { useSearchParams } from 'react-router-dom';

import { BasicInformationProps, DireccionSugerida } from '../../types/enums';
import { MapContainer } from '../consulta-direccion';
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
  const [params] = useSearchParams();

  return (
    <>
      {loading && <SearchOverlay seconds={searchCounter} />}
      <div className="w-[95%] lg:w-[63%] max-w-8xl mt-8 mx-auto" data-tutorial="buscar-direccion">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
          <h1 className="text-2xl font-bold text-[#0369A1] mb-4">Buscar dirección</h1>
          {params.get('fromHistory') !== 'true' && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              Esta acción consumirá 5 créditos y no requiere plan.
            </p>
          )}
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
        {resultado && <SearchResult resultado={resultado} calculatedValues={calculatedValues} />}
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

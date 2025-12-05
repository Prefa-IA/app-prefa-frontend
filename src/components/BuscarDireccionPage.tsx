import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useBuscarDireccionPage } from '../hooks/use-buscar-direccion-page';
import { useBuscarDireccionPageHandlers } from '../hooks/use-buscar-direccion-page-handlers';
import { useDireccionSugerencias } from '../hooks/use-direccion-sugerencias';
import { useSearchCounter } from '../hooks/use-search-counter';

import BuscarDireccionPageContent from './buscar-direccion/BuscarDireccionPageContent';

const BuscarDireccionPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    direccion,
    setDireccion,
    loading,
    resultado,
    setResultado,
    center,
    calculatedValues,
    onSearch,
    lastSearchedRef,
  } = useBuscarDireccionPage();

  const searchCounter = useSearchCounter(loading);
  const { sugerencias, buscandoSugerencias, obtenerSugerencias, seleccionarSugerencia } =
    useDireccionSugerencias(
      setDireccion,
      () => {},
      false,
      () => {},
      4,
      () => {}
    );

  // Adaptar sugerencias para incluir coordenadas
  const sugerenciasConCoordenadas = sugerencias.map((sug) => ({
    direccion: sug.direccion,
    coordenadas: { lat: -34.6037, lng: -58.3816 }, // Coordenadas por defecto de CABA
  }));

  const { confirmClear, setConfirmClear, handleClear, handleConfirmClear } =
    useBuscarDireccionPageHandlers({
      resultado,
      setResultado,
      setDireccion,
      lastSearchedRef,
      navigate,
    });

  const hasResult = !!resultado;
  const isDisabled = loading || hasResult;

  return (
    <BuscarDireccionPageContent
      direccion={direccion}
      setDireccion={setDireccion}
      loading={loading}
      buscandoSugerencias={buscandoSugerencias}
      sugerencias={sugerenciasConCoordenadas}
      obtenerSugerencias={async (value) => {
        obtenerSugerencias(value);
      }}
      seleccionarSugerencia={(sugerencia) => {
        void seleccionarSugerencia(
          typeof sugerencia === 'string' ? sugerencia : sugerencia.direccion
        );
      }}
      hasResult={hasResult}
      handleClear={handleClear}
      isDisabled={isDisabled}
      center={center}
      resultado={resultado}
      calculatedValues={calculatedValues}
      searchCounter={searchCounter}
      confirmClear={confirmClear}
      setConfirmClear={setConfirmClear}
      handleConfirmClear={handleConfirmClear}
      onSearch={() => {
        void onSearch();
      }}
    />
  );
};

export default BuscarDireccionPage;

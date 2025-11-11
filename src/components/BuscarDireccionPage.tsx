import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { prefactibilidad } from '../services/api';
import { Informe } from '../types/enums';
import SearchSection from './consulta-direccion/SearchSection';
import { MapContainer } from './consulta-direccion';
import { getDefaultMapCenter, updateMapCenter, Coordinates } from '../utils/mapUtils';
import BasicInformation from './parcel-data/BasicInformation';
import { calculateAllValues } from '../utils/parcelCalculations';
import { useDireccionSugerencias } from '../hooks/useDireccionSugerencias';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { confirmarToast } from '../utils/consultaDireccionUtils';
import { listAddressHistory } from '../services/addressHistory';

const BuscarDireccionPage: React.FC = () => {
  const [params] = useSearchParams();
  const [direccion, setDireccion] = React.useState<string>(params.get('direccion') || '');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [resultado, setResultado] = React.useState<Informe | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [center, setCenter] = React.useState<Coordinates>(getDefaultMapCenter());
  const { refreshProfile } = useAuth();
  const isSearchingRef = React.useRef(false);
  const lastSearchedRef = React.useRef<string>('');
  const { sugerencias, buscandoSugerencias, obtenerSugerencias, seleccionarSugerencia } =
    useDireccionSugerencias(setDireccion, setCenter, false, () => {}, 4, setError);

  const onSearch = React.useCallback(async () => {
    if (!direccion || direccion.trim().length < 3) {
      setError('Ingrese una dirección válida.');
      return;
    }

    const searchKey = `${direccion}-${params.get('fromHistory')}`;
    if (isSearchingRef.current || lastSearchedRef.current === searchKey) {
      return;
    }

    const fromHistory = params.get('fromHistory') === 'true';
    
    if (!fromHistory) {
      const historial = await listAddressHistory();
      const direccionNormalizada = direccion.trim().toLowerCase();
      const existeEnHistorial = historial.some(
        item => item.address.trim().toLowerCase() === direccionNormalizada
      );
      
      if (existeEnHistorial) {
        const confirmar = await confirmarToast(
          'Esta dirección ya está en tu historial. Si continúas, se sobrescribirá la anterior y se consumirán créditos.'
        );
        if (!confirmar) {
          return;
        }
      }
    }

    isSearchingRef.current = true;
    lastSearchedRef.current = searchKey;
    setError(null);
    setLoading(true);
    
    try {
      const data = await prefactibilidad.consultarDireccion(direccion, { 
        prefaCompleta: false, 
        compuesta: false, 
        basicSearch: true,
        skipCredits: fromHistory
      });
      if ((data as any)?.inProgress) {
        isSearchingRef.current = false;
        return;
      }
      setResultado(data);
      updateMapCenter(data, setCenter);
      if (!fromHistory) {
        try {
          const { addAddressToHistory } = await import('../services/addressHistory');
          await addAddressToHistory(direccion);
        } catch {}
        await refreshProfile();
      }
    } catch (e: any) {
      setError(e?.message || 'Error al consultar la dirección');
      lastSearchedRef.current = '';
    } finally {
      setLoading(false);
      isSearchingRef.current = false;
    }
  }, [direccion, params, refreshProfile]);

  React.useEffect(() => {
    const direccionParam = params.get('direccion');
    const fromHistory = params.get('fromHistory') === 'true';
    if (direccionParam) {
      const searchKey = `${direccionParam}-${fromHistory}`;
      if (searchKey !== lastSearchedRef.current) {
        setDireccion(direccionParam);
        onSearch();
      }
    }
  }, [params, onSearch]);

  React.useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }
  }, [error]);

  const hasResult = !!resultado;
  const calculatedValues = resultado ? calculateAllValues(resultado, {}) : { totalCapConstructiva: 0, plusvaliaFinal: 0 };

  return (
    <div className="w-[95%] lg:w-[63%] max-w-8xl mt-8 mx-auto" data-tutorial="buscar-direccion">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold text-[#0369A1] mb-4">Buscar dirección</h1>
        {params.get('fromHistory') !== 'true' && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Esta acción consumirá 5 créditos y no requiere plan.</p>
        )}
        <SearchSection
          direccion={direccion}
          onDireccionChange={setDireccion}
          onSearch={onSearch}
          modoCompuesto={false}
          singleModeIcon
          loading={loading || buscandoSugerencias}
          sugerencias={sugerencias as any}
          onInputChange={obtenerSugerencias}
          onSeleccionarSugerencia={seleccionarSugerencia}
          hasResult={hasResult}
          onClear={async () => {
            if (resultado) {
              const confirmar = await confirmarToast(
                'Esta acción eliminará la información de la dirección consultada. ¿Continuar?'
              );
              if (!confirmar) {
                return;
              }
            }
            setResultado(null);
            setDireccion('');
            lastSearchedRef.current = '';
          }}
          disabled={loading}
        />

        <div className="mt-4">
          <MapContainer 
            center={center}
            showMarker={!!resultado}
          />
        </div>
      </div>

      {resultado && (
        <div className="w-[95%] lg:w-[80%] max-w-6xl mx-auto mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
          <BasicInformation
            informe={resultado}
            informeCompuesto={undefined}
            esInformeCompuesto={false}
            calculatedValues={calculatedValues as any}
            pageCounter={0}
          />
        </div>
      )}
    </div>
  );
};

export default BuscarDireccionPage;



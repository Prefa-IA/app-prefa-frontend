import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAuth } from '../contexts/AuthContext';
import { useDireccionSugerencias } from '../hooks/use-direccion-sugerencias';
import { listAddressHistory } from '../services/address-history';
import { prefactibilidad } from '../services/api';
import { BasicInformationProps, Informe } from '../types/enums';
import { validarDireccionConNumero } from '../utils/consulta-direccion-utils';
import { Coordinates, getDefaultMapCenter, updateMapCenter } from '../utils/map-utils';
import { calculateAllValues } from '../utils/parcel-calculations';

import SearchSection from './consulta-direccion/SearchSection';
import ConfirmModal from './generales/ConfirmModal';
import BasicInformation from './parcel-data/BasicInformation';
import { MapContainer } from './consulta-direccion';

const BuscarDireccionPage: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [direccion, setDireccion] = React.useState<string>(params.get('direccion') || '');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [resultado, setResultado] = React.useState<Informe | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [center, setCenter] = React.useState<Coordinates>(getDefaultMapCenter());
  const [confirmClear, setConfirmClear] = React.useState<boolean>(false);
  const { refreshProfile } = useAuth();
  const isSearchingRef = React.useRef(false);
  const lastSearchedRef = React.useRef<string>('');
  const { sugerencias, buscandoSugerencias, obtenerSugerencias, seleccionarSugerencia } =
    useDireccionSugerencias(setDireccion, setCenter, false, () => {}, 4, setError);

  const shouldSkipCredits = React.useCallback(
    async (fromHistory: boolean, direccion: string): Promise<boolean> => {
      if (fromHistory) return true;
      const historial = await listAddressHistory();
      const direccionNormalizada = direccion.trim().toLowerCase();
      return historial.some((item) => item.address.trim().toLowerCase() === direccionNormalizada);
    },
    []
  );

  const normalizarDireccion = React.useCallback((dir: string): string => {
    if (!dir) return '';
    return dir
      .trim()
      .toUpperCase()
      .replace(/\s+/g, ' ')
      .replace(/,\s*/g, ',')
      .replace(/\s*,\s*/g, ',');
  }, []);

  const buscarInformeExistente = React.useCallback(
    async (direccion: string): Promise<Informe | null> => {
      try {
        const { informes } = await prefactibilidad.obtenerInformes(1, direccion);
        const direccionNormalizada = normalizarDireccion(direccion);
        const informeExistente = informes.find((inf) => {
          const direccionInforme =
            inf.direccionesNormalizadas?.[0]?.direccion ||
            `${inf.direccion?.direccion || ''} ${inf.direccion?.altura || ''}`.trim();

          if (!direccionInforme) return false;

          const informeNormalizado = normalizarDireccion(direccionInforme);
          return (
            informeNormalizado === direccionNormalizada ||
            informeNormalizado.includes(direccionNormalizada) ||
            direccionNormalizada.includes(informeNormalizado)
          );
        });

        return informeExistente || null;
      } catch {
        return null;
      }
    },
    [normalizarDireccion]
  );

  const handleSuccessfulSearch = React.useCallback(
    async (data: Informe, skipCredits: boolean, direccion: string) => {
      setResultado(data);
      updateMapCenter(data, setCenter);
      if (!skipCredits) {
        try {
          const { addAddressToHistory } = await import('../services/address-history');
          await addAddressToHistory(direccion);
        } catch {
          // Ignorar errores al agregar al historial
        }
      }
      await refreshProfile();
    },
    [setCenter, refreshProfile]
  );

  const validarDireccionInput = React.useCallback((): boolean => {
    if (!direccion || direccion.trim().length < 3) {
      setError('Ingrese una dirección válida.');
      return false;
    }

    if (!validarDireccionConNumero(direccion)) {
      setError(
        'La dirección debe incluir un número (altura). Por favor, ingrese una dirección completa con número.'
      );
      return false;
    }

    return true;
  }, [direccion, setError]);

  const manejarInProgress = React.useCallback(
    async (fromHistory: boolean, direccion: string): Promise<boolean> => {
      if (fromHistory) {
        const informeExistente = await buscarInformeExistente(direccion);
        if (informeExistente) {
          await handleSuccessfulSearch(informeExistente, true, direccion);
          toast.info('Se encontró un informe existente para esta dirección.');
          return true;
        }
      }
      toast.info('Ya tienes una consulta en curso. Espera a que finalice.');
      isSearchingRef.current = false;
      return false;
    },
    [buscarInformeExistente, handleSuccessfulSearch]
  );

  const manejarError409 = React.useCallback(
    async (
      error: { code?: string; response?: { status?: number; data?: { status?: string } } },
      fromHistory: boolean,
      direccion: string
    ): Promise<boolean> => {
      if (
        fromHistory &&
        (error.code === 'PREFA_IN_PROGRESS' ||
          (error.response?.status === 409 && error.response?.data?.status === 'in_progress'))
      ) {
        const informeExistente = await buscarInformeExistente(direccion);
        if (informeExistente) {
          await handleSuccessfulSearch(informeExistente, true, direccion);
          toast.info('Se encontró un informe existente para esta dirección.');
          return true;
        }
      }
      return false;
    },
    [buscarInformeExistente, handleSuccessfulSearch]
  );

  const onSearch = React.useCallback(async () => {
    if (!validarDireccionInput()) {
      return;
    }

    const searchKey = `${direccion}-${params.get('fromHistory')}`;
    if (isSearchingRef.current || lastSearchedRef.current === searchKey) {
      return;
    }

    const fromHistory = params.get('fromHistory') === 'true';
    const skipCredits = await shouldSkipCredits(fromHistory, direccion);

    isSearchingRef.current = true;
    lastSearchedRef.current = searchKey;
    setError(null);
    setLoading(true);

    try {
      const data = await prefactibilidad.consultarDireccion(direccion, {
        prefaCompleta: false,
        compuesta: false,
        basicSearch: true,
        skipCredits: skipCredits,
      });
      if ('inProgress' in data && data.inProgress) {
        const handled = await manejarInProgress(fromHistory, direccion);
        if (handled) {
          return;
        }
        return;
      }
      await handleSuccessfulSearch(data, skipCredits, direccion);
    } catch (e: unknown) {
      const error = e as {
        code?: string;
        response?: { status?: number; data?: { status?: string } };
      };
      const handled = await manejarError409(error, fromHistory, direccion);
      if (!handled) {
        const errorMessage = e instanceof Error ? e.message : 'Error al consultar la dirección';
        setError(errorMessage);
        lastSearchedRef.current = '';
      }
    } finally {
      setLoading(false);
      isSearchingRef.current = false;
    }
  }, [
    direccion,
    params,
    shouldSkipCredits,
    handleSuccessfulSearch,
    setError,
    validarDireccionInput,
    manejarInProgress,
    manejarError409,
  ]);

  React.useEffect(() => {
    const direccionParam = params.get('direccion');
    const fromHistory = params.get('fromHistory') === 'true';
    if (direccionParam) {
      const searchKey = `${direccionParam}-${fromHistory}`;
      if (searchKey !== lastSearchedRef.current) {
        setDireccion(direccionParam);
        void onSearch();
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
  const calculatedValues: BasicInformationProps['calculatedValues'] = resultado
    ? (() => {
        const values = calculateAllValues(resultado, {});
        return {
          totalCapConstructiva: values.totalCapConstructiva,
          plusvaliaFinal: values.plusvaliaFinal,
        };
      })()
    : { totalCapConstructiva: 0, plusvaliaFinal: 0 };
  const isDisabled = loading || hasResult;

  return (
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
          sugerencias={sugerencias}
          onInputChange={(value) => {
            void obtenerSugerencias(value);
          }}
          onSeleccionarSugerencia={(sugerencia) => {
            void seleccionarSugerencia(sugerencia);
          }}
          hasResult={hasResult}
          onClear={() => {
            if (resultado) {
              setConfirmClear(true);
            } else {
              setResultado(null);
              setDireccion('');
              lastSearchedRef.current = '';
            }
          }}
          disabled={isDisabled}
        />

        <div className="mt-4">
          <MapContainer center={center} showMarker={!!resultado} />
        </div>
      </div>

      {resultado && (
        <div className="w-[100%] lg:w-[100%] mx-auto mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
          <BasicInformation
            informe={resultado}
            esInformeCompuesto={false}
            calculatedValues={calculatedValues}
            pageCounter={0}
            isBasicSearch={true}
          />
        </div>
      )}

      {confirmClear && (
        <ConfirmModal
          message="Esta acción eliminará la información de la dirección consultada. ¿Continuar?"
          onCancel={() => setConfirmClear(false)}
          onConfirm={() => {
            setResultado(null);
            setDireccion('');
            lastSearchedRef.current = '';
            setConfirmClear(false);
            navigate('/buscar', { replace: true });
          }}
        />
      )}
    </div>
  );
};

export default BuscarDireccionPage;

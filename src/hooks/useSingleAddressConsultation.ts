import { useCallback } from 'react';
import React from 'react';
import { prefactibilidad } from '../services/api';
import { Informe } from '../types/enums';
import { TipoPrefa } from '../types/consultaDireccion';
import { Coordinates } from '../utils/mapUtils';
import { updateMapCenter } from '../utils/mapUtils';
import { validarConsulta, manejarErrorConsulta, confirmarToast } from '../utils/consultaDireccionUtils';
import { toast } from 'react-toastify';
import { listAddressHistory } from '../services/addressHistory';

interface UseSingleAddressConsultationProps {
  usuario: any;
  direccion: string;
  tipoPrefa: TipoPrefa;
  modoCompuesto: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setResultado: (resultado: Informe) => void;
  setCenter: (center: Coordinates) => void;
  setProcessing: (processing: boolean) => void;
  agregarDireccion: (direccion: string) => void;
  procesarCalculoPrefactibilidad: (datosParcela: any) => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshCredits: () => void;
}

export const useSingleAddressConsultation = ({
  usuario,
  direccion,
  tipoPrefa,
  modoCompuesto,
  setLoading,
  setError,
  setResultado,
  setCenter,
  setProcessing,
  agregarDireccion,
  procesarCalculoPrefactibilidad,
  refreshProfile,
  refreshCredits
}: UseSingleAddressConsultationProps) => {
  const isSearchingRef = React.useRef(false);
  const lastSearchedRef = React.useRef<string>('');

  const handleSearch = useCallback(async () => {
    if (!validarConsulta(usuario, direccion, setError)) return;

    if (modoCompuesto) {
      agregarDireccion(direccion);
      return;
    }

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

    const searchKey = `${direccion}-${tipoPrefa}`;
    if (isSearchingRef.current || lastSearchedRef.current === searchKey) {
      return;
    }

    isSearchingRef.current = true;
    lastSearchedRef.current = searchKey;
    setLoading(true);
    setError(null);

    try {
      const response = await prefactibilidad.consultarDireccion(direccion, {
        prefaCompleta: tipoPrefa === 'prefa2',
        compuesta: false
      });

      if ((response as any).inProgress) {
        toast.info('Ya tienes una consulta en curso. Espera a que finalice.');
        isSearchingRef.current = false;
        setLoading(false);
        return;
      }

      setResultado(response);
      try {
        const { addAddressToHistory } = await import('../services/addressHistory');
        await addAddressToHistory(direccion);
      } catch {}
      refreshProfile();
      refreshCredits();
      updateMapCenter(response, setCenter);

      setProcessing(true);
      await procesarCalculoPrefactibilidad(response);
    } catch (err) {
      manejarErrorConsulta(err, setError);
      setProcessing(false);
      lastSearchedRef.current = '';
    } finally {
      setLoading(false);
      isSearchingRef.current = false;
    }
  }, [
    usuario,
    direccion,
    modoCompuesto,
    tipoPrefa,
    refreshProfile,
    procesarCalculoPrefactibilidad,
    agregarDireccion,
    refreshCredits,
    setLoading,
    setError,
    setResultado,
    setCenter,
    setProcessing
  ]);

  return { handleSearch };
};


import { toast } from 'react-toastify';

import { Informe } from '../types/enums';

import { buscarInformeExistente, normalizarDireccion } from './buscar-direccion-helpers';

interface ManejarInProgressParams {
  fromHistory: boolean;
  direccion: string;
  handleSuccessfulSearch: (
    data: Informe,
    skipCredits: boolean,
    direccion: string
  ) => Promise<Informe>;
  setLoading: (loading: boolean) => void;
  isSearchingRef: React.MutableRefObject<boolean>;
}

export const manejarInProgressHelper = async ({
  fromHistory,
  direccion,
  handleSuccessfulSearch,
  setLoading,
  isSearchingRef,
}: ManejarInProgressParams): Promise<boolean> => {
  if (fromHistory) {
    const informeExistente = await buscarInformeExistente(direccion, normalizarDireccion);
    if (informeExistente) {
      await handleSuccessfulSearch(informeExistente, true, direccion);
      toast.info('Ya tenias esta direccion guardada, no se consumieron creditos');
      setLoading(false);
      isSearchingRef.current = false;
      return true;
    }
  }
  toast.info('Ya tienes una consulta en curso. Espera a que finalice.');
  setLoading(false);
  isSearchingRef.current = false;
  return false;
};

interface ManejarError409Params {
  error: { code?: string; response?: { status?: number; data?: { status?: string } } };
  fromHistory: boolean;
  direccion: string;
  handleSuccessfulSearch: (
    data: Informe,
    skipCredits: boolean,
    direccion: string
  ) => Promise<Informe>;
  setLoading: (loading: boolean) => void;
  isSearchingRef: React.MutableRefObject<boolean>;
}

export const manejarError409Helper = async ({
  error,
  fromHistory,
  direccion,
  handleSuccessfulSearch,
  setLoading,
  isSearchingRef,
}: ManejarError409Params): Promise<boolean> => {
  if (
    fromHistory &&
    (error.code === 'PREFA_IN_PROGRESS' ||
      (error.response?.status === 409 && error.response?.data?.status === 'in_progress'))
  ) {
    const informeExistente = await buscarInformeExistente(direccion, normalizarDireccion);
    if (informeExistente) {
      await handleSuccessfulSearch(informeExistente, true, direccion);
      toast.info('Ya tenias esta direccion guardada, no se consumieron creditos');
      setLoading(false);
      isSearchingRef.current = false;
      return true;
    }
  }
  return false;
};

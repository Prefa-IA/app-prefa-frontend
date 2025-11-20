import { prefactibilidad } from '../services/api';
import { BasicInformationProps } from '../types/enums';

interface SearchHandlerParams {
  direccion: string;
  fromHistory: boolean;
  skipCredits: boolean;
  handleSuccessfulSearch: (
    data: BasicInformationProps['informe'],
    skipCredits: boolean,
    direccion: string
  ) => Promise<BasicInformationProps['informe']>;
  manejarInProgress: (
    fromHistory: boolean,
    direccion: string,
    handleSuccessfulSearch: (
      data: BasicInformationProps['informe'],
      skipCredits: boolean,
      direccion: string
    ) => Promise<BasicInformationProps['informe']>
  ) => Promise<boolean>;
  manejarError409: (
    error: { code?: string; response?: { status?: number; data?: { status?: string } } },
    fromHistory: boolean,
    direccion: string,
    handleSuccessfulSearch: (
      data: BasicInformationProps['informe'],
      skipCredits: boolean,
      direccion: string
    ) => Promise<BasicInformationProps['informe']>
  ) => Promise<boolean>;
  setError: (error: string | null) => void;
  lastSearchedRef: React.MutableRefObject<string>;
}

export const executeSearch = async ({
  direccion,
  fromHistory,
  skipCredits,
  handleSuccessfulSearch,
  manejarInProgress,
  manejarError409,
  setError,
  lastSearchedRef,
}: SearchHandlerParams): Promise<void> => {
  try {
    const data = await prefactibilidad.consultarDireccion(direccion, {
      prefaCompleta: false,
      compuesta: false,
      basicSearch: true,
      skipCredits: skipCredits,
    });
    if ('inProgress' in data && data.inProgress) {
      const handled = await manejarInProgress(fromHistory, direccion, handleSuccessfulSearch);
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
    const handled = await manejarError409(error, fromHistory, direccion, handleSuccessfulSearch);
    if (!handled) {
      const errorMessage = e instanceof Error ? e.message : 'Error al consultar la dirección';
      setError(errorMessage);
      lastSearchedRef.current = '';
    }
  }
};

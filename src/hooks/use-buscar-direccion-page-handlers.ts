import { useCallback, useState } from 'react';
import { NavigateFunction } from 'react-router-dom';

import { BasicInformationProps } from '../types/enums';

interface UseBuscarDireccionPageHandlersProps {
  resultado: BasicInformationProps['informe'] | null;
  setResultado: (value: BasicInformationProps['informe'] | null) => void;
  setDireccion: (value: string) => void;
  lastSearchedRef: React.MutableRefObject<string>;
  navigate: NavigateFunction;
}

export const useBuscarDireccionPageHandlers = ({
  resultado,
  setResultado,
  setDireccion,
  lastSearchedRef,
  navigate,
}: UseBuscarDireccionPageHandlersProps) => {
  const [confirmClear, setConfirmClear] = useState<boolean>(false);

  const handleClear = useCallback(() => {
    if (resultado) {
      setConfirmClear(true);
    } else {
      setResultado(null);
      setDireccion('');
      lastSearchedRef.current = '';
    }
  }, [resultado, setResultado, setDireccion, lastSearchedRef]);

  const handleConfirmClear = useCallback(() => {
    setResultado(null);
    setDireccion('');
    lastSearchedRef.current = '';
    setConfirmClear(false);
    navigate('/buscar', { replace: true });
  }, [setResultado, setDireccion, lastSearchedRef, navigate]);

  return { confirmClear, setConfirmClear, handleClear, handleConfirmClear };
};

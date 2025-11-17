import { useCallback } from 'react';

import { Informe } from '../types/enums';

interface UseAddressManagementProps {
  direcciones: string[];
  resultados: Informe[];
  setDirecciones: React.Dispatch<React.SetStateAction<string[]>>;
  setResultados: React.Dispatch<React.SetStateAction<Informe[]>>;
}

export const useAddressManagement = ({
  setDirecciones,
  setResultados,
}: UseAddressManagementProps) => {
  const agregarDireccion = useCallback(
    (dir: string) => {
      setDirecciones((prev) => (prev.includes(dir) ? prev : [...prev, dir]));
    },
    [setDirecciones]
  );

  const eliminarDireccion = useCallback(
    (index: number) => {
      setDirecciones((prev) => prev.filter((_, i) => i !== index));
      setResultados((prev) => prev.filter((_, i) => i !== index));
    },
    [setDirecciones, setResultados]
  );

  return { agregarDireccion, eliminarDireccion };
};

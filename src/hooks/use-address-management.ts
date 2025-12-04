import { useCallback } from 'react';
import { toast } from 'react-toastify';

import { Informe } from '../types/enums';

interface UseAddressManagementProps {
  direcciones: string[];
  resultados: Informe[];
  setDirecciones: React.Dispatch<React.SetStateAction<string[]>>;
  setResultados: React.Dispatch<React.SetStateAction<Informe[]>>;
  setDireccion?: (direccion: string) => void;
}

export const useAddressManagement = ({
  direcciones,
  setDirecciones,
  setResultados,
  setDireccion,
}: UseAddressManagementProps) => {
  const agregarDireccion = useCallback(
    (dir: string) => {
      const direccionNormalizada = dir.trim();

      if (direcciones.length >= 3) {
        toast.warning('Solo se pueden agregar hasta 3 direcciones en prefactibilidades compuestas');
        return;
      }

      const direccionYaExiste = direcciones.some(
        (d) => d.trim().toLowerCase() === direccionNormalizada.toLowerCase()
      );

      if (direccionYaExiste) {
        toast.warning('Esta dirección ya está agregada en la lista');
        return;
      }

      setDirecciones((prev) => [...prev, direccionNormalizada]);

      if (setDireccion) {
        setDireccion('');
      }
    },
    [direcciones, setDirecciones, setDireccion]
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

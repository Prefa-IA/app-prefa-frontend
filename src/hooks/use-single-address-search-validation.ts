import { MutableRefObject } from 'react';

import { prefactibilidad } from '../services/api';
import { TipoPrefa } from '../types/consulta-direccion';
import { Usuario } from '../types/enums';
import { buscarInformeExistente } from '../utils/consulta-direccion-normalization';
import { confirmarToast, validarConsulta } from '../utils/consulta-direccion-utils';

interface UseSingleAddressSearchValidationProps {
  usuario: Usuario | null;
  direccion: string;
  tipoPrefa: TipoPrefa;
  modoCompuesto: boolean;
  agregarDireccion: (direccion: string) => void;
  setLoading: (loading: boolean) => void;
  isSearchingRef: MutableRefObject<boolean>;
  lastSearchedRef: MutableRefObject<string>;
}

export const useSingleAddressSearchValidation = ({
  usuario,
  direccion,
  tipoPrefa,
  modoCompuesto,
  agregarDireccion,
  setLoading,
  isSearchingRef,
  lastSearchedRef,
}: UseSingleAddressSearchValidationProps) => {
  const validateAndCheckExisting = async (setError: (error: string | null) => void) => {
    if (!validarConsulta(usuario, direccion, setError)) return false;

    if (modoCompuesto) {
      agregarDireccion(direccion);
      return false;
    }

    const searchKey = `${direccion}-${tipoPrefa}`;
    if (isSearchingRef.current || lastSearchedRef.current === searchKey) {
      return false;
    }

    const direccionBusqueda = direccion.trim();
    const { informes } = await prefactibilidad.obtenerInformes(1, direccionBusqueda);
    const informeExistente = buscarInformeExistente(informes, direccionBusqueda, tipoPrefa);

    if (informeExistente) {
      setLoading(false);
      const confirmar = await confirmarToast(
        'Ya existe un informe para esta dirección. Si continúas, se sobrescribirá el anterior y se consumirán créditos nuevamente.'
      );
      if (!confirmar) {
        isSearchingRef.current = false;
        lastSearchedRef.current = '';
        return false;
      }
      setLoading(true);
    }

    return true;
  };

  return { validateAndCheckExisting };
};

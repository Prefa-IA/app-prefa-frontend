import { listAddressHistory } from '../services/address-history';
import { prefactibilidad } from '../services/api';
import { Informe } from '../types/enums';

export const normalizarDireccion = (dir: string): string => {
  if (!dir) return '';
  return dir
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .replace(/,\s*/g, ',')
    .replace(/\s*,\s*/g, ',');
};

export const buscarInformeExistente = async (
  direccion: string,
  normalizarFn: (dir: string) => string
): Promise<Informe | null> => {
  try {
    const { informes } = await prefactibilidad.obtenerInformes(1, direccion);
    const direccionNormalizada = normalizarFn(direccion);
    const informeExistente = informes.find((inf) => {
      const direccionInforme =
        inf.direccionesNormalizadas?.[0]?.direccion ||
        `${inf.direccion?.direccion || ''} ${inf.direccion?.altura || ''}`.trim();

      if (!direccionInforme) return false;

      const informeNormalizado = normalizarFn(direccionInforme);
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
};

export const verificarEnHistorial = async (direccion: string): Promise<boolean> => {
  const historial = await listAddressHistory(true);
  const direccionNormalizada = direccion.trim().toLowerCase();
  return historial.some((item) => item.address.trim().toLowerCase() === direccionNormalizada);
};

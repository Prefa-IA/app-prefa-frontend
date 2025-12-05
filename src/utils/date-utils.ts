/* eslint-disable import/no-duplicates */
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
/* eslint-enable import/no-duplicates */

export const formatearFecha = (timestamp: string): string => {
  try {
    const fecha = new Date(timestamp);
    return format(fecha, 'dd MMMM yyyy, HH:mm', { locale: es });
  } catch (e) {
    return timestamp;
  }
};

export const formatearFechaCorta = (timestamp: string): string => {
  try {
    const fecha = new Date(timestamp);
    return format(fecha, 'dd/MM/yyyy', { locale: es });
  } catch (e) {
    return timestamp;
  }
};

export const formatearHora = (timestamp: string): string => {
  try {
    const fecha = new Date(timestamp);
    return format(fecha, 'HH:mm', { locale: es });
  } catch (e) {
    return timestamp;
  }
};

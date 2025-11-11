import { Informe, InformeCompuesto } from '../types/enums';
import { prefactibilidad } from '../services/api';
import { manejarErrorPDF } from './consultaDireccionUtils';
import { crearInformeCompuesto } from '../services/consolidacionInformes';

export const getReportTitle = (
  isCompoundMode: boolean,
  addresses: string[],
  informe: Informe
): string => {
  if (isCompoundMode) {
    return addresses.join(', ');
  }
  return informe.direccionesNormalizadas?.[0]?.direccion || 'Dirección consultada';
};

export const getReportData = (
  isCompoundMode: boolean,
  informe: Informe,
  informeCompuesto?: InformeCompuesto
): Informe => {
  return isCompoundMode && informeCompuesto 
    ? informeCompuesto.informeConsolidado 
    : informe;
};

export const formatTimestamp = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString();
};

export const downloadReportPDF = async (
  savedId: string,
  resultado: Informe | null,
  setError: (error: string | null) => void
): Promise<void> => {
  if (!savedId) return;

  try {
    const blob = await prefactibilidad.descargarPDF(savedId);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `informe-${resultado?.direccion?.direccion || 'prefactibilidad'}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (err) {
    manejarErrorPDF(err, setError);
  }
};

export const consolidarInformesCompuestos = (
  direcciones: string[],
  resultados: Informe[],
  setInformeCompuesto: (informe: any) => void,
  setResultado: (resultado: Informe | null) => void,
  setError: (error: string | null) => void
): void => {
  try {
    const informeCompuestoNuevo = crearInformeCompuesto(direcciones, resultados);
    setInformeCompuesto(informeCompuestoNuevo);
    setResultado(informeCompuestoNuevo.informeConsolidado);
  } catch (error: any) {
    console.error('Error al consolidar informes:', error);
    const msg = error?.message || 'Error al consolidar los informes. Por favor intente nuevamente.';
    setError(msg);
    setInformeCompuesto(null);
    setResultado(null);
  }
}; 
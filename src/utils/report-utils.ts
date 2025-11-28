import { prefactibilidad } from '../services/api';
import { crearInformeCompuesto } from '../services/consolidacion-informes';
import { Informe, InformeCompuesto } from '../types/enums';

import { manejarErrorPDF } from './consulta-direccion-utils';
import { downloadBlob, generateInformeFilename, generatePDFFromElement } from './download-utils';

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
  informe: Informe | undefined,
  informeCompuesto?: InformeCompuesto
): Informe | null => {
  if (!informe) return null;
  return isCompoundMode && informeCompuesto ? informeCompuesto.informeConsolidado : informe;
};

export const formatTimestamp = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString();
};

export const downloadReportPDFFromServer = async (
  savedId: string,
  resultado: Informe | null,
  setError: (error: string | null) => void
): Promise<void> => {
  if (!savedId) {
    setError('No se puede descargar: el informe no está guardado');
    return;
  }

  try {
    const blob = await prefactibilidad.descargarPDF(savedId);
    const filename = resultado ? generateInformeFilename(resultado) : 'informe-prefactibilidad.pdf';
    downloadBlob(blob, filename);
  } catch (err) {
    manejarErrorPDF(err, setError);
  }
};

export const downloadReportPDFFromClient = async (
  resultado: Informe | null,
  setError: (error: string | null) => void
): Promise<void> => {
  if (!resultado) {
    setError('No hay resultado para generar el PDF');
    return;
  }

  try {
    const reportContainer = document.querySelector('[data-report-container]') as HTMLElement;
    if (!reportContainer) {
      setError('No se encontró el contenedor del informe');
      return;
    }

    const filename = generateInformeFilename(resultado);
    await generatePDFFromElement(reportContainer, filename);
  } catch (err) {
    console.error('Error al generar PDF desde cliente:', err);
    setError('Error al generar el PDF. Por favor, intente nuevamente.');
  }
};

export const downloadReportPDF = async (
  savedId: string | null,
  resultado: Informe | null,
  setError: (error: string | null) => void
): Promise<void> => {
  if (savedId) {
    await downloadReportPDFFromServer(savedId, resultado, setError);
  } else {
    await downloadReportPDFFromClient(resultado, setError);
  }
};

export const consolidarInformesCompuestos = (
  direcciones: string[],
  resultados: Informe[],
  setInformeCompuesto: (informe: InformeCompuesto | null) => void,
  setResultado: (resultado: Informe | null) => void,
  setError: (error: string | null) => void,
  setResultados?: (resultados: Informe[]) => void
): void => {
  try {
    const informeCompuestoNuevo = crearInformeCompuesto(direcciones, resultados);
    setInformeCompuesto(informeCompuestoNuevo);
    setResultado(informeCompuestoNuevo.informeConsolidado);
  } catch (error: unknown) {
    console.error('Error al consolidar informes:', error);
    const msg =
      (error instanceof Error ? error.message : null) ||
      'Error al consolidar los informes. Por favor intente nuevamente.';
    setError(msg);
    setInformeCompuesto(null);
    setResultado(null);
    if (setResultados) {
      setResultados([]);
    }
  }
};

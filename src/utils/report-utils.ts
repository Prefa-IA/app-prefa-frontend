import { toast } from 'react-toastify';

import { prefactibilidad } from '../services/api';
import { crearInformeCompuesto } from '../services/consolidacion-informes';
import { Informe, InformeCompuesto } from '../types/enums';

import { manejarErrorPDF } from './consulta-direccion-utils';
import { downloadBlob, generateInformeFilename, generatePDFFromElement } from './download-utils';
import { calculateAllValues } from './parcel-calculations';

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

const DATO_FRENTE = 'frente';
const DATO_FONDO = 'fondo';
const DATO_TIPO_EDIFICACION = 'tipo de edificación';
const DATO_CAPACIDAD_CONSTRUCTIVA = 'capacidad constructiva';
const DATO_PLUSVALIA_TOTAL = 'plusvalía total estimada';

const validarMedida = (valor: string | undefined): boolean => {
  return Boolean(valor && valor !== 'N/A' && Number.parseFloat(valor) > 0);
};

const validarTipoEdificacion = (tipoEdificacion: string): boolean => {
  return tipoEdificacion !== 'No clasificado' && tipoEdificacion !== 'N/A';
};

const validarValoresCalculados = (
  calculatedValues: ReturnType<typeof calculateAllValues>
): boolean => {
  const totalCapConstructiva = (calculatedValues.totalCapConstructiva || 0) > 0;
  const plusvaliaFinal = (calculatedValues.plusvaliaFinal || 0) > 0;
  const tipoEdificacion = String(calculatedValues.tipoEdificacion || '');
  const tipoEdificacionValido = validarTipoEdificacion(tipoEdificacion);

  return totalCapConstructiva && plusvaliaFinal && tipoEdificacionValido;
};

export const validarDatosCompletos = (informe: Informe): boolean => {
  const frenteValido = validarMedida(informe.datosCatastrales?.frente);
  const fondoValido = validarMedida(informe.datosCatastrales?.fondo);
  const calculatedValues = calculateAllValues(informe, {});
  const valoresCalculadosValidos = validarValoresCalculados(calculatedValues);

  return frenteValido && fondoValido && valoresCalculadosValidos;
};

const mapearDatosFaltantesBackend = (datosFaltantes: string[]): string[] => {
  return datosFaltantes;
};

const validarDatosCalculados = (
  calculatedValues: ReturnType<typeof calculateAllValues>
): { totalCapConstructiva: boolean; plusvaliaFinal: boolean } => {
  const totalCapConstructiva = (calculatedValues.totalCapConstructiva || 0) > 0;
  const plusvaliaFinal = (calculatedValues.plusvaliaFinal || 0) > 0;
  return { totalCapConstructiva, plusvaliaFinal };
};

const obtenerDatosFaltantesCalculados = (
  datosMapeados: string[],
  calculatedValues: ReturnType<typeof calculateAllValues>
): string[] => {
  const datosFaltantesCalculados: string[] = [];
  const { totalCapConstructiva, plusvaliaFinal } = validarDatosCalculados(calculatedValues);

  if (!totalCapConstructiva && !datosMapeados.includes(DATO_CAPACIDAD_CONSTRUCTIVA)) {
    datosFaltantesCalculados.push(DATO_CAPACIDAD_CONSTRUCTIVA);
  }
  if (!plusvaliaFinal && !datosMapeados.includes(DATO_PLUSVALIA_TOTAL)) {
    datosFaltantesCalculados.push(DATO_PLUSVALIA_TOTAL);
  }

  return datosFaltantesCalculados;
};

const validarFrenteYFondo = (informe: Informe): string[] => {
  const datosFaltantes: string[] = [];
  const frenteValido = validarMedida(informe.datosCatastrales?.frente);
  const fondoValido = validarMedida(informe.datosCatastrales?.fondo);

  if (!frenteValido) datosFaltantes.push(DATO_FRENTE);
  if (!fondoValido) datosFaltantes.push(DATO_FONDO);

  return datosFaltantes;
};

const validarValoresCalculadosParaFaltantes = (
  calculatedValues: ReturnType<typeof calculateAllValues>
): string[] => {
  const datosFaltantes: string[] = [];
  const { totalCapConstructiva, plusvaliaFinal } = validarDatosCalculados(calculatedValues);
  const tipoEdificacion = String(calculatedValues.tipoEdificacion || '');
  const tipoEdificacionValido = validarTipoEdificacion(tipoEdificacion);

  if (!totalCapConstructiva) datosFaltantes.push(DATO_CAPACIDAD_CONSTRUCTIVA);
  if (!plusvaliaFinal) datosFaltantes.push(DATO_PLUSVALIA_TOTAL);
  if (!tipoEdificacionValido) datosFaltantes.push(DATO_TIPO_EDIFICACION);

  return datosFaltantes;
};

const obtenerDatosFaltantesDesdeInforme = (informe: Informe): string[] => {
  const datosFaltantesMedidas = validarFrenteYFondo(informe);
  const calculatedValues = calculateAllValues(informe, {});
  const datosFaltantesCalculados = validarValoresCalculadosParaFaltantes(calculatedValues);

  return [...datosFaltantesMedidas, ...datosFaltantesCalculados];
};

export const obtenerDatosFaltantes = (informe: Informe): string[] => {
  if (informe.datosFaltantes && informe.datosFaltantes.length > 0) {
    const datosMapeados = mapearDatosFaltantesBackend(informe.datosFaltantes);
    const calculatedValues = calculateAllValues(informe, {});
    const datosFaltantesCalculados = obtenerDatosFaltantesCalculados(
      datosMapeados,
      calculatedValues
    );

    return [...datosMapeados, ...datosFaltantesCalculados];
  }

  return obtenerDatosFaltantesDesdeInforme(informe);
};

export const generarMensajeDatosFaltantes = (datosFaltantes: string[]): string => {
  if (datosFaltantes.length === 0) {
    return 'No se consumieron los créditos porque no se encontraron los datos necesarios para completar el informe.';
  }

  const datosTexto =
    datosFaltantes.length === 1
      ? datosFaltantes[0]
      : datosFaltantes.slice(0, -1).join(', ') + ' y ' + datosFaltantes[datosFaltantes.length - 1];

  return `No se consumieron los créditos porque no se encontraron los siguientes datos: ${datosTexto}.`;
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

    if (resultado) {
      const datosCompletos = validarDatosCompletos(resultado);
      const datosIncompletos = Boolean(resultado.datosIncompletos) || !datosCompletos;

      if (datosIncompletos) {
        const datosFaltantes = obtenerDatosFaltantes(resultado);
        const mensaje = generarMensajeDatosFaltantes(datosFaltantes);
        toast.warning(mensaje, {
          autoClose: 5000,
        });
      }
    }
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

    const datosCompletos = validarDatosCompletos(resultado);
    const datosIncompletos = Boolean(resultado.datosIncompletos) || !datosCompletos;

    const filename = generateInformeFilename(resultado);
    await generatePDFFromElement(reportContainer, filename);

    if (datosIncompletos) {
      const datosFaltantes = obtenerDatosFaltantes(resultado);
      const mensaje = generarMensajeDatosFaltantes(datosFaltantes);
      toast.warning(mensaje, {
        autoClose: 5000,
      });
    }
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

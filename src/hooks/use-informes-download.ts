import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import { prefactibilidad } from '../services/api';
import { Informe } from '../types/enums';
import { downloadBlob, generateInformeFilename } from '../utils/download-utils';
import { calculateAllValues } from '../utils/parcel-calculations';
import { generarMensajeDatosFaltantes, obtenerDatosFaltantes } from '../utils/report-utils';

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

const validarDatosCompletos = (informe: Informe): boolean => {
  const frenteValido = validarMedida(informe.datosCatastrales?.frente);
  const fondoValido = validarMedida(informe.datosCatastrales?.fondo);
  const calculatedValues = calculateAllValues(informe, {});
  const valoresCalculadosValidos = validarValoresCalculados(calculatedValues);

  return frenteValido && fondoValido && valoresCalculadosValidos;
};

export const useInformesDownload = () => {
  const [downloadingIds, setDownloadingIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleDescargar = useCallback(
    async (informe: Informe) => {
      const id = informe._id as string;
      if (!id || downloadingIds.includes(id)) return;

      setDownloadingIds((prev) => [...prev, id]);
      try {
        const blob = await prefactibilidad.descargarPDF(id);
        const filename = generateInformeFilename(informe);
        downloadBlob(blob, filename);

        const datosCompletos = validarDatosCompletos(informe);
        const datosIncompletos = Boolean(informe.datosIncompletos) || !datosCompletos;

        if (datosIncompletos) {
          const datosFaltantes = obtenerDatosFaltantes(informe);
          const mensaje = generarMensajeDatosFaltantes(datosFaltantes);
          toast.warning(mensaje, {
            autoClose: 5000,
          });
        }
      } catch (error) {
        console.error('Error al descargar informe:', error);
        setError('Error al descargar el informe PDF.');
      } finally {
        setDownloadingIds((prev) => prev.filter((did) => did !== id));
      }
    },
    [downloadingIds]
  );

  return { handleDescargar, downloadingIds, error, setError };
};

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useAuth } from '../../contexts/AuthContext';
import { obtenerDocumentosVisuales } from '../../services/consolidacion-informes';
import { TIPO_PREFA } from '../../types/consulta-direccion';
import { ChangeLogEntry, DocumentosVisuales, Informe, ReportPreviewProps } from '../../types/enums';
import { checkImageExists, generateFachadaUrl } from '../../utils/parcel-calculations';
import { getReportData } from '../../utils/report-utils';
import ParcelDataPage from '../ParcelDataPage';

import ReportFooter from './ReportFooter';
import ReportHeader from './ReportHeader';
import ReportIndex from './ReportIndex';

import styles from '../../styles/ReportPreview.module.css';

interface IAResumen {
  debug?: {
    prompt?: string;
    raw?: string;
  };
  data?: unknown;
  [key: string]: unknown;
}

interface InformeWithIAResumen extends Informe {
  iaResumen?: IAResumen;
}

const getFontFamily = (tipografia: string): string => {
  const fontMap: Record<string, string> = {
    Inter: 'Inter, system-ui, sans-serif',
    Roboto: 'Roboto, sans-serif',
    Montserrat: 'Montserrat, sans-serif',
    'Open Sans': 'Open Sans, sans-serif',
    Lato: 'Lato, sans-serif',
    Poppins: 'Poppins, sans-serif',
  };
  return fontMap[tipografia] || 'Inter, system-ui, sans-serif';
};

const ReportPreview: React.FC<ReportPreviewProps> = ({
  informe,
  informeCompuesto,
  isCompoundMode,
  addresses,
  isLoading,
  center: _center,
  onGenerateReport,
  savedId,
  tipoPrefa,
}) => {
  const { usuario } = useAuth();
  const [changeLog, setChangeLog] = useState<ChangeLogEntry[]>([]);
  const [fachadaImages, setFachadaImages] = useState<string[]>([]);
  const [documentosVisuales, setDocumentosVisuales] = useState<DocumentosVisuales>({
    croquis: [],
    perimetros: [],
    planosIndice: [],
  });

  const informeIdRef = useRef<string | undefined>(informe?._id);

  useEffect(() => {
    if (informe?._id !== informeIdRef.current) {
      informeIdRef.current = informe?._id;
    }
  }, [informe?._id]);

  const handleChangeLogUpdate = (newChangeLog: ChangeLogEntry[]) => {
    setChangeLog(newChangeLog);
  };

  const updateDocumentosVisuales = useCallback(() => {
    if (isCompoundMode && informeCompuesto) {
      const documentos = obtenerDocumentosVisuales(informeCompuesto.informesIndividuales);
      setDocumentosVisuales(documentos);
    } else if (informe && informe.edificabilidad?.link_imagen) {
      const linkImagen = informe.edificabilidad.link_imagen;
      setDocumentosVisuales({
        croquis: linkImagen.croquis_parcela ? [linkImagen.croquis_parcela] : [],
        perimetros: linkImagen.perimetro_manzana ? [linkImagen.perimetro_manzana] : [],
        planosIndice: linkImagen.plano_indice ? [linkImagen.plano_indice] : [],
      });
    }
  }, [isCompoundMode, informeCompuesto, informe]);

  useEffect(() => {
    updateDocumentosVisuales();
  }, [updateDocumentosVisuales]);

  const loadFachadaImages = useCallback(async () => {
    const reportData = getReportData(isCompoundMode, informe, informeCompuesto);
    const smp = reportData?.datosCatastrales?.smp;
    if (!smp) return;

    const potentialUrls = Array.from({ length: 5 }, (_, i) => generateFachadaUrl(smp, i));
    const validImages: string[] = [];

    for (const url of potentialUrls) {
      const exists = await checkImageExists(url);
      if (exists && !validImages.includes(url)) {
        validImages.push(url);
      }
    }

    setFachadaImages(validImages);
  }, [informe, informeCompuesto, isCompoundMode]);

  useEffect(() => {
    void loadFachadaImages();
  }, [loadFachadaImages]);

  const reportData = useMemo(
    () => getReportData(isCompoundMode, informe, informeCompuesto),
    [isCompoundMode, informe, informeCompuesto]
  );

  const customStyles = useMemo(() => {
    const personalizacion = usuario?.personalizacion || {};
    const colores = {
      fondoEncabezadosPrincipales: personalizacion.fondoEncabezadosPrincipales || '#3B82F6',
      colorTextoTablasPrincipales: personalizacion.colorTextoTablasPrincipales || '#FFFFFF',
      fondoEncabezadosSecundarios: personalizacion.fondoEncabezadosSecundarios || '#6B7280',
      colorTextoTablasSecundarias: personalizacion.colorTextoTablasSecundarias || '#FFFFFF',
    };
    const tipografia = personalizacion.tipografia || 'Inter';
    const fontFamily = getFontFamily(tipografia);

    return {
      fontFamily,
      '--color-primary': colores.fondoEncabezadosPrincipales,
      '--color-primary-text': colores.colorTextoTablasPrincipales,
      '--color-secondary': colores.fondoEncabezadosSecundarios,
      '--color-secondary-text': colores.colorTextoTablasSecundarias,
    } as React.CSSProperties;
  }, [usuario?.personalizacion]);

  const renderIAResumen = useCallback(() => {
    if (!informe || !(informe as InformeWithIAResumen).iaResumen) {
      return null;
    }

    const informeConIA = informe as InformeWithIAResumen;
    const iaResumen = informeConIA.iaResumen;

    if (!iaResumen) {
      return null;
    }

    if (iaResumen.debug) {
      return (
        <div className="border border-gray-300 dark:border-gray-700 rounded p-4 mb-6 bg-white dark:bg-gray-800 shadow space-y-4">
          <h2 className="text-lg font-semibold text-[#0369A1] dark:text-blue-400">
            Resumen IA (Capacidad Constructiva)
          </h2>
          <details open className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
            <summary className="cursor-pointer font-medium mb-2 dark:text-gray-200">
              Prompt enviado a Gemini
            </summary>
            <pre className="whitespace-pre-wrap text-xs overflow-x-auto max-h-64 dark:text-gray-300">
              {iaResumen.debug.prompt}
            </pre>
          </details>
          <details open className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
            <summary className="cursor-pointer font-medium mb-2 dark:text-gray-200">
              Respuesta cruda de Gemini
            </summary>
            <pre className="whitespace-pre-wrap text-xs overflow-x-auto max-h-64 dark:text-gray-300">
              {iaResumen.debug.raw}
            </pre>
          </details>
          <div>
            <h3 className="font-semibold mb-1 dark:text-gray-200">JSON procesado</h3>
            <pre className="whitespace-pre-wrap text-sm overflow-x-auto max-h-96 dark:text-gray-300">
              {JSON.stringify(iaResumen.data, null, 2)}
            </pre>
          </div>
        </div>
      );
    }

    return (
      <div className="border border-gray-300 dark:border-gray-700 rounded p-4 mb-6 bg-white dark:bg-gray-800 shadow space-y-4">
        <h2 className="text-lg font-semibold text-[#0369A1] dark:text-blue-400">
          Resumen IA (Capacidad Constructiva)
        </h2>
        <pre className="whitespace-pre-wrap text-sm overflow-x-auto max-h-96 dark:text-gray-300">
          {JSON.stringify(iaResumen, null, 2)}
        </pre>
      </div>
    );
  }, [informe]);

  if (isLoading) {
    return null;
  }

  return (
    <div className={styles['container']} style={customStyles}>
      <ReportHeader informe={reportData} isCompoundMode={isCompoundMode} addresses={addresses} />

      <div className={styles['pageBreak']}></div>

      {tipoPrefa === TIPO_PREFA.COMPLETA && (
        <>
          <ReportIndex
            informe={reportData}
            {...(informeCompuesto !== undefined && { informeCompuesto })}
            esInformeCompuesto={isCompoundMode && !!informeCompuesto}
            fachadaImages={fachadaImages}
            documentosVisuales={documentosVisuales}
          />

          <div className={styles['pageBreak']}></div>
        </>
      )}

      {renderIAResumen()}

      <ParcelDataPage
        informe={informe}
        {...(informeCompuesto !== undefined && { informeCompuesto })}
        esInformeCompuesto={isCompoundMode && !!informeCompuesto}
        tipoPrefa={tipoPrefa}
        onChangeLogUpdate={handleChangeLogUpdate}
      />

      <div className={styles['pageBreak']}></div>

      <ReportFooter
        informe={reportData}
        {...(onGenerateReport !== undefined && { onGenerateReport })}
        {...(savedId !== undefined && { savedId: savedId ?? null })}
        changeLog={changeLog}
      />
    </div>
  );
};

export default ReportPreview;

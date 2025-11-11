import React, { useState, useEffect } from 'react';
import { ReportPreviewProps, ChangeLogEntry, DocumentosVisuales } from '../../types/enums';
import { useAuth } from '../../contexts/AuthContext';
import { getReportData } from '../../utils/reportUtils';
import { obtenerDocumentosVisuales } from '../../services/consolidacionInformes';
import { generateFachadaUrl, checkImageExists } from '../../utils/parcelCalculations';
import ReportHeader from './ReportHeader';
import ReportIndex from './ReportIndex';
import ParcelDataPage from '../ParcelDataPage';
import ReportFooter from './ReportFooter';
import styles from '../../styles/ReportPreview.module.css';

const ReportPreview: React.FC<ReportPreviewProps> = ({
  informe,
  informeCompuesto,
  isCompoundMode,
  addresses,
  isLoading,
  center,
  onGenerateReport,
  onAcceptReport,
  tipoPrefa
}) => {
  const { usuario } = useAuth();
  const [changeLog, setChangeLog] = useState<ChangeLogEntry[]>([]);
  const [fachadaImages, setFachadaImages] = useState<string[]>([]);
  const [documentosVisuales, setDocumentosVisuales] = useState<DocumentosVisuales>({
    croquis: [],
    perimetros: [],
    planosIndice: []
  });

  const handleChangeLogUpdate = (newChangeLog: ChangeLogEntry[]) => {
    setChangeLog(newChangeLog);
  };

  useEffect(() => {
    if (isCompoundMode && informeCompuesto) {
      const documentos = obtenerDocumentosVisuales(informeCompuesto.informesIndividuales);
      setDocumentosVisuales(documentos);
    } else if (informe && informe.edificabilidad?.link_imagen) {
      const linkImagen = informe.edificabilidad.link_imagen;
      setDocumentosVisuales({
        croquis: linkImagen.croquis_parcela ? [linkImagen.croquis_parcela] : [],
        perimetros: linkImagen.perimetro_manzana ? [linkImagen.perimetro_manzana] : [],
        planosIndice: linkImagen.plano_indice ? [linkImagen.plano_indice] : []
      });
    }
  }, [isCompoundMode, informeCompuesto, informe]);

  useEffect(() => {
    const loadImages = async () => {
      const reportData = getReportData(isCompoundMode, informe, informeCompuesto);
      const smp = reportData?.datosCatastrales?.smp;
      if (!smp) return;
      
      const potentialUrls = Array.from({ length: 5 }, (_, i) => 
        generateFachadaUrl(smp, i)
      );
      
      const validImages: string[] = [];
      
      for (const url of potentialUrls) {
        const exists = await checkImageExists(url);
        if (exists) {
          if (!validImages.includes(url)) {
            validImages.push(url);
          }
        }
      }
      
      setFachadaImages(validImages);
    };
    
    loadImages();
  }, [informe, informeCompuesto, isCompoundMode]);

  if (isLoading) {
    return null;
  }

  const reportData = getReportData(isCompoundMode, informe, informeCompuesto);
  
  const personalizacion = usuario?.personalizacion || {};
  const colores = {
    fondoEncabezadosPrincipales: personalizacion.fondoEncabezadosPrincipales || '#3B82F6',
    colorTextoTablasPrincipales: personalizacion.colorTextoTablasPrincipales || '#FFFFFF',
    fondoEncabezadosSecundarios: personalizacion.fondoEncabezadosSecundarios || '#6B7280',
    colorTextoTablasSecundarias: personalizacion.colorTextoTablasSecundarias || '#FFFFFF'
  };
  const tipografia = personalizacion.tipografia || 'Inter';

  const fontFamily = tipografia === 'Inter' ? 'Inter, system-ui, sans-serif' :
                     tipografia === 'Roboto' ? 'Roboto, sans-serif' :
                     tipografia === 'Montserrat' ? 'Montserrat, sans-serif' :
                     tipografia === 'Open Sans' ? 'Open Sans, sans-serif' :
                     tipografia === 'Lato' ? 'Lato, sans-serif' :
                     tipografia === 'Poppins' ? 'Poppins, sans-serif' :
                     'Inter, system-ui, sans-serif';

  const customStyles = {
    fontFamily,
    '--color-primary': colores.fondoEncabezadosPrincipales,
    '--color-primary-text': colores.colorTextoTablasPrincipales,
    '--color-secondary': colores.fondoEncabezadosSecundarios,
    '--color-secondary-text': colores.colorTextoTablasSecundarias
  } as React.CSSProperties;
  
  return (
    <div className={styles.container} style={customStyles}>
      <ReportHeader 
        informe={reportData}
        isCompoundMode={isCompoundMode}
        addresses={addresses}
      />

      <div className={styles.pageBreak}></div>

      {tipoPrefa === 'prefa2' && (
        <>
          <ReportIndex 
            informe={reportData}
            informeCompuesto={informeCompuesto}
            esInformeCompuesto={isCompoundMode && !!informeCompuesto}
            fachadaImages={fachadaImages}
            documentosVisuales={documentosVisuales}
          />

          <div className={styles.pageBreak}></div>
        </>
      )}

      {informe && (informe as any).iaResumen && (
        <div className="border rounded p-4 mb-6 bg-white shadow space-y-4">
          <h2 className="text-lg font-semibold text-[#0369A1]">Resumen IA (Capacidad Constructiva)</h2>
          {(informe as any).iaResumen.debug ? (
            <>
              <details open className="bg-gray-100 p-3 rounded">
                <summary className="cursor-pointer font-medium mb-2">Prompt enviado a Gemini</summary>
                <pre className="whitespace-pre-wrap text-xs overflow-x-auto max-h-64">{(informe as any).iaResumen.debug.prompt}</pre>
              </details>
              <details open className="bg-gray-100 p-3 rounded">
                <summary className="cursor-pointer font-medium mb-2">Respuesta cruda de Gemini</summary>
                <pre className="whitespace-pre-wrap text-xs overflow-x-auto max-h-64">{(informe as any).iaResumen.debug.raw}</pre>
              </details>
              <div>
                <h3 className="font-semibold mb-1">JSON procesado</h3>
                <pre className="whitespace-pre-wrap text-sm overflow-x-auto max-h-96">{JSON.stringify((informe as any).iaResumen.data, null, 2)}</pre>
              </div>
            </>
          ) : (
            <pre className="whitespace-pre-wrap text-sm overflow-x-auto max-h-96">{JSON.stringify((informe as any).iaResumen, null, 2)}</pre>
          )}
        </div>
      )}

      <ParcelDataPage 
        informe={informe}
        informeCompuesto={informeCompuesto}
        esInformeCompuesto={isCompoundMode && !!informeCompuesto}
        tipoPrefa={tipoPrefa}
        onChangeLogUpdate={handleChangeLogUpdate}
      />

      <div className={styles.pageBreak}></div>

      <ReportFooter 
        informe={reportData}
        onGenerateReport={onGenerateReport}
        onAcceptReport={onAcceptReport}
        changeLog={changeLog}
      />
    </div>
  );
};

export default ReportPreview; 
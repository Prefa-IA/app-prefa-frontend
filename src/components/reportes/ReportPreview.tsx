import React from 'react';

import { useAuth } from '../../contexts/AuthContext';
import { useReportPreviewState } from '../../hooks/use-report-preview-state';
import { useReportPreviewStyles } from '../../hooks/use-report-preview-styles';
import { TIPO_PREFA } from '../../types/consulta-direccion';
import { ReportPreviewProps } from '../../types/enums';
import ParcelDataPage from '../ParcelDataPage';

import ReportFooter from './ReportFooter';
import ReportHeader from './ReportHeader';
import ReportIAResumen from './ReportIAResumen';
import ReportIndex from './ReportIndex';

import styles from '../../styles/ReportPreview.module.css';

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
  const { changeLog, fachadaImages, documentosVisuales, handleChangeLogUpdate, reportData } =
    useReportPreviewState({
      informe,
      informeCompuesto,
      isCompoundMode,
    });
  const customStyles = useReportPreviewStyles(usuario);

  if (isLoading || !reportData) {
    return null;
  }

  return (
    <div className={styles['container']} style={customStyles} data-report-container>
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

      <ReportIAResumen informe={informe} />

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

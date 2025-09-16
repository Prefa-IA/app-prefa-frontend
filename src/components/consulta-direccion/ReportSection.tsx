import React from 'react';
import ReportPreview from '../reportes/ReportPreview';
import { ReportSectionProps } from '../../types/enums';

const ReportSection: React.FC<ReportSectionProps> = ({
  resultado,
  informeCompuesto,
  modoCompuesto,
  direcciones,
  loading,
  center,
  onGenerateReport,
  onAcceptReport,
  tipoPrefa
}) => {
  if (!resultado && !loading) return null;

  return (
    <ReportPreview 
      informe={resultado!}
      informeCompuesto={modoCompuesto ? informeCompuesto || undefined : undefined}
      isCompoundMode={modoCompuesto}
      addresses={direcciones}
      isLoading={loading}
      center={center}
      onGenerateReport={onGenerateReport}
      onAcceptReport={onAcceptReport}
      tipoPrefa={tipoPrefa}
    />
  );
};

export default ReportSection; 
import React from 'react';

import { ReportSectionProps } from '../../types/enums';
import ReportPreview from '../reportes/ReportPreview';

const ReportSection: React.FC<ReportSectionProps> = ({
  resultado,
  informeCompuesto,
  modoCompuesto,
  direcciones,
  loading,
  center,
  onGenerateReport,
  savedId,
  tipoPrefa,
}) => {
  if (!resultado && !loading) return null;

  return (
    <ReportPreview
      informe={resultado!}
      {...(modoCompuesto && informeCompuesto ? { informeCompuesto } : {})}
      isCompoundMode={modoCompuesto}
      addresses={direcciones}
      isLoading={loading}
      center={center}
      onGenerateReport={onGenerateReport}
      savedId={savedId ?? null}
      tipoPrefa={tipoPrefa}
    />
  );
};

export default ReportSection;

import React from 'react';

import { Informe, InformeCompuesto, PrefaType } from '../../types/enums';

import { ReportSection } from './index';
import ReportContainer from './ReportContainer';

interface ConsultaReportContentProps {
  resultado: unknown;
  informeCompuesto: unknown;
  modoCompuesto: boolean;
  direcciones: string[];
  loading: boolean;
  center: { lat: number; lng: number };
  handleGenerateReport: () => Promise<void>;
  savedId: string | null;
  tipoPrefa: string;
}

const ConsultaReportContent: React.FC<ConsultaReportContentProps> = ({
  resultado,
  informeCompuesto,
  modoCompuesto,
  direcciones,
  loading,
  center,
  handleGenerateReport,
  savedId,
  tipoPrefa,
}) => (
  <ReportContainer>
    <ReportSection
      resultado={(resultado as Informe) || null}
      informeCompuesto={(informeCompuesto as InformeCompuesto) || null}
      modoCompuesto={modoCompuesto}
      direcciones={direcciones}
      loading={loading}
      center={center}
      onGenerateReport={() => {
        void handleGenerateReport();
      }}
      savedId={savedId}
      tipoPrefa={tipoPrefa as PrefaType}
    />
  </ReportContainer>
);

export default ConsultaReportContent;

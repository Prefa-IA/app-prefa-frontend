import React from 'react';

interface ReportPreviewHeaderProps {
  personalizacion: Record<string, unknown>;
  nombreInmobiliaria: string;
}

const ReportPreviewHeader: React.FC<ReportPreviewHeaderProps> = ({
  personalizacion,
  nombreInmobiliaria,
}) => (
  <div
    className="text-center p-4 rounded-lg mb-6"
    style={{
      backgroundColor:
        (personalizacion['fondoEncabezadosPrincipales'] as string | undefined) || '#ffffff',
    }}
  >
    <h1
      className="text-2xl font-bold"
      style={{
        color: (personalizacion['colorTextoTablasPrincipales'] as string | undefined) || '#000000',
      }}
    >
      {nombreInmobiliaria}
    </h1>
    <p
      className="text-sm opacity-75"
      style={{
        color: (personalizacion['colorTextoTablasPrincipales'] as string | undefined) || '#000000',
      }}
    >
      Informe de Prefactibilidad
    </p>
  </div>
);

export default ReportPreviewHeader;

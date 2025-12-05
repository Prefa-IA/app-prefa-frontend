import React from 'react';

interface ReportPreviewTablesProps {
  personalizacion: Record<string, unknown>;
}

const ReportPreviewTables: React.FC<ReportPreviewTablesProps> = ({ personalizacion }) => (
  <>
    {/* Tabla principal */}
    <div className="border rounded-lg overflow-hidden mb-6 border-gray-200 dark:border-gray-700">
      <div
        className="p-3 font-semibold text-center"
        style={{
          backgroundColor:
            (personalizacion['fondoEncabezadosPrincipales'] as string | undefined) || '#ffffff',
          color:
            (personalizacion['colorTextoTablasPrincipales'] as string | undefined) || '#000000',
        }}
      >
        DATOS DEL TERRENO (Tabla Principal)
      </div>
      <div className="grid grid-cols-2">
        <div className="border-r p-3 bg-gray-50 dark:bg-gray-700 font-medium">Superficie</div>
        <div className="p-3">159.6 m²</div>
        <div className="border-r border-t p-3 bg-gray-50 dark:bg-gray-700 font-medium">Frente</div>
        <div className="border-t p-3">7.60 m</div>
        <div className="border-r border-t p-3 bg-gray-50 dark:bg-gray-700 font-medium">
          Zonificación
        </div>
        <div className="border-t p-3">R2a I</div>
      </div>
    </div>

    {/* Tabla secundaria */}
    <div className="border rounded-lg overflow-hidden border-gray-200 dark:border-gray-700">
      <div
        className="p-3 font-semibold text-center"
        style={{
          backgroundColor:
            (personalizacion['fondoEncabezadosSecundarios'] as string | undefined) || '#f3f4f6',
          color:
            (personalizacion['colorTextoTablasSecundarias'] as string | undefined) || '#374151',
        }}
      >
        DATOS SECUNDARIOS (Tabla Secundaria)
      </div>
      <div className="grid grid-cols-2">
        <div className="border-r p-3 bg-gray-50 dark:bg-gray-700 font-medium">FOT</div>
        <div className="p-3">2.0</div>
        <div className="border-r border-t p-3 bg-gray-50 dark:bg-gray-700 font-medium">
          Altura Máxima
        </div>
        <div className="border-t p-3">12.0 m</div>
      </div>
    </div>
  </>
);

export default ReportPreviewTables;

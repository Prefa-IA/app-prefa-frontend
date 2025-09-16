import React from 'react';

interface Props { onClose: () => void; personalizacion: any; nombreInmobiliaria: string }

const ReportPreviewModal: React.FC<Props> = ({ onClose, personalizacion, nombreInmobiliaria }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-auto">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Vista Previa del Informe</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div className="p-6" style={{ fontFamily: personalizacion.tipografia }}>
        <div className="text-center p-4 rounded-lg mb-6" style={{ backgroundColor: personalizacion.fondoEncabezadosPrincipales }}>
          <h1 className="text-2xl font-bold" style={{ color: personalizacion.colorTextoTablasPrincipales }}>{nombreInmobiliaria}</h1>
          <p className="text-sm opacity-75" style={{ color: personalizacion.colorTextoTablasPrincipales }}>Informe de Prefactibilidad</p>
        </div>
        {/* Tabla principal */}
        <div className="border rounded-lg overflow-hidden mb-6">
          <div className="p-3 font-semibold text-center" style={{ backgroundColor: personalizacion.fondoEncabezadosPrincipales, color: personalizacion.colorTextoTablasPrincipales }}>
            DATOS DEL TERRENO (Tabla Principal)
          </div>
          <div className="grid grid-cols-2">
            <div className="border-r p-3 bg-gray-50 font-medium">Superficie</div>
            <div className="p-3">159.6 m²</div>
            <div className="border-r border-t p-3 bg-gray-50 font-medium">Frente</div>
            <div className="border-t p-3">7.60 m</div>
            <div className="border-r border-t p-3 bg-gray-50 font-medium">Zonificación</div>
            <div className="border-t p-3">R2a I</div>
          </div>
        </div>

        {/* Tabla secundaria */}
        <div className="border rounded-lg overflow-hidden">
          <div className="p-3 font-semibold text-center" style={{ backgroundColor: personalizacion.fondoEncabezadosSecundarios, color: personalizacion.colorTextoTablasSecundarias }}>
            DATOS SECUNDARIOS (Tabla Secundaria)
          </div>
          <div className="grid grid-cols-2">
            <div className="border-r p-3 bg-gray-50 font-medium">FOT</div>
            <div className="p-3">2.0</div>
            <div className="border-r border-t p-3 bg-gray-50 font-medium">Altura Máxima</div>
            <div className="border-t p-3">12.0 m</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ReportPreviewModal; 
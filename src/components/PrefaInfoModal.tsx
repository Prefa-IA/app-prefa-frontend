import React from 'react';

interface Props {
  onClose: () => void;
}

const PrefaInfoModal: React.FC<Props> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60 p-4 select-none">
    <div className="relative bg-white rounded-3xl shadow-2xl ring-1 ring-indigo-100 max-w-lg w-full p-8 space-y-6 text-sm overflow-auto max-h-[90vh] animate-[fadeIn_0.25s_ease-out]">
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Elegí el tipo de informe que necesitás.</h2>
      <div className="space-y-2">
        <p><strong>Prefactibilidad Simple</strong> (1 crédito)</p>
        <p>Ideal para un análisis rápido de un solo lote. Incluye los datos catastrales básicos, el cálculo de plusvalía y la normativa principal. No incluye los detalles de croquis, fachadas ni perfiles de manzana.</p>
        <p className="pt-2"><strong>Prefactibilidad Completa</strong> (2 créditos)</p>
        <p>El informe más detallado para tu proyecto. Incluye toda la información de la prefactibilidad de tipo simple, y además, los planos y las imágenes de la fachada y el perímetro de la manzana. </p>
        <p className="pt-2"><strong>Prefactibilidad Compuesta</strong> (3 créditos)</p>
        <p>Perfecto para desarrollos inmobiliarios. Este informe unifica el análisis de varios lotes linderos en una sola prefactibilidad de tipo completa.</p>
      </div>
      <div className="pt-6 text-center">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg shadow-md hover:from-indigo-700 hover:to-indigo-800 transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>
  </div>
);

export default PrefaInfoModal; 
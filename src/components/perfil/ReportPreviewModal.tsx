import React from 'react';

import { ReportPreviewModalProps } from '../../types/components';

import ReportPreviewHeader from './ReportPreviewHeader';
import ReportPreviewTables from './ReportPreviewTables';

const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({
  onClose,
  personalizacion,
  nombreInmobiliaria,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white dark:bg-gray-800 dark:text-gray-100 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-auto custom-scrollbar">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Vista Previa del Informe</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div
        className="p-6"
        style={{
          fontFamily: (personalizacion['tipografia'] as string | undefined) || 'Arial',
        }}
      >
        <ReportPreviewHeader
          personalizacion={personalizacion}
          nombreInmobiliaria={nombreInmobiliaria}
        />
        <ReportPreviewTables personalizacion={personalizacion} />
      </div>
    </div>
  </div>
);

export default ReportPreviewModal;

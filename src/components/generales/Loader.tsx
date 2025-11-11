import React from 'react';
import { LoaderProps } from '../../types/components';

const Loader: React.FC<LoaderProps> = ({ message = 'Procesando solicitud...' }) => {
  return (
    <div className="rounded-md bg-blue-50 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-blue-800">Procesando solicitud</h3>
          <div className="mt-2 text-sm text-blue-700">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader; 
import React, { useState } from 'react';

import TermsAndConditions from '../../usuario/TermsAndConditions';

interface StepTermsConditionsProps {
  onAcceptChange: (accepted: boolean) => void;
}

export const StepTermsConditions: React.FC<StepTermsConditionsProps> = ({ onAcceptChange }) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setAcceptedTerms(checked);
    onAcceptChange(checked);
  };

  return (
    <div className="space-y-6 w-full">
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Términos y Condiciones
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
          Al iniciar sesión con Google, es necesario que aceptes nuestros Términos y Condiciones
          para continuar utilizando la plataforma. Esta aceptación es requerida para garantizar el
          uso adecuado de nuestros servicios y proteger tanto tus derechos como los nuestros.
        </p>
      </div>

      <div className="flex items-start justify-center space-x-3 pt-4">
        <input
          id="acceptTermsCheckbox"
          type="checkbox"
          checked={acceptedTerms}
          onChange={handleCheckboxChange}
          className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
        />
        <label
          htmlFor="acceptTermsCheckbox"
          className="text-gray-700 dark:text-gray-300 text-base cursor-pointer"
        >
          Acepto los{' '}
          <button
            type="button"
            onClick={() => setShowTermsModal(true)}
            className="text-primary-600 dark:text-primary-400 underline hover:text-primary-700 dark:hover:text-primary-300"
          >
            Términos y Condiciones
          </button>
        </label>
      </div>

      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[10000]">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-3xl w-full max-h-[80vh] overflow-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Términos y Condiciones
              </h3>
              <button
                onClick={() => setShowTermsModal(false)}
                className="text-gray-400 hover:text-gray-600"
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
            <div className="p-6 space-y-4 text-sm leading-relaxed">
              <TermsAndConditions onClose={() => setShowTermsModal(false)} />
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setShowTermsModal(false)}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

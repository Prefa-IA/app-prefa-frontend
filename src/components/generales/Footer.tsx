import React, { useState } from 'react';
import TermsAndConditions from '../usuario/TermsAndConditions';
import PrivacyPolicy from '../usuario/PrivacyPolicy';

const Footer: React.FC = () => {
  const [showTyC, setShowTyC] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-4 mt-8 border-t border-gray-200 dark:border-gray-700">
      <div className="w-[95%] lg:w-[63%] max-w-8xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-300">
        <div className="mb-2 sm:mb-0">Todos los derechos reservados © {year} Prefa-IA</div>
        <div className="space-x-4">
          <button onClick={() => setShowTyC(true)} className="text-primary-600 dark:text-primary-400 hover:underline">Términos y Condiciones</button>
          <button onClick={() => setShowPrivacy(true)} className="text-primary-600 dark:text-primary-400 hover:underline">Políticas de Privacidad</button>
        </div>
      </div>

      {showTyC && (
        <Modal onClose={() => setShowTyC(false)} title="Términos y Condiciones">
          <TermsAndConditions onClose={() => setShowTyC(false)} />
        </Modal>
      )}

      {showPrivacy && (
        <Modal onClose={() => setShowPrivacy(false)} title="Políticas de Privacidad">
          <PrivacyPolicy onClose={() => setShowPrivacy(false)} />
        </Modal>
      )}
    </footer>
  );
};

interface ModalProps { title:string; onClose:() => void; children: React.ReactNode; }

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
    <div className="bg-white dark:bg-gray-900 rounded-xl max-w-3xl w-full max-h-[80vh] overflow-auto shadow-lg custom-scrollbar text-gray-900 dark:text-gray-100">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-6 space-y-4 text-sm leading-relaxed">
        {children}
      </div>
    </div>
  </div>
);

export default Footer;

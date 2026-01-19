import React, { useState } from 'react';

interface SMPRequestModalProps {
  direccion: string;
  onConfirm: (smp: string) => void;
  onCancel: () => void;
}

const SMPRequestModal: React.FC<SMPRequestModalProps> = ({ direccion, onConfirm, onCancel }) => {
  const [smp, setSmp] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = () => {
    const cleanedSmp = smp.trim();

    // Validar formato básico de SMP (ejemplo: 043-109-011)
    if (!cleanedSmp) {
      setError('Por favor, ingrese un código SMP válido');
      return;
    }

    // Validar formato básico (debe tener al menos algunos números y guiones)
    const smpPattern = /^[\d-]+$/;
    if (!smpPattern.test(cleanedSmp)) {
      setError('El código SMP debe contener solo números y guiones (ejemplo: 043-109-011)');
      return;
    }

    setError(null);
    onConfirm(cleanedSmp);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg w-full max-w-md p-6 mx-4 sm:mx-0">
        <h3 className="text-lg font-semibold mb-4">SMP requerido</h3>

        <div className="mb-4 text-sm space-y-2">
          <p>
            No se pudo obtener automáticamente el código SMP para la dirección:{' '}
            <span className="font-semibold text-primary-600 dark:text-primary-400">{direccion}</span>
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            El servicio del catastro no encontró la parcela por coordenadas. Ingrese el código SMP manualmente.
          </p>
        </div>

        <div className="mb-4">
          <label htmlFor="smp-input" className="block text-sm font-medium mb-2">
            Código SMP:
          </label>
          <input
            id="smp-input"
            type="text"
            value={smp}
            onChange={(e) => {
              setSmp(e.target.value);
              setError(null);
            }}
            onKeyPress={handleKeyPress}
            placeholder="Ejemplo: 043-109-011"
            className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500'
            } focus:outline-none focus:ring-1`}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
          {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-md bg-primary-600 dark:bg-primary-700 text-white hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!smp.trim()}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SMPRequestModal;

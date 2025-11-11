import React, { useState } from 'react';
import { UvaInputModalProps } from '../types/components';

const UvaInputModal: React.FC<UvaInputModalProps> = ({ defaultValue, onConfirm, onCancel }) => {
  const [valor, setValor] = useState<string>(defaultValue.toString());
  const isValid = !isNaN(Number(valor)) && Number(valor) > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4 text-sm">
        <h2 className="text-lg font-semibold text-gray-800">Valor de UVA</h2>
        <p className="text-sm">¿Qué valor de UVA quiere usar para la tasación de este terreno?</p>
        <input
          type="number"
          className="w-full border rounded px-2 py-1"
          value={valor}
          onChange={e => setValor(e.target.value)}
        />
        <div className="flex justify-end space-x-2 pt-2 text-sm">
          <button
            onClick={onCancel}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={() => isValid && onConfirm(Number(valor))}
            disabled={!isValid}
            className={`px-3 py-1 rounded text-white ${isValid ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300 cursor-not-allowed'}`}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UvaInputModal; 
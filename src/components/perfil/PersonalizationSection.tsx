import React from 'react';
import ColorPicker from './ColorPicker';
import FontSelector from './FontSelector';
import { PencilIcon } from '@heroicons/react/outline';

interface Props {
  editMode: boolean;
  personalizacion: any;
  onPersonalizacionChange: (field: string, value: string) => void;
  onToggleEdit: () => void;
  onSave: () => void;
}

const PersonalizationSection: React.FC<Props> = ({ editMode, personalizacion, onPersonalizacionChange, onToggleEdit, onSave }) => {
  const [btnDisabled, setBtnDisabled] = React.useState(false);

  const handleSaveClick = () => {
    if (btnDisabled) return; // seguridad extra
    onSave();
    setBtnDisabled(true);
    setTimeout(() => setBtnDisabled(false), 1500);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Personalizá tus informes</h3>
        </div>
        <button onClick={onToggleEdit} className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg">
          <PencilIcon className="w-4 h-4" />
          <span className="font-medium">{editMode ? 'Cancelar' : 'Editar'}</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-6">
          <ColorPicker label="Fondo principal" description="Color de fondo para encabezados de tablas principales" value={personalizacion.fondoEncabezadosPrincipales} onChange={v=>onPersonalizacionChange('fondoEncabezadosPrincipales',v)} disabled={!editMode} />
          <ColorPicker label="Texto Principal" description="Color de texto para tablas principales" value={personalizacion.colorTextoTablasPrincipales} onChange={v=>onPersonalizacionChange('colorTextoTablasPrincipales',v)} disabled={!editMode} />
        </div>
        <div className="space-y-6">
          <ColorPicker label="Fondo secundario" description="Color de fondo para encabezados de tablas secundarias" value={personalizacion.fondoEncabezadosSecundarios} onChange={v=>onPersonalizacionChange('fondoEncabezadosSecundarios',v)} disabled={!editMode} />
          <ColorPicker label="Texto secundario" description="Color de texto para tablas secundarias" value={personalizacion.colorTextoTablasSecundarias} onChange={v=>onPersonalizacionChange('colorTextoTablasSecundarias',v)} disabled={!editMode} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <FontSelector value={personalizacion.tipografia} onChange={v=>onPersonalizacionChange('tipografia',v)} disabled={!editMode} />
      </div>
      {editMode && (
        <div className="flex justify-end">
          <button
            onClick={handleSaveClick}
            disabled={btnDisabled}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar Cambios
          </button>
        </div>
      )}
    </div>
  );
};

export default PersonalizationSection; 
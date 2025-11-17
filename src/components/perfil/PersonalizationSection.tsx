import React from 'react';
import { PencilIcon } from '@heroicons/react/outline';

import { PersonalizationSectionProps } from '../../types/components';
import { useButtonCooldown } from '../../utils/button-utils';

import ColorPicker from './ColorPicker';
import FontSelector from './FontSelector';

const PersonalizationSection: React.FC<PersonalizationSectionProps> = ({
  editMode,
  personalizacion,
  onPersonalizacionChange,
  onToggleEdit,
  onSave,
}) => {
  const { cooldown, handleClick } = useButtonCooldown(1500);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
            Personalizá tus informes
          </h3>
        </div>
        <button
          onClick={onToggleEdit}
          className="flex items-center space-x-2 px-4 py-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-800 rounded-lg"
        >
          <PencilIcon className="w-4 h-4" />
          <span className="font-medium">{editMode ? 'Cancelar' : 'Editar'}</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="space-y-6">
          <ColorPicker
            label="Fondo principal"
            description="Color de fondo para encabezados de tablas principales"
            value={(personalizacion['fondoEncabezadosPrincipales'] as string) || '#ffffff'}
            onChange={(v) => onPersonalizacionChange('fondoEncabezadosPrincipales', v)}
            disabled={!editMode}
          />
          <ColorPicker
            label="Texto Principal"
            description="Color de texto para tablas principales"
            value={(personalizacion['colorTextoTablasPrincipales'] as string) || '#000000'}
            onChange={(v) => onPersonalizacionChange('colorTextoTablasPrincipales', v)}
            disabled={!editMode}
          />
        </div>
        <div className="space-y-6">
          <ColorPicker
            label="Fondo secundario"
            description="Color de fondo para encabezados de tablas secundarias"
            value={(personalizacion['fondoEncabezadosSecundarios'] as string) || '#f3f4f6'}
            onChange={(v) => onPersonalizacionChange('fondoEncabezadosSecundarios', v)}
            disabled={!editMode}
          />
          <ColorPicker
            label="Texto secundario"
            description="Color de texto para tablas secundarias"
            value={(personalizacion['colorTextoTablasSecundarias'] as string) || '#374151'}
            onChange={(v) => onPersonalizacionChange('colorTextoTablasSecundarias', v)}
            disabled={!editMode}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <FontSelector
          value={(personalizacion['tipografia'] as string) || 'Arial'}
          onChange={(v) => onPersonalizacionChange('tipografia', v)}
          disabled={!editMode}
        />
      </div>
      {editMode && (
        <div className="flex justify-end">
          <button
            onClick={() => handleClick(onSave)}
            disabled={cooldown}
            className="px-6 py-3 bg-primary-600 dark:bg-primary-700 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar Cambios
          </button>
        </div>
      )}
    </div>
  );
};

export default PersonalizationSection;

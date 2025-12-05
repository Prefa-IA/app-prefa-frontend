import React from 'react';

import PersonalizationSection from '../perfil/PersonalizationSection';
import ProfileCard from '../perfil/ProfileCard';

import { BillingSection } from './BillingSection';

interface PerfilUsuarioMainProps {
  logoUrl: string | null;
  editMode: boolean;
  personalizacion: {
    fondoEncabezadosPrincipales?: string;
    colorTextoTablasPrincipales?: string;
    fondoEncabezadosSecundarios?: string;
    colorTextoTablasSecundarias?: string;
    tipografia?: string;
  };
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogoDelete: () => void;
  onPersonalizacionChange: (field: string, value: string) => void;
  onToggleEdit: () => void;
  onSave: () => void;
}

const PerfilUsuarioMain: React.FC<PerfilUsuarioMainProps> = ({
  logoUrl,
  editMode,
  personalizacion,
  onLogoUpload,
  onLogoDelete,
  onPersonalizacionChange,
  onToggleEdit,
  onSave,
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="lg:col-span-1 space-y-6">
      <ProfileCard
        logoUrl={logoUrl}
        onLogoUpload={onLogoUpload}
        {...(logoUrl && { onLogoDelete })}
      />
      <BillingSection />
    </div>
    <div className="lg:col-span-2">
      <PersonalizationSection
        editMode={editMode}
        personalizacion={personalizacion}
        onPersonalizacionChange={onPersonalizacionChange}
        onToggleEdit={onToggleEdit}
        onSave={onSave}
      />
    </div>
  </div>
);

export default PerfilUsuarioMain;

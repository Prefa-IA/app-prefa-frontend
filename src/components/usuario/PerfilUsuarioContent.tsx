import React from 'react';

import PerfilUsuarioActions from './PerfilUsuarioActions';
import PerfilUsuarioHeader from './PerfilUsuarioHeader';
import PerfilUsuarioMain from './PerfilUsuarioMain';
import PerfilUsuarioModals from './PerfilUsuarioModals';

interface PerfilUsuarioContentProps {
  logoUrl: string | null;
  editMode: boolean;
  personalizacion: {
    fondoEncabezadosPrincipales?: string;
    colorTextoTablasPrincipales?: string;
    fondoEncabezadosSecundarios?: string;
    colorTextoTablasSecundarias?: string;
    colorAcento?: string;
    tipografia?: string;
    logo?: string;
  };
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleLogoDeleteClick: () => Promise<void>;
  handlePersonalizacionChange: (field: string, value: string) => void;
  setEditMode: (editMode: boolean) => void;
  handleSavePersonalization: () => Promise<void>;
  setShowPreview: (show: boolean) => void;
  navigate: (href: string) => void;
  setShowSupport: (show: boolean) => void;
  usuarioNombre: string;
  showPreview: boolean;
  showSupport: boolean;
  confirmLogo: boolean;
  confirmLogoMessage: React.ReactNode;
  setConfirmLogo: (confirm: boolean) => void;
  handleLogoDeleteConfirm: () => void;
  confirmUpload: boolean;
  cancelUpload: () => void;
  handleLogoUploadConfirm: () => Promise<void>;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

const PerfilUsuarioContent: React.FC<PerfilUsuarioContentProps> = ({
  logoUrl,
  editMode,
  personalizacion,
  handleLogoUpload,
  handleLogoDeleteClick,
  handlePersonalizacionChange,
  setEditMode,
  handleSavePersonalization,
  setShowPreview,
  navigate,
  setShowSupport,
  usuarioNombre,
  showPreview,
  showSupport,
  confirmLogo,
  confirmLogoMessage,
  setConfirmLogo,
  handleLogoDeleteConfirm,
  confirmUpload,
  cancelUpload,
  handleLogoUploadConfirm,
  showModal,
  setShowModal,
}) => (
  <>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <PerfilUsuarioHeader />
        <PerfilUsuarioMain
          logoUrl={logoUrl}
          editMode={editMode}
          personalizacion={personalizacion}
          onLogoUpload={(e) => {
            void handleLogoUpload(e);
          }}
          onLogoDelete={() => {
            void handleLogoDeleteClick();
          }}
          onPersonalizacionChange={handlePersonalizacionChange}
          onToggleEdit={() => setEditMode(!editMode)}
          onSave={() => {
            void handleSavePersonalization();
          }}
        />
        <PerfilUsuarioActions
          onPreviewClick={() => setShowPreview(true)}
          onSubscriptionClick={() => navigate('/suscripcion')}
          onSupportClick={() => setShowSupport(true)}
        />
      </div>
    </div>
    <PerfilUsuarioModals
      showPreview={showPreview}
      setShowPreview={setShowPreview}
      personalizacion={personalizacion}
      nombreInmobiliaria={usuarioNombre}
      showSupport={showSupport}
      setShowSupport={setShowSupport}
      confirmLogo={confirmLogo}
      confirmLogoMessage={confirmLogoMessage}
      setConfirmLogo={setConfirmLogo}
      handleLogoDeleteConfirm={handleLogoDeleteConfirm}
      confirmUpload={confirmUpload}
      cancelUpload={cancelUpload}
      handleLogoUploadConfirm={async () => {
        await handleLogoUploadConfirm();
      }}
      showModal={showModal}
      setShowModal={setShowModal}
    />
  </>
);

export default PerfilUsuarioContent;

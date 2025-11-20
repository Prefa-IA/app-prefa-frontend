import React from 'react';

import { usePerfilUsuarioState } from '../../hooks/use-perfil-usuario-state';

import PerfilUsuarioContent from './PerfilUsuarioContent';

const PerfilUsuario: React.FC = () => {
  const state = usePerfilUsuarioState();

  if (!state.usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8" data-tutorial="mi-perfil">
      <PerfilUsuarioContent
        logoUrl={state.logoUrl}
        editMode={state.editMode}
        personalizacion={state.personalizacion}
        handleLogoUpload={state.handleLogoUpload}
        handleLogoDeleteClick={state.handleLogoDeleteClick}
        handlePersonalizacionChange={state.handlePersonalizacionChange}
        setEditMode={state.setEditMode}
        handleSavePersonalization={state.handleSavePersonalization}
        setShowPreview={state.setShowPreview}
        navigate={state.navigate}
        setShowSupport={state.setShowSupport}
        usuarioNombre={state.usuario.nombre}
        showPreview={state.showPreview}
        showSupport={state.showSupport}
        confirmLogo={state.confirmLogo}
        confirmLogoMessage={state.confirmLogoMessage}
        setConfirmLogo={state.setConfirmLogo}
        handleLogoDeleteConfirm={() => {
          void state.handleLogoDeleteConfirm();
        }}
        confirmUpload={state.confirmUpload}
        cancelUpload={state.cancelUpload}
        handleLogoUploadConfirm={async () => {
          await state.handleLogoUploadConfirm();
        }}
        showModal={state.showModal}
        setShowModal={state.setShowModal}
      />
    </div>
  );
};

export default PerfilUsuario;

import { useState } from 'react';

import { useAuth } from '../contexts/AuthContext';

import { useLogoManagement } from './use-logo-management';
import { usePerfilNavigation } from './use-perfil-navigation';
import { usePerfilPersonalization } from './use-perfil-personalization';

export const usePerfilUsuarioState = () => {
  const { usuario, updatePersonalization, saveTempLogo, getTempLogo, clearTempLogo } = useAuth();
  const [_logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const {
    handleLogoUpload,
    handleLogoUploadConfirm,
    cancelUpload,
    handleLogoDeleteClick,
    handleLogoDeleteConfirm,
    confirmLogoMessage,
    confirmUpload,
    confirmLogo,
    setConfirmLogo,
  } = useLogoManagement({
    saveTempLogo,
    clearTempLogo,
    getTempLogo,
    setLogoFile,
    setLogoUrl,
  });

  const { navigate } = usePerfilNavigation({
    getTempLogo,
    setLogoUrl,
    setShowModal,
  });

  const {
    editMode,
    setEditMode,
    personalizacion,
    loading,
    handlePersonalizacionChange,
    handleSavePersonalization,
  } = usePerfilPersonalization({
    usuario,
    updatePersonalization,
    logoUrl,
  });

  return {
    usuario,
    editMode,
    setEditMode,
    logoUrl,
    showPreview,
    setShowPreview,
    personalizacion,
    loading,
    showSupport,
    setShowSupport,
    showModal,
    setShowModal,
    handlePersonalizacionChange,
    handleSavePersonalization,
    handleLogoUpload,
    handleLogoUploadConfirm,
    cancelUpload,
    handleLogoDeleteClick,
    handleLogoDeleteConfirm,
    confirmLogoMessage,
    confirmUpload,
    confirmLogo,
    setConfirmLogo,
    navigate,
  };
};

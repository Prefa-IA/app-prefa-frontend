import { useLogoDelete } from './use-logo-delete';
import { useLogoUpload } from './use-logo-upload';

interface UseLogoManagementProps {
  saveTempLogo: (file: File) => Promise<string>;
  clearTempLogo: () => Promise<void>;
  getTempLogo: () => string | null;
  setLogoFile: (file: File | null) => void;
  setLogoUrl: (url: string | null) => void;
}

export const useLogoManagement = ({
  saveTempLogo,
  clearTempLogo,
  getTempLogo: _getTempLogo,
  setLogoFile,
  setLogoUrl,
}: UseLogoManagementProps) => {
  const {
    handleLogoUpload,
    handleLogoUploadConfirm,
    cancelUpload,
    confirmLogoMessage: uploadMessage,
    confirmUpload,
  } = useLogoUpload({ saveTempLogo, setLogoFile, setLogoUrl });

  const {
    handleLogoDeleteClick,
    handleLogoDeleteConfirm,
    confirmLogoMessage: deleteMessage,
    confirmLogo,
    setConfirmLogo,
  } = useLogoDelete({ clearTempLogo, setLogoUrl });

  const confirmLogoMessage = uploadMessage || deleteMessage;

  return {
    handleLogoUpload,
    handleLogoUploadConfirm,
    cancelUpload,
    handleLogoDeleteClick,
    handleLogoDeleteConfirm,
    confirmLogoMessage,
    confirmUpload,
    confirmLogo,
    setConfirmLogo,
  };
};

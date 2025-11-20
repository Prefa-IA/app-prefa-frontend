import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import { auth as authService } from '../services/api';
import { createLogoUploadMessage } from '../utils/logo-utils';

interface UseLogoUploadProps {
  saveTempLogo: (file: File) => Promise<string>;
  setLogoFile: (file: File | null) => void;
  setLogoUrl: (url: string | null) => void;
}

export const useLogoUpload = ({ saveTempLogo, setLogoFile, setLogoUrl }: UseLogoUploadProps) => {
  const [pendingLogoFile, setPendingLogoFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [confirmLogoMessage, setConfirmLogoMessage] = useState<React.ReactNode>('');
  const [confirmUpload, setConfirmUpload] = useState(false);

  const handleLogoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { restantes } = await authService.getLogoRemaining();
      if (restantes <= 0) {
        toast.error('Ya alcanzaste el límite de cambios de logo este mes');
        return;
      }
      setPendingLogoFile(file);
      const url = URL.createObjectURL(file);
      setPreviewSrc(url);
      setConfirmLogoMessage(createLogoUploadMessage(restantes, url));
      setConfirmUpload(true);
    } catch (error) {
      console.error('Error obteniendo cambios restantes:', error);
      toast.error('No se pudo verificar el límite de cambios');
    }
  }, []);

  const handleLogoUploadConfirm = useCallback(async () => {
    if (!pendingLogoFile) {
      setConfirmUpload(false);
      return;
    }
    try {
      const base64Logo = await saveTempLogo(pendingLogoFile);
      setLogoFile(pendingLogoFile);
      setLogoUrl(base64Logo);
    } catch (error) {
      console.error('Error al guardar logo:', error);
      toast.error('Error al procesar el logo');
    } finally {
      if (previewSrc) {
        URL.revokeObjectURL(previewSrc);
        setPreviewSrc(null);
      }
      setPendingLogoFile(null);
      setConfirmUpload(false);
    }
  }, [pendingLogoFile, previewSrc, saveTempLogo, setLogoFile, setLogoUrl]);

  const cancelUpload = useCallback(() => {
    if (previewSrc) {
      URL.revokeObjectURL(previewSrc);
      setPreviewSrc(null);
    }
    setConfirmUpload(false);
  }, [previewSrc]);

  return {
    handleLogoUpload,
    handleLogoUploadConfirm,
    cancelUpload,
    confirmLogoMessage,
    confirmUpload,
    previewSrc,
  };
};

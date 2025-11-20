import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import { auth as authService } from '../services/api';

interface UseLogoDeleteProps {
  clearTempLogo: () => Promise<void>;
  setLogoUrl: (url: string | null) => void;
}

export const useLogoDelete = ({ clearTempLogo, setLogoUrl }: UseLogoDeleteProps) => {
  const [confirmLogoMessage, setConfirmLogoMessage] = useState<React.ReactNode>('');
  const [confirmLogo, setConfirmLogo] = useState(false);

  const handleLogoDeleteClick = useCallback(async () => {
    try {
      const { restantes } = await authService.getLogoRemaining();
      setConfirmLogoMessage(
        `¿Estás seguro de querer eliminar el logo? Recuerda que solo tienes ${restantes} cambios disponibles este mes`
      );
    } catch {
      setConfirmLogoMessage('¿Estás seguro de querer eliminar el logo?');
    }
    setConfirmLogo(true);
  }, []);

  const handleLogoDeleteConfirm = useCallback(async () => {
    try {
      await clearTempLogo();
      setLogoUrl(null);
    } catch (e: unknown) {
      console.error('Error eliminando logo en backend', e);
      const mensaje =
        (e as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'No se pudo eliminar el logo';
      toast.error(mensaje);
    } finally {
      setConfirmLogo(false);
    }
  }, [clearTempLogo, setLogoUrl]);

  return {
    handleLogoDeleteClick,
    handleLogoDeleteConfirm,
    confirmLogoMessage,
    confirmLogo,
    setConfirmLogo,
  };
};

import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import { prefactibilidad } from '../services/api';
import { Informe } from '../types/enums';

export const useInformesShare = () => {
  const [sharingIds, setSharingIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleCompartir = useCallback(
    async (informe: Informe) => {
      const id = informe._id as string;
      if (!id || sharingIds.includes(id)) return;

      setSharingIds((prev) => [...prev, id]);
      try {
        const { shareToken } = await prefactibilidad.generarTokenCompartir(id);

        const baseUrl = window.location.origin;
        const shareUrl = `${baseUrl}/compartir/${shareToken}`;

        await navigator.clipboard.writeText(shareUrl);

        toast.success('Enlace copiado al portapapeles. Puedes compartirlo con quien quieras.', {
          autoClose: 5000,
        });
      } catch (error) {
        console.error('Error al compartir informe:', error);
        setError('Error al generar el enlace de compartir.');
        toast.error('Error al generar el enlace de compartir. Por favor, intenta nuevamente.');
      } finally {
        setSharingIds((prev) => prev.filter((sid) => sid !== id));
      }
    },
    [sharingIds]
  );

  return { handleCompartir, sharingIds, error, setError };
};

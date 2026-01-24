import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import { prefactibilidad } from '../services/api';
import { Informe } from '../types/enums';

const COOLDOWN_MS = 1500;

export const useInformesShare = () => {
  const [sharingIds, setSharingIds] = useState<string[]>([]);
  const [cooldownIds, setCooldownIds] = useState<string[]>([]);

  const handleCompartir = useCallback(
    async (informe: Informe) => {
      const id = informe._id as string;
      if (!id || sharingIds.includes(id) || cooldownIds.includes(id)) return;

      setSharingIds((prev) => [...prev, id]);
      setCooldownIds((prev) => [...prev, id]);
      window.setTimeout(() => {
        setCooldownIds((prev) => prev.filter((sid) => sid !== id));
      }, COOLDOWN_MS);
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
        toast.error('Error al generar el enlace de compartir. Por favor, intenta nuevamente.');
      } finally {
        setSharingIds((prev) => prev.filter((sid) => sid !== id));
      }
    },
    [sharingIds, cooldownIds]
  );

  const disabledIds = Array.from(new Set([...sharingIds, ...cooldownIds]));
  return { handleCompartir, sharingIds: disabledIds };
};

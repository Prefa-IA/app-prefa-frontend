import { useCallback, useState } from 'react';

import { prefactibilidad } from '../services/api';
import { Informe } from '../types/enums';
import { downloadBlob, generateInformeFilename } from '../utils/download-utils';

export const useInformesDownload = () => {
  const [downloadingIds, setDownloadingIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleDescargar = useCallback(
    async (informe: Informe) => {
      const id = informe._id as string;
      if (!id || downloadingIds.includes(id)) return;

      setDownloadingIds((prev) => [...prev, id]);
      try {
        const blob = await prefactibilidad.descargarPDF(id);
        const filename = generateInformeFilename(informe);
        downloadBlob(blob, filename);
      } catch (error) {
        console.error('Error al descargar informe:', error);
        setError('Error al descargar el informe PDF.');
      } finally {
        setDownloadingIds((prev) => prev.filter((did) => did !== id));
      }
    },
    [downloadingIds]
  );

  return { handleDescargar, downloadingIds, error, setError };
};

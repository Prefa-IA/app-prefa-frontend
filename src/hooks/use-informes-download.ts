import { useCallback, useState } from 'react';

import { prefactibilidad } from '../services/api';
import { Informe } from '../types/enums';
import { downloadBlob } from '../utils/download-utils';

export const useInformesDownload = () => {
  const [downloadingIds, setDownloadingIds] = useState<string[]>([]);
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleDescargar = useCallback(
    async (informe: Informe) => {
      const id = informe._id as string;
      if (downloadingIds.includes(id)) return;
      setDownloadingIds((prev) => [...prev, id]);
      try {
        const blob = await prefactibilidad.descargarPDF(id);
        downloadBlob(blob, `informe-${informe.direccion.direccion}.pdf`);
        setTimeout(() => {
          setDownloadedIds((prev) => prev.filter((did) => did !== id));
        }, 2000);
        setDownloadedIds((prev) => [...prev, id]);
      } catch (error) {
        console.error('Error al descargar informe:', error);
        setError('Error al descargar el informe PDF.');
      } finally {
        setDownloadingIds((prev) => prev.filter((did) => did !== id));
      }
    },
    [downloadingIds]
  );

  return { handleDescargar, downloadingIds, downloadedIds, error, setError };
};

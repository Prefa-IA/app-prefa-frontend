import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { obtenerDocumentosVisuales } from '../services/consolidacion-informes';
import { ChangeLogEntry, DocumentosVisuales, Informe, InformeCompuesto } from '../types/enums';
import { checkImageExists, generateFachadaUrl } from '../utils/parcel-calculations';
import { getReportData } from '../utils/report-utils';

interface UseReportPreviewStateProps {
  informe: Informe | undefined;
  informeCompuesto: InformeCompuesto | undefined;
  isCompoundMode: boolean;
}

export const useReportPreviewState = ({
  informe,
  informeCompuesto,
  isCompoundMode,
}: UseReportPreviewStateProps) => {
  const [changeLog, setChangeLog] = useState<ChangeLogEntry[]>([]);
  const [fachadaImages, setFachadaImages] = useState<string[]>([]);
  const [documentosVisuales, setDocumentosVisuales] = useState<DocumentosVisuales>({
    croquis: [],
    perimetros: [],
    planosIndice: [],
  });

  const informeIdRef = useRef<string | undefined>(informe?._id);

  useEffect(() => {
    if (informe?._id !== informeIdRef.current) {
      informeIdRef.current = informe?._id;
    }
  }, [informe?._id]);

  const handleChangeLogUpdate = useCallback((newChangeLog: ChangeLogEntry[]) => {
    setChangeLog(newChangeLog);
  }, []);

  const updateDocumentosVisuales = useCallback(() => {
    if (isCompoundMode && informeCompuesto) {
      const documentos = obtenerDocumentosVisuales(informeCompuesto.informesIndividuales);
      setDocumentosVisuales(documentos);
    } else if (informe && informe.edificabilidad?.link_imagen) {
      const linkImagen = informe.edificabilidad.link_imagen;
      setDocumentosVisuales({
        croquis: linkImagen.croquis_parcela ? [linkImagen.croquis_parcela] : [],
        perimetros: linkImagen.perimetro_manzana ? [linkImagen.perimetro_manzana] : [],
        planosIndice: linkImagen.plano_indice ? [linkImagen.plano_indice] : [],
      });
    }
  }, [isCompoundMode, informeCompuesto, informe]);

  useEffect(() => {
    updateDocumentosVisuales();
  }, [updateDocumentosVisuales]);

  const loadFachadaImages = useCallback(async () => {
    if (!informe) return;
    const reportData = getReportData(isCompoundMode, informe, informeCompuesto);
    const smp = reportData?.datosCatastrales?.smp;
    if (!smp) return;

    const potentialUrls = Array.from({ length: 5 }, (_, i) => generateFachadaUrl(smp, i));
    const validImages: string[] = [];

    for (const url of potentialUrls) {
      const exists = await checkImageExists(url);
      if (exists && !validImages.includes(url)) {
        validImages.push(url);
      }
    }

    setFachadaImages(validImages);
  }, [informe, informeCompuesto, isCompoundMode]);

  useEffect(() => {
    void loadFachadaImages();
  }, [loadFachadaImages]);

  const reportData = useMemo(() => {
    if (!informe) return null;
    return getReportData(isCompoundMode, informe, informeCompuesto);
  }, [isCompoundMode, informe, informeCompuesto]);

  return {
    changeLog,
    fachadaImages,
    documentosVisuales,
    handleChangeLogUpdate,
    reportData,
  };
};

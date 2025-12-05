import { useEffect, useMemo, useState } from 'react';

import {
  DocumentosVisuales,
  DYNAMIC_INDEX_CONFIG,
  Informe,
  InformeCompuesto,
} from '../types/enums';
import { generateIndexContext } from '../utils/index-utils';
import { checkImageExists, generateFachadaUrl } from '../utils/parcel-calculations';

export const useParcelPageNumbers = (
  informe: Informe,
  informeCompuesto: InformeCompuesto | undefined,
  esInformeCompuesto: boolean,
  smp: string,
  documentosVisuales: DocumentosVisuales
) => {
  const [fachadaImages, setFachadaImages] = useState<string[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      if (!smp) {
        setFachadaImages([]);
        return;
      }

      const potentialUrls = Array.from({ length: 5 }, (_, i) => generateFachadaUrl(smp, i));
      const validImages: string[] = [];

      for (const url of potentialUrls) {
        const exists = await checkImageExists(url);
        if (exists && !validImages.includes(url)) {
          validImages.push(url);
        }
      }

      setFachadaImages(validImages);
    };

    void loadImages();
  }, [smp]);

  const informeAMostrar =
    esInformeCompuesto && informeCompuesto ? informeCompuesto.informeConsolidado : informe;

  const context = useMemo(
    () =>
      generateIndexContext(
        informe,
        informeCompuesto,
        esInformeCompuesto,
        fachadaImages,
        documentosVisuales
      ),
    [informe, informeCompuesto, esInformeCompuesto, fachadaImages, documentosVisuales]
  );

  const pageNumbers = useMemo(() => {
    const pageCounter = { current: 2 };
    const numbers: { [key: string]: number } = {};

    DYNAMIC_INDEX_CONFIG.BASE_SECTIONS.forEach((section) => {
      const shouldInclude = section.shouldInclude
        ? section.shouldInclude(informeAMostrar, context)
        : true;
      if (shouldInclude) {
        numbers[section.id] = pageCounter.current;
        pageCounter.current++;
      }
    });

    return numbers;
  }, [informeAMostrar, context]);

  return { pageNumbers, fachadaImages, context };
};

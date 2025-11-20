import {
  DocumentosVisuales,
  DYNAMIC_INDEX_CONFIG,
  DynamicIndexItem,
  IndexGenerationContext,
  IndexSectionType,
  Informe,
  InformeCompuesto,
  PageSectionConfig,
} from '../types/enums';

import {
  checkHasAPH,
  checkHasEdificabilidad,
  checkHasEntorno,
  checkHasGeometria,
  checkHasLBI,
  checkHasLFI,
  checkHasTroneras,
  getInformeAMostrar,
} from './index-context-helpers';

export const generateIndexContext = (
  informe: Informe,
  informeCompuesto?: InformeCompuesto,
  esInformeCompuesto: boolean = false,
  fachadaImages: string[] = [],
  documentosVisuales: DocumentosVisuales = { croquis: [], perimetros: [], planosIndice: [] }
): IndexGenerationContext => {
  const informeAMostrar = getInformeAMostrar(informe, informeCompuesto, esInformeCompuesto);

  return {
    esInformeCompuesto,
    ...(informeCompuesto !== undefined && { informeCompuesto }),
    fachadaImages,
    documentosVisuales,
    hasEdificabilidad: checkHasEdificabilidad(informeAMostrar),
    hasGeometria: checkHasGeometria(informeAMostrar),
    hasEntorno: checkHasEntorno(informeAMostrar),
    hasTroneras: checkHasTroneras(informeAMostrar),
    hasAPH: checkHasAPH(informeAMostrar),
    hasLFI: checkHasLFI(informeAMostrar),
    hasLBI: checkHasLBI(informeAMostrar),
  };
};

const shouldIncludeSection = (
  section: PageSectionConfig,
  informe: Informe,
  context: IndexGenerationContext
): boolean => {
  if (!section.shouldInclude) return true;
  return section.shouldInclude(informe, context);
};

const calculateSequentialPageNumbers = (
  sections: PageSectionConfig[],
  informe: Informe,
  context: IndexGenerationContext
): Map<string, number> => {
  const pageNumbers = new Map<string, number>();
  const pageCounter = { current: 2 };

  sections.forEach((section) => {
    if (shouldIncludeSection(section, informe, context)) {
      pageNumbers.set(section.id, pageCounter.current);
      pageCounter.current++;

      if (section.subSections) {
        section.subSections.forEach((subSection) => {
          if (shouldIncludeSection(subSection, informe, context)) {
            pageNumbers.set(subSection.id, pageNumbers.get(section.id)!);
          }
        });
      }
    }
  });

  return pageNumbers;
};

const createDynamicIndexItem = (
  section: PageSectionConfig,
  pageNumber: number,
  nivel: number,
  informe: Informe,
  context: IndexGenerationContext,
  pageNumbersMap: Map<string, number>
): DynamicIndexItem => {
  const visible = shouldIncludeSection(section, informe, context);
  const actualPageNumber = pageNumbersMap.get(section.id) || pageNumber;

  const subItems: DynamicIndexItem[] = [];
  if (section.subSections && visible) {
    section.subSections.forEach((subSection) => {
      if (shouldIncludeSection(subSection, informe, context)) {
        const subPageNumber = pageNumbersMap.get(subSection.id) || actualPageNumber;
        const subItem = createDynamicIndexItem(
          subSection,
          subPageNumber,
          nivel + 1,
          informe,
          context,
          pageNumbersMap
        );
        subItems.push(subItem);
      }
    });
  }

  return {
    id: section.id,
    texto: section.title,
    pagina: actualPageNumber,
    nivel,
    seccion: section.id as IndexSectionType,
    visible,
    ...(subItems.length > 0 ? { subItems } : {}),
  };
};

/**
 * Genera el índice dinámico completo basado en el informe
 */
export const generateDynamicIndex = (
  informe: Informe,
  informeCompuesto?: InformeCompuesto,
  esInformeCompuesto: boolean = false,
  fachadaImages: string[] = [],
  documentosVisuales: {
    croquis: string[];
    perimetros: string[];
    planosIndice: string[];
  } = { croquis: [], perimetros: [], planosIndice: [] }
): DynamicIndexItem[] => {
  const context = generateIndexContext(
    informe,
    informeCompuesto,
    esInformeCompuesto,
    fachadaImages,
    documentosVisuales
  );

  const sections = [...DYNAMIC_INDEX_CONFIG.BASE_SECTIONS] as PageSectionConfig[];
  const pageNumbersMap = calculateSequentialPageNumbers(sections, informe, context);
  const indexItems: DynamicIndexItem[] = [];

  sections.forEach((section) => {
    const item = createDynamicIndexItem(
      section,
      0, // Este valor será sobrescrito por pageNumbersMap
      0,
      informe,
      context,
      pageNumbersMap
    );

    if (item.visible) {
      indexItems.push(item);
    }
  });

  return indexItems;
};

/**
 * Filtra items visibles del índice
 */
export const getVisibleIndexItems = (items: DynamicIndexItem[]): DynamicIndexItem[] => {
  return items
    .filter((item) => item.visible)
    .map((item) => ({
      ...item,
      ...(item.subItems ? { subItems: getVisibleIndexItems(item.subItems) } : {}),
    }));
};

export const getTotalPages = (indexItems: DynamicIndexItem[]): number => {
  const maxPageRef = { current: 0 };

  const findMaxPage = (items: DynamicIndexItem[]) => {
    items.forEach((item) => {
      if (item.visible && item.pagina > maxPageRef.current) {
        maxPageRef.current = item.pagina;
      }
      if (item.subItems) {
        findMaxPage(item.subItems);
      }
    });
  };

  findMaxPage(indexItems);
  return maxPageRef.current;
};

export const findIndexItemById = (
  items: DynamicIndexItem[],
  id: string
): DynamicIndexItem | null => {
  for (const item of items) {
    if (item.id === id) {
      return item;
    }
    if (item.subItems) {
      const found = findIndexItemById(item.subItems, id);
      if (found) return found;
    }
  }
  return null;
};

export const getIndexStructure = (items: DynamicIndexItem[]): string => {
  const structureParts: string[] = [];

  const buildStructure = (items: DynamicIndexItem[], level: number = 0) => {
    items.forEach((item) => {
      if (item.visible) {
        const indent = '  '.repeat(level);
        structureParts.push(`${indent}${item.texto} (p. ${item.pagina})\n`);

        if (item.subItems) {
          buildStructure(item.subItems, level + 1);
        }
      }
    });
  };

  buildStructure(items);
  return structureParts.join('');
};

export const debugIndexStructure = (
  informe: Informe,
  fachadaImages: string[] = [],
  documentosVisuales: DocumentosVisuales = { croquis: [], perimetros: [], planosIndice: [] }
): string => {
  const context = generateIndexContext(
    informe,
    undefined,
    false,
    fachadaImages,
    documentosVisuales
  );

  const sections = [...DYNAMIC_INDEX_CONFIG.BASE_SECTIONS] as PageSectionConfig[];
  const pageNumbersMap = calculateSequentialPageNumbers(sections, informe, context);

  const resultParts: string[] = [
    'ESTRUCTURA DEL ÍNDICE DINÁMICO:\n',
    '=====================================\n\n',
    'ÍNDICE (Página 1)\n\n',
  ];

  sections.forEach((section) => {
    if (shouldIncludeSection(section, informe, context)) {
      const pageNum = pageNumbersMap.get(section.id);
      resultParts.push(`${section.title} - Página ${pageNum}\n`);

      if (section.subSections) {
        section.subSections.forEach((subSection) => {
          if (shouldIncludeSection(subSection, informe, context)) {
            const subPageNum = pageNumbersMap.get(subSection.id);
            resultParts.push(`  ${subSection.title} - Página ${subPageNum}\n`);
          }
        });
      }
      resultParts.push('\n');
    }
  });

  return resultParts.join('');
};

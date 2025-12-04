import React from 'react';

import {
  DynamicIndexItemProps,
  DynamicIndexListProps,
  DynamicReportIndexProps,
} from '../../types/enums';
import { generateDynamicIndex, getVisibleIndexItems } from '../../utils/index-utils';
import PageNumber from '../parcel-data/PageNumber';

import styles from '../../styles/ReportIndex.module.css';

const ReportIndex: React.FC<DynamicReportIndexProps> = ({
  informe,
  informeCompuesto,
  esInformeCompuesto = false,
  fachadaImages = [],
  documentosVisuales = { croquis: [], perimetros: [], planosIndice: [] },
}) => {
  const dynamicItems = generateDynamicIndex(
    informe,
    informeCompuesto,
    esInformeCompuesto,
    fachadaImages,
    documentosVisuales
  );

  const visibleItems = getVisibleIndexItems(dynamicItems);

  return (
    <div className={styles['container']}>
      <IndexTitle />
      <DynamicIndexList items={visibleItems} />
      <PageNumber pageNumber={1} />
    </div>
  );
};

const IndexTitle: React.FC = () => <div className={styles['title']}>ÍNDICE</div>;

const DynamicIndexList: React.FC<DynamicIndexListProps> = ({ items }) => {
  // Aplanar todos los items (principales y subitems) en una lista única
  const allItems: (typeof items)[0][] = [];

  items.forEach((item) => {
    // Agregar el item principal
    allItems.push(item);

    // Si tiene subitems, agregarlos también
    if (item.subItems && item.subItems.length > 0) {
      item.subItems.forEach((subItem) => {
        allItems.push(subItem);
      });
    }
  });

  // Ordenar todos los items por número de página
  // Si tienen la misma página, ordenar por nivel (items principales primero, luego subitems)
  const sortedItems = [...allItems].sort((a, b) => {
    // Primero ordenar por número de página
    if (a.pagina !== b.pagina) {
      return a.pagina - b.pagina;
    }
    // Si tienen la misma página, ordenar por nivel (menor nivel = item principal primero)
    return a.nivel - b.nivel;
  });

  return (
    <div className={styles['indexList']}>
      {sortedItems.map((item, index) => (
        <DynamicIndexItemComponent key={`${item.id}-${index}`} item={item} />
      ))}
    </div>
  );
};

const DynamicIndexItemComponent: React.FC<DynamicIndexItemProps> = ({ item }) => (
  <div className={styles['indexItem']}>
    <span className={styles['indexText']} style={{ paddingLeft: `${item.nivel * 20}px` }}>
      {item.texto}
    </span>
    <span className={styles['indexText']} style={{ minWidth: '30px', textAlign: 'right' }}>
      {item.pagina}
    </span>
  </div>
);

export default ReportIndex;

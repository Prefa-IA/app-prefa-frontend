import React from 'react';

import {
  DynamicIndexItemProps,
  DynamicIndexListProps,
  DynamicReportIndexProps,
  PageNumberProps,
} from '../../types/enums';
import { generateDynamicIndex, getVisibleIndexItems } from '../../utils/index-utils';

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

const DynamicIndexList: React.FC<DynamicIndexListProps> = ({ items }) => (
  <div className={styles['indexList']}>
    {items.map((item, index) => (
      <React.Fragment key={`${item.id}-${index}`}>
        <DynamicIndexItemComponent item={item} />
        {item.subItems &&
          item.subItems.map((subItem, subIndex) => (
            <DynamicIndexItemComponent key={`${subItem.id}-${subIndex}`} item={subItem} />
          ))}
      </React.Fragment>
    ))}
  </div>
);

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

const PageNumber: React.FC<PageNumberProps> = ({ pageNumber }) => (
  <div
    className={`${styles['pageNumber']} mt-4 border border-gray-300 rounded w-fit px-3 py-1.5 bg-white ml-auto`}
    style={{
      fontSize: '0.875rem',
      fontWeight: 600,
      textAlign: 'right',
      color: '#000000',
      minWidth: 'fit-content',
      whiteSpace: 'nowrap',
      letterSpacing: 'normal',
      wordSpacing: 'normal',
      fontVariantNumeric: 'normal',
    }}
  >
    {pageNumber}
  </div>
);

export default ReportIndex;

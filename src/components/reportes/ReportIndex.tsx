import React from 'react';
import { 
  DynamicReportIndexProps,
  DynamicIndexListProps, 
  DynamicIndexItemProps, 
  PageNumberProps 
} from '../../types/enums';
import { generateDynamicIndex, getVisibleIndexItems } from '../../utils/indexUtils';
import styles from '../../styles/ReportIndex.module.css';

const ReportIndex: React.FC<DynamicReportIndexProps> = ({ 
  informe,
  informeCompuesto,
  esInformeCompuesto = false,
  fachadaImages = [],
  documentosVisuales = { croquis: [], perimetros: [], planosIndice: [] }
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
    <div className={styles.container}>
      <IndexTitle />
      <DynamicIndexList items={visibleItems} />
      <PageNumber pageNumber={1} />
    </div>
  );
};

const IndexTitle: React.FC = () => (
  <div className={styles.title}>ÍNDICE</div>
);

const DynamicIndexList: React.FC<DynamicIndexListProps> = ({ items }) => (
  <div className={styles.indexList}>
    {items.map((item, index) => (
      <>
        <DynamicIndexItemComponent key={`${item.id}-${index}`} item={item} />
        {item.subItems && item.subItems.map((subItem, subIndex) => (
          <DynamicIndexItemComponent 
            key={`${subItem.id}-${subIndex}`} 
            item={subItem} 
          />
        ))}
      </>
    ))}
  </div>
);

const DynamicIndexItemComponent: React.FC<DynamicIndexItemProps> = ({ item }) => (
  <div className={styles.indexItem}>
    <span 
      className={styles.indexText}
      style={{ paddingLeft: `${item.nivel * 20}px` }}
    >
      {item.texto}
    </span>
    <span className={styles.indexDots}></span>
    <span>{item.pagina}</span>
  </div>
);

const PageNumber: React.FC<PageNumberProps> = ({ pageNumber }) => (
  <div className="mt-4 border rounded w-fit px-3 py-1 text-dark bg-gray-100 ml-auto">{pageNumber}</div>
);

export default ReportIndex; 
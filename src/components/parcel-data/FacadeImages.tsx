import React from 'react';

import useTablePersonalization from '../../hooks/use-table-personalization';
import { FacadeImageGridProps, FacadeImageItemProps } from '../../types/components';
import { FacadeImagesProps, PARCEL_DATA_CONFIG } from '../../types/enums';

import PageNumber from './PageNumber';

const FacadeImages: React.FC<FacadeImagesProps> = ({ fachadaImages, pageCounter }) => {
  const { parentTableStyle } = useTablePersonalization();

  return (
    <div className={PARCEL_DATA_CONFIG.PAGE_BREAK_CLASS}>
      <div className={`${PARCEL_DATA_CONFIG.TABLE_HEADER_CLASS} mb-4`} style={parentTableStyle}>
        ENTORNO / IMAGEN DE LA FACHADA
      </div>

      {fachadaImages.length > 0 ? <FacadeImageGrid images={fachadaImages} /> : <NoImagesMessage />}

      <PageNumber pageNumber={pageCounter} />
    </div>
  );
};

const FacadeImageGrid: React.FC<FacadeImageGridProps> = ({ images }) => {
  const uniqueImages = images.filter((url, idx) => images.indexOf(url) === idx);

  const gridClass = uniqueImages.length > 1 ? 'grid-cols-2' : 'grid-cols-1';

  const displayImages = uniqueImages.slice(0, uniqueImages.length === 1 ? 1 : 2);

  return (
    <div className={`grid ${gridClass} gap-4 mb-8`}>
      {displayImages.map((imageUrl, index) => (
        <FacadeImageItem key={index} imageUrl={imageUrl} index={index} />
      ))}
    </div>
  );
};

const FacadeImageItem: React.FC<FacadeImageItemProps> = ({ imageUrl, index }) => (
  <div className="border border-gray-300 dark:border-gray-700 p-4 text-center h-[400px] overflow-hidden">
    <img
      src={imageUrl}
      alt={`Fachada vista ${index + 1}`}
      className="max-h-full object-contain mx-auto"
      onError={(e) => {
        const container = e.currentTarget.parentElement;
        if (container) {
          container.style.display = 'none';
        }
      }}
    />
  </div>
);

const NoImagesMessage: React.FC = () => (
  <div className="text-center p-4 border border-gray-300 dark:border-gray-700 mb-8">
    <p className="text-gray-500 dark:text-gray-400">
      No se encontraron imágenes de la fachada para esta parcela.
    </p>
  </div>
);

export default FacadeImages;

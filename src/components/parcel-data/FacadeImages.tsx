import React from 'react';
import { FacadeImagesProps, PARCEL_DATA_CONFIG } from '../../types/enums';
import useTablePersonalization from '../../hooks/useTablePersonalization';

const FacadeImages: React.FC<FacadeImagesProps> = ({ fachadaImages, pageCounter }) => {
  const { parentTableStyle } = useTablePersonalization();

  return (
    <div className={PARCEL_DATA_CONFIG.PAGE_BREAK_CLASS}>
      <div 
        className={`${PARCEL_DATA_CONFIG.TABLE_HEADER_CLASS} mb-4`}
        style={parentTableStyle}
      >
        ENTORNO / IMAGEN DE LA FACHADA
      </div>
      
      {fachadaImages.length > 0 ? (
        <FacadeImageGrid images={fachadaImages} />
      ) : (
        <NoImagesMessage />
      )}
      
      <div className="mt-4 border rounded w-fit px-3 py-1 text-dark bg-gray-100 ml-auto">{pageCounter}</div>
    </div>
  );
};

const FacadeImageGrid: React.FC<{ images: string[] }> = ({ images }) => {
  // Eliminar duplicados exactos (URL idénticas) manteniendo orden.
  const uniqueImages = images.filter((url, idx) => images.indexOf(url) === idx);

  const gridClass = uniqueImages.length > 1 ? 'grid-cols-2' : 'grid-cols-1';

  // Mostrar máximo 2 imágenes únicas, o 1 si sólo hay una
  const displayImages = uniqueImages.slice(0, uniqueImages.length === 1 ? 1 : 2);

  return (
    <div className={`grid ${gridClass} gap-4 mb-8`}>
      {displayImages.map((imageUrl, index) => (
        <FacadeImageItem 
          key={index} 
          imageUrl={imageUrl} 
          index={index} 
        />
      ))}
    </div>
  );
};

const FacadeImageItem: React.FC<{ imageUrl: string; index: number }> = ({ imageUrl, index }) => (
  <div className="border p-4 text-center h-[400px] overflow-hidden">
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
  <div className="text-center p-4 border mb-8">
    <p className="text-gray-500">No se encontraron imágenes de la fachada para esta parcela.</p>
  </div>
);

export default FacadeImages; 
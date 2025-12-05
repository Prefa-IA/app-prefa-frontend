import React from 'react';

interface ImagePreviewsProps {
  previews: string[];
  onRemove: (index: number) => void;
}

const ImagePreviews: React.FC<ImagePreviewsProps> = ({ previews, onRemove }) => {
  if (previews.length === 0) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-[10px]">
      {previews.map((src, idx) => (
        <div
          key={idx}
          className="relative border rounded bg-gray-50 dark:bg-gray-700 w-24 h-24"
          style={{ overflow: 'visible' }}
        >
          <img src={src} alt={`preview-${idx}`} className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onRemove(idx)}
            className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-red-700"
            aria-label="Quitar imagen"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default ImagePreviews;

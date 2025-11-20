import React from 'react';

interface ImageDropzoneProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  isDragging: boolean;
  loading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  previewCount: number;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  fileInputRef,
  isDragging,
  loading,
  onFileChange,
  onDrop,
  onDragOver,
  onDragLeave,
  previewCount,
}) => (
  <div>
    <div className="flex items-center justify-between">
      <label
        htmlFor="images"
        className="block text-sm font-medium text-gray-900 dark:text-gray-100"
      >
        Imágenes (máx 2MB c/u)
      </label>
      {previewCount > 0 && (
        <span className="inline-flex items-center justify-center text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">
          {previewCount}
        </span>
      )}
    </div>
    <div
      role="button"
      tabIndex={0}
      className={`mt-2 border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${
        isDragging
          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900'
          : 'border-gray-300 dark:border-gray-600 hover:border-primary-600'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={() => !loading && fileInputRef.current?.click()}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !loading) {
          e.preventDefault();
          fileInputRef.current?.click();
        }
      }}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <div className="text-sm text-gray-600 dark:text-gray-300">
        <span className="text-primary-600 dark:text-primary-400 font-medium">
          Seleccionar imágenes
        </span>{' '}
        o arrastrarlas aquí
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={onFileChange}
        className="hidden"
        disabled={loading}
      />
    </div>
  </div>
);

export default ImageDropzone;

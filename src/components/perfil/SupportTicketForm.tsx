import React from 'react';

import SupportTicketFormFields from './SupportTicketFormFields';
import ImageDropzone from './SupportTicketImageDropzone';
import ImagePreviews from './SupportTicketImagePreviews';

interface SupportTicketFormProps {
  subject: string;
  setSubject: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isDragging: boolean;
  loading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  previews: string[];
  onRemoveImage: (index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  cooldown: boolean;
}

const SupportTicketForm: React.FC<SupportTicketFormProps> = ({
  subject,
  setSubject,
  description,
  setDescription,
  fileInputRef,
  isDragging,
  loading,
  onFileChange,
  onDrop,
  onDragOver,
  onDragLeave,
  previews,
  onRemoveImage,
  onSubmit,
  onClose,
  cooldown,
}) => (
  <form
    onSubmit={(e) => {
      void onSubmit(e);
    }}
    className="space-y-4"
  >
    <SupportTicketFormFields
      subject={subject}
      setSubject={setSubject}
      description={description}
      setDescription={setDescription}
    />
    <ImageDropzone
      fileInputRef={fileInputRef}
      isDragging={isDragging}
      loading={loading}
      onFileChange={onFileChange}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      previewCount={previews.length}
    />
    <ImagePreviews previews={previews} onRemove={onRemoveImage} />
    <div className="flex justify-end space-x-3">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
        disabled={loading || cooldown}
      >
        Cancelar
      </button>
      <button
        type="submit"
        className="px-4 py-2 rounded-md bg-primary-600 dark:bg-primary-700 text-white hover:bg-primary-700 dark:hover:bg-primary-600"
        disabled={loading || cooldown}
      >
        {loading ? 'Enviando…' : 'Enviar'}
      </button>
    </div>
  </form>
);

export default SupportTicketForm;

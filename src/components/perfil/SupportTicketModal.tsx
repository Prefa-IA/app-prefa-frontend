import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { useSupportTicketImages } from '../../hooks/use-support-ticket-images';
import { support } from '../../services/api';
import { SupportTicketModalProps } from '../../types/components';

import SupportTicketForm from './SupportTicketForm';

const SupportTicketModal: React.FC<SupportTicketModalProps> = ({ onClose }) => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const {
    images,
    previews,
    isDragging,
    fileInputRef,
    handleFileChange,
    handleDrop: handleDropBase,
    handleDragOver,
    handleDragLeave,
    removeImage,
  } = useSupportTicketImages();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    handleDropBase(e, loading);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown) return;
    setCooldown(true);
    if (!subject || !description) {
      toast.error('Asunto y descripción son obligatorios');
      setCooldown(false);
      return;
    }
    setLoading(true);
    try {
      await support.sendTicket({ subject, description, images });
      toast.success('Ticket enviado correctamente');
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Error al enviar el ticket');
    } finally {
      setLoading(false);
      setTimeout(() => setCooldown(false), 1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 ">
      <div className="bg-white dark:bg-gray-800 dark:text-gray-100 rounded-lg shadow-lg w-full max-w-lg p-6 mx-4 sm:mx-0 custom-scrollbar max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-semibold mb-4">Nuevo Ticket de Soporte</h2>
        <SupportTicketForm
          subject={subject}
          setSubject={setSubject}
          description={description}
          setDescription={setDescription}
          fileInputRef={fileInputRef}
          isDragging={isDragging}
          loading={loading}
          onFileChange={handleFileChange}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          previews={previews}
          onRemoveImage={removeImage}
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          onClose={onClose}
          cooldown={cooldown}
        />
      </div>
    </div>
  );
};

export default SupportTicketModal;

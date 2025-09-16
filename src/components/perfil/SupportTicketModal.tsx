import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { support } from '../../services/api';

interface Props {
  onClose: () => void;
}

const SupportTicketModal: React.FC<Props> = ({ onClose }) => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown,setCooldown]=useState(false);

  const processFiles = (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    const valid: File[] = [];
    files.forEach(file => {
      if (file.size > 2 * 1024 * 1024) {
        toast.warn(`El archivo ${file.name} excede los 2MB y se omitirá.`);
      } else if (!file.type.startsWith('image/')) {
        toast.warn(`El archivo ${file.name} no es una imagen y se omitirá.`);
      } else {
        valid.push(file);
      }
    });
    // Combinar con existentes y limitar a 3
    const combined = [...images, ...valid];
    if (combined.length > 3) {
      toast.info('Puedes adjuntar hasta 3 imágenes');
    }
    const limited = combined.slice(0, 3);
    setImages(limited);
    // Generar previews (recrear todas)
    const readers = limited.map(file => new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    }));
    Promise.all(readers).then(setPreviews);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    processFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (loading) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(cooldown) return;
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
      setTimeout(()=>setCooldown(false),1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Nuevo Ticket de Soporte</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Asunto</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Descripción</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2"
              rows={4}
              required
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">Imágenes (máx 2MB c/u)</label>
              {previews.length > 0 && (
                <span className="inline-flex items-center justify-center text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{previews.length}</span>
              )}
            </div>

            {/* Dropzone / Selector con color del botón actual (azul) */}
            <div
              className={`mt-2 border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                isDragging ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-600'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => !loading && fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="text-sm text-gray-600">
                <span className="text-blue-600 font-medium">Seleccionar imágenes</span> o arrastrarlas aquí
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
                disabled={loading}
              />
            </div>
            {previews.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-[10px]">
                {previews.map((src, idx) => (
                  <div key={idx} className="relative border rounded bg-gray-50 w-24 h-24" style={{overflow: 'visible'}}>
                    <img src={src} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setImages(prev => prev.filter((_, i) => i !== idx));
                        setPreviews(prev => prev.filter((_, i) => i !== idx));
                      }}
                      className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-red-700"
                      aria-label="Quitar imagen"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border"
              disabled={loading||cooldown}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white"
              disabled={loading||cooldown}
            >
              {loading ? 'Enviando…' : 'Enviar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupportTicketModal; 
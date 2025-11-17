import { toast } from 'react-toastify';

export const processImageFiles = (
  fileList: FileList | File[],
  existingImages: File[]
): { valid: File[]; previews: Promise<string[]> } => {
  const files = Array.from(fileList);
  const valid: File[] = [];

  files.forEach((file) => {
    if (file.size > 2 * 1024 * 1024) {
      toast.warn(`El archivo ${file.name} excede los 2MB y se omitirá.`);
    } else if (!file.type.startsWith('image/')) {
      toast.warn(`El archivo ${file.name} no es una imagen y se omitirá.`);
    } else {
      valid.push(file);
    }
  });

  const combined = [...existingImages, ...valid];
  if (combined.length > 3) {
    toast.info('Puedes adjuntar hasta 3 imágenes');
  }
  const limited = combined.slice(0, 3);

  const previews = Promise.all(
    limited.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
    )
  );

  return { valid: limited, previews };
};

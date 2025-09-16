import { Informe } from '../types/enums';

export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const generateInformeFilename = (informe: Informe): string => {
  const direccion = informe.direccion?.direccion || informe.direccionesNormalizadas?.[0]?.direccion || 'prefactibilidad';
  const altura = informe.direccion?.altura || '';
  return `informe-${direccion}${altura ? `-${altura}` : ''}.pdf`;
};

export const downloadInformePDF = async (
  informe: Informe, 
  generateFunction: (informe: Informe) => Promise<Blob>
): Promise<void> => {
  try {
    const blob = await generateFunction(informe);
    const filename = generateInformeFilename(informe);
    downloadBlob(blob, filename);
  } catch (error) {
    console.error('Error al descargar informe:', error);
    throw new Error('Error al descargar el informe PDF.');
  }
}; 
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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
  const direccion =
    informe.direccion?.direccion ||
    informe.direccionesNormalizadas?.[0]?.direccion ||
    'prefactibilidad';
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

export const generatePDFFromElement = async (
  element: HTMLElement,
  filename: string
): Promise<void> => {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = pdfWidth / imgWidth;
  const imgScaledWidth = imgWidth * ratio;
  const imgScaledHeight = imgHeight * ratio;
  const xOffset = 0;

  const addPagesRecursively = (currentHeightLeft: number): void => {
    if (currentHeightLeft < 0) {
      return;
    }

    const nextPosition = currentHeightLeft - imgScaledHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', xOffset, nextPosition, imgScaledWidth, imgScaledHeight);
    addPagesRecursively(currentHeightLeft - pdfHeight);
  };

  pdf.addImage(imgData, 'PNG', xOffset, 0, imgScaledWidth, imgScaledHeight);
  addPagesRecursively(imgScaledHeight - pdfHeight);

  pdf.save(filename);
};

import { Informe, InformeCompuesto } from '../types/enums';

export const getReportTitle = (
  isCompoundMode: boolean,
  addresses: string[],
  informe: Informe
): string => {
  if (isCompoundMode) {
    return addresses.join(', ');
  }
  return informe.direccionesNormalizadas?.[0]?.direccion || 'Dirección consultada';
};

export const getReportData = (
  isCompoundMode: boolean,
  informe: Informe,
  informeCompuesto?: InformeCompuesto
): Informe => {
  return isCompoundMode && informeCompuesto 
    ? informeCompuesto.informeConsolidado 
    : informe;
};

export const formatTimestamp = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString();
}; 
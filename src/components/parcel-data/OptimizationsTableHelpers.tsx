import { Informe } from '../../types/enums';

export const hasOptimizations = (informe: Informe): boolean => {
  return !!(
    informe.edificabilidad?.completamiento_tejido ||
    informe.edificabilidad?.manzana_atipica ||
    informe.edificabilidad?.patio_iluminacion ||
    informe.edificabilidad?.profundidad_balcones ||
    informe.edificabilidad?.balcones ||
    informe.edificabilidad?.sup_construible
  );
};

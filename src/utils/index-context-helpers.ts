import { Informe, InformeCompuesto } from '../types/enums';

export const checkHasEdificabilidad = (informe: Informe): boolean => {
  return !!(informe.edificabilidad && Object.keys(informe.edificabilidad).length > 0);
};

export const checkHasGeometria = (informe: Informe): boolean => {
  return !!(informe.geometria && informe.geometria.features?.length > 0);
};

export const checkHasEntorno = (informe: Informe): boolean => {
  return !!(
    informe.entorno &&
    (informe.entorno.espaciosVerdes?.length > 0 ||
      informe.entorno.transportes?.length > 0 ||
      informe.entorno.servicios?.length > 0)
  );
};

export const checkHasTroneras = (informe: Informe): boolean => {
  return !!(informe.edificabilidad?.troneras && informe.edificabilidad.troneras.cantidad > 0);
};

export const checkHasAPH = (informe: Informe): boolean => {
  return !!(
    informe.edificabilidad?.catalogacion && informe.edificabilidad.catalogacion.catalogacion
  );
};

export const checkHasLFI = (informe: Informe): boolean => {
  return !!(
    informe.edificabilidad?.lfi_disponible && informe.edificabilidad.lfi_disponible !== 'No'
  );
};

export const checkHasLBI = (informe: Informe): boolean => {
  return !!(
    informe.edificabilidad?.longitud_lfi && parseFloat(informe.edificabilidad.longitud_lfi) > 0
  );
};

export const getInformeAMostrar = (
  informe: Informe,
  informeCompuesto: InformeCompuesto | undefined,
  esInformeCompuesto: boolean
): Informe => {
  return esInformeCompuesto && informeCompuesto ? informeCompuesto.informeConsolidado : informe;
};

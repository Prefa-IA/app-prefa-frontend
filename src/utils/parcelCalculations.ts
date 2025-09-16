import { Informe, PARCEL_DATA_CONFIG } from '../types/enums';
// Tipologías eliminadas: clasificación por fallback

export const determinarTipoEdificacion = (alturaMax: number): string => {
  // Intentamos usar tipologías de BD si están cacheadas
  // Tipologías dinámicas eliminadas
  // Fallback legacy
  if (alturaMax >= 38) return 'Corredor Alto (PB + 12 pisos + 2 retiros)';
  if (alturaMax >= 31) return 'Corredor Medio (PB + 10 pisos + 2 retiros)';
  if (alturaMax >= 22.8) return 'USAA (PB + 7 plantas + 2 retiros)';
  if (alturaMax >= 17.2) return 'USAM (PB + 5 plantas + 2 retiros)';
  if (alturaMax >= 13) return 'USAB2 (PB + 4 plantas)';
  if (alturaMax >= 10.5) return 'USAB1 (PB + 3 plantas)';
  if (alturaMax >= 9) return 'USAB0 (PB + 2 plantas)';
  return 'No clasificado';
};

export const calculatePisosSinRetiro = (alturaMax: number): number => {
  return alturaMax ? Math.floor(alturaMax / PARCEL_DATA_CONFIG.CALCULATIONS.FLOOR_HEIGHT) + 1 : 0;
};

export const calculateTotalPisos = (alturaMax: number): number => {
  return alturaMax ? Math.floor(alturaMax / PARCEL_DATA_CONFIG.CALCULATIONS.FLOOR_HEIGHT) + 3 : 0;
};

export const calculateSuperficieParcelaAjustada = (superficieParcela: number): number => {
  return superficieParcela - PARCEL_DATA_CONFIG.CALCULATIONS.PATIOS_ADJUSTMENT;
};

export const calculateAreaPlantasTipicas = (pisosSinRetiro: number, superficieParcelaAjustada: number): number => {
  return pisosSinRetiro * superficieParcelaAjustada;
};

export const calculateAreaPrimerRetiro = (superficieParcelaAjustada: number, frenteValor: number): number => {
  return superficieParcelaAjustada - (frenteValor * 2);
};

export const calculateAreaSegundoRetiro = (superficieParcelaAjustada: number, frenteValor: number): number => {
  return superficieParcelaAjustada - (frenteValor * 4);
};

export const calculateTotalCapConstructiva = (
  areaPlantasTipicas: number,
  areaPrimerRetiro: number,
  areaSegundoRetiro: number
): number => {
  return areaPlantasTipicas + areaPrimerRetiro + areaSegundoRetiro;
};

export const calculateA1 = (superficieParcela: number, fotMedanera: number): number => {
  return superficieParcela * fotMedanera;
};

export const calculateA2 = (totalCapConstructivaAjustada: number, a1: number): number => {
  return totalCapConstructivaAjustada - a1;
};

export const calculateA = (a1: number, a2: number): number => {
  return a1 + a2;
};

export const calculateAxB = (a: number, b: number): number => {
  return a * b;
};

export const calculatePlusvaliaFinal = (axb: number, alicuotaValor: number): number => {
  return axb * alicuotaValor;
};

export const calculateAllValues = (
  informe: Informe,
  editedValues: Record<string, any>
) => {
  const superficieParcela = editedValues['superficieParcela'] !== undefined 
    ? editedValues['superficieParcela'] 
    : (informe.edificabilidad?.superficie_parcela || 0);
  
  const superficieParcelaAjustada = calculateSuperficieParcelaAjustada(superficieParcela);
  
  const frenteValor = editedValues['frenteValor'] !== undefined 
    ? editedValues['frenteValor'] 
    : parseFloat(informe.datosCatastrales?.frente || '0');
  
  const fotMedanera = editedValues['fotMedanera'] !== undefined 
    ? editedValues['fotMedanera'] 
    : (informe.edificabilidad?.fot?.fot_medianera || 0);
  
  const alturaMax = editedValues['alturaMax'] !== undefined 
    ? editedValues['alturaMax'] 
    : (informe.edificabilidad?.altura_max?.[0] || 0);
  
  const pisosSinRetiro = calculatePisosSinRetiro(alturaMax);
  const totalPisos = calculateTotalPisos(alturaMax);
  const tipoEdificacion = determinarTipoEdificacion(alturaMax);
  
  const areaPlantasTipicas = calculateAreaPlantasTipicas(pisosSinRetiro, superficieParcelaAjustada);
  const areaPrimerRetiro = calculateAreaPrimerRetiro(superficieParcelaAjustada, frenteValor);
  const areaSegundoRetiro = calculateAreaSegundoRetiro(superficieParcelaAjustada, frenteValor);
  const totalCapConstructivaOriginal = calculateTotalCapConstructiva(areaPlantasTipicas, areaPrimerRetiro, areaSegundoRetiro);
  
  // NUEVO: aplicar afección LBI/LFI si existe un porcentaje disponible en el informe
  // Se asume que el backend, cuando corresponda, enviará un valor numérico entre 0-100 en
  //   edificabilidad.lfi_afeccion_percent  (p.ej. 25 para un 25 %).
  // En caso de no existir la propiedad o ser 0, se mantiene el valor original.
  let lfiAfeccionPercent: number = (informe.edificabilidad as any)?.lfi_afeccion_percent || 0;

  const totalCapConstructivaAjustada = lfiAfeccionPercent > 0
    ? totalCapConstructivaOriginal * (1 - lfiAfeccionPercent / 100)
    : totalCapConstructivaOriginal;

  // Si no vino porcentaje pero hay diferencia entre original y ajustada, lo calculamos
  if (lfiAfeccionPercent === 0 && totalCapConstructivaOriginal !== 0) {
    const diff = totalCapConstructivaOriginal - totalCapConstructivaAjustada;
    if (diff > 0) {
      lfiAfeccionPercent = (diff / totalCapConstructivaOriginal) * 100;
    }
  }

  // Reemplazamos la capacidad constructiva original por la ajustada para todos los cálculos posteriores
  // (A1, A2, plusvalía, etc.)

  const a1 = calculateA1(superficieParcela, fotMedanera);
  const a2 = calculateA2(totalCapConstructivaAjustada, a1);
  const a = calculateA(a1, a2);
  let b: number = 0;
  if (informe.edificabilidad?.plusvalia) {
    const { incidencia_uva, plusvalia_em, plusvalia_pl, plusvalia_sl, uvaPersonalizado } = informe.edificabilidad.plusvalia;
    if (uvaPersonalizado && uvaPersonalizado > 0) {
      b = Number(uvaPersonalizado);
    } else {
      b = Number(incidencia_uva) || 0;
      if (!b) {
        b = Number(plusvalia_em) || Number(plusvalia_pl) || Number(plusvalia_sl) || 0;
      }
    }
  }
  const axb = calculateAxB(a, b);
  let alicuotaValor = informe.edificabilidad?.plusvalia?.alicuota;
  if (alicuotaValor === undefined || alicuotaValor === null) {
    const cpu = informe.edificabilidad?.plusvalia?.distrito_cpu?.toString().toUpperCase();
    const CPU_ALICUOTAS = {
      CPU1: 0.35,
      CPU2: 0.25,
      CPU3: 0.15,
      CPU4: 0.1
    } as Record<string, number>;
    alicuotaValor = cpu && CPU_ALICUOTAS[cpu] ? CPU_ALICUOTAS[cpu] : 0;
  }
  const alicuota = alicuotaValor * 100;
  const plusvaliaFinal = calculatePlusvaliaFinal(axb, alicuotaValor);

  return {
    superficieParcela,
    superficieParcelaAjustada,
    frenteValor,
    fotMedanera,
    alturaMax,
    pisosSinRetiro,
    totalPisos,
    tipoEdificacion,
    areaPlantasTipicas,
    areaPrimerRetiro,
    areaSegundoRetiro,
    totalCapConstructiva: totalCapConstructivaAjustada,
    totalCapConstructivaOriginal,
    lfiAfeccionPercent,
    a1,
    a2,
    a,
    b,
    axb,
    alicuotaValor,
    alicuota,
    plusvaliaFinal
  };
};

export const generateFachadaUrl = (smp: string, index: number, width: number = 800): string => {
  const formattedSmp = smp.replace(/\s+/g, '');
  return `https://fotos.usig.buenosaires.gob.ar/getFoto?smp=${formattedSmp}&i=${index}&w=${width}`;
};

export const checkImageExists = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

export const isPDF = (url?: string): boolean => {
  return url?.toLowerCase().endsWith('.pdf') || false;
};

export const getPdfViewerUrl = (url?: string): string => {
  if (!url) return '';
  return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true&toolbar=0&navpanes=0&scrollbar=0&statusbar=0&view=fitH`;
};

// Sin tipologías dinámicas
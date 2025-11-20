import { Informe, PARCEL_DATA_CONFIG } from '../types/enums';

export const determinarTipoEdificacion = (alturaMax: number): string => {
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

export const calculateAreaPlantasTipicas = (
  pisosSinRetiro: number,
  superficieParcelaAjustada: number
): number => {
  return pisosSinRetiro * superficieParcelaAjustada;
};

export const calculateAreaPrimerRetiro = (
  superficieParcelaAjustada: number,
  frenteValor: number
): number => {
  return superficieParcelaAjustada - frenteValor * 2;
};

export const calculateAreaSegundoRetiro = (
  superficieParcelaAjustada: number,
  frenteValor: number
): number => {
  return superficieParcelaAjustada - frenteValor * 4;
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

const getEditedOrDefaultValue = <T>(
  editedValues: Record<string, unknown>,
  key: string,
  defaultValue: T
): T => {
  const value = Reflect.get(editedValues, key);
  return value !== undefined ? (value as T) : defaultValue;
};

const calculateCapacidadConstructiva = (
  superficieParcelaAjustada: number,
  frenteValor: number,
  alturaMax: number,
  informe: Informe
) => {
  const pisosSinRetiro = calculatePisosSinRetiro(alturaMax);
  const areaPlantasTipicas = calculateAreaPlantasTipicas(pisosSinRetiro, superficieParcelaAjustada);
  const areaPrimerRetiro = calculateAreaPrimerRetiro(superficieParcelaAjustada, frenteValor);
  const areaSegundoRetiro = calculateAreaSegundoRetiro(superficieParcelaAjustada, frenteValor);
  const totalCapConstructivaOriginal = calculateTotalCapConstructiva(
    areaPlantasTipicas,
    areaPrimerRetiro,
    areaSegundoRetiro
  );

  const calcularLfiAfeccionPercent = (): number => {
    const initialLfiAfeccionPercent: number =
      (informe.edificabilidad as { lfi_afeccion_percent?: number })?.lfi_afeccion_percent || 0;

    const totalCapConstructivaAjustada =
      initialLfiAfeccionPercent > 0
        ? totalCapConstructivaOriginal * (1 - initialLfiAfeccionPercent / 100)
        : totalCapConstructivaOriginal;

    if (initialLfiAfeccionPercent === 0 && totalCapConstructivaOriginal !== 0) {
      const diff = totalCapConstructivaOriginal - totalCapConstructivaAjustada;
      if (diff > 0) {
        return (diff / totalCapConstructivaOriginal) * 100;
      }
    }

    return initialLfiAfeccionPercent;
  };

  const lfiAfeccionPercent = calcularLfiAfeccionPercent();
  const totalCapConstructivaAjustada =
    lfiAfeccionPercent > 0
      ? totalCapConstructivaOriginal * (1 - lfiAfeccionPercent / 100)
      : totalCapConstructivaOriginal;

  return {
    pisosSinRetiro,
    totalPisos: calculateTotalPisos(alturaMax),
    tipoEdificacion: determinarTipoEdificacion(alturaMax),
    areaPlantasTipicas,
    areaPrimerRetiro,
    areaSegundoRetiro,
    totalCapConstructivaOriginal,
    totalCapConstructivaAjustada,
    lfiAfeccionPercent,
  };
};

const calculatePlusvaliaB = (informe: Informe): number => {
  if (!informe.edificabilidad?.plusvalia) return 0;

  const { incidencia_uva, plusvalia_em, plusvalia_pl, plusvalia_sl, uvaPersonalizado } =
    informe.edificabilidad.plusvalia;

  if (uvaPersonalizado && uvaPersonalizado > 0) {
    return Number(uvaPersonalizado);
  }

  const b = Number(incidencia_uva) || 0;
  if (b) return b;

  return Number(plusvalia_em) || Number(plusvalia_pl) || Number(plusvalia_sl) || 0;
};

const calculateAlicuota = (informe: Informe): number => {
  const alicuotaValor = informe.edificabilidad?.plusvalia?.alicuota;
  if (alicuotaValor !== undefined && alicuotaValor !== null) {
    return alicuotaValor;
  }

  const cpu = informe.edificabilidad?.plusvalia?.distrito_cpu?.toString().toUpperCase();
  const CPU_ALICUOTAS = {
    CPU1: 0.35,
    CPU2: 0.25,
    CPU3: 0.15,
    CPU4: 0.1,
  } as Record<string, number>;
  const cpuAlicuota = cpu ? Reflect.get(CPU_ALICUOTAS, cpu) : undefined;
  return cpuAlicuota !== undefined ? cpuAlicuota : 0;
};

export const calculateAllValues = (informe: Informe, editedValues: Record<string, unknown>) => {
  const superficieParcela = getEditedOrDefaultValue(
    editedValues,
    'superficieParcela',
    informe.edificabilidad?.superficie_parcela || 0
  );

  const superficieParcelaAjustada = calculateSuperficieParcelaAjustada(superficieParcela);

  const frenteValor = getEditedOrDefaultValue(
    editedValues,
    'frenteValor',
    parseFloat(informe.datosCatastrales?.frente || '0')
  );

  const fotMedanera = getEditedOrDefaultValue(
    editedValues,
    'fotMedanera',
    informe.edificabilidad?.fot?.fot_medianera || 0
  );

  const alturaMax = getEditedOrDefaultValue(
    editedValues,
    'alturaMax',
    informe.edificabilidad?.altura_max?.[0] || 0
  );

  const capacidadConstructiva = calculateCapacidadConstructiva(
    superficieParcelaAjustada,
    frenteValor,
    alturaMax,
    informe
  );

  const a1 = calculateA1(superficieParcela, fotMedanera);
  const a2 = calculateA2(capacidadConstructiva.totalCapConstructivaAjustada, a1);
  const a = calculateA(a1, a2);
  const b = calculatePlusvaliaB(informe);
  const axb = calculateAxB(a, b);
  const alicuotaValor = calculateAlicuota(informe);
  const alicuota = alicuotaValor * 100;
  const plusvaliaFinal = calculatePlusvaliaFinal(axb, alicuotaValor);

  return {
    superficieParcela,
    superficieParcelaAjustada,
    frenteValor,
    fotMedanera,
    alturaMax,
    pisosSinRetiro: capacidadConstructiva.pisosSinRetiro,
    totalPisos: capacidadConstructiva.totalPisos,
    tipoEdificacion: capacidadConstructiva.tipoEdificacion,
    areaPlantasTipicas: capacidadConstructiva.areaPlantasTipicas,
    areaPrimerRetiro: capacidadConstructiva.areaPrimerRetiro,
    areaSegundoRetiro: capacidadConstructiva.areaSegundoRetiro,
    totalCapConstructiva: capacidadConstructiva.totalCapConstructivaAjustada,
    totalCapConstructivaOriginal: capacidadConstructiva.totalCapConstructivaOriginal,
    lfiAfeccionPercent: capacidadConstructiva.lfiAfeccionPercent,
    a1,
    a2,
    a,
    b,
    axb,
    alicuotaValor,
    alicuota,
    plusvaliaFinal,
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

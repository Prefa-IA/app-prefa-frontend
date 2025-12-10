import { Informe, PARCEL_DATA_CONFIG } from '../types/enums';

// Prefijos de distritos especiales reconocidos
const PREFIJOS_DISTRITOS_ESPECIALES = [
  'U20',
  'U1',
  'U10',
  'U11',
  'U12',
  'U14',
  'U28',
  'U31',
  'U32',
  'APH',
  'AE',
  'DUE',
  'EE',
  'UBP',
];

/**
 * Verifica si un distrito normalizado es un distrito especial
 */
const esDistritoEspecial = (distritoNormalizado: string): boolean => {
  return PREFIJOS_DISTRITOS_ESPECIALES.some((prefijo) => distritoNormalizado.startsWith(prefijo));
};

/**
 * Normaliza un string de distrito eliminando espacios y convirtiendo a mayúsculas
 */
const normalizarDistrito = (distrito: string): string => {
  return distrito.trim().toUpperCase().replace(/\s+/g, '');
};

/**
 * Extrae el distrito especial desde el array distrito_especial del informe
 */
const obtenerDistritoEspecialDesdeArray = (distritoEspecial: unknown): string | null => {
  if (!Array.isArray(distritoEspecial) || distritoEspecial.length === 0) {
    return null;
  }

  const primerDistrito = distritoEspecial[0];
  if (!primerDistrito || typeof primerDistrito !== 'object') {
    return null;
  }

  const distritoEspecifico = (primerDistrito as { distrito_especifico?: string })
    .distrito_especifico;
  if (!distritoEspecifico) {
    return null;
  }

  return normalizarDistrito(distritoEspecifico);
};

/**
 * Obtiene el distrito especial desde el informe (distrito_especial o distrito_cpu)
 */
const obtenerDistritoEspecialDesdeInforme = (informe?: Informe): string | null => {
  // Intentar obtener desde distrito_especial
  const distritoEspecial = informe?.edificabilidad?.distrito_especial;
  if (distritoEspecial) {
    const distrito = obtenerDistritoEspecialDesdeArray(distritoEspecial);
    if (distrito && esDistritoEspecial(distrito)) {
      return distrito;
    }
  }

  // Intentar obtener desde distrito_cpu
  const distritoCpu = informe?.edificabilidad?.plusvalia?.distrito_cpu;
  if (distritoCpu) {
    const cpuNormalizado = normalizarDistrito(String(distritoCpu));
    if (esDistritoEspecial(cpuNormalizado)) {
      return cpuNormalizado;
    }
  }

  return null;
};

/**
 * Determina el tipo de edificación basado únicamente en la altura máxima
 */
const determinarTipoPorAltura = (alturaMax: number): string => {
  if (alturaMax >= 38) return 'Corredor Alto (PB + 12 pisos + 2 retiros)';
  if (alturaMax >= 31) return 'Corredor Medio (PB + 10 pisos + 2 retiros)';
  if (alturaMax >= 22.8) return 'USAA (PB + 7 plantas + 2 retiros)';
  if (alturaMax >= 17.2) return 'USAM (PB + 5 plantas + 2 retiros)';
  if (alturaMax >= 13) return 'USAB2 (PB + 4 plantas)';
  if (alturaMax >= 10.5) return 'USAB1 (PB + 3 plantas)';
  if (alturaMax >= 9) return 'USAB0 (PB + 2 plantas)';
  return 'No clasificado';
};

/**
 * Determina el tipo de edificación priorizando distrito especial sobre altura máxima
 */
export const determinarTipoEdificacion = (alturaMax: number, informe?: Informe): string => {
  // Priorizar distrito especial sobre altura máxima
  const distritoEspecial = obtenerDistritoEspecialDesdeInforme(informe);
  if (distritoEspecial) {
    return distritoEspecial;
  }

  // Si no hay distrito especial, determinar por altura
  return determinarTipoPorAltura(alturaMax);
};

export const calculatePisosSinRetiro = (alturaMax: number): number => {
  return alturaMax ? Math.floor(alturaMax / PARCEL_DATA_CONFIG.CALCULATIONS.FLOOR_HEIGHT) + 1 : 0;
};

const DISTRITOS_CON_REGLA_PISOS = ['CA', 'CM', 'USAA', 'USAM', 'USAB2', 'USAB1', 'USAB0'];
const TIPO_CORREDOR_ALTO = 'Corredor Alto';
const TIPO_CORREDOR_MEDIO = 'Corredor Medio';
const TIPO_USAA = 'USAA';
const TIPO_USAM = 'USAM';

const TIPO_EDIFICACION_PISOS: Record<
  string,
  { pisos: number; tieneRetiros: boolean; cantidadRetiros: number }
> = {
  'Corredor Alto': { pisos: 12, tieneRetiros: true, cantidadRetiros: 2 },
  'Corredor Medio': { pisos: 10, tieneRetiros: true, cantidadRetiros: 2 },
  USAA: { pisos: 7, tieneRetiros: true, cantidadRetiros: 2 },
  USAM: { pisos: 5, tieneRetiros: true, cantidadRetiros: 2 },
  USAB2: { pisos: 4, tieneRetiros: false, cantidadRetiros: 0 },
  USAB1: { pisos: 3, tieneRetiros: false, cantidadRetiros: 0 },
  USAB0: { pisos: 2, tieneRetiros: false, cantidadRetiros: 0 },
};

const PB_PISO = 1;

const calcularRetirosDisponibles = (
  config: { tieneRetiros: boolean; cantidadRetiros: number },
  tieneRetiros: boolean | undefined,
  m2Ret1?: number,
  m2Ret2?: number
): number => {
  if (!config.tieneRetiros || !tieneRetiros) {
    return 0;
  }

  if (m2Ret1 !== undefined || m2Ret2 !== undefined) {
    const retirosContados =
      (m2Ret1 !== undefined && m2Ret1 > 0 ? 1 : 0) + (m2Ret2 !== undefined && m2Ret2 > 0 ? 1 : 0);
    return retirosContados;
  }

  return config.cantidadRetiros;
};

export const calculateTotalPisos = (
  alturaMax: number,
  tipoEdificacion?: string,
  tieneRetiros?: boolean,
  distritoNormalizado?: string,
  m2Ret1?: number,
  m2Ret2?: number
): number => {
  if (!alturaMax) return 0;

  const aplicaRegla = distritoNormalizado
    ? DISTRITOS_CON_REGLA_PISOS.includes(distritoNormalizado)
    : true;

  if (!tipoEdificacion || !aplicaRegla) {
    const pisosSuperiores =
      Math.floor(alturaMax / PARCEL_DATA_CONFIG.CALCULATIONS.FLOOR_HEIGHT) - 1;
    const retirosContados = calcularRetirosDisponibles(
      { tieneRetiros: tieneRetiros || false, cantidadRetiros: 0 },
      tieneRetiros,
      m2Ret1,
      m2Ret2
    );
    return PB_PISO + pisosSuperiores + retirosContados;
  }

  for (const [tipo, config] of Object.entries(TIPO_EDIFICACION_PISOS)) {
    if (tipoEdificacion.includes(tipo)) {
      const retirosContados = calcularRetirosDisponibles(config, tieneRetiros, m2Ret1, m2Ret2);
      return PB_PISO + config.pisos + retirosContados;
    }
  }
  const pisosSuperiores = Math.floor(alturaMax / PARCEL_DATA_CONFIG.CALCULATIONS.FLOOR_HEIGHT) - 1;
  const retirosContados = calcularRetirosDisponibles(
    { tieneRetiros: tieneRetiros || false, cantidadRetiros: 0 },
    tieneRetiros,
    m2Ret1,
    m2Ret2
  );
  return PB_PISO + pisosSuperiores + retirosContados;
};

export const calculateSuperficieParcelaAjustada = (superficieParcela: number): number => {
  return superficieParcela - PARCEL_DATA_CONFIG.CALCULATIONS.PATIOS_ADJUSTMENT;
};

const formatearPisosSinRegla = (
  alturaMax: number,
  tieneRetiros: boolean | undefined,
  m2Ret1: number | undefined,
  m2Ret2: number | undefined
): string => {
  const pisosSuperiores = Math.floor(alturaMax / PARCEL_DATA_CONFIG.CALCULATIONS.FLOOR_HEIGHT) - 1;
  const retirosContados = calcularRetirosDisponibles(
    { tieneRetiros: tieneRetiros || false, cantidadRetiros: 0 },
    tieneRetiros,
    m2Ret1,
    m2Ret2
  );
  if (retirosContados > 0) {
    return `PB + ${pisosSuperiores} pisos + ${retirosContados} retiro${retirosContados > 1 ? 's' : ''}`;
  }
  return `PB + ${pisosSuperiores} pisos`;
};

const formatearPisosConRegla = (
  tipoEdificacion: string,
  tieneRetiros: boolean | undefined,
  m2Ret1: number | undefined,
  m2Ret2: number | undefined
): string => {
  for (const [tipo, config] of Object.entries(TIPO_EDIFICACION_PISOS)) {
    if (tipoEdificacion.includes(tipo)) {
      const retirosContados = calcularRetirosDisponibles(
        config,
        tieneRetiros ?? config.tieneRetiros,
        m2Ret1,
        m2Ret2
      );
      if (retirosContados > 0) {
        return `PB + ${config.pisos} plantas + ${retirosContados} retiro${retirosContados > 1 ? 's' : ''}`;
      }
      return `PB + ${config.pisos} plantas`;
    }
  }
  return '';
};

export const formatTotalPisos = (
  tipoEdificacion: string,
  distritoNormalizado?: string,
  alturaMax?: number,
  tieneRetiros?: boolean,
  m2Ret1?: number,
  m2Ret2?: number
): string => {
  const aplicaRegla = distritoNormalizado
    ? DISTRITOS_CON_REGLA_PISOS.includes(distritoNormalizado)
    : true;

  if (!aplicaRegla || !tipoEdificacion) {
    if (!alturaMax) return '';
    return formatearPisosSinRegla(alturaMax, tieneRetiros, m2Ret1, m2Ret2);
  }

  return formatearPisosConRegla(tipoEdificacion, tieneRetiros, m2Ret1, m2Ret2);
};

const PULMONES_M2 = 25;

const calcularAreaPlantasTipicasConReglaEspecial = (
  supEdificablePlanta: number,
  alturaMax: number,
  informe?: Informe
): number | null => {
  const tipoEdificacion = determinarTipoEdificacion(alturaMax, informe);

  for (const [tipo, config] of Object.entries(TIPO_EDIFICACION_PISOS)) {
    if (tipoEdificacion.includes(tipo)) {
      const areaPB = supEdificablePlanta;
      const areaPorPisoSuperior = supEdificablePlanta - PULMONES_M2;
      const areaPisosSuperiores = areaPorPisoSuperior * config.pisos;
      const areaPlantas = areaPB + areaPisosSuperiores;
      return areaPlantas;
    }
  }

  return null;
};

const calcularAreaConSupEdificablePlanta = (
  totalPisos: number,
  supEdificablePlanta: number,
  alturaMax?: number,
  m2Ret1?: number,
  m2Ret2?: number
): number => {
  if (totalPisos <= 1) {
    return supEdificablePlanta;
  }

  const areaPB = supEdificablePlanta;

  const pisosSuperiores =
    alturaMax && alturaMax > 0
      ? Math.floor(alturaMax / PARCEL_DATA_CONFIG.CALCULATIONS.FLOOR_HEIGHT) - 1
      : (() => {
          const retirosContados =
            (m2Ret1 !== undefined && m2Ret1 > 0 ? 1 : 0) +
            (m2Ret2 !== undefined && m2Ret2 > 0 ? 1 : 0);
          return totalPisos - PB_PISO - retirosContados;
        })();

  const areaPorPisoSuperior = supEdificablePlanta - PULMONES_M2;
  const areaPisosSuperiores = areaPorPisoSuperior * pisosSuperiores;
  const total = areaPB + areaPisosSuperiores;

  return total;
};

const calcularAreaConSuperficieParcela = (
  totalPisos: number,
  superficieParcelaAjustada?: number,
  superficieTotal?: number
): number => {
  if (superficieParcelaAjustada && superficieParcelaAjustada > 0) {
    return totalPisos * superficieParcelaAjustada;
  }
  if (superficieTotal && superficieTotal > 0) {
    return totalPisos * superficieTotal;
  }
  return 0;
};

const calcularAreaConReglaEspecial = (
  supEdificablePlanta: number,
  alturaMax: number,
  informe?: Informe
): number | null => {
  return calcularAreaPlantasTipicasConReglaEspecial(supEdificablePlanta, alturaMax, informe);
};

const calcularAreaConSupEdificablePlantaNormal = (
  totalPisos: number,
  supEdificablePlanta: number,
  alturaMax?: number,
  m2Ret1?: number,
  m2Ret2?: number
): number => {
  return calcularAreaConSupEdificablePlanta(
    totalPisos,
    supEdificablePlanta,
    alturaMax,
    m2Ret1,
    m2Ret2
  );
};

const calcularAreaConLfiOpcion = (
  totalPisos: number,
  informe: Informe,
  superficieParcelaAjustada?: number
): number => {
  const informeConCalculo = informe as Informe & {
    calculo?: Record<string, unknown>;
  };

  const m2Totales = informeConCalculo.calculo
    ? extraerValorNumerico(informeConCalculo.calculo, 'm2_totales')
    : 0;

  if (m2Totales > 0) {
    return m2Totales;
  }

  const superficieTotal = parseFloat(String(informe.datosCatastrales?.superficie || 0)) || 0;
  return calcularAreaConSuperficieParcela(totalPisos, superficieParcelaAjustada, superficieTotal);
};

export const calculateAreaPlantasTipicas = (
  totalPisos: number,
  informe: Informe,
  superficieParcelaAjustada?: number,
  distritoNormalizado?: string,
  m2Ret1?: number,
  m2Ret2?: number
): number => {
  const supEdificablePlanta = informe.edificabilidad?.sup_edificable_planta;
  const aplicaReglaEspecial = distritoNormalizado
    ? DISTRITOS_CON_REGLA_PISOS.includes(distritoNormalizado)
    : false;

  if (supEdificablePlanta && supEdificablePlanta > 0 && aplicaReglaEspecial) {
    const alturaMax = informe.edificabilidad?.altura_max?.[0] || 0;
    const resultadoEspecial = calcularAreaConReglaEspecial(supEdificablePlanta, alturaMax, informe);
    if (resultadoEspecial !== null) {
      return resultadoEspecial;
    }
  }

  if (supEdificablePlanta && supEdificablePlanta > 0) {
    const alturaMax = informe.edificabilidad?.altura_max?.[0] || 0;
    return calcularAreaConSupEdificablePlantaNormal(
      totalPisos,
      supEdificablePlanta,
      alturaMax,
      m2Ret1,
      m2Ret2
    );
  }

  return calcularAreaConLfiOpcion(totalPisos, informe, superficieParcelaAjustada);
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

const extraerValorNumerico = (
  calculo: Record<string, unknown>,
  clave: string,
  valorPorDefecto: number = 0
): number => {
  const value = Reflect.get(calculo, clave);
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return valorPorDefecto;
};

const calcularLfiAfeccionPercentDesdeInforme = (
  informe: Informe,
  totalCapConstructivaOriginal: number
): number => {
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

const logCapacidadConstructiva = (
  _areaPlantasTipicas: number,
  _areaPrimerRetiro: number,
  _areaSegundoRetiro: number,
  _totalCapConstructivaOriginal: number
): void => {
  // Función vacía - logs removidos
};

const extraerDatosCalculo = (informe: Informe) => {
  const informeConCalculo = informe as Informe & {
    calculo?: Record<string, unknown>;
  };
  const distritoNormalizado = informeConCalculo.calculo?.['distrito_normalizado'] as
    | string
    | undefined;
  const m2Ret1 = informeConCalculo.calculo
    ? extraerValorNumerico(informeConCalculo.calculo, 'm2_ret_1')
    : undefined;
  const m2Ret2 = informeConCalculo.calculo
    ? extraerValorNumerico(informeConCalculo.calculo, 'm2_ret_2')
    : undefined;
  return { distritoNormalizado, m2Ret1, m2Ret2 };
};

const calcularAreasRetiros = (
  tieneSupEdificablePlanta: boolean,
  tieneRetiros: boolean,
  m2Ret1: number | undefined,
  m2Ret2: number | undefined,
  superficieParcelaAjustada: number,
  frenteValor: number
) => {
  if (tieneSupEdificablePlanta) {
    return {
      areaPrimerRetiro: m2Ret1 !== undefined && m2Ret1 > 0 ? m2Ret1 : 0,
      areaSegundoRetiro: m2Ret2 !== undefined && m2Ret2 > 0 ? m2Ret2 : 0,
    };
  }

  const areaPrimerRetiro = tieneRetiros
    ? calculateAreaPrimerRetiro(superficieParcelaAjustada, frenteValor)
    : 0;
  const areaSegundoRetiro = tieneRetiros
    ? calculateAreaSegundoRetiro(superficieParcelaAjustada, frenteValor)
    : 0;
  return { areaPrimerRetiro, areaSegundoRetiro };
};

const calcularLfiYAjuste = (
  tieneSupEdificablePlanta: boolean,
  informe: Informe,
  totalCapConstructivaOriginal: number
) => {
  const lfiAfeccionPercent = tieneSupEdificablePlanta
    ? 0
    : calcularLfiAfeccionPercentDesdeInforme(informe, totalCapConstructivaOriginal);
  const totalCapConstructivaAjustada =
    lfiAfeccionPercent > 0
      ? totalCapConstructivaOriginal * (1 - lfiAfeccionPercent / 100)
      : totalCapConstructivaOriginal;
  return { lfiAfeccionPercent, totalCapConstructivaAjustada };
};

const calculateCapacidadConstructiva = (
  superficieParcelaAjustada: number,
  frenteValor: number,
  alturaMax: number,
  informe: Informe
) => {
  const tipoEdificacion = determinarTipoEdificacion(alturaMax, informe);
  const tieneRetiros =
    tipoEdificacion.includes(TIPO_CORREDOR_ALTO) ||
    tipoEdificacion.includes(TIPO_CORREDOR_MEDIO) ||
    tipoEdificacion.includes(TIPO_USAA) ||
    tipoEdificacion.includes(TIPO_USAM);

  const { distritoNormalizado, m2Ret1, m2Ret2 } = extraerDatosCalculo(informe);

  const totalPisos = calculateTotalPisos(
    alturaMax,
    tipoEdificacion,
    tieneRetiros,
    distritoNormalizado,
    m2Ret1,
    m2Ret2
  );

  const areaPlantasTipicas = calculateAreaPlantasTipicas(
    totalPisos,
    informe,
    superficieParcelaAjustada,
    distritoNormalizado,
    m2Ret1,
    m2Ret2
  );

  const supEdificablePlanta = informe.edificabilidad?.sup_edificable_planta;
  const tieneSupEdificablePlanta: boolean = Boolean(supEdificablePlanta && supEdificablePlanta > 0);

  const { areaPrimerRetiro, areaSegundoRetiro } = calcularAreasRetiros(
    tieneSupEdificablePlanta,
    tieneRetiros,
    m2Ret1,
    m2Ret2,
    superficieParcelaAjustada,
    frenteValor
  );

  const totalCapConstructivaOriginal = calculateTotalCapConstructiva(
    areaPlantasTipicas,
    areaPrimerRetiro,
    areaSegundoRetiro
  );

  if (tieneSupEdificablePlanta) {
    logCapacidadConstructiva(
      areaPlantasTipicas,
      areaPrimerRetiro,
      areaSegundoRetiro,
      totalCapConstructivaOriginal
    );
  }

  const { lfiAfeccionPercent, totalCapConstructivaAjustada } = calcularLfiYAjuste(
    tieneSupEdificablePlanta,
    informe,
    totalCapConstructivaOriginal
  );

  return {
    pisosSinRetiro: calculatePisosSinRetiro(alturaMax),
    totalPisos,
    tipoEdificacion,
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
    return alicuotaValor > 1 ? alicuotaValor / 100 : alicuotaValor;
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

const extraerValoresTotales = (calculo: Record<string, unknown>) => ({
  m2TotalesAjustados: extraerValorNumerico(calculo, 'm2_totales_ajustados'),
  m2Totales: extraerValorNumerico(calculo, 'm2_totales'),
  montoFinalPlusvalia: extraerValorNumerico(calculo, 'monto_final_plusvalia'),
});

const extraerValoresFachada = (calculo: Record<string, unknown>) => ({
  m2Fachada: extraerValorNumerico(calculo, 'm2_fachada'),
  m2FachadaBonus: extraerValorNumerico(calculo, 'm2_fachada_bonus'),
});

const extraerValoresRetiro = (calculo: Record<string, unknown>) => ({
  m2Ret1: extraerValorNumerico(calculo, 'm2_ret_1'),
  m2Ret2: extraerValorNumerico(calculo, 'm2_ret_2'),
});

const extraerValoresAdicionales = (calculo: Record<string, unknown>) => ({
  planoLimite: extraerValorNumerico(calculo, 'plano_limite'),
  lfiAplicada: extraerValorNumerico(calculo, 'lfi_aplicada'),
  lfiInicial: extraerValorNumerico(calculo, 'lfi_inicial'),
  superficieParcela: extraerValorNumerico(calculo, 'superficie_parcela'),
  areaElmMinima: extraerValorNumerico(calculo, 'area_elm_minima'),
  m2MaxElm: extraerValorNumerico(calculo, 'm2_max_elm'),
  ajusteSupUtil: extraerValorNumerico(calculo, 'ajuste_sup_util'),
  alturaPbMinima: extraerValorNumerico(calculo, 'altura_pb_minima'),
  cotaPbMaxima: extraerValorNumerico(calculo, 'cota_pb_maxima'),
  cotaPbMinima: extraerValorNumerico(calculo, 'cota_pb_minima'),
  largoParcela: extraerValorNumerico(calculo, 'largo_parcela'),
  distritoNormalizado:
    typeof calculo['distrito_normalizado'] === 'string'
      ? calculo['distrito_normalizado']
      : undefined,
  esEsquina: typeof calculo['es_esquina'] === 'boolean' ? calculo['es_esquina'] : undefined,
  esParcelaAngosta:
    typeof calculo['es_parcela_angosta'] === 'boolean' ? calculo['es_parcela_angosta'] : undefined,
  esParcelaPequena:
    typeof calculo['es_parcela_pequena'] === 'boolean' ? calculo['es_parcela_pequena'] : undefined,
  tipoEdificioInferido:
    typeof calculo['tipo_edificio_inferido'] === 'string'
      ? calculo['tipo_edificio_inferido']
      : undefined,
});

const extraerValoresCalculo = (calculo: Record<string, unknown>, alturaMax: number) => {
  return {
    ...extraerValoresTotales(calculo),
    ...extraerValoresFachada(calculo),
    ...extraerValoresRetiro(calculo),
    ...extraerValoresAdicionales(calculo),
    alturaMuroFachada: extraerValorNumerico(calculo, 'altura_muro_fachada', alturaMax),
  };
};

const calcularValoresA = (
  m2Totales: number,
  m2Fachada: number,
  a1Calculado: number,
  a2Calculado: number
) => {
  const a1Final = a1Calculado;
  const a2Final = m2Totales > 0 && m2Fachada > 0 ? m2Totales - a1Final : a2Calculado;
  const a = m2Totales > 0 ? m2Totales : calculateA(a1Final, a2Final);
  return { a1Final, a2Final, a };
};

const calcularLfiAfeccionPercent = (
  lfiAplicada: number,
  totalCapConstructivaOriginal: number,
  lfiAfeccionPercentCalculado: number
) => {
  if (lfiAplicada > 0 && totalCapConstructivaOriginal > 0) {
    return (lfiAplicada / totalCapConstructivaOriginal) * 100;
  }
  return lfiAfeccionPercentCalculado;
};

const calcularSuperficieYCapacidad = (
  valoresCalculo: ReturnType<typeof extraerValoresCalculo>,
  superficieParcela: number,
  superficieParcelaAjustada: number,
  frenteValor: number,
  informe: Informe
) => {
  const superficieParcelaFinal =
    valoresCalculo.superficieParcela > 0 ? valoresCalculo.superficieParcela : superficieParcela;

  const capacidadConstructiva = calculateCapacidadConstructiva(
    superficieParcelaAjustada,
    frenteValor,
    valoresCalculo.alturaMuroFachada,
    informe
  );

  return { superficieParcelaFinal, capacidadConstructiva };
};

const calcularValoresAConCalculo = (
  valoresCalculo: ReturnType<typeof extraerValoresCalculo>,
  superficieParcelaFinal: number,
  fotMedanera: number,
  capacidadConstructiva: ReturnType<typeof calculateCapacidadConstructiva>,
  tieneCalculoMotor: boolean,
  informe: Informe
) => {
  const supEdificablePlanta = informe.edificabilidad?.sup_edificable_planta;
  const tieneSupEdificablePlanta = supEdificablePlanta && supEdificablePlanta > 0;

  const m2TotalesDelCalculo =
    valoresCalculo.m2TotalesAjustados > 0
      ? valoresCalculo.m2TotalesAjustados
      : valoresCalculo.m2Totales > 0
        ? valoresCalculo.m2Totales
        : 0;

  const m2TotalesParaCalculo = tieneSupEdificablePlanta
    ? capacidadConstructiva.totalCapConstructivaAjustada
    : tieneCalculoMotor && m2TotalesDelCalculo > 0
      ? m2TotalesDelCalculo
      : capacidadConstructiva.totalCapConstructivaAjustada;

  const a1Final = calculateA1(superficieParcelaFinal, fotMedanera);
  const a2Calculado = calculateA2(m2TotalesParaCalculo, a1Final);

  if (tieneCalculoMotor) {
    const a = m2TotalesParaCalculo;

    return {
      valoresA: { a1Final, a2Final: a2Calculado, a },
      m2TotalesParaCalculo,
    };
  }

  const valoresA = calcularValoresA(
    m2TotalesParaCalculo,
    valoresCalculo.m2Fachada,
    a1Final,
    a2Calculado
  );

  return { valoresA, m2TotalesParaCalculo };
};

const calcularAreasRetiro = (
  valoresCalculo: ReturnType<typeof extraerValoresCalculo>,
  capacidadConstructiva: ReturnType<typeof calculateCapacidadConstructiva>,
  tieneCalculoMotor: boolean
) => {
  const areaPrimerRetiroFinal =
    tieneCalculoMotor && valoresCalculo.m2Ret1 > 0
      ? valoresCalculo.m2Ret1
      : tieneCalculoMotor
        ? 0
        : capacidadConstructiva.areaPrimerRetiro;

  const areaSegundoRetiroFinal =
    tieneCalculoMotor && valoresCalculo.m2Ret2 > 0
      ? valoresCalculo.m2Ret2
      : tieneCalculoMotor
        ? 0
        : capacidadConstructiva.areaSegundoRetiro;

  return { areaPrimerRetiroFinal, areaSegundoRetiroFinal };
};

const obtenerLfiPercentFromStats = (
  informe: Informe,
  estadisticasMapa?: { porcentaje_afectacion_lfi?: number } | null
): number => {
  const shpAssetsInfo = informe.shp_assets_info;
  const lfiPercentFromStatsRaw =
    estadisticasMapa?.porcentaje_afectacion_lfi ??
    shpAssetsInfo?.troneras?.estadisticas?.porcentaje_afectacion_lfi ??
    shpAssetsInfo?.estadisticas?.porcentaje_afectacion_lfi;

  if (typeof lfiPercentFromStatsRaw === 'number') {
    return lfiPercentFromStatsRaw;
  }
  if (typeof lfiPercentFromStatsRaw === 'string') {
    return Number.parseFloat(lfiPercentFromStatsRaw);
  }
  return 0;
};

const calcularCapacidadConstructivaFinal = (
  capacidadConstructiva: ReturnType<typeof calculateCapacidadConstructiva>,
  informe: Informe,
  m2TotalesParaCalculo: number,
  tieneCalculoMotor: boolean,
  lfiPercentFromStats: number
): number => {
  const supEdificablePlanta = informe.edificabilidad?.sup_edificable_planta;
  const tieneSupEdificablePlanta = supEdificablePlanta && supEdificablePlanta > 0;

  const capacidadConstructivaInicial = tieneSupEdificablePlanta
    ? capacidadConstructiva.totalCapConstructivaAjustada
    : tieneCalculoMotor && m2TotalesParaCalculo > 0
      ? m2TotalesParaCalculo
      : capacidadConstructiva.totalCapConstructivaAjustada;

  if (tieneSupEdificablePlanta) {
    return capacidadConstructivaInicial;
  }

  if (!Number.isNaN(lfiPercentFromStats) && lfiPercentFromStats > 0) {
    return (
      capacidadConstructivaInicial - capacidadConstructivaInicial * (lfiPercentFromStats / 100)
    );
  }

  return capacidadConstructivaInicial;
};

const calcularValoresPlusvalia = (
  valoresCalculo: ReturnType<typeof extraerValoresCalculo>,
  valoresA: ReturnType<typeof calcularValoresA>,
  capacidadConstructiva: ReturnType<typeof calculateCapacidadConstructiva>,
  informe: Informe,
  m2TotalesParaCalculo: number,
  tieneCalculoMotor: boolean,
  estadisticasMapa?: { porcentaje_afectacion_lfi?: number } | null
) => {
  const b = calculatePlusvaliaB(informe);
  const alicuotaValor = calculateAlicuota(informe);
  const alicuota = alicuotaValor * 100;

  const lfiPercentFromStats = obtenerLfiPercentFromStats(informe, estadisticasMapa);
  const totalCapConstructivaFinal = calcularCapacidadConstructivaFinal(
    capacidadConstructiva,
    informe,
    m2TotalesParaCalculo,
    tieneCalculoMotor,
    lfiPercentFromStats
  );

  const a2Recalculado = calculateA2(totalCapConstructivaFinal, valoresA.a1Final);
  const aRecalculado = calculateA(valoresA.a1Final, a2Recalculado);

  const axbRecalculado =
    tieneCalculoMotor && valoresCalculo.montoFinalPlusvalia > 0 && alicuotaValor > 0
      ? valoresCalculo.montoFinalPlusvalia / alicuotaValor
      : calculateAxB(aRecalculado, b);

  const plusvaliaFinalFinal =
    tieneCalculoMotor && valoresCalculo.montoFinalPlusvalia > 0
      ? valoresCalculo.montoFinalPlusvalia
      : calculatePlusvaliaFinal(axbRecalculado, alicuotaValor);

  const lfiAfeccionPercentFinal = calcularLfiAfeccionPercent(
    valoresCalculo.lfiAplicada,
    capacidadConstructiva.totalCapConstructivaOriginal,
    capacidadConstructiva.lfiAfeccionPercent
  );

  return {
    b,
    axb: axbRecalculado,
    alicuotaValor,
    alicuota,
    totalCapConstructivaFinal,
    lfiAfeccionPercentFinal,
    plusvaliaFinalFinal,
    a2Recalculado,
    aRecalculado,
  };
};

const calcularValoresFinalesDesdeCalculo = (
  usarCalculosMotor: boolean,
  valoresCalculo: ReturnType<typeof extraerValoresCalculo>,
  capacidadConstructiva: ReturnType<typeof calculateCapacidadConstructiva>,
  informe: Informe
) => {
  const pisosSinRetiroFinal = usarCalculosMotor
    ? calculatePisosSinRetiro(valoresCalculo.alturaMuroFachada)
    : capacidadConstructiva.pisosSinRetiro;

  const tipoEdificacionFinal = usarCalculosMotor
    ? determinarTipoEdificacion(valoresCalculo.alturaMuroFachada, informe)
    : capacidadConstructiva.tipoEdificacion;

  const tieneRetiros =
    tipoEdificacionFinal.includes(TIPO_CORREDOR_ALTO) ||
    tipoEdificacionFinal.includes(TIPO_CORREDOR_MEDIO) ||
    tipoEdificacionFinal.includes(TIPO_USAA) ||
    tipoEdificacionFinal.includes(TIPO_USAM);

  const totalPisosFinal = usarCalculosMotor
    ? calculateTotalPisos(
        valoresCalculo.alturaMuroFachada,
        tipoEdificacionFinal,
        tieneRetiros,
        valoresCalculo.distritoNormalizado,
        valoresCalculo.m2Ret1,
        valoresCalculo.m2Ret2
      )
    : capacidadConstructiva.totalPisos;

  const areaPlantasTipicasFinal = usarCalculosMotor
    ? calculateAreaPlantasTipicas(
        totalPisosFinal,
        informe,
        undefined,
        valoresCalculo.distritoNormalizado,
        valoresCalculo.m2Ret1,
        valoresCalculo.m2Ret2
      )
    : capacidadConstructiva.areaPlantasTipicas;

  return {
    pisosSinRetiroFinal,
    totalPisosFinal,
    tipoEdificacionFinal,
    areaPlantasTipicasFinal,
  };
};

const construirResultadoDesdeCalculo = (
  superficieParcelaFinal: number,
  superficieParcelaAjustada: number,
  frenteValor: number,
  fotMedanera: number,
  valoresCalculo: ReturnType<typeof extraerValoresCalculo>,
  valoresA: ReturnType<typeof calcularValoresA>,
  capacidadConstructiva: ReturnType<typeof calculateCapacidadConstructiva>,
  areaPrimerRetiroFinal: number,
  areaSegundoRetiroFinal: number,
  totalCapConstructivaFinal: number,
  lfiAfeccionPercentFinal: number,
  b: number,
  axb: number,
  alicuotaValor: number,
  alicuota: number,
  plusvaliaFinalFinal: number,
  usarCalculosMotor: boolean,
  valoresFinales: ReturnType<typeof calcularValoresFinalesDesdeCalculo>,
  a2Recalculado?: number,
  aRecalculado?: number
) => {
  const tipoEdificacionParaFormato =
    valoresCalculo.distritoNormalizado || valoresFinales.tipoEdificacionFinal;
  const totalPisosFormatted = formatTotalPisos(
    tipoEdificacionParaFormato,
    valoresCalculo.distritoNormalizado,
    valoresCalculo.alturaMuroFachada,
    capacidadConstructiva.tipoEdificacion.includes('Corredor') ||
      capacidadConstructiva.tipoEdificacion.includes('USAA') ||
      capacidadConstructiva.tipoEdificacion.includes('USAM'),
    valoresCalculo.m2Ret1,
    valoresCalculo.m2Ret2
  );

  return {
    superficieParcela: superficieParcelaFinal,
    superficieParcelaAjustada,
    frenteValor,
    fotMedanera,
    alturaMax: valoresCalculo.alturaMuroFachada,
    planoLimite: valoresCalculo.planoLimite,
    pisosSinRetiro: valoresFinales.pisosSinRetiroFinal,
    totalPisos: valoresFinales.totalPisosFinal,
    totalPisosFormatted: totalPisosFormatted || valoresFinales.totalPisosFinal.toString(),
    tipoEdificacion: valoresCalculo.distritoNormalizado || valoresFinales.tipoEdificacionFinal,
    areaPlantasTipicas: valoresFinales.areaPlantasTipicasFinal,
    areaPrimerRetiro: areaPrimerRetiroFinal,
    areaSegundoRetiro: areaSegundoRetiroFinal,
    totalCapConstructiva: totalCapConstructivaFinal,
    totalCapConstructivaOriginal: usarCalculosMotor
      ? totalCapConstructivaFinal
      : capacidadConstructiva.totalCapConstructivaOriginal,
    lfiAfeccionPercent: lfiAfeccionPercentFinal,
    a1: valoresA.a1Final,
    a2: a2Recalculado !== undefined ? a2Recalculado : valoresA.a2Final,
    a: aRecalculado !== undefined ? aRecalculado : valoresA.a,
    b,
    axb,
    alicuotaValor,
    alicuota,
    plusvaliaFinal: plusvaliaFinalFinal,
    m2FachadaBonus: valoresCalculo.m2FachadaBonus,
    areaElmMinima: valoresCalculo.areaElmMinima,
    m2MaxElm: valoresCalculo.m2MaxElm,
    lfiAplicada: valoresCalculo.lfiAplicada,
    lfiInicial: valoresCalculo.lfiInicial,
    ajusteSupUtil: valoresCalculo.ajusteSupUtil,
    alturaPbMinima: valoresCalculo.alturaPbMinima,
    cotaPbMaxima: valoresCalculo.cotaPbMaxima,
    cotaPbMinima: valoresCalculo.cotaPbMinima,
    largoParcela: valoresCalculo.largoParcela,
    distritoNormalizado: valoresCalculo.distritoNormalizado,
    esEsquina: valoresCalculo.esEsquina,
    esParcelaAngosta: valoresCalculo.esParcelaAngosta,
    esParcelaPequena: valoresCalculo.esParcelaPequena,
    tipoEdificioInferido: valoresCalculo.tipoEdificioInferido,
  };
};

const determinarTieneCalculoMotor = (
  valoresCalculo: ReturnType<typeof extraerValoresCalculo>
): boolean => {
  return (
    valoresCalculo.m2Totales > 0 ||
    valoresCalculo.m2TotalesAjustados > 0 ||
    valoresCalculo.m2Fachada > 0 ||
    valoresCalculo.m2Ret1 > 0 ||
    valoresCalculo.montoFinalPlusvalia > 0
  );
};

const prepararDatosCalculo = (
  calculo: Record<string, unknown>,
  informe: Informe,
  superficieParcela: number,
  superficieParcelaAjustada: number,
  frenteValor: number,
  fotMedanera: number,
  alturaMax: number,
  estadisticasMapa?: { porcentaje_afectacion_lfi?: number } | null
) => {
  const valoresCalculo = extraerValoresCalculo(calculo, alturaMax);
  const tieneCalculoMotor = determinarTieneCalculoMotor(valoresCalculo);

  const { superficieParcelaFinal, capacidadConstructiva } = calcularSuperficieYCapacidad(
    valoresCalculo,
    superficieParcela,
    superficieParcelaAjustada,
    frenteValor,
    informe
  );

  const { valoresA, m2TotalesParaCalculo } = calcularValoresAConCalculo(
    valoresCalculo,
    superficieParcelaFinal,
    fotMedanera,
    capacidadConstructiva,
    tieneCalculoMotor,
    informe
  );

  const { areaPrimerRetiroFinal, areaSegundoRetiroFinal } = calcularAreasRetiro(
    valoresCalculo,
    capacidadConstructiva,
    tieneCalculoMotor
  );

  const valoresPlusvalia = calcularValoresPlusvalia(
    valoresCalculo,
    valoresA,
    capacidadConstructiva,
    informe,
    m2TotalesParaCalculo,
    tieneCalculoMotor,
    estadisticasMapa
  );

  const valoresFinales = calcularValoresFinalesDesdeCalculo(
    tieneCalculoMotor,
    valoresCalculo,
    capacidadConstructiva,
    informe
  );

  return {
    valoresCalculo,
    tieneCalculoMotor,
    superficieParcelaFinal,
    capacidadConstructiva,
    valoresA,
    areaPrimerRetiroFinal,
    areaSegundoRetiroFinal,
    valoresPlusvalia,
    valoresFinales,
    frenteValor,
  };
};

const calcularValoresDesdeCalculo = (
  calculo: Record<string, unknown>,
  informe: Informe,
  superficieParcela: number,
  superficieParcelaAjustada: number,
  frenteValor: number,
  fotMedanera: number,
  alturaMax: number,
  estadisticasMapa?: { porcentaje_afectacion_lfi?: number } | null
) => {
  const datos = prepararDatosCalculo(
    calculo,
    informe,
    superficieParcela,
    superficieParcelaAjustada,
    frenteValor,
    fotMedanera,
    alturaMax,
    estadisticasMapa
  );

  return construirResultadoDesdeCalculo(
    datos.superficieParcelaFinal,
    superficieParcelaAjustada,
    datos.frenteValor,
    fotMedanera,
    datos.valoresCalculo,
    datos.valoresA,
    datos.capacidadConstructiva,
    datos.areaPrimerRetiroFinal,
    datos.areaSegundoRetiroFinal,
    datos.valoresPlusvalia.totalCapConstructivaFinal,
    datos.valoresPlusvalia.lfiAfeccionPercentFinal,
    datos.valoresPlusvalia.b,
    datos.valoresPlusvalia.axb,
    datos.valoresPlusvalia.alicuotaValor,
    datos.valoresPlusvalia.alicuota,
    datos.valoresPlusvalia.plusvaliaFinalFinal,
    datos.tieneCalculoMotor,
    datos.valoresFinales,
    datos.valoresPlusvalia.a2Recalculado,
    datos.valoresPlusvalia.aRecalculado
  );
};

const calcularLfiPercentDesdeEstadisticas = (
  estadisticasMapa?: { porcentaje_afectacion_lfi?: number } | null,
  shpAssetsInfo?: Informe['shp_assets_info']
): number => {
  const lfiPercentFromStatsRaw =
    estadisticasMapa?.porcentaje_afectacion_lfi ??
    shpAssetsInfo?.troneras?.estadisticas?.porcentaje_afectacion_lfi ??
    shpAssetsInfo?.estadisticas?.porcentaje_afectacion_lfi;

  if (typeof lfiPercentFromStatsRaw === 'number') {
    return lfiPercentFromStatsRaw;
  }
  if (typeof lfiPercentFromStatsRaw === 'string') {
    return Number.parseFloat(lfiPercentFromStatsRaw);
  }
  return 0;
};

const calcularTotalCapConstructivaFinal = (
  capacidadConstructiva: ReturnType<typeof calculateCapacidadConstructiva>,
  lfiPercentFromStats: number,
  informe: Informe
): number => {
  const supEdificablePlanta = informe.edificabilidad?.sup_edificable_planta;
  const tieneSupEdificablePlanta = supEdificablePlanta && supEdificablePlanta > 0;

  if (tieneSupEdificablePlanta) {
    return capacidadConstructiva.totalCapConstructivaAjustada;
  }

  if (!Number.isNaN(lfiPercentFromStats) && lfiPercentFromStats > 0) {
    return (
      capacidadConstructiva.totalCapConstructivaAjustada -
      capacidadConstructiva.totalCapConstructivaAjustada * (lfiPercentFromStats / 100)
    );
  }
  return capacidadConstructiva.totalCapConstructivaAjustada;
};

const calcularValoresPlusvaliaDesdeCapacidad = (
  superficieParcela: number,
  fotMedanera: number,
  totalCapConstructivaFinal: number,
  informe: Informe
) => {
  const a1 = calculateA1(superficieParcela, fotMedanera);
  const a2 = calculateA2(totalCapConstructivaFinal, a1);
  const a = calculateA(a1, a2);
  const b = calculatePlusvaliaB(informe);
  const axb = calculateAxB(a, b);
  const alicuotaValor = calculateAlicuota(informe);
  const alicuota = alicuotaValor * 100;
  const plusvaliaFinal = calculatePlusvaliaFinal(axb, alicuotaValor);

  return { a1, a2, a, b, axb, alicuotaValor, alicuota, plusvaliaFinal };
};

const obtenerTotalPisosFormatted = (
  capacidadConstructiva: ReturnType<typeof calculateCapacidadConstructiva>,
  informe: Informe
): string => {
  const informeConCalculo = informe as Informe & { calculo?: Record<string, unknown> };
  const distritoNormalizado = informeConCalculo.calculo?.['distrito_normalizado'] as
    | string
    | undefined;
  const m2Ret1 = informeConCalculo.calculo
    ? extraerValorNumerico(informeConCalculo.calculo, 'm2_ret_1')
    : undefined;
  const m2Ret2 = informeConCalculo.calculo
    ? extraerValorNumerico(informeConCalculo.calculo, 'm2_ret_2')
    : undefined;
  const alturaMax = informe.edificabilidad?.altura_max?.[0] || 0;
  const tieneRetiros =
    capacidadConstructiva.tipoEdificacion.includes(TIPO_CORREDOR_ALTO) ||
    capacidadConstructiva.tipoEdificacion.includes(TIPO_CORREDOR_MEDIO) ||
    capacidadConstructiva.tipoEdificacion.includes(TIPO_USAA) ||
    capacidadConstructiva.tipoEdificacion.includes(TIPO_USAM);

  const totalPisosFormatted = formatTotalPisos(
    capacidadConstructiva.tipoEdificacion,
    distritoNormalizado,
    alturaMax > 0 ? alturaMax : undefined,
    tieneRetiros,
    m2Ret1,
    m2Ret2
  );

  return totalPisosFormatted || capacidadConstructiva.totalPisos.toString();
};

const calcularValoresSinCalculo = (
  informe: Informe,
  superficieParcela: number,
  superficieParcelaAjustada: number,
  frenteValor: number,
  fotMedanera: number,
  alturaMax: number,
  estadisticasMapa?: { porcentaje_afectacion_lfi?: number } | null
) => {
  const capacidadConstructiva = calculateCapacidadConstructiva(
    superficieParcelaAjustada,
    frenteValor,
    alturaMax,
    informe
  );

  const lfiPercentFromStats = calcularLfiPercentDesdeEstadisticas(
    estadisticasMapa,
    informe.shp_assets_info
  );

  const totalCapConstructivaFinal = calcularTotalCapConstructivaFinal(
    capacidadConstructiva,
    lfiPercentFromStats,
    informe
  );

  const valoresPlusvalia = calcularValoresPlusvaliaDesdeCapacidad(
    superficieParcela,
    fotMedanera,
    totalCapConstructivaFinal,
    informe
  );

  const totalPisosFormatted = obtenerTotalPisosFormatted(capacidadConstructiva, informe);

  return {
    superficieParcela,
    superficieParcelaAjustada,
    frenteValor,
    fotMedanera,
    alturaMax,
    pisosSinRetiro: capacidadConstructiva.pisosSinRetiro,
    totalPisos: capacidadConstructiva.totalPisos,
    totalPisosFormatted: totalPisosFormatted,
    tipoEdificacion: capacidadConstructiva.tipoEdificacion,
    areaPlantasTipicas: capacidadConstructiva.areaPlantasTipicas,
    areaPrimerRetiro: capacidadConstructiva.areaPrimerRetiro,
    areaSegundoRetiro: capacidadConstructiva.areaSegundoRetiro,
    totalCapConstructiva: totalCapConstructivaFinal,
    totalCapConstructivaOriginal: capacidadConstructiva.totalCapConstructivaOriginal,
    lfiAfeccionPercent: capacidadConstructiva.lfiAfeccionPercent,
    a1: valoresPlusvalia.a1,
    a2: valoresPlusvalia.a2,
    a: valoresPlusvalia.a,
    b: valoresPlusvalia.b,
    axb: valoresPlusvalia.axb,
    alicuotaValor: valoresPlusvalia.alicuotaValor,
    alicuota: valoresPlusvalia.alicuota,
    plusvaliaFinal: valoresPlusvalia.plusvaliaFinal,
  };
};

export const calculateAllValues = (
  informe: Informe,
  editedValues: Record<string, unknown>,
  estadisticasMapa?: { porcentaje_afectacion_lfi?: number } | null
) => {
  const informeConCalculo = informe as Informe & { calculo?: Record<string, unknown> };
  const calculo = informeConCalculo.calculo;

  const superficieParcela = getEditedOrDefaultValue(
    editedValues,
    'superficieParcela',
    (calculo?.['superficie_parcela'] as number | undefined) ||
      informe.edificabilidad?.superficie_parcela ||
      0
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
    (calculo?.['altura_muro_fachada'] as number | undefined) ||
      informe.edificabilidad?.altura_max?.[0] ||
      0
  );

  if (calculo && typeof calculo === 'object') {
    const valores = calcularValoresDesdeCalculo(
      calculo,
      informe,
      superficieParcela,
      superficieParcelaAjustada,
      frenteValor,
      fotMedanera,
      alturaMax,
      estadisticasMapa
    );
    return valores;
  }
  return calcularValoresSinCalculo(
    informe,
    superficieParcela,
    superficieParcelaAjustada,
    frenteValor,
    fotMedanera,
    alturaMax,
    estadisticasMapa
  );
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

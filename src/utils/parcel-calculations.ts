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
  const a1Final = m2Fachada > 0 ? m2Fachada : a1Calculado;
  const a2Final = m2Totales > 0 && m2Fachada > 0 ? m2Totales - m2Fachada : a2Calculado;
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
  tieneCalculoMotor: boolean
) => {
  const m2TotalesDelCalculo =
    valoresCalculo.m2TotalesAjustados > 0
      ? valoresCalculo.m2TotalesAjustados
      : valoresCalculo.m2Totales > 0
        ? valoresCalculo.m2Totales
        : 0;

  const m2TotalesParaCalculo =
    tieneCalculoMotor && m2TotalesDelCalculo > 0
      ? m2TotalesDelCalculo
      : capacidadConstructiva.totalCapConstructivaAjustada;

  if (tieneCalculoMotor) {
    const a1Final =
      valoresCalculo.m2Fachada > 0
        ? valoresCalculo.m2Fachada
        : calculateA1(superficieParcelaFinal, fotMedanera);

    const m2Retiros = (valoresCalculo.m2Ret1 || 0) + (valoresCalculo.m2Ret2 || 0);
    const a2Final = m2Retiros > 0 ? m2Retiros : Math.max(0, m2TotalesParaCalculo - a1Final);

    const a = m2TotalesParaCalculo;

    return {
      valoresA: { a1Final, a2Final, a },
      m2TotalesParaCalculo,
    };
  }

  const a1Calculado = calculateA1(superficieParcelaFinal, fotMedanera);
  const a2Calculado = calculateA2(capacidadConstructiva.totalCapConstructivaAjustada, a1Calculado);

  const valoresA = calcularValoresA(
    m2TotalesParaCalculo,
    valoresCalculo.m2Fachada,
    a1Calculado,
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

const calcularValoresPlusvalia = (
  valoresCalculo: ReturnType<typeof extraerValoresCalculo>,
  valoresA: ReturnType<typeof calcularValoresA>,
  capacidadConstructiva: ReturnType<typeof calculateCapacidadConstructiva>,
  informe: Informe,
  m2TotalesParaCalculo: number,
  tieneCalculoMotor: boolean
) => {
  const b = calculatePlusvaliaB(informe);
  const axb = calculateAxB(valoresA.a, b);
  const alicuotaValor = calculateAlicuota(informe);
  const alicuota = alicuotaValor * 100;

  // Obtener porcentaje de afectación LFI desde shp_assets_info si está disponible
  const shpAssetsInfo = informe.shp_assets_info;
  const lfiPercentFromStats =
    shpAssetsInfo?.troneras?.estadisticas?.porcentaje_afectacion_lfi ??
    shpAssetsInfo?.estadisticas?.porcentaje_afectacion_lfi;

  // Calcular capacidad constructiva inicial
  const capacidadConstructivaInicial =
    tieneCalculoMotor && m2TotalesParaCalculo > 0
      ? m2TotalesParaCalculo
      : capacidadConstructiva.totalCapConstructivaAjustada;

  // Aplicar ajuste LFI si está disponible y es mayor a 0
  const factor =
    typeof lfiPercentFromStats === 'number' && lfiPercentFromStats > 0
      ? 1 - lfiPercentFromStats / 100
      : 1;

  const totalCapConstructivaFinal = capacidadConstructivaInicial * factor;

  const lfiAfeccionPercentFinal = calcularLfiAfeccionPercent(
    valoresCalculo.lfiAplicada,
    capacidadConstructiva.totalCapConstructivaOriginal,
    capacidadConstructiva.lfiAfeccionPercent
  );

  const plusvaliaFinalFinal =
    tieneCalculoMotor && valoresCalculo.montoFinalPlusvalia > 0
      ? valoresCalculo.montoFinalPlusvalia
      : calculatePlusvaliaFinal(axb, alicuotaValor);

  return {
    b,
    axb,
    alicuotaValor,
    alicuota,
    totalCapConstructivaFinal,
    lfiAfeccionPercentFinal,
    plusvaliaFinalFinal,
  };
};

const calcularValoresFinalesDesdeCalculo = (
  usarCalculosMotor: boolean,
  valoresCalculo: ReturnType<typeof extraerValoresCalculo>,
  capacidadConstructiva: ReturnType<typeof calculateCapacidadConstructiva>
) => {
  const pisosSinRetiroFinal = usarCalculosMotor
    ? calculatePisosSinRetiro(valoresCalculo.alturaMuroFachada)
    : capacidadConstructiva.pisosSinRetiro;

  const totalPisosFinal = usarCalculosMotor
    ? calculateTotalPisos(valoresCalculo.alturaMuroFachada)
    : capacidadConstructiva.totalPisos;

  const tipoEdificacionFinal = usarCalculosMotor
    ? determinarTipoEdificacion(valoresCalculo.alturaMuroFachada)
    : capacidadConstructiva.tipoEdificacion;

  const areaPlantasTipicasFinal =
    usarCalculosMotor && valoresCalculo.m2Fachada > 0
      ? valoresCalculo.m2Fachada
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
  valoresFinales: ReturnType<typeof calcularValoresFinalesDesdeCalculo>
) => {
  return {
    superficieParcela: superficieParcelaFinal,
    superficieParcelaAjustada,
    frenteValor,
    fotMedanera,
    alturaMax: valoresCalculo.alturaMuroFachada,
    planoLimite: valoresCalculo.planoLimite,
    pisosSinRetiro: valoresFinales.pisosSinRetiroFinal,
    totalPisos: valoresFinales.totalPisosFinal,
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
    a2: valoresA.a2Final,
    a: valoresA.a,
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

const calcularValoresDesdeCalculo = (
  calculo: Record<string, unknown>,
  informe: Informe,
  superficieParcela: number,
  superficieParcelaAjustada: number,
  frenteValor: number,
  fotMedanera: number,
  alturaMax: number
) => {
  const valoresCalculo = extraerValoresCalculo(calculo, alturaMax);

  const tieneCalculoMotor =
    valoresCalculo.m2Totales > 0 ||
    valoresCalculo.m2TotalesAjustados > 0 ||
    valoresCalculo.m2Fachada > 0 ||
    valoresCalculo.m2Ret1 > 0 ||
    valoresCalculo.montoFinalPlusvalia > 0;

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
    tieneCalculoMotor
  );

  const { areaPrimerRetiroFinal, areaSegundoRetiroFinal } = calcularAreasRetiro(
    valoresCalculo,
    capacidadConstructiva,
    tieneCalculoMotor
  );

  const {
    b,
    axb,
    alicuotaValor,
    alicuota,
    totalCapConstructivaFinal,
    lfiAfeccionPercentFinal,
    plusvaliaFinalFinal,
  } = calcularValoresPlusvalia(
    valoresCalculo,
    valoresA,
    capacidadConstructiva,
    informe,
    m2TotalesParaCalculo,
    tieneCalculoMotor
  );

  const usarCalculosMotor = tieneCalculoMotor;

  const valoresFinales = calcularValoresFinalesDesdeCalculo(
    usarCalculosMotor,
    valoresCalculo,
    capacidadConstructiva
  );

  return construirResultadoDesdeCalculo(
    superficieParcelaFinal,
    superficieParcelaAjustada,
    frenteValor,
    fotMedanera,
    valoresCalculo,
    valoresA,
    capacidadConstructiva,
    areaPrimerRetiroFinal,
    areaSegundoRetiroFinal,
    totalCapConstructivaFinal,
    lfiAfeccionPercentFinal,
    b,
    axb,
    alicuotaValor,
    alicuota,
    plusvaliaFinalFinal,
    usarCalculosMotor,
    valoresFinales
  );
};

const calcularValoresSinCalculo = (
  informe: Informe,
  superficieParcela: number,
  superficieParcelaAjustada: number,
  frenteValor: number,
  fotMedanera: number,
  alturaMax: number
) => {
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

export const calculateAllValues = (informe: Informe, editedValues: Record<string, unknown>) => {
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
      alturaMax
    );
    return valores;
  }
  return calcularValoresSinCalculo(
    informe,
    superficieParcela,
    superficieParcelaAjustada,
    frenteValor,
    fotMedanera,
    alturaMax
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

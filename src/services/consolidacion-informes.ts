import { GeometriaFeature, Informe, InformeCompuesto } from '../types/enums';

type AdyMap = Record<string, Set<string>>;

const buildAdyacencyMap = (informes: Informe[]): AdyMap => {
  const smpsSeleccionados = informes.map((inf) => inf.datosCatastrales?.smp).filter(Boolean);
  const ady: AdyMap = {};

  for (const inf of informes) {
    const smp = inf.datosCatastrales?.smp as string | undefined;
    if (!smp) {
      throw new Error('Cada informe debe incluir su código SMP.');
    }

    const linderas: string[] = Array.isArray(inf.edificabilidad?.parcelas_linderas?.smp_linderas)
      ? inf.edificabilidad?.parcelas_linderas?.smp_linderas
      : [];

    const extraVecinos: string[] = [];
    const prev = inf.datosCatastrales?.['smp_anterior'];
    const next = inf.datosCatastrales?.['smp_siguiente'];
    if (prev && typeof prev === 'string') extraVecinos.push(prev);
    if (next && typeof next === 'string') extraVecinos.push(next);

    const vecinosBrutos = [...linderas, ...extraVecinos];

    if (vecinosBrutos.length === 0) {
      throw new Error(
        `El informe para la parcela ${smp} no contiene información de parcelas linderas.`
      );
    }

    const filtradas = vecinosBrutos.filter((v) => smpsSeleccionados.includes(v));
    const smpSet = Reflect.get(ady, smp);
    if (!smpSet) Reflect.set(ady, smp, new Set());
    filtradas.forEach((l) => {
      const currentSmpSet = Reflect.get(ady, smp);
      if (currentSmpSet) currentSmpSet.add(l);
      const lSet = Reflect.get(ady, l);
      if (!lSet) Reflect.set(ady, l, new Set());
      const currentLSet = Reflect.get(ady, l);
      if (currentLSet) currentLSet.add(smp);
    });
  }

  return ady;
};

const getInformeBySmp = (informes: Informe[], smp: string): Informe => {
  const informe = informes.find((inf) => inf.datosCatastrales?.smp === smp);
  if (!informe) {
    throw new Error('Error interno validando linderas (informes faltantes)');
  }
  return informe;
};

const areSequentialNeighbors = (
  infA: Informe,
  infB: Informe,
  aSmp: string,
  bSmp: string
): boolean => {
  const aPrev = infA.datosCatastrales?.['smp_anterior'];
  const aNext = infA.datosCatastrales?.['smp_siguiente'];
  const bPrev = infB.datosCatastrales?.['smp_anterior'];
  const bNext = infB.datosCatastrales?.['smp_siguiente'];

  return aNext === bSmp || aPrev === bSmp || bNext === aSmp || bPrev === aSmp;
};

const areLinderasNeighbors = (
  infA: Informe,
  infB: Informe,
  aSmp: string,
  bSmp: string
): boolean => {
  const lindA: string[] = Array.isArray(infA.edificabilidad?.parcelas_linderas?.smp_linderas)
    ? infA.edificabilidad?.parcelas_linderas?.smp_linderas
    : [];
  const lindB: string[] = Array.isArray(infB.edificabilidad?.parcelas_linderas?.smp_linderas)
    ? infB.edificabilidad?.parcelas_linderas?.smp_linderas
    : [];

  return lindA.includes(bSmp) || lindB.includes(aSmp);
};

const areNeighbors = (infA: Informe, infB: Informe, aSmp: string, bSmp: string): boolean => {
  if (areSequentialNeighbors(infA, infB, aSmp, bSmp)) {
    return true;
  }
  return areLinderasNeighbors(infA, infB, aSmp, bSmp);
};

const validateLinderas = (informes: Informe[]): void => {
  const smpsSeleccionados = informes.map((inf) => inf.datosCatastrales?.smp).filter(Boolean);

  const smpsArray = Array.from(smpsSeleccionados);

  smpsArray.reduce((previousSmp: string | null, currentSmp: string) => {
    if (previousSmp && currentSmp) {
      const infA = getInformeBySmp(informes, previousSmp);
      const infB = getInformeBySmp(informes, currentSmp);

      if (!areNeighbors(infA, infB, previousSmp, currentSmp)) {
        throw new Error('Las parcelas seleccionadas no son parcelas linderas entre sí.');
      }
    }
    return currentSmp;
  }, null);
};

const consolidateDatosCatastrales = (consolidado: Informe, informes: Informe[]): void => {
  if (!consolidado.datosCatastrales) return;

  const superficieTotal = informes.reduce((total, inf) => {
    if (inf.datosCatastrales?.superficie) {
      const superficie =
        typeof inf.datosCatastrales.superficie === 'string'
          ? parseFloat(inf.datosCatastrales.superficie.replace(/,/g, '.'))
          : inf.datosCatastrales.superficie;

      if (!isNaN(superficie)) {
        return total + superficie;
      }
    }
    return total;
  }, 0);
  consolidado.datosCatastrales.superficie = superficieTotal.toString();

  const frenteTotal = informes.reduce((total, inf) => {
    if (inf.datosCatastrales?.frente) {
      const frente =
        typeof inf.datosCatastrales.frente === 'string'
          ? parseFloat(inf.datosCatastrales.frente.replace(/,/g, '.'))
          : inf.datosCatastrales.frente;

      if (!isNaN(frente)) {
        return total + frente;
      }
    }
    return total;
  }, 0);
  consolidado.datosCatastrales.frente = frenteTotal.toString();

  const smps = informes.map((inf) => inf.datosCatastrales?.smp || '').filter((smp) => smp);
  if (smps.length > 0) {
    consolidado.datosCatastrales.smp = smps.join(', ');
  }
};

const consolidateEdificabilidad = (consolidado: Informe, informes: Informe[]): void => {
  if (!consolidado.edificabilidad) return;

  const superficieParcelaTotal = informes.reduce((total, inf) => {
    return total + (inf.edificabilidad?.superficie_parcela || 0);
  }, 0);
  consolidado.edificabilidad.superficie_parcela = superficieParcelaTotal;

  const supEdificablePlantaTotal = informes.reduce((total, inf) => {
    return total + (inf.edificabilidad?.sup_edificable_planta || 0);
  }, 0);
  consolidado.edificabilidad.sup_edificable_planta = supEdificablePlantaTotal;

  const supMaxEdificableTotal = informes.reduce((total, inf) => {
    return total + (inf.edificabilidad?.sup_max_edificable || 0);
  }, 0);
  consolidado.edificabilidad.sup_max_edificable = supMaxEdificableTotal;

  if (consolidado.edificabilidad.plusvalia) {
    const plusvaliaTotals = informes.reduce(
      (totals, inf) => {
        return {
          em: totals.em + (inf.edificabilidad?.plusvalia?.plusvalia_em || 0),
          pl: totals.pl + (inf.edificabilidad?.plusvalia?.plusvalia_pl || 0),
        };
      },
      { em: 0, pl: 0 }
    );

    consolidado.edificabilidad.plusvalia.plusvalia_em = plusvaliaTotals.em;
    consolidado.edificabilidad.plusvalia.plusvalia_pl = plusvaliaTotals.pl;
  }
};

const consolidateGeometria = (consolidado: Informe, informes: Informe[]): void => {
  if (consolidado.geometria && consolidado.geometria.features) {
    const combinedFeatures: GeometriaFeature[] = [];
    informes.forEach((inf) => {
      if (inf.geometria?.features) {
        combinedFeatures.push(...inf.geometria.features);
      }
    });
    consolidado.geometria.features = combinedFeatures;
  }
};

const consolidateGoogleMaps = (consolidado: Informe, informes: Informe[]): void => {
  if (informes.every((inf) => inf.googleMaps)) {
    const avgLat =
      informes.reduce((sum, i) => sum + parseFloat(i.googleMaps.lat), 0) / informes.length;
    const avgLon =
      informes.reduce((sum, i) => sum + parseFloat(i.googleMaps.lon), 0) / informes.length;
    consolidado.googleMaps.lat = avgLat.toString();
    consolidado.googleMaps.lon = avgLon.toString();
  }
};

export const consolidarInformes = (informes: Informe[]): Informe => {
  if (informes.length === 0) {
    throw new Error('No hay informes para consolidar');
  }

  if (informes.length === 1) {
    return { ...informes[0] } as Informe;
  }

  const consolidado = JSON.parse(JSON.stringify(informes[0])) as Informe;

  const direccionesNormalizadas = informes.flatMap((inf) => inf.direccionesNormalizadas || []);
  consolidado.direccionesNormalizadas = direccionesNormalizadas;

  buildAdyacencyMap(informes);
  validateLinderas(informes);

  consolidateDatosCatastrales(consolidado, informes);
  consolidateEdificabilidad(consolidado, informes);
  consolidateGeometria(consolidado, informes);
  consolidateGoogleMaps(consolidado, informes);

  return consolidado;
};

export const crearInformeCompuesto = (
  direcciones: string[],
  informes: Informe[]
): InformeCompuesto => {
  const informeConsolidado = consolidarInformes(informes);

  return {
    direcciones,
    informesIndividuales: informes,
    informeConsolidado,
  };
};

export const obtenerDocumentosVisuales = (informes: Informe[]) => {
  const documentos = {
    croquis: [] as string[],
    perimetros: [] as string[],
    planosIndice: [] as string[],
  };

  informes.forEach((informe) => {
    if (informe.edificabilidad?.link_imagen?.croquis_parcela) {
      documentos.croquis.push(informe.edificabilidad.link_imagen.croquis_parcela);
    }

    if (informes.length > 1) {
      if (
        informe.edificabilidad?.link_imagen?.perimetro_manzana &&
        documentos.perimetros.length === 0
      ) {
        documentos.perimetros.push(informe.edificabilidad.link_imagen.perimetro_manzana);
      }
      if (
        informe.edificabilidad?.link_imagen?.plano_indice &&
        documentos.planosIndice.length === 0
      ) {
        documentos.planosIndice.push(informe.edificabilidad.link_imagen.plano_indice);
      }
    } else {
      if (informe.edificabilidad?.link_imagen?.perimetro_manzana) {
        documentos.perimetros.push(informe.edificabilidad.link_imagen.perimetro_manzana);
      }
      if (informe.edificabilidad?.link_imagen?.plano_indice) {
        documentos.planosIndice.push(informe.edificabilidad.link_imagen.plano_indice);
      }
    }
  });

  return documentos;
};

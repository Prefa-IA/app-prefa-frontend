import { Informe, InformeCompuesto } from '../types/enums';

/**
 * Consolida múltiples informes en un solo informe para prefactibilidades compuestas
 * @param informes Lista de informes individuales a consolidar
 * @returns Informe consolidado con datos sumados
 */
export const consolidarInformes = (informes: Informe[]): Informe => {
  if (informes.length === 0) {
    throw new Error('No hay informes para consolidar');
  }
  
  if (informes.length === 1) {
    return { ...informes[0] };
  }
  
  const consolidado = JSON.parse(JSON.stringify(informes[0])) as Informe;
  
  const direccionesNormalizadas = informes.flatMap(inf => inf.direccionesNormalizadas || []);
  consolidado.direccionesNormalizadas = direccionesNormalizadas;
  
  // -------------------------------------------------------------
  // Validación de encadenamiento por parcelas linderas
  // -------------------------------------------------------------
  // Reglas:
  // 1. Cada SMP seleccionado debe poder alcanzarse a partir del primero
  //    mediante una secuencia de "parcelas_linderas" incluidas en la selección.
  // 2. Si algún informe no posee la información de linderas, se considera inválido.

  // Construir mapa de adyacencias (SMP → linderas que forman parte de la selección)
  const smpsSeleccionados = informes.map(inf => inf.datosCatastrales?.smp).filter(Boolean);

  type AdyMap = Record<string, Set<string>>;
  const ady: AdyMap = {};

  for (const inf of informes) {
    const smp = inf.datosCatastrales?.smp as string | undefined;
    if (!smp) {
      throw new Error('Cada informe debe incluir su código SMP.');
    }

    const linderas: string[] = Array.isArray(inf.edificabilidad?.parcelas_linderas?.smp_linderas)
      ? (inf.edificabilidad?.parcelas_linderas?.smp_linderas as string[])
      : [];

    // Agregar vecinos implícitos por smp_anterior / siguiente
    const extraVecinos: string[] = [];
    const prev = inf.datosCatastrales?.smp_anterior;
    const next = inf.datosCatastrales?.smp_siguiente;
    if (prev) extraVecinos.push(prev);
    if (next) extraVecinos.push(next);

    const vecinosBrutos = [...linderas, ...extraVecinos];

    if (vecinosBrutos.length === 0) {
      throw new Error(`El informe para la parcela ${smp} no contiene información de parcelas linderas.`);
    }

    // Solo vecinos dentro de la selección
    const filtradas = vecinosBrutos.filter(v => smpsSeleccionados.includes(v));
    if (!ady[smp]) ady[smp] = new Set();
    filtradas.forEach((l) => {
      ady[smp].add(l);
      // agregar conexión inversa para considerar relación unidireccional
      if (!ady[l]) ady[l] = new Set();
      ady[l].add(smp);
    });
  }

  // -------------------------------------------------------------
  // Nueva validación: cada par consecutivo del listado debe ser lindero
  // usando primero smp_siguiente / smp_anterior; fallback a parcelas_linderas
  // -------------------------------------------------------------

  for (let i = 0; i < smpsSeleccionados.length - 1; i++) {
    const aSmp = smpsSeleccionados[i]!;
    const bSmp = smpsSeleccionados[i + 1]!;

    const infA = informes.find(inf => inf.datosCatastrales?.smp === aSmp);
    const infB = informes.find(inf => inf.datosCatastrales?.smp === bSmp);
    if (!infA || !infB) {
      throw new Error('Error interno validando linderas (informes faltantes)');
    }

    const aPrev = infA.datosCatastrales?.smp_anterior;
    const aNext = infA.datosCatastrales?.smp_siguiente;
    const bPrev = infB.datosCatastrales?.smp_anterior;
    const bNext = infB.datosCatastrales?.smp_siguiente;

    let sonVecinos = false;
    // Primer criterio: anterior / siguiente
    if (aNext === bSmp || aPrev === bSmp || bNext === aSmp || bPrev === aSmp) {
      sonVecinos = true;
    }

    // Fallback: parcelas_linderas en cualquiera de los dos
    if (!sonVecinos) {
      const lindA: string[] = Array.isArray(infA.edificabilidad?.parcelas_linderas?.smp_linderas)
        ? (infA.edificabilidad?.parcelas_linderas?.smp_linderas as string[])
        : [];
      const lindB: string[] = Array.isArray(infB.edificabilidad?.parcelas_linderas?.smp_linderas)
        ? (infB.edificabilidad?.parcelas_linderas?.smp_linderas as string[])
        : [];
      if (lindA.includes(bSmp) || lindB.includes(aSmp)) {
        sonVecinos = true;
      }
    }

    if (!sonVecinos) {
      throw new Error('Las parcelas seleccionadas no son parcelas linderas entre sí.');
    }
  }
  
  if (consolidado.datosCatastrales) {
    let superficieTotal = 0;
    informes.forEach(inf => {
      if (inf.datosCatastrales?.superficie) {
        const superficie = typeof inf.datosCatastrales.superficie === 'string'
          ? parseFloat(inf.datosCatastrales.superficie.replace(/,/g, '.'))
          : inf.datosCatastrales.superficie;
        
        if (!isNaN(superficie)) {
          superficieTotal += superficie;
        }
      }
    });
    consolidado.datosCatastrales.superficie = superficieTotal.toString();
    
    let frenteTotal = 0;
    informes.forEach(inf => {
      if (inf.datosCatastrales?.frente) {
        const frente = typeof inf.datosCatastrales.frente === 'string'
          ? parseFloat(inf.datosCatastrales.frente.replace(/,/g, '.'))
          : inf.datosCatastrales.frente;
        
        if (!isNaN(frente)) {
          frenteTotal += frente;
        }
      }
    });
    consolidado.datosCatastrales.frente = frenteTotal.toString();
    
    const smps = informes.map(inf => inf.datosCatastrales?.smp || '').filter(smp => smp);
    if (smps.length > 0) {
      consolidado.datosCatastrales.smp = smps.join(', ');
    }
  }
  
  if (consolidado.edificabilidad) {
    let superficieParcelaTotal = 0;
    informes.forEach(inf => {
      if (inf.edificabilidad?.superficie_parcela) {
        superficieParcelaTotal += inf.edificabilidad.superficie_parcela;
      }
    });
    consolidado.edificabilidad.superficie_parcela = superficieParcelaTotal;
    
    let supEdificablePlantaTotal = 0;
    informes.forEach(inf => {
      if (inf.edificabilidad?.sup_edificable_planta) {
        supEdificablePlantaTotal += inf.edificabilidad.sup_edificable_planta;
      }
    });
    consolidado.edificabilidad.sup_edificable_planta = supEdificablePlantaTotal;
    
    let supMaxEdificableTotal = 0;
    informes.forEach(inf => {
      if (inf.edificabilidad?.sup_max_edificable) {
        supMaxEdificableTotal += inf.edificabilidad.sup_max_edificable;
      }
    });
    consolidado.edificabilidad.sup_max_edificable = supMaxEdificableTotal;
    
    if (consolidado.edificabilidad.plusvalia) {
      let plusvaliaEmTotal = 0;
      let plusvaliaPlTotal = 0;
      
      informes.forEach(inf => {
        if (inf.edificabilidad?.plusvalia?.plusvalia_em) {
          plusvaliaEmTotal += inf.edificabilidad.plusvalia.plusvalia_em;
        }
        if (inf.edificabilidad?.plusvalia?.plusvalia_pl) {
          plusvaliaPlTotal += inf.edificabilidad.plusvalia.plusvalia_pl;
        }
      });
      
      consolidado.edificabilidad.plusvalia.plusvalia_em = plusvaliaEmTotal;
      consolidado.edificabilidad.plusvalia.plusvalia_pl = plusvaliaPlTotal;
    }
  }
  
  // Combinar geometrías de parcelas
  if (consolidado.geometria && consolidado.geometria.features) {
    const combinedFeatures = [] as any[];
    informes.forEach(inf => {
      if (inf.geometria?.features) {
        combinedFeatures.push(...inf.geometria.features);
      }
    });
    consolidado.geometria.features = combinedFeatures;
  }
  
  // Recalcular centro aproximado como promedio simple de coordenadas
  if (informes.every(inf => inf.googleMaps)) {
    const avgLat = informes.reduce((sum, i) => sum + parseFloat(i.googleMaps.lat), 0) / informes.length;
    const avgLon = informes.reduce((sum, i) => sum + parseFloat(i.googleMaps.lon), 0) / informes.length;
    consolidado.googleMaps.lat = avgLat.toString();
    consolidado.googleMaps.lon = avgLon.toString();
  }
  
  return consolidado;
};

/**
 * @param direcciones Lista de direcciones consultadas
 * @param informes Lista de informes individuales
 */
export const crearInformeCompuesto = (direcciones: string[], informes: Informe[]): InformeCompuesto => {
  const informeConsolidado = consolidarInformes(informes);
  
  return {
    direcciones,
    informesIndividuales: informes,
    informeConsolidado
  };
};

/**
 * @param informes Lista de informes individuales
 */
export const obtenerDocumentosVisuales = (informes: Informe[]) => {
  const documentos = {
    croquis: [] as string[],
    perimetros: [] as string[],
    planosIndice: [] as string[]
  };
  
  informes.forEach(informe => {
    if (informe.edificabilidad?.link_imagen?.croquis_parcela) {
      documentos.croquis.push(informe.edificabilidad.link_imagen.croquis_parcela);
    }

    // Perímetro de manzana y plano índice sólo deben incluirse una vez
    if (informes.length > 1) {
      if (informe.edificabilidad?.link_imagen?.perimetro_manzana && documentos.perimetros.length === 0) {
        documentos.perimetros.push(informe.edificabilidad.link_imagen.perimetro_manzana);
      }
      if (informe.edificabilidad?.link_imagen?.plano_indice && documentos.planosIndice.length === 0) {
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
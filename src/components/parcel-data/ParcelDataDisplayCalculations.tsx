import { InformeCompuesto } from '../../types/enums';
import { calculateAllValues } from '../../utils/parcel-calculations';

type CalculatedValues = ReturnType<typeof calculateAllValues>;

interface DisplayCalculationsProps {
  informe: {
    datosCatastrales?: { superficie_total?: string | number; frente?: string };
    edificabilidad?: { sup_edificable_planta?: number };
  };
  informeCompuesto: InformeCompuesto | undefined;
  esInformeCompuesto: boolean;
  calculatedValues: CalculatedValues;
}

const formatDim = (n: number) => `${Number(n).toFixed(2)} m`;

export const calculateDisplayValues = ({
  informe,
  informeCompuesto,
  esInformeCompuesto,
  calculatedValues,
}: DisplayCalculationsProps) => {
  const supTotalRaw = informe.datosCatastrales?.['superficie_total'];
  const supTotalValor = supTotalRaw
    ? parseFloat(String(supTotalRaw))
    : calculatedValues.superficieParcela || 0;
  const superficieTerrenoBase = supTotalValor ? `${supTotalValor.toFixed(2)} m²` : 'N/A';

  const datosCatastrales = informe.datosCatastrales as Record<string, unknown> | undefined;
  const supCubRaw = datosCatastrales?.['superficie_cubierta'];
  const supCubValor = supCubRaw ? parseFloat(String(supCubRaw)) : undefined;
  const superficieCubiertaBase = supCubValor !== undefined ? `${supCubValor.toFixed(2)} m²` : 'N/A';

  const frenteBase = formatDim(calculatedValues.frenteValor);

  const supEdifValor = informe.edificabilidad?.sup_edificable_planta;
  const superficieEdifBase =
    supEdifValor !== undefined && supEdifValor !== null
      ? `${Number(supEdifValor).toFixed(2)} m²`
      : 'N/A';

  const getSuperficieTerrenoDisplay = (): string => {
    if (!esInformeCompuesto || !informeCompuesto) return superficieTerrenoBase;
    const supList = informeCompuesto.informesIndividuales.map((i) => {
      const supTotal = i.datosCatastrales?.['superficie_total'];
      const supParcela = i.edificabilidad?.superficie_parcela;
      const valor = supTotal ? parseFloat(String(supTotal)) : supParcela ? Number(supParcela) : 0;
      return isNaN(valor) ? 0 : valor;
    });
    return `${superficieTerrenoBase} (${supList.join(' + ')})`;
  };

  const getSuperficieCubiertaDisplay = (): string => {
    if (!esInformeCompuesto || !informeCompuesto) return superficieCubiertaBase;
    const supCubList = informeCompuesto.informesIndividuales.map((i) => {
      const supCub = i.datosCatastrales?.['superficie_cubierta'];
      if (!supCub) return 0;
      const valor = parseFloat(String(supCub));
      return isNaN(valor) ? 0 : valor;
    });
    if (supCubList.some((v) => v)) {
      return `${superficieCubiertaBase} (${supCubList.join(' + ')})`;
    }
    return superficieCubiertaBase;
  };

  const getFrenteDisplay = (): string => {
    if (!esInformeCompuesto || !informeCompuesto) return frenteBase;
    const frenteList = informeCompuesto.informesIndividuales.map((i) =>
      parseFloat(i.datosCatastrales?.frente || '0')
    );
    return `${frenteBase} (${frenteList.map((f) => formatDim(f)).join(' + ')})`;
  };

  const getSuperficieEdifDisplay = (): string => {
    if (!esInformeCompuesto || !informeCompuesto) return superficieEdifBase;
    const supEdifList = informeCompuesto.informesIndividuales.map(
      (i) => i.edificabilidad?.sup_edificable_planta || 0
    );
    if (supEdifList.length > 0) {
      return `${informe.edificabilidad?.sup_edificable_planta} m² (${supEdifList.join(' + ')})`;
    }
    return superficieEdifBase;
  };

  return {
    superficieTerrenoDisplay: getSuperficieTerrenoDisplay(),
    superficieCubiertaDisplay: getSuperficieCubiertaDisplay(),
    frenteDisplay: getFrenteDisplay(),
    superficieEdifDisplay: getSuperficieEdifDisplay(),
  };
};

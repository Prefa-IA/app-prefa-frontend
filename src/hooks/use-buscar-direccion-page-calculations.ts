import { BasicInformationProps } from '../types/enums';
import { calculateAllValues } from '../utils/parcel-calculations';

export const useBuscarDireccionPageCalculations = (
  resultado: BasicInformationProps['informe'] | null
): BasicInformationProps['calculatedValues'] => {
  if (!resultado) {
    return { totalCapConstructiva: 0, plusvaliaFinal: 0 };
  }

  const values = calculateAllValues(resultado, {});
  return {
    totalCapConstructiva: values.totalCapConstructiva,
    plusvaliaFinal: values.plusvaliaFinal,
  };
};

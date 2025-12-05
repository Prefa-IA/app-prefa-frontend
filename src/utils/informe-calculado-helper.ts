import { Informe } from '../types/enums';

export const getInformeConCalculo = (informe: Informe): Informe => {
  const informeConCalculo = informe as Informe & { calculo?: unknown };
  if (informeConCalculo.calculo && typeof informeConCalculo.calculo === 'object') {
    return informe;
  }

  const informeConIA = informe as Informe & { iaResumen?: Informe };
  if (informeConIA.iaResumen && typeof informeConIA.iaResumen === 'object') {
    return informeConIA.iaResumen;
  }

  return informe;
};

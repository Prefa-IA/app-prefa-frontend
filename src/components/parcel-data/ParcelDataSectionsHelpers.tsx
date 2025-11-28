import { TIPO_PREFA } from '../../types/consulta-direccion';
import { Informe } from '../../types/enums';

interface ShouldShowSectionsProps {
  tipoPrefa: string;
  context: ReturnType<typeof import('../../utils/index-utils').generateIndexContext>;
  fachadaImages: string[];
  informeAMostrar: Informe;
}

export const shouldShowFacadeImages = ({
  tipoPrefa,
  context,
  fachadaImages,
}: ShouldShowSectionsProps): boolean => {
  return tipoPrefa === TIPO_PREFA.COMPLETA && (context.hasEntorno || fachadaImages.length > 0);
};

export const shouldShowDocumentViewer = ({ tipoPrefa }: ShouldShowSectionsProps): boolean => {
  return tipoPrefa === TIPO_PREFA.COMPLETA;
};

export const shouldShowPlusvalia = (_props: ShouldShowSectionsProps): boolean => {
  return true;
};

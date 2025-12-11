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

export const shouldShowDocumentViewer = ({
  tipoPrefa,
  informeAMostrar,
}: ShouldShowSectionsProps): boolean => {
  if (tipoPrefa !== TIPO_PREFA.COMPLETA) {
    return false;
  }

  // Verificar si realmente hay documentos visuales que mostrar
  const linkImagen = informeAMostrar.edificabilidad?.link_imagen;
  const hasCroquis = !!linkImagen?.croquis_parcela;
  const hasPerimetro = !!linkImagen?.perimetro_manzana;
  const hasPlanoIndice = !!linkImagen?.plano_indice;

  // Solo mostrar el DocumentViewer si hay al menos un documento visual
  return hasCroquis || hasPerimetro || hasPlanoIndice;
};

export const shouldShowPlusvalia = (_props: ShouldShowSectionsProps): boolean => {
  return true;
};

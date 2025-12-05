export const normalizarDireccion = (dir: string): string => {
  if (!dir) return '';
  return dir
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .replace(/,\s*/g, ',')
    .replace(/\s*,\s*/g, ',');
};

export const buscarInformeExistente = (
  informes: Array<{
    tipoPrefa?: string;
    direccionesNormalizadas?: Array<{ direccion?: string }>;
    direccion?: { direccion?: string; altura?: string };
  }>,
  direccionBusqueda: string,
  tipoPrefa: string
):
  | {
      tipoPrefa?: string;
      direccionesNormalizadas?: Array<{ direccion?: string }>;
      direccion?: { direccion?: string; altura?: string };
    }
  | undefined => {
  const direccionNormalizada = normalizarDireccion(direccionBusqueda);

  return informes.find((inf) => {
    if (inf.tipoPrefa !== tipoPrefa) return false;

    const direccionInforme =
      inf.direccionesNormalizadas?.[0]?.direccion ||
      `${inf.direccion?.direccion || ''} ${inf.direccion?.altura || ''}`.trim();

    if (!direccionInforme) return false;

    const informeNormalizado = normalizarDireccion(direccionInforme);

    return (
      informeNormalizado === direccionNormalizada ||
      informeNormalizado.includes(direccionNormalizada) ||
      direccionNormalizada.includes(informeNormalizado)
    );
  });
};

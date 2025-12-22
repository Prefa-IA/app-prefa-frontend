import React, { useEffect, useState } from 'react';

import useTablePersonalization from '../../hooks/use-table-personalization';
import { BasicInformationProps, Informe, PARCEL_DATA_CONFIG } from '../../types/enums';
import {
  calculateAllValues,
  checkImageExists,
  determinarTipoEdificacion,
  generateFachadaUrl,
  getPdfViewerUrl,
  isPDF,
} from '../../utils/parcel-calculations';
import DataTable, { TableRow } from '../parcel-data/DataTable';
import { calculateDisplayValues } from '../parcel-data/ParcelDataDisplayCalculations';

interface BasicSearchAdditionalSectionsProps {
  informe: Informe;
  calculatedValues: BasicInformationProps['calculatedValues'];
}

type CalculatedValues = ReturnType<typeof calculateAllValues>;

const normalizeSsplanUrl = (url: string): string => {
  if (url.includes('ssplan.buenosaires.gov.ar')) {
    return url.replace(
      /^https:\/\/(www\.)?ssplan\.buenosaires\.gov\.ar/,
      'http://www.ssplan.buenosaires.gov.ar'
    );
  }
  return url;
};

const getZonaDisplay = (
  zonaEspecial: unknown,
  subzona: string | undefined,
  zonificacion: string | undefined
): string => {
  if (zonaEspecial) {
    if (Array.isArray(zonaEspecial)) {
      const distritoEspecifico = zonaEspecial.find((d) => d?.distrito_especifico)?.distrito_especifico;
      if (distritoEspecifico) return distritoEspecifico;
    } else {
      const distritoEspecifico = (zonaEspecial as { distrito_especifico?: string })?.distrito_especifico;
      if (distritoEspecifico) return distritoEspecifico;
    }
  }
  if (subzona) return subzona;
  if (zonificacion) return zonificacion;
  return 'N/A';
};

const getDistritoDisplay = (
  distritoCPU: string | undefined,
  subzona: string | undefined,
  zonificacion: string | undefined
): string => {
  if (distritoCPU) return distritoCPU;
  if (subzona) return subzona;
  if (zonificacion) return zonificacion;
  return 'N/A';
};

const getCatalogacionPorAltura = (alturaMax: number): string => {
  if (alturaMax >= 38) return 'Corredor Alto (PB + 12 pisos + 2 retiros)';
  if (alturaMax >= 31) return 'Corredor Medio (PB + 10 pisos + 2 retiros)';
  if (alturaMax >= 22.8) return 'USAA (PB + 7 plantas + 2 retiros)';
  if (alturaMax >= 17.2) return 'USAM (PB + 5 plantas + 2 retiros)';
  if (alturaMax >= 13) return 'USAB2 (PB + 4 plantas)';
  if (alturaMax >= 10.5) return 'USAB1 (PB + 3 plantas)';
  if (alturaMax >= 9) return 'USAB0 (PB + 2 plantas)';
  return 'No clasificado';
};

const useFachadaImages = (smp: string | undefined): { images: string[]; loading: boolean } => {
  const [fachadaImages, setFachadaImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);

  useEffect(() => {
    const loadFachadaImages = async () => {
      if (!smp) {
        setFachadaImages([]);
        setLoadingImages(false);
        return;
      }

      const potentialUrls = Array.from({ length: 5 }, (_, i) => generateFachadaUrl(smp, i));
      const validImages: string[] = [];

      for (const url of potentialUrls) {
        const exists = await checkImageExists(url);
        if (exists && !validImages.includes(url)) {
          validImages.push(url);
        }
      }

      setFachadaImages(validImages);
      setLoadingImages(false);
    };

    void loadFachadaImages();
  }, [smp]);

  return { images: fachadaImages, loading: loadingImages };
};

const DocumentItem: React.FC<{
  url: string;
  title: string;
  defaultImageUrl: string;
  onError?: () => void;
}> = ({ url, title, defaultImageUrl, onError }) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  if (hasError) return null;

  const normalizedUrl = normalizeSsplanUrl(url);

  return (
    <div className="border border-gray-300 dark:border-gray-700 p-4 text-center">
      {!isPDF(normalizedUrl) ? (
        <div className="relative">
          <img
            src={normalizedUrl}
            alt={title}
            className="max-w-full h-auto mx-auto"
            onError={handleError}
            onLoad={() => {
              if (normalizedUrl === defaultImageUrl) {
                handleError();
              }
            }}
          />
        </div>
      ) : (
        <iframe
          src={getPdfViewerUrl(normalizedUrl)}
          className="w-full h-[600px] border-0"
          title={title}
          onError={handleError}
        />
      )}
    </div>
  );
};

const SegunCodigoUrbanisticoSection: React.FC<{
  informe: Informe;
  calculatedValues: CalculatedValues;
  breakdown: {
    superficieTerrenoDisplay: string;
    superficieCubiertaDisplay: string;
    frenteDisplay: string;
  };
}> = ({ informe, calculatedValues: _calculatedValues, breakdown }) => {
  const { parentTableStyle } = useTablePersonalization();

  return (
    <div className="mt-6">
      <div className={`${PARCEL_DATA_CONFIG.TABLE_HEADER_CLASS} mb-4`} style={parentTableStyle}>
        SEGÚN CÓDIGO URBANÍSTICO
      </div>

      <div className={PARCEL_DATA_CONFIG.GRID_COLS_3}>
        <TerrainDataTable informe={informe} breakdown={breakdown} />

        <ZoningDataTable informe={informe} />

        <BuildabilityDataTable informe={informe} calculatedValues={_calculatedValues} />
      </div>
    </div>
  );
};

const TerrainDataTable: React.FC<{
  informe: Informe;
  breakdown: {
    superficieTerrenoDisplay: string;
    superficieCubiertaDisplay: string;
    frenteDisplay: string;
  };
}> = ({ informe, breakdown }) => {
  const frenteRaw = informe.datosCatastrales?.frente;
  const frenteValor = frenteRaw ? parseFloat(String(frenteRaw)) : NaN;
  const frenteDisplay =
    !isNaN(frenteValor) && frenteValor > 0
      ? `${frenteValor.toFixed(2)} m`
      : breakdown.frenteDisplay && breakdown.frenteDisplay !== 'NaN m'
        ? breakdown.frenteDisplay
        : 'N/A';

  return (
    <DataTable title="DATOS DEL TERRENO">
      <div className="p-2">
        <TableRow label="Superficie" value={breakdown.superficieTerrenoDisplay} />

        <TableRow label="Superficie Cubierta" value={breakdown.superficieCubiertaDisplay} />

        <TableRow label="Frente" value={frenteDisplay} />

        <TableRow
          label="Fondo"
          value={
            informe.datosCatastrales?.fondo
              ? `${parseFloat(informe.datosCatastrales.fondo).toFixed(2)} m`
              : 'N/A'
          }
        />

        <TableRow
          label="Ochava"
          value={(informe.datosCatastrales?.['ochava'] as string | undefined) || 'N/A'}
        />
      </div>
    </DataTable>
  );
};

const ZoningDataTable: React.FC<{
  informe: Informe;
}> = ({ informe }) => {
  const distritoCPU = informe.edificabilidad?.plusvalia?.distrito_cpu;
  const catalogacionData = informe.edificabilidad?.catalogacion;

  const getCatalogacionValue = (): string => {
    if (!catalogacionData) return 'N/A';
    
    const campos = [
      catalogacionData.catalogacion,
      catalogacionData.denominacion,
      catalogacionData.estado,
      catalogacionData.proteccion,
    ];

    const valorValido = campos.find(
      (campo) => campo && typeof campo === 'string' && campo.trim() !== ''
    );

    return valorValido || 'N/A';
  };

  const catalogacion = getCatalogacionValue();
  const troneras = informe.edificabilidad?.troneras;

  return (
    <DataTable title="DATOS DE LA ZONIFICACIÓN">
      <div className="p-2">
        <TableRow label="Zonificación según CU" value={distritoCPU || 'N/A'} />

        <TableRow
          label="Troneras"
          value={
            troneras && troneras.cantidad > 0
              ? `${troneras.cantidad}${troneras.area_total ? ` (${troneras.area_total.toFixed(2)} m²)` : ''}`
              : 'N/A'
          }
        />

        <TableRow label="Catalogación" value={catalogacion} />
      </div>
    </DataTable>
  );
};

const BuildabilityDataTable: React.FC<{
  informe: Informe;
  calculatedValues: CalculatedValues;
}> = ({ informe, calculatedValues }) => {
  const alturaMax =
    (calculatedValues.alturaMax ?? 0) > 0
      ? (calculatedValues.alturaMax ?? 0)
      : informe.edificabilidad?.altura_max?.[0] || 0;
  const unidadEdificabilidad = informe.edificabilidad?.unidad_edificabilidad?.[0] || 0;

  const tipoEdificacion =
    (calculatedValues.tipoEdificacion as string | undefined) ||
    (alturaMax > 0 ? determinarTipoEdificacion(alturaMax, informe) : null) ||
    'N/A';

  return (
    <DataTable title="DATOS DE EDIFICABILIDAD">
      <div className="p-2">
        <TableRow label="Altura Máxima" value={alturaMax > 0 ? `${alturaMax} m` : 'N/A'} />

        <TableRow label="Tipo de Edificación" value={tipoEdificacion} />

        <TableRow
          label="Unidad de Edificabilidad"
          value={unidadEdificabilidad > 0 ? unidadEdificabilidad.toString() : 'N/A'}
        />
      </div>
    </DataTable>
  );
};

const AdditionalInfoTable: React.FC<{
  zona: string;
  distrito: string;
  catalogacionPorAltura: string;
  catalogacion: string | null;
}> = ({ zona, distrito, catalogacionPorAltura, catalogacion }) => (
  <DataTable title="INFORMACIÓN ADICIONAL">
    <div className="p-2">
      <TableRow label="Zona" value={zona} />
      <TableRow label="Distrito" value={distrito} />
      <TableRow label="Catalogación según altura máxima" value={catalogacionPorAltura} />
      {catalogacion && <TableRow label="Catalogación" value={catalogacion} />}
    </div>
  </DataTable>
);

const CroquisSection: React.FC<{ croquis: string }> = ({ croquis }) => (
  <div className="mt-6">
    <DataTable title="CROQUIS DE LA PARCELA">
      <div className="p-4">
        <DocumentItem
          url={croquis}
          title="Croquis de la parcela"
          defaultImageUrl={PARCEL_DATA_CONFIG.DEFAULT_IMAGES.CROQUIS}
        />
      </div>
    </DataTable>
  </div>
);

const PlanoIndiceSection: React.FC<{ planoIndice: string }> = ({ planoIndice }) => (
  <div className="mt-6">
    <DataTable title="PLANO ÍNDICE">
      <div className="p-4">
        <DocumentItem
          url={planoIndice}
          title="Plano índice"
          defaultImageUrl={PARCEL_DATA_CONFIG.DEFAULT_IMAGES.PLANO_INDICE}
        />
      </div>
    </DataTable>
  </div>
);

const extractCatalogacion = (catalogacionData: Informe['edificabilidad']['catalogacion']): string | null => {
  return (
    catalogacionData?.catalogacion ||
    catalogacionData?.denominacion ||
    catalogacionData?.estado ||
    catalogacionData?.proteccion ||
    null
  );
};

const extractLinkImagenData = (linkImagen: Informe['edificabilidad']['link_imagen']) => {
  return {
    croquis: linkImagen?.croquis_parcela,
    planoIndice: linkImagen?.plano_indice,
  };
};

const prepareDisplayData = (
  informe: Informe,
  calculatedValues: CalculatedValues
): {
  zonaDisplay: string;
  distritoDisplay: string;
  catalogacionPorAltura: string;
  catalogacion: string | null;
  breakdown: ReturnType<typeof calculateDisplayValues>;
} => {
  const distritoCPU = informe.edificabilidad?.plusvalia?.distrito_cpu;
  const zonaEspecial = informe.edificabilidad?.distrito_especial;
  const subzona = informe.edificabilidad?.subzona;
  const zonificacion = informe.datosCatastrales?.zonificacion;
  const catalogacionData = informe.edificabilidad?.catalogacion;
  const alturaMax = informe.edificabilidad?.altura_max?.[0] || 0;

  const zonaDisplay = getZonaDisplay(zonaEspecial, subzona, zonificacion);
  const distritoDisplay = getDistritoDisplay(distritoCPU, subzona, zonificacion);
  const catalogacionPorAltura = alturaMax > 0 ? getCatalogacionPorAltura(alturaMax) : 'N/A';
  const catalogacion = extractCatalogacion(catalogacionData);

  const breakdown = calculateDisplayValues({
    informe,
    informeCompuesto: undefined,
    esInformeCompuesto: false,
    calculatedValues,
  });

  return {
    zonaDisplay,
    distritoDisplay,
    catalogacionPorAltura,
    catalogacion,
    breakdown,
  };
};

const BasicSearchAdditionalSections: React.FC<BasicSearchAdditionalSectionsProps> = ({
  informe,
  calculatedValues,
}) => {
  const smp = informe.datosCatastrales?.smp;
  const linkImagen = informe.edificabilidad?.link_imagen;
  const { croquis, planoIndice } = extractLinkImagenData(linkImagen);
  const { images: fachadaImages, loading: loadingImages } = useFachadaImages(smp);

  const displayData = prepareDisplayData(informe, calculatedValues as CalculatedValues);

  return (
    <div className="mt-6 space-y-6">
      <SegunCodigoUrbanisticoSection
        informe={informe}
        calculatedValues={calculatedValues as CalculatedValues}
        breakdown={displayData.breakdown}
      />

      <AdditionalInfoTable
        zona={displayData.zonaDisplay}
        distrito={displayData.distritoDisplay}
        catalogacionPorAltura={displayData.catalogacionPorAltura}
        catalogacion={displayData.catalogacion}
      />

      {!loadingImages && fachadaImages.length > 0 && (
        <div className="mt-6">
          <FacadeImagesSection images={fachadaImages} />
        </div>
      )}

      {croquis && <CroquisSection croquis={croquis} />}

      {planoIndice && <PlanoIndiceSection planoIndice={planoIndice} />}
    </div>
  );
};

const FacadeImagesSection: React.FC<{ images: string[] }> = ({ images }) => {
  const { parentTableStyle } = useTablePersonalization();
  const uniqueImages = images.filter((url, idx) => images.indexOf(url) === idx);
  const gridClass = uniqueImages.length > 1 ? 'grid-cols-2' : 'grid-cols-1';
  const displayImages = uniqueImages.slice(0, uniqueImages.length === 1 ? 1 : 2);

  return (
    <div>
      <div className={`${PARCEL_DATA_CONFIG.TABLE_HEADER_CLASS} mb-4`} style={parentTableStyle}>
        ENTORNO / IMAGEN DE LA FACHADA
      </div>
      <div className={`grid ${gridClass} gap-4`}>
        {displayImages.map((imageUrl, index) => (
          <div
            key={index}
            className="border border-gray-300 dark:border-gray-700 p-4 text-center h-[400px] overflow-hidden"
          >
            <img
              src={imageUrl}
              alt={`Fachada vista ${index + 1}`}
              className="max-h-full object-contain mx-auto"
              onError={(e) => {
                const container = e.currentTarget.parentElement;
                if (container) {
                  container.style.display = 'none';
                }
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BasicSearchAdditionalSections;


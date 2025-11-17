import React from 'react';

import { ParcelInfoItemProps, PlanoSectionProps } from '../types/components';
import {
  PARCEL_MAP_CONFIG,
  ParcelInfoProps,
  ParcelMapPageProps,
  PlanoContainerProps,
} from '../types/enums';

import ParcelaPlano from './ParcelaPlano';

import styles from '../styles/ParcelMapPage.module.css';

const ParcelMapPage: React.FC<ParcelMapPageProps> = ({ informe }) => {
  return (
    <div className={styles['container']}>
      <TitleSection />
      <PlanoSection informe={informe} />
      <ParcelInfo geometria={informe.geometria} />
      <PageNumber />
    </div>
  );
};

const TitleSection: React.FC = () => (
  <div className={styles['titleSection']}>
    <h2 className={styles['title']}>{PARCEL_MAP_CONFIG.TITLE}</h2>
  </div>
);

const PlanoSection: React.FC<PlanoSectionProps> = ({ informe }) => {
  const coordinates = informe.geometria?.features?.[0]?.geometry?.coordinates?.[0]?.[0];

  if (!coordinates) {
    return <div>No hay datos de coordenadas disponibles</div>;
  }

  return (
    <PlanoContainer
      coordinates={coordinates}
      datosCatastrales={informe.datosCatastrales}
      datosEdificabilidad={informe.edificabilidad}
    />
  );
};

const PlanoContainer: React.FC<PlanoContainerProps> = ({
  coordinates,
  datosCatastrales,
  datosEdificabilidad,
}) => (
  <div className={styles['planoContainer']}>
    <ParcelaPlano
      coordinates={coordinates}
      datosCatastrales={datosCatastrales}
      datosEdificabilidad={datosEdificabilidad}
    />
  </div>
);

const ParcelInfo: React.FC<ParcelInfoProps> = ({ geometria }) => {
  const feature = geometria?.features?.[0];
  const codigo = feature?.properties?.codigo || 'N/A';
  const fechaActualizacion = feature?.properties?.fecha_actualizacion || 'N/A';

  return (
    <div className={styles['infoSection']}>
      <ParcelInfoItem label="Código de parcela" value={codigo} />
      <ParcelInfoItem label="Última actualización" value={fechaActualizacion} />
    </div>
  );
};

const ParcelInfoItem: React.FC<ParcelInfoItemProps> = ({ label, value }) => (
  <p>
    {label}: {value}
  </p>
);

const PageNumber: React.FC = () => (
  <div className={styles['pageNumber']}>{PARCEL_MAP_CONFIG.PAGE_NUMBER}</div>
);

export default ParcelMapPage;

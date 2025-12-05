import React, { useEffect, useState } from 'react';

import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { REPORT_TITLES } from '../../types/constants';
import { ReportAddressProps, ReportHeaderProps, ReportTitlesProps } from '../../types/enums';
import { getReportTitle } from '../../utils/report-utils';

import styles from '../../styles/ReportHeader.module.css';

const isValidDateValue = (value: string): boolean => {
  return value !== 'undefined' && value !== 'null' && value !== '';
};

const formatDateValue = (fechaValue: string): string => {
  try {
    const fecha: Date = fechaValue.match(/^\d{4}-\d{2}-\d{2}$/)
      ? new Date(fechaValue + 'T00:00:00')
      : new Date(fechaValue);

    if (!isNaN(fecha.getTime())) {
      return fecha.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  } catch (parseError) {
    console.warn('Error parseando fecha:', parseError, 'valor:', fechaValue);
  }
  return fechaValue;
};

const processFechaValue = (value: string | number): string | null => {
  const fechaValue = String(value).trim();
  if (!fechaValue || !isValidDateValue(fechaValue)) {
    return null;
  }
  return formatDateValue(fechaValue);
};

const handleFetchError = (error: unknown): void => {
  console.error('Error obteniendo versión código urbanístico:', error);
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { status?: number; data?: unknown } };
    if (axiosError.response?.status !== 404) {
      console.error('Status:', axiosError.response?.status, 'Data:', axiosError.response?.data);
    }
  }
};

const fetchCodigoEdicion = async (setCodigo: (value: string) => void): Promise<void> => {
  try {
    const { data } = await api.get<{ key: string; value: string | number }>(
      '/codigo-urbanistico-edicion'
    );

    if (data?.value !== undefined && data.value !== null) {
      const processed = processFechaValue(String(data.value));
      if (processed) {
        setCodigo(processed);
      }
    }
  } catch (error) {
    handleFetchError(error);
  }
};

const ReportHeader: React.FC<ReportHeaderProps> = ({ informe, isCompoundMode, addresses }) => {
  const { usuario } = useAuth();
  const title = getReportTitle(isCompoundMode, addresses, informe);
  const logoPersonalizado = usuario?.personalizacion?.logo;
  const [codigoUrbanisticoEdicion, setCodigoUrbanisticoEdicion] = useState<string>('');

  useEffect(() => {
    void fetchCodigoEdicion(setCodigoUrbanisticoEdicion);
  }, []);

  return (
    <div className={styles['container']}>
      <div className={styles['headerLayout']}>
        {/* Contenido - 50% */}
        <div className={styles['contentSection']}>
          <ReportTitles titles={REPORT_TITLES} />
          {codigoUrbanisticoEdicion && (
            <p
              className={styles['codigoEdicion']}
              style={{ fontSize: '14px', marginTop: '8px', color: '#F0F0F0', fontWeight: 500 }}
            >
              Edición CU: {codigoUrbanisticoEdicion}
            </p>
          )}
        </div>

        {/* Espacio - 20% */}
        <div className={styles['spacer']}></div>

        {/* Logo - 30% */}
        <div className={styles['logoSection']}>
          {logoPersonalizado && (
            <img
              src={logoPersonalizado}
              alt={`Logo de ${usuario?.nombre}`}
              className={styles['logo']}
            />
          )}
        </div>
      </div>

      <ReportAddress address={title} />
    </div>
  );
};

const ReportTitles: React.FC<ReportTitlesProps> = ({ titles }) => (
  <>
    {titles.map((title, index) => (
      <h1
        key={index}
        className={`${styles['title']} ${index === titles.length - 1 ? styles['titleSpacing'] : ''}`}
      >
        {title}
      </h1>
    ))}
  </>
);

const ReportAddress: React.FC<ReportAddressProps> = ({ address }) => (
  <div className={styles['footer']}>
    <div className={styles['footerBorder']}>
      <h2 className={styles['address']}>{address}</h2>
    </div>
  </div>
);

export default ReportHeader;

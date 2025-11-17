import React from 'react';

import { useAuth } from '../../contexts/AuthContext';
import { REPORT_TITLES } from '../../types/constants';
import { ReportAddressProps, ReportHeaderProps, ReportTitlesProps } from '../../types/enums';
import { getReportTitle } from '../../utils/report-utils';

import styles from '../../styles/ReportHeader.module.css';

const ReportHeader: React.FC<ReportHeaderProps> = ({ informe, isCompoundMode, addresses }) => {
  const { usuario } = useAuth();
  const title = getReportTitle(isCompoundMode, addresses, informe);
  const logoPersonalizado = usuario?.personalizacion?.logo;

  return (
    <div className={styles['container']}>
      <div className={styles['headerLayout']}>
        {/* Contenido - 50% */}
        <div className={styles['contentSection']}>
          <ReportTitles titles={REPORT_TITLES} />
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

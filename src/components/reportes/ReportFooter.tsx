import React, { useState } from 'react';

import {
  ActionButtonProps,
  ButtonVariant,
  ChangeLogTableBodyProps,
  ChangeLogTableProps,
  FooterActionsProps,
  ReportFooterProps,
} from '../../types/enums';
import { getButtonClass } from '../../utils/report-footer-utils';

import styles from '../../styles/ReportFooter.module.css';

const ReportFooter: React.FC<ReportFooterProps> = ({
  informe: _informe,
  onGenerateReport,
  savedId,
  changeLog = [],
}) => {
  return (
    <>
      <FooterActions
        {...(onGenerateReport !== undefined && { onGenerateReport })}
        {...(savedId !== undefined && { savedId: savedId ?? null })}
      />

      {changeLog.length > 0 && <ChangeLogTable changeLog={changeLog} />}
    </>
  );
};

const LegalNotice: React.FC = () => (
  <div className="mx-10 mb-4 mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-600 print-hidden">
    <div className="font-semibold mb-2 text-yellow-800 dark:text-yellow-300">AVISO:</div>
    <div className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
      <div>• Los datos presentados son informativos y están sujetos a verificación oficial.</div>
      <div>
        • Para construcciones específicas, consultar normativa vigente del Código Urbanístico.
      </div>
      <div>
        • Los cálculos de plusvalía son estimativos y pueden variar según el proyecto específico.
      </div>
    </div>
  </div>
);

const FooterActions: React.FC<FooterActionsProps> = ({ onGenerateReport }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!onGenerateReport || downloading) return;
    setDownloading(true);
    try {
      await Promise.resolve(onGenerateReport());
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <LegalNotice />

      {onGenerateReport && (
        <div
          className={`${styles['container']} print-hidden flex justify-end bg-white dark:bg-gray-800`}
        >
          <ActionButton
            onClick={() => {
              void handleDownload();
            }}
            variant={ButtonVariant.PRIMARY}
            icon={<DownloadIcon />}
            text="Descargar Informe PDF"
            disabled={downloading}
          />
        </div>
      )}
    </>
  );
};

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, variant, icon, text, disabled }) => {
  const buttonClass = getButtonClass(styles['button'] || '', variant, styles);

  return (
    <button onClick={onClick} className={buttonClass} disabled={disabled}>
      <span className={styles['icon']}>{icon}</span>
      {text}
    </button>
  );
};

const ChangeLogTable: React.FC<ChangeLogTableProps> = ({ changeLog }) => (
  <div className={`${styles['changeLogContainer']} ${styles['printHidden']}`}>
    <div className={styles['changeLogHeader']}>LOG DE CAMBIOS REALIZADOS</div>

    <div className={styles['changeLogTable']}>
      <table style={{ width: '100%' }}>
        <ChangeLogTableHeader />
        <ChangeLogTableBody changeLog={changeLog} />
      </table>
    </div>
  </div>
);

const ChangeLogTableHeader: React.FC = () => (
  <thead className={styles['tableHeader']}>
    <tr>
      <th className={styles['tableHeaderCell']}>Campo</th>
      <th className={styles['tableHeaderCell']}>Valor original</th>
      <th className={styles['tableHeaderCell']}>Valor modificado</th>
      <th className={styles['tableHeaderCell']}>Fecha y hora</th>
    </tr>
  </thead>
);

const ChangeLogTableBody: React.FC<ChangeLogTableBodyProps> = ({ changeLog }) => (
  <tbody>
    {changeLog.map((change, index) => (
      <tr key={index} className={index % 2 === 0 ? styles['tableRow'] : styles['tableRowAlt']}>
        <td className={styles['tableCell']}>{change.fieldName}</td>
        <td className={styles['tableCell']}>{String(change.originalValue)}</td>
        <td className={styles['tableCell']}>{String(change.newValue)}</td>
        <td className={styles['tableCell']}>{change.timestamp.toLocaleString()}</td>
      </tr>
    ))}
  </tbody>
);

const DownloadIcon: React.FC = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);

export default ReportFooter;

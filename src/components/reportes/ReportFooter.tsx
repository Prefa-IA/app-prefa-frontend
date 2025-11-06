import React, { useState } from 'react';
import { 
  ReportFooterProps, 
  ButtonVariant, 
  FooterActionsProps, 
  ActionButtonProps, 
  ChangeLogTableProps, 
  ChangeLogTableBodyProps 
} from '../../types/enums';
import styles from '../../styles/ReportFooter.module.css';

const ReportFooter: React.FC<ReportFooterProps> = ({ 
  informe, 
  onGenerateReport, 
  onAcceptReport,
  changeLog = []
}) => {
  return (
    <>
      <FooterActions
        onAcceptReport={onAcceptReport}
        onGenerateReport={onGenerateReport}
      />
      
      {changeLog.length > 0 && (
        <ChangeLogTable changeLog={changeLog} />
      )}
    </>
  );
};

const LegalNotice: React.FC = () => (
  <div className="mx-10 mb-4 mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 print-hidden">
    <div className="font-semibold mb-2 text-yellow-800">AVISO:</div>
    <div className="text-sm text-yellow-700 space-y-1">
      <div>• Los datos presentados son informativos y están sujetos a verificación oficial.</div>
      <div>• Para construcciones específicas, consultar normativa vigente del Código Urbanístico.</div>
      <div>• Los cálculos de plusvalía son estimativos y pueden variar según el proyecto específico.</div>
    </div>
  </div>
);

const FooterActions: React.FC<FooterActionsProps> = ({
  onAcceptReport,
  onGenerateReport
}) => {
  const [accepted, setAccepted] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleAccept = async () => {
    if (!onAcceptReport) return;
    if (accepting || accepted) return; // evitar múltiples clics
    setAccepting(true);
    try {
      const ok = await (onAcceptReport?.());
      if (ok) setAccepted(true);
    } finally {
      setAccepting(false);
    }
  };

  const handleDownload = async () => {
    if (!onGenerateReport || downloading || !accepted || downloaded) return;
    setDownloading(true);
    try {
      await onGenerateReport?.();
      setDownloaded(true);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <LegalNotice />
      
      <div className={`${styles.container} print-hidden`}>
        <div className={styles.buttonGroup}>
          <ActionButton
            onClick={handleAccept}
            variant={ButtonVariant.SUCCESS}
            icon={<CheckIcon />}
            text="Guardar Informe"
            disabled={accepted || accepting}
          />
        </div>

        <ActionButton
          onClick={handleDownload}
          variant={ButtonVariant.PRIMARY}
          icon={<DownloadIcon />}
          text="Descargar Informe PDF"
          disabled={!accepted || downloading || downloaded}
        />
      </div>
    </>
  );
};

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, variant, icon, text, disabled }) => {
  const getButtonClass = (variant: ButtonVariant) => {
    const baseClass = styles.button;
    switch (variant) {
      case ButtonVariant.SUCCESS:
        return `${baseClass} ${styles.buttonSuccess}`;
      case ButtonVariant.PRIMARY:
        return `${baseClass} ${styles.buttonPrimary}`;
      case ButtonVariant.SECONDARY:
        return `${baseClass} ${styles.buttonSecondary}`;
      case ButtonVariant.DANGER:
        return `${baseClass} ${styles.buttonDanger}`;
      default:
        return baseClass;
    }
  };

  return (
    <button
      onClick={onClick}
      className={getButtonClass(variant)}
      disabled={disabled}
      style={disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
    >
      <span className={styles.icon}>{icon}</span>
      {text}
    </button>
  );
};

const ChangeLogTable: React.FC<ChangeLogTableProps> = ({ changeLog }) => (
  <div className={`${styles.changeLogContainer} ${styles.printHidden}`}>
    <div className={styles.changeLogHeader}>
      LOG DE CAMBIOS REALIZADOS
    </div>
    
    <div className={styles.changeLogTable}>
      <table style={{ width: '100%' }}>
        <ChangeLogTableHeader />
        <ChangeLogTableBody changeLog={changeLog} />
      </table>
    </div>
  </div>
);

const ChangeLogTableHeader: React.FC = () => (
  <thead className={styles.tableHeader}>
    <tr>
      <th className={styles.tableHeaderCell}>Campo</th>
      <th className={styles.tableHeaderCell}>Valor original</th>
      <th className={styles.tableHeaderCell}>Valor modificado</th>
      <th className={styles.tableHeaderCell}>Fecha y hora</th>
    </tr>
  </thead>
);

const ChangeLogTableBody: React.FC<ChangeLogTableBodyProps> = ({ changeLog }) => (
  <tbody>
    {changeLog.map((change, index) => (
      <tr 
        key={index} 
        className={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
      >
        <td className={styles.tableCell}>{change.fieldName}</td>
        <td className={styles.tableCell}>{String(change.originalValue)}</td>
        <td className={styles.tableCell}>{String(change.newValue)}</td>
        <td className={styles.tableCell}>{change.timestamp.toLocaleString()}</td>
      </tr>
    ))}
  </tbody>
);

const CheckIcon: React.FC = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const EditIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const DownloadIcon: React.FC = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

export default ReportFooter; 
export const getButtonClass = (baseClass: string, variant: string, styles: any): string => {
  switch (variant) {
    case 'SUCCESS':
      return `${baseClass} ${styles.buttonSuccess}`;
    case 'PRIMARY':
      return `${baseClass} ${styles.buttonPrimary}`;
    case 'SECONDARY':
      return `${baseClass} ${styles.buttonSecondary}`;
    case 'DANGER':
      return `${baseClass} ${styles.buttonDanger}`;
    default:
      return baseClass;
  }
};


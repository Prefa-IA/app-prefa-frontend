import React from 'react';

import { NAVIGATION_WARNING } from '../../types/consulta-direccion';
import ConfirmModal from '../generales/ConfirmModal';

interface ConsultaModalsProps {
  confirmReset: boolean;
  navConfirm: { show: boolean; href: string | null };
  onResetConfirm: () => void;
  onResetCancel: () => void;
  onNavCancel: () => void;
  onNavConfirm: () => void;
}

const ConsultaModals: React.FC<ConsultaModalsProps> = ({
  confirmReset,
  navConfirm,
  onResetConfirm,
  onResetCancel,
  onNavCancel,
  onNavConfirm,
}) => (
  <>
    {confirmReset && (
      <ConfirmModal
        message="Esta acción eliminará las direcciones y el resultado actual. ¿Continuar?"
        onCancel={onResetCancel}
        onConfirm={onResetConfirm}
      />
    )}
    {navConfirm.show && (
      <ConfirmModal message={NAVIGATION_WARNING} onCancel={onNavCancel} onConfirm={onNavConfirm} />
    )}
  </>
);

export default ConsultaModals;

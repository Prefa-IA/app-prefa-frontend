import React from 'react';

import { BillingModalProps } from '../../types/components';
import ConfirmModal from '../generales/ConfirmModal';
import ModalBase from '../generales/ModalBase';
import BillingForm from '../perfil/BillingForm';
import ReportPreviewModal from '../perfil/ReportPreviewModal';
import SupportTicketModal from '../perfil/SupportTicketModal';

export const BillingModal: React.FC<BillingModalProps> = ({ existing, onClose }) => {
  const existingObj =
    existing && typeof existing === 'object' ? (existing as Record<string, unknown>) : null;
  return (
    <ModalBase
      title={
        existingObj && existingObj['cuit']
          ? 'Modificar datos de facturación'
          : 'Agregar datos de facturación'
      }
      onClose={onClose}
      hideConfirm
    >
      <BillingForm onSuccess={onClose} />
    </ModalBase>
  );
};

interface PerfilUsuarioModalsProps {
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
  personalizacion: {
    fondoEncabezadosPrincipales?: string;
    colorTextoTablasPrincipales?: string;
    fondoEncabezadosSecundarios?: string;
    colorTextoTablasSecundarias?: string;
    tipografia?: string;
  };
  nombreInmobiliaria: string;
  showSupport: boolean;
  setShowSupport: (show: boolean) => void;
  confirmLogo: boolean;
  confirmLogoMessage: React.ReactNode;
  setConfirmLogo: (show: boolean) => void;
  handleLogoDeleteConfirm: () => void;
  confirmUpload: boolean;
  cancelUpload: () => void;
  handleLogoUploadConfirm: () => Promise<void>;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

const PerfilUsuarioModals: React.FC<PerfilUsuarioModalsProps> = ({
  showPreview,
  setShowPreview,
  personalizacion,
  nombreInmobiliaria,
  showSupport,
  setShowSupport,
  confirmLogo,
  confirmLogoMessage,
  setConfirmLogo,
  handleLogoDeleteConfirm,
  confirmUpload,
  cancelUpload,
  handleLogoUploadConfirm,
  showModal,
  setShowModal,
}) => (
  <>
    {showPreview && (
      <ReportPreviewModal
        onClose={() => setShowPreview(false)}
        personalizacion={personalizacion}
        nombreInmobiliaria={nombreInmobiliaria}
      />
    )}
    {showSupport && <SupportTicketModal onClose={() => setShowSupport(false)} />}
    {confirmLogo && (
      <ConfirmModal
        message={confirmLogoMessage}
        onCancel={() => setConfirmLogo(false)}
        onConfirm={() => {
          void handleLogoDeleteConfirm();
        }}
      />
    )}
    {confirmUpload && (
      <ConfirmModal
        message={confirmLogoMessage}
        onCancel={cancelUpload}
        onConfirm={() => {
          void handleLogoUploadConfirm();
        }}
      />
    )}
    {showModal && (
      <BillingModal
        existing={null}
        onClose={() => {
          setShowModal(false);
        }}
      />
    )}
  </>
);

export default PerfilUsuarioModals;

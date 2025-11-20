import React from 'react';

import { getBillingInfo } from '../../services/billing';
import { BillingSectionProps } from '../../types/components';

import { BillingModal } from './PerfilUsuarioModals';

const useBillingInfo = () => {
  const [info, setInfo] = React.useState<unknown | null>(null);
  const cacheRef = React.useRef<unknown | null>(null);

  const updateBillingInfo = React.useCallback((data: unknown) => {
    setInfo(data);
    cacheRef.current = data;
    try {
      localStorage.setItem('billingInfo', JSON.stringify(data || {}));
    } catch {}
  }, []);

  React.useEffect(() => {
    try {
      if (!cacheRef.current) {
        const raw = localStorage.getItem('billingInfo');
        if (raw) {
          cacheRef.current = JSON.parse(raw);
        }
      }
    } catch {}

    if (cacheRef.current) setInfo(cacheRef.current);

    void getBillingInfo().then(updateBillingInfo);
  }, [updateBillingInfo]);

  React.useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent;
      updateBillingInfo(customEvent.detail);
    };
    window.addEventListener('billingInfoUpdated', handler);
    return () => window.removeEventListener('billingInfoUpdated', handler);
  }, [updateBillingInfo]);

  return { info, cacheRef, updateBillingInfo };
};

const BillingInfoDisplay: React.FC<{
  info: unknown | null;
  isLoading: boolean;
}> = ({ info, isLoading }) => {
  if (info && typeof info === 'object' && 'cuit' in info && info.cuit) {
    return (
      <div className="space-y-2 text-gray-700 dark:text-gray-300">
        <p>
          <strong>Razón Social:</strong>{' '}
          {(info as Record<string, unknown>)['razonSocial'] as string}
        </p>
        <p>
          <strong>CUIT:</strong> {(info as Record<string, unknown>)['cuit'] as string}
        </p>
        <p>
          <strong>Condición IVA:</strong>{' '}
          {(info as Record<string, unknown>)['condicionIVA'] as string}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full space-y-2 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto" />
      </div>
    );
  }

  return (
    <p className="text-gray-600 dark:text-gray-400">Aún no cargaste tus datos de facturación.</p>
  );
};

export const BillingSection: React.FC<BillingSectionProps> = () => {
  const [showModal, setShowModal] = React.useState(false);
  const { info, cacheRef, updateBillingInfo } = useBillingInfo();

  const handleCloseModal = React.useCallback(() => {
    setShowModal(false);
    void getBillingInfo().then(updateBillingInfo);
  }, [updateBillingInfo]);

  const hasBillingInfo = info && typeof info === 'object' && 'cuit' in info && info.cuit;

  return (
    <>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex flex-col items-center justify-center text-center flex-1">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Datos de facturación
        </h3>
        <div className="w-full min-h-[96px] flex items-center justify-center">
          <BillingInfoDisplay info={info} isLoading={cacheRef.current === null} />
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary mt-4">
          {hasBillingInfo ? 'Ver mis datos de facturación' : 'Agregar'}
        </button>
      </div>
      {showModal && <BillingModal existing={info} onClose={handleCloseModal} />}
    </>
  );
};

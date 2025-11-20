import React from 'react';

interface SubscriptionInfoProps {
  planName: string;
  status: string;
  renewsAt: string;
}

const SubscriptionInfo: React.FC<SubscriptionInfoProps> = ({ planName, status, renewsAt }) => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded shadow-sm space-y-2 text-gray-800 dark:text-gray-200">
    <p className="flex justify-between">
      <span className="font-semibold text-gray-600 dark:text-gray-300">Plan:</span>{' '}
      <span className="text-gray-900 dark:text-gray-100">{planName}</span>
    </p>
    <p className="flex justify-between">
      <span className="font-semibold text-gray-600 dark:text-gray-300">Estado:</span>{' '}
      <span className="capitalize text-gray-900 dark:text-gray-100">{status}</span>
    </p>
    <p className="flex justify-between">
      <span className="font-semibold text-gray-600 dark:text-gray-300">Renueva el:</span>{' '}
      <span className="text-gray-900 dark:text-gray-100">{renewsAt}</span>
    </p>
  </div>
);

export default SubscriptionInfo;

import React from 'react';

interface SubscriptionInfoProps {
  planName: string;
  status: string;
  renewsAt: string;
  planTag?:
    | {
        bgClass: string;
        name: string;
        icon?: string;
      }
    | null
    | undefined;
}

const statusColors = {
  active:
    'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
  paused:
    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
  expired:
    'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
  default:
    'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700',
};

const getStatusColor = (status: string) => {
  const statusLower = status.toLowerCase();
  if (statusLower === 'active') return statusColors.active;
  if (statusLower === 'paused') return statusColors.paused;
  if (statusLower === 'expired' || statusLower === 'canceled') return statusColors.expired;
  return statusColors.default;
};

const getPlanGradient = (bgClass?: string | null): string => {
  if (!bgClass) {
    return 'bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700';
  }

  if (bgClass.includes('bg-gradient')) {
    if (bgClass.includes('dark:')) {
      return bgClass;
    }
    const firstColorMatch = bgClass.match(/from-([a-z]+)-\d+/);
    const lastColorMatch = bgClass.match(/to-([a-z]+)-\d+/);
    const firstColor = firstColorMatch?.[1] || 'indigo';
    const lastColor = lastColorMatch?.[1] || firstColor;

    return `${bgClass} dark:from-${firstColor}-700 dark:to-${lastColor}-800`;
  }

  const solidColorMatch = bgClass.match(/bg-([a-z]+)-\d+/);
  const color = solidColorMatch?.[1] || 'indigo';

  return `bg-gradient-to-r from-${color}-600 to-${color}-700 dark:from-${color}-700 dark:to-${color}-800`;
};

const PlanHeader: React.FC<{
  planName: string;
  planTag?: { bgClass: string } | null | undefined;
}> = ({ planName, planTag }) => {
  const gradientClass = getPlanGradient(planTag?.bgClass);

  return (
    <div className={`${gradientClass} px-6 py-8 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/90 mb-1">Plan actual</p>
          <h3 className="text-3xl font-bold">{planName || 'Sin plan'}</h3>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

const StatusCard: React.FC<{ status: string }> = ({ status }) => {
  const isActive = status.toLowerCase() === 'active';
  const borderClass = isActive ? '' : 'border-2';

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg ${borderClass} bg-white dark:bg-gray-800/50`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${getStatusColor(status)}`}>
          {isActive ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Estado</p>
          <p className="font-semibold text-gray-900 dark:text-gray-100 capitalize">{status}</p>
        </div>
      </div>
    </div>
  );
};

const RenewalCard: React.FC<{ renewsAt: string }> = ({ renewsAt }) => (
  <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Renueva el</p>
        <p className="font-semibold text-gray-900 dark:text-gray-100">{renewsAt}</p>
      </div>
    </div>
  </div>
);

const SubscriptionInfo: React.FC<SubscriptionInfoProps> = ({
  planName,
  status,
  renewsAt,
  planTag,
}) => (
  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
    <PlanHeader planName={planName} planTag={planTag} />
    <div className="p-6 space-y-4">
      <StatusCard status={status} />
      <RenewalCard renewsAt={renewsAt} />
    </div>
  </div>
);

export default SubscriptionInfo;

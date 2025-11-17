import React, { useEffect, useState } from 'react';
import { CameraIcon, TrashIcon } from '@heroicons/react/outline';

import { useAuth } from '../../contexts/AuthContext';
import { Plan, usePlanes } from '../../hooks/use-planes';
import { ProfileCardProps } from '../../types/components';
import { SubscriptionPlan } from '../../types/enums';

const ProfileCard: React.FC<ProfileCardProps> = ({ logoUrl, onLogoUpload, onLogoDelete }) => {
  const { usuario } = useAuth();
  const { planes } = usePlanes();
  const [planActual, setPlanActual] = useState<Plan | null>(null);

  useEffect(() => {
    if (!usuario) return;
    const p =
      planes.find(
        (pl) =>
          pl.id?.toLowerCase() === usuario?.suscripcion?.tipo?.toLowerCase() ||
          pl.name?.toLowerCase() === usuario?.suscripcion?.nombrePlan?.toLowerCase()
      ) || null;
    setPlanActual(p);
  }, [usuario, planes]);
  if (!usuario) return null;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
      <div className="text-center space-y-6">
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 flex items-center justify-center overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`Logo de ${usuario.nombre}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <CameraIcon className="w-12 h-12 text-primary-400" />
            )}
          </div>
          {logoUrl && onLogoDelete && (
            <button
              type="button"
              onClick={onLogoDelete}
              title="Eliminar logo"
              className="absolute -bottom-2 -left-2 bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-all duration-200 shadow-lg"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          )}

          <label className="absolute -bottom-2 -right-2 bg-primary-600 dark:bg-primary-700 text-white p-3 rounded-full cursor-pointer hover:bg-primary-700 dark:hover:bg-primary-600 transition-all duration-200 shadow-lg">
            <CameraIcon className="w-5 h-5" />
            <input type="file" accept="image/*" onChange={onLogoUpload} className="hidden" />
          </label>
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {usuario.nombre}
          </h3>
          <p className="text-gray-500 dark:text-gray-300">{usuario.email}</p>
          {usuario.suscripcion?.tipo && (
            <PlanPill
              plan={usuario.suscripcion.tipo}
              planObj={planActual ? (planActual as unknown as SubscriptionPlan) : null}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const PlanPill: React.FC<{ plan: string; planObj: SubscriptionPlan | null }> = ({
  plan,
  planObj,
}) => {
  let colorClass = 'bg-blue-600';
  if (planObj?.tag?.bgClass) {
    colorClass = planObj.tag.bgClass;
  }
  return (
    <span
      className={`inline-flex items-center space-x-1 text-white px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}
    >
      <span className="w-2 h-2 rounded-full bg-white"></span>
      <span className="capitalize">{plan}</span>
    </span>
  );
};

export default ProfileCard;

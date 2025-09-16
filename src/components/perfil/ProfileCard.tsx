import React, { useEffect, useState } from 'react';
import { CameraIcon, TrashIcon } from '@heroicons/react/outline';
import { useAuth } from '../../contexts/AuthContext';
// import { subscriptions } from '../../services/api';
import { usePlanes } from '../../hooks/usePlanes';
import { SubscriptionPlan } from '../../types/enums';

interface Props {
  logoUrl: string | null;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogoDelete?: () => void;
}

const ProfileCard: React.FC<Props> = ({ logoUrl, onLogoUpload, onLogoDelete }) => {
  const { usuario } = useAuth();
  const { planes } = usePlanes();
  const [planActual,setPlanActual]=useState<SubscriptionPlan|null>(null);

  useEffect(()=>{
    if(!usuario) return;
    const p=planes.find((pl:any)=>pl._id===usuario?.suscripcion?.plan||pl.id?.toLowerCase()===usuario?.suscripcion?.tipo?.toLowerCase()||pl.name?.toLowerCase()===usuario?.suscripcion?.nombrePlan?.toLowerCase());
    setPlanActual((p as any)||null);
  },[usuario, planes]);
  if (!usuario) return null;
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="text-center space-y-6">
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
            {logoUrl ? (
              <img src={logoUrl} alt={`Logo de ${usuario.nombre}`} className="w-full h-full object-cover" />
            ) : (
              <CameraIcon className="w-12 h-12 text-blue-400" />
            )}
          </div>
          {/* Botón eliminar (izquierda) */}
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

          {/* Botón cargar (derecha) */}
          <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-3 rounded-full cursor-pointer hover:bg-blue-700 transition-all duration-200 shadow-lg">
            <CameraIcon className="w-5 h-5" />
            <input type="file" accept="image/*" onChange={onLogoUpload} className="hidden" />
          </label>
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-gray-900">{usuario.nombre}</h3>
          <p className="text-gray-500">{usuario.email}</p>
          {usuario.suscripcion?.tipo && (
            <PlanPill plan={usuario.suscripcion.tipo} planObj={planActual}/>
          )}
        </div>
      </div>
    </div>
  );
};

// const colorFor: Record<string, string> = {
//   bronze: 'bg-blue-600',
//   silver: 'bg-purple-600',
//   gold: 'bg-green-600'
// };

const PlanPill: React.FC<{ plan: string; planObj: SubscriptionPlan|null }> = ({ plan, planObj }) => {
  let colorClass='bg-blue-600';
  if(planObj?.tag?.bgClass){
     colorClass=planObj.tag.bgClass;
  } else if(planObj?.prioridad){
     const map:{[k:number]:string}={1:'bg-emerald-600',2:'bg-violet-600',3:'bg-rose-600',4:'bg-blue-600'};
     colorClass=map[planObj.prioridad]||'bg-blue-600';
  }
  return (
    <span className={`inline-flex items-center space-x-1 text-white px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      <span className="w-2 h-2 rounded-full bg-white"></span>
      <span className="capitalize">{plan}</span>
    </span>
  );
};

export default ProfileCard; 
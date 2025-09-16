import React, { useState } from 'react';
import PlanCard from './perfil/PlanCard';
import { usePlanes, Plan as PlanType } from '../hooks/usePlanes';
// import { useAuth } from '../contexts/AuthContext';
import PrefaInfoModal from './PrefaInfoModal';
// subscriptions ya no se usa aquí; se toma de usePlanes
// import { SubscriptionPlan } from '../types/enums';

const SubscriptionPage: React.FC = () => {
  // const { usuario } = useAuth();
  const { planes } = usePlanes();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  // Eliminado planActual del encabezado, ya no se muestra aquí

  const handleSelect = async (id: string) => {
    setSelected(id);
    setLoading(true);
    try {
      const { subscriptions } = await import('../services/api');
      const pref = await subscriptions.createPaymentPreference(id);
      window.open(pref.init_point, '_blank');
    } catch (e) {
      alert('Error procesando pago');
    } finally {
      setLoading(false);
      setSelected(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header elegante */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Elegí el plan que potencia tu negocio.
          </h1>
          <p className="text-xl text-gray-600 mb-4 font-medium">
            Encontrá la opción ideal para tu equipo o proyecto.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 justify-items-stretch">
          {planes
            .slice()
            .sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
            .map((p: PlanType) => (
            <PlanCard key={p.id} plan={p} loading={loading && selected===p.id} onSelect={()=>handleSelect(p.id!)} />
          ))}
        </div>
      </div>
      <footer className="max-w-6xl mx-auto px-4 mt-16 pt-8 border-t border-gray-200 text-center relative z-10">
        <button
          type="button"
          onClick={() => setShowInfo(true)}
          className="inline-block text-indigo-600 hover:text-indigo-700 text-base font-medium"
        >
          ¿Cuántos créditos consume cada prefactibilidad?
        </button>
      </footer>

      {showInfo && <PrefaInfoModal onClose={() => setShowInfo(false)} />}
    </div>
  );
};

export default SubscriptionPage;
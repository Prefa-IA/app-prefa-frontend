import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tab } from '@headlessui/react';

import { useAuth } from '../contexts/AuthContext';
import { Overage, useOverages } from '../hooks/use-overages';
import { Plan as PlanType, usePlanes } from '../hooks/use-planes';
import { subscriptions } from '../services/api';
import { getBillingInfo } from '../services/billing';
import { SubscriptionPlan } from '../types/enums';
import { sanitizePath, sanitizeUrl } from '../utils/url-sanitizer';

import Container from './layout/Container';
import PlanCard from './perfil/PlanCard';
import PrefaInfoModal from './PrefaInfoModal';

const handlePlanSelection = async (
  plan: PlanType,
  setSelected: (id: string | null) => void,
  setLoading: (loading: boolean) => void
): Promise<void> => {
  const isOverage = Boolean(plan.isOverage);

  if (!isOverage) {
    const billing = await getBillingInfo();
    if (!billing || !billing.cuit) {
      const safePath = sanitizePath('/perfil?billing=1');
      window.location.href = safePath;
      return;
    }
  }

  setSelected(plan.id);
  setLoading(true);

  try {
    const pref = isOverage
      ? await subscriptions.purchaseOverage(plan.id)
      : await subscriptions.createSubscription(plan.id);

    const redirectUrl = pref?.init_point || pref?.sandbox_init_point;
    if (redirectUrl) {
      const safeUrl = sanitizeUrl(redirectUrl);
      if (safeUrl) {
        window.location.href = safeUrl;
        return;
      }
    }

    alert('Error: La URL de pago no fue generada.');
  } catch (e) {
    console.error('Error al iniciar el pago con Mercado Pago:', e);
    alert('Error procesando pago. Por favor, revisa la consola para más detalles.');
  } finally {
    setLoading(false);
    setSelected(null);
  }
};

const PlansPanel: React.FC<{
  planes: PlanType[];
  loading: boolean;
  selected: string | null;
  onSelect: (plan: PlanType) => void;
}> = ({ planes, loading, selected, onSelect }) => {
  if (planes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Plan sin overages disponibles
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Tu plan actual no tiene paquetes de overages asignados. Contacta con soporte para más
            información.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 justify-items-stretch">
      {planes
        .slice()
        .sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
        .map((p) => (
          <PlanCard
            key={p.id}
            plan={p as unknown as SubscriptionPlan}
            loading={loading && selected === p.id}
            onSelect={() => {
              void onSelect(p);
            }}
          />
        ))}
    </div>
  );
};

const EmptyOveragesState: React.FC = () => (
  <div className="text-center py-12">
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
      <svg
        className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Plan sin overages disponibles
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Tu plan actual no tiene paquetes de overages asignados. Contacta con soporte para más
        información.
      </p>
    </div>
  </div>
);

const OverageCard: React.FC<{
  plan: PlanType;
  loading: boolean;
  selected: string | null;
  onSelect: (plan: PlanType) => void;
}> = ({ plan, loading, selected, onSelect }) => (
  <div className="relative bg-white dark:bg-gray-800 border-2 border-blue-300 dark:border-blue-600 rounded-2xl shadow-xl p-8 flex flex-col transition-all duration-300 hover:shadow-2xl hover:border-blue-400 dark:hover:border-blue-500">
    <span className="absolute -top-3 left-4 px-2 py-1 text-xs font-semibold rounded bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
      Paquete Extra
    </span>

    <div className="text-center mb-6 mt-4">
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{plan.name}</h3>
      <p className="text-5xl font-extrabold mb-2" style={{ color: '#0284C7' }}>
        ${(plan.price || 0).toLocaleString()} ARS
      </p>
    </div>

    <div className="flex-1 mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border border-blue-200 dark:border-blue-700">
        <div className="flex items-center justify-center gap-2">
          <svg
            className="w-6 h-6 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {((plan as unknown as Overage).creditosTotales || 0).toLocaleString()} Créditos
          </span>
        </div>
      </div>
      <p className="text-sm text-center text-gray-600 dark:text-gray-400">
        Créditos adicionales para tu plan actual
      </p>
    </div>

    {onSelect && (
      <button
        onClick={() => void onSelect(plan)}
        disabled={loading && selected === plan.id}
        className="w-full text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        style={{ backgroundColor: '#0369A1' }}
      >
        {loading && selected === plan.id ? 'Procesando...' : 'Comprar Paquete'}
      </button>
    )}
  </div>
);

const OveragesPanel: React.FC<{
  overages: PlanType[];
  loading: boolean;
  selected: string | null;
  onSelect: (plan: PlanType) => void;
}> = ({ overages, loading, selected, onSelect }) => {
  if (overages.length === 0) {
    return <EmptyOveragesState />;
  }

  return (
    <div className="flex justify-center items-start py-8">
      <div className="w-full max-w-md">
        {overages
          .slice()
          .sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
          .map((p) => (
            <OverageCard
              key={p.id}
              plan={p}
              loading={loading}
              selected={selected}
              onSelect={onSelect}
            />
          ))}
      </div>
    </div>
  );
};

const SubscriptionHeader: React.FC = () => (
  <div className="text-center mb-12">
    <h1 className="text-5xl font-black text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
      Elegí el plan que potencia tu negocio.
    </h1>
    <p className="text-xl text-gray-600 dark:text-gray-300 mb-4 font-medium">
      Encontrá la opción ideal para tu equipo o proyecto.
    </p>
  </div>
);

const SubscriptionTabsContent: React.FC<{
  tabIndex: number;
  setTabIndex: (index: number) => void;
  hasPlan: boolean;
  planes: PlanType[];
  overages: PlanType[];
  loading: boolean;
  selected: string | null;
  onSelect: (plan: PlanType) => void;
}> = ({ tabIndex, setTabIndex, hasPlan, planes, overages, loading, selected, onSelect }) => {
  return (
    <Tab.Group selectedIndex={tabIndex} onChange={setTabIndex}>
      <Tab.List className="flex space-x-4 justify-center mb-8">
        <Tab
          className={({ selected }) => (selected ? 'btn-primary' : 'btn-secondary dark:text-white')}
        >
          Planes
        </Tab>
        <Tab
          disabled={!hasPlan}
          className={({ selected, disabled }) => {
            const base = disabled ? 'btn-disabled' : selected ? 'btn-primary' : 'btn-secondary';
            return `${base} dark:text-white`;
          }}
        >
          Overages
        </Tab>
      </Tab.List>
      <Tab.Panel>
        <PlansPanel planes={planes} loading={loading} selected={selected} onSelect={onSelect} />
      </Tab.Panel>
      <Tab.Panel>
        <OveragesPanel
          overages={overages}
          loading={loading}
          selected={selected}
          onSelect={onSelect}
        />
      </Tab.Panel>
    </Tab.Group>
  );
};

const SubscriptionFooter: React.FC<{ onShowInfo: () => void }> = ({ onShowInfo }) => (
  <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 text-center relative z-10">
    <Container>
      <button
        type="button"
        onClick={onShowInfo}
        className="inline-block text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-base font-medium"
      >
        ¿Cuántos créditos consume cada prefactibilidad?
      </button>
    </Container>
  </footer>
);

const SubscriptionPage: React.FC = () => {
  const { planes } = usePlanes();
  const { overages } = useOverages();
  const { usuario } = useAuth();
  const hasPlan = !!usuario?.suscripcion?.plan;
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  const getInitialTabIndex = () => {
    if (tabParam === 'planes') return 0;
    if (tabParam === 'overages') return 1;
    return hasPlan ? 1 : 0;
  };

  const [tabIndex, setTabIndex] = useState<number>(getInitialTabIndex());
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (tabParam === 'planes') {
      setTabIndex(0);
    } else if (tabParam === 'overages') {
      setTabIndex(1);
    } else {
      setTabIndex(hasPlan ? 1 : 0);
    }
  }, [tabParam, hasPlan]);

  const handleSelect = (plan: PlanType) => {
    void handlePlanSelection(plan, setSelected, setLoading);
  };

  const overagesAsPlans: PlanType[] = overages.map((o: Overage) => ({
    id: o.id,
    name: o.name,
    price: o.price,
    isOverage: true,
    parentPlan: o.parentPlan,
    creditosTotales: o.creditosTotales,
    currency: o.currency,
    interval: 'month' as const,
    features: [],
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-10" data-tutorial="planes">
      <Container>
        <SubscriptionHeader />
        <SubscriptionTabsContent
          tabIndex={tabIndex}
          setTabIndex={setTabIndex}
          hasPlan={hasPlan}
          planes={planes}
          overages={overagesAsPlans}
          loading={loading}
          selected={selected}
          onSelect={handleSelect}
        />
      </Container>
      <SubscriptionFooter onShowInfo={() => setShowInfo(true)} />
      {showInfo && <PrefaInfoModal onClose={() => setShowInfo(false)} />}
    </div>
  );
};

export default SubscriptionPage;

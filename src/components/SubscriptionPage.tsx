import React, { useState } from 'react';
import { Tab } from '@headlessui/react';

import { useAuth } from '../contexts/AuthContext';
import { Plan as PlanType, separatePlanes, usePlanes } from '../hooks/use-planes';
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
}> = ({ planes, loading, selected, onSelect }) => (
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
  usuarioPlan: string | undefined;
  loading: boolean;
  selected: string | null;
  onSelect: (plan: PlanType) => void;
}> = ({ tabIndex, setTabIndex, hasPlan, planes, usuarioPlan, loading, selected, onSelect }) => {
  const { normales, overages } = separatePlanes(planes, usuarioPlan);
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
        <PlansPanel planes={normales} loading={loading} selected={selected} onSelect={onSelect} />
      </Tab.Panel>
      <Tab.Panel>
        <PlansPanel planes={overages} loading={loading} selected={selected} onSelect={onSelect} />
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
  const { usuario } = useAuth();
  const hasPlan = !!usuario?.suscripcion?.plan;
  const [tabIndex, setTabIndex] = useState<number>(hasPlan ? 1 : 0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleSelect = (plan: PlanType) => {
    void handlePlanSelection(plan, setSelected, setLoading);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-10" data-tutorial="planes">
      <Container>
        <SubscriptionHeader />
        <SubscriptionTabsContent
          tabIndex={tabIndex}
          setTabIndex={setTabIndex}
          hasPlan={hasPlan}
          planes={planes}
          usuarioPlan={usuario?.suscripcion?.plan}
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

import React, { useState } from 'react';
import PlanCard from './perfil/PlanCard';
import { usePlanes, Plan as PlanType, separatePlanes } from '../hooks/usePlanes';
import { getBillingInfo } from '../services/billing';
import { Tab } from '@headlessui/react';
import { useAuth } from '../contexts/AuthContext';
import PrefaInfoModal from './PrefaInfoModal';
import Container from './layout/Container';

const SubscriptionPage: React.FC = () => {
    const { planes } = usePlanes();
    const { usuario } = useAuth();
    const hasPlan = !!usuario?.suscripcion?.plan;
    const [tabIndex,setTabIndex]=useState<number>(hasPlan?1:0);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);
    const [showInfo, setShowInfo] = useState(false);

  const handleSelect = async (plan: PlanType) => {
    const isOverage = Boolean(plan.isOverage);

    if (!isOverage) {
      const billing = await getBillingInfo();
      if (!billing || !billing.cuit) {
        window.location.href = '/perfil?billing=1';
        return;
      }
    }

    setSelected(plan.id);
    setLoading(true);

    try {
      const { subscriptions } = await import('../services/api');
      const pref = isOverage
        ? await subscriptions.purchaseOverage(plan.id)
        : await subscriptions.createSubscription(plan.id);

      const redirectUrl = pref?.init_point || pref?.sandbox_init_point;
      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-10">
      <Container>
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
            Elegí el plan que potencia tu negocio.
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4 font-medium">
            Encontrá la opción ideal para tu equipo o proyecto.
          </p>
        </div>

        {/* Tabs */}
        <Tab.Group selectedIndex={tabIndex} onChange={setTabIndex}>
          <Tab.List className="flex space-x-4 justify-center mb-8">
            <Tab className={({ selected }) => selected ? 'btn-primary' : 'btn-secondary dark:text-white'}>Planes</Tab>
            <Tab
              disabled={!usuario?.suscripcion?.plan}
              className={({ selected, disabled }) => {
                const base = disabled ? 'btn-disabled' : selected ? 'btn-primary' : 'btn-secondary';
                return `${base} dark:text-white`;
              }}
            >
              Overages
            </Tab>
          </Tab.List>

          {/* Panels */}
          {(() => {
            const { normales, overages } = separatePlanes(planes, usuario?.suscripcion?.plan);
            return (
              <>
                <Tab.Panel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 justify-items-stretch">
                    {normales
                      .slice()
                      .sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
                      .map((p) => (
                        <PlanCard key={p.id} plan={p} loading={loading && selected === p.id} onSelect={() => handleSelect(p)} />
                    ))}
                  </div>
                </Tab.Panel>
                <Tab.Panel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 justify-items-stretch">
                    {overages.map((p) => (
                      <PlanCard key={p.id} plan={p} loading={loading && selected === p.id} onSelect={() => handleSelect(p)} />
                    ))}
                  </div>
                </Tab.Panel>
              </>
            );
          })()}
        </Tab.Group>
      </Container>
      <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 text-center relative z-10">
        <Container>
          <button
            type="button"
            onClick={() => setShowInfo(true)}
            className="inline-block text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-base font-medium"
          >
            ¿Cuántos créditos consume cada prefactibilidad?
          </button>
        </Container>
      </footer>

      {showInfo && <PrefaInfoModal onClose={() => setShowInfo(false)} />}
    </div>
  );
};

export default SubscriptionPage;
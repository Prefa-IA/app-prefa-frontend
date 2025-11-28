import { useEffect, useState } from 'react';

import { useAuth } from '../contexts/AuthContext';
import { useModalLoading } from '../contexts/ModalLoadingContext';
import { SubscriptionPlan, Usuario } from '../types/enums';

import { useCreditStatus } from './use-credit-status';
import { Plan, usePlanes } from './use-planes';
import { useTutorial } from './use-tutorial';

export const useNavbarState = () => {
  const { usuario, logout } = useAuth();
  const { status, refresh: refreshCredits } = useCreditStatus();
  const { planes, loading: planesLoading } = usePlanes();
  const { needsTermsAcceptance, isVisible: isTutorialVisible } = useTutorial();
  const { shouldBlockNavigation: shouldBlockNavigationFromModal } = useModalLoading();
  const [planActual, setPlanActual] = useState<Plan | null>(null);

  useEffect(() => {
    const fetchCredits = async () => {
      if (!usuario || planesLoading || planes.length === 0) {
        setPlanActual(null);
        return;
      }
      try {
        const planActual =
          planes.find((p) => {
            const matchesTipo =
              usuario?.suscripcion?.tipo &&
              p.id.toLowerCase() === usuario.suscripcion.tipo.toLowerCase();
            const matchesNombre =
              usuario?.suscripcion?.nombrePlan &&
              p.name.toLowerCase() === usuario.suscripcion.nombrePlan.toLowerCase();
            return matchesTipo || matchesNombre;
          }) || null;
        setPlanActual(planActual);
      } catch (error) {
        console.error('Error al obtener créditos:', error);
        setPlanActual(null);
      }
    };

    void fetchCredits();
  }, [usuario, planes, planesLoading]);

  useEffect(() => {
    if (usuario) {
      void refreshCredits();
    }
  }, [usuario, refreshCredits]);

  const shouldDisableNavigation =
    needsTermsAcceptance || isTutorialVisible || shouldBlockNavigationFromModal;
  const planObjValue = planActual ? (planActual as unknown as SubscriptionPlan) : null;
  const usuarioValue = usuario || ({} as Usuario);
  const creditBalance = (status?.balance ?? usuario?.creditBalance) || 0;

  return {
    usuario,
    logout,
    creditBalance,
    planObjValue,
    usuarioValue,
    shouldDisableNavigation,
  };
};

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { STEP_ROUTES, TERMS_STEP_INDEX } from '../constants/tutorial';

interface UseTutorialNavigationProps {
  currentStep: number;
  isVisible: boolean;
}

export const useTutorialNavigation = ({ currentStep, isVisible }: UseTutorialNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setHasNavigated(false);
      return;
    }

    if (currentStep === TERMS_STEP_INDEX) {
      return;
    }

    const targetRoute = Reflect.get(STEP_ROUTES, currentStep);
    if (targetRoute && location.pathname !== targetRoute && !hasNavigated) {
      setHasNavigated(true);
      navigate(targetRoute);
      setTimeout(() => setHasNavigated(false), 500);
    }
  }, [currentStep, isVisible, navigate, location.pathname, hasNavigated]);

  return { hasNavigated };
};

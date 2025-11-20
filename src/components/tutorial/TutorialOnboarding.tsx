import React, { useState } from 'react';

import { TERMS_STEP_INDEX } from '../../constants/tutorial';
import { useTutorial } from '../../hooks/use-tutorial';
import { useTutorialEffects } from '../../hooks/use-tutorial-effects';
import { useTutorialNavigation } from '../../hooks/use-tutorial-navigation';

import TutorialModalContent from './TutorialModalContent';
import TutorialOverlayContent from './TutorialOverlayContent';

export const TutorialOnboarding: React.FC = () => {
  const {
    currentStep,
    totalSteps,
    isVisible,
    nextStep,
    previousStep,
    skipTutorial,
    completeTutorial,
    acceptTerms,
  } = useTutorial();

  const [termsCheckboxAccepted, setTermsCheckboxAccepted] = useState(false);

  useTutorialNavigation({ currentStep, isVisible });
  useTutorialEffects({ currentStep, isVisible });

  if (!isVisible) {
    return null;
  }

  const isTermsStep = currentStep === TERMS_STEP_INDEX;

  const handleTermsAcceptChange = (accepted: boolean) => {
    setTermsCheckboxAccepted(accepted);
  };

  const handleTermsNext = async () => {
    if (termsCheckboxAccepted && acceptTerms) {
      try {
        await acceptTerms();
      } catch (error) {
        console.error('Error aceptando términos:', error);
      }
    }
  };

  return (
    <>
      <TutorialOverlayContent currentStep={currentStep} isVisible={isVisible} />

      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <TutorialModalContent
          isTermsStep={isTermsStep}
          currentStep={currentStep}
          totalSteps={totalSteps}
          termsCheckboxAccepted={termsCheckboxAccepted}
          handleTermsAcceptChange={handleTermsAcceptChange}
          handleTermsNext={handleTermsNext}
          skipTutorial={skipTutorial}
          previousStep={previousStep}
          nextStep={nextStep}
          completeTutorial={completeTutorial}
        />
      </div>
    </>
  );
};

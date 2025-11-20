import React from 'react';

import { STEP_SELECTORS, TERMS_STEP_INDEX, TUTORIAL_STEPS } from '../../constants/tutorial';

import { TutorialOverlay } from './TutorialOverlay';

interface TutorialOverlayContentProps {
  currentStep: number;
  isVisible: boolean;
}

const TutorialOverlayContent: React.FC<TutorialOverlayContentProps> = ({
  currentStep,
  isVisible,
}) => {
  const isTermsStep = currentStep === TERMS_STEP_INDEX;
  const currentStepConfig = isTermsStep ? null : Reflect.get(TUTORIAL_STEPS, currentStep);
  const stepSelector = isTermsStep ? undefined : Reflect.get(STEP_SELECTORS, currentStep);
  const highlightSelector = isTermsStep
    ? undefined
    : stepSelector || currentStepConfig?.highlightElement;

  return (
    <>
      {isVisible && !highlightSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-[9998] pointer-events-auto" />
      )}
      {highlightSelector && !isTermsStep && (
        <TutorialOverlay targetSelector={highlightSelector} isVisible={true} />
      )}
    </>
  );
};

export default TutorialOverlayContent;

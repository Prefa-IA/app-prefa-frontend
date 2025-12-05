import React from 'react';

import { TutorialButtons } from './TutorialButtons';
import TutorialContent from './TutorialContent';
import { TutorialProgress } from './TutorialProgress';

interface TutorialModalContentProps {
  isTermsStep: boolean;
  currentStep: number;
  totalSteps: number;
  termsCheckboxAccepted: boolean;
  handleTermsAcceptChange: (accepted: boolean) => void;
  handleTermsNext: () => Promise<void>;
  skipTutorial: () => Promise<void>;
  previousStep: () => void;
  nextStep: () => void;
  completeTutorial: () => Promise<void>;
}

const TutorialModalContent: React.FC<TutorialModalContentProps> = ({
  isTermsStep,
  currentStep,
  totalSteps,
  termsCheckboxAccepted,
  handleTermsAcceptChange,
  handleTermsNext,
  skipTutorial,
  previousStep,
  nextStep,
  completeTutorial,
}) => (
  <div className="relative bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl shadow-2xl w-full max-w-3xl p-8 space-y-6 max-h-[90vh] overflow-y-auto pointer-events-auto">
    {!isTermsStep && (
      <button
        onClick={() => {
          void skipTutorial();
        }}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        aria-label="Cerrar tutorial"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    )}

    {!isTermsStep && <TutorialProgress currentStep={currentStep} totalSteps={totalSteps} />}

    <TutorialContent
      currentStep={currentStep}
      termsCheckboxAccepted={termsCheckboxAccepted}
      onTermsAcceptChange={handleTermsAcceptChange}
    />

    {isTermsStep ? (
      <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => {
            void handleTermsNext();
          }}
          disabled={!termsCheckboxAccepted}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    ) : (
      <TutorialButtons
        currentStep={currentStep}
        totalSteps={totalSteps}
        onPrevious={previousStep}
        onNext={nextStep}
        onSkip={() => {
          void skipTutorial();
        }}
        onComplete={() => {
          void completeTutorial();
        }}
      />
    )}
  </div>
);

export default TutorialModalContent;

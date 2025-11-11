import React from 'react';

interface TutorialButtonsProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

export const TutorialButtons: React.FC<TutorialButtonsProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSkip,
  onComplete,
}) => {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
      <div className="flex gap-2">
        {!isFirstStep && (
          <button
            onClick={onPrevious}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Anterior
          </button>
        )}
        {!isLastStep && (
          <button
            onClick={onNext}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Siguiente
          </button>
        )}
        {isLastStep && (
          <button
            onClick={onComplete}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Entendido
          </button>
        )}
      </div>
      {!isLastStep && (
        <button
          onClick={onSkip}
          className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors underline"
        >
          Omitir tutorial
        </button>
      )}
    </div>
  );
};


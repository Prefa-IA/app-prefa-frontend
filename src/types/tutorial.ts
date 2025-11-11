export interface TutorialStep {
  id: number;
  title: string;
  content: React.ReactNode;
  image?: string;
  highlightElement?: string;
}

export interface TutorialConfig {
  steps: TutorialStep[];
  storageKey: string;
}

export interface TutorialState {
  currentStep: number;
  isVisible: boolean;
  isCompleted: boolean;
}

export interface UseTutorialReturn {
  currentStep: number;
  totalSteps: number;
  isVisible: boolean;
  isCompleted: boolean;
  nextStep: () => void;
  previousStep: () => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
  startTutorial: () => void;
}


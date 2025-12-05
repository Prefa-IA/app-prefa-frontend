import { RefObject, useEffect, useRef } from 'react';

import { useIntersectionObserver } from './use-intersection-observer';

interface UseScrollToPlusvaliaProps {
  onReached: () => void;
  enabled?: boolean;
  resetTrigger?: number;
}

export const useScrollToPlusvalia = ({
  onReached,
  enabled = true,
  resetTrigger,
}: UseScrollToPlusvaliaProps): RefObject<HTMLDivElement> => {
  const plusvaliaRef = useRef<HTMLDivElement>(null);
  const hasTriggeredRef = useRef(false);
  const enabledPreviousRef = useRef(enabled);
  const resetTriggerPreviousRef = useRef(resetTrigger);

  useEffect(() => {
    if (enabledPreviousRef.current !== enabled && enabled) {
      hasTriggeredRef.current = false;
    }
    enabledPreviousRef.current = enabled;

    if (resetTrigger !== undefined && resetTriggerPreviousRef.current !== resetTrigger) {
      hasTriggeredRef.current = false;
      resetTriggerPreviousRef.current = resetTrigger;
    }
  }, [enabled, resetTrigger]);

  const handleIntersect = () => {
    if (!hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      onReached();
    }
  };

  useIntersectionObserver({
    elementRef: plusvaliaRef,
    onIntersect: handleIntersect,
    enabled,
    threshold: 0.3,
    rootMargin: '0px',
  });

  return plusvaliaRef;
};

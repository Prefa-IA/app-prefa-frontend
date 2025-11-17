import { RefObject, useEffect, useRef } from 'react';

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
  const observerRef = useRef<IntersectionObserver | null>(null);
  const onReachedRef = useRef(onReached);
  const enabledRef = useRef(enabled);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const enabledPreviousRef = useRef(enabled);
  const resetTriggerPreviousRef = useRef(resetTrigger);

  useEffect(() => {
    onReachedRef.current = onReached;
    enabledRef.current = enabled;

    if (enabledPreviousRef.current !== enabled && enabled) {
      hasTriggeredRef.current = false;
    }
    enabledPreviousRef.current = enabled;

    if (resetTrigger !== undefined && resetTriggerPreviousRef.current !== resetTrigger) {
      hasTriggeredRef.current = false;
      resetTriggerPreviousRef.current = resetTrigger;
    }
  }, [onReached, enabled, resetTrigger]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (!enabled) {
      hasTriggeredRef.current = false;
      return;
    }

    hasTriggeredRef.current = false;

    const setupObserver = () => {
      const currentRef = plusvaliaRef.current;
      if (!currentRef) return false;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
              if (!hasTriggeredRef.current && enabledRef.current) {
                hasTriggeredRef.current = true;
                onReachedRef.current();
              }
            }
          });
        },
        {
          threshold: 0.3,
          rootMargin: '0px',
        }
      );

      observerRef.current = observer;
      observer.observe(currentRef);
      return true;
    };

    let retryCount = 0;
    const maxRetries = 20;

    const trySetup = () => {
      if (setupObserver()) {
        return;
      }

      if (retryCount < maxRetries) {
        retryCount++;
        timeoutRef.current = setTimeout(trySetup, 100);
      }
    };

    trySetup();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [enabled]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  return plusvaliaRef;
};

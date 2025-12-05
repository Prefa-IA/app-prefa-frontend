import { RefObject, useEffect, useRef } from 'react';

interface UseIntersectionObserverProps {
  elementRef: RefObject<HTMLElement>;
  onIntersect: () => void;
  enabled?: boolean;
  threshold?: number;
  rootMargin?: string;
}

export const useIntersectionObserver = ({
  elementRef,
  onIntersect,
  enabled = true,
  threshold = 0.3,
  rootMargin = '0px',
}: UseIntersectionObserverProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const hasTriggeredRef = useRef(false);
  const onIntersectRef = useRef(onIntersect);
  const enabledRef = useRef(enabled);

  useEffect(() => {
    onIntersectRef.current = onIntersect;
    enabledRef.current = enabled;
  }, [onIntersect, enabled]);

  useEffect(() => {
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
      const currentRef = elementRef.current;
      if (!currentRef) return false;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > threshold) {
              if (!hasTriggeredRef.current && enabledRef.current) {
                hasTriggeredRef.current = true;
                onIntersectRef.current();
              }
            }
          });
        },
        {
          threshold,
          rootMargin,
        }
      );

      observerRef.current = observer;
      observer.observe(currentRef);
      return true;
    };

    const retryCountRef = { current: 0 };
    const maxRetries = 20;

    const trySetup = () => {
      if (setupObserver()) {
        return;
      }

      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        setTimeout(trySetup, 100);
      }
    };

    trySetup();

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [enabled, elementRef, threshold, rootMargin]);
};

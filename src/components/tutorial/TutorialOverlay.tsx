import React, { useEffect, useReducer, useRef } from 'react';

interface TutorialOverlayProps {
  targetSelector?: string;
  isVisible: boolean;
  onClose?: () => void;
}

const getTargetRect = (
  targetElementRef: React.MutableRefObject<HTMLElement | null>,
  targetSelector?: string
): DOMRect | undefined => {
  const targetElement = targetElementRef.current;
  const rect = targetElement?.getBoundingClientRect();
  if (rect) {
    return rect;
  }
  if (targetSelector) {
    const element = document.querySelector(targetSelector) as HTMLElement;
    if (element) {
      targetElementRef.current = element;
      return element.getBoundingClientRect();
    }
  }
  return undefined;
};

const useTargetElement = (targetSelector?: string, isVisible?: boolean) => {
  const targetElementRef = useRef<HTMLElement | null>(null);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    if (!isVisible || !targetSelector) {
      targetElementRef.current = null;
      return;
    }

    targetElementRef.current = null;

    const findTarget = () => {
      const element = document.querySelector(targetSelector || '') as HTMLElement;
      if (element) {
        targetElementRef.current = element;
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        forceUpdate();
      }
    };

    findTarget();
    const timeouts = [50, 150, 300, 500, 800, 1200, 1800].map((delay) =>
      setTimeout(findTarget, delay)
    );

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [isVisible, targetSelector]);

  return targetElementRef;
};

interface OverlayBackgroundProps {
  targetRect?: DOMRect | undefined;
  onClose?: (() => void) | undefined;
}

const OverlayBackground: React.FC<OverlayBackgroundProps> = ({ targetRect, onClose }) => (
  <div
    role="button"
    tabIndex={0}
    className="fixed inset-0 z-[9998] pointer-events-auto"
    onClick={onClose}
    onKeyDown={(e) => {
      if ((e.key === 'Enter' || e.key === ' ') && onClose) {
        e.preventDefault();
        onClose();
      }
    }}
    style={{
      background: targetRect
        ? `radial-gradient(circle at ${targetRect.left + targetRect.width / 2}px ${targetRect.top + targetRect.height / 2}px, transparent 0px, transparent ${Math.max(targetRect.width, targetRect.height) / 2 + 10}px, rgba(0, 0, 0, 0.75) ${Math.max(targetRect.width, targetRect.height) / 2 + 20}px)`
        : 'rgba(0, 0, 0, 0.75)',
    }}
  />
);

interface HighlightBorderProps {
  targetRect: DOMRect;
}

const HighlightBorder: React.FC<HighlightBorderProps> = ({ targetRect }) => (
  <div
    className="fixed z-[9999] pointer-events-none"
    style={{
      left: `${targetRect.left - 4}px`,
      top: `${targetRect.top - 4}px`,
      width: `${targetRect.width + 8}px`,
      height: `${targetRect.height + 8}px`,
      border: '3px solid #F97316',
      borderRadius: '8px',
      boxShadow: '0 0 30px rgba(249, 115, 22, 0.8), 0 0 60px rgba(249, 115, 22, 0.4)',
      transition: 'all 0.3s ease-in-out',
      animation: 'none',
    }}
  />
);

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  targetSelector,
  isVisible,
  onClose,
}) => {
  const targetElementRef = useTargetElement(targetSelector, isVisible);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    if (!isVisible || !targetSelector) {
      return;
    }

    const isMountedRef = { current: true };

    const checkElement = () => {
      if (!isMountedRef.current) return;
      const element = document.querySelector(targetSelector || '') as HTMLElement;
      if (element) {
        forceUpdate();
      }
    };

    checkElement();
    const interval = setInterval(checkElement, 200);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [isVisible, targetSelector]);

  if (!isVisible) {
    return null;
  }

  const targetElement = targetElementRef.current;
  const targetRect = getTargetRect(targetElementRef, targetSelector);

  return (
    <>
      <OverlayBackground targetRect={targetRect} onClose={onClose} />
      {targetElement && targetRect && <HighlightBorder targetRect={targetRect} />}
    </>
  );
};

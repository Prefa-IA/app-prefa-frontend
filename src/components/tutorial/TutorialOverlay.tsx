import React, { useEffect, useRef } from 'react';

interface TutorialOverlayProps {
  targetSelector?: string;
  isVisible: boolean;
  onClose?: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  targetSelector,
  isVisible,
  onClose,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const targetElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isVisible || !targetSelector) {
      targetElementRef.current = null;
      return;
    }

    const findTarget = () => {
      const element = document.querySelector(targetSelector || '') as HTMLElement;
      if (element) {
        targetElementRef.current = element;
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    findTarget();
    const timeout = setTimeout(findTarget, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [isVisible, targetSelector]);

  if (!isVisible) {
    return null;
  }

  const targetElement = targetElementRef.current;
  const targetRect = targetElement?.getBoundingClientRect();

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9998] pointer-events-auto"
        onClick={onClose}
        style={{
          background: targetRect
            ? `radial-gradient(circle at ${targetRect.left + targetRect.width / 2}px ${targetRect.top + targetRect.height / 2}px, transparent 0px, transparent ${Math.max(targetRect.width, targetRect.height) / 2 + 10}px, rgba(0, 0, 0, 0.7) ${Math.max(targetRect.width, targetRect.height) / 2 + 20}px)`
            : 'rgba(0, 0, 0, 0.7)',
        }}
      />
      {targetElement && targetRect && (
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{
            left: `${targetRect.left - 4}px`,
            top: `${targetRect.top - 4}px`,
            width: `${targetRect.width + 8}px`,
            height: `${targetRect.height + 8}px`,
            border: '3px solid #3B82F6',
            borderRadius: '8px',
            boxShadow: '0 0 0 9999px rgba(59, 130, 246, 0.1), 0 0 20px rgba(59, 130, 246, 0.5)',
            transition: 'all 0.3s ease',
          }}
        />
      )}
    </>
  );
};


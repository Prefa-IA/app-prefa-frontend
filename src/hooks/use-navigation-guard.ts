import { useEffect, useState } from 'react';

import { NavConfirmState, NAVIGATION_WARNING } from '../types/consulta-direccion';

export const useNavigationGuard = (hasActiveQuery: boolean) => {
  const [navConfirm, setNavConfirm] = useState<NavConfirmState>({
    show: false,
    href: null,
  });

  useEffect(() => {
    if (!hasActiveQuery) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = NAVIGATION_WARNING;
      return NAVIGATION_WARNING;
    };

    const handleClickCapture = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href') || '';
      const isInternal = anchor.host === window.location.host && href.startsWith('/');
      if (!isInternal) return;

      const me = e as MouseEvent;
      if (me && (me.metaKey || me.ctrlKey || me.shiftKey || me.button !== 0)) return;
      if (href === window.location.pathname + window.location.search) return;

      e.preventDefault();
      e.stopPropagation();
      setNavConfirm({ show: true, href });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleClickCapture, true);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleClickCapture, true);
    };
  }, [hasActiveQuery]);

  return { navConfirm, setNavConfirm };
};

import React from 'react';

import ConsultaModals from './ConsultaModals';

interface ConsultaModalsContentProps {
  confirmReset: boolean;
  setConfirmReset: (show: boolean) => void;
  navConfirm: { show: boolean; href: string | null };
  setNavConfirm: (nav: { show: boolean; href: string | null }) => void;
  resetConsulta: () => void;
  navigate: (href: string) => void;
}

const ConsultaModalsContent: React.FC<ConsultaModalsContentProps> = ({
  confirmReset,
  setConfirmReset,
  navConfirm,
  setNavConfirm,
  resetConsulta,
  navigate,
}) => (
  <ConsultaModals
    confirmReset={confirmReset}
    navConfirm={navConfirm}
    onResetConfirm={() => {
      resetConsulta();
      setConfirmReset(false);
    }}
    onResetCancel={() => setConfirmReset(false)}
    onNavCancel={() => setNavConfirm({ show: false, href: null })}
    onNavConfirm={() => {
      const href = navConfirm.href;
      setNavConfirm({ show: false, href: null });
      if (href) navigate(href);
    }}
  />
);

export default ConsultaModalsContent;

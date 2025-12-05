import React from 'react';

import { useNavbarState } from '../../hooks/use-navbar-state';

import NavbarContent from './NavbarContent';

const Navbar: React.FC = () => {
  const { usuario, logout, creditBalance, planObjValue, shouldDisableNavigation } =
    useNavbarState();

  return (
    <NavbarContent
      usuario={usuario}
      logout={logout}
      creditBalance={creditBalance}
      planObjValue={planObjValue}
      shouldDisableNavigation={shouldDisableNavigation}
    />
  );
};

export default Navbar;

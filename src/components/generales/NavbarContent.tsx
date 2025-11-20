import React from 'react';
import { Disclosure } from '@headlessui/react';

import { NAVBAR_CONFIG, SubscriptionPlan, Usuario } from '../../types/enums';

import BrandLogo from './BrandLogo';
import CreditsPill from './CreditsPill';
import DesktopNavigation from './DesktopNavigation';
import MobileMenu from './MobileMenu';
import MobileMenuButton from './MobileMenuButton';
import ThemeButton from './ThemeButton';
import UserSection from './UserSection';

interface NavbarContentProps {
  usuario: Usuario | null;
  logout: () => void;
  creditBalance: number;
  planObjValue: SubscriptionPlan | null;
  usuarioValue: Usuario;
  shouldDisableNavigation: boolean;
}

const NavbarContent: React.FC<NavbarContentProps> = ({
  usuario,
  logout,
  creditBalance,
  planObjValue,
  usuarioValue,
  shouldDisableNavigation,
}) => {
  const navigationProps = shouldDisableNavigation ? { needsTermsAcceptance: true } : {};

  return (
    <Disclosure as="nav" className="bg-white dark:bg-gray-800 shadow print-hidden">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex flex-1">
                <BrandLogo {...navigationProps} />
                <DesktopNavigation {...navigationProps} />
              </div>
              <div className="flex ml-auto sm:ml-6 items-center space-x-4 sm:space-x-6 mr-2">
                {usuario && <CreditsPill saldo={creditBalance} />}
                <UserSection
                  usuario={usuario}
                  logout={logout}
                  planObj={planObjValue}
                  {...navigationProps}
                />
                <ThemeButton />
              </div>
              <MobileMenuButton open={open} />
            </div>
          </div>
          <MobileMenu
            navigation={[...NAVBAR_CONFIG.NAVIGATION]}
            usuario={usuarioValue}
            planObj={planObjValue}
            onLogout={logout}
            {...navigationProps}
          />
        </>
      )}
    </Disclosure>
  );
};

export default NavbarContent;

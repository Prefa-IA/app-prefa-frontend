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
  shouldDisableNavigation: boolean;
}

const NavbarContent: React.FC<NavbarContentProps> = ({
  usuario,
  logout,
  creditBalance,
  planObjValue,
  shouldDisableNavigation,
}) => {
  const navigationProps = shouldDisableNavigation ? { needsTermsAcceptance: true } : {};

  return (
    <Disclosure as="nav" className="bg-white dark:bg-gray-800 shadow print-hidden relative z-40">
      {({ open, close }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex flex-1 min-w-0">
                <BrandLogo {...navigationProps} />
                <DesktopNavigation {...navigationProps} />
              </div>
              <div className="hidden sm:flex ml-auto sm:ml-6 items-center space-x-4 sm:space-x-6 mr-2">
                {usuario && <CreditsPill saldo={creditBalance} />}
                <UserSection
                  usuario={usuario}
                  logout={logout}
                  planObj={planObjValue}
                  {...navigationProps}
                />
                <ThemeButton />
              </div>
              <div className="flex sm:hidden items-center justify-center flex-1">
                {usuario && <CreditsPill saldo={creditBalance} />}
              </div>
              <div className="flex sm:hidden items-center space-x-2 ml-2">
                <ThemeButton />
                <MobileMenuButton open={open} />
              </div>
            </div>
          </div>
          {open && (
            <MobileMenu
              navigation={[...NAVBAR_CONFIG.NAVIGATION]}
              usuario={usuario}
              planObj={planObjValue}
              onLogout={logout}
              open={open}
              onClose={close}
              {...navigationProps}
            />
          )}
        </>
      )}
    </Disclosure>
  );
};

export default NavbarContent;

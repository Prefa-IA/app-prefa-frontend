import React from 'react';
import { Link } from 'react-router-dom';
import { Disclosure } from '@headlessui/react';

import { MobileMenuProps, SubscriptionPlan } from '../../types/enums';

import MobileNavigation from './MobileNavigation';
import PlanPillSection from './PlanPillSection';

interface MobileMenuExtendedProps extends MobileMenuProps {
  planObj: SubscriptionPlan | null;
  needsTermsAcceptance?: boolean;
  onLogout: () => void;
}

const MobileMenu: React.FC<MobileMenuExtendedProps> = ({
  navigation,
  usuario,
  planObj,
  onLogout,
  needsTermsAcceptance = false,
}) => {
  const MENU_ITEM_TEXT = 'Mi Perfil';

  return (
    <Disclosure.Panel className="lg:hidden pt-4 flex flex-col h-full">
      {usuario && <PlanPillSection planObj={planObj} className="block sm:hidden" />}
      {usuario &&
        (needsTermsAcceptance ? (
          <span className="block sm:hidden pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50">
            {MENU_ITEM_TEXT}
          </span>
        ) : (
          <Link
            to="/perfil"
            className="block sm:hidden pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-600 dark:text-white hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
          >
            {MENU_ITEM_TEXT}
          </Link>
        ))}
      <MobileNavigation navigation={navigation} disabled={needsTermsAcceptance} />
      {usuario && (
        <button
          onClick={onLogout}
          disabled={needsTermsAcceptance}
          className={`mt-auto w-full text-left px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-sm font-medium block sm:hidden ${
            needsTermsAcceptance
              ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50'
              : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
          }`}
        >
          Cerrar Sesión
        </button>
      )}
    </Disclosure.Panel>
  );
};

export default MobileMenu;

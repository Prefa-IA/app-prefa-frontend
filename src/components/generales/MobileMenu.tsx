import React from 'react';
import { Link } from 'react-router-dom';

import { MobileMenuProps, SubscriptionPlan } from '../../types/enums';

import AuthButtons from './AuthButtons';
import MobileNavigation from './MobileNavigation';
import PlanPillSection from './PlanPillSection';

interface MobileMenuExtendedProps extends MobileMenuProps {
  planObj: SubscriptionPlan | null;
  needsTermsAcceptance?: boolean;
  onLogout: () => void;
  open?: boolean;
  onClose?: () => void;
}

const MobileMenu: React.FC<MobileMenuExtendedProps> = ({
  navigation,
  usuario,
  planObj,
  onLogout,
  needsTermsAcceptance = false,
  open = false,
  onClose,
}) => {
  const MENU_ITEM_TEXT = 'Mi Perfil';

  if (!open) return null;

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-gray-800 shadow-xl z-50 lg:hidden overflow-y-auto">
      <div className="pt-4 pb-6 flex flex-col h-full">
        {usuario && <PlanPillSection planObj={planObj} className="block sm:hidden px-4" />}
        {usuario &&
          (needsTermsAcceptance ? (
            <span className="block sm:hidden pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50">
              {MENU_ITEM_TEXT}
            </span>
          ) : (
            <Link
              to="/perfil"
              onClick={handleLinkClick}
              className="block sm:hidden pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-600 dark:text-white hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
            >
              {MENU_ITEM_TEXT}
            </Link>
          ))}
        <MobileNavigation
          navigation={navigation}
          disabled={needsTermsAcceptance}
          onLinkClick={handleLinkClick}
        />
        {!usuario && (
          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <AuthButtons className="flex flex-col space-y-3" />
          </div>
        )}
        {usuario && (
          <button
            onClick={() => {
              if (onClose) {
                onClose();
              }
              onLogout();
            }}
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
      </div>
    </div>
  );
};

export default MobileMenu;

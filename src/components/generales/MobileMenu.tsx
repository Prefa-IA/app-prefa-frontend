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
    <>
      <button
        type="button"
        className="fixed inset-y-0 left-0 w-1/2 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
        onClick={handleLinkClick}
        aria-label="Cerrar menú"
      />
      <div className="fixed inset-y-0 right-0 w-1/2 bg-white dark:bg-gray-800 shadow-2xl z-50 md:hidden overflow-y-auto transform transition-transform duration-300 ease-out">
        <div className="pt-6 pb-8 flex flex-col h-full">
          {usuario && (
            <div className="block sm:hidden px-6 mb-4">
              <PlanPillSection planObj={planObj} className="inline-block" />
            </div>
          )}
          {usuario &&
            (needsTermsAcceptance ? (
              <span className="block sm:hidden px-6 py-3 text-left text-base font-medium text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50 border-l-4 border-transparent">
                {MENU_ITEM_TEXT}
              </span>
            ) : (
              <Link
                to="/perfil"
                onClick={handleLinkClick}
                className="block sm:hidden px-6 py-3 text-left text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-l-4 border-transparent hover:border-primary-500 transition-all duration-200"
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
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 mt-auto space-y-3">
              <AuthButtons className="flex flex-col space-y-3" onLinkClick={handleLinkClick} />
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
              className={`mt-auto w-full text-left px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-sm font-medium block sm:hidden transition-colors duration-200 ${
                needsTermsAcceptance
                  ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50'
                  : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 active:bg-red-100 dark:active:bg-red-900/30'
              }`}
            >
              Cerrar Sesión
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileMenu;

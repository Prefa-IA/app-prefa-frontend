import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';

interface UserMenuItemsProps {
  onLogout: () => void;
  needsTermsAcceptance?: boolean;
}

const UserMenuItems: React.FC<UserMenuItemsProps> = ({
  onLogout,
  needsTermsAcceptance = false,
}) => (
  <Transition
    enter="transition ease-out duration-100"
    enterFrom="transform opacity-0 scale-95"
    enterTo="transform opacity-100 scale-100"
    leave="transition ease-in duration-75"
    leaveFrom="transform opacity-100 scale-100"
    leaveTo="transform opacity-0 scale-95"
  >
    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
      <Menu.Item disabled={needsTermsAcceptance}>
        {({ active }) => {
          const MENU_ITEM_TEXT = 'Mi Perfil';
          const ACTIVE_BG_CLASS = 'bg-gray-100';
          return needsTermsAcceptance ? (
            <span
              className={`${active ? ACTIVE_BG_CLASS : ''} block px-4 py-2 text-sm text-gray-400 cursor-not-allowed opacity-50`}
            >
              {MENU_ITEM_TEXT}
            </span>
          ) : (
            <Link
              to="/perfil"
              data-tutorial="mi-perfil"
              className={`${active ? ACTIVE_BG_CLASS : ''} block px-4 py-2 text-sm text-gray-700`}
            >
              {MENU_ITEM_TEXT}
            </Link>
          );
        }}
      </Menu.Item>
      <Menu.Item disabled={needsTermsAcceptance}>
        {({ active }) => {
          const ACTIVE_BG_CLASS = 'bg-gray-100';
          return (
            <button
              onClick={onLogout}
              disabled={needsTermsAcceptance}
              className={`${
                active && !needsTermsAcceptance ? ACTIVE_BG_CLASS : ''
              } block w-full text-left px-4 py-2 text-sm ${
                needsTermsAcceptance
                  ? 'text-gray-400 cursor-not-allowed opacity-50'
                  : 'text-gray-700'
              }`}
            >
              Cerrar Sesión
            </button>
          );
        }}
      </Menu.Item>
    </Menu.Items>
  </Transition>
);

export default UserMenuItems;

import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { LightningBoltIcon, MenuIcon, UserCircleIcon, XIcon } from '@heroicons/react/outline';
import { MoonIcon, SunIcon } from '@heroicons/react/solid';

import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useCreditStatus } from '../../hooks/use-credit-status';
import { Plan, usePlanes } from '../../hooks/use-planes';
import { useTutorial } from '../../hooks/use-tutorial';
import {
  MobileMenuButtonProps,
  MobileMenuProps,
  MobileNavigationLinkProps,
  MobileNavigationProps,
  NavigationLinkProps,
  PlanPillSectionProps,
  UserMenuButtonProps,
  UserMenuItemsProps,
  UserNameAndPlanProps,
} from '../../types/components';
import {
  AuthButtonsProps,
  NAVBAR_CONFIG,
  SubscriptionPlan,
  UserMenuProps,
  Usuario,
} from '../../types/enums';

import Logo from './Logo';

const Navbar: React.FC = () => {
  const { usuario, logout } = useAuth();
  const { status, refresh: refreshCredits } = useCreditStatus();
  const { theme, toggleTheme } = useTheme();
  const { planes } = usePlanes();
  const { needsTermsAcceptance, isVisible: isTutorialVisible } = useTutorial();

  const [planActual, setPlanActual] = useState<Plan | null>(null);

  useEffect(() => {
    const fetchCredits = async () => {
      if (!usuario) return;
      try {
        const planActual =
          planes.find((p) => {
            const matchesTipo =
              usuario?.suscripcion?.tipo &&
              p.id.toLowerCase() === usuario.suscripcion.tipo.toLowerCase();
            const matchesNombre =
              usuario?.suscripcion?.nombrePlan &&
              p.name.toLowerCase() === usuario.suscripcion.nombrePlan.toLowerCase();
            return matchesTipo || matchesNombre;
          }) || null;
        if (planActual) setPlanActual(planActual);
      } catch (error) {
        console.error('Error al obtener créditos:', error);
      }
    };

    void fetchCredits();
  }, [usuario, planes]);

  useEffect(() => {
    if (usuario) {
      void refreshCredits();
    }
  }, [usuario, refreshCredits]);

  const shouldDisableNavigation = needsTermsAcceptance || isTutorialVisible;
  const navigationProps = shouldDisableNavigation
    ? { needsTermsAcceptance: shouldDisableNavigation }
    : {};

  const planObjValue = planActual ? (planActual as unknown as SubscriptionPlan) : null;
  const usuarioValue = usuario || ({} as Usuario);
  const creditBalance = (status?.balance ?? usuario?.creditBalance) || 0;

  const renderUserSection = () => {
    if (usuario) {
      return (
        <div className="hidden sm:block">
          <UserMenu
            usuario={usuario}
            onLogout={logout}
            planObj={planObjValue}
            {...navigationProps}
          />
        </div>
      );
    }
    return <AuthButtons />;
  };

  const renderThemeButton = () => {
    const isDark = theme === 'dark';
    return (
      <button
        onClick={toggleTheme}
        className="p-2 rounded-md focus:outline-none"
        title={isDark ? 'Modo Claro' : 'Modo Oscuro'}
      >
        {isDark ? (
          <MoonIcon className="h-5 w-5 text-yellow-400 hover:text-yellow-300" />
        ) : (
          <SunIcon className="h-5 w-5 text-gray-800 hover:text-gray-900" />
        )}
      </button>
    );
  };

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
                {renderUserSection()}
                {renderThemeButton()}
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

const BrandLogo: React.FC<{ needsTermsAcceptance?: boolean }> = ({
  needsTermsAcceptance = false,
}) => (
  <div className="flex-shrink-0 flex items-center">
    {needsTermsAcceptance ? (
      <span className="flex items-center h-16 px-2 overflow-hidden cursor-not-allowed opacity-50">
        <Logo className="w-24 sm:w-36 h-auto dark:invert" />
      </span>
    ) : (
      <Link to="/" className="flex items-center h-16 px-2 overflow-hidden">
        <Logo className="w-24 sm:w-36 h-auto dark:invert" />
      </Link>
    )}
  </div>
);

const DesktopNavigation: React.FC<{ needsTermsAcceptance?: boolean }> = ({
  needsTermsAcceptance = false,
}) => (
  <div className="hidden lg:ml-6 lg:flex lg:space-x-8">
    {NAVBAR_CONFIG.NAVIGATION.map((item) => (
      <NavigationLink key={item.name} item={item} disabled={needsTermsAcceptance} />
    ))}
  </div>
);

const NavigationLink: React.FC<NavigationLinkProps & { disabled?: boolean }> = ({
  item,
  disabled = false,
}) => {
  const { pathname } = useLocation();
  const active = pathname === item.href || pathname.startsWith(item.href + '/');

  const base =
    'relative group inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-300';
  const color = active
    ? 'text-primary-600 dark:text-primary-400'
    : 'text-gray-900 dark:text-gray-100 hover:text-primary-600';
  const underline =
    'after:content-[""] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary-600 after:transform after:transition-transform after:duration-300 after:origin-left ' +
    (active ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100');

  const hoverColor = active ? '' : 'hover:text-primary-600';

  // Mapear rutas a atributos data-tutorial
  const tutorialMap: Record<string, string> = {
    '/consultar': 'analisis-prefactibilidad',
    '/buscar': 'buscar-direccion',
    '/informes': 'registros',
    '/suscripciones': 'planes',
  };

  const tutorialAttr = tutorialMap[item.href] ? { 'data-tutorial': tutorialMap[item.href] } : {};

  if (disabled) {
    return (
      <span
        className={`${base} ${color} ${hoverColor} ${underline} cursor-not-allowed opacity-50`}
        {...tutorialAttr}
      >
        {' '}
        {item.name}{' '}
      </span>
    );
  }

  return (
    <Link
      to={item.href}
      className={`${base} ${color} ${hoverColor} ${underline}`}
      {...tutorialAttr}
    >
      {' '}
      {item.name}{' '}
    </Link>
  );
};

const UserMenu: React.FC<
  UserMenuProps & { planObj: SubscriptionPlan | null; needsTermsAcceptance?: boolean }
> = ({ usuario, onLogout, planObj, needsTermsAcceptance = false }) => (
  <Menu as="div" className="ml-3 relative z-50">
    <UserMenuButton usuario={usuario} planObj={planObj} />
    <UserMenuItems onLogout={onLogout} needsTermsAcceptance={needsTermsAcceptance} />
  </Menu>
);

const UserMenuButton: React.FC<UserMenuButtonProps> = ({ usuario, planObj }) => (
  <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none">
    {usuario.personalizacion?.logo ? (
      <div className="flex items-center">
        <img
          src={usuario.personalizacion.logo}
          alt={`Logo de ${usuario.nombre}`}
          className="h-10 w-10 object-cover mr-2 rounded-lg border border-gray-200 dark:border-gray-700"
        />
        <UserNameAndPlan
          nombre={usuario.nombre}
          {...(usuario.suscripcion?.nombrePlan || usuario.suscripcion?.tipo
            ? { plan: usuario.suscripcion?.nombrePlan || usuario.suscripcion?.tipo }
            : {})}
          planObj={planObj}
        />
      </div>
    ) : (
      <div className="flex items-center">
        <UserCircleIcon className="h-8 w-8 text-gray-400" />
        <UserNameAndPlan
          nombre={usuario.nombre}
          {...(usuario.suscripcion?.nombrePlan || usuario.suscripcion?.tipo
            ? { plan: usuario.suscripcion?.nombrePlan || usuario.suscripcion?.tipo }
            : {})}
          planObj={planObj}
        />
      </div>
    )}
  </Menu.Button>
);

const UserNameAndPlan: React.FC<UserNameAndPlanProps> = ({ nombre, plan, planObj }) => {
  const planDisplay = plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : 'Sin plan';
  let pillClasses = 'px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ';
  if (planObj?.tag?.bgClass) {
    const g = planObj.tag.bgClass;
    const m = g.match(/(?:via|to|from)-([a-z]+)-(\d{3})/);
    const solid = m ? `bg-${m[1]}-${m[2]}` : 'bg-blue-600';
    pillClasses += solid + ' text-white';
  } else {
    pillClasses += 'bg-blue-100 text-blue-800';
  }
  return (
    <>
      <span className="ml-2 mr-2 whitespace-nowrap hidden xl:inline text-gray-900 dark:text-gray-100">
        {nombre}
      </span>
      <span className={pillClasses}>{planDisplay}</span>
    </>
  );
};

const UserMenuItems: React.FC<UserMenuItemsProps & { needsTermsAcceptance?: boolean }> = ({
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

const AuthButtons: React.FC<AuthButtonsProps> = ({ className = 'flex space-x-2 sm:space-x-3' }) => (
  <div className={className}>
    <Link
      to="/login"
      className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
    >
      Iniciar Sesión
    </Link>
    <Link
      to="/registro"
      className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 border border-primary-600 text-xs sm:text-sm font-medium rounded-lg text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
    >
      Registrarse
    </Link>
  </div>
);

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ open }) => (
  <div className="-mr-2 flex items-center lg:hidden">
    <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
      {open ? (
        <XIcon className="block h-6 w-6" aria-hidden="true" />
      ) : (
        <MenuIcon className="block h-6 w-6" aria-hidden="true" />
      )}
    </Disclosure.Button>
  </div>
);

const MobileMenu: React.FC<MobileMenuProps & { needsTermsAcceptance?: boolean }> = ({
  navigation,
  usuario,
  planObj,
  onLogout,
  needsTermsAcceptance = false,
}) => {
  const items = navigation;

  return (
    <Disclosure.Panel className="lg:hidden pt-4 flex flex-col h-full">
      {usuario && <PlanPillSection planObj={planObj} className="block sm:hidden" />}
      {usuario &&
        (() => {
          const MENU_ITEM_TEXT = 'Mi Perfil';
          return needsTermsAcceptance ? (
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
          );
        })()}
      <MobileNavigation navigation={items} disabled={needsTermsAcceptance} />
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

const PlanPillSection: React.FC<PlanPillSectionProps> = ({ planObj, className = '' }) => {
  if (!planObj) return null;
  const planDisplay = planObj.tag?.name || planObj.name;
  let pillClasses =
    'inline-block px-3 py-1 mb-4 ml-4 rounded-full text-xs font-semibold whitespace-nowrap ';
  if (planObj?.tag?.bgClass) {
    const g = planObj.tag.bgClass;
    const m = g.match(/(?:via|to|from)-([a-z]+)-?(\d{3})?/);
    const solid = m ? `bg-${m[1]}-600` : 'bg-blue-600';
    pillClasses += solid + ' text-white';
  } else {
    pillClasses += 'bg-blue-100 text-blue-800';
  }
  return <span className={`${pillClasses} ${className}`}>{planDisplay}</span>;
};

const MobileNavigation: React.FC<MobileNavigationProps & { disabled?: boolean }> = ({
  navigation,
  disabled = false,
}) => (
  <div className="pt-2 pb-3 space-y-1">
    {navigation.map((item) => (
      <MobileNavigationLink key={item.name} item={item} disabled={disabled} />
    ))}
  </div>
);

const MobileNavigationLink: React.FC<MobileNavigationLinkProps & { disabled?: boolean }> = ({
  item,
  disabled = false,
}) => {
  if (disabled) {
    return (
      <span className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50">
        {item.name}
      </span>
    );
  }

  return (
    <Link
      to={item.href}
      className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-600 dark:text-white hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
    >
      {item.name}
    </Link>
  );
};

const CreditsPill: React.FC<{ saldo: number }> = ({ saldo }) => {
  const base =
    'flex items-center gap-1 rounded-full text-[10px] sm:text-xs font-semibold shadow-sm whitespace-nowrap px-2 py-0.5 sm:px-3 sm:py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
  return (
    <span className={base} title="Créditos disponibles">
      <LightningBoltIcon className="inline-block h-3 w-3 sm:h-4 sm:w-4" />
      {saldo.toLocaleString()}/5,000
    </span>
  );
};

export default Navbar;

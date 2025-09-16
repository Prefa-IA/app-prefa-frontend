import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { MenuIcon, XIcon, UserCircleIcon, LightningBoltIcon } from '@heroicons/react/outline';
import { 
  NavigationItem, 
  UserMenuProps, 
  MobileMenuProps, 
  AuthButtonsProps,
  NAVBAR_CONFIG,
  SubscriptionPlan
} from '../../types/enums';
import Logo from './Logo';
// import { subscriptions } from '../../services/api';
import { usePlanes } from '../../hooks/usePlanes';

const Navbar: React.FC = () => {
  const { usuario, logout } = useAuth();
  const { planes } = usePlanes();

  // Estado para créditos restantes
  const [creditosRestantes, setCreditosRestantes] = useState<{ dia?: number; mes?: number; plan?: SubscriptionPlan | null; promo?: number }>({});
  const [planActual, setPlanActual] = useState<any | null>(null);

  useEffect(() => {
    const fetchCredits = async () => {
      if (!usuario) return;
      try {
        const planActual = (planes as any[]).find((p:any) => {
          const matchesId = usuario?.suscripcion?.plan && p._id === usuario.suscripcion.plan;
          const matchesTipo = usuario?.suscripcion?.tipo && p.id.toLowerCase() === usuario.suscripcion.tipo.toLowerCase();
          const matchesNombre = usuario?.suscripcion?.nombrePlan && p.name.toLowerCase() === usuario.suscripcion.nombrePlan.toLowerCase();
          return matchesId || matchesTipo || matchesNombre;
        }) || null;
        if (planActual) {
          const usadosDia = usuario.creditsUsedDay || 0;
          const usadosMes = usuario.creditsUsedMonth || 0;
          const restantesDia = planActual.creditosDia ? planActual.creditosDia - usadosDia : undefined;
          const restantesMes = planActual.creditosMes ? planActual.creditosMes - usadosMes : undefined;
          const promo = usuario.promoCreditsLeft || 0;
          setCreditosRestantes({ dia: restantesDia, mes: restantesMes, plan: planActual, promo });
          setPlanActual(planActual);
        }
      } catch (error) {
        console.error('Error al obtener créditos:', error);
      }
    };

    fetchCredits();
  }, [usuario, planes]);
  
  return (
    <Disclosure as="nav" className="bg-white shadow print-hidden">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex">
                <BrandLogo />
                <DesktopNavigation />
              </div>

              <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-6">
                {/* Créditos restantes */}
                {usuario && creditosRestantes && (
                  <CreditsBadge creditos={creditosRestantes} />
                )}
                {/* Menú de usuario o botones auth */}
                {usuario ? (
                  <UserMenu usuario={usuario} onLogout={logout} planObj={planActual} />
                ) : (
                  <AuthButtons />
                )}
              </div>

              <MobileMenuButton open={open} />
            </div>
          </div>

          <MobileMenu navigation={[...NAVBAR_CONFIG.NAVIGATION]} usuario={usuario} />
        </>
      )}
    </Disclosure>
  );
};

const BrandLogo: React.FC = () => (
  <div className="flex-shrink-0 flex items-center">
    <Link to="/" className="flex items-center">
      <Logo width={150} height={30} />
    </Link>
  </div>
);

const DesktopNavigation: React.FC = () => (
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
    {NAVBAR_CONFIG.NAVIGATION.map((item) => (
      <NavigationLink key={item.name} item={item} />
    ))}
  </div>
);

interface NavigationLinkProps {
  item: NavigationItem;
}

const NavigationLink: React.FC<NavigationLinkProps> = ({ item }) => (
                    <Link
                      to={item.href}
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-primary-600"
                    >
                      {item.name}
                    </Link>
);

const UserMenu: React.FC<UserMenuProps & { planObj: SubscriptionPlan|null }> = ({ usuario, onLogout, planObj }) => (
                  <Menu as="div" className="ml-3 relative z-50">
    <UserMenuButton usuario={usuario} planObj={planObj} />
    <UserMenuItems onLogout={onLogout} />
  </Menu>
);

interface UserMenuButtonProps { usuario: UserMenuProps['usuario']; planObj: SubscriptionPlan|null; }

const UserMenuButton: React.FC<UserMenuButtonProps> = ({ usuario, planObj }) => (
  <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none">
    {usuario.personalizacion?.logo ? (
      <div className="flex items-center">
        <img 
          src={usuario.personalizacion.logo} 
          alt={`Logo de ${usuario.nombre}`}
          className="h-10 w-10 object-cover mr-2 rounded-lg border border-gray-200"
        />
        <UserNameAndPlan nombre={usuario.nombre} plan={usuario.suscripcion?.nombrePlan || usuario.suscripcion?.tipo} planObj={planObj} />
      </div>
    ) : (
      <div className="flex items-center">
        <UserCircleIcon className="h-8 w-8 text-gray-400" />
        <UserNameAndPlan nombre={usuario.nombre} plan={usuario.suscripcion?.nombrePlan || usuario.suscripcion?.tipo} planObj={planObj} />
      </div>
    )}
  </Menu.Button>
);

interface UserNameAndPlanProps {   nombre: string;   plan?: string;   planObj: SubscriptionPlan|null; }

const accentMap: Record<number,string> = {1:'emerald',2:'violet',3:'rose',4:'blue'};

const UserNameAndPlan: React.FC<UserNameAndPlanProps> = ({ nombre, plan, planObj }) => {
  const planDisplay = plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : 'Sin plan';
  let pillClasses = 'px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ';
  if (planObj?.tag?.bgClass){
     const g=planObj.tag.bgClass;
     const m = g.match(/(?:via|to|from)-([a-z]+)-(\d{3})/);
     const solid = m ? `bg-${m[1]}-${m[2]}` : 'bg-blue-600';
     pillClasses += solid + ' text-white';
  } else {
     const accent = accentMap[planObj?.prioridad ?? 4] || 'blue';
     pillClasses += `bg-${accent}-100 text-${accent}-800`;
  }
  return (
    <>
      <span className="ml-2 mr-2 whitespace-nowrap">{nombre}</span>
      <span className={pillClasses}>{planDisplay}</span>
    </>
  );
}

interface UserMenuItemsProps {
  onLogout: () => void;
}

const UserMenuItems: React.FC<UserMenuItemsProps> = ({ onLogout }) => (
                    <Transition
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/perfil"
                              className={`${
                                active ? 'bg-gray-100' : ''
                              } block px-4 py-2 text-sm text-gray-700`}
                            >
                              Mi Perfil
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
            onClick={onLogout}
                              className={`${
                                active ? 'bg-gray-100' : ''
                              } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                            >
                              Cerrar Sesión
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
);

const AuthButtons: React.FC<AuthButtonsProps> = ({ className = "flex space-x-3" }) => (
  <div className={className}>
    <Link 
      to="/login" 
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
    >
                      Iniciar Sesión
                    </Link>
    <Link 
      to="/registro" 
      className="inline-flex items-center px-4 py-2 border border-primary-600 text-sm font-medium rounded-full text-primary-600 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
    >
                      Registrarse
                    </Link>
                  </div>
);

interface MobileMenuButtonProps {
  open: boolean;
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ open }) => (
              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
);

const MobileMenu: React.FC<MobileMenuProps> = ({ navigation, usuario }) => (
          <Disclosure.Panel className="sm:hidden">
    <MobileNavigation navigation={navigation} />
    {!usuario && <MobileAuthSection />}
  </Disclosure.Panel>
);

interface MobileNavigationProps {
  navigation: NavigationItem[];
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ navigation }) => (
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
      <MobileNavigationLink key={item.name} item={item} />
    ))}
  </div>
);

interface MobileNavigationLinkProps {
  item: NavigationItem;
}

const MobileNavigationLink: React.FC<MobileNavigationLinkProps> = ({ item }) => (
                <Link
                  to={item.href}
                  className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
                >
                  {item.name}
                </Link>
);

const MobileAuthSection: React.FC = () => (
              <div className="pt-4 pb-3 border-t border-gray-200">
    <div className="px-3 space-y-3">
                  <Link
                    to="/login"
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/registro"
        className="w-full flex items-center justify-center px-4 py-2 border border-primary-600 text-sm font-medium rounded-full text-primary-600 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Registrarse
                  </Link>
                </div>
              </div>
  );

interface CreditsBadgeProps {
  creditos: { dia?: number; mes?: number; plan?: SubscriptionPlan | null; promo?: number };
}

const CreditsBadge: React.FC<CreditsBadgeProps> = ({ creditos }) => {
  const { dia, mes, plan, promo } = creditos;
  if (dia === undefined && mes === undefined) return null;

  // styles
  const normalStyle = 'flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold shadow-sm bg-yellow-100 text-yellow-800';
  const promoStyle = 'flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold shadow-sm bg-violet-100 text-violet-800';
  const hasPromo = promo !== undefined && plan?.freeCredits && plan.freeCredits>0 && plan.tag?.slug==='free-credits';

  return (
    <div className="flex items-center space-x-3">
      {hasPromo && (
        <span className={promoStyle} title="Consultas de plan promocional restantes">
          <LightningBoltIcon className="h-4 w-4" />
          {promo}/{plan!.freeCredits} gratis
        </span>
      )}
      {dia !== undefined && plan?.creditosDia !== undefined && (
        <span className={normalStyle} title={`Créditos diarios disponibles`}>
          <LightningBoltIcon className="h-4 w-4" />
          {dia}/{plan.creditosDia} día
        </span>
      )}
      {mes !== undefined && plan?.creditosMes !== undefined && (
        <span className={normalStyle} title={`Créditos mensuales disponibles`}>
          <LightningBoltIcon className="h-4 w-4" />
          {mes}/{plan.creditosMes} mes
        </span>
      )}
    </div>
  );
};

export default Navbar;
import React from 'react';
import { Menu } from '@headlessui/react';
import { UserCircleIcon } from '@heroicons/react/outline';

import { SubscriptionPlan, Usuario } from '../../types/enums';

import UserNameAndPlan from './UserNameAndPlan';

interface UserMenuButtonProps {
  usuario: Usuario;
  planObj: SubscriptionPlan | null;
}

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

export default UserMenuButton;

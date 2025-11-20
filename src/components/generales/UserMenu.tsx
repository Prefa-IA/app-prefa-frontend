import React from 'react';
import { Menu } from '@headlessui/react';

import { SubscriptionPlan, UserMenuProps } from '../../types/enums';

import UserMenuButton from './UserMenuButton';
import UserMenuItems from './UserMenuItems';

interface UserMenuExtendedProps extends UserMenuProps {
  planObj: SubscriptionPlan | null;
  needsTermsAcceptance?: boolean;
}

const UserMenu: React.FC<UserMenuExtendedProps> = ({
  usuario,
  onLogout,
  planObj,
  needsTermsAcceptance = false,
}) => (
  <Menu as="div" className="ml-3 relative z-50">
    <UserMenuButton usuario={usuario} planObj={planObj} />
    <UserMenuItems onLogout={onLogout} needsTermsAcceptance={needsTermsAcceptance} />
  </Menu>
);

export default UserMenu;

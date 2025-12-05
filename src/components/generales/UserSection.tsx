import React from 'react';

import { SubscriptionPlan, Usuario } from '../../types/enums';

import AuthButtons from './AuthButtons';
import UserMenu from './UserMenu';

interface UserSectionProps {
  usuario: Usuario | null;
  logout: () => void;
  planObj: SubscriptionPlan | null;
  needsTermsAcceptance?: boolean;
}

const UserSection: React.FC<UserSectionProps> = ({
  usuario,
  logout,
  planObj,
  needsTermsAcceptance,
}) => {
  if (usuario) {
    return (
      <div className="hidden sm:block">
        <UserMenu
          usuario={usuario}
          onLogout={logout}
          planObj={planObj}
          needsTermsAcceptance={needsTermsAcceptance ?? false}
        />
      </div>
    );
  }
  return <AuthButtons />;
};

export default UserSection;

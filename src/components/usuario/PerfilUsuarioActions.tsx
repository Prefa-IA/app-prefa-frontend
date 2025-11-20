import React from 'react';
import { ChatAlt2Icon, CreditCardIcon, EyeIcon } from '@heroicons/react/outline';

import ActionCard from '../perfil/ActionCard';

interface PerfilUsuarioActionsProps {
  onPreviewClick: () => void;
  onSubscriptionClick: () => void;
  onSupportClick: () => void;
}

const PerfilUsuarioActions: React.FC<PerfilUsuarioActionsProps> = ({
  onPreviewClick,
  onSubscriptionClick,
  onSupportClick,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <ActionCard
      icon={<EyeIcon className="w-6 h-6" />}
      title="Previsualizar Informes"
      description="Ver previsualización"
      onClick={onPreviewClick}
    />
    <ActionCard
      icon={<CreditCardIcon className="w-6 h-6" />}
      title="Gestionar Suscripción"
      description="Administrar mi plan"
      onClick={onSubscriptionClick}
    />
    <ActionCard
      icon={<ChatAlt2Icon className="w-6 h-6" />}
      title="Soporte"
      description="Contactar a soporte"
      onClick={onSupportClick}
    />
  </div>
);

export default PerfilUsuarioActions;

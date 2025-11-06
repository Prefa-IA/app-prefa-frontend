import React from 'react';
import ModalBase from '../generales/ModalBase';

interface Props { onClose: () => void; }

const PrivacyPolicy: React.FC<Props> = ({ onClose }) => (
  <ModalBase title="Política de Privacidad" onClose={onClose} hideConfirm>
    <div className="prose max-w-none">
      <h1>Política de Privacidad</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Donec vel sapien elit.
        Integer aliquet vel justo at cursus. Suspendisse potenti. Curabitur id dui quis ligula aliquam tincidunt.
      </p>
      <p>
        Sed sed facilisis enim. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
        Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.
      </p>
    </div>
  </ModalBase>
);

export default PrivacyPolicy;

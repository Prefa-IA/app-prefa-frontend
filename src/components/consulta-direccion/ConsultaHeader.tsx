import React from 'react';

import { CONSULTA_DIRECCION_CONFIG } from '../../types/enums';

const ConsultaHeader: React.FC = () => (
  <h1 className="text-2xl font-bold text-[#0369A1] mb-4">{CONSULTA_DIRECCION_CONFIG.TITLE}</h1>
);

export default ConsultaHeader;

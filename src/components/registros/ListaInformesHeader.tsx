import React from 'react';

import { LISTA_INFORMES_CONFIG } from '../../types/enums';

const ListaInformesHeader: React.FC = () => (
  <>
    <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
      {LISTA_INFORMES_CONFIG.TITLE}
    </h1>
    <p className="text-gray-600 dark:text-gray-300 mb-6">{LISTA_INFORMES_CONFIG.SUBTITLE}</p>
  </>
);

export default ListaInformesHeader;

import React from 'react';

interface BasicInformationHeaderProps {
  esInformeCompuesto: boolean;
}

const BasicInformationHeader: React.FC<BasicInformationHeaderProps> = ({ esInformeCompuesto }) => (
  <>
    <div className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
      {esInformeCompuesto ? 'DATOS CONSOLIDADOS DE PARCELAS' : 'DATOS DE LA PARCELA'}
    </div>

    <div className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
      INFORMACIÓN BÁSICA
    </div>
  </>
);

export default BasicInformationHeader;

import React from 'react';

import { ConsultaContainerProps } from '../../types/components';

const ConsultaContainer: React.FC<ConsultaContainerProps & { 'data-tutorial'?: string }> = ({
  children,
  ...props
}) => (
  <div className="w-[95%] lg:w-[63%] max-w-8xl mt-8" {...props}>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
      {children}
    </div>
  </div>
);

export default ConsultaContainer;

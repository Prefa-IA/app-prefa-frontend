import React from 'react';

import { ReportContainerProps } from '../../types/components';

const ReportContainer: React.FC<ReportContainerProps> = ({ children }) => (
  <div className="w-[95%] lg:w-[80%] max-w-6xl mx-auto">{children}</div>
);

export default ReportContainer;

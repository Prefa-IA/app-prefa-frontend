import React from 'react';

import { BasicInformationProps } from '../../types/enums';
import BasicInformation from '../parcel-data/BasicInformation';

interface SearchResultProps {
  resultado: BasicInformationProps['informe'];
  calculatedValues: BasicInformationProps['calculatedValues'];
}

const SearchResult: React.FC<SearchResultProps> = ({ resultado, calculatedValues }) => (
  <div className="w-[100%] lg:w-[100%] mx-auto mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
    <BasicInformation
      informe={resultado}
      esInformeCompuesto={false}
      calculatedValues={calculatedValues}
      pageCounter={0}
      isBasicSearch={true}
    />
  </div>
);

export default SearchResult;

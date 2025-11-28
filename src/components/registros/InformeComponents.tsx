import React from 'react';
import {
  CalendarIcon,
  DocumentTextIcon,
  DownloadIcon,
  LocationMarkerIcon,
  OfficeBuildingIcon,
  TagIcon,
} from '@heroicons/react/outline';
import { CurrencyDollarIcon } from '@heroicons/react/solid';

import { TIPO_PREFA } from '../../types/consulta-direccion';
import { Informe, LISTA_INFORMES_CONFIG } from '../../types/enums';
import { formatearFecha } from '../../utils/date-utils';

export const InformesList: React.FC<{
  informes: Informe[];
  onDescargar: (informe: Informe) => void;
  downloadingIds: string[];
}> = ({ informes, onDescargar, downloadingIds }) => (
  <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8">
    <ul className="divide-y divide-gray-200">
      {informes.map((informe, index) => (
        <InformeItem
          key={index}
          informe={informe}
          index={index}
          onDescargar={onDescargar}
          downloading={downloadingIds.includes(informe._id as string)}
        />
      ))}
    </ul>
  </div>
);

export const InformeItem: React.FC<{
  informe: Informe;
  index: number;
  onDescargar: (informe: Informe) => void;
  downloading: boolean;
}> = ({ informe, index: _index, onDescargar, downloading }) => (
  <li className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
    <div className="px-4 py-5 sm:px-6">
      <InformeHeader informe={informe} onDescargar={onDescargar} downloading={downloading} />
      <InformeDetails informe={informe} />
      <DownloadButtonMobile informe={informe} onDescargar={onDescargar} downloading={downloading} />
    </div>
  </li>
);

export const InformeHeader: React.FC<{
  informe: Informe;
  onDescargar: (informe: Informe) => void;
  downloading: boolean;
}> = ({ informe, onDescargar, downloading }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
    <InformeTitleSection informe={informe} />
    <DownloadButton informe={informe} onDescargar={onDescargar} downloading={downloading} />
  </div>
);

export const InformeTitleSection: React.FC<{ informe: Informe }> = ({ informe }) => (
  <div className="flex items-center">
    <DocumentTextIcon className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-3" />
    <h3 className="text-lg font-medium text-primary-600 dark:text-primary-400">
      {informe.direccion.direccion}
    </h3>
  </div>
);

export const DownloadButton: React.FC<{
  informe: Informe;
  onDescargar: (informe: Informe) => void;
  downloading: boolean;
}> = ({ informe, onDescargar, downloading }) => {
  if (!informe.esUltimoInforme && informe.esUltimoInforme !== undefined) {
    return null;
  }

  const isDisabled = downloading || !informe.pdfUrl;

  return (
    <div className="hidden sm:flex mt-2 sm:mt-0 sm:ml-2 flex-shrink-0 w-full sm:w-auto">
      <button
        onClick={() => onDescargar(informe)}
        disabled={isDisabled}
        className={`inline-flex justify-center items-center w-full sm:w-auto px-2 py-1 sm:px-3 sm:py-2 border border-transparent text-xs sm:text-sm leading-4 font-medium rounded-md shadow-sm text-white ${
          isDisabled
            ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600'
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200`}
      >
        <DownloadIcon className="h-4 w-4 mr-1" />
        {LISTA_INFORMES_CONFIG.BUTTON_TEXT}
      </button>
    </div>
  );
};

export const InformeDetails: React.FC<{ informe: Informe }> = ({ informe }) => (
  <div className="mt-3 flex flex-col sm:flex-row sm:space-x-8">
    <LocationInfo informe={informe} />
    <SmpInfo informe={informe} />
    <TipoPrefaInfo informe={informe} />
    <DateInfo informe={informe} />
    <UvaInfo informe={informe} />
  </div>
);

export const UvaInfo: React.FC<{ informe: Informe }> = ({ informe }) => {
  const plus = informe.edificabilidad?.plusvalia;
  if (!plus) return null;
  const original = plus.uvaOriginal ?? plus.incidencia_uva;
  const personalizado = plus.uvaPersonalizado ?? original;

  return (
    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
      <CurrencyDollarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
      UVA: {original}
      {personalizado !== original ? ` → ${personalizado}` : ''}
    </div>
  );
};

export const LocationInfo: React.FC<{ informe: Informe }> = ({ informe }) => (
  <div className="flex items-center text-sm text-gray-500">
    <LocationMarkerIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
    {informe.direccion.barrio}, Comuna {informe.direccion.comuna}
  </div>
);

export const SmpInfo: React.FC<{ informe: Informe }> = ({ informe }) => {
  const smp = informe.datosCatastrales?.smp;
  if (!smp) return null;
  return (
    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
      <OfficeBuildingIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
      {smp}
    </div>
  );
};

export const TipoPrefaInfo: React.FC<{ informe: Informe }> = ({ informe }) => (
  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
    <TagIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
    {informe.tipoPrefa === TIPO_PREFA.SIMPLE ? 'Simple' : 'Completa'}
  </div>
);

export const DateInfo: React.FC<{ informe: Informe }> = ({ informe }) => (
  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
    <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
    Generado el {formatearFecha(informe.timestamp)}
  </div>
);

export const DownloadButtonMobile: React.FC<{
  informe: Informe;
  onDescargar: (inf: Informe) => void;
  downloading: boolean;
}> = ({ informe, onDescargar, downloading }) => {
  if (!informe.esUltimoInforme && informe.esUltimoInforme !== undefined) {
    return null;
  }

  const isDisabled = downloading || !informe.pdfUrl;

  return (
    <div className="sm:hidden mt-4">
      <button
        onClick={() => onDescargar(informe)}
        disabled={isDisabled}
        className={`w-full inline-flex justify-center items-center px-3 py-2 border border-transparent text-xs leading-4 font-medium rounded-md shadow-sm text-white ${
          isDisabled
            ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600'
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200`}
      >
        <DownloadIcon className="h-4 w-4 mr-1" />
        {LISTA_INFORMES_CONFIG.BUTTON_TEXT}
      </button>
    </div>
  );
};

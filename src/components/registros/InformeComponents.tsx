import React from 'react';
import {
  CalendarIcon,
  DocumentTextIcon,
  DownloadIcon,
  LocationMarkerIcon,
  OfficeBuildingIcon,
  ShareIcon,
  TagIcon,
} from '@heroicons/react/outline';
import { CurrencyDollarIcon } from '@heroicons/react/solid';

import { TIPO_PREFA } from '../../types/consulta-direccion';
import { Informe, LISTA_INFORMES_CONFIG } from '../../types/enums';
import { formatearFecha } from '../../utils/date-utils';

export const InformesList: React.FC<{
  informes: Informe[];
  onDescargar: (informe: Informe) => void;
  onCompartir: (informe: Informe) => void;
  downloadingIds: string[];
  sharingIds: string[];
}> = ({ informes, onDescargar, onCompartir, downloadingIds, sharingIds }) => (
  <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8">
    <ul className="divide-y divide-gray-200">
      {informes.map((informe, index) => (
        <InformeItem
          key={index}
          informe={informe}
          index={index}
          onDescargar={onDescargar}
          onCompartir={onCompartir}
          downloading={downloadingIds.includes(informe._id as string)}
          sharing={sharingIds.includes(informe._id as string)}
        />
      ))}
    </ul>
  </div>
);

export const InformeItem: React.FC<{
  informe: Informe;
  index: number;
  onDescargar: (informe: Informe) => void;
  onCompartir: (informe: Informe) => void;
  downloading: boolean;
  sharing: boolean;
}> = ({ informe, index: _index, onDescargar, onCompartir, downloading, sharing }) => (
  <li className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
    <div className="px-4 py-5 sm:px-6">
      <InformeHeader
        informe={informe}
        onDescargar={onDescargar}
        onCompartir={onCompartir}
        downloading={downloading}
        sharing={sharing}
      />
      <InformeDetails informe={informe} />
      <DownloadButtonMobile
        informe={informe}
        onDescargar={onDescargar}
        onCompartir={onCompartir}
        downloading={downloading}
        sharing={sharing}
      />
    </div>
  </li>
);

export const InformeHeader: React.FC<{
  informe: Informe;
  onDescargar: (informe: Informe) => void;
  onCompartir: (informe: Informe) => void;
  downloading: boolean;
  sharing: boolean;
}> = ({ informe, onDescargar, onCompartir, downloading, sharing }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
    <InformeTitleSection informe={informe} />
    <div className="hidden sm:flex mt-2 sm:mt-0 sm:ml-2 flex-shrink-0 gap-2">
      <ShareButton informe={informe} onCompartir={onCompartir} sharing={sharing} />
      <DownloadButton informe={informe} onDescargar={onDescargar} downloading={downloading} />
    </div>
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

export const ShareButton: React.FC<{
  informe: Informe;
  onCompartir: (informe: Informe) => void;
  sharing: boolean;
}> = ({ informe, onCompartir, sharing }) => {
  if (!informe.esUltimoInforme && informe.esUltimoInforme !== undefined) {
    return null;
  }

  const isDisabled = sharing;

  return (
    <button
      onClick={() => onCompartir(informe)}
      disabled={isDisabled}
      className={`inline-flex justify-center items-center px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 dark:border-gray-600 text-xs sm:text-sm leading-4 font-medium rounded-md shadow-sm ${
        isDisabled
          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200`}
    >
      <ShareIcon className="h-4 w-4 mr-1" />
      Compartir
    </button>
  );
};

export const DownloadButton: React.FC<{
  informe: Informe;
  onDescargar: (informe: Informe) => void;
  downloading: boolean;
}> = ({ informe, onDescargar, downloading }) => {
  if (!informe.esUltimoInforme && informe.esUltimoInforme !== undefined) {
    return null;
  }

  const isDisabled = downloading;

  return (
    <button
      onClick={() => onDescargar(informe)}
      disabled={isDisabled}
      className={`inline-flex justify-center items-center px-2 py-1 sm:px-3 sm:py-2 border border-transparent text-xs sm:text-sm leading-4 font-medium rounded-md shadow-sm text-white ${
        isDisabled
          ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
          : 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600'
      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200`}
    >
      <DownloadIcon className="h-4 w-4 mr-1" />
      {LISTA_INFORMES_CONFIG.BUTTON_TEXT}
    </button>
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
  onCompartir: (inf: Informe) => void;
  downloading: boolean;
  sharing: boolean;
}> = ({ informe, onDescargar, onCompartir, downloading, sharing }) => {
  if (!informe.esUltimoInforme && informe.esUltimoInforme !== undefined) {
    return null;
  }

  const isDisabled = downloading || sharing;

  return (
    <div className="sm:hidden mt-4 flex gap-2">
      <button
        onClick={() => onCompartir(informe)}
        disabled={isDisabled}
        className={`flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-xs leading-4 font-medium rounded-md shadow-sm ${
          isDisabled
            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200`}
      >
        <ShareIcon className="h-4 w-4 mr-1" />
        Compartir
      </button>
      <button
        onClick={() => onDescargar(informe)}
        disabled={isDisabled}
        className={`flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-xs leading-4 font-medium rounded-md shadow-sm text-white ${
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

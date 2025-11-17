import React, { useCallback, useEffect, useState } from 'react';
import {
  CalendarIcon,
  DocumentTextIcon,
  DownloadIcon,
  LocationMarkerIcon,
  OfficeBuildingIcon,
  TagIcon,
} from '@heroicons/react/outline';
import { CurrencyDollarIcon } from '@heroicons/react/solid';

import { prefactibilidad } from '../services/api';
import { TIPO_PREFA } from '../types/consulta-direccion';
import { Informe, LISTA_INFORMES_CONFIG, ListaInformesProps } from '../types/enums';
import { formatearFecha } from '../utils/date-utils';
import { downloadBlob } from '../utils/download-utils';

import Container from './layout/Container';
import MisDirecciones from './registros/MisDirecciones';

const TAB_STORAGE_KEY = 'listaInformes_activeTab';

const ListaInformes: React.FC<ListaInformesProps> = () => {
  const [informes, setInformes] = useState<Informe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [downloadingIds, setDownloadingIds] = useState<string[]>([]);
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);
  const [searchCooldown, setSearchCooldown] = useState(false);
  const [tab, setTab] = useState<'informes' | 'direcciones'>(() => {
    const saved = localStorage.getItem(TAB_STORAGE_KEY);
    return saved === 'informes' || saved === 'direcciones' ? saved : 'informes';
  });

  const handleTabChange = (newTab: 'informes' | 'direcciones') => {
    setTab(newTab);
    localStorage.setItem(TAB_STORAGE_KEY, newTab);
  };

  const cargarInformes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await prefactibilidad.obtenerInformes(page, search);
      setInformes(data.informes);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error al cargar informes:', error);
      setError('Error al cargar los informes. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    void cargarInformes();
  }, [cargarInformes]);

  const handleDescargar = async (informe: Informe) => {
    const id = informe._id as string;
    if (downloadingIds.includes(id)) return;
    setDownloadingIds((prev) => [...prev, id]);
    try {
      const blob = await prefactibilidad.descargarPDF(id);
      downloadBlob(blob, `informe-${informe.direccion.direccion}.pdf`);
      setTimeout(() => {
        setDownloadedIds((prev) => prev.filter((did) => did !== id));
      }, 2000);
      setDownloadedIds((prev) => [...prev, id]);
    } catch (error) {
      console.error('Error al descargar informe:', error);
      setError('Error al descargar el informe PDF.');
    } finally {
      setDownloadingIds((prev) => prev.filter((did) => did !== id));
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCooldown) return;
    setSearchCooldown(true);
    setPage(1);
    void cargarInformes();
    setTimeout(() => setSearchCooldown(false), 1500);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.toUpperCase());
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <Container>
      <div className="py-8" data-tutorial="registros">
        <ListaInformesHeader />

        <Tabs active={tab} onChange={handleTabChange} />

        {tab === 'informes' && (
          <form
            onSubmit={handleSearchSubmit}
            className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2"
          >
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Buscá por dirección, barrio o SMP"
              className="w-full sm:flex-1 border rounded px-3 py-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 text-white rounded"
              disabled={searchCooldown}
            >
              Buscar
            </button>
          </form>
        )}

        {tab === 'informes' ? (
          <ListaInformesContent
            loading={loading}
            error={error}
            informes={informes}
            onDescargar={(informe) => {
              void handleDescargar(informe);
            }}
            downloadingIds={downloadingIds}
            downloadedIds={downloadedIds}
          />
        ) : (
          <MisDirecciones />
        )}

        {totalPages > 1 && (
          <div className="mt-4 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="w-full sm:w-auto px-3 py-1 border rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-center">
              {' '}
              Página {page} de {totalPages}{' '}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="w-full sm:w-auto px-3 py-1 border rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </Container>
  );
};

const ListaInformesHeader: React.FC = () => (
  <>
    <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
      {LISTA_INFORMES_CONFIG.TITLE}
    </h1>
    <p className="text-gray-600 dark:text-gray-300 mb-6">{LISTA_INFORMES_CONFIG.SUBTITLE}</p>
  </>
);

const Tabs: React.FC<{
  active: 'informes' | 'direcciones';
  onChange: (t: 'informes' | 'direcciones') => void;
}> = ({ active, onChange }) => (
  <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
      <button
        onClick={() => onChange('informes')}
        className={`whitespace-nowrap py-2 px-1 border-b-2 text-sm font-medium ${
          active === 'informes'
            ? 'border-primary-600 text-primary-600 dark:text-primary-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-300 dark:hover:text-gray-100'
        }`}
      >
        Mis informes
      </button>
      <button
        onClick={() => onChange('direcciones')}
        className={`whitespace-nowrap py-2 px-1 border-b-2 text-sm font-medium ${
          active === 'direcciones'
            ? 'border-primary-600 text-primary-600 dark:text-primary-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-300 dark:hover:text-gray-100'
        }`}
      >
        Mis direcciones
      </button>
    </nav>
  </div>
);

const ListaInformesContent: React.FC<{
  loading: boolean;
  error: string | null;
  informes: Informe[];
  onDescargar: (informe: Informe) => void;
  downloadingIds: string[];
  downloadedIds: string[];
}> = ({ loading, error, informes, onDescargar, downloadingIds, downloadedIds }) => {
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (informes.length === 0) {
    return <EmptyState />;
  }

  return (
    <InformesList
      informes={informes}
      onDescargar={onDescargar}
      downloadingIds={downloadingIds}
      downloadedIds={downloadedIds}
    />
  );
};

const LoadingState: React.FC = () => (
  <div className="flex justify-center items-center h-64">
    <div className="text-gray-600">Cargando informes...</div>
  </div>
);

const ErrorState: React.FC<{ error: string }> = ({ error }) => (
  <div className="rounded-md bg-red-50 p-4">
    <div className="text-sm text-red-700">{error}</div>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
    <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
      {LISTA_INFORMES_CONFIG.EMPTY_STATE.TITLE}
    </h3>
    <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
      {LISTA_INFORMES_CONFIG.EMPTY_STATE.DESCRIPTION}
    </p>
  </div>
);

const InformesList: React.FC<{
  informes: Informe[];
  onDescargar: (informe: Informe) => void;
  downloadingIds: string[];
  downloadedIds: string[];
}> = ({ informes, onDescargar, downloadingIds, downloadedIds }) => (
  <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8">
    <ul className="divide-y divide-gray-200">
      {informes.map((informe, index) => (
        <InformeItem
          key={index}
          informe={informe}
          index={index}
          onDescargar={onDescargar}
          downloading={downloadingIds.includes(informe._id as string)}
          downloaded={downloadedIds.includes(informe._id as string)}
        />
      ))}
    </ul>
  </div>
);

const InformeItem: React.FC<{
  informe: Informe;
  index: number;
  onDescargar: (informe: Informe) => void;
  downloading: boolean;
  downloaded: boolean;
}> = ({ informe, index: _index, onDescargar, downloading, downloaded }) => (
  <li className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
    <div className="px-4 py-5 sm:px-6">
      <InformeHeader
        informe={informe}
        onDescargar={onDescargar}
        downloading={downloading}
        downloaded={downloaded}
      />
      <InformeDetails informe={informe} />
      {/* Botón móvil */}
      <DownloadButtonMobile
        informe={informe}
        onDescargar={onDescargar}
        downloading={downloading}
        downloaded={downloaded}
      />
    </div>
  </li>
);

const InformeHeader: React.FC<{
  informe: Informe;
  onDescargar: (informe: Informe) => void;
  downloading: boolean;
  downloaded: boolean;
}> = ({ informe, onDescargar, downloading, downloaded }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
    <InformeTitleSection informe={informe} />
    <DownloadButton
      informe={informe}
      onDescargar={onDescargar}
      downloading={downloading}
      downloaded={downloaded}
    />
  </div>
);

const InformeTitleSection: React.FC<{ informe: Informe }> = ({ informe }) => (
  <div className="flex items-center">
    <DocumentTextIcon className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-3" />
    <h3 className="text-lg font-medium text-primary-600 dark:text-primary-400">
      {informe.direccion.direccion}
    </h3>
  </div>
);

const DownloadButton: React.FC<{
  informe: Informe;
  onDescargar: (informe: Informe) => void;
  downloading: boolean;
  downloaded: boolean;
}> = ({ informe, onDescargar, downloading, downloaded }) => {
  if (!informe.esUltimoInforme && informe.esUltimoInforme !== undefined) {
    return null;
  }

  const isDisabled = downloading || downloaded || !informe.pdfUrl;

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

const InformeDetails: React.FC<{ informe: Informe }> = ({ informe }) => (
  <div className="mt-3 flex flex-col sm:flex-row sm:space-x-8">
    <LocationInfo informe={informe} />
    <SmpInfo informe={informe} />
    <TipoPrefaInfo informe={informe} />
    <DateInfo informe={informe} />
    <UvaInfo informe={informe} />
  </div>
);

const UvaInfo: React.FC<{ informe: Informe }> = ({ informe }) => {
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

const LocationInfo: React.FC<{ informe: Informe }> = ({ informe }) => (
  <div className="flex items-center text-sm text-gray-500">
    <LocationMarkerIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
    {informe.direccion.barrio}, Comuna {informe.direccion.comuna}
  </div>
);

const SmpInfo: React.FC<{ informe: Informe }> = ({ informe }) => {
  const smp = informe.datosCatastrales?.smp;
  if (!smp) return null;
  return (
    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
      <OfficeBuildingIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
      {smp}
    </div>
  );
};

const TipoPrefaInfo: React.FC<{ informe: Informe }> = ({ informe }) => (
  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
    <TagIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
    {informe.tipoPrefa === TIPO_PREFA.SIMPLE ? 'Simple' : 'Completa'}
  </div>
);

const DateInfo: React.FC<{ informe: Informe }> = ({ informe }) => (
  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
    <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
    Generado el {formatearFecha(informe.timestamp)}
  </div>
);

const DownloadButtonMobile: React.FC<{
  informe: Informe;
  onDescargar: (inf: Informe) => void;
  downloading: boolean;
  downloaded: boolean;
}> = ({ informe, onDescargar, downloading, downloaded }) => {
  if (!informe.esUltimoInforme && informe.esUltimoInforme !== undefined) {
    return null;
  }

  const isDisabled = downloading || downloaded || !informe.pdfUrl;

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

export default ListaInformes;

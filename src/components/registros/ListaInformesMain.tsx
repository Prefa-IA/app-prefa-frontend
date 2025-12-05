import React from 'react';

import { Informe } from '../../types/enums';
import Container from '../layout/Container';

import ListaInformesContent from './ListaInformesContent';
import ListaInformesHeader from './ListaInformesHeader';
import MisDirecciones from './MisDirecciones';
import PaginationControls from './PaginationControls';
import SearchSection from './SearchSection';
import Tabs from './Tabs';

interface ListaInformesMainProps {
  tab: 'informes' | 'direcciones';
  onTabChange: (t: 'informes' | 'direcciones') => void;
  informes: Informe[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  search: string;
  downloadingIds: string[];
  searchCooldown: boolean;
  itemsPerPage?: number;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onRefresh: () => void;
  onDescargar: (informe: Informe) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onItemsPerPageChange?: (limit: number) => void;
}

const ListaInformesMain: React.FC<ListaInformesMainProps> = ({
  tab,
  onTabChange,
  informes,
  loading,
  error,
  page,
  totalPages,
  search,
  downloadingIds,
  searchCooldown,
  itemsPerPage,
  onSearchChange,
  onSearchSubmit,
  onRefresh,
  onDescargar,
  onPrevPage,
  onNextPage,
  onItemsPerPageChange,
}) => (
  <Container>
    <div className="py-8" data-tutorial="registros">
      <ListaInformesHeader />
      <Tabs active={tab} onChange={onTabChange} />
      {tab === 'informes' && (
        <SearchSection
          search={search}
          searchCooldown={searchCooldown}
          loading={loading}
          onSearchChange={onSearchChange}
          onSearchSubmit={onSearchSubmit}
          onRefresh={onRefresh}
        />
      )}
      {tab === 'informes' ? (
        <>
          <ListaInformesContent
            loading={loading}
            error={error}
            informes={informes}
            onDescargar={onDescargar}
            downloadingIds={downloadingIds}
          />
          <PaginationControls
            page={page}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage ?? 10}
            onPrevPage={onPrevPage}
            onNextPage={onNextPage}
            onItemsPerPageChange={onItemsPerPageChange ?? (() => {})}
          />
        </>
      ) : (
        <MisDirecciones />
      )}
    </div>
  </Container>
);

export default ListaInformesMain;

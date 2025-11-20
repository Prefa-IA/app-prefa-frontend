import React, { useState } from 'react';

import { useInformesList } from '../hooks/use-informes-list';
import { ListaInformesProps } from '../types/enums';

import ListaInformesMain from './registros/ListaInformesMain';

const TAB_STORAGE_KEY = 'listaInformes_activeTab';

const ListaInformes: React.FC<ListaInformesProps> = () => {
  const [tab, setTab] = useState<'informes' | 'direcciones'>(() => {
    const saved = localStorage.getItem(TAB_STORAGE_KEY);
    return saved === 'informes' || saved === 'direcciones' ? saved : 'informes';
  });

  const handleTabChange = (newTab: 'informes' | 'direcciones') => {
    setTab(newTab);
    localStorage.setItem(TAB_STORAGE_KEY, newTab);
  };

  const {
    informes,
    loading,
    error,
    page,
    totalPages,
    search,
    downloadingIds,
    downloadedIds,
    searchCooldown,
    cargarInformes,
    handleDescargar,
    handleSearchSubmit,
    handleSearchChange,
    handlePrevPage,
    handleNextPage,
  } = useInformesList();

  return (
    <ListaInformesMain
      tab={tab}
      onTabChange={handleTabChange}
      informes={informes}
      loading={loading}
      error={error}
      page={page}
      totalPages={totalPages}
      search={search}
      downloadingIds={downloadingIds}
      downloadedIds={downloadedIds}
      searchCooldown={searchCooldown}
      onSearchChange={handleSearchChange}
      onSearchSubmit={handleSearchSubmit}
      onRefresh={() => {
        void cargarInformes();
      }}
      onDescargar={(informe) => {
        void handleDescargar(informe);
      }}
      onPrevPage={handlePrevPage}
      onNextPage={handleNextPage}
    />
  );
};

export default ListaInformes;

import React from 'react';

import { Informe } from '../../types/enums';

import { InformesList } from './InformeComponents';
import { EmptyState, ErrorState, LoadingState } from './ListaInformesStates';

interface ListaInformesContentProps {
  loading: boolean;
  error: string | null;
  informes: Informe[];
  onDescargar: (informe: Informe) => void;
  onCompartir: (informe: Informe) => void;
  downloadingIds: string[];
  sharingIds: string[];
}

const ListaInformesContent: React.FC<ListaInformesContentProps> = ({
  loading,
  error,
  informes,
  onDescargar,
  onCompartir,
  downloadingIds,
  sharingIds,
}) => {
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
      onCompartir={onCompartir}
      downloadingIds={downloadingIds}
      sharingIds={sharingIds}
    />
  );
};

export default ListaInformesContent;

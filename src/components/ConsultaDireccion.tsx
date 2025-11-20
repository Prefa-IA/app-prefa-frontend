import React from 'react';

import { useConsultaDireccionState } from '../hooks/use-consulta-direccion-state';
import { useNavigationGuard } from '../hooks/use-navigation-guard';
import { useProcessingCounter } from '../hooks/use-processing-counter';
import { ConsultaDireccionProps } from '../types/enums';

import ConsultaDireccionContent from './consulta-direccion/ConsultaDireccionContent';
import { mapConsultaDireccionProps } from './consulta-direccion/ConsultaDireccionPropsMapper';

const ConsultaDireccion: React.FC<ConsultaDireccionProps> = ({ className }) => {
  const state = useConsultaDireccionState(className);

  const processingCounter = useProcessingCounter(state.processing);
  const hasActiveQuery =
    !!state.resultado || state.resultados.length > 0 || state.processing || state.loading;
  const { navConfirm, setNavConfirm } = useNavigationGuard(hasActiveQuery);

  const props = mapConsultaDireccionProps(
    state,
    className,
    navConfirm,
    setNavConfirm,
    processingCounter
  );

  return <ConsultaDireccionContent {...props} />;
};

export default ConsultaDireccion;

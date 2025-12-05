import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
import { useModalLoading } from '../contexts/ModalLoadingContext';
import { TipoPrefa } from '../types/consulta-direccion';
import { Informe, InformeCompuesto } from '../types/enums';
import { Coordinates, getDefaultMapCenter } from '../utils/map-utils';

import { useCreditStatus } from './use-credit-status';

export const useConsultaDireccionStateSetup = () => {
  const { usuario, refreshProfile } = useAuth();
  const { refresh: refreshCredits } = useCreditStatus();
  const { setLoading: setGlobalLoading } = useModalLoading();
  const navigate = useNavigate();

  const [loading, setLoadingState] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<Informe | null>(null);
  const [direccion, setDireccion] = useState('');
  const [center, setCenter] = useState<Coordinates>(getDefaultMapCenter());
  const [savedId, setSavedId] = useState<string | null>(null);
  const [modoCompuesto, setModoCompuesto] = useState(false);
  const [direcciones, setDirecciones] = useState<string[]>([]);
  const [resultados, setResultados] = useState<Informe[]>([]);
  const [informeCompuesto, setInformeCompuesto] = useState<InformeCompuesto | null>(null);
  const [tipoPrefa, setTipoPrefa] = useState<TipoPrefa>('');
  const [showTipoInfo, setShowTipoInfo] = useState(false);
  const [processing, setProcessingState] = useState(false);
  const [isValidating, setIsValidatingState] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  // Sincronizar loading y processing con el contexto global
  useEffect(() => {
    setGlobalLoading(loading || processing);
  }, [loading, processing, setGlobalLoading]);

  const setLoading = (value: boolean) => {
    setLoadingState(value);
  };

  const setProcessing = (value: boolean) => {
    setProcessingState(value);
  };

  const setIsValidating = (value: boolean) => {
    setIsValidatingState(value);
  };

  return {
    usuario,
    refreshProfile,
    refreshCredits,
    navigate,
    loading: loading,
    setLoading,
    error,
    setError,
    resultado,
    setResultado,
    direccion,
    setDireccion,
    center,
    setCenter,
    savedId,
    setSavedId,
    modoCompuesto,
    setModoCompuesto,
    direcciones,
    setDirecciones,
    resultados,
    setResultados,
    informeCompuesto,
    setInformeCompuesto,
    tipoPrefa,
    setTipoPrefa,
    showTipoInfo,
    setShowTipoInfo,
    processing: processing,
    setProcessing,
    isValidating: isValidating,
    setIsValidating,
    confirmReset,
    setConfirmReset,
  };
};

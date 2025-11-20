import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
import { TIPO_PREFA, TipoPrefa } from '../types/consulta-direccion';
import { Informe, InformeCompuesto } from '../types/enums';
import { Coordinates, getDefaultMapCenter } from '../utils/map-utils';

import { useCreditStatus } from './use-credit-status';

export const useConsultaDireccionStateSetup = () => {
  const { usuario, refreshProfile } = useAuth();
  const { refresh: refreshCredits } = useCreditStatus();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<Informe | null>(null);
  const [direccion, setDireccion] = useState('');
  const [center, setCenter] = useState<Coordinates>(getDefaultMapCenter());
  const [savedId, setSavedId] = useState<string | null>(null);
  const [modoCompuesto, setModoCompuesto] = useState(false);
  const [direcciones, setDirecciones] = useState<string[]>([]);
  const [resultados, setResultados] = useState<Informe[]>([]);
  const [informeCompuesto, setInformeCompuesto] = useState<InformeCompuesto | null>(null);
  const [tipoPrefa, setTipoPrefa] = useState<TipoPrefa>(TIPO_PREFA.COMPLETA);
  const [showTipoInfo, setShowTipoInfo] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  return {
    usuario,
    refreshProfile,
    refreshCredits,
    navigate,
    loading,
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
    processing,
    setProcessing,
    confirmReset,
    setConfirmReset,
  };
};

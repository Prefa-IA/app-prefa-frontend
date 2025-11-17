import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { InformationCircleIcon } from '@heroicons/react/solid';

import { useAuth } from '../contexts/AuthContext';
import { useAddressManagement } from '../hooks/use-address-management';
import { useAutoSaveReport } from '../hooks/use-auto-save-report';
import { useConsultaConsolidation } from '../hooks/use-consulta-consolidation';
import { useConsultaState } from '../hooks/use-consulta-state';
import { useCreditStatus } from '../hooks/use-credit-status';
import { useDireccionSugerencias } from '../hooks/use-direccion-sugerencias';
import { useMultipleAddressConsultation } from '../hooks/use-multiple-address-consultation';
import { useNavigationGuard } from '../hooks/use-navigation-guard';
import { useProcessingCalculation } from '../hooks/use-processing-calculation';
import { useProcessingCounter } from '../hooks/use-processing-counter';
import { useReportGeneration } from '../hooks/use-report-generation';
import { useSingleAddressConsultation } from '../hooks/use-single-address-consultation';
import {
  ConsultaContainerProps,
  ConsultaHeaderProps,
  ProcessingOverlayProps,
  ReportContainerProps,
} from '../types/components';
import { NAVIGATION_WARNING, TIPO_PREFA, TipoPrefa } from '../types/consulta-direccion';
import {
  CONSULTA_DIRECCION_CONFIG,
  ConsultaDireccionProps,
  Informe,
  InformeCompuesto,
} from '../types/enums';
import { Coordinates, getDefaultMapCenter } from '../utils/map-utils';

import ConfirmModal from './generales/ConfirmModal';
import {
  AddressManagement,
  CompoundModeToggle,
  MapContainer,
  ReportSection,
  SearchSection,
} from './consulta-direccion';
import PrefaInfoModal from './PrefaInfoModal';

const ConsultaDireccion: React.FC<ConsultaDireccionProps> = ({ className }) => {
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
  const processingCounter = useProcessingCounter(processing);

  const [confirmReset, setConfirmReset] = useState(false);

  const hasActiveQuery = !!resultado || resultados.length > 0 || processing || loading;
  const { navConfirm, setNavConfirm } = useNavigationGuard(hasActiveQuery);

  const { procesarCalculoPrefactibilidad } = useProcessingCalculation({
    setResultado,
    setProcessing,
  });

  const { agregarDireccion, eliminarDireccion } = useAddressManagement({
    direcciones,
    resultados,
    setDirecciones,
    setResultados,
  });

  const { sugerencias, buscandoSugerencias, obtenerSugerencias, seleccionarSugerencia } =
    useDireccionSugerencias(setDireccion, setCenter, modoCompuesto, agregarDireccion, 4, setError);

  const { consultarDireccionesMultiples } = useMultipleAddressConsultation({
    direcciones,
    tipoPrefa,
    setLoading,
    setError,
    setResultados,
    refreshProfile: async () => {
      await refreshProfile();
    },
    refreshCredits: () => {
      void refreshCredits();
    },
  });

  const { consolidarInformes } = useConsultaConsolidation({
    modoCompuesto,
    resultados,
    direcciones,
    setInformeCompuesto,
    setResultado,
    setError,
  });

  const { handleSearch } = useSingleAddressConsultation({
    usuario,
    direccion,
    tipoPrefa,
    modoCompuesto,
    setLoading,
    setError,
    setResultado,
    setCenter,
    setProcessing,
    agregarDireccion,
    procesarCalculoPrefactibilidad,
    refreshProfile: async () => {
      await refreshProfile();
    },
    refreshCredits: () => {
      void refreshCredits();
    },
  });

  const { handleGenerateReport } = useReportGeneration({
    savedId,
    resultado,
    setError,
  });

  useAutoSaveReport({
    resultado,
    tipoPrefa,
    setError,
    setSavedId,
  });

  const { toggleModoCompuesto, resetConsulta, handleTipoPrefaChange, handleClearClick } =
    useConsultaState({
      resultado,
      resultados,
      informeCompuesto,
      setModoCompuesto,
      setDirecciones,
      setResultados,
      setInformeCompuesto,
      setResultado,
      setSavedId,
      setTipoPrefa,
      setConfirmReset,
    });

  useEffect(() => {
    if (modoCompuesto && resultados.length > 0) {
      void consolidarInformes();
    }
  }, [resultados, modoCompuesto, consolidarInformes]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }
  }, [error]);

  const isDisabled = loading || processing || !!resultado || resultados.length > 0;

  return (
    <div className={`flex flex-col items-center justify-center w-full ${className || ''}`}>
      <ConsultaContainer data-tutorial="analisis-prefactibilidad">
        <ConsultaHeader />

        <CompoundModeToggle
          modoCompuesto={modoCompuesto}
          onToggle={() => {
            void toggleModoCompuesto();
          }}
          disabled={isDisabled}
        />

        <SearchSection
          direccion={direccion}
          onDireccionChange={setDireccion}
          onSearch={() => {
            void handleSearch();
          }}
          modoCompuesto={modoCompuesto}
          loading={loading || buscandoSugerencias}
          sugerencias={sugerencias}
          onInputChange={(value) => {
            void obtenerSugerencias(value);
          }}
          onSeleccionarSugerencia={(sugerencia) => {
            void seleccionarSugerencia(sugerencia);
          }}
          hasResult={!!resultado || resultados.length > 0}
          onClear={handleClearClick}
          disabled={isDisabled}
        />

        <div className="flex flex-col md:flex-row md:items-center md:space-x-2 mt-4 space-y-2 md:space-y-0">
          <label htmlFor="tipoPrefa" className="text-gray-900 dark:text-gray-100">
            Tipo de Prefactibilidad:
          </label>
          <select
            id="tipoPrefa"
            value={tipoPrefa}
            onChange={handleTipoPrefaChange}
            className="border rounded px-2 py-1 pr-10 text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            disabled={isDisabled}
          >
            <option value={TIPO_PREFA.SIMPLE}>Prefactibilidad Simple</option>
            <option value={TIPO_PREFA.COMPLETA}>Prefactibilidad Completa</option>
          </select>

          <button
            type="button"
            onClick={() => setShowTipoInfo(true)}
            title="Ver diferencias entre los tipos de prefactibilidad"
            className="text-blue-600 hover:text-blue-800"
          >
            <InformationCircleIcon className="h-5 w-5" />
          </button>
        </div>

        {showTipoInfo && <PrefaInfoModal onClose={() => setShowTipoInfo(false)} />}

        <MapContainer center={center} showMarker={!!resultado || resultados.length > 0} />

        <AddressManagement
          modoCompuesto={modoCompuesto}
          direcciones={direcciones}
          onEliminarDireccion={eliminarDireccion}
          onConsultarDirecciones={() => {
            void consultarDireccionesMultiples();
          }}
          loading={loading}
        />
      </ConsultaContainer>

      <ReportContainer>
        <ReportSection
          resultado={resultado}
          informeCompuesto={informeCompuesto}
          modoCompuesto={modoCompuesto}
          direcciones={direcciones}
          loading={loading}
          center={center}
          onGenerateReport={() => {
            void handleGenerateReport();
          }}
          savedId={savedId}
          tipoPrefa={tipoPrefa}
        />
      </ReportContainer>

      {processing && <ProcessingOverlay seconds={processingCounter} />}

      {confirmReset && (
        <ConfirmModal
          message="Esta acción eliminará las direcciones y el resultado actual. ¿Continuar?"
          onCancel={() => setConfirmReset(false)}
          onConfirm={() => {
            resetConsulta();
            setConfirmReset(false);
          }}
        />
      )}

      {navConfirm.show && (
        <ConfirmModal
          message={NAVIGATION_WARNING}
          onCancel={() => setNavConfirm({ show: false, href: null })}
          onConfirm={() => {
            const href = navConfirm.href;
            setNavConfirm({ show: false, href: null });
            if (href) navigate(href);
          }}
        />
      )}
    </div>
  );
};

const ConsultaContainer: React.FC<ConsultaContainerProps & { 'data-tutorial'?: string }> = ({
  children,
  ...props
}) => (
  <div className="w-[95%] lg:w-[63%] max-w-8xl mt-8" {...props}>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
      {children}
    </div>
  </div>
);

const ConsultaHeader: React.FC<ConsultaHeaderProps> = () => (
  <h1 className="text-2xl font-bold text-[#0369A1] mb-4">{CONSULTA_DIRECCION_CONFIG.TITLE}</h1>
);

const ReportContainer: React.FC<ReportContainerProps> = ({ children }) => (
  <div className="w-[95%] lg:w-[80%] max-w-6xl">{children}</div>
);

const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ seconds }) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 sm:p-0">
    <div className="w-full sm:w-auto px-6 sm:px-10 py-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/30 shadow-lg text-center text-white space-y-4">
      <div className="animate-pulse text-xl font-semibold">Armando tu prefactibilidad…</div>
      <div className="text-4xl font-extrabold tracking-wider">{seconds}s</div>
    </div>
  </div>
);

export default ConsultaDireccion;

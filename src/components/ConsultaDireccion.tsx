import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCreditStatus } from '../hooks/useCreditStatus';
import { prefactibilidad } from '../services/api';
import { 
  Informe, 
  InformeCompuesto, 
  ConsultaDireccionProps, 
  DireccionSugerida, 
  CONSULTA_DIRECCION_CONFIG 
} from '../types/enums';
import { crearInformeCompuesto } from '../services/consolidacionInformes';
import { getDefaultMapCenter, updateMapCenter, Coordinates } from '../utils/mapUtils';
import { toast, ToastContentProps, ToastOptions } from 'react-toastify';
import { InformationCircleIcon } from '@heroicons/react/solid';
import { useSearchDebounce } from '../hooks/useSearchDebounce';
import { 
  obtenerSugerenciasDireccion, 
  manejarSeleccionSugerencia, 
  validarConsulta,
  manejarErrorConsulta,
  manejarErrorPDF,
  manejarErrorGuardado
} from '../utils/consultaDireccionUtils';
import {
  MapContainer,
  CompoundModeToggle,
  SearchSection,
  AddressManagement,
  ReportSection
} from './consulta-direccion';
import UvaInputModal from './UvaInputModal';
import PrefaInfoModal from './PrefaInfoModal';
import ConfirmModal from './generales/ConfirmModal';

// ============================================================================
// TYPES
// ============================================================================

type TipoPrefa = 'prefa1' | 'prefa2';

interface NavConfirmState {
  show: boolean;
  href: string | null;
}

interface UvaModalState {
  show: boolean;
  defaultValue: number;
  resolve: (val: number | null) => void;
}

interface ProcessingState {
  isProcessing: boolean;
  counter: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const PROCESSING_CONFIG = {
  INITIAL_COUNTER: 5,
  MAX_RETRIES: 3,
  CRITICAL_FIELDS: [
    'superficie_edificable',
    'superficie_maxima_edificable',
    'total_pisos',
    'total_capacidad_constructiva'
  ]
} as const;

const NAVIGATION_WARNING = 
  'Si cambias de sección perderás la prefactibilidad en curso. Tené en cuenta que el crédito ya fue consumido.';

// ============================================================================
// HOOKS PERSONALIZADOS
// ============================================================================

const useProcessingCounter = (isProcessing: boolean) => {
  const [counter, setCounter] = useState<number>(PROCESSING_CONFIG.INITIAL_COUNTER);

  useEffect(() => {
    if (!isProcessing) return;
    
    const interval = setInterval(() => {
      setCounter(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isProcessing]);

  return counter;
};

const useNavigationGuard = (hasActiveQuery: boolean) => {
  const [navConfirm, setNavConfirm] = useState<NavConfirmState>({ 
    show: false, 
    href: null 
  });

  useEffect(() => {
    if (!hasActiveQuery) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = NAVIGATION_WARNING;
      return NAVIGATION_WARNING;
    };

    const handleClickCapture = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      
      const anchor = target.closest('a') as HTMLAnchorElement | null;
      if (!anchor) return;
      
      const href = anchor.getAttribute('href') || '';
      const isInternal = anchor.host === window.location.host && href.startsWith('/');
      if (!isInternal) return;
      
      const me = e as MouseEvent;
      if (me && (me.metaKey || me.ctrlKey || me.shiftKey || me.button !== 0)) return;
      if (href === window.location.pathname + window.location.search) return;
      
      e.preventDefault();
      e.stopPropagation();
      setNavConfirm({ show: true, href });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleClickCapture, true);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleClickCapture, true);
    };
  }, [hasActiveQuery]);

  return { navConfirm, setNavConfirm };
};

// ============================================================================
// UTILIDADES
// ============================================================================

const isValidProcessingResponse = (response: any): boolean => {
  const valores = PROCESSING_CONFIG.CRITICAL_FIELDS.map(key => response?.[key]);
  
  return !valores.every(v => {
    if (v === undefined || v === null) return true;
    const s = String(v).trim();
    return s === '0' || s === '0.00' || s === '0.00 m2';
  });
};

const confirmarToast = (mensaje: string): Promise<boolean> => {
  return new Promise((resolve) => {
    let toastId: React.ReactText;

    const handleClose = () => {
      toast.dismiss(toastId);
      resolve(false);
    };

    const handleConfirm = () => {
      toast.dismiss(toastId);
      resolve(true);
    };

    toastId = toast.info(
      ({ closeToast }: ToastContentProps) => (
        <div>
          <p className="mb-3">{mensaje}</p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                handleClose();
                closeToast && closeToast();
              }}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                handleConfirm();
                closeToast && closeToast();
              }}
              className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Sobrescribir
            </button>
          </div>
        </div>
      ),
      {
        closeButton: false,
        autoClose: false,
        position: 'top-center'
      } as ToastOptions
    );
  });
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const ConsultaDireccion: React.FC<ConsultaDireccionProps> = ({ className }) => {
  const { usuario, refreshProfile } = useAuth();
  const { refresh: refreshCredits } = useCreditStatus();
  const navigate = useNavigate();
  
  // Estados principales
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<Informe | null>(null);
  const [direccion, setDireccion] = useState('');
  const [center, setCenter] = useState<Coordinates>(getDefaultMapCenter());
  const [savedId, setSavedId] = useState<string | null>(null);
  
  // Estados de sugerencias
  const [sugerencias, setSugerencias] = useState<DireccionSugerida[]>([]);
  const [buscandoSugerencias, setBuscandoSugerencias] = useState(false);
  
  // Estados de modo compuesto
  const [modoCompuesto, setModoCompuesto] = useState(false);
  const [direcciones, setDirecciones] = useState<string[]>([]);
  const [resultados, setResultados] = useState<Informe[]>([]);
  const [informeCompuesto, setInformeCompuesto] = useState<InformeCompuesto | null>(null);
  
  // Estados de configuración
  const [tipoPrefa, setTipoPrefa] = useState<TipoPrefa>('prefa2');
  const [showTipoInfo, setShowTipoInfo] = useState(false);
  
  // Estados de procesamiento
  const [processing, setProcessing] = useState(false);
  const processingCounter = useProcessingCounter(processing);
  
  // Estados de modales
  const [uvaModalState, setUvaModalState] = useState<UvaModalState | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  
  // Guardia de navegación
  const hasActiveQuery = !!resultado || resultados.length > 0 || processing || loading;
  const { navConfirm, setNavConfirm } = useNavigationGuard(hasActiveQuery);

  // ============================================================================
  // HANDLERS DE PROCESAMIENTO
  // ============================================================================

  const procesarCalculoPrefactibilidad = useCallback(async (datosParcela: any) => {
    setProcessing(true);
    const started = Date.now();
    try {
      let resumenValido: any = null;
      
      for (let intento = 0; intento < PROCESSING_CONFIG.MAX_RETRIES; intento++) {
        const respuesta = await prefactibilidad.calcular(datosParcela);
        
        if (respuesta && isValidProcessingResponse(respuesta)) {
          resumenValido = respuesta;
          break;
        }
      }

      if (resumenValido) {
        setResultado({ ...datosParcela, iaResumen: resumenValido } as any);
      } else {
        toast.success('Prefactibilidad generada satisfactoriamente.');
        setResultado(datosParcela);
      }
    } catch (err) {
      console.error('Error en procesamiento:', err);
      toast.error('No fue posible obtener la respuesta del cálculo. Se mostrarán los datos disponibles.');
      setResultado(datosParcela);
    } finally {
      const elapsed = Date.now() - started;
      if (elapsed < 5000) {
        await new Promise(r => setTimeout(r, 5000 - elapsed));
      }
      setProcessing(false);
    }
  }, []);

  // ============================================================================
  // HANDLERS DE SUGERENCIAS
  // ============================================================================

  const searchSuggestions = useCallback(async (valor: string) => {
    setBuscandoSugerencias(true);
    try {
      await obtenerSugerenciasDireccion(valor, setSugerencias, setError);
    } finally {
      setBuscandoSugerencias(false);
    }
  }, []);

  const { debouncedSearch: obtenerSugerenciasDebounced } = useSearchDebounce(
    searchSuggestions, 
    { delay: 300, minLength: 4 }
  );

  const obtenerSugerencias = useCallback((valor: string) => {
    if (valor.length <= 3) {
      setSugerencias([]);
      setError(null);
      setBuscandoSugerencias(false);
      return;
    }
    
    setBuscandoSugerencias(true);
    obtenerSugerenciasDebounced(valor);
  }, [obtenerSugerenciasDebounced]);

  const seleccionarSugerencia = useCallback(async (direccionStr: string) => {
    await manejarSeleccionSugerencia(
      direccionStr,
      sugerencias,
      setDireccion,
      setCenter,
      modoCompuesto,
      agregarDireccion
    );
  }, [sugerencias, modoCompuesto]);

  // ============================================================================
  // HANDLERS DE DIRECCIONES
  // ============================================================================

  const agregarDireccion = useCallback((dir: string) => {
    setDirecciones(prev => prev.includes(dir) ? prev : [...prev, dir]);
  }, []);

  const eliminarDireccion = useCallback((index: number) => {
    setDirecciones(prev => prev.filter((_, i) => i !== index));
    setResultados(prev => prev.filter((_, i) => i !== index));
  }, []);

  // ============================================================================
  // HANDLERS DE CONSULTAS
  // ============================================================================

  const consultarDireccionesMultiples = useCallback(async () => {
    if (direcciones.length === 0) return;
    
    setLoading(true);
    setError('');
    
    try {
      const resultadosNuevos: Informe[] = [];
      
      for (const dir of direcciones) {
        const respuesta = await prefactibilidad.consultarDireccion(dir, {
          prefaCompleta: tipoPrefa === 'prefa2',
          compuesta: true
        });
        
        if ((respuesta as any).inProgress) {
          toast.info('Ya tienes una consulta en curso. Espera a que finalice.');
          setLoading(false);
          return;
        }
        
        resultadosNuevos.push(respuesta);
      }
      
      setResultados(resultadosNuevos);
      await refreshProfile();
      refreshCredits();
    } catch (error) {
      manejarErrorConsulta(error, setError);
    } finally {
      setLoading(false);
    }
  }, [direcciones, tipoPrefa, refreshProfile, refreshCredits]);

  const consolidarInformes = useCallback(() => {
    if (!modoCompuesto || resultados.length === 0) return;

    try {
      const informeCompuestoNuevo = crearInformeCompuesto(direcciones, resultados);
      setInformeCompuesto(informeCompuestoNuevo);
      setResultado(informeCompuestoNuevo.informeConsolidado);
    } catch (error: any) {
      console.error('Error al consolidar informes:', error);
      const msg = error?.message || 'Error al consolidar los informes. Por favor intente nuevamente.';
      setError(msg);
      setInformeCompuesto(null);
      setResultado(null);
    }
  }, [modoCompuesto, resultados, direcciones]);

  const handleSearch = useCallback(async () => {
    if (!validarConsulta(usuario, direccion, setError)) return;

    if (modoCompuesto) {
      agregarDireccion(direccion);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await prefactibilidad.consultarDireccion(direccion, {
        prefaCompleta: tipoPrefa === 'prefa2',
        compuesta: false
      });

      if ((response as any).inProgress) {
        toast.info('Ya tienes una consulta en curso. Espera a que finalice.');
        setLoading(false);
        return;
      }

      setResultado(response);
      refreshProfile();
      refreshCredits();
      updateMapCenter(response, setCenter);

      setProcessing(true);
      await procesarCalculoPrefactibilidad(response);
    } catch (err) {
      manejarErrorConsulta(err, setError);
      setProcessing(false);
    } finally {
      setLoading(false);
    }
  }, [usuario, direccion, modoCompuesto, tipoPrefa, refreshProfile, procesarCalculoPrefactibilidad, agregarDireccion, refreshCredits]);

  // ============================================================================
  // HANDLERS DE REPORTES
  // ============================================================================

  const handleGenerateReport = useCallback(async () => {
    if (!savedId) return;

    try {
      const blob = await prefactibilidad.descargarPDF(savedId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `informe-${resultado?.direccion?.direccion || 'prefactibilidad'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      manejarErrorPDF(err, setError);
    }
  }, [savedId, resultado]);

  const solicitarValorUva = useCallback((valorDefault: number): Promise<number | null> => {
    return new Promise(resolve => {
      setUvaModalState({ show: true, defaultValue: valorDefault, resolve });
    });
  }, []);

  const handleAcceptReport = useCallback(async (): Promise<boolean> => {
    if (!resultado) return false;

    try {
      const smp = resultado?.datosCatastrales?.smp;
      if (smp) {
        const { exists } = await prefactibilidad.existeInforme(smp, tipoPrefa);
        if (exists) {
          const confirmar = await confirmarToast(
            'Esta prefactibilidad ya existe en tus informes. Si continúas, se sobrescribirá la anterior.'
          );
          if (!confirmar) return false;
        }
      }

      const defaultUva = resultado?.edificabilidad?.plusvalia?.incidencia_uva || 0;
      const uvaPersonalizado = await solicitarValorUva(defaultUva);
      if (uvaPersonalizado === null) return false;

      const informeConUva: Informe = {
        ...resultado,
        tipoPrefa,
        edificabilidad: {
          ...resultado.edificabilidad,
          plusvalia: {
            ...resultado.edificabilidad.plusvalia,
            uvaOriginal: defaultUva,
            uvaPersonalizado
          }
        }
      } as Informe;

      const loadingId = toast.loading('Guardando informe...');
      const response = await prefactibilidad.aceptarInforme(informeConUva);
      toast.dismiss(loadingId);

      if (response.success) {
        toast.success(response.message || 'Informe guardado exitosamente');
        if (response.informe?._id) setSavedId(response.informe._id);
        return true;
      } else {
        toast.error('Error al guardar el informe');
        setError('Error al guardar el informe');
        return false;
      }
    } catch (err) {
      manejarErrorGuardado(err, setError);
      return false;
    }
  }, [resultado, tipoPrefa, solicitarValorUva]);

  // ============================================================================
  // HANDLERS DE UI
  // ============================================================================

  const toggleModoCompuesto = useCallback(() => {
    if (resultado || resultados.length > 0 || informeCompuesto) return;
    
    setModoCompuesto(prevModo => {
      const nuevoModo = !prevModo;
      if (!nuevoModo) {
        setDirecciones([]);
        setResultados([]);
        setInformeCompuesto(null);
      }
      return nuevoModo;
    });
  }, [resultado, resultados, informeCompuesto]);

  const resetConsulta = useCallback(() => {
    setResultado(null);
    setInformeCompuesto(null);
    setResultados([]);
    setDirecciones([]);
    setSavedId(null);
  }, []);

  const handleClearClick = useCallback(() => {
    setConfirmReset(true);
  }, []);

  const handleTipoPrefaChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    if (resultado || resultados.length > 0) return;
    setTipoPrefa(e.target.value as TipoPrefa);
  }, [resultado, resultados]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    if (modoCompuesto && resultados.length > 0) {
      consolidarInformes();
    }
  }, [resultados, modoCompuesto, consolidarInformes]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }
  }, [error]);

  // ============================================================================
  // RENDER
  // ============================================================================

  const isDisabled = loading || processing || !!resultado || resultados.length > 0;

  return (
    <div className={`flex flex-col items-center justify-center w-full ${className || ''}`}>
      <ConsultaContainer>
        <ConsultaHeader />
        
        <CompoundModeToggle 
          modoCompuesto={modoCompuesto}
          onToggle={toggleModoCompuesto}
          disabled={isDisabled}
        />
        
        <SearchSection 
          direccion={direccion}
          onDireccionChange={setDireccion}
          onSearch={handleSearch}
          modoCompuesto={modoCompuesto}
          loading={loading || buscandoSugerencias}
          sugerencias={sugerencias}
          onInputChange={obtenerSugerencias}
          onSeleccionarSugerencia={seleccionarSugerencia}
          hasResult={!!resultado || resultados.length > 0}
          onClear={handleClearClick}
          disabled={isDisabled}
        />

        <div className="flex flex-col md:flex-row md:items-center md:space-x-2 mt-4 space-y-2 md:space-y-0">
          <label className="text-gray-900 dark:text-gray-100">
            Tipo de Prefactibilidad:
          </label>
          <select 
            value={tipoPrefa}
            onChange={handleTipoPrefaChange}
            className="border rounded px-2 py-1 pr-6 text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            disabled={isDisabled}
          >
            <option value="prefa1">Prefactibilidad Simple</option>
            <option value="prefa2">Prefactibilidad Completa</option>
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

        {showTipoInfo && (
          <PrefaInfoModal onClose={() => setShowTipoInfo(false)} />
        )}
        
        <MapContainer 
          center={center}
          showMarker={!!resultado || resultados.length > 0}
        />
        
        <AddressManagement 
          modoCompuesto={modoCompuesto}
          direcciones={direcciones}
          onEliminarDireccion={eliminarDireccion}
          onConsultarDirecciones={consultarDireccionesMultiples}
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
          onGenerateReport={handleGenerateReport}
          onAcceptReport={handleAcceptReport}
          tipoPrefa={tipoPrefa}
        />
      </ReportContainer>

      {uvaModalState?.show && (
        <UvaInputModal
          defaultValue={uvaModalState.defaultValue}
          onCancel={() => {
            uvaModalState.resolve(null);
            setUvaModalState(null);
          }}
          onConfirm={(val) => {
            uvaModalState.resolve(val);
            setUvaModalState(null);
          }}
        />
      )}

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

// ============================================================================
// COMPONENTES DE PRESENTACIÓN
// ============================================================================

const ConsultaContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-[95%] lg:w-[63%] max-w-8xl mt-8">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
      {children}
    </div>
  </div>
);

const ConsultaHeader: React.FC = () => (
  <h1 className="text-2xl font-bold text-[#0369A1] mb-4">
    {CONSULTA_DIRECCION_CONFIG.TITLE}
  </h1>
);

const ReportContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-[95%] lg:w-[80%] max-w-6xl">
    {children}
  </div>
);

const ProcessingOverlay: React.FC<{ seconds: number }> = ({ seconds }) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 sm:p-0">
    <div className="w-full sm:w-auto px-6 sm:px-10 py-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/30 shadow-lg text-center text-white space-y-4">
      <div className="animate-pulse text-xl font-semibold">
        Armando tu prefactibilidad…
      </div>
      <div className="text-4xl font-extrabold tracking-wider">
        {seconds}s
      </div>
    </div>
  </div>
);

export default ConsultaDireccion;
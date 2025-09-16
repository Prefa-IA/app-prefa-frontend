import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { prefactibilidad } from '../services/api';
import { Informe, InformeCompuesto, ConsultaDireccionProps, DireccionSugerida, CONSULTA_DIRECCION_CONFIG } from '../types/enums';
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
// import Loader from './generales/Loader';
import UvaInputModal from './UvaInputModal';
import PrefaInfoModal from './PrefaInfoModal';
import ConfirmModal from './generales/ConfirmModal';

const ConsultaDireccion: React.FC<ConsultaDireccionProps> = ({ className }) => {
  const { usuario, refreshProfile } = useAuth();
  const navigate = useNavigate();
  // const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Estados principales
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<Informe | null>(null);
  const [direccion, setDireccion] = useState<string>('');
  const [center, setCenter] = useState<Coordinates>(getDefaultMapCenter());
  const [savedId, setSavedId] = useState<string | null>(null);

  
  // Estados para sugerencias
  const [sugerencias, setSugerencias] = useState<DireccionSugerida[]>([]);
  const [buscandoSugerencias, setBuscandoSugerencias] = useState<boolean>(false);
  
  // Estados para modo compuesto
  const [modoCompuesto, setModoCompuesto] = useState<boolean>(false);
  const [direcciones, setDirecciones] = useState<string[]>([]);
  const [resultados, setResultados] = useState<Informe[]>([]);
  const [informeCompuesto, setInformeCompuesto] = useState<InformeCompuesto | null>(null);

  // Tipo de prefactibilidad (prefa1 o prefa2)
  const [tipoPrefa, setTipoPrefa] = useState<'prefa1' | 'prefa2'>('prefa2');
  const [showTipoInfo, setShowTipoInfo] = useState<boolean>(false);

  const [iaProcessing, setIaProcessing] = useState(false);
  const [iaCounter, setIaCounter] = useState(135);

  // countdown efecto
  useEffect(() => {
    if (!iaProcessing) return;
    const interval = setInterval(() => {
      setIaCounter(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [iaProcessing]);

  // función para ejecutar IA con reintentos
  const procesarIA = async (datosParcela: any) => {
    setIaProcessing(true);
    setIaCounter(135);
    try {
      let intento = 0;
      let resumenValido: any = null;
      while (intento < 3) {
        intento++;
        const resp = await prefactibilidad.evaluateGemini(datosParcela);
        if (resp?.ok && resp.data) {
          const critical = [
            'superficie_edificable',
            'superficie_maxima_edificable',
            'total_pisos',
            'total_capacidad_constructiva'
          ];

          const valores = critical.map(key => {
            return (resp.data as any)[key];
          });

          const allZero = valores.every(v => {
            if (v === undefined || v === null) return true;
            const s = String(v).trim();
            return s === '0' || s === '0.00' || s === '0.00 m2';
          });
          if (!allZero) {
            resumenValido = resp.data;
            break;
          }
        }
      }

      if (resumenValido) {
        setResultado({ ...datosParcela, iaResumen: resumenValido } as any);
      } else {
        toast.warning('La IA no pudo generar valores válidos tras 3 intentos. Se mostrarán los datos sin IA.');
        setResultado(datosParcela);
      }
    } catch (err) {
      console.error('IA error:', err);
      toast.error('No fue posible obtener la respuesta de la IA. Se mostrarán los datos disponibles.');
      setResultado(datosParcela);
    } finally {
      setIaProcessing(false);
    }
  };

  // Handlers para sugerencias con debouncing
  const searchSuggestions = useCallback(async (valor: string) => {
    setBuscandoSugerencias(true);
    try {
      await obtenerSugerenciasDireccion(valor, setSugerencias, setError);
    } finally {
      setBuscandoSugerencias(false);
    }
  }, []);

  const { debouncedSearch: obtenerSugerenciasDebounced } = useSearchDebounce(searchSuggestions, {
    delay: 300,
    minLength: 4
  });

  const obtenerSugerencias = useCallback((valor: string) => {
    // Si es muy corto, limpiar inmediatamente
    if (valor.length <= 3) {
      setSugerencias([]);
      setError(null);
      setBuscandoSugerencias(false);
      return;
    }
    // Indicar que está buscando
    setBuscandoSugerencias(true);
    // Usar la versión debounced
    obtenerSugerenciasDebounced(valor);
  }, [obtenerSugerenciasDebounced]);

  const agregarDireccion = useCallback((dir: string) => {
    setDirecciones(prev => {
      if (!prev.includes(dir)) {
        return [...prev, dir];
      }
      return prev;
    });
  }, []);

  const seleccionarSugerencia = useCallback(async (direccionStr: string) => {
    await manejarSeleccionSugerencia(
      direccionStr,
      sugerencias,
      setDireccion,
      setCenter,
      modoCompuesto,
      agregarDireccion
    );
  }, [sugerencias, modoCompuesto, agregarDireccion]);

  const eliminarDireccion = useCallback((index: number) => {
    setDirecciones(prev => prev.filter((_, i) => i !== index));
    setResultados(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Handlers para consultas
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
    } catch (error) {
      manejarErrorConsulta(error, setError);
    } finally {
      setLoading(false);
    }
  }, [direcciones, tipoPrefa, refreshProfile]);

  const consolidarInformes = useCallback(() => {
    if (modoCompuesto && resultados.length > 0) {
      try {
        const informeCompuestoNuevo = crearInformeCompuesto(direcciones, resultados);
        setInformeCompuesto(informeCompuestoNuevo);
        setResultado(informeCompuestoNuevo.informeConsolidado);
      } catch (error: any) {
        console.error('Error al consolidar informes:', error);
        const msg = error?.message || 'Error al consolidar los informes. Por favor intente nuevamente.';
        setError(msg);
        // Reiniciar resultados para que no continúe el flujo
        setInformeCompuesto(null);
        setResultado(null);
      }
    }
  }, [modoCompuesto, resultados, direcciones]);

  // Effects
  useEffect(() => {
    if (modoCompuesto && resultados.length > 0) {
      try {
        consolidarInformes();
      } catch (err: any) {
        const msg = err?.message || 'Error al consolidar los informes';
        setError(msg);
        // Reiniciar resultados para que no continúe el flujo
        setInformeCompuesto(null);
        setResultado(null);
      }
    }
  }, [resultados, modoCompuesto, consolidarInformes]);

  // Mostrar errores como toast y limpiar para no renderizar alerta
  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }
  }, [error]);

  // Handlers principales
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



  const handleSearch = async () => {
    if (!validarConsulta(usuario, direccion, setError)) {
      return;
    }

    if (modoCompuesto) {
      agregarDireccion(direccion);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let response: Informe;
      response = await prefactibilidad.consultarDireccion(direccion, {
        prefaCompleta: tipoPrefa === 'prefa2',
        compuesta: false
      });
      if ((response as any).inProgress) {
        toast.info('Ya tienes una consulta en curso. Espera a que finalice.');
        setLoading(false);
        return;
      }
      setResultado(response);
      // Actualizar créditos en navbar
      refreshProfile();
      updateMapCenter(response, setCenter);

      // Ejecutar IA y, cuando finalice, guardar resultado
      setIaProcessing(true);
      setIaCounter(135);
      await procesarIA(response);
    } catch (err) {
      setLoading(false);
      manejarErrorConsulta(err, setError);
      setIaProcessing(false);
    } finally {
      setLoading(false);
      if (!iaProcessing) setIaProcessing(false);
    }
  };

  const handleGenerateReport = async () => {
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
  };

  // Aviso al usuario si intenta abandonar la página o navegar dentro de la app mientras hay una consulta activa o resultado cargado
  const tieneConsultaActiva = !!resultado || resultados.length > 0 || iaProcessing || loading;
  const [navConfirm, setNavConfirm] = useState<{ show: boolean; href: string | null }>({ show: false, href: null });
  useEffect(() => {
    if (!tieneConsultaActiva) return;

    const message = 'Si cambias de sección perderás la prefactibilidad en curso. Tené en cuenta que el crédito ya fue consumido.';

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    // Interceptar navegación interna por links <Link>/<a> y usar modal propio
    const handleClickCapture = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest('a') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute('href') || '';
      // Solo bloquear rutas internas del SPA
      const isInternal = anchor.host === window.location.host && href.startsWith('/');
      if (!isInternal) return;
      // abrir en nueva pestaña o clicks modificados: dejar pasar
      const me = e as MouseEvent;
      if (me && (me.metaKey || me.ctrlKey || me.shiftKey || me.button !== 0)) return;
      // Si navega a la misma ruta, no bloquear
      if (href === window.location.pathname + window.location.search) return;
      e.preventDefault();
      e.stopPropagation();
      setNavConfirm({ show: true, href });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    // Capturamos clicks antes de que react-router haga pushState
    document.addEventListener('click', handleClickCapture, true);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleClickCapture, true);
    };
  }, [tieneConsultaActiva]);

  const handleAcceptReport = async (): Promise<boolean> => {
    if (!resultado) return false;

    try {
      // Verificar existencia previa
      const smp = resultado?.datosCatastrales?.smp;
      if (smp) {
        const { exists } = await prefactibilidad.existeInforme(smp, tipoPrefa);
        if (exists) {
          const confirmar = await confirmarToast('Esta prefactibilidad ya existe en tus informes. Si continúas, se sobrescribirá la anterior.');
          if (!confirmar) return false;
        }
      }

      // Solicitar valor de UVA mediante popup estilizado
      const defaultUva = resultado?.edificabilidad?.plusvalia?.incidencia_uva || 0;
      const uvaPersonalizado = await solicitarValorUva(defaultUva);
      if (uvaPersonalizado === null) return false;

      // Adjuntar campos de UVA y tipoPrefa
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
  };

  const [uvaModalState, setUvaModalState] = useState<UvaModalState | null>(null);
  const [confirmReset,setConfirmReset]=useState(false);

  const solicitarValorUva = (valorDefault:number):Promise<number|null> => {
    return new Promise(resolve => {
      setUvaModalState({ show:true, defaultValue: valorDefault, resolve });
    });
  };

  const resetConsulta = () => {
    setResultado(null);
    setInformeCompuesto(null);
    setResultados([]);
    setDirecciones([]);
    setSavedId(null);
  };

  const handleClearClick = () => {
    setConfirmReset(true);
  };

  return (
    <div className={`flex flex-col items-center justify-center w-full ${className || ''}`}>
      <ConsultaContainer>
        <ConsultaHeader />
        
        <CompoundModeToggle 
          modoCompuesto={modoCompuesto}
          onToggle={toggleModoCompuesto}
          disabled={loading || iaProcessing || !!resultado || resultados.length > 0}
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
          hasResult={!!resultado || resultados.length>0}
          onClear={handleClearClick}
          disabled={loading || iaProcessing || !!resultado || resultados.length > 0}
        />

        {/* Selector de tipo de prefactibilidad */}
        <div className="flex items-center space-x-2 mt-4">
          <label>Tipo de Prefactibilidad:</label>
          <select 
            value={tipoPrefa}
            onChange={e => {
              if (resultado || resultados.length > 0) return;
              const val = e.target.value as 'prefa1' | 'prefa2';
              setTipoPrefa(val);
            }}
            className="border rounded px-2 py-1 pr-6 text-sm"
            disabled={loading || iaProcessing || !!resultado || resultados.length > 0}
          >
            <option value="prefa1">Prefactibilidad Simple</option>
            <option value="prefa2">Prefactibilidad Completa</option>
          </select>

          {/* Ícono de información */}
          <button 
            type="button"
            onClick={() => setShowTipoInfo(true)} 
            title="Ver diferencias entre los tipos de prefactibilidad"
            className="text-blue-600 hover:text-blue-800"
          >
            <InformationCircleIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Modal de información de tipos */}
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
        

        
        {/* Loader eliminado: el overlay IA será el indicador principal */}
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
      {iaProcessing && <IaProcessingOverlay seconds={iaCounter} />}
      {confirmReset && (
        <ConfirmModal 
          message="Esta acción eliminará las direcciones y el resultado actual. ¿Continuar?"
          onCancel={()=>setConfirmReset(false)}
          onConfirm={()=>{resetConsulta();setConfirmReset(false);}}
        />
      )}
      {navConfirm.show && (
        <ConfirmModal
          message={'Si cambias de sección perderás la prefactibilidad en curso. Tené en cuenta que el crédito ya fue consumido.'}
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

const ConsultaContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-[60%] max-w-4xl mt-8">
    <div className="bg-white p-6 rounded-lg shadow-md">
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
  <div className="w-[80%] max-w-6xl">
    {children}
  </div>
);

// Helper: muestra un toast con botones y devuelve una Promise<boolean>
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

interface UvaModalState {
  show: boolean;
  defaultValue: number;
  resolve: (val: number | null) => void;
}

const IaProcessingOverlay: React.FC<{ seconds: number }> = ({ seconds }) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="px-10 py-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/30 shadow-lg text-center text-white space-y-4">
      <div className="animate-pulse text-xl font-semibold">Armando tu prefactibilidad con IA…</div>
      <div className="text-4xl font-extrabold tracking-wider">{seconds}s</div>
    </div>
  </div>
);

export default ConsultaDireccion;
import { useConsultaDireccionStateHooks } from './use-consulta-direccion-state-hooks';
import { useConsultaDireccionStateSetup } from './use-consulta-direccion-state-setup';

export const useConsultaDireccionState = (_className?: string) => {
  const setup = useConsultaDireccionStateSetup();
  const hooks = useConsultaDireccionStateHooks({
    direcciones: setup.direcciones,
    resultados: setup.resultados,
    modoCompuesto: setup.modoCompuesto,
    tipoPrefa: setup.tipoPrefa,
    direccion: setup.direccion,
    usuario: setup.usuario,
    setDireccion: setup.setDireccion,
    setCenter: setup.setCenter,
    setLoading: setup.setLoading,
    setError: setup.setError,
    setResultado: setup.setResultado,
    setResultados: setup.setResultados,
    setProcessing: setup.setProcessing,
    setDirecciones: setup.setDirecciones,
    refreshProfile: setup.refreshProfile,
    refreshCredits: () => {
      void setup.refreshCredits();
    },
    savedId: setup.savedId,
    resultado: setup.resultado,
    setSavedId: setup.setSavedId,
    informeCompuesto: setup.informeCompuesto,
    setInformeCompuesto: setup.setInformeCompuesto,
    setModoCompuesto: setup.setModoCompuesto,
    setTipoPrefa: setup.setTipoPrefa,
    setConfirmReset: setup.setConfirmReset,
    error: setup.error,
  });

  return {
    loading: setup.loading,
    error: setup.error,
    resultado: setup.resultado,
    direccion: setup.direccion,
    setDireccion: setup.setDireccion,
    center: setup.center,
    savedId: setup.savedId,
    modoCompuesto: setup.modoCompuesto,
    direcciones: setup.direcciones,
    resultados: setup.resultados,
    informeCompuesto: setup.informeCompuesto,
    tipoPrefa: setup.tipoPrefa,
    showTipoInfo: setup.showTipoInfo,
    setShowTipoInfo: setup.setShowTipoInfo,
    processing: setup.processing,
    confirmReset: setup.confirmReset,
    setConfirmReset: setup.setConfirmReset,
    isDisabled:
      setup.loading || setup.processing || !!setup.resultado || setup.resultados.length > 0,
    sugerencias: hooks.sugerencias,
    buscandoSugerencias: hooks.buscandoSugerencias,
    obtenerSugerencias: hooks.obtenerSugerencias,
    seleccionarSugerencia: hooks.seleccionarSugerencia,
    agregarDireccion: hooks.agregarDireccion,
    eliminarDireccion: hooks.eliminarDireccion,
    consultarDireccionesMultiples: hooks.consultarDireccionesMultiples,
    handleSearch: hooks.handleSearch,
    handleGenerateReport: hooks.handleGenerateReport,
    toggleModoCompuesto: hooks.toggleModoCompuesto,
    resetConsulta: hooks.resetConsulta,
    handleTipoPrefaChange: hooks.handleTipoPrefaChange,
    handleClearClick: hooks.handleClearClick,
    navigate: setup.navigate,
  };
};

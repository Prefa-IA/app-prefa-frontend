import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

interface UseSubscriptionHandlerProps {
  refresh: () => Promise<void>;
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const errorData = error.response?.data;
    if (errorData?.error) {
      const errorMap: Record<string, string> = {
        suscripcion_no_encontrada: 'Suscripción no encontrada',
        forbidden: 'No tienes permiso para realizar esta acción',
        suscripcion_ya_pausada: 'La suscripción ya está pausada',
        suscripcion_ya_cancelada: 'La suscripción ya está cancelada',
        suscripcion_cancelada: 'No se puede pausar una suscripción cancelada',
        error_pause: 'Error al pausar la suscripción',
        error_cancel: 'Error al cancelar la suscripción',
      };
      return errorMap[errorData.error] || errorData.error || 'Error en la operación';
    }
    return error.message || 'Error en la comunicación con el servidor';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Error desconocido';
};

export const useSubscriptionHandler = ({ refresh }: UseSubscriptionHandlerProps) => {
  const handle = useCallback(
    async (action: () => Promise<unknown>, success: string) => {
      try {
        await action();
        toast.success(success);
        void refresh();
      } catch (e: unknown) {
        const errorMessage = getErrorMessage(e);
        toast.error(errorMessage);
      }
    },
    [refresh]
  );

  return { handle };
};

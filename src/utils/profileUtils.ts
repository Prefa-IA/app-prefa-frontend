import { Usuario } from '../types/enums';

export const getUserTypeLabel = (tipo: string): string => {
  return tipo === 'individual' ? 'Individual' : 'Organización';
};

export const getSubscriptionStatus = (usuario: Usuario) => {
  const isActive = usuario.suscripcion?.fechaFin && 
    new Date(usuario.suscripcion.fechaFin) > new Date();

  return {
    type: 'suscripcion',
    isActive,
    plan: usuario.suscripcion?.tipo || 'Sin suscripción',
    fechaFin: usuario.suscripcion?.fechaFin
  };
};

export const formatSubscriptionPlan = (plan: string): string => {
  return plan.charAt(0).toUpperCase() + plan.slice(1);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

export const getSubscriptionStatusClass = (isActive: boolean): string => {
  return isActive 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800';
};

export const getConsultasStatusClass = (): string => {
  return 'bg-green-100 text-green-800';
}; 
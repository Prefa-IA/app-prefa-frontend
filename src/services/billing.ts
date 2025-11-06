import { BillingInfo } from '../types/billing';
import api from './api';

// Centralizar la lógica en el cliente axios que ya gestiona el token JWT.

export const getBillingInfo = async (): Promise<BillingInfo | null> => {
  try {
    const { data } = await api.get<BillingInfo>('/auth/perfil/billing');
    return data;
  } catch (e) {
    console.error('Error obteniendo billing info', e);
    return null;
  }
};

export const saveBillingInfo = async (data: BillingInfo): Promise<boolean> => {
  try {
    await api.put('/auth/perfil/billing', data);
    return true;
  } catch (e) {
    console.error('Error guardando billing info', e);
    return false;
  }
};

import api from './api';

export const getStatus = async () => {
  const { data } = await api.get('/suscripciones/estado');
  return data;
};

export const pause = async (id: string) => {
  const { data } = await api.patch(`/suscripciones/${id}/pause`);
  return data;
};

export const cancel = async (id: string) => {
  const { data } = await api.patch(`/suscripciones/${id}/cancel`);
  return data;
};

export const changePlan = async (newPlanId: string, isUpgrade = true) => {
  const endpoint = isUpgrade ? '/suscripciones/upgrade' : '/suscripciones/downgrade';
  const { data } = await api.post(endpoint, { newPlanId });
  return data;
};

export const subscriptionService = {
  getStatus,
  pause,
  cancel,
  changePlan,
};

export default subscriptionService;

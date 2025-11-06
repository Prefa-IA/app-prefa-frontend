const BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export interface OveragePlanPayload {
  id?: string;
  name: string;
  creditosTotales: number;
  price: number;
  prioridad?: number;
  discountPct?: number;
}

const fetchJSON = (url: string, options?: RequestInit) =>
  fetch(url, { credentials: 'include', ...options }).then(r => {
    if (!r.ok) throw new Error('Error de red');
    return r.json();
  });

export const list = () => fetchJSON(`${BASE}/admin/billing/planes?isOverage=1`);

export const create = (data: OveragePlanPayload) =>
  fetchJSON(`${BASE}/admin/billing/planes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, isOverage: true }),
  });

export const update = (id: string, data: OveragePlanPayload) =>
  fetchJSON(`${BASE}/admin/billing/planes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

export const remove = (id: string) =>
  fetchJSON(`${BASE}/admin/billing/planes/${id}`, { method: 'DELETE' });

export const adminPlansService = { list, create, update, remove };

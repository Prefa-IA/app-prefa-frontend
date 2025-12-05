import axios from 'axios';

export interface Plusvalia {
  _id: string;
  distritoCpu: string;
  alicuota: number;
  uvaReferencia: number;
}
export interface Indice {
  _id: string;
  clave: string;
  valor: number;
}

const cache = {
  plusvalias: null as Plusvalia[] | null,
  indices: null as Indice[] | null,
};

export const getPlusvalias = async () => {
  if (cache.plusvalias) return cache.plusvalias;
  cache.plusvalias = (await axios.get<Plusvalia[]>('/api/economicos/plusvalias')).data;
  return cache.plusvalias;
};

export const getIndices = async () => {
  if (cache.indices) return cache.indices;
  cache.indices = (await axios.get<Indice[]>('/api/economicos/indices')).data;
  return cache.indices;
};

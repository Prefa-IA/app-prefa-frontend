import axios from 'axios';

export interface Plusvalia { _id:string; distritoCpu:string; alicuota:number; uvaReferencia:number }
export interface Indice { _id:string; clave:string; valor:number }

let plusCache: Plusvalia[] | null = null;
let idxCache: Indice[] | null = null;

export const getPlusvalias = async () => {
  if (plusCache) return plusCache;
  plusCache = (await axios.get<Plusvalia[]>('/api/economicos/plusvalias')).data;
  return plusCache;
};

export const getIndices = async () => {
  if (idxCache) return idxCache;
  idxCache = (await axios.get<Indice[]>('/api/economicos/indices')).data;
  return idxCache;
}; 
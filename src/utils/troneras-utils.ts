export interface TronerasDescription {
  text: string;
  color: string;
}

export const getTronerasDescription = (count: number): TronerasDescription => {
  if (count === 0) return { text: 'Sin troneras aplicables', color: 'text-gray-400' };
  if (count === 1) return { text: 'Caso especial: 1 tronera', color: 'text-blue-500' };
  if (count === 2) return { text: 'Caso especial: 2 troneras', color: 'text-blue-500' };
  if (count === 3) return { text: 'Manzana triangular', color: 'text-orange-500' };
  if (count === 4) return { text: 'Manzana típica', color: 'text-green-500' };
  return { text: 'Manzana irregular', color: 'text-purple-500' };
};

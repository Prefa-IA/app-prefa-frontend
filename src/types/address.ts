import { DireccionSugerida } from './enums';

export interface AddressSuggestionsHookReturn {
  sugerencias: DireccionSugerida[];
  buscandoSugerencias: boolean;
  obtenerSugerencias: (valor: string) => void;
  seleccionarSugerencia: (direccionStr: string) => Promise<void>;
}



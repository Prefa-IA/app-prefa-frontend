import axios, { InternalAxiosRequestConfig } from 'axios';
import { Usuario, LoginCredentials, RegistroData, Informe, SubscriptionPlan, PaymentData } from '../types/enums';
import { sanitizePath } from '../utils/urlSanitizer';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api',
});

const googleMapsKey = 'AIzaSyB8PJ9MnZL1Di8qU7zkuiqMqr_rc4C8PpM';
const GOOGLE_LOGIN_URI = process.env.REACT_APP_GOOGLE_LOGIN_URI || '/auth/google';

async function sha256Hex(input: string): Promise<string> {
  const cryptoApi: SubtleCrypto | undefined =
    (typeof globalThis !== 'undefined' && (globalThis as any).crypto?.subtle) ||
    (typeof window !== 'undefined' && (window as any).crypto?.subtle);
  if (!cryptoApi) {
    throw new Error('Crypto API no disponible en este entorno');
  }
  const enc = new TextEncoder().encode(input);
  const buf = await cryptoApi.digest('SHA-256', enc);
  const bytes = Array.from(new Uint8Array(buf));
  return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 409 && error.response?.data?.status === 'in_progress') {
      error.code = 'PREFA_IN_PROGRESS';
    }
    if (error.response && error.response.status === 401) {
      const msg = error.response.data?.error || '';
      if (msg.includes('Token') || msg.includes('autenticación')) {
        import('react-toastify').then(({ toast }) => {
          toast.error('Sesión expirada. Por favor inicia sesión nuevamente');
        });
        localStorage.removeItem('token');
        localStorage.removeItem('userProfile');
        const safePath = sanitizePath('/login');
        window.location.href = safePath;
      }
    }
    return Promise.reject(error);
  }
);

const obtenerCoordenadas = async (direccion: string) => {
  const direccionCompleta = direccion.includes('CABA') ? 
    direccion : 
    `${direccion}, Ciudad Autónoma de Buenos Aires, Argentina`;
  
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(direccionCompleta)}&key=${googleMapsKey}`;
  const response = await axios.get(url);
  
  if (!response.data.results || response.data.results.length === 0) {
    throw new Error('No se pudieron obtener las coordenadas para la dirección especificada');
  }
  
  const location = response.data.results[0].geometry.location;
  return {
    lat: location.lat.toString(),
    lon: location.lng.toString()
  };
};

export const auth = {
  login: async (credentials: LoginCredentials) => {
    const payload = { ...credentials } as any;
    payload.password = await sha256Hex(credentials.password);
    const response = await api.post<{ token: string; usuario: Usuario }>('/auth/login', payload);
    return response.data;
  },
  loginWithGoogleIdToken: async (idToken: string) => {
    const response = await api.post<{ token: string; usuario: Usuario }>(GOOGLE_LOGIN_URI, { token: idToken });
    return response.data;
  },
  
  registro: async (datos: RegistroData) => {
    const payload = { ...datos } as any;
    payload.password = await sha256Hex(datos.password);
    delete payload.repeatPassword;
    const response = await api.post<{ message: string }>('/auth/registro', payload);
    return response.data;
  },
  
  obtenerPerfil: async () => {
    const response = await api.get<Usuario>('/auth/perfil');
    return response.data;
  },

  updateProfile: async (updatedData: Partial<Usuario>) => {
    const response = await api.put<Usuario>('/auth/perfil', updatedData);
    return response.data;
  },

  updatePersonalization: async (personalizacion: Usuario['personalizacion']) => {
    const response = await api.put<Usuario>('/auth/personalizacion', personalizacion);
    return response.data;
  },

  resendVerification: async (email: string) => {
    const response = await api.post<{ message: string }>("/auth/resend-verification", { email });
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await api.get<{ message: string }>(`/auth/verify-email?token=${encodeURIComponent(token)}`);
    return response.data;
  },
  forgotPassword: async (email:string)=>{return api.post('/auth/forgot-password',{email});},
  resetPassword:async({token,password}:{token:string,password:string})=>{
    const passSha = await sha256Hex(password);
    return api.post('/auth/reset-password',{token,password: passSha});
  },
  getLogoRemaining: async () => {
    const response = await api.get<{ restantes: number }>('/auth/logo-remaining');
    return response.data;
  },
  getAddressHistory: async () => {
    const response = await api.get<Array<{ address: string; timestamp: number }>>('/auth/address-history');
    return response.data;
  },
  addAddressToHistory: async (address: string) => {
    const response = await api.post<{ ok: boolean; historial: Array<{ address: string; timestamp: number }> }>('/auth/address-history', { address });
    return response.data;
  },
  updateTutorialStatus: async (status: 'finish' | 'omit') => {
    const response = await api.put<{ ok: boolean; tutorialStatus: string }>('/auth/tutorial-status', { status });
    return response.data;
  },
};

export const subscriptions = {
  // Caché en memoria + deduplicación de requests en vuelo
  getPlans: async () => {
    const now = Date.now();
    const ttlMs = 5 * 60 * 1000; // 5 minutos
    // Inicializar almacenes en el objeto para mantener scope de módulo
    // @ts-ignore
    if (!subscriptions.__cache) {
      // @ts-ignore
      subscriptions.__cache = { data: null as SubscriptionPlan[] | null, at: 0, inFlight: null as Promise<SubscriptionPlan[]> | null };
    }
    // @ts-ignore
    const store = subscriptions.__cache as { data: SubscriptionPlan[] | null; at: number; inFlight: Promise<SubscriptionPlan[]> | null };

    // devolver cache válido
    if (store.data && now - store.at < ttlMs) {
      return store.data;
    }
    // si hay request en vuelo, reutilizar
    if (store.inFlight) {
      return store.inFlight;
    }
    // disparar request y guardar promesa para dedupe
    store.inFlight = api.get<SubscriptionPlan[]>('/suscripciones/planes').then((res) => {
      store.data = res.data;
      store.at = Date.now();
      store.inFlight = null;
      return res.data;
    }).catch((err) => {
      store.inFlight = null;
      throw err;
    });
    return store.inFlight;
  },

  getCurrentSubscription: async () => {
    const response = await api.get('/suscripciones/actual');
    return response.data;
  },

  createPaymentPreference: async (planId: string) => {
    const response = await api.post('/suscripciones/crear-suscripcion', { planId });
    return response.data;
  },

  createSubscription: async (planId: string, payerEmail?: string) => {
    const payload: any = { planId };
    if (payerEmail) payload.payerEmail = payerEmail;
    const response = await api.post('/suscripciones/crear-suscripcion', payload);
    return response.data;
  },

  purchaseOverage: async (paqueteId: string) => {
    const response = await api.post('/suscripciones/overages/comprar', { paqueteId });
    return response.data;
  },

  processPayment: async (paymentData: PaymentData) => {
    const response = await api.post('/suscripciones/procesar-pago', paymentData);
    return response.data;
  },

  cancelSubscription: async () => {
    const response = await api.delete('/suscripciones/cancelar');
    return response.data;
  },

  validateUsage: async (opts: { prefaCompleta: boolean; compuesta: boolean; basicSearch?: boolean }) => {
    try {
      const response = await api.post('/suscripciones/validar-uso', opts);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        throw new Error('Sin créditos disponibles');
      }
      throw error;
    }
  }
};

interface DireccionSugerida {
  direccion: string;
  nombre_calle: string;
  altura?: string;
  tipo: string;
}

const obtenerSugerenciasDirecciones = async (
  busqueda: string, 
  options?: { signal?: AbortSignal }
): Promise<DireccionSugerida[]> => {
  try {
    const response = await fetch(
      `https://servicios.usig.buenosaires.gob.ar/normalizar/?direccion=${encodeURIComponent(busqueda)}&geocodificar=true`,
      { signal: options?.signal }
    );
    
    // Si la respuesta fue cancelada, throw AbortError
    if (!response.ok && options?.signal?.aborted) {
      throw new DOMException('Request aborted', 'AbortError');
    }
    
    const data = await response.json();
    
    if (data.direccionesNormalizadas) {
      const direccionesCaba = data.direccionesNormalizadas.filter(
        (dir: any) => dir.cod_partido === 'caba' || 
                     dir.nombre_partido === 'CABA' || 
                     (dir.direccion && dir.direccion.includes('CABA'))
      );
      
      return direccionesCaba.map((dir: any) => ({
        direccion: dir.direccion,
        nombre_calle: dir.nombre_calle,
        altura: dir.altura?.toString(),
        tipo: dir.tipo
      }));
    }
    return [];
  } catch (error: any) {
    // Re-throw AbortError para que pueda ser manejado correctamente
    if (error.name === 'AbortError') {
      throw error;
    }
    console.error('Error al obtener sugerencias:', error);
    return [];
  }
};

export const prefactibilidad = {
  consultarDireccion: async (direccion: string, opts: { prefaCompleta: boolean; compuesta: boolean; basicSearch?: boolean; skipCredits?: boolean }) => {
    try {
      if (!opts.skipCredits) {
        await subscriptions.validateUsage(opts as any);
      }
      const coordenadas = await obtenerCoordenadas(direccion);

      const response = await api.post<Informe>('/prefactibilidad/consultar', { 
        direccion,
        coordenadas,
        ...opts
      });
      return response.data;
    } catch (err: any) {
      if (err.code === 'PREFA_IN_PROGRESS') {
        return { inProgress: true } as any;
      }
      throw err;
    }
  },
  
  generarInforme: async (datos: Informe) => {
    const response = await api.post('/prefactibilidad/generar-informe', { datos }, {
      responseType: 'blob'
    });
    return response.data;
  },
  
  aceptarInforme: async (datos: Informe) => {
    const response = await api.post<{success: boolean, message: string, informe: Informe}>('/prefactibilidad/guardar-informe', { datos });
    return response.data;
  },
  
  descargarPDF: async (id: string) => {
    const response = await api.get(`/prefactibilidad/descargar/${id}`, { responseType: 'blob' });
    return response.data;
  },
  
  existeInforme: async (smp: string, tipoPrefa: string) => {
    const params = new URLSearchParams({ smp, tipoPrefa });
    const response = await api.get<{ exists: boolean }>(`/prefactibilidad/existe-informe?${params.toString()}`);
    return response.data;
  },
  
  obtenerInformes: async (page: number = 1, search: string = '') => {
    const params = new URLSearchParams({ page: page.toString() });
    if (search) params.append('search', search);
    const response = await api.get<{ informes: Informe[]; totalPages: number; currentPage: number; total: number }>(`/prefactibilidad/mis-informes?${params.toString()}`);
    return response.data;
  },
  
  obtenerSugerenciasDirecciones,

  calcular: async (parcela: any) => {
    const { data } = await api.post('/prefactibilidad/calcular', { parcela });
    return data;
  },

  consultarPorSMP: async (smp: string, opts: { prefaCompleta: boolean; compuesta: boolean; basicSearch?: boolean }) => {
    try {
      await subscriptions.validateUsage(opts as any);
      const cleaned = smp.trim();
      const response = await api.get<Informe>(`/prefactibilidad/consultar-smp/${encodeURIComponent(cleaned)}`);
      return response.data;
    } catch (err: any) {
        if (err.code === 'PREFA_IN_PROGRESS') return { inProgress: true } as any;
      throw err;
    }
  },
 
  obtenerInforme: async (id: string) => {
    const response = await api.get<Informe>(`/prefactibilidad/${id}`);
    return response.data;
  }
};

export const support = {
  sendTicket: async ({ subject, description, images }: { subject: string; description: string; images: File[] }) => {
    const formData = new FormData();
    formData.append('asunto', subject);
    formData.append('descripcion', description);
    images.forEach(img => formData.append('images', img));
    const response = await api.post('/support/ticket', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export default api;
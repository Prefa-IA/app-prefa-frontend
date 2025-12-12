import axios, { InternalAxiosRequestConfig } from 'axios';

import { getGoogleMapsKey } from '../config/environment';
import {
  Informe,
  LoginCredentials,
  PaymentData,
  RegistroData,
  SubscriptionPlan,
  Usuario,
} from '../types/enums';
import { sanitizePath } from '../utils/url-sanitizer';

const api = axios.create({
  baseURL: process.env['REACT_APP_API_URL'] || 'http://localhost:4000/api',
});

const googleMapsKey = getGoogleMapsKey();
const GOOGLE_LOGIN_URI = process.env['REACT_APP_GOOGLE_LOGIN_URI'] || '/auth/google';

interface CryptoGlobal {
  crypto?: {
    subtle?: SubtleCrypto;
  };
}

async function sha256Hex(input: string): Promise<string> {
  const globalCrypto = (
    typeof globalThis !== 'undefined' ? globalThis : null
  ) as CryptoGlobal | null;
  const windowCrypto = (typeof window !== 'undefined' ? window : null) as CryptoGlobal | null;
  const cryptoApi: SubtleCrypto | undefined =
    globalCrypto?.crypto?.subtle || windowCrypto?.crypto?.subtle;
  if (!cryptoApi) {
    throw new Error('Crypto API no disponible en este entorno');
  }
  const enc = new TextEncoder().encode(input);
  const buf = await cryptoApi.digest('SHA-256', enc);
  const bytes = Array.from(new Uint8Array(buf));
  return bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const normalizePerimetroManzanaUrl = (data: unknown): void => {
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    const edificabilidad = obj['edificabilidad'] as Record<string, unknown> | undefined;
    if (edificabilidad) {
      const linkImagen = edificabilidad['link_imagen'] as Record<string, unknown> | undefined;
      if (linkImagen) {
        const perimetroManzana = linkImagen['perimetro_manzana'];
        if (
          typeof perimetroManzana === 'string' &&
          perimetroManzana.startsWith('https://www.ssplan.buenosaires.gov.ar')
        ) {
          linkImagen['perimetro_manzana'] = perimetroManzana.replace(
            'https://www.ssplan.buenosaires.gov.ar',
            'http://www.ssplan.buenosaires.gov.ar'
          );
        }
      }
    }
  }
};

api.interceptors.response.use(
  (response) => {
    if (response.data) {
      normalizePerimetroManzanaUrl(response.data);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 409 && error.response?.data?.status === 'in_progress') {
      error.code = 'PREFA_IN_PROGRESS';
    }
    if (error.response && error.response.status === 401) {
      const msg = error.response.data?.error || '';
      if (msg.includes('Token') || msg.includes('autenticación')) {
        void import('react-toastify').then(({ toast }) => {
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
  const direccionCompleta = direccion.includes('CABA')
    ? direccion
    : `${direccion}, Ciudad Autónoma de Buenos Aires, Argentina`;

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(direccionCompleta)}&key=${googleMapsKey}`;
  const response = await axios.get(url, { timeout: 20000 });

  if (!response.data.results || response.data.results.length === 0) {
    throw new Error('No se pudieron obtener las coordenadas para la dirección especificada');
  }

  const location = response.data.results[0].geometry.location;
  return {
    lat: location.lat.toString(),
    lon: location.lng.toString(),
  };
};

export const auth = {
  login: async (credentials: LoginCredentials) => {
    const payload: LoginCredentials & { password: string } = {
      ...credentials,
      password: await sha256Hex(credentials.password),
    };
    const response = await api.post<{ token: string; usuario: Usuario }>('/auth/login', payload);
    return response.data;
  },
  loginWithGoogleIdToken: async (idToken: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await api.post<{ token: string; usuario: Usuario; isNewUser?: boolean }>(
        GOOGLE_LOGIN_URI,
        { token: idToken },
        { signal: controller.signal, timeout: 30000 }
      );
      clearTimeout(timeoutId);
      return response.data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('La solicitud tardó demasiado. Por favor, intenta nuevamente.');
      }
      throw error;
    }
  },

  checkEmail: async (email: string) => {
    const response = await api.post<{ available: boolean }>('/auth/check-email', { email });
    return response.data;
  },

  registro: async (datos: RegistroData) => {
    const { repeatPassword: _repeatPassword, ...restDatos } = datos;
    const payload: Omit<RegistroData, 'repeatPassword'> & { password: string } = {
      ...restDatos,
      password: await sha256Hex(datos.password),
    };
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
    const response = await api.post<{ message: string }>('/auth/resend-verification', { email });
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await api.get<{ message: string }>(
      `/auth/verify-email?token=${encodeURIComponent(token)}`
    );
    return response.data;
  },
  forgotPassword: async (email: string) => {
    return api.post('/auth/forgot-password', { email });
  },
  resetPassword: async ({ token, password }: { token: string; password: string }) => {
    const passSha = await sha256Hex(password);
    return api.post('/auth/reset-password', { token, password: passSha });
  },
  getLogoRemaining: async () => {
    const response = await api.get<{ restantes: number }>('/auth/logo-remaining');
    return response.data;
  },
  getAddressHistory: async () => {
    const response =
      await api.get<Array<{ address: string; timestamp: number }>>('/auth/address-history');
    return response.data;
  },
  addAddressToHistory: async (address: string) => {
    const response = await api.post<{
      ok: boolean;
      historial: Array<{ address: string; timestamp: number }>;
    }>('/auth/address-history', { address });
    return response.data;
  },
  updateTutorialStatus: async (status: 'finish' | 'omit') => {
    const response = await api.put<{ ok: boolean; tutorialStatus: string }>(
      '/auth/tutorial-status',
      { status }
    );
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
      subscriptions.__cache = {
        data: null as SubscriptionPlan[] | null,
        at: 0,
        inFlight: null as Promise<SubscriptionPlan[]> | null,
      };
    }
    // @ts-ignore
    const store = subscriptions.__cache as {
      data: SubscriptionPlan[] | null;
      at: number;
      inFlight: Promise<SubscriptionPlan[]> | null;
    };

    // devolver cache válido
    if (store.data && now - store.at < ttlMs) {
      return store.data;
    }
    // si hay request en vuelo, reutilizar
    if (store.inFlight) {
      return store.inFlight;
    }
    // disparar request y guardar promesa para dedupe
    store.inFlight = api
      .get<SubscriptionPlan[]>('/suscripciones/planes')
      .then((res) => {
        store.data = res.data;
        store.at = Date.now();
        store.inFlight = null;
        return res.data;
      })
      .catch((err) => {
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
    const payload: { planId: string; payerEmail?: string } = { planId };
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

  validateUsage: async (opts: {
    prefaCompleta: boolean;
    compuesta: boolean;
    basicSearch?: boolean;
  }) => {
    try {
      const response = await api.post('/suscripciones/validar-uso', opts);
      return response.data;
    } catch (error: unknown) {
      const err = error as {
        response?: { status?: number; data?: { error?: string } };
        message?: string;
        code?: string;
      };

      // Manejar errores de red/CORS/502
      if (!err.response) {
        const networkError = err.message || 'Error de conexión con el servidor';
        console.error('[validateUsage] Error de red:', networkError, err);
        throw new Error(`Error de conexión: No se pudo validar el uso. ${networkError}`);
      }

      // Manejar errores 502/503/504 (servicio no disponible)
      if (
        err.response.status === 502 ||
        err.response.status === 503 ||
        err.response.status === 504
      ) {
        console.error('[validateUsage] Servicio no disponible:', err.response.status);
        throw new Error(
          'El servicio de validación no está disponible. Por favor, intenta nuevamente en unos momentos.'
        );
      }

      // Manejar errores 403 (sin créditos)
      if (err.response.status === 403) {
        const errorCode = err.response.data?.error || '';
        if (errorCode === 'limite_diario_superado') {
          throw new Error('Límite diario de créditos superado');
        }
        if (errorCode === 'limite_mensual_superado') {
          throw new Error('Límite mensual de créditos superado');
        }
        throw new Error('Sin créditos disponibles');
      }

      // Otros errores
      console.error('[validateUsage] Error inesperado:', err.response.status, err.response.data);
      throw error;
    }
  },
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
      { ...(options?.signal && { signal: options.signal }) }
    );

    // Si la respuesta fue cancelada, throw AbortError
    if (!response.ok && options?.signal?.aborted) {
      throw new DOMException('Request aborted', 'AbortError');
    }

    const data = await response.json();

    if (data.direccionesNormalizadas) {
      interface DireccionNormalizada {
        cod_partido?: string;
        nombre_partido?: string;
        direccion?: string;
        nombre_calle?: string;
        altura?: number | string;
        tipo?: string;
      }
      const direccionesCaba = (data.direccionesNormalizadas as DireccionNormalizada[]).filter(
        (dir) =>
          dir.cod_partido === 'caba' ||
          dir.nombre_partido === 'CABA' ||
          (dir.direccion && dir.direccion.includes('CABA'))
      );

      return direccionesCaba.map((dir) => {
        const altura = dir.altura?.toString();
        return {
          direccion: dir.direccion || '',
          nombre_calle: dir.nombre_calle || '',
          ...(altura && { altura }),
          tipo: dir.tipo || '',
        };
      });
    }
    return [];
  } catch (error: unknown) {
    // Re-throw AbortError para que pueda ser manejado correctamente
    const err = error as { name?: string };
    if (err.name === 'AbortError') {
      throw error;
    }
    return [];
  }
};

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const hasCompleteData = (informe: Informe): boolean => {
  return (
    informe.datosIncompletos === false &&
    Array.isArray(informe.datosFaltantes) &&
    informe.datosFaltantes.length === 0
  );
};

const hasRequiredFields = (informe: Informe): boolean => {
  if (!informe.googleMaps) {
    return false;
  }
  const hasDireccion =
    informe.direccion ||
    (informe.direccionesNormalizadas && informe.direccionesNormalizadas.length > 0);
  return Boolean(hasDireccion);
};

const hasDataContent = (informe: Informe): boolean => {
  const hasDatosCatastrales =
    informe.datosCatastrales && Object.keys(informe.datosCatastrales).length > 0;
  const hasDatosUtiles = informe.datosUtiles && Object.keys(informe.datosUtiles).length > 0;
  const hasGeometria =
    informe.geometria && informe.geometria.features && informe.geometria.features.length > 0;
  return hasDatosCatastrales || hasDatosUtiles || hasGeometria;
};

const isValidInformeResponse = (data: Informe | (Informe & { inProgress: boolean })): boolean => {
  if ('inProgress' in data && data.inProgress) {
    return true;
  }

  const informe = data as Informe;

  if (hasCompleteData(informe)) {
    return true;
  }

  if (!hasRequiredFields(informe)) {
    return false;
  }

  if (informe.datosIncompletos === true) {
    const datosFaltantes = informe.datosFaltantes || [];
    if (datosFaltantes.length > 0) {
      return false;
    }
  }

  return hasDataContent(informe);
};

const isServerError = (status?: number): boolean => {
  return status === 500 || status === 502 || status === 503 || status === 504;
};

const isNetworkError = (message?: string): boolean => {
  if (!message) return false;
  return (
    message.includes('timeout') ||
    message.includes('Network Error') ||
    message.includes('ECONNREFUSED')
  );
};

const shouldRetryError = (err: unknown, attempt: number = 1): boolean => {
  const error = err as { response?: { status?: number }; code?: string; message?: string };
  const status = error.response?.status;

  if (status === 401 || status === 403) {
    return false;
  }

  if (error.code === 'PREFA_IN_PROGRESS') {
    return false;
  }

  if (status === 429 && attempt > 1) {
    return true;
  }

  if (isServerError(status)) {
    return true;
  }

  if (isNetworkError(error.message)) {
    return true;
  }

  if (!error.response) {
    return true;
  }

  return false;
};

const executeConsultaRequest = async (
  direccion: string,
  coordenadas: { lat: number; lon: number },
  opts: {
    prefaCompleta: boolean;
    compuesta: boolean;
    basicSearch?: boolean;
    skipCredits?: boolean;
  }
): Promise<Informe> => {
  const response = await api.post<Informe>(
    '/prefactibilidad/consultar',
    {
      direccion,
      coordenadas,
      ...opts,
    },
    { timeout: 60000 }
  );
  return response.data;
};

const handleConsultaError = (err: unknown): (Informe & { inProgress: boolean }) | null => {
  const error = err as { code?: string };
  if (error.code === 'PREFA_IN_PROGRESS') {
    return { inProgress: true } as Informe & { inProgress: boolean };
  }
  return null;
};

const processConsultaResponse = (
  data: Informe,
  attempt: number,
  maxRetries: number
): { shouldReturn: boolean; shouldRetry: boolean; data: Informe } => {
  if (isValidInformeResponse(data)) {
    return { shouldReturn: true, shouldRetry: false, data };
  }

  if (attempt < maxRetries) {
    return { shouldReturn: false, shouldRetry: true, data };
  }

  return { shouldReturn: true, shouldRetry: false, data };
};

const handleRetryError = async (
  err: unknown,
  attempt: number,
  maxRetries: number
): Promise<(Informe & { inProgress: boolean }) | null> => {
  const inProgressResult = handleConsultaError(err);
  if (inProgressResult) {
    return inProgressResult;
  }

  if (!shouldRetryError(err, attempt) || attempt >= maxRetries) {
    throw err;
  }

  console.warn(`[Retry ${attempt}/${maxRetries}] Error en consulta, reintentando...`, err);
  const error = err as { response?: { status?: number } };
  const waitTime = error.response?.status === 429 ? 2000 * attempt : 1000 * attempt;
  await sleep(waitTime);
  return null;
};

const retryConsulta = async (
  direccion: string,
  coordenadas: { lat: number; lon: number },
  opts: {
    prefaCompleta: boolean;
    compuesta: boolean;
    basicSearch?: boolean;
    skipCredits?: boolean;
  },
  maxRetries: number
): Promise<Informe | (Informe & { inProgress: boolean })> => {
  const lastErrorRef: { value: unknown } = { value: undefined };

  for (const attempt of Array.from({ length: maxRetries }, (_, i) => i + 1)) {
    try {
      const requestOpts = {
        ...opts,
        skipCredits: attempt > 1 || Boolean(opts.skipCredits),
      };
      const data = await executeConsultaRequest(direccion, coordenadas, requestOpts);
      const result = processConsultaResponse(data, attempt, maxRetries);

      if (result.shouldReturn) {
        return result.data;
      }

      if (result.shouldRetry) {
        console.warn(
          `[Retry ${attempt}/${maxRetries}] Respuesta sin datos válidos, reintentando...`
        );
        await sleep(2000 * attempt);
        continue;
      }
    } catch (err: unknown) {
      lastErrorRef.value = err;
      const inProgressResult = await handleRetryError(err, attempt, maxRetries);
      if (inProgressResult) {
        return inProgressResult;
      }
    }
  }

  throw lastErrorRef.value;
};

export const prefactibilidad = {
  consultarDireccion: async (
    direccion: string,
    opts: {
      prefaCompleta: boolean;
      compuesta: boolean;
      basicSearch?: boolean;
      skipCredits?: boolean;
    }
  ): Promise<Informe | (Informe & { inProgress: boolean })> => {
    if (!opts.skipCredits) {
      const usageOpts: { prefaCompleta: boolean; compuesta: boolean; basicSearch?: boolean } = {
        prefaCompleta: opts.prefaCompleta,
        compuesta: opts.compuesta,
      };
      if (opts.basicSearch !== undefined) {
        usageOpts.basicSearch = opts.basicSearch;
      }
      await subscriptions.validateUsage(usageOpts);
    }

    const coordenadas = await obtenerCoordenadas(direccion);
    return retryConsulta(direccion, coordenadas, opts, 3);
  },

  consultarDireccionesCompuestas: async (
    direcciones: string[],
    opts: {
      prefaCompleta: boolean;
    }
  ): Promise<Informe[]> => {
    const direccionesConCoordenadas = await Promise.all(
      direcciones.map(async (direccion) => {
        const coordenadas = await obtenerCoordenadas(direccion);
        return { direccion, coordenadas };
      })
    );

    const timeout = direcciones.length === 2 ? 120000 : direcciones.length === 3 ? 180000 : 120000;

    const response = await api.post<Informe[]>(
      '/prefactibilidad/consultar-compuestas',
      {
        direcciones: direccionesConCoordenadas,
        prefaCompleta: opts.prefaCompleta,
      },
      { timeout }
    );
    return response.data;
  },

  generarInforme: async (datos: Informe) => {
    const response = await api.post(
      '/prefactibilidad/generar-informe',
      { datos },
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },

  aceptarInforme: async (datos: Informe) => {
    const response = await api.post<{ success: boolean; message: string; informe: Informe }>(
      '/prefactibilidad/guardar-informe',
      { datos }
    );
    return response.data;
  },

  generarPdf: async (id: string) => {
    const response = await api.post<{ success: boolean; message: string; informe: Informe }>(
      `/prefactibilidad/generar-pdf/${id}`
    );
    return response.data;
  },

  descargarPDF: async (id: string) => {
    const response = await api.get(`/prefactibilidad/descargar/${id}`, { responseType: 'blob' });
    return response.data;
  },

  existeInforme: async (smp: string, tipoPrefa: string) => {
    const params = new URLSearchParams({ smp, tipoPrefa });
    const response = await api.get<{ exists: boolean }>(
      `/prefactibilidad/existe-informe?${params.toString()}`
    );
    return response.data;
  },

  obtenerInformes: async (page: number = 1, search: string = '', limit: number = 10) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (search) params.append('search', search);
    const response = await api.get<{
      informes: Informe[];
      totalPages: number;
      currentPage: number;
      total: number;
    }>(`/prefactibilidad/mis-informes?${params.toString()}`);
    return response.data;
  },

  obtenerSugerenciasDirecciones,

  calcular: async (parcela: unknown, options?: { signal?: AbortSignal }) => {
    const { data } = await api.post('/prefactibilidad/calcular', { parcela }, options);
    return data;
  },

  validar: async (direccion: string, coordenadas: { lat: number; lon: number }) => {
    const { data } = await api.post<{ tieneAPH: boolean; tieneEnrase: boolean }>(
      '/prefactibilidad/validar',
      { direccion, coordenadas },
      { timeout: 30000 }
    );
    return data;
  },

  consultarPorSMP: async (
    smp: string,
    opts: { prefaCompleta: boolean; compuesta: boolean; basicSearch?: boolean }
  ): Promise<Informe | (Informe & { inProgress: boolean })> => {
    try {
      const usageOpts: { prefaCompleta: boolean; compuesta: boolean; basicSearch?: boolean } = {
        prefaCompleta: opts.prefaCompleta,
        compuesta: opts.compuesta,
      };
      if (opts.basicSearch !== undefined) {
        usageOpts.basicSearch = opts.basicSearch;
      }
      await subscriptions.validateUsage(usageOpts);
      const cleaned = smp.trim();
      const response = await api.get<Informe>(
        `/prefactibilidad/consultar-smp/${encodeURIComponent(cleaned)}`
      );
      return response.data;
    } catch (err: unknown) {
      const error = err as { code?: string };
      if (error.code === 'PREFA_IN_PROGRESS')
        return { inProgress: true } as Informe & { inProgress: boolean };
      throw err;
    }
  },

  obtenerInforme: async (id: string) => {
    const response = await api.get<Informe>(`/prefactibilidad/${id}`);
    return response.data;
  },

  generarTokenCompartir: async (id: string) => {
    const response = await api.post<{ shareToken: string }>(
      `/prefactibilidad/generar-token-compartir/${id}`
    );
    return response.data;
  },

  obtenerInformeCompartido: async (token: string) => {
    const response = await api.get<Informe>(`/prefactibilidad/compartir/${token}`);
    return response.data;
  },
};

export const support = {
  sendTicket: async ({
    subject,
    description,
    images,
  }: {
    subject: string;
    description: string;
    images: File[];
  }) => {
    const formData = new FormData();
    formData.append('asunto', subject);
    formData.append('descripcion', description);
    images.forEach((img) => formData.append('images', img));
    const response = await api.post('/support/ticket', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export interface RedSocial {
  _id: string;
  nombre: string;
  logo: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok' | 'whatsapp';
  url: string;
}

export const redesSociales = {
  obtenerRedesActivas: async (): Promise<RedSocial[]> => {
    const response = await api.get<RedSocial[]>('/redes-sociales/public');
    return response.data;
  },
};

export default api;

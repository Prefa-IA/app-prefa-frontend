import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { getBillingInfo, saveBillingInfo } from '../../services/billing';
import { BillingInfo } from '../../types/billing';
import { BillingFormProps } from '../../types/components';
import { PAISES, PROVINCIAS } from '../../types/constants';
import { validateBillingInfo } from '../../utils/billing-utils';

const empty: BillingInfo = {
  nombreCompleto: '',
  condicionIVA: 'Consumidor Final',
  cuit: '',
  calle: '',
  altura: '',
  localidad: '',
  provincia: '',
  codigoPostal: '',
  pais: 'Argentina',
};

const BillingForm: React.FC<BillingFormProps> = ({ onSuccess }) => {
  const { usuario } = require('../../contexts/AuthContext').useAuth();
  const [form, setForm] = useState<BillingInfo>({
    ...empty,
    nombreCompleto: usuario?.nombre || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    void getBillingInfo()
      .then((b) => {
        if (b) {
          setForm((prev) => ({ ...prev, ...b }));
        }
      })
      .catch((error) => {
        console.error('Error al cargar datos de facturación:', error);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }) as BillingInfo);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validateBillingInfo(form);
    if (v) {
      setError(v);
      toast.error(v);
      return;
    }
    setLoading(true);
    const ok = await saveBillingInfo(form);
    setLoading(false);
    if (ok) {
      toast.success('Datos de facturación guardados');
      try {
        localStorage.setItem('billingInfo', JSON.stringify(form));
      } catch {}
      try {
        window.dispatchEvent(new CustomEvent('billingInfoUpdated', { detail: form }));
      } catch {}
      onSuccess ? onSuccess() : navigate('/perfil');
    } else {
      const msg = 'No se pudo guardar los datos de facturación';
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-10">
      <div className="sr-only" aria-live="polite">
        {error || ''}
      </div>
      <form
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
        className="space-y-4"
      >
        <div>
          <label htmlFor="nombreCompleto" className="block text-sm font-medium mb-1">
            Nombre y apellido completos
          </label>
          <input
            id="nombreCompleto"
            name="nombreCompleto"
            placeholder="Juan Pérez"
            value={form.nombreCompleto}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label htmlFor="condicionIVA" className="block text-sm font-medium mb-1">
            Condición fiscal
          </label>
          <select
            id="condicionIVA"
            name="condicionIVA"
            value={form.condicionIVA}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {[
              'Responsable Inscripto',
              'Responsable No Inscripto',
              'No Responsable',
              'Sujeto Exento',
              'Consumidor Final',
              'Monotributista',
              'Sujeto no categorizado',
              'Proveedor Extranjero',
              'Consumidor Extranjero',
              'IVA Liberado – Ley Nº 19.640',
              'IVA Responsable Inscripto – Agente de Percepción',
              'Pequeño Contribuyente Eventual',
              'Monotributista Social',
              'Pequeño Contribuyente Eventual Social',
            ].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cuit" className="block text-sm font-medium mb-1">
            CUIT/CUIL
          </label>
          <input
            id="cuit"
            name="cuit"
            placeholder="10123456789"
            value={form.cuit}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="calle" className="block text-sm font-medium mb-1">
              Calle
            </label>
            <input
              id="calle"
              name="calle"
              placeholder="9 de julio"
              value={form.calle}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label htmlFor="altura" className="block text-sm font-medium mb-1">
              Altura
            </label>
            <input
              id="altura"
              name="altura"
              placeholder="1234"
              value={form.altura}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label htmlFor="localidad" className="block text-sm font-medium mb-1">
              Localidad
            </label>
            <input
              id="localidad"
              name="localidad"
              placeholder="Villa Allende"
              value={form.localidad}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="provincia" className="block text-sm font-medium mb-1">
              Provincia
            </label>
            <select
              id="provincia"
              name="provincia"
              value={form.provincia}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="" disabled>
                Seleccionar provincia
              </option>
              {PROVINCIAS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="codigoPostal" className="block text-sm font-medium mb-1">
              Código postal
            </label>
            <input
              id="codigoPostal"
              name="codigoPostal"
              placeholder="1657"
              value={form.codigoPostal}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label htmlFor="pais" className="block text-sm font-medium mb-1">
              País
            </label>
            <select
              id="pais"
              name="pais"
              value={form.pais}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {PAISES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button disabled={loading} className="btn-primary w-full">
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
    </div>
  );
};

export default BillingForm;

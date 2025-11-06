import React, { useState, useEffect } from 'react';
import { BillingInfo } from '../../types/billing';
import { getBillingInfo, saveBillingInfo } from '../../services/billing';
import { useNavigate } from 'react-router-dom';

interface Props { onSuccess?: () => void }

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

const PROVINCIAS = [
  'Buenos Aires',
  'Ciudad Autónoma de Buenos Aires',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
];

const PAISES = ['Argentina'];

const BillingForm: React.FC<Props> = ({ onSuccess }) => {
  const { usuario } = require('../../contexts/AuthContext').useAuth();
  const [form, setForm] = useState<BillingInfo>({ ...empty, nombreCompleto: usuario?.nombre || '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getBillingInfo().then((b) => {
      if (b) {
        setForm((prev) => ({ ...prev, ...b }));
      }
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value } as BillingInfo));
  };

  const validate = () => {
    for (const key of ['nombreCompleto','condicionIVA','cuit','calle','altura','localidad','provincia','codigoPostal','pais']) {
      // @ts-ignore
      if (!form[key]) return 'Completa todos los campos';
    }
    if (!/^[0-9]{11}$/.test(form.cuit)) return 'CUIT inválido';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('DEBUG-form', form); 
    const v = validate();
    if (v) { setError(v); return; }
    setLoading(true);
    const ok = await saveBillingInfo(form);
    setLoading(false);
    if (ok) {
      onSuccess ? onSuccess() : navigate('/perfil');
    } else {
      setError('No se pudo guardar');
    }
  };

  return (
    <div className="max-w-lg mx-auto py-10">
      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre y apellido completos</label>
          <input name="nombreCompleto" placeholder="Juan Pérez" value={form.nombreCompleto} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Condición fiscal</label>
          <select name="condicionIVA" value={form.condicionIVA} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
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
            ].map(opt=> <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">CUIT/CUIL</label>
          <input name="cuit" placeholder="10123456789" value={form.cuit} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Calle</label>
            <input name="calle" placeholder="9 de julio" value={form.calle} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Altura</label>
            <input name="altura" placeholder="1234" value={form.altura} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Localidad</label>
            <input name="localidad" placeholder="Villa Allende" value={form.localidad} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Provincia</label>
            <select name="provincia" value={form.provincia} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <option value="" disabled>Seleccionar provincia</option>
              {PROVINCIAS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Código postal</label>
            <input name="codigoPostal" placeholder="1657" value={form.codigoPostal} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">País</label>
            <select name="pais" value={form.pais} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              {PAISES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <button disabled={loading} className="btn-primary w-full">{loading ? 'Guardando...' : 'Guardar'}</button>
      </form>
    </div>
  );
};

export default BillingForm;

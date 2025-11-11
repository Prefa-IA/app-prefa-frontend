import React, { useEffect, useState } from 'react';
import { adminPlansService, OveragePlanPayload } from '../../services/adminPlansService';
import ModalBase from '../generales/ModalBase';
import { toast } from 'react-toastify';
import { OverageFormProps } from '../../types/components';

const OveragesAdmin: React.FC = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [modalData, setModalData] = useState<OveragePlanPayload | null>(null);

  const load = async () => {
    try { setPlans(await adminPlansService.list()); } catch { toast.error('Error cargando planes'); }
  };
  useEffect(() => { load(); }, []);

  const handleSave = async (data: OveragePlanPayload) => {
    try {
      if (data.id) await adminPlansService.update(data.id, data);
      else await adminPlansService.create(data);
      toast.success('Guardado');
      setModalData(null);
      load();
    } catch { toast.error('Error guardando'); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar paquete?')) return;
    try { await adminPlansService.remove(id); toast.success('Eliminado'); load(); } catch { toast.error('Error eliminando'); }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Paquetes Overages</h1>
        <button className="btn-primary" onClick={() => setModalData({ name: '', creditosTotales: 0, price: 0 })}>Nuevo paquete</button>
      </div>
      <table className="w-full text-sm">
        <thead><tr><th>Nombre</th><th>Créditos</th><th>Precio</th><th></th></tr></thead>
        <tbody>
          {plans.map((p) => (
            <tr key={p._id} className="border-t border-gray-700">
              <td>{p.name}</td><td>{p.creditosTotales}</td><td>${p.price}</td>
              <td className="flex gap-2 py-2">
                <button className="btn-secondary" onClick={() => setModalData({ id: p._id, name: p.name, creditosTotales: p.creditosTotales, price: p.price })}>Editar</button>
                <button className="btn-danger" onClick={() => handleDelete(p._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalData && <OverageForm data={modalData} onSave={handleSave} onClose={() => setModalData(null)} />}
    </div>
  );
};

const OverageForm: React.FC<OverageFormProps> = ({ data, onSave, onClose }) => {
  const [form, setForm] = useState(data);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });
  return (
    <ModalBase title={`${form.id ? 'Editar' : 'Nuevo'} paquete`} onClose={onClose} hideConfirm>
      <div className="space-y-4">
        <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} className="input-text w-full" />
        <input name="creditosTotales" type="number" placeholder="Créditos" value={form.creditosTotales} onChange={handleChange} className="input-text w-full" />
        <input name="price" type="number" placeholder="Precio" value={form.price} onChange={handleChange} className="input-text w-full" />
        <div className="text-center"><button className="btn-primary" onClick={() => onSave(form)}>Guardar</button></div>
      </div>
    </ModalBase>
  );
};

export default OveragesAdmin;

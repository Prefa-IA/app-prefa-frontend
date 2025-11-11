import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { auth as authService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { EyeIcon, CreditCardIcon, ChatAlt2Icon } from '@heroicons/react/outline';
import { useLocation, useNavigate } from 'react-router-dom';
import ProfileCard from '../perfil/ProfileCard';
import PersonalizationSection from '../perfil/PersonalizationSection';
import ActionCard from '../perfil/ActionCard';
import ReportPreviewModal from '../perfil/ReportPreviewModal';
import SupportTicketModal from '../perfil/SupportTicketModal';
import ConfirmModal from '../generales/ConfirmModal';
import ModalBase from '../generales/ModalBase';
import BillingForm from '../perfil/BillingForm';
import { getBillingInfo } from '../../services/billing';
import { BillingModalProps, BillingSectionProps } from '../../types/components';
import { validateLogo } from '../../utils/logoValidationUtils';

const PerfilUsuario: React.FC = () => {
  const { usuario, updateProfile, updatePersonalization, saveTempLogo, getTempLogo, clearTempLogo } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const billingToastRef = useRef(false);
  const [editMode, setEditMode] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [personalizacion, setPersonalizacion] = useState({
    fondoEncabezadosPrincipales: usuario?.personalizacion?.fondoEncabezadosPrincipales || '#3B82F6',
    colorTextoTablasPrincipales: usuario?.personalizacion?.colorTextoTablasPrincipales || '#FFFFFF',
    fondoEncabezadosSecundarios: usuario?.personalizacion?.fondoEncabezadosSecundarios || '#6B7280',
    colorTextoTablasSecundarias: usuario?.personalizacion?.colorTextoTablasSecundarias || '#FFFFFF',
    tipografia: usuario?.personalizacion?.tipografia || 'Inter'
  });
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string>('');
  const [showSupport, setShowSupport] = useState(false);
  const [confirmLogo,setConfirmLogo]=useState(false);
  const [confirmLogoMessage, setConfirmLogoMessage] = useState<React.ReactNode>('');
  const [confirmUpload, setConfirmUpload] = useState(false);
  const [pendingLogoFile, setPendingLogoFile] = useState<File | null>(null);
  const [previewSrc,setPreviewSrc]=useState<string|null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (usuario?.personalizacion) {
      setPersonalizacion({
        fondoEncabezadosPrincipales: usuario.personalizacion.fondoEncabezadosPrincipales || '#3B82F6',
        colorTextoTablasPrincipales: usuario.personalizacion.colorTextoTablasPrincipales || '#FFFFFF',
        fondoEncabezadosSecundarios: usuario.personalizacion.fondoEncabezadosSecundarios || '#6B7280',
        colorTextoTablasSecundarias: usuario.personalizacion.colorTextoTablasSecundarias || '#FFFFFF',
        tipografia: usuario.personalizacion.tipografia || 'Inter'
      });
    }
    
    const logoPersonalizado = getTempLogo();
    if (logoPersonalizado) {
      setLogoUrl(logoPersonalizado);
    }

    const params = new URLSearchParams(location.search);
    if (params.get('subscription') === '1') {
      navigate('/suscripciones');
    }
    if (params.get('billing') === '1' && !billingToastRef.current) {
      billingToastRef.current = true;
      toast.info('Completá tus datos de facturación para poder comprar un plan');
      setShowModal(true);
    }
  }, [usuario, location, navigate]);

  if (!usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { restantes } = await authService.getLogoRemaining();
      if (restantes <= 0) {
        toast.error('Ya alcanzaste el límite de cambios de logo este mes');
        return;
      }
      setPendingLogoFile(file);
      const url=URL.createObjectURL(file);
      setPreviewSrc(url);
      setConfirmLogoMessage(<div className="space-y-4 text-center"><p>Subirás un nuevo logo. Cambios mensuales disponibles: {restantes}.</p><img src={url} alt="Preview logo" className="mx-auto max-h-32"/><p>Este logo se usará como marca de agua en tus informes si tu plan incluye marca de agua organizacional.</p></div>);
      setConfirmUpload(true);
    } catch (error) {
      console.error('Error obteniendo cambios restantes:', error);
      toast.error('No se pudo verificar el límite de cambios');
    }
  };

  const handleLogoUploadConfirm = async () => {
    if (!pendingLogoFile) { setConfirmUpload(false); return; }
    try {
      const base64Logo = await saveTempLogo(pendingLogoFile);
      setLogoFile(pendingLogoFile);
      setLogoUrl(base64Logo);
    } catch (error) {
      console.error('Error al guardar logo:', error);
      toast.error('Error al procesar el logo');
    } finally {
      if(previewSrc){URL.revokeObjectURL(previewSrc);setPreviewSrc(null);}
      setPendingLogoFile(null);
      setConfirmUpload(false);
    }
  };

  const cancelUpload=()=>{if(previewSrc){URL.revokeObjectURL(previewSrc);setPreviewSrc(null);}setConfirmUpload(false);};

  const handlePersonalizacionChange = (field: string, value: string) => {
    setPersonalizacion(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSavePersonalization = async () => {
    setLoading(true);
    try {
      const personalizacionCompleta = {
        ...personalizacion,
        logo: logoUrl || usuario?.personalizacion?.logo
      };
      await updatePersonalization(personalizacionCompleta);
      setEditMode(false);
    } catch (error) {
      console.error('Error al guardar personalización:', error);
    }
    setLoading(false);
  };

  const handlePreviewClick = () => {
    setShowPreview(true);
  };

  const handleSubscriptionClick = () => {
    navigate('/suscripcion');
  };

  const handleSupportClick = () => setShowSupport(true);


  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoError('');
    setLoading(true);

    try {
      const validation = await validateLogo(file);
      
      if (!validation.isValid) {
        setLogoError(validation.error || 'Error validando la imagen');
        setLoading(false);
        return;
      }

      const base64Logo = await saveTempLogo(file);
      setLogoUrl(base64Logo);
      
    } catch (error) {
      console.error('Error procesando logo:', error);
      setLogoError('Error procesando la imagen');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!usuario) return;
    
    setLoading(true);
    try {
      await updateProfile({
        nombre: usuario.nombre,
        email: usuario.email
      });
      
      alert('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      alert('Error actualizando el perfil');
    }
    setLoading(false);
  };

  const handleSelectPlan = async (planId: string) => {
    setLoading(true);
    setSelectedPlan(planId);
    
    try {
      const { subscriptions } = await import('../../services/api');
      const preference = await subscriptions.createSubscription(planId);
      
      const url = preference?.init_point || preference?.sandbox_init_point;
      if (!url) {
        throw new Error('URL de pago no generada');
      }
      window.open(url, '_blank');
      
    } catch (error) {
      console.error('Error al procesar pago:', error);
      alert('Error al procesar el pago. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  const handleLogoDeleteClick = async () => {
    try {
      const { restantes } = await authService.getLogoRemaining();
      setConfirmLogoMessage(`¿Estás seguro de querer eliminar el logo? Recuerda que solo tienes ${restantes} cambios disponibles este mes`);
    } catch {
      setConfirmLogoMessage('¿Estás seguro de querer eliminar el logo?');
    }
    setConfirmLogo(true);
  };

  const handleLogoDeleteConfirm = async () => {
    try {
      await clearTempLogo();
      setLogoUrl(null);
    } catch (e: any) {
      console.error('Error eliminando logo en backend', e);
      const mensaje = e.response?.data?.error || 'No se pudo eliminar el logo';
      toast.error(mensaje);
    } finally {
      setConfirmLogo(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8" data-tutorial="mi-perfil">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Perfil de Usuario</h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Administra la información y apariencia de tu cuenta</p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Información Básica + Facturación */}
            <div className="lg:col-span-1 space-y-6">
              <ProfileCard 
                logoUrl={logoUrl}
                onLogoUpload={handleLogoUpload}
                onLogoDelete={logoUrl ? handleLogoDeleteClick : undefined}
              />
              <BillingSection />
            </div>

            {/* Personalización */}
            <div className="lg:col-span-2">
              <PersonalizationSection 
                editMode={editMode}
                personalizacion={personalizacion}
                onPersonalizacionChange={handlePersonalizacionChange}
                onToggleEdit={() => setEditMode(!editMode)}
                onSave={handleSavePersonalization}
              />
            </div>

          </div>

          {/* Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ActionCard
              icon={<EyeIcon className="w-6 h-6" />}
              title="Previsualizar Informes"
              description="Ver previsualización"
              onClick={handlePreviewClick}
            />
            <ActionCard
              icon={<CreditCardIcon className="w-6 h-6" />}
              title="Gestionar Suscripción"
              description="Administrar mi plan"
              onClick={handleSubscriptionClick}
            />
            <ActionCard
              icon={<ChatAlt2Icon className="w-6 h-6" />}
              title="Soporte"
              description="Contactar a soporte"
              onClick={handleSupportClick}
            />
          </div>

        </div>
      </div>

      {/* Modals */}
      {showPreview && (
        <ReportPreviewModal 
          onClose={() => setShowPreview(false)}
          personalizacion={personalizacion}
          nombreInmobiliaria={usuario.nombre}
        />
      )}
        {/* Modal de suscripción eliminado; ahora se gestiona en la página /suscripciones */}
      {showSupport && (
        <SupportTicketModal onClose={() => setShowSupport(false)} />
      )}
      {confirmLogo && (
        <ConfirmModal 
          message={confirmLogoMessage}
          onCancel={()=>setConfirmLogo(false)}
          onConfirm={handleLogoDeleteConfirm}
        />
      )}
      {confirmUpload && (
        <ConfirmModal
          message={confirmLogoMessage}
          onCancel={cancelUpload}
          onConfirm={handleLogoUploadConfirm}
        />
      )}
      {showModal && (
        <BillingModal existing={null} onClose={() => { setShowModal(false); }} />
      )}
    </div>
  );
};

export const BillingModal: React.FC<BillingModalProps> = ({ existing, onClose }) => (
  <ModalBase title={existing && existing.cuit ? 'Modificar datos de facturación' : 'Agregar datos de facturación'} onClose={onClose} hideConfirm>
    <BillingForm onSuccess={onClose} />
  </ModalBase>
);

export const BillingSection: React.FC<BillingSectionProps> = () => {
  const [info, setInfo] = React.useState<any | null>(null);
  const [showModal, setShowModal] = React.useState(false);
  const cacheRef = React.useRef<any | null>(null);

  React.useEffect(() => {
    try {
      if (!cacheRef.current) {
        const raw = localStorage.getItem('billingInfo');
        if (raw) {
          cacheRef.current = JSON.parse(raw);
        }
      }
    } catch {}

    if (cacheRef.current) setInfo(cacheRef.current);

    getBillingInfo().then((data) => {
      setInfo(data);
      cacheRef.current = data;
      try { localStorage.setItem('billingInfo', JSON.stringify(data || {})); } catch {}
    });
  }, []);

  React.useEffect(() => {
    const handler = (e: any) => {
      const data = e.detail;
      setInfo(data);
      cacheRef.current = data;
    };
    window.addEventListener('billingInfoUpdated', handler);
    return () => window.removeEventListener('billingInfoUpdated', handler);
  }, []);

  return (
    <>
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex flex-col items-center justify-center text-center flex-1">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Datos de facturación</h3>
      <div className="w-full min-h-[96px] flex items-center justify-center">
        {info && info.cuit ? (
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p><strong>Razón Social:</strong> {info.razonSocial}</p>
            <p><strong>CUIT:</strong> {info.cuit}</p>
            <p><strong>Condición IVA:</strong> {info.condicionIVA}</p>
          </div>
        ) : cacheRef.current === null ? (
          <div className="w-full space-y-2 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto" />
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">Aún no cargaste tus datos de facturación.</p>
        )}
      </div>
      <button onClick={() => setShowModal(true)} className="btn-primary mt-4">{info && info.cuit ? 'Ver mis datos de facturación' : 'Agregar'}</button>
    </div>

    {showModal && (
      <BillingModal
        existing={info}
        onClose={() => {
          setShowModal(false);
          getBillingInfo().then((data)=>{
            setInfo(data);
            cacheRef.current = data;
            try { localStorage.setItem('billingInfo', JSON.stringify(data || {})); } catch {}
          });
        }}
      />
    )}
    </>
  );
};

export default PerfilUsuario; 
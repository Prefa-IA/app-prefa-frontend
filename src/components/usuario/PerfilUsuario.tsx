import React, { useState, useEffect } from 'react';
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

const PerfilUsuario: React.FC = () => {
  const { usuario, updateProfile, updatePersonalization, saveTempLogo, getTempLogo, clearTempLogo } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
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
    
    // Cargar logo desde personalización
    const logoPersonalizado = getTempLogo();
    if (logoPersonalizado) {
      setLogoUrl(logoPersonalizado);
    }

    // Abrir modal de planes si viene marcado en la URL
    const params = new URLSearchParams(location.search);
    if (params.get('subscription') === '1') {
      navigate('/suscripciones');
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
      // Preservar el logo existente al guardar la personalización
      const personalizacionCompleta = {
        ...personalizacion,
        logo: logoUrl || usuario?.personalizacion?.logo // Usar nuevo logo si existe
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
    navigate('/suscripciones');
  };

  const handleSupportClick = () => setShowSupport(true);

  const validateLogo = (file: File): Promise<{ isValid: boolean; error?: string; dimensions?: { width: number; height: number } }> => {
    return new Promise((resolve) => {
      // Validar tamaño del archivo (2MB máximo)
      const maxSize = 2 * 1024 * 1024; // 2MB en bytes
      if (file.size > maxSize) {
        resolve({ isValid: false, error: 'El archivo debe ser menor a 2MB' });
        return;
      }

      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        resolve({ isValid: false, error: 'El archivo debe ser una imagen' });
        return;
      }

      // Validar dimensiones
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        
        if (img.width > 500 || img.height > 500) {
          resolve({ 
            isValid: false, 
            error: 'Las dimensiones máximas son 500px x 500px',
            dimensions: { width: img.width, height: img.height }
          });
        } else {
          resolve({ 
            isValid: true,
            dimensions: { width: img.width, height: img.height }
          });
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ isValid: false, error: 'No se pudo procesar la imagen' });
      };
      
      img.src = url;
    });
  };

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

      // Convertir a base64 y guardar temporalmente
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
      // Aquí integrarías con MercadoPago
      const { subscriptions } = await import('../../services/api');
      const preference = await subscriptions.createPaymentPreference(planId);
      
      // Redirigir a MercadoPago
      window.open(preference.init_point, '_blank');
      
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
      await clearTempLogo(); // clearTempLogo internamente actualiza la personalización
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Perfil de Usuario</h1>
            <p className="mt-2 text-lg text-gray-600">Administra la información y apariencia de tu cuenta</p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Información Básica */}
            <div className="lg:col-span-1">
              <ProfileCard 
                logoUrl={logoUrl}
                onLogoUpload={handleLogoUpload}
                onLogoDelete={logoUrl ? handleLogoDeleteClick : undefined}
              />
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
    </div>
  );
};

export default PerfilUsuario; 
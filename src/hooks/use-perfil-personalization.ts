import { useCallback, useEffect, useState } from 'react';

import { Usuario } from '../types/enums';

interface UsePerfilPersonalizationProps {
  usuario: Usuario | null;
  updatePersonalization: (personalization: Usuario['personalizacion']) => Promise<void>;
  logoUrl: string | null;
}

export const usePerfilPersonalization = ({
  usuario,
  updatePersonalization,
  logoUrl,
}: UsePerfilPersonalizationProps) => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [personalizacion, setPersonalizacion] = useState({
    fondoEncabezadosPrincipales: usuario?.personalizacion?.fondoEncabezadosPrincipales || '#3B82F6',
    colorTextoTablasPrincipales: usuario?.personalizacion?.colorTextoTablasPrincipales || '#FFFFFF',
    fondoEncabezadosSecundarios: usuario?.personalizacion?.fondoEncabezadosSecundarios || '#6B7280',
    colorTextoTablasSecundarias: usuario?.personalizacion?.colorTextoTablasSecundarias || '#FFFFFF',
    tipografia: usuario?.personalizacion?.tipografia || 'Inter',
  });

  useEffect(() => {
    if (usuario?.personalizacion) {
      setPersonalizacion({
        fondoEncabezadosPrincipales:
          usuario.personalizacion.fondoEncabezadosPrincipales || '#3B82F6',
        colorTextoTablasPrincipales:
          usuario.personalizacion.colorTextoTablasPrincipales || '#FFFFFF',
        fondoEncabezadosSecundarios:
          usuario.personalizacion.fondoEncabezadosSecundarios || '#6B7280',
        colorTextoTablasSecundarias:
          usuario.personalizacion.colorTextoTablasSecundarias || '#FFFFFF',
        tipografia: usuario.personalizacion.tipografia || 'Inter',
      });
    }
  }, [usuario]);

  const handlePersonalizacionChange = useCallback((field: string, value: string) => {
    setPersonalizacion((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleSavePersonalization = useCallback(async () => {
    setLoading(true);
    try {
      const logoValue = logoUrl || usuario?.personalizacion?.logo;
      const personalizacionCompleta = {
        ...personalizacion,
        ...(logoValue ? { logo: logoValue } : {}),
      };
      await updatePersonalization(personalizacionCompleta as Usuario['personalizacion']);
      setEditMode(false);
    } catch (error) {
      console.error('Error al guardar personalización:', error);
    }
    setLoading(false);
  }, [logoUrl, usuario, personalizacion, updatePersonalization]);

  return {
    editMode,
    setEditMode,
    personalizacion,
    loading,
    handlePersonalizacionChange,
    handleSavePersonalization,
  };
};

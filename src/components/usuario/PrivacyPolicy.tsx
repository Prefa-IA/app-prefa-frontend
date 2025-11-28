import React, { useEffect, useState } from 'react';

import api from '../../services/api';
import { PrivacyPolicyProps } from '../../types/components';
import ModalBase from '../generales/ModalBase';
import SafeHtml from '../generales/SafeHtml';

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onClose }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const { data } = await api.get('/legal-content/privacy');
        setContent(data?.content || '');
      } catch (error) {
        console.error('Error cargando política de privacidad:', error);
        setContent('<p>Error al cargar la política de privacidad.</p>');
      } finally {
        setLoading(false);
      }
    };
    void loadContent();
  }, []);

  return (
    <ModalBase title="Política de Privacidad" onClose={onClose} hideConfirm>
      <div className="prose max-w-none">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
          </div>
        ) : (
          <SafeHtml html={content} />
        )}
      </div>
    </ModalBase>
  );
};

export default PrivacyPolicy;

import React, { useEffect, useState } from 'react';

import api from '../../services/api';
import { PrivacyPolicyProps } from '../../types/components';
import ModalBase from '../generales/ModalBase';
import SafeHtml from '../generales/SafeHtml';

const PrivacyPolicyStyles: React.FC = () => (
  <style>{`
        .privacy-container {
          max-width: 800px;
          margin: 0 auto;
          background: transparent;
          padding: 0;
          border-radius: 0;
          box-shadow: none;
          color: #111827; /* gray-900 */
        }
        html.dark .privacy-container {
          background: transparent;
          color: #e5e7eb; /* gray-200 */
          box-shadow: none;
        }
        .privacy-container h1,
        .privacy-container h2 {
          color: #0c4a6e; /* primary-900 */
        }
        html.dark .privacy-container h1,
        html.dark .privacy-container h2 {
          color: #38bdf8; /* primary-400 */
        }
        .privacy-container h1 {
          border-bottom: 2px solid #3498db;
          padding-bottom: 10px;
          text-align: center;
        }
        .privacy-container h2 {
          margin-top: 20px;
          border-bottom: 1px solid #ecf0f1;
          padding-bottom: 5px;
        }
        .privacy-container p,
        .privacy-container li {
          text-align: justify;
        }
        .privacy-container ul {
          list-style-type: disc;
          padding-left: 20px;
        }
        .privacy-container a {
          color: #0284c7;
          text-decoration: none;
        }
        .privacy-container a:hover { text-decoration: underline; }
      `}</style>
);

const PrivacyPolicyContent: React.FC<{ content: string }> = ({ content }) => (
  <SafeHtml html={content} className="privacy-container" />
);

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
    <ModalBase title="Política de Privacidad" onClose={onClose}>
      <div className="prose max-w-none">
        <PrivacyPolicyStyles />
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
          </div>
        ) : (
          <PrivacyPolicyContent content={content} />
        )}
      </div>
    </ModalBase>
  );
};

export default PrivacyPolicy;

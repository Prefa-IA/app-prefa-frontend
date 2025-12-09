import React, { useEffect, useState } from 'react';

import api from '../../services/api';
import { TermsAndConditionsProps } from '../../types/components';
import ModalBase from '../generales/ModalBase';
import SafeHtml from '../generales/SafeHtml';

const TermsAndConditionsStyles: React.FC = () => (
  <style>{`
        .tyc-container {
          max-width: 800px;
          margin: 0 auto;
          background: transparent;
          padding: 0;
          border-radius: 0;
          box-shadow: none;
          color: #111827; /* gray-900 */
        }
        html.dark .tyc-container {
          background: transparent;
          color: #e5e7eb; /* gray-200 */
          box-shadow: none;
        }
        .tyc-container h1,
        .tyc-container h2 {
          color: #0c4a6e; /* primary-900 */
        }
        html.dark .tyc-container h1,
        html.dark .tyc-container h2 {
          color: #38bdf8; /* primary-400 */
        }
        .tyc-container h1 {
          border-bottom: 2px solid #3498db;
          padding-bottom: 10px;
          text-align: center;
        }
        .tyc-container h2 {
          margin-top: 20px;
          border-bottom: 1px solid #ecf0f1;
          padding-bottom: 5px;
        }
        .tyc-container p,
        .tyc-container li {
          text-align: justify;
        }
        .tyc-container ul {
          list-style-type: disc;
          padding-left: 20px;
        }
        .tyc-container a {
          color: #0284c7;
          text-decoration: none;
        }
        .tyc-container a:hover { text-decoration: underline; }
      `}</style>
);

const TermsAndConditionsContent: React.FC<{ content: string }> = ({ content }) => (
  <SafeHtml html={content} className="tyc-container" />
);

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ onClose }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const { data } = await api.get('/legal-content/terms');
        setContent(data?.content || '');
      } catch (error) {
        console.error('Error cargando términos y condiciones:', error);
        setContent('<p>Error al cargar los términos y condiciones.</p>');
      } finally {
        setLoading(false);
      }
    };
    void loadContent();
  }, []);

  return (
    <ModalBase title="Términos y Condiciones" onClose={onClose}>
      <div className="prose max-w-none">
        <TermsAndConditionsStyles />
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
          </div>
        ) : (
          <TermsAndConditionsContent content={content} />
        )}
      </div>
    </ModalBase>
  );
};

export default TermsAndConditions;

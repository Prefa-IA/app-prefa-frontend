import React, { useEffect, useState } from 'react';
import {
  BriefcaseIcon,
  ChatIcon,
  CodeIcon,
  PencilIcon,
  ShoppingCartIcon,
  SupportIcon,
} from '@heroicons/react/outline';

import { Career, careers } from '../services/api';

import SEO from './SEO';

const CareerIcon: React.FC<{ tipo: Career['tipo'] }> = ({ tipo }) => {
  const iconClass = 'w-12 h-12 text-primary-600 dark:text-primary-400';
  
  switch (tipo) {
    case 'developer':
      return <CodeIcon className={iconClass} />;
    case 'marketing':
      return <ShoppingCartIcon className={iconClass} />;
    case 'design':
      return <PencilIcon className={iconClass} />;
    case 'sales':
      return <ChatIcon className={iconClass} />;
    case 'support':
      return <SupportIcon className={iconClass} />;
    default:
      return <BriefcaseIcon className={iconClass} />;
  }
};

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

const CareerCard: React.FC<{ career: Career }> = ({ career }) => {
  const MAX_DESCRIPTION_LENGTH = 120;
  const truncatedDescription = career.descripcion
    ? truncateText(career.descripcion, MAX_DESCRIPTION_LENGTH)
    : '';

  return (
    <a
      href={career.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300 flex flex-col h-full overflow-hidden"
    >
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center justify-center w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
            <CareerIcon tipo={career.tipo} />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors underline decoration-2 underline-offset-2">
          {career.titulo}
        </h3>
        {truncatedDescription && (
          <p className="text-gray-600 dark:text-gray-400 flex-grow mb-4 text-sm leading-relaxed">
            {truncatedDescription}
          </p>
        )}
      </div>
      <div className="mt-auto px-6 py-4 bg-primary-50 dark:bg-primary-900/20 border-t border-gray-200 dark:border-gray-700 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
        <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm flex items-center gap-2">
          Ver más
          <svg
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </div>
    </a>
  );
};

const EmptyState: React.FC = () => (
  <div className="text-center py-16">
    <BriefcaseIcon className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
      No hay postulaciones disponibles
    </h3>
    <p className="text-gray-600 dark:text-gray-400">
      En este momento no tenemos oportunidades abiertas. Vuelve pronto para ver nuevas posiciones.
    </p>
  </div>
);

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando postulaciones...</p>
    </div>
  </div>
);

const CareersPage: React.FC = () => {
  const [careersList, setCareersList] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const data = await careers.obtenerCareersActivas();
        setCareersList(data || []);
      } catch (error) {
        console.error('Error al cargar postulaciones:', error);
        setCareersList([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchCareers();
  }, []);

  return (
    <>
      <SEO
        title="Trabajá con Nosotros - Prefa-IA"
        description="Únete a nuestro equipo y forma parte del futuro de la prefactibilidad urbanística"
        url="/career"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="w-[95%] lg:w-[63%] max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Trabajá con Nosotros
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Únete a nuestro equipo y forma parte del futuro de la prefactibilidad urbanística
            </p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : careersList.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {careersList.map((career) => (
                <CareerCard key={career._id} career={career} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CareersPage;


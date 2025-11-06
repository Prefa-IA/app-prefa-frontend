import React from 'react';
import { Plan as PlanType } from '../../hooks/usePlanes';

interface Props {
  plan: PlanType;
  loading?: boolean;
  onSelect?: () => void;
}

const colorMap: Record<number, { 
  border: string; 
  bg: string; 
  button: string; 
  hover: string;
  featured: boolean;
  accent: string;
  hex: string;
}> = {
  1: { 
    border: 'border-emerald-400', 
    bg: 'from-emerald-50 via-white to-emerald-50', 
    button: 'bg-gradient-to-r from-emerald-600 to-emerald-700', 
    hover: 'from-emerald-700 to-emerald-800',
    featured: true,
    accent: 'emerald',
    hex: '#34d399'
  },
  2: { 
    border: 'border-violet-400', 
    bg: 'from-violet-50 via-white to-violet-50', 
    button: 'bg-gradient-to-r from-violet-600 to-violet-700', 
    hover: 'from-violet-700 to-violet-800',
    featured: false,
    accent: 'violet',
    hex: '#8b5cf6'
  },
  3: { 
    border: 'border-rose-400', 
    bg: 'from-rose-50 via-white to-rose-50', 
    button: 'bg-gradient-to-r from-rose-600 to-rose-700', 
    hover: 'from-rose-700 to-rose-800',
    featured: false,
    accent: 'rose',
    hex: '#fb7185'
  },
  4: { 
    border: 'border-blue-400', 
    bg: 'from-blue-50 via-white to-blue-50', 
    button: 'bg-gradient-to-r from-blue-600 to-blue-700', 
    hover: 'from-blue-700 to-blue-800',
    featured: false,
    accent: 'blue',
    hex: '#60a5fa'
  },
};

const PlanCard: React.FC<Props> = ({ plan, loading = false, onSelect }) => {
  const p = plan.prioridad ?? 4;

  // Badge logic basado exclusivamente en plan.tag
  let badge: string | undefined;
  let badgeClasses = '';
  if (plan.tag) {
    const icon = plan.tag.icon ? plan.tag.icon + ' ' : '';
    const slug = plan.tag.slug;
    badgeClasses = plan.tag.bgClass;
    if (slug === 'free-credits') {
      const qty = plan.freeCredits ?? 0;
      badge = `${icon}${qty} créditos gratis`;
      badgeClasses = 'bg-gradient-to-r from-violet-500 via-violet-600 to-purple-500 shadow-violet-400 text-white';
    } else if (slug === 'super-save') {
      badge = `${icon}Super Ahorro`;
      badgeClasses = 'bg-gradient-to-r from-red-600 via-red-500 to-red-400 shadow-red-300 text-white';
    } else if (slug === 'recommended') {
      badge = `${icon}${plan.tag.name}`;
      badgeClasses = 'bg-green-600 text-white shadow-green-300';
    } else {
      badge = `${icon}${plan.tag.name}`;
    }
  }
  
  const isDiscountActive =
    typeof plan.discountPct === 'number' && plan.discountPct > 0 &&
    (!plan.discountUntil || new Date(plan.discountUntil) >= new Date());

  const discountedPrice = isDiscountActive
    ? Math.round(plan.price * (1 - (plan.discountPct || 0) / 100))
    : plan.price;

  const totalCredits = (plan.creditosTotales ?? 0) + (plan.freeCredits ?? 0);

  return (
    <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-600 rounded-lg shadow-sm p-6 flex flex-col transition-all duration-300 hover:cursor-pointer">      
      {/* Badges superiores */}
      {badge && (
        <span className={`absolute -top-3 left-4 px-2 py-1 text-xs font-semibold rounded ${badgeClasses}`}>{badge}</span>
      )}

      {isDiscountActive && (
        <span className="absolute -top-3 right-4 bg-white dark:bg-gray-900 text-black dark:text-white text-xs font-semibold rounded px-2 py-1 border border-gray-300 dark:border-gray-600">
          -{Math.round(plan.discountPct || 0)}% ahora
        </span>
      )}

      {/* Contenido principal */}
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{plan.name}</h3>

      {isDiscountActive && (
        <p className="text-sm text-gray-400 dark:text-gray-500 line-through mb-1">${plan.price.toLocaleString()}</p>
      )}
      <p className="text-4xl font-extrabold" style={{ color: '#0284C7' }}>${discountedPrice.toLocaleString()}</p>

      {/* Lista de beneficios */}
      <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-6 flex-1">
        {[
          `${totalCredits.toLocaleString()} créditos incluidos`,
          plan.permiteCompuestas ? 'Análisis de múltiples lotes linderos' : null,
          plan.watermarkOrg ? 'Informes con marca de agua de tu empresa' : null,
          plan.watermarkPrefas ? 'Informes con marca de agua de Prefa-IA' : null,
        ].filter(Boolean).map((text, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 flex-shrink-0" />
            <span>{text}</span>
          </li>
        ))}
      </ul>

      {onSelect && (
        <button
          onClick={onSelect}
          disabled={loading}
          className="w-full text-white py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#0369A1' }}
        >
          {loading ? 'Procesando...' : 'Elegir Plan'}
        </button>
      )}
    </div>
  );
};

export default PlanCard;
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
}> = {
  1: { 
    border: 'border-emerald-400', 
    bg: 'from-emerald-50 via-white to-emerald-50', 
    button: 'bg-gradient-to-r from-emerald-600 to-emerald-700', 
    hover: 'from-emerald-700 to-emerald-800',
    featured: true,
    accent: 'emerald'
  },
  2: { 
    border: 'border-violet-400', 
    bg: 'from-violet-50 via-white to-violet-50', 
    button: 'bg-gradient-to-r from-violet-600 to-violet-700', 
    hover: 'from-violet-700 to-violet-800',
    featured: false,
    accent: 'violet'
  },
  3: { 
    border: 'border-rose-400', 
    bg: 'from-rose-50 via-white to-rose-50', 
    button: 'bg-gradient-to-r from-rose-600 to-rose-700', 
    hover: 'from-rose-700 to-rose-800',
    featured: false,
    accent: 'rose'
  },
  4: { 
    border: 'border-blue-400', 
    bg: 'from-blue-50 via-white to-blue-50', 
    button: 'bg-gradient-to-r from-blue-600 to-blue-700', 
    hover: 'from-blue-700 to-blue-800',
    featured: false,
    accent: 'blue'
  },
};

const PlanCard: React.FC<Props> = ({ plan, loading = false, onSelect }) => {
  const p = plan.prioridad ?? 4;
  const style = colorMap[p] || colorMap[4];

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
    } else {
      badge = `${icon}${plan.tag.name}`;
    }
  }

  const isRecommended = plan.tag?.slug === 'recommended';
  const isSuperSave = plan.tag?.slug==='super-save';

  // Determinar si el descuento está activo
  const isDiscountActive =
    typeof plan.discountPct === 'number' && plan.discountPct > 0 &&
    (!plan.discountUntil || new Date(plan.discountUntil) >= new Date());

  const discountedPrice = isDiscountActive
    ? Math.round(plan.price * (1 - (plan.discountPct || 0) / 100))
    : plan.price;

  return (
    <div className={`
      relative 
      ${style.featured ? `${style.border} border-4 shadow-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white` : `border-2 ${style.border} bg-gradient-to-br ${style.bg} shadow-xl hover:shadow-2xl`}
      rounded-3xl 
      p-6 
      overflow-visible 
      transition-all 
      duration-500 
      ease-out
      group
      mt-8
      flex flex-col h-full
    `}>
      
      {/* Efecto de brillo superior para plan featured */}
      {style.featured && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-80 rounded-t-3xl"></div>
      )}
      
      {/* Etiqueta de descuento (solo para planes que no son de créditos gratis ni Super Ahorro) */}
      {isDiscountActive && plan.showDiscountSticker !== false && (
        <div className="absolute -top-3 -right-3 z-20">
          <div className="relative group/discount">
            {isSuperSave ? (
              <div className="relative bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 px-3 py-2 rounded-2xl shadow-2xl transform -rotate-12 hover:rotate-0 transition-transform duration-300 overflow-hidden hover:scale-110">
                <div className="flex items-center justify-center">
                  <span className="text-sm font-black tracking-wider text-black-700">-{`${Math.round(plan.discountPct||0)}%`}</span>
                </div>
                <div className="text-xs font-bold mt-1 text-center opacity-90 text-black-700">AHORRA</div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover/discount:opacity-20 transform -translate-x-full group-hover/discount:translate-x-full transition-transform duration-700" />
              </div>
            ) : (
              <div className={`relative bg-gradient-to-br ${isRecommended ? 'from-black-700 via-black-600 to-black-700' : 'from-red-600 via-red-500 to-red-400'} text-white px-3 py-2 rounded-2xl shadow-2xl transform -rotate-12 hover:rotate-0 transition-transform duration-300 overflow-hidden hover:scale-110`}>
                <div className="flex items-center gap-2">
                  {isRecommended && (
                    <svg className="w-5 h-5 animate-pulse transition-transform duration-700 group-hover/discount:rotate-[360deg]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  )}
                  <span className="text-sm font-black tracking-wider">-{Math.round(plan.discountPct || 0)}%</span>
                </div>
                <div className="text-xs font-bold mt-1 text-center opacity-90">AHORRA</div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover/discount:opacity-20 transform -translate-x-full group-hover/discount:translate-x-full transition-transform duration-700" />
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Badge principal mejorado */}
      {badge && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-30">
          <div className="relative">
            <span className={`
              ${badgeClasses}
              text-white 
              px-6 py-3 
              rounded-full 
              text-sm 
              font-bold 
              shadow-lg 
              hover:shadow-xl
              transition-all
              duration-300
              hover:scale-110
              border
              border-white/20
            `}>
              {badge}
            </span>
          </div>
        </div>
      )}
      
      {/* Eliminado bloque custom: usamos badge estándar para Super Ahorro */}

      <div className="text-center pt-6 flex flex-col h-full">
        {/* Nombre del plan mejorado */}
        <h4 className={`text-3xl font-black mb-4 tracking-wide ${style.featured ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
          {plan.name}
        </h4>
        
        {/* Precio mejorado */}
        <div className="mb-8 flex flex-col items-center">
          {isDiscountActive && (
            <span className={`${style.featured ? 'text-gray-300' : 'text-gray-500'} line-through text-lg mb-2 opacity-75`}>
              ${plan.price.toLocaleString()}
            </span>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold opacity-80">$</span>
            <span className={`font-black text-5xl ${isDiscountActive ? (style.featured ? 'text-emerald-400' : 'text-rose-600') : (style.featured ? 'text-white' : 'text-gray-900')} transition-colors duration-300`}>
              {discountedPrice.toLocaleString()}
            </span>
          </div>
          <span className={`${style.featured ? 'text-gray-300' : 'text-gray-600'} text-lg font-medium mt-1`}>
            /mes
          </span>
        </div>
        
        {/* Lista de características mejorada */}
        <ul className="space-y-4 mb-6 text-left max-w-sm mx-auto flex-shrink-0">
          {[
            { label: `${plan.creditosMes ? plan.creditosMes : '∞'} créditos mensuales${p===2 && plan.freeCredits ? ' + '+plan.freeCredits+' gratis' : ''}`, enabled: true },
            { label: `Límite de ${plan.creditosDia ? plan.creditosDia : '∞'} consultas por día`, enabled: true },
            { label: 'Analisis de multiples lotes linderos', enabled: plan.permiteCompuestas },
            { label: 'Informes con marca de agua de tu empresa', enabled: !!plan.watermarkOrg },
            { label: 'Informes con marca de agua de Prefa-IA', enabled: !!plan.watermarkPrefas },
          ].map((item, index) => (
            <li key={item.label} className={`flex items-center ${style.featured ? 'text-gray-100' : 'text-gray-800'} text-base transition-colors duration-200`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-4 flex-shrink-0 transition-all duration-300 ${
                item.enabled 
                  ? style.featured 
                    ? 'bg-emerald-500 text-white shadow-lg' 
                    : 'bg-emerald-100 text-emerald-700 shadow-md'
                  : style.featured
                    ? 'bg-gray-600 text-gray-400'
                    : 'bg-gray-100 text-gray-400'
              }`}>
                {item.enabled ? (
                  <svg className="w-4 h-4 font-bold" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="font-medium">{item.label}</span>
            </li>
          ))}
        </ul>
        
        {/* Botón mejorado */}
        {onSelect && (
          <button
            onClick={onSelect}
            disabled={loading}
            className={`
              w-full 
              ${isRecommended 
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white'
                : (style.featured 
                    ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-xl hover:shadow-2xl'
                    : `${style.button} hover:${style.hover} text-white shadow-lg hover:shadow-xl`)
              }
              py-4 px-8 
              rounded-2xl 
              transition-all 
              duration-300 
              font-bold 
              text-lg
              disabled:opacity-50 
              disabled:cursor-not-allowed
              relative
              overflow-hidden
              group/button
              mt-auto
            `}
          >
            {/* Efecto de brillo en el botón sin difuminar texto */}
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover/button:opacity-100 transform -skew-x-12 -translate-x-full group-hover/button:translate-x-full transition-transform duration-700 ${isRecommended ? 'mix-blend-screen' : ''}`}></div>
            
            <span className="relative z-10">
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </div>
              ) : (
                'Elegir Plan'
              )}
            </span>
          </button>
        )}
      </div>
      
      {/* Efecto de border animado para plan featured */}
      {style.featured && (
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500 -z-10"></div>
      )}
    </div>
  );
};

export default PlanCard;
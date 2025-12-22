import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { redesSociales, RedSocial } from '../../services/api';
import { FooterModalProps } from '../../types/components';
import PrivacyPolicy from '../usuario/PrivacyPolicy';
import TermsAndConditions from '../usuario/TermsAndConditions';

const iconClass = 'w-6 h-6';

const FacebookIcon: React.FC = () => (
  <svg
    className={iconClass}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterIcon: React.FC = () => (
  <svg
    className={iconClass}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
  </svg>
);

const InstagramIcon: React.FC = () => (
  <svg
    className={iconClass}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const LinkedInIcon: React.FC = () => (
  <svg
    className={iconClass}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const YouTubeIcon: React.FC = () => (
  <svg
    className={iconClass}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TikTokIcon: React.FC = () => (
  <svg
    className={iconClass}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const WhatsAppIcon: React.FC = () => (
  <svg
    className={iconClass}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const DefaultIcon: React.FC = () => (
  <svg
    className={iconClass}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M13.503 2.001l-4 4L20 11.497l-10.497 5.499 4 4L22 13.503 13.503 2.001zm-1.503 7.5l-4 4L18 18.997l-4-4L12 9.501z" />
  </svg>
);

// eslint-disable-next-line max-lines-per-function
const SocialIcon: React.FC<{ logo: RedSocial['logo'] }> = ({ logo }) => {
  switch (logo) {
    case 'facebook':
      return <FacebookIcon />;
    case 'twitter':
      return <TwitterIcon />;
    case 'instagram':
      return <InstagramIcon />;
    case 'linkedin':
      return <LinkedInIcon />;
    case 'youtube':
      return <YouTubeIcon />;
    case 'tiktok':
      return <TikTokIcon />;
    case 'whatsapp':
      return <WhatsAppIcon />;
    default:
      return <DefaultIcon />;
  }
};

const useRedesSociales = () => {
  const [redes, setRedes] = useState<RedSocial[]>([]);

  useEffect(() => {
    const fetchRedes = async () => {
      try {
        const redesActivas = await redesSociales.obtenerRedesActivas();
        setRedes(redesActivas);
      } catch {
        // Silently handle errors
      }
    };
    void fetchRedes();
  }, []);

  return redes;
};

const SocialLinks: React.FC<{ redes: RedSocial[] }> = ({ redes }) => {
  if (redes.length === 0) return null;

  return (
    <div className="flex items-center gap-3">
      {redes.map((red) => (
        <a
          key={red._id}
          href={red.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:scale-110 transition-transform"
          title={red.nombre}
          aria-label={red.nombre}
        >
          <SocialIcon logo={red.logo} />
        </a>
      ))}
    </div>
  );
};

const LegalLinks: React.FC<{
  onShowTyC: () => void;
  onShowPrivacy: () => void;
}> = ({ onShowTyC, onShowPrivacy }) => (
  <div className="flex items-center flex-wrap gap-3">
    <Link
      to="/career"
      className="text-primary-600 dark:text-primary-400 hover:underline"
    >
      Trabajá con Nosotros
    </Link>
    <span className="text-gray-400 dark:text-gray-500">|</span>
    <button
      onClick={onShowTyC}
      className="text-primary-600 dark:text-primary-400 hover:underline"
    >
      Términos y Condiciones
    </button>
    <span className="text-gray-400 dark:text-gray-500">|</span>
    <button
      onClick={onShowPrivacy}
      className="text-primary-600 dark:text-primary-400 hover:underline"
    >
      Políticas de Privacidad
    </button>
  </div>
);

const Footer: React.FC = () => {
  const [showTyC, setShowTyC] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const redes = useRedesSociales();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-4 mt-8 border-t border-gray-200 dark:border-gray-700">
      <div className="w-[95%] lg:w-[63%] max-w-8xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-300 gap-4">
        <div className="mb-2 sm:mb-0">Todos los derechos reservados © {year} Prefa-IA</div>
        <SocialLinks redes={redes} />
        <LegalLinks onShowTyC={() => setShowTyC(true)} onShowPrivacy={() => setShowPrivacy(true)} />
      </div>

      {showTyC && (
        <Modal onClose={() => setShowTyC(false)} title="Términos y Condiciones">
          <TermsAndConditions onClose={() => setShowTyC(false)} />
        </Modal>
      )}

      {showPrivacy && (
        <Modal onClose={() => setShowPrivacy(false)} title="Políticas de Privacidad">
          <PrivacyPolicy onClose={() => setShowPrivacy(false)} />
        </Modal>
      )}
    </footer>
  );
};

const Modal: React.FC<FooterModalProps> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
    <div className="bg-white dark:bg-gray-900 rounded-xl max-w-3xl w-full max-h-[80vh] overflow-auto shadow-lg custom-scrollbar text-gray-900 dark:text-gray-100">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-6 space-y-4 text-sm leading-relaxed">{children}</div>
    </div>
  </div>
);

export default Footer;

import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  noindex?: boolean;
}

const defaultTitle = 'PREFA-IA: Sistema Generador de Prefactibilidades Urbanísticas CABA | Analizador de Terrenos y Código Urbanístico';
const defaultDescription = 'Sistema generador de prefactibilidades urbanísticas para CABA. Analizador de terrenos con interpretación automática del código urbanístico. Genera reportes inmobiliarios profesionales al instante.';
const defaultImage = '/logo.png';
const defaultUrl = 'https://prefaia.com';
const siteName = 'PREFA-IA';

const SEO: React.FC<SEOProps> = ({
  title = defaultTitle,
  description = defaultDescription,
  image = defaultImage,
  url = defaultUrl,
  type = 'website',
  noindex = false,
}) => {
  const fullImageUrl = image.startsWith('http') ? image : `https://prefaia.com${image}`;
  const fullUrl = url.startsWith('http') ? url : `https://prefaia.com${url}`;

  return (
    <Helmet>
      {/* Título y descripción básicos */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:locale" content="es_AR" />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* Geo tags (solo en homepage) */}
      {url === defaultUrl && (
        <>
          <meta name="geo.region" content="AR-C" />
          <meta name="geo.placename" content="Ciudad Autónoma de Buenos Aires" />
          <meta name="geo.position" content="-34.6037;-58.3816" />
          <meta name="ICBM" content="-34.6037, -58.3816" />
          <meta name="locality" content="Buenos Aires" />
          <meta name="region" content="CABA" />
          <meta name="country" content="Argentina" />
        </>
      )}
    </Helmet>
  );
};

export default SEO;


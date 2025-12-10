# Configuración SEO - Instrucciones de Instalación

## ⚠️ IMPORTANTE: Instalar dependencia requerida

Para que el SEO dinámico funcione correctamente, necesitas instalar `react-helmet-async`:

```bash
cd app-prefa-frontend
npm install react-helmet-async
```

## ✅ Cambios Implementados

### 1. **Meta Keywords Eliminado** ✓
- Google no usa este tag desde 2009
- Eliminado del `index.html` para evitar problemas

### 2. **Robots.txt Optimizado** ✓
- Eliminado `Crawl-delay` restrictivo
- Googlebot puede rastrear sin restricciones
- Sitemap referenciado correctamente

### 3. **SEO Dinámico con React Helmet** ✓
- Componente `SEO.tsx` creado para meta tags dinámicos
- Cada ruta puede tener su propio título y descripción
- Evita canibalización de keywords

### 4. **Alt Text Corregido** ✓
- Eliminado keyword stuffing
- Alt text descriptivo y natural

### 5. **Sitemap Actualizado** ✓
- Fecha actualizada a 2025-01-15
- **Recomendación**: Generar sitemap dinámicamente en producción

## 📝 Uso del Componente SEO

### En cualquier componente de página:

```tsx
import SEO from './components/SEO';

const MiPagina = () => {
  return (
    <>
      <SEO
        title="Título específico de la página"
        description="Descripción única para esta página"
        url="/ruta-especifica"
      />
      {/* Contenido de la página */}
    </>
  );
};
```

### Ejemplo para página de consulta:

```tsx
<SEO
  title="Consultar Prefactibilidad CABA | PREFA-IA"
  description="Consulta la prefactibilidad urbanística de cualquier terreno en CABA. Análisis instantáneo del código urbanístico."
  url="/consultar"
/>
```

## 🚀 Próximos Pasos Recomendados

1. **Instalar react-helmet-async** (ver comando arriba)
2. **Implementar SEO en todas las rutas principales**:
   - `/consultar` - Página de consulta
   - `/buscar` - Búsqueda de direcciones
   - `/informes` - Lista de informes
   - `/suscripciones` - Planes y precios
   - `/login` - Inicio de sesión
   - `/registro` - Registro de usuarios

3. **Generar sitemap dinámicamente**:
   - Crear un endpoint en el backend que genere el sitemap.xml
   - Incluir URLs dinámicas de informes públicos (si aplica)
   - Actualizar `lastmod` con fecha real

4. **Optimizar imagen del Hero**:
   - Descargar imagen de Unsplash
   - Convertir a WebP
   - Reducir tamaño (máx 1920px)
   - Servir desde `/public` o CDN

5. **Agregar más contenido textual**:
   - Mínimo 300-500 palabras en homepage
   - Explicar qué hace la herramienta
   - Incluir keywords naturalmente en el contenido

## ⚠️ Limitaciones Actuales

- **SPA React**: Google puede leer JavaScript, pero puede tardar días/semanas
- **Solución ideal a largo plazo**: Considerar migrar a Next.js (SSR) para HTML listo desde el servidor

## 📊 Monitoreo

- Configurar Google Search Console
- Enviar sitemap.xml
- Monitorear indexación y keywords


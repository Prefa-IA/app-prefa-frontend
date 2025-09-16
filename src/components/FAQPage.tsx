import React, { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';

// Imágenes para los tutoriales
import Paso1 from '../assets/images/paso0.png';
import Paso2 from '../assets/images/paso2.png';
import Paso3 from '../assets/images/paso3.png';
import Paso4 from '../assets/images/paso4.png';
import Paso5 from '../assets/images/paso5.png';
import Paso6 from '../assets/images/paso6.png';
import Paso7 from '../assets/images/paso7.png';

import PersonalizacionInforme from '../assets/images/Personalizacion informe.png';
import VistaPreviaInforme from '../assets/images/Vista previa informe.png';
import PlanesImg from '../assets/images/PLANES.png';

import PrefaInfoModal from './PrefaInfoModal';

const buildFaqs = (openInfo: (e: React.MouseEvent) => void) => [
  {
    question: '¿Cómo hago una consulta de prefactibilidad?',
    answer: (
      <div className="space-y-6">
        {/* Paso 0: Ir a Consultar */}
        <div className="space-y-2">
          <p><strong>Paso 1:</strong> Ingresa a la pestaña <em>Consultar</em> desde la barra de navegación.</p>
          <img src={Paso1} alt="Paso 1" className="rounded-lg shadow border" />
        </div>

        {/* Paso 1-7 */}
        {[Paso2, Paso3, Paso4, Paso5, Paso6, Paso7].map((src, idx) => (
          <div key={idx} className="space-y-2">
            <p><strong>Paso {idx + 1}:</strong> {[
              'Escribí la dirección completa dentro de CABA en el campo de búsqueda.',
              'Presiona en la lupa para que nuestra IA arme tu prefactibilidad.',
              'Seleccioná la dirección correcta de la lista desplegable.',
              'Elegí el tipo de informe que necesitás (Simple, Completo o Compuesto) y hacé clic en la lupa.',
              'Hacé clic en el ícono de la lupa (o presioná Enter) para iniciar la consulta.',
              'Espera mientras se procesan los datos y se generan los resultados.',
              'Revisa la información mostrada en pantalla o previsualiza tu informe.',
              'Guarda el informe en tu cuenta o genera el PDF si lo deseas.'
            ][idx]}</p>
            <img src={src} alt={`Paso ${idx + 1}`} className="rounded-lg shadow border" />
          </div>
        ))}
      </div>
    ),
  },
  {
    question: '¿Cómo personalizo los colores de mis informes?',
    answer: (
      <div className="space-y-6">
        <div className="space-y-2">
          <p>Podés personalizar los informes de tu empresa y darle una identidad única. Simplemente andá a <strong>Perfil &gt; Personalización</strong> y configurá:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Los <strong>colores de fondo</strong> y de <strong>texto</strong> para los encabezados principales y secundarios.</li>
            <li>La <strong>tipografía</strong> que querés usar en todos los informes.</li>
          </ul>
        </div>

        {/* Imagen de la pantalla de personalización */}
        <img src={PersonalizacionInforme} alt="Pantalla de personalización" className="rounded-lg shadow border" />

        {/* Vista previa de un informe con los colores aplicados */}
        <img src={VistaPreviaInforme} alt="Vista previa del informe" className="rounded-lg shadow border" />
      </div>
    ),
  },
  {
    question: '¿Qué tipos de prefactibilidad existen y cuántos créditos consumen?',
    answer: (
      <div className="space-y-4">
        <ul className="list-disc pl-5 space-y-1">
        <li>Hay tres tipos de informes que puedes generar, cada uno con un costo de créditos diferente.</li>
        <li>Para ver el detalle de cada uno, <button type="button" onClick={openInfo} className="text-blue-500 hover:underline">hacé click aquí</button></li>
        </ul>
      </div>
    ),
  },
  {
    question: '¿Cómo contrato un plan y obtengo créditos?',
    answer: (
      <div className="space-y-4">
        <ol className="list-decimal pl-5 space-y-1">
          <li>Ingresa a <strong>Perfil &gt; Gestionar Suscripción</strong>.</li>
          <li>Elegí el plan que mejor se adapte a tu proyecto.</li>
          <li>Completá el proceso de pago seguro.</li>
          <li>¡Listo! Los créditos se cargarán automáticamente a tu cuenta y podrás empezar a usarlos al instante.</li>
        </ol>
        <img src={PlanesImg} alt="Planes disponibles" className="rounded-lg shadow border" />
      </div>
    ),
  },
];

const FAQPage: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);

  const openInfo = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowInfo(true);
  };

  const faqs = buildFaqs(openInfo);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Preguntas Frecuentes</h1>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <Disclosure key={idx}>
            {({ open }) => (
              <div className="border rounded-lg bg-white shadow-sm">
                <Disclosure.Button className="flex w-full justify-between items-center px-4 py-3 text-left text-gray-900 font-medium hover:bg-gray-50 focus:outline-none">
                  <span>{faq.question}</span>
                  <ChevronUpIcon
                    className={`${open ? 'transform rotate-180' : ''} h-5 w-5 text-gray-500`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pb-4 pt-2 text-gray-700 border-t bg-gray-50">
                  {faq.answer}
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
        ))}
      </div>

      {showInfo && <PrefaInfoModal onClose={() => setShowInfo(false)} />}
    </div>
  );
};

export default FAQPage; 
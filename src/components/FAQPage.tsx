import React, { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';

import Paso1 from '../assets/images/paso0.png';
import Paso2 from '../assets/images/paso2.png';
import Paso3 from '../assets/images/paso3.png';
import Paso4 from '../assets/images/paso4.png';
import Paso5 from '../assets/images/paso5.png';
import Paso6 from '../assets/images/paso6.png';
import Paso7 from '../assets/images/paso7.png';
import PersonalizacionInforme from '../assets/images/Personalizacion informe.png';
import PlanesImg from '../assets/images/PLANES.png';
import VistaPreviaInforme from '../assets/images/Vista previa informe.png';
import { safeArrayAccess } from '../utils/array-safe-access';

import Container from './layout/Container';
import PrefaInfoModal from './PrefaInfoModal';

const ConsultaAnswer: React.FC = () => {
  const pasosTextos = [
    'Escribí la dirección completa dentro de CABA en el campo de búsqueda.',
    'Presiona en la lupa para que nuestra IA arme tu prefactibilidad.',
    'Seleccioná la dirección correcta de la lista desplegable.',
    'Elegí el tipo de informe que necesitás (Simple, Completo o Compuesto) y hacé clic en la lupa.',
    'Hacé clic en el ícono de la lupa (o presioná Enter) para iniciar la consulta.',
    'Espera mientras se procesan los datos y se generan los resultados.',
  ];
  const pasosImagenes = [Paso2, Paso3, Paso4, Paso5, Paso6, Paso7];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p>
          <strong>Paso 1:</strong> Ingresa a la pestaña <em>Consultar</em> desde la barra de
          navegación.
        </p>
        <img src={Paso1} alt="Paso 1" className="rounded-lg shadow border" />
      </div>
      {pasosImagenes.map((src, idx) => {
        const pasoTextoIndex = Math.max(0, Math.min(idx, pasosTextos.length - 1));
        const pasoTexto = safeArrayAccess(pasosTextos, pasoTextoIndex) || '';
        return (
          <div key={idx} className="space-y-2">
            <p>
              <strong>Paso {idx + 2}:</strong> {pasoTexto}
            </p>
            <img src={src} alt={`Paso ${idx + 2}`} className="rounded-lg shadow border" />
          </div>
        );
      })}
    </div>
  );
};

const PersonalizacionAnswer: React.FC = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <p>
        Podés personalizar los informes de tu empresa y darle una identidad única. Simplemente andá
        a <strong>Perfil &gt; Personalización</strong> y configurá:
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          Los <strong>colores de fondo</strong> y de <strong>texto</strong> para los encabezados
          principales y secundarios.
        </li>
        <li>
          La <strong>tipografía</strong> que querés usar en todos los informes.
        </li>
      </ul>
    </div>
    <img
      src={PersonalizacionInforme}
      alt="Pantalla de personalización"
      className="rounded-lg shadow border"
    />
    <img
      src={VistaPreviaInforme}
      alt="Vista previa del informe"
      className="rounded-lg shadow border"
    />
  </div>
);

const TiposPrefactibilidadAnswer: React.FC<{ onOpenInfo: (e: React.MouseEvent) => void }> = ({
  onOpenInfo,
}) => (
  <div className="space-y-4">
    <ul className="list-disc pl-5 space-y-1">
      <li>
        Hay tres tipos de informes que puedes generar, cada uno con un costo de créditos diferente.
      </li>
      <li>
        Para ver el detalle de cada uno,{' '}
        <button type="button" onClick={onOpenInfo} className="text-blue-500 hover:underline">
          hacé click aquí
        </button>
      </li>
    </ul>
  </div>
);

const PlanesAnswer: React.FC = () => (
  <div className="space-y-4">
    <ol className="list-decimal pl-5 space-y-1">
      <li>
        Ingresa a <strong>Perfil &gt; Gestionar Suscripción</strong>.
      </li>
      <li>Elegí el plan que mejor se adapte a tu proyecto.</li>
      <li>Completá el proceso de pago seguro.</li>
      <li>
        ¡Listo! Los créditos se cargarán automáticamente a tu cuenta y podrás empezar a usarlos al
        instante.
      </li>
    </ol>
    <img src={PlanesImg} alt="Planes disponibles" className="rounded-lg shadow border" />
  </div>
);

const buildFaqs = (openInfo: (e: React.MouseEvent) => void) => [
  {
    question: '¿Cómo hago una consulta de prefactibilidad?',
    answer: <ConsultaAnswer />,
  },
  {
    question: '¿Cómo personalizo los colores de mis informes?',
    answer: <PersonalizacionAnswer />,
  },
  {
    question: '¿Qué tipos de prefactibilidad existen y cuántos créditos consumen?',
    answer: <TiposPrefactibilidadAnswer onOpenInfo={openInfo} />,
  },
  {
    question: '¿Cómo contrato un plan y obtengo créditos?',
    answer: <PlanesAnswer />,
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
    <Container>
      <div className="w-full py-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
          Preguntas Frecuentes
        </h1>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <Disclosure key={idx}>
              {({ open }) => (
                <div className="border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
                  <Disclosure.Button className="flex w-full justify-between items-center px-4 py-3 text-left text-gray-900 dark:text-gray-100 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none">
                    <span>{faq.question}</span>
                    <ChevronUpIcon
                      className={`${open ? 'transform rotate-180' : ''} h-5 w-5 text-gray-500 dark:text-gray-400`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pb-4 pt-2 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    {faq.answer}
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>
          ))}
        </div>

        {showInfo && <PrefaInfoModal onClose={() => setShowInfo(false)} />}
      </div>
    </Container>
  );
};

export default FAQPage;

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  DocumentSearchIcon,
  DocumentTextIcon,
  CreditCardIcon,
} from '@heroicons/react/outline';
import { HomeProps, FeatureItem, HOME_CONFIG } from '../types/enums';

const features: FeatureItem[] = [
  {
    name: 'Datos catastrales al día.',
    description:
      'Accedé a la zonificación y restricciones de cualquier parcela de CABA en un solo lugar.',
    icon: DocumentSearchIcon,
  },
  {
    name: 'Cálculo de edificabilidad automático.',
    description:
      'Nuestro sistema calcula la capacidad constructiva al instante, 100% ajustada al Código Urbanístico vigente.',
    icon: DocumentTextIcon,
  },
  {
    name: 'Informes profesionales en PDF.',
    description:
      'Generá informes completos con marca de agua de tú empresa, listos para presentarle a un cliente o socio.',
    icon: CreditCardIcon,
  },
];

const Home: React.FC<HomeProps> = ({ className }) => {
  const { usuario } = useAuth();

  return (
    <div className={`${className || ''}`}>
      <HeroSection usuario={usuario} />
      <FeatureSection features={features} />
    </div>
  );
};

const HeroSection: React.FC<{ usuario: any }> = ({ usuario }) => (
  <div className="relative">
    <main className="lg:relative">
      <div className="mx-auto max-w-7xl w-full pt-16 pb-20 text-center lg:py-48 lg:text-left">
        <HeroContent usuario={usuario} />
        <HeroImage />
      </div>
    </main>
  </div>
);

const HeroContent: React.FC<{ usuario: any }> = ({ usuario }) => (
  <div className="px-4 lg:w-1/2 sm:px-8 xl:pr-16">
    <HeroTitle />
    <HeroDescription />
    <HeroActions usuario={usuario} />
  </div>
);

const HeroTitle: React.FC = () => (
  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
    <span className="block xl:inline">{HOME_CONFIG.HERO.TITLE}</span>{' '}
    <span className="block text-primary-600 xl:inline">
      {HOME_CONFIG.HERO.SUBTITLE}
    </span>
  </h1>
);

const HeroDescription: React.FC = () => (
  <p className="mt-3 max-w-md mx-auto text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
    {HOME_CONFIG.HERO.DESCRIPTION}
  </p>
);

const HeroActions: React.FC<{ usuario: any }> = ({ usuario }) => (
  <div className="mt-10 sm:flex sm:justify-center lg:justify-start">
    <MainAction usuario={usuario} />
  </div>
);

const MainAction: React.FC<{ usuario: any }> = ({ usuario }) => (
  <div className="rounded-md shadow-xl">
    <Link
      to={usuario ? "/consultar" : "/login"}
      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 md:py-4 md:text-lg md:px-10 shadow-lg hover:shadow-2xl"
    >
      Empezar ahora
    </Link>
  </div>
);

const HeroImage: React.FC = () => (
  <div className="relative w-full h-64 sm:h-72 md:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 lg:h-full">
    <img
      className="absolute inset-0 w-full h-full object-cover"
      src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2600&q=80"
      alt="Buenos Aires"
    />
  </div>
);

const FeatureSection: React.FC<{ features: FeatureItem[] }> = ({ features }) => (
  <div className="py-12 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <FeatureSectionHeader />
      <FeatureGrid features={features} />
    </div>
  </div>
);

const FeatureSectionHeader: React.FC = () => (
  <div className="lg:text-center">
    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
      {HOME_CONFIG.FEATURES.SUBTITLE}
    </p>
    <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
      {HOME_CONFIG.FEATURES.DESCRIPTION}
    </p>
  </div>
);

const FeatureGrid: React.FC<{ features: FeatureItem[] }> = ({ features }) => (
  <div className="mt-10">
    <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
      {features.map((feature) => (
        <FeatureCard key={feature.name} feature={feature} />
      ))}
    </dl>
  </div>
);

const FeatureCard: React.FC<{ feature: FeatureItem }> = ({ feature }) => (
  <div className="relative">
    <FeatureIcon icon={feature.icon} />
    <FeatureContent name={feature.name} description={feature.description} />
  </div>
);

const FeatureIcon: React.FC<{ icon: React.ComponentType<any> }> = ({ icon: Icon }) => (
  <dt>
    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
      <Icon className="h-6 w-6" aria-hidden="true" />
    </div>
  </dt>
);

const FeatureContent: React.FC<{ name: string; description: string }> = ({ name, description }) => (
  <>
    <dt>
      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
        {name}
      </p>
    </dt>
    <dd className="mt-2 ml-16 text-base text-gray-500">
      {description}
    </dd>
  </>
);

export default Home;
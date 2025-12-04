import React from 'react';

import { useCreditCosts } from '../hooks/use-credit-costs';
import { PrefaInfoModalProps } from '../types/components';

import ModalBase from './generales/ModalBase';

const PrefaInfoModal: React.FC<PrefaInfoModalProps> = ({ onClose }) => {
  const { costs, loading } = useCreditCosts();

  if (loading) {
    return (
      <ModalBase title="Elegí el tipo de informe que necesitás." onClose={onClose}>
        <div className="space-y-2 text-sm">
          <p>Cargando información...</p>
        </div>
      </ModalBase>
    );
  }

  return (
    <ModalBase title="Elegí el tipo de informe que necesitás." onClose={onClose}>
      <div className="space-y-2 text-sm">
        <p>
          <strong>Prefactibilidad Simple</strong> ({costs.simple} créditos)
        </p>
        <p>
          Ideal para un análisis rápido de un solo lote. Incluye los datos catastrales básicos, el
          cálculo de plusvalía y la normativa principal. No incluye los detalles de croquis,
          fachadas ni perfiles de manzana.
        </p>
        <p className="pt-2">
          <strong>Prefactibilidad Completa</strong> ({costs.completa} créditos)
        </p>
        <p>
          El informe más detallado para tu proyecto. Incluye toda la información de la
          prefactibilidad de tipo simple, y además, los planos y las imágenes de la fachada y el
          perímetro de la manzana.
        </p>
        <p className="pt-2">
          <strong>Prefactibilidad Compuesta</strong> ({costs.compuesta} créditos)
        </p>
        <p>
          Perfecto para desarrollos inmobiliarios. Este informe unifica el análisis de varios lotes
          linderos en una sola prefactibilidad de tipo completa.
        </p>
        <p className="pt-2">
          <strong>Búsqueda Básica</strong> ({costs.basicSearch} créditos)
        </p>
        <p>
          Búsqueda rápida de información básica de una dirección. Incluye datos catastrales
          fundamentales y no requiere plan. Ideal para consultas rápidas sin generar un informe
          completo.
        </p>
      </div>
    </ModalBase>
  );
};

export default PrefaInfoModal;

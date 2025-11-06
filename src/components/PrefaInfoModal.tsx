import React from 'react';
import ModalBase from './generales/ModalBase';

interface Props {
  onClose: () => void;
}

const PrefaInfoModal: React.FC<Props> = ({ onClose }) => (
  <ModalBase title="Elegí el tipo de informe que necesitás." onClose={onClose}>
    <div className="space-y-2 text-sm">
      <p><strong>Prefactibilidad Simple</strong> (100 créditos)</p>
      <p>Ideal para un análisis rápido de un solo lote. Incluye los datos catastrales básicos, el cálculo de plusvalía y la normativa principal. No incluye los detalles de croquis, fachadas ni perfiles de manzana.</p>
      <p className="pt-2"><strong>Prefactibilidad Completa</strong> (200 créditos)</p>
      <p>El informe más detallado para tu proyecto. Incluye toda la información de la prefactibilidad de tipo simple, y además, los planos y las imágenes de la fachada y el perímetro de la manzana. </p>
      <p className="pt-2"><strong>Prefactibilidad Compuesta</strong> (300 créditos)</p>
      <p>Perfecto para desarrollos inmobiliarios. Este informe unifica el análisis de varios lotes linderos en una sola prefactibilidad de tipo completa.</p>
    </div>
  </ModalBase>
);

export default PrefaInfoModal; 
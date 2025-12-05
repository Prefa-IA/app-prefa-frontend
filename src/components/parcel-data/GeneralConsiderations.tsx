import React from 'react';

import useTablePersonalization from '../../hooks/use-table-personalization';
import { GeneralConsiderationsProps, PARCEL_DATA_CONFIG } from '../../types/enums';

import PageNumber from './PageNumber';

const GeneralConsiderations: React.FC<GeneralConsiderationsProps> = ({ pageCounter }) => {
  const { parentTableStyle } = useTablePersonalization();

  return (
    <div className="mb-8">
      <div className={PARCEL_DATA_CONFIG.TABLE_HEADER_CLASS + ' mb-6'} style={parentTableStyle}>
        CONSIDERACIONES GENERALES
      </div>
      <div className="text-sm space-y-4 dark:text-gray-300">
        <p>
          El presente estudio fue realizado de acuerdo a lo establecido en el Código Urbanístico Ley
          N° 6099 – B.O.C.B.A. N° 5526. Publ. 27/12/2018 y Decreto Reglamentario N° 99/19 –
          B.O.C.B.A. N° 5575. Publ. 12/3/2019. Se basa en información pública, respecto a
          indicadores constructivos de lo indicado en el Código Urbanístico (CU) de la Ciudad
          Autónoma de Buenos Aires y sus correspondientes Anexo I: &quot;Catálogo de inmuebles
          protegidos&quot;, Anexo II: &quot;Áreas especiales individualizadas&quot;, Anexo III:
          &quot;Atlas&quot;, y Anexo IV: &quot;Planillas de edificabilidad y usos&quot; Está
          contemplada la ley N°6361 B.O.C.B.A. N° 6023. Publ. 23/12/2020 Decreto 457 de modificación
          del Código Urbanístico que entró en vigencia el 04/02/2021. También está contemplada la
          modificación del código Ley N° 6776 publicado el 26/12/2024 en el Boletín Oficial N° 7026
          y la ley tarifaria 2025 6806-24
        </p>
        <p>
          El objetivo del presente estudio mismo es brindar información urbanística con carácter
          orientativo, aplicada a la parcela en cuestión, a los efectos de facilitar la comprensión
          del Nuevo Urbanístico.
        </p>
        <p>
          Hay que considerar que el análisis no se realiza sobre un proyecto o anteproyecto
          específico, lo cual podría variar alguno de los parámetros y/o consideraciones consignadas
          en el informe, las que en muchos casos son producto de la interpretación de la autoridad
          de aplicación.
        </p>
        <p>
          El análisis se ha realizado en base a datos y las medidas consignadas en la consulta
          catastral, con lo cual podría sufrir ajustes dependiendo de los hechos existentes en las
          parcelas.
        </p>
        <p>
          El cálculo de Plusvalía y pago del Derecho para el Desarrollo Urbano y el Hábitat
          Sustentable es estimado y queda sujeto al definitivo con las superficies finales del
          proyecto.
        </p>
        <p>
          Por lo expuesto, este informe de pre factibilidad debe ser entendido como preliminar y el
          definitivo deberá ser realizado contemplando un anteproyecto de arquitectura específico.
        </p>
        <p>
          La información provista por este informe es orientativo y no vinculante, al momento de
          realizar un trámite ante Gobierno de la Ciudad de Buenos Aires.
        </p>
        <p>
          Es responsabilidad del usuario confirmar mediante la vía administrativa pertinente la
          información provista por el presente informe previo a alguna toma de decisión o acción.
        </p>
      </div>
      <PageNumber pageNumber={pageCounter} />
    </div>
  );
};

export default GeneralConsiderations;

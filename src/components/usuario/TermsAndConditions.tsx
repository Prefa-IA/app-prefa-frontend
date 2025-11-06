import React from 'react';
import ModalBase from '../generales/ModalBase';

interface Props { onClose: () => void; }

/**
 * Componente que muestra los Términos y Condiciones.  
 * La versión HTML proporcionada por el equipo se incrusta directamente
 * mediante JSX para evitar problemas de importación de assets en runtime.
 * Si en el futuro se necesita mantener el archivo HTML por separado,
 * bastará con moverlo a `public/tyc/terminosycondiciones.html` y reemplazar
 * el contenido de `dangerouslySetInnerHTML` por un `fetch` al recurso estático.
 */
const TermsAndConditions: React.FC<Props> = ({ onClose }) => {
  return (
    <ModalBase title="Términos y Condiciones" onClose={onClose} hideConfirm>
    <div className="prose max-w-none">
      {/* Estilos locales para el documento de TyC */}
      <style>{`
        .tyc-container {
          max-width: 800px;
          margin: 0 auto;
          background: transparent;
          padding: 0;
          border-radius: 0;
          box-shadow: none;
          color: #111827; /* gray-900 */
        }
        html.dark .tyc-container {
          background: transparent;
          color: #e5e7eb; /* gray-200 */
          box-shadow: none;
        }
        .tyc-container h1,
        .tyc-container h2 {
          color: #0c4a6e; /* primary-900 */
        }
        html.dark .tyc-container h1,
        html.dark .tyc-container h2 {
          color: #38bdf8; /* primary-400 */
        }
        .tyc-container h1 {
          border-bottom: 2px solid #3498db;
          padding-bottom: 10px;
          text-align: center;
        }
        .tyc-container h2 {
          margin-top: 20px;
          border-bottom: 1px solid #ecf0f1;
          padding-bottom: 5px;
        }
        .tyc-container p,
        .tyc-container li {
          text-align: justify;
        }
        .tyc-container ul {
          list-style-type: disc;
          padding-left: 20px;
        }
        .tyc-container a {
          color: #0284c7;
          text-decoration: none;
        }
        .tyc-container a:hover { text-decoration: underline; }
      `}</style>
      <div className="tyc-container">
        <h1>Términos y Condiciones del Servicio</h1>
        <p>
          Bienvenido a la plataforma de servicios de prefactibilidad. Al utilizar
          nuestros servicios, usted (el "Cliente") acepta cumplir con todos los
          términos y condiciones aquí estipulados (los "T&Cs"), y reconoce que la
          relación que emane entre usted y [Nombre de su Empresa] se regirá
          exclusivamente por ellos y el contrato que de ellos emana (el
          "Contrato").
        </p>
        <p>
          Si el Cliente no estuviera conforme con los T&Cs y/o el Contrato,
          deberá abstenerse de crear una cuenta o de acceder o utilizar de otro
          modo los servicios de [Nombre de su Empresa].
        </p>
        <p>
          El uso por parte del Cliente de los servicios también estará sujeto a
          la Política de Privacidad de [Nombre de su Empresa], que abarca el modo
          en que recabamos, utilizamos, compartimos y almacenamos su información
          personal.
        </p>
        <p>
          [Nombre de su Empresa] se reserva el derecho de modificar estos T&Cs en
          cualquier momento y sin previo aviso. Cualquier cambio será publicado
          en nuestro sitio web y se considerará efectivo a partir de la fecha de
          publicación. Si no está de acuerdo con cualquiera de los cambios,
          puede dar de baja su cuenta. Usted declara que si continúa utilizando
          nuestros Servicios, tras publicar o enviar un aviso acerca de cambios
          en estos T&Cs, esto implicará que ha aceptado los nuevos términos desde
          su fecha de entrada en vigor.
        </p>

        <h2>Inscripción y Pagos</h2>
        <p>
          La contratación de los servicios quedará automáticamente consolidada
          una vez que el pago se acredite en la cuenta de [Nombre de su Empresa].
          Al contratar un servicio, el Cliente acepta haber leído los requisitos
          previos (sean o no excluyentes) y cumplimentar los mismos.
        </p>
        <p>
          En los casos en que el Cliente abone por error 2 (dos) o más veces un
          mismo servicio o cuota, le será reintegrado el importe abonado menos
          las comisiones del bróker de pago. Para hacer efectivo el reintegro,
          deberá efectuar el reclamo dirigiéndose vía e-mail al área
          administrativa, dentro del plazo de 15 días corridos de realizado el
          pago.
        </p>
        <p>El pago realizado y acreditado para un Cliente no es transferible ni asignable a otro usuario.</p>

        <h2>Pago en Cuotas</h2>
        <p>
          Al elegir la opción de pagar en cuotas usted asume el compromiso por el
          valor total del servicio contratado y es su responsabilidad pagar todas
          las cuotas sin excepción. Deberá cancelar la totalidad de las cuotas en
          caso de discontinuar el servicio.
        </p>
        <p>
          El pago de las cuotas tiene periodicidad mensual consecutiva. El atraso
          en el pago de las cuotas será razón suficiente para que el Cliente no
          pueda continuar recibiendo los servicios hasta tanto regularice su
          situación de pagos.
        </p>

        <h2>Modalidad de los Servicios</h2>
        <p>
          Nuestros servicios de prefactibilidad se desarrollan a través de una
          plataforma digital. Esto implica la implementación de contenidos
          teóricos y prácticos digitalizados en línea, materiales de lectura
          asociados a dichos contenidos, foros de discusión y evaluaciones
          periódicas si correspondiera.
        </p>

        <h2>Fechas de Servicio y Plazos de Entrega</h2>
        <p>
          [Nombre de su Empresa] planifica los servicios y publica las fechas
          estimadas en el calendario del sitio web. Si por razones de fuerza
          mayor, o bien por una replanificación, surgiera un cambio en la fecha
          de inicio o de postergación de un servicio, esto no dará derecho a
          reclamo alguno por parte del Cliente (no se devolverán los pagos
          recibidos). Si el Cliente no pudiese realizar el servicio en la nueva
          fecha, podrá solicitar que se lo inscriba en alguna de las próximas
          fechas de inicio (teniendo este crédito a su favor por el ciclo de
          servicio en el cual esté inscrito). En ningún caso se realizará el
          reintegro del pago efectuado, excepto si el servicio no se dictare
          dentro del ciclo de servicio de realizado el pago.
        </p>
        <p>El Cliente deberá finalizar el servicio dentro del año de comenzado, sin excepción.</p>

        <h2>Baja del Servicio</h2>
        <p>
          Aquellos Clientes que por diversos motivos de índole personal deseen
          darse de baja del servicio, deberán tener en cuenta que no se realizan
          reintegros de los pagos efectuados. La solicitud de baja deberá
          realizarse vía e-mail a: [su email de contacto]. Quienes dejen de
          utilizar un servicio y deseen retomarlo tiempo después, deberán
          inscribirse y pagar nuevamente.
        </p>
        <p>
          No se realiza devolución de los pagos efectuados. Excepcionalmente,
          quienes manifiesten dentro del transcurso de los 7 (siete) días
          corridos de iniciado el servicio, y por motivos que puedan fundamentar
          adecuadamente, la necesidad de dar de baja temporalmente, podrán
          solicitar su reinscripción, planteando su situación vía e-mail al área
          de gestión. Deberán adecuarse naturalmente a las fechas de comienzo
          establecidas para los servicios, sin necesidad de nuevo pago.
        </p>

        <h2>Acreditación y Certificación</h2>
        <p>
          [Nombre de su Empresa] podrá emitir certificados de aprobación o de
          participación de los servicios, según corresponda.
        </p>
        <p>
          En cumplimiento de la norma de calidad que adopta [Nombre de su
          Empresa] en pos de la reducción en el uso de papel para el cuidado del
          medio ambiente, los certificados que otorga son extendidos únicamente
          en formato digital, que pueden ser compartidos y validados
          públicamente.
        </p>
        <p>
          Para asegurar la autenticidad e integridad de los certificados, se ha
          incorporado un sistema de validación basado en tecnología blockchain.
        </p>
        <p>
          [Nombre de su Empresa] podrá modificar los smart contracts utilizados
          para la verificación blockchain de los certificados así como la red en
          la que se encuentran implementados en caso de considerarlo pertinente,
          en cualquier momento y sin previo aviso.
        </p>
        <p>
          Para la confección de su certificado, se utilizarán los siguientes
          datos: nombre, apellido, documento de identidad, correo electrónico,
          condición de aprobación o participación, tipo de servicio y fecha de
          emisión. Usted reconoce y acepta expresamente que los datos
          anteriormente mencionados serán públicamente visibles por cualquier
          persona u organización que tenga la ruta de acceso al sitio web en el
          que se encuentren alojados los certificados pertinentes.
        </p>

        <h2>Otras Consideraciones</h2>
        <h3>Conducta de los Clientes</h3>
        <p>
          El Cliente tiene el derecho de expresarse con libertad y sin ningún
          tipo de censura, formulando todo tipo de opiniones críticas a los
          contenidos, expresiones y afirmaciones. Pero en todos estos casos lo
          deberá hacer con respeto y cordialidad, argumentando y fundamentando
          adecuadamente sus opiniones, y sin desautorizar, desvalorizar o
          ridiculizar las explicaciones, consideraciones, opiniones y
          afirmaciones del personal de [Nombre de su Empresa]. Aquellos Clientes
          que no comprendan o no acepten estas normas mínimas de respeto y
          convivencia serán, en una primera instancia, advertidos y, de persistir
          en su actitud, desvinculados del servicio, pero sin que esto implique
          devolución alguna del pago recibido.
        </p>

        <h3>Derechos de uso de contenidos</h3>
        <p>
          Queda totalmente prohibida la reproducción y publicación parcial o
          total de los contenidos de los servicios tanto en medios digitales
          como en papel sin expresa autorización de [Nombre de su Empresa].
        </p>

        <h3>Cambio de personal y contenidos</h3>
        <p>
          [Nombre de su Empresa] se reserva el derecho de cambiar personal y
          contenidos, incluso en servicios ya iniciados. Esto responde a uno de
          los objetivos fundamentales de [Nombre de su Empresa]: “mejorar en
          forma continua la calidad de sus servicios”.
        </p>

        <h3>Jurisdicción</h3>
        <p>
          Para todos los efectos que se deriven del presente contrato entre las
          partes, las mismas convienen en someterse a la Jurisdicción de los
          Tribunales Federales de la Ciudad de Buenos Aires.
        </p>
      </div>
    </div>
    </ModalBase>
  );
};

export default TermsAndConditions;

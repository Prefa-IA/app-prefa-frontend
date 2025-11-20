import React from 'react';

import { TermsAndConditionsProps } from '../../types/components';
import ModalBase from '../generales/ModalBase';

import TermsAndConditionsIntro from './TermsAndConditionsIntro';
import TermsAndConditionsSections from './TermsAndConditionsSections';

const TermsAndConditionsStyles: React.FC = () => (
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
);

const TermsAndConditionsContent: React.FC = () => (
  <div className="tyc-container">
    <TermsAndConditionsIntro />
    <TermsAndConditionsSections />
  </div>
);

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ onClose }) => (
  <ModalBase title="Términos y Condiciones" onClose={onClose} hideConfirm>
    <div className="prose max-w-none">
      <TermsAndConditionsStyles />
      <TermsAndConditionsContent />
    </div>
  </ModalBase>
);

export default TermsAndConditions;

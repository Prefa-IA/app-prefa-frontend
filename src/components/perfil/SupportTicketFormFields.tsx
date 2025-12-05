import React from 'react';

interface SupportTicketFormFieldsProps {
  subject: string;
  setSubject: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
}

const SupportTicketFormFields: React.FC<SupportTicketFormFieldsProps> = ({
  subject,
  setSubject,
  description,
  setDescription,
}) => (
  <>
    <div>
      <label
        htmlFor="subject"
        className="block text-sm font-medium text-gray-900 dark:text-gray-100"
      >
        Asunto
      </label>
      <input
        id="subject"
        type="text"
        value={subject}
        placeholder="Asunto"
        onChange={(e) => setSubject(e.target.value)}
        className="mt-1 w-full border rounded-md px-3 py-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        required
      />
    </div>
    <div>
      <label
        htmlFor="description"
        className="block text-sm font-medium text-gray-900 dark:text-gray-100"
      >
        Descripción
      </label>
      <textarea
        id="description"
        value={description}
        placeholder="Descripción del problema o consulta..."
        onChange={(e) => setDescription(e.target.value)}
        className="mt-1 w-full border rounded-md px-3 py-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        rows={4}
        required
      />
    </div>
  </>
);

export default SupportTicketFormFields;

import React from 'react';

interface TutorialStepProps {
  title: string;
  description: string;
  image?: string;
  children?: React.ReactNode;
}

export const TutorialStep: React.FC<TutorialStepProps> = ({
  title,
  description,
  image,
  children,
}) => {
  return (
    <div className="space-y-6">
      {image && (
        <div className="flex justify-center">
          <img
            src={image}
            alt={title}
            className="max-w-full h-auto rounded-lg shadow-md max-h-64 object-contain"
          />
        </div>
      )}
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">{description}</p>
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
};

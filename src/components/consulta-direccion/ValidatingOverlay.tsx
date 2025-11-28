import React from 'react';

const ValidatingOverlay: React.FC = () => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 sm:p-0">
    <div className="w-full sm:w-auto px-6 sm:px-10 py-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/30 shadow-lg text-center text-white space-y-4">
      <div className="animate-pulse text-xl font-semibold">
        Validando si su lote es enrase o APH…
      </div>
    </div>
  </div>
);

export default ValidatingOverlay;

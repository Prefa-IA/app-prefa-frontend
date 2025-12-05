import React from 'react';

interface SearchOverlayProps {
  seconds: number;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ seconds }) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 sm:p-0">
    <div className="w-full sm:w-auto px-6 sm:px-10 py-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/30 shadow-lg text-center text-white space-y-4">
      <div className="animate-pulse text-xl font-semibold">Buscando direccion…</div>
      <div className="text-4xl font-extrabold tracking-wider">{seconds}s</div>
    </div>
  </div>
);

export default SearchOverlay;

import React, { useEffect, useState } from 'react';

interface Props {
  label: string;
  description: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

// Helpers
const hexToRgb = (hex: string) => {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(ch => ch + ch).join('');
  const num = parseInt(c, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
};

const rgbToHex = (r: number, g: number, b: number) =>
  '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');

const parseColor = (val: string) => {
  if (val.startsWith('rgba')) {
    const match = val.match(/rgba\s*\(([^)]+)\)/);
    if (match?.[1]) {
      const [r, g, b, a] = match[1].split(',').map(p => p.trim());
      return {
        hex: rgbToHex(Number(r), Number(g), Number(b)),
        alpha: a !== undefined ? parseFloat(a) : 1,
      } as const;
    }
  }
  return { hex: val, alpha: 1 } as const;
};

const ColorPicker: React.FC<Props> = ({ label, description, value, onChange, disabled }) => {
  const initial = parseColor(value);
  const [hex, setHex] = useState(initial.hex);
  const [alpha, setAlpha] = useState(initial.alpha);

  // Mantener sincronización externa→interna
  useEffect(() => {
    const parsed = parseColor(value);
    setHex(parsed.hex);
    setAlpha(parsed.alpha);
  }, [value]);

  const emitChange = (newHex: string, newAlpha: number) => {
    const { r, g, b } = hexToRgb(newHex);
    const cssColor = newAlpha >= 1 ? newHex : `rgba(${r},${g},${b},${newAlpha.toFixed(2)})`;
    onChange(cssColor);
  };

  const handleHexChange = (newVal: string) => {
    setHex(newVal);
    emitChange(newVal, alpha);
  };

  const handleAlphaChange = (aPerc: number) => {
    const newAlpha = aPerc / 100;
    setAlpha(newAlpha);
    emitChange(hex, newAlpha);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-900">{label}</label>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <div className="flex items-center space-x-4">
        <div
          className="w-12 h-12 rounded-lg border-2 border-gray-200 shadow-sm"
          style={{ backgroundColor: alpha >= 1 ? hex : `rgba(${hexToRgb(hex).r},${hexToRgb(hex).g},${hexToRgb(hex).b},${alpha})` }}
        />
        <input
          type="color"
          value={hex}
          onChange={e => handleHexChange(e.target.value)}
          disabled={disabled}
          className="w-20 h-12 border border-gray-300 rounded-lg cursor-pointer disabled:opacity-50"
        />
        <input
          type="text"
          value={hex}
          onChange={e => handleHexChange(e.target.value)}
          disabled={disabled}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-50"
        />
      </div>
      {/* Control de opacidad: solo visible en modo edición */}
      {!disabled && (
        <div className="flex items-center space-x-3">
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(alpha * 100)}
            onChange={e => handleAlphaChange(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-xs w-12 text-right">{Math.round(alpha * 100)}%</span>
        </div>
      )}
    </div>
  );
};

export default ColorPicker; 
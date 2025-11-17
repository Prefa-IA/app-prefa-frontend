import React, { useEffect, useState } from 'react';

import { ColorPickerProps } from '../../types/components';
import { hexToRgb, parseColor } from '../../utils/color-utils';

const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  description,
  value,
  onChange,
  disabled,
}) => {
  const initial = parseColor(value);
  const [hex, setHex] = useState(initial.hex);
  const [alpha, setAlpha] = useState(initial.alpha);

  useEffect(() => {
    const parsed = parseColor(value);
    setHex(parsed.hex);
    setAlpha(parsed.alpha);
  }, [value]);

  const emitChange = (newHex: string, newAlpha: number) => {
    const rgb = hexToRgb(newHex);
    const cssColor =
      newAlpha >= 1 ? newHex : `rgba(${rgb.r},${rgb.g},${rgb.b},${newAlpha.toFixed(2)})`;
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
        <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
          {label}
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <div className="flex flex-wrap items-center space-x-1 sm:space-x-4">
        <div
          className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-sm"
          style={{
            backgroundColor:
              alpha >= 1
                ? hex
                : (() => {
                    const rgb = hexToRgb(hex);
                    return `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
                  })(),
          }}
        />
        <input
          type="color"
          value={hex}
          onChange={(e) => handleHexChange(e.target.value)}
          disabled={disabled}
          className="w-16 h-8 sm:w-20 sm:h-12 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer disabled:opacity-50"
        />
        <input
          type="text"
          value={hex}
          onChange={(e) => handleHexChange(e.target.value)}
          disabled={disabled}
          className="w-1/2 sm:flex-1 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-[10px] sm:text-sm disabled:bg-gray-50 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
      </div>
      {!disabled && (
        <div className="flex items-center space-x-3">
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(alpha * 100)}
            onChange={(e) => handleAlphaChange(Number(e.target.value))}
            className="flex-1 accent-primary-600 dark:accent-primary-500"
          />
          <span className="text-xs w-12 text-right text-gray-700 dark:text-gray-100">
            {Math.round(alpha * 100)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;

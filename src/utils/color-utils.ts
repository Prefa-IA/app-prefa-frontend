export const hexToRgb = (hex: string) => {
  let c = hex.replace('#', '');
  if (c.length === 3)
    c = c
      .split('')
      .map((ch) => ch + ch)
      .join('');
  const num = parseInt(c, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
};

export const rgbToHex = (r: number, g: number, b: number) =>
  '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');

export const parseColor = (val: string) => {
  if (val.startsWith('rgba')) {
    const match = val.match(/rgba\s*\(([^)]+)\)/);
    if (match?.[1]) {
      const [r, g, b, a] = match[1].split(',').map((p) => p.trim());
      return {
        hex: rgbToHex(Number(r), Number(g), Number(b)),
        alpha: a !== undefined ? parseFloat(a) : 1,
      } as const;
    }
  }
  return { hex: val, alpha: 1 } as const;
};

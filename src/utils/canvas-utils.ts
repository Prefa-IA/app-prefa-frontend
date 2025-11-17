import { CanvasDrawingProps } from '../types/enums';

export const toNumber = (value: string | number | undefined): number | undefined => {
  if (typeof value === 'string') return parseFloat(value);
  return value;
};

export const calculateBounds = (coordinates: [number, number][]) => {
  const minLat = Math.min(...coordinates.map((coord) => coord[1]));
  const maxLat = Math.max(...coordinates.map((coord) => coord[1]));
  const minLon = Math.min(...coordinates.map((coord) => coord[0]));
  const maxLon = Math.max(...coordinates.map((coord) => coord[0]));

  return { minLat, maxLat, minLon, maxLon };
};

export const calculateScale = (
  bounds: ReturnType<typeof calculateBounds>,
  canvasWidth: number,
  canvasHeight: number,
  padding: number = 80
) => {
  const latRange = bounds.maxLat - bounds.minLat;
  const lonRange = bounds.maxLon - bounds.minLon;

  return Math.min((canvasWidth - 2 * padding) / lonRange, (canvasHeight - 2 * padding) / latRange);
};

export const createPixelConverter = (
  bounds: ReturnType<typeof calculateBounds>,
  scale: number,
  canvasHeight: number,
  padding: number = 80
) => {
  return (coord: [number, number]): [number, number] => {
    const x = (coord[0] - bounds.minLon) * scale + padding;
    const y = canvasHeight - (coord[1] - bounds.minLat) * scale - padding;
    return [x, y];
  };
};

export const calculateMidPoints = (
  coordinates: [number, number][],
  toPixels: (coord: [number, number]) => [number, number]
): [number, number][] => {
  if (coordinates.length === 0) return [];
  const firstCoord = coordinates[0];
  if (!firstCoord) return [];
  const firstPoint = toPixels(firstCoord);
  const midPoints: [number, number][] = [];

  coordinates.slice(1).forEach((coord, index) => {
    if (!coord) return;
    const point = toPixels(coord);
    const prevCoord = index === 0 ? firstCoord : coordinates[index];
    if (!prevCoord) return;
    const prevPoint = index === 0 ? firstPoint : toPixels(prevCoord);
    const midX = (prevPoint[0] + point[0]) / 2;
    const midY = (prevPoint[1] + point[1]) / 2;
    midPoints.push([midX, midY]);
  });

  const lastCoord = coordinates[coordinates.length - 1];
  if (!lastCoord) return midPoints;
  const lastPoint = toPixels(lastCoord);
  const midX = (lastPoint[0] + firstPoint[0]) / 2;
  const midY = (lastPoint[1] + firstPoint[1]) / 2;
  midPoints.push([midX, midY]);

  return midPoints;
};

export const drawParcelShape = (
  ctx: CanvasRenderingContext2D,
  coordinates: [number, number][],
  toPixels: (coord: [number, number]) => [number, number]
) => {
  if (coordinates.length === 0) return;
  const firstCoord = coordinates[0];
  if (!firstCoord) return;
  ctx.beginPath();
  const firstPoint = toPixels(firstCoord);
  ctx.moveTo(firstPoint[0], firstPoint[1]);

  coordinates.slice(1).forEach((coord) => {
    if (!coord) return;
    const point = toPixels(coord);
    ctx.lineTo(point[0], point[1]);
  });

  ctx.closePath();

  ctx.fillStyle = 'rgba(3, 105, 161, 0.3)';
  ctx.strokeStyle = '#0369A1';
  ctx.lineWidth = 2;

  ctx.fill();
  ctx.stroke();
};

export const drawMeasurements = (
  ctx: CanvasRenderingContext2D,
  midPoints: [number, number][],
  datosCatastrales?: CanvasDrawingProps['datosCatastrales']
) => {
  if (!datosCatastrales) return;

  ctx.font = '12px Arial';
  ctx.fillStyle = '#000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const frente = toNumber(datosCatastrales.frente);
  const fondo = toNumber(datosCatastrales.fondo);

  if (frente && midPoints[0]) {
    ctx.fillText(`${frente}m`, midPoints[0][0], midPoints[0][1] - 10);
  }
  if (fondo && midPoints[2]) {
    ctx.fillText(`${fondo}m`, midPoints[2][0], midPoints[2][1] + 20);
  }
};

export const drawParcelInfo = (
  ctx: CanvasRenderingContext2D,
  datosCatastrales?: CanvasDrawingProps['datosCatastrales'],
  datosEdificabilidad?: CanvasDrawingProps['datosEdificabilidad'],
  padding: number = 80
) => {
  ctx.font = '14px Arial';
  ctx.textAlign = 'left';
  let yPos = 30;

  if (datosCatastrales?.superficie_total) {
    const superficie = toNumber(datosCatastrales.superficie_total);
    if (superficie) {
      ctx.fillText(`Superficie: ${superficie.toFixed(2)} m²`, padding, yPos);
      yPos += 20;
    }
  }

  if (datosEdificabilidad?.altura_max?.[0]) {
    const altura = toNumber(datosEdificabilidad.altura_max[0]);
    if (altura) {
      ctx.fillText(`Altura máxima: ${altura}m + 2R`, padding, yPos);
      yPos += 20;
    }
  }

  if (datosEdificabilidad?.fot?.fot_medianera) {
    const fot = toNumber(datosEdificabilidad.fot.fot_medianera);
    if (fot) {
      ctx.fillText(`FOT: ${fot}`, padding, yPos);
    }
  }
};

export const drawNorthArrow = (
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  arrowSize: number = 30
) => {
  const arrowX = canvasWidth - arrowSize - 20;
  const arrowY = arrowSize + 20;

  ctx.beginPath();
  ctx.moveTo(arrowX, arrowY);
  ctx.lineTo(arrowX, arrowY - arrowSize);
  ctx.lineTo(arrowX - arrowSize / 4, arrowY - arrowSize / 2);
  ctx.moveTo(arrowX, arrowY - arrowSize);
  ctx.lineTo(arrowX + arrowSize / 4, arrowY - arrowSize / 2);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.font = '16px Arial';
  ctx.fillStyle = '#000';
  ctx.textAlign = 'center';
  ctx.fillText('N', arrowX, arrowY - arrowSize - 5);
};

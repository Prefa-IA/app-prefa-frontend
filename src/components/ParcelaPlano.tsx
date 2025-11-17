import React, { useEffect, useRef } from 'react';

import { PARCEL_MAP_CONFIG, ParcelaPlanoProps } from '../types/enums';
import {
  calculateBounds,
  calculateMidPoints,
  calculateScale,
  createPixelConverter,
  drawMeasurements,
  drawNorthArrow,
  drawParcelInfo,
  drawParcelShape,
} from '../utils/canvas-utils';

const ParcelaPlano: React.FC<ParcelaPlanoProps> = ({
  coordinates,
  datosCatastrales,
  datosEdificabilidad,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !coordinates || coordinates.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawParcelCanvas(canvas, ctx, coordinates, datosCatastrales, datosEdificabilidad);
  }, [coordinates, datosCatastrales, datosEdificabilidad]);

  return <ParcelCanvas ref={canvasRef} />;
};

const drawParcelCanvas = (
  _canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  coordinates: [number, number][],
  datosCatastrales?: ParcelaPlanoProps['datosCatastrales'],
  datosEdificabilidad?: ParcelaPlanoProps['datosEdificabilidad']
) => {
  const { WIDTH: width, HEIGHT: height } = PARCEL_MAP_CONFIG.CANVAS_DIMENSIONS;
  const padding = 80;

  ctx.clearRect(0, 0, width, height);

  const bounds = calculateBounds(coordinates);
  const scale = calculateScale(bounds, width, height, padding);
  const toPixels = createPixelConverter(bounds, scale, height, padding);

  drawParcelShape(ctx, coordinates, toPixels);

  const midPoints = calculateMidPoints(coordinates, toPixels);
  drawMeasurements(ctx, midPoints, datosCatastrales);

  drawParcelInfo(ctx, datosCatastrales, datosEdificabilidad, padding);

  drawNorthArrow(ctx, width);
};

const ParcelCanvas = React.forwardRef<HTMLCanvasElement>((_props, ref) => (
  <canvas
    ref={ref}
    width={PARCEL_MAP_CONFIG.CANVAS_DIMENSIONS.WIDTH}
    height={PARCEL_MAP_CONFIG.CANVAS_DIMENSIONS.HEIGHT}
    style={{
      width: PARCEL_MAP_CONFIG.STYLE.WIDTH,
      height: PARCEL_MAP_CONFIG.STYLE.HEIGHT,
      backgroundColor: '#fff',
    }}
  />
));

ParcelCanvas.displayName = 'ParcelCanvas';

export default ParcelaPlano;

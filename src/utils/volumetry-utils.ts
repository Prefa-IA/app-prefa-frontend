export interface FloorProfile {
  level: number; // 0 = PB
  heightStart: number; // meters from ground
  heightEnd: number;
  retreat: number; // porcentaje de retiro lateral 0..1
}

const FLOOR_HEIGHT = 3.2;

export const getVolumetryProfile = (alturaMax: number): FloorProfile[] => {
  const thresholds = [12, 16.5, 20];
  const floorCount = Math.ceil(alturaMax / FLOOR_HEIGHT);
  const floors: FloorProfile[] = Array.from({ length: floorCount }, (_, i) => {
    const hStart = i * FLOOR_HEIGHT;
    const hEnd = Math.min((i + 1) * FLOOR_HEIGHT, alturaMax);
    const retreatsCrossed = thresholds.filter((t) => hEnd > t).length;
    const retreatPercent = retreatsCrossed * 0.1;
    return { level: i, heightStart: hStart, heightEnd: hEnd, retreat: retreatPercent };
  });
  return floors;
};

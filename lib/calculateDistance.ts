export default function calculateDistance(from: [number, number], to: [number, number]): number {
  const R = 6371e3;
  const fi1 = (from[0] * Math.PI) / 180;
  const fi2 = (to[0] * Math.PI) / 180;
  const deltaFi = ((to[0] - from[0]) * Math.PI) / 180;
  const deltaLambda = ((to[1] - from[1]) * Math.PI) / 180;

  const a =
    Math.sin(deltaFi / 2) * Math.sin(deltaFi / 2) +
    Math.cos(fi1) * Math.cos(fi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return parseFloat((R * c).toFixed(2));
}

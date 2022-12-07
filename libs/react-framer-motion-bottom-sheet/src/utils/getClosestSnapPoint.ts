export const getClosestSnapPoint = (snapPoints: number[], y: number) => {
  return snapPoints.reduce((prev, current) => {
    return Math.abs(current - y) < Math.abs(prev - y) ? current : prev;
  });
};

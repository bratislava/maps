export const getClosestSnapPoint = (snapPoints: number[], y: number) => {
  const closestSnapPointHeight = snapPoints.reduce((prev, current) => {
    return Math.abs(current - y) < Math.abs(prev - y) ? current : prev;
  });
  const closestSnapPointIndex = snapPoints.findIndex(
    (foundSnapPoint) => foundSnapPoint === closestSnapPointHeight
  );

  return { height: closestSnapPointHeight, index: closestSnapPointIndex };
};

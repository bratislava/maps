import { Feature } from "geojson";

export type LteExp = ["<=", string, any];

export const lte = (
  exp: LteExp,
  f: Feature,
  evaluate: (value: any, f: Feature) => any,
): boolean => {
  const [propertyName, subExp] = exp.slice(1) as [string, any];

  const propertyValue = f.properties?.[propertyName];
  const subExpValue = evaluate(subExp, f);

  if (typeof propertyValue !== typeof subExpValue) {
    return false;
  }

  if (propertyValue > subExpValue) {
    return false;
  }

  return true;
};

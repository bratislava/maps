import { Feature } from "geojson";

/*
Returns true if the input values are equal, false otherwise.
The comparison is strictly typed:
values of different runtime types are always considered unequal.

["==", value, value]: boolean

*/

export type EqualsExp = ["==", string, any];

export const equals = (
  exp: EqualsExp,
  f: Feature,
  evaluate: (value: any, f: Feature) => any,
): boolean => {
  const [propertyName, subExp] = exp.slice(1) as [string, any];

  const propertyValue = f.properties?.[propertyName];
  const subExpValue = evaluate(subExp, f);

  if (typeof propertyValue !== typeof subExpValue) {
    return false;
  }

  if (propertyValue !== subExpValue) {
    return false;
  }

  return true;
};

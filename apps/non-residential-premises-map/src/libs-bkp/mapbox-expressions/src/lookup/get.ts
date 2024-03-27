import { Feature } from "geojson";

/*

Retrieves a property value from the current feature's properties.
Returns null if the requested property is missing. 

["get", string]: value

*/

export type GetExp = ["get", any];

export const get = (
  exp: GetExp,
  f: Feature,
  evaluate: (value: any, f: Feature) => any,
): string | number | null => {
  const subExp = exp.slice(1)[0];
  const result = evaluate(subExp, f);
  return f.properties?.[result] ?? null;
};

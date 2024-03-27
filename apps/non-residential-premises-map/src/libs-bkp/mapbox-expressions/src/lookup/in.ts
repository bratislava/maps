import { Feature } from "geojson";

/*

Determines whether an item exists in an array.

["in", string, string[]]: boolean

*/

export type InExp = ["in", string, string[]];

export const inside = (
  exp: InExp,
  f: Feature,
  evaluate: (value: any, f: Feature) => any,
): boolean => {
  const keyword = exp[1];
  const array = evaluate(exp[2], f);
  return array.includes(keyword);
};

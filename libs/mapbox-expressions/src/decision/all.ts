import { Feature } from "geojson";

/*

Returns true if all the inputs are true, false otherwise.
The inputs are evaluated in order, and evaluation is short-circuiting:
once an input expression evaluates to false,
the result is false and no further input expressions are evaluated.


["all", boolean, boolean, ...]: boolean

*/

export type AllExp = ["all", ...any[]];

export const all = (
  exp: AllExp,
  f: Feature,
  evaluate: (value: any, f: Feature) => any,
): boolean => {
  const subExps = exp.slice(1) as boolean[];
  for (const subExp of subExps) {
    if (evaluate(subExp, f) !== true) return false;
  }
  return true;
};

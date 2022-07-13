import { Feature } from "geojson";

/*

Returns true if any of the inputs are true, false otherwise.
The inputs are evaluated in order, and evaluation is short-circuiting:
once an input expression evaluates to true,
the result is true and no further input expressions are evaluated.

["any", boolean, boolean, ...]: boolean

*/

export type AnyExp = ["any", ...any[]];

export const any = (
  exp: AnyExp,
  f: Feature,
  evaluate: (value: any, f: Feature) => any,
): boolean => {
  const subExps = exp.slice(1);
  for (const subExp of subExps) {
    if (evaluate(subExp, f) === true) return true;
  }
  return false;
};

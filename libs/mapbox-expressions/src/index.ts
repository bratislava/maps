import { Feature } from "geojson";

import { all, AllExp } from "./decision/all";
import { any, AnyExp } from "./decision/any";
import { equals, EqualsExp } from "./decision/equals";
import { get, GetExp } from "./lookup/get";
import { InExp, inside } from "./lookup/in";

export type Exp = AllExp | AnyExp | EqualsExp | GetExp | InExp;

type ExpKey = Exp[0];

export type Value = boolean | string | null | number;

export type ExpOrValue = Exp | Value;

export const evaluate = (exp: ExpOrValue, f: Feature) => {
  if (Array.isArray(exp)) {
    const key = exp[0];

    switch (key) {
      case "all":
        return all(exp, f, evaluate);

      case "any":
        return any(exp, f, evaluate);

      case "get":
        return get(exp, f, evaluate);

      case "in":
        return inside(exp, f, evaluate);

      case "==":
        return equals(exp, f, evaluate);
    }
  }

  return exp;
};

import { useEffect, EffectCallback, DependencyList } from "react";
import { usePrevious } from "./usePrevious";

export const useEffectDebugger = (
  effectHook: EffectCallback,
  dependencies: DependencyList,
  dependencyNames: string[] = [],
  name?: string
) => {
  const previousDeps = usePrevious(dependencies);

  const changedDeps =
    process.env.NODE_ENV === "development"
      ? dependencies.reduce(
          (
            accum: { [key: string]: { before: unknown; after: unknown } },
            dependency,
            index
          ) => {
            if (previousDeps && dependency !== previousDeps[index]) {
              const keyName = dependencyNames[index] || index;
              return {
                ...accum,
                [keyName]: {
                  before: previousDeps[index],
                  after: dependency,
                },
              };
            }

            return accum;
          },
          {} as { [key: string]: { before: unknown; after: unknown } }
        )
      : {};

  if (Object.keys(changedDeps).length) {
    console.log(name ?? "[use-effect-debugger]", changedDeps);
  }

  useEffect(effectHook, dependencies);
};
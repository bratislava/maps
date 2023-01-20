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
  
  // for some reason we need this retype, even if inferred type should be the same ?
  // likely it uses the vite augmented type if used this way but infers the node type if we use just import.meta
  // was not able to explicitly import this type though - so if this breaks, find a way to do it
  // alternatively, find what is this for and find a different way to do it
  const importMeta = import.meta as ImportMeta

  if (Object.keys(changedDeps).length && importMeta?.env?.DEV) {
    console.log(name ?? "[use-effect-debugger]", changedDeps);
  }

  useEffect(effectHook, dependencies);
};

import { IActiveFilter } from "@bratislava/react-maps-ui";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FilterExpression, IFilterResult } from "./useFilter";

export interface ICombinedFilterResult {
  expression: FilterExpression;
  active: IActiveFilter[];
  areDefault: boolean;
  reset: () => void;
}

export interface IUseCombineFilterProps {
  combiner: string;
  filters: {
    filter: IFilterResult<any>;
    mapToActive: (activeKeys: string[]) => IActiveFilter;
  }[];
}

export const useCombinedFilter = ({
  combiner,
  filters,
}: IUseCombineFilterProps): ICombinedFilterResult => {
  const areDefault = useMemo(() => {
    return filters.every((f) => f.filter.areDefault);
  }, [filters]);

  const reset = useCallback(() => {
    filters.forEach((f) => f.filter.reset());
  }, [filters]);

  const expression = useMemo(() => {
    const exp: FilterExpression = [combiner];

    filters.forEach((f) => {
      if (f.filter.expression && f.filter.expression.length)
        exp.push(f.filter.expression);
    });

    return exp;
  }, [combiner, filters]);

  const active = useMemo(() => {
    return filters.map((f) => f.mapToActive(f.filter.activeKeys));
  }, [filters]);

  return {
    expression,
    active,
    areDefault,
    reset,
  };
};

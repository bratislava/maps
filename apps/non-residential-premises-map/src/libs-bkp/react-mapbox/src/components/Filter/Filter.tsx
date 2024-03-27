import {
  evaluate,
  ExpOrValue,
} from '../../../../../libs/mapbox-expressions/src';
import { Feature } from 'geojson';
import { createContext, ReactNode, useCallback, useMemo } from 'react';

export interface IFilterProps {
  expression?: any;
  children?: ReactNode;
}

export interface IFilterContext {
  expression: any;
  isFeatureVisible?: (feature: Feature) => boolean;
}

export const filterContext = createContext<IFilterContext>({
  expression: [],
});

export const Filter = ({ expression = [], children }: IFilterProps) => {
  const isFeatureVisible = useCallback(
    (feature: Feature) => {
      const result = evaluate(expression as ExpOrValue, feature);
      return !!result;
    },
    [expression],
  );

  const filterContextValue: IFilterContext = useMemo(() => {
    return {
      expression,
      isFeatureVisible,
    };
  }, [expression, isFeatureVisible]);

  return (
    <filterContext.Provider value={filterContextValue}>
      {children}
    </filterContext.Provider>
  );
};

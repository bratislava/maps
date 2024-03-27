import { IActiveFilter } from '../../../../libs/react-maps-ui';
import { FilterExpression, IFilterResult } from './useFilter';
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
        onlyInExpression?: boolean;
        keepOnEmpty?: boolean;
    }[];
}
export declare const useCombinedFilter: ({ combiner, filters, }: IUseCombineFilterProps) => ICombinedFilterResult;

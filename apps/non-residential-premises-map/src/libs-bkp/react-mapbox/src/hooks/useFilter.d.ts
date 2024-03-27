export type FilterExpression = (string | boolean | FilterExpression)[];
export type IValues<Key extends string> = {
    [key in Key]: boolean;
};
export interface IFilterValue<Key> {
    key: Key;
    isActive: boolean;
}
export type ComparatorFunction = ({ value, property, }: {
    value: any;
    property: string;
}) => FilterExpression;
export interface IUseFilterProps<Key extends string> {
    property: string;
    keys: Key[];
    defaultValues?: IValues<Key>;
    comparator?: ComparatorFunction;
    combiner?: 'any' | 'all';
}
export interface IFilterResult<Key> {
    expression: FilterExpression;
    keepOnEmptyExpression: FilterExpression;
    values: IFilterValue<Key>[];
    activeKeys: Key[];
    keys: Key[];
    areDefault: boolean;
    setActive: (keys: Key | Key[], value?: boolean) => void;
    setActiveAll: (value?: boolean) => void;
    setActiveOnly: (keys: Key | Key[], value?: boolean) => void;
    toggleActive: (keys: Key) => void;
    reset: () => void;
    isAnyKeyActive: (keys?: Key[]) => boolean;
    areKeysActive: (keys: Key | Key[]) => boolean;
    areKeysInactive: (keys: Key | Key[]) => boolean;
}
export declare const useFilter: <Key extends string>({ property, keys, defaultValues, comparator, combiner, }: IUseFilterProps<Key>) => IFilterResult<Key>;

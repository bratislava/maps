import { useCallback, useEffect, useMemo, useState } from "react";

export type FilterExpression = (string | boolean | FilterExpression)[];

export type IValues<Key extends string> = {
  [key in Key]: boolean;
};

export interface IFilterValue<Key> {
  key: Key;
  isActive: boolean;
}

export interface IUseFilterProps<Key extends string> {
  property: string;
  keys: Key[];
  defaultValues?: IValues<Key>;
}

export interface IFilterResult<Key> {
  expression: FilterExpression;
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

export const useFilter = <Key extends string>({
  property,
  keys,
  defaultValues,
}: IUseFilterProps<Key>): IFilterResult<Key> => {
  const [expression, setExpression] = useState<FilterExpression | null>(null);
  const [valuesObject, setValuesObject] = useState<IValues<Key>>(
    {} as IValues<Key>
  );
  const [defaultValuesObject, setDefaultValuesObject] = useState<IValues<Key>>(
    {} as IValues<Key>
  );

  useEffect(() => {
    setDefaultValuesObject(
      keys.reduce((prev, key) => {
        prev[key] = defaultValues?.[key] ?? false;
        return prev;
      }, {} as IValues<Key>)
    );
  }, [defaultValues, keys]);

  useEffect(() => {
    const activeKeys = keys.filter((key) => valuesObject[key]);
    setExpression(
      activeKeys.length
        ? ["any", ...activeKeys.map((key) => ["==", property, key])]
        : null
    );
  }, [property, keys, valuesObject]);

  const values: IFilterValue<Key>[] = useMemo(() => {
    return keys.map((key) => ({ key, isActive: valuesObject[key] }));
  }, [keys, valuesObject]);

  const activeKeys = useMemo(
    () => keys.filter((key) => valuesObject[key]),
    [keys, valuesObject]
  );

  const areDefault = useMemo(
    () => JSON.stringify(valuesObject) === JSON.stringify(defaultValuesObject),
    [valuesObject, defaultValuesObject]
  );

  const setActive = useCallback((inputKeys: Key | Key[], value = true) => {
    if (Array.isArray(inputKeys)) {
      setValuesObject((valuesObject) => ({
        ...valuesObject,
        ...inputKeys.reduce((prev, key) => {
          prev[key] = value;
          return prev;
        }, {} as IValues<Key>),
      }));
    } else {
      setValuesObject((valuesObject) => ({
        ...valuesObject,
        [inputKeys]: value,
      }));
    }
  }, []);

  const setActiveAll = useCallback(
    (value = true) => {
      setValuesObject(
        keys.reduce((prev, key) => {
          prev[key] = value;
          return prev;
        }, {} as IValues<Key>)
      );
    },
    [keys]
  );

  const setActiveOnly = useCallback(
    (activeKeys: Key | Key[]) => {
      setValuesObject(
        keys.reduce((prev, key) => {
          prev[key] =
            (activeKeys === key || activeKeys?.includes(key)) ?? false;
          return prev;
        }, {} as IValues<Key>)
      );
    },
    [keys]
  );

  const toggleActive = useCallback((key: Key) => {
    setValuesObject((values) => ({ ...values, [key]: !values[key] }));
  }, []);

  const reset = useCallback(() => {
    setValuesObject(
      keys.reduce((prev, key) => {
        prev[key] = defaultValuesObject?.[key] ?? false;
        return prev;
      }, {} as IValues<Key>)
    );
  }, [keys, defaultValuesObject]);

  useEffect(() => {
    reset();
  }, [reset]);

  const isAnyKeyActive = useCallback(
    (inputKeys?: Key[]) => {
      const k = inputKeys ?? keys;
      for (const key of k) {
        if (valuesObject[key]) return true;
      }
      return false;
    },
    [keys, valuesObject]
  );

  const areKeysActive = useCallback(
    (keys: Key | Key[]) => {
      if (Array.isArray(keys)) {
        for (const key of keys) {
          if (!valuesObject[key]) return false;
        }
        return true;
      }
      return !!valuesObject[keys];
    },
    [valuesObject]
  );

  const areKeysInactive = useCallback(
    (keys: Key | Key[]) => {
      if (Array.isArray(keys)) {
        for (const key of keys) {
          if (!valuesObject[key]) return true;
        }
        return false;
      }
      return !!valuesObject[keys];
    },
    [valuesObject]
  );

  return {
    expression: expression ?? [],
    values,
    activeKeys,
    keys,
    areDefault,
    setActive,
    setActiveAll,
    toggleActive,
    reset,
    isAnyKeyActive,
    areKeysActive,
    areKeysInactive,
    setActiveOnly,
  };
};

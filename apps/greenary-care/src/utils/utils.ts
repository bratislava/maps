import { DISTRICTS } from "@bratislava/mapbox-maps-core";
import { getSelectOptionsFromStringArray } from "@bratislava/mapbox-maps-ui";
import { getUniqueValuesFromFeatures } from "@bratislava/maps-utils";

export interface KeyStateRecord<T> {
  key: string;
  state: T;
}

export const processData = (
  data: any,
  categories: { label: string; types: string[] }[]
) => {
  const typesFromDefinedCategories = categories.reduce(
    (allTypes: string[], category) => {
      category.types.forEach((type) => {
        if (!allTypes.includes(type)) {
          allTypes.push(type);
        }
      });
      return allTypes;
    },
    []
  );

  const uniqueYears: string[] = getUniqueValuesFromFeatures(
    data.features,
    "year"
  );

  const uniqueTypes: string[] = getUniqueValuesFromFeatures(
    data.features,
    "TYP_VYKONU_1"
  );

  const otherTypes = uniqueTypes.filter(
    (uniqueType) =>
      !typesFromDefinedCategories.find(
        (typeFromDefinedCategories) => typeFromDefinedCategories == uniqueType
      )
  );

  const typeFiltersState = uniqueTypes.map((uniqueType) => {
    return {
      key: uniqueType,
      state: true,
    };
  });

  const yearOptions = getSelectOptionsFromStringArray(uniqueYears);
  const districtOptions = getSelectOptionsFromStringArray(DISTRICTS);

  return {
    uniqueTypes,
    otherTypes,
    typeFiltersState,
    yearOptions,
    districtOptions,
  };
};

export const getKeyStateValue = <T>(
  state: KeyStateRecord<T>[],
  key: string
) => {
  const foundState = state.find((item) => item.key == key);
  return foundState ? foundState.state : undefined;
};

export const enableKeyStateValue = (
  state: KeyStateRecord<boolean>[],
  key: string
) => {
  const foundState = state.find((item) => item.key == key);
  if (foundState) {
    foundState.state = true;
  }
  return [...state];
};

export const disableKeyStateValue = (
  state: KeyStateRecord<boolean>[],
  key: string
) => {
  const foundState = state.find((item) => item.key == key);
  if (foundState) {
    foundState.state = false;
  }
  return [...state];
};

export const toggleKeyStateValue = (
  state: KeyStateRecord<boolean>[],
  key: string
) => {
  const foundState = state.find((item) => item.key == key);
  if (foundState) {
    foundState.state = !foundState.state;
  }
  return [...state];
};

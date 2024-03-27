import { Season } from "./types";
import { Feature } from "geojson";

export * from "./hooks/usePrevious";
export * from "./hooks/useEffectDebugger";

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

// jar: marec - jún 20.3. - 20.6:
// leto: jún - september 21.6. - 22.9.
// jeseň: september - december 23.9. - 20.12.
// zima: december - marec 21.12. - 19.3.
export const getSeasonFromDate = (
  input: number | string | Date
): Season | null => {
  const date = new Date(input);

  const month = date.getMonth() + 1;
  const day = date.getDate();

  let season: Season | null = null;

  switch (month) {
    case 1:
    case 2:
      season = "winter";
      break;
    case 3:
      if (day < 20) {
        season = "winter";
      } else {
        season = "spring";
      }
      break;
    case 4:
    case 5:
      season = "spring";
      break;
    case 6:
      if (day < 21) {
        season = "spring";
      } else {
        season = "summer";
      }
      break;
    case 7:
    case 8:
      season = "summer";
      break;
    case 9:
      if (day < 23) {
        season = "summer";
      } else {
        season = "autumn";
      }
      break;
    case 10:
    case 11:
      season = "autumn";
      break;
    case 12:
      if (day < 21) {
        season = "autumn";
      } else {
        season = "winter";
      }
      break;
  }

  return season;
};

export const getRandomItemFrom = <T>(items: T[] | T) => {
  return Array.isArray(items) ? items[getRandomInt(items.length)] : items;
};

export const getUniqueValuesFromFeatures = (
  features: Feature[],
  property: string
) => {
  return features
    .reduce((all: string[], current: any) => {
      const values: string[] = Array.isArray(current.properties[property])
        ? current.properties[property]
        : [current.properties[property]];

      return values.reduce((allCurrent, value) => {
        if (allCurrent.includes(value) || typeof value === "undefined") {
          return allCurrent;
        } else {
          return [...allCurrent, value];
        }
      }, all);
    }, [] as string[])
    .filter((f) => f);
};

export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

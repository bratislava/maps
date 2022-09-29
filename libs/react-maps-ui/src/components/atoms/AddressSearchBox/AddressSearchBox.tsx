import { ComboBox, IOption } from "../ComboBox/ComboBox";
import FlexSearch from "flexsearch";
import slugify from "slugify";
import { ADDRESSES_GEOJSON } from "@bratislava/geojson-data";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Location, MagnifyingGlass, X } from "@bratislava/react-maps-icons";

// create flexsearch index
const index = new FlexSearch.Index({
  encode: (text) =>
    slugify(text, { lower: true, trim: true, replacement: " " }).split(" "),
  tokenize: "full",
});

ADDRESSES_GEOJSON.features.forEach((feature, i) =>
  index.add(i, `${feature.properties.name} ${feature.properties.number}`)
);

export type AddressPointFeature = typeof ADDRESSES_GEOJSON["features"][0];

type IOptionWithFeature = { feature: AddressPointFeature } & IOption;

export interface IAddressSearchBoxProps {
  direction?: "top" | "bottom";
  onResetPress: () => void;
  onAddressPress: (feature: AddressPointFeature) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onGeolocationClick?: () => void;
  isGeolocation?: boolean;
}

export const AddressSearchBox = ({
  direction,
  onResetPress,
  onAddressPress,
  searchQuery,
  onSearchQueryChange,
  onGeolocationClick,
  isGeolocation = false,
}: IAddressSearchBoxProps) => {
  const { t } = useTranslation();

  const filteredOptions = useMemo(() => {
    if (searchQuery && searchQuery.length >= 2) {
      const resultIndexes = index.search(searchQuery, 6);
      return resultIndexes
        .map((resultIndex) => ADDRESSES_GEOJSON.features[resultIndex as number])
        .map((feature) => ({
          value: `${feature.properties.name} ${feature.properties.number}`,
          title: `${feature.properties.name} ${feature.properties.number}`,
          feature,
        }));
    }
    return [];
  }, [searchQuery]);

  const handleOptionPress = useCallback((option: IOptionWithFeature) => {
    onAddressPress(option.feature);
  }, []);

  return (
    <ComboBox
      options={filteredOptions}
      searchQuery={searchQuery}
      onSearchQueryChange={onSearchQueryChange}
      onOptionPress={handleOptionPress}
      placeholder={t("search")}
      rightSlot={
        <div className="absolute right-[3px] gap-[4px] bottom-0 top-0 flex items-center">
          {searchQuery && searchQuery.length && (
            <>
              <button className="p-2" onClick={onResetPress}>
                <X size="sm" />
              </button>
              <div className="h-8 bg-gray-lightmode dark:bg-gray-darkmode opacity-20 w-[2px]"></div>
            </>
          )}
          <div className="p-2">
            <MagnifyingGlass size="lg" />
          </div>
          {onGeolocationClick && (
            <>
              <div className="md:hidden h-8 bg-gray-lightmode dark:bg-gray-darkmode opacity-20 w-[2px]"></div>
              <button
                onClick={onGeolocationClick}
                className="md:hidden h-10 flex items-center justify-center p-2 translate-x-[1px]"
              >
                <Location size="lg" isActive={isGeolocation} />
              </button>
            </>
          )}
        </div>
      }
    />
  );
};

import { IFilterResult } from "@bratislava/react-maps-core";
import { Chevron, Funnel, X } from "@bratislava/react-maps-icons";
import {
  Divider,
  Select,
  TagFilter,
  IActiveFilter,
  ActiveFilters,
  SelectOption,
} from "@bratislava/react-maps-ui";
import cx from "classnames";
import { useTranslation } from "react-i18next";
import { SelectValueRenderer } from "../SelectValueRenderer";

export interface IMobileFiltersProps<Y, D, S, T> {
  isVisible?: boolean;
  setVisible: (isVisible: boolean) => void;
  areFiltersDefault: boolean;
  activeFilters: IActiveFilter[];
  onResetFiltersClick: () => void;
  districtFilter: IFilterResult<D>;
  typeFilter: IFilterResult<S>;
}

export const MobileFilters = <
  Y extends string,
  D extends string,
  S extends string,
  T extends string,
>({
  isVisible,
  setVisible,
  areFiltersDefault,
  activeFilters,
  onResetFiltersClick,
  districtFilter,
  typeFilter,
}: IMobileFiltersProps<Y, D, S, T>) => {
  const { t } = useTranslation();

  return (
    <div
      className={cx(
        "fixed font-medium max-h-full top-0 left-0 bottom-0 w-full z-30 sm:hidden h-full pr-0 bg-background flex gap-6 flex-col transition-all duration-500 overflow-auto",
        { "translate-x-full shadow-lg": !isVisible },
      )}
    >
      <button
        onClick={() => setVisible(false)}
        className="flex items-center px-3 py-3 gap-2 bg-gray
        transition-all bg-opacity-0 hover:bg-opacity-10 focus:bg-opacity-10 active:bg-opacity-20"
      >
        <div className="flex p-2">
          <Chevron direction="left" className="text-primary" />
        </div>
        <h1 className="relative font-medium">{t("title")}</h1>
      </button>

      <div className="-mt-6">
        <ActiveFilters
          areFiltersDefault={areFiltersDefault}
          activeFilters={activeFilters}
          onResetClick={onResetFiltersClick}
        />
      </div>

      <div>
        <div className="flex px-6 items-center">
          <div className="-ml-2">
            <Funnel />
          </div>
          <h2 className="font-bold text-md py-1">{t("filters.title")}</h2>
        </div>

        <div className="w-full flex flex-col">
          <Select
            noBorder
            className="w-full"
            buttonClassName="px-3"
            placeholder={t("filters.district.placeholder")}
            value={districtFilter.activeKeys}
            isMultiple
            onChange={(value) => districtFilter.setActiveOnly((value ?? []) as D[])}
            onReset={() => districtFilter.setActiveAll(false)}
            renderValue={({ values }) => (
              <SelectValueRenderer
                values={values}
                placeholder={t("filters.district.placeholder")}
                multiplePlaceholder={`${t("filters.district.multipleDistricts")} (${
                  values.length
                })`}
              />
            )}
          >
            {districtFilter.keys.map((district) => (
              <SelectOption key={district} value={district}>
                {district}
              </SelectOption>
            ))}
          </Select>
        </div>

        <div className="mt-3">
          <TagFilter
            title={t("filters.type.title")}
            values={typeFilter.values.map((type) => ({
              key: type.key,
              label: t(`filters.type.types.${type.key}`),
              isActive: type.isActive,
            }))}
            onTagClick={(type) => {
              if (typeFilter.activeKeys.length == 4) {
                typeFilter.setActiveOnly(type);
              } else if (!(typeFilter.activeKeys.length == 1 && typeFilter.activeKeys[0] == type)) {
                typeFilter.toggleActive(type);
              }
            }}
          />
        </div>
      </div>

      <Divider className="mx-6" />

      <h2 className="font-bold px-6 text-md">{t("layersLabel")}</h2>

      <button
        onClick={() => setVisible(false)}
        className="flex font-medium py-3 sticky top-full gap-2 justify-center items-center bg-gray transition-all bg-opacity-10 hover:bg-opacity-20 focus:bg-opacity-20 active:bg-opacity-30 hover:underline"
      >
        <span>{t("close")}</span>
        <X className="text-primary" />
      </button>
    </div>
  );
};

import { IFilterResult } from "@bratislava/react-maps-core";
import { Chevron, Funnel, X } from "@bratislava/react-maps-icons";
import {
  Divider,
  Select,
  TagFilter,
  IActiveFilter,
  ActiveFilters,
  SelectOption,
  Sidebar,
} from "@bratislava/react-maps-ui";
import cx from "classnames";
import { useTranslation } from "react-i18next";
import { SelectValueRenderer } from "../SelectValueRenderer";

export interface IMobileFiltersProps<Y, D, S, T> {
  isVisible?: boolean;
  setVisible: (isVisible: boolean | undefined) => void;
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
    <Sidebar title={t("title")} position="right" isVisible={isVisible} setVisible={setVisible}>
      <ActiveFilters
        areFiltersDefault={areFiltersDefault}
        activeFilters={activeFilters}
        onResetClick={onResetFiltersClick}
      />
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
    </Sidebar>
  );
};

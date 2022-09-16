import { IFilterResult } from "@bratislava/react-mapbox";
import { Funnel } from "@bratislava/react-maps-icons";
import {
  Divider,
  Select,
  TagFilter,
  IActiveFilter,
  ActiveFilters,
  SelectOption,
  Sidebar,
  Layers,
  ILayerGroup,
} from "@bratislava/react-maps-ui";
import { useTranslation } from "react-i18next";
import { SelectValueRenderer } from "../SelectValueRenderer";

export interface IMobileFiltersProps<DF, SGF, TF, LF extends string> {
  isVisible?: boolean;
  setVisible: (isVisible: boolean | undefined) => void;
  areFiltersDefault: boolean;
  activeFilters: IActiveFilter[];
  onResetFiltersClick: () => void;
  districtFilter: IFilterResult<DF>;
  tagFilter: IFilterResult<TF>;
  layerFilter: IFilterResult<LF>;
  sportGroundFilter: IFilterResult<SGF>;
  layerGroups: ILayerGroup<LF>[];
}

export const MobileFilters = <
  DF extends string,
  SGF extends string,
  TF extends string,
  LF extends string,
>({
  isVisible,
  setVisible,
  areFiltersDefault,
  activeFilters,
  onResetFiltersClick,
  districtFilter,
  sportGroundFilter,
  tagFilter,
  layerGroups,
  layerFilter,
}: IMobileFiltersProps<DF, SGF, TF, LF>) => {
  const { t } = useTranslation();

  return (
    <Sidebar
      isMobile
      title={t("title")}
      position="right"
      isVisible={isVisible}
      setVisible={setVisible}
    >
      <div>
        <ActiveFilters
          areFiltersDefault={areFiltersDefault}
          activeFilters={activeFilters}
          onResetClick={onResetFiltersClick}
          title={t("activeFilters")}
          resetFiltersButtonText={t("resetFilters")}
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
            onChange={(value) => districtFilter.setActiveOnly((value ?? []) as DF[])}
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

          <Select
            noBorder
            className="w-full"
            buttonClassName="px-3"
            placeholder={t("filters.sportGround.placeholder")}
            value={sportGroundFilter.activeKeys}
            isMultiple
            onChange={(value) => sportGroundFilter.setActiveOnly((value ?? []) as SGF[])}
            onReset={() => sportGroundFilter.setActiveAll(false)}
            renderValue={({ values }) => (
              <SelectValueRenderer
                values={values}
                placeholder={t("filters.sportGround.placeholder")}
                multiplePlaceholder={`${t("filters.sportGround.multipleDistricts")} (${
                  values.length
                })`}
              />
            )}
          >
            {sportGroundFilter.keys.map((sportGround) => (
              <SelectOption key={sportGround} value={sportGround}>
                {sportGround}
              </SelectOption>
            ))}
          </Select>
        </div>

        <div className="mt-3">
          <TagFilter
            title={t("filters.tag.title")}
            values={tagFilter.values.map((tag) => ({
              key: tag.key,
              label: t(`filters.tag.tags.${tag.key}`),
              isActive: tag.isActive,
            }))}
            onTagClick={(tag) => {
              if (tagFilter.activeKeys.length == tagFilter.values.length) {
                tagFilter.setActiveOnly(tag);
              } else if (!(tagFilter.activeKeys.length == 1 && tagFilter.activeKeys[0] == tag)) {
                tagFilter.toggleActive(tag);
              }
            }}
          />
        </div>
      </div>

      <Divider className="mx-6" />

      <h2 className="font-semibold text-md mx-6">{t("layers.title")}</h2>

      <Layers groups={layerGroups} onLayersVisibilityChange={layerFilter.setActive} />
    </Sidebar>
  );
};

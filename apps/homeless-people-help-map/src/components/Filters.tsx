import { IFilterResult } from "@bratislava/react-mapbox";
import { SearchBar } from "@bratislava/react-maps";
import { X } from "@bratislava/react-maps-icons";
import {
  ActiveFilters,
  Divider,
  IActiveFilter,
  Select,
  SelectOption,
  Sidebar,
} from "@bratislava/react-maps-ui";
import { useTranslation } from "react-i18next";
import { ITerrainService, Layers } from "./Layers";
import { SelectValueRenderer } from "./SelectValueRenderer";
import { TerrainServices } from "./TerrainServices";

export interface IFiltersProps {
  isMobile: boolean;
  isVisible?: boolean;
  setVisible: (isVisible: boolean) => void;
  areFiltersDefault: boolean;
  onResetFiltersClick: () => void;
  districtFilter: IFilterResult<string>;
  layerFilter: IFilterResult<string>;
  activeFilters: IActiveFilter[];

  terrainServices: ITerrainService[];
  activeTerrainService: string | null;
  onActiveTerrainServiceChange: (terrainService: string | null) => void;
}

export const Filters = ({
  isMobile,
  isVisible,
  setVisible,
  areFiltersDefault,
  onResetFiltersClick,
  activeFilters,
  districtFilter,
  layerFilter,
  terrainServices,
  activeTerrainService,
  onActiveTerrainServiceChange,
}: IFiltersProps) => {
  const { t, i18n } = useTranslation();

  return (
    <Sidebar
      position="left"
      isMobile={isMobile}
      isVisible={isVisible ?? false}
      onOpen={() => setVisible(true)}
      onClose={() => setVisible(false)}
      title={t("title")}
      closeText={t("close")}
    >
      {isMobile && (
        <ActiveFilters
          areFiltersDefault={areFiltersDefault}
          activeFilters={activeFilters}
          onResetClick={onResetFiltersClick}
          title={t("activeFilters")}
          resetFiltersButtonText={t("resetFilters")}
        />
      )}

      {!isMobile && (
        <div className="mx-6 relative">
          <SearchBar language={i18n.language} placeholder={t("search")} direction="bottom" />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex justify-between px-6 items-center">
          <h2 className="font-semibold text-md py-1">{t("filters.title")}</h2>
          {!areFiltersDefault && !isMobile && (
            <button
              onClick={onResetFiltersClick}
              className="flex gap-2 items-center hover:underline"
            >
              <span className="font-semibold">{t("filters.reset")}</span>
              <X className="text-primary" />
            </button>
          )}
        </div>

        <div className="w-full flex flex-col md:px-6">
          <Select
            className="w-full col-span-3"
            buttonClassName="px-3 md:px-0"
            value={districtFilter.activeKeys}
            isMultiple
            noBorder={isMobile}
            onChange={(value) => districtFilter.setActiveOnly(value ?? [])}
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
      </div>

      <Divider className="mx-6" />

      <div>
        <Layers
          title={t("layersLabel")}
          isMobile={isMobile}
          filter={layerFilter}
          layers={[
            "counseling",
            "hygiene",
            "overnight",
            "meals",
            "medicalTreatment",
            "culture",
            "drugsAndSex",
          ]}
        />

        <TerrainServices
          services={terrainServices}
          activeServiceKey={activeTerrainService}
          onServiceClick={(key) =>
            activeTerrainService === key
              ? onActiveTerrainServiceChange(null)
              : onActiveTerrainServiceChange(key)
          }
        />
      </div>

      <Layers
        title={t("otherLayersLabel")}
        isMobile={isMobile}
        filter={layerFilter}
        layers={["kolo", "notaBene"]}
      />
    </Sidebar>
  );
};

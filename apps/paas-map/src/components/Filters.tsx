import { IFilterResult } from "@bratislava/react-mapbox";
import { Sidebar } from "@bratislava/react-maps-ui";
import { useTranslation } from "react-i18next";
import { Layers } from "./Layers";

export interface IFiltersProps<LF extends string, MF extends string, ZF extends string> {
  isVisible?: boolean;
  setVisible: (isVisible: boolean | undefined) => void;
  layerFilter: IFilterResult<LF>;
  markerFilter: IFilterResult<MF>;
  zoneFilter: IFilterResult<ZF>;
  isMobile: boolean;
}

export const Filters = <LF extends string, MF extends string, ZF extends string>({
  isVisible,
  setVisible,
  layerFilter,
  markerFilter,
  zoneFilter,
  isMobile,
}: IFiltersProps<LF, MF, ZF>) => {
  const { t } = useTranslation();

  return (
    <Sidebar
      position={isMobile ? "right" : "left"}
      isMobile={isMobile}
      isVisible={isVisible}
      setVisible={setVisible}
      title={t("title")}
      closeText={t("close")}
    >
      {/* <div className="flex justify-between px-6 items-center">
        <h2 className="font-semibold text-md py-1">{t("filters.title")}</h2>
      </div>

      <div className={classnames("w-full flex flex-col gap-4", { "px-6": !isMobile })}>
        <Select
          noBorder={isMobile}
          className="w-full col-span-3"
          buttonClassName="px-3"
          value={zoneFilter.activeKeys}
          isMultiple
          onChange={(value) => zoneFilter.setActiveOnly((value ?? []) as ZF[])}
          onReset={() => zoneFilter.setActiveAll(false)}
          renderValue={({ values }) => (
            <SelectValueRenderer
              values={values}
              placeholder={t("filters.zone.placeholder")}
              multiplePlaceholder={`${t("filters.zone.multipleZones")} (${values.length})`}
            />
          )}
        >
          {zoneFilter.keys.map((zone) => (
            <SelectOption key={zone} value={zone}>
              {zone}
            </SelectOption>
          ))}
        </Select>
      </div> */}

      {/* <Divider className="mx-6" /> */}

      <div className="md:-translate-y-4 flex flex-col gap-4">
        <div className="flex  justify-between px-6 items-center">
          <h2 className="font-semibold text-md py-1">{t("layers.title")}</h2>
        </div>

        <Layers isMobile={isMobile} layerFilter={layerFilter} markerFilter={markerFilter} />
      </div>
    </Sidebar>
  );
};

import { DataDisplay, Tag } from "@bratislava/react-maps-ui";
import { FeatureCollection } from "@bratislava/utils/src/types";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { colors } from "../../utils/colors";

export type TerrainServiceDetail = {
  service: ITerrainService;
};
export interface ITerrainService {
  key: string;
  title: string;
  provider: string;
  phone: string;
  // web: string;
  // openingHours: string;
  price: string;
  geojson: FeatureCollection;
}

type TerrainServiceDetailType = {
  service: ITerrainService;
};

// TODO fix missing web and openingHours,
export const TerrainServiceDetail = ({
  service: { title, provider, phone, price, geojson },
}: TerrainServiceDetailType) => {
  const { t } = useTranslation("translation", { keyPrefix: "detail.terrainService" });

  const areas = useMemo(() => {
    return geojson.features.map((f) => f.properties?.name).join(", ");
  }, [geojson]);

  return (
    <div className="p-6 flex flex-col gap-4">
      <div className="font-semibold pt-1 pr-12">{title}</div>
      <Tag className="text-white w-fit lowercase" style={{ background: colors.terrainServices }}>
        {t("tag")}
      </Tag>
      <DataDisplay label={t("provider")} text={provider} />
      <DataDisplay enableEnhancements label={t("phone")} text={phone} />
      {/* <DetailWebRow href={web} label={t("web")} />
      <DataDisplay label={t("openingHours")} text={openingHours} /> */}
      <DataDisplay label={t("price")} text={price} />
      <DataDisplay label={t("areas")} text={areas} />
    </div>
  );
};

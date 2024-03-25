import { DataDisplay, Tag } from "@bratislava/react-maps-ui";
import { useTranslation } from "react-i18next";
import { colors } from "../../utils/colors";

export interface ITerrainServiceDetailProps {
  provider?: string;
  phone?: string | null;
  // web: string;
  // openingHours: string;
  price?: string;
  areas?: string;
}

// TODO fix missing web and openingHours,
export const TerrainServiceDetail = ({
  provider,
  phone,
  price,
  areas,
}: ITerrainServiceDetailProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "detail.terrainService" });
  const { t: detailT } = useTranslation("translation", { keyPrefix: "detail.main" });

  return (
    <>
      <div>
        <div className="font-semibold text-[14px]">{detailT("services")}</div>
        <Tag className="w-fit lowercase" style={{ background: colors.terrainServices }} isSmall>
          {t("tag")}
        </Tag>
      </div>
      <DataDisplay label={t("provider")} text={provider} />
      <DataDisplay enableEnhancements label={t("phone")} text={phone} />
      {/* <DetailWebRow href={web} label={t("web")} />
      <DataDisplay label={t("openingHours")} text={openingHours} /> */}
      <DataDisplay label={t("price")} text={price} />
      <DataDisplay label={t("areas")} text={areas} />
    </>
  );
};

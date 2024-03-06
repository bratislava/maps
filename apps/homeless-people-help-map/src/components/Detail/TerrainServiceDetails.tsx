import { DataDisplay, Tag } from "@bratislava/react-maps-ui";
import { useTranslation } from "react-i18next";
import { colors } from "../../utils/colors";
import { z } from "zod";

export const terrainServicesDetailsPropertiesSchema = z
  .object({
    key: z.string(),
    title: z.string().optional(),
    provider: z.string().optional(),
    phone: z.number().optional().nullable(),
    // web: z.string(),
    // openingHours: z.string(),
    price: z.string().optional(),
    // geojson: FeatureCollection;
  })
  .array();
// export const terrainServicesDetailsPropertiesSchema = z.object({
//   workingGroups: z
//     .object({
//       key: z.string(),
//       title: z.string().optional(),
//       provider: z.string().optional(),
//       phone: z.number().optional(),
//       // web: z.string(),
//       // openingHours: z.string(),
//       price: z.string().optional(),
//       // geojson: FeatureCollection;
//     })
//     .array(),
// });

type TerrainServicesProperties = z.infer<typeof terrainServicesDetailsPropertiesSchema>;

type TerrainServiceDetailsProps = {
  workingGroups: TerrainServicesProperties;
};

// TODO fix missing web and openingHours,
export const TerrainServiceDetails = ({ workingGroups }: TerrainServiceDetailsProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "detail.terrainService" });

  // const areas = useMemo(() => {
  //   return geojson.features.map((f) => f.properties?.name).join(", ");
  // }, [geojson]);

  return (
    <div>
      {workingGroups.map((workingGroup) => {
        const { key, title, provider, phone, price } = workingGroup;
        return (
          <div key={key} className="p-6 flex flex-col gap-4">
            <div className="font-semibold pt-1 pr-12">{title}</div>
            <Tag
              className="text-white w-fit lowercase"
              style={{ background: colors.terrainServices }}
            >
              {t("tag")}
            </Tag>
            <DataDisplay label={t("provider")} text={provider} />
            <DataDisplay enableEnhancements label={t("phone")} text={phone} />
            {/* <DetailWebRow href={web} label={t("web")} />
      <DataDisplay label={t("openingHours")} text={openingHours} /> */}
            <DataDisplay label={t("price")} text={price} />
            {/* <DataDisplay label={t("areas")} text={areas} /> */}
          </div>
        );
      })}
    </div>
  );
};

import { FeatureCollection } from "@bratislava/utils/src/types";
import { z } from "zod";

export const terrainServicePropertiesSchema = z.object({
  key: z.string(),
  title: z.string().optional(),
  provider: z.string().optional(),
  phone: z.number().optional().nullable(),
  // web: z.string(),
  // openingHours: z.string(),
  price: z.string().optional().nullable(),
  areas: z.string().optional(),
});

export type TerrainServiceProperties = z.infer<typeof terrainServicePropertiesSchema>;

export interface ITerrainService extends TerrainServiceProperties {
  geojson: FeatureCollection;
}

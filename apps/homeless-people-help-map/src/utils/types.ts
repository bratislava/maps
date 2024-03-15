import { FeatureCollection } from "@bratislava/utils/src/types";

export interface ITerrainService {
  key: string;
  title: string;
  provider: string;
  phone: string;
  price: string;
  areas: string;
  geojson: FeatureCollection;
}

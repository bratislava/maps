import { FeatureCollection, Point, Polygon } from "@turf/helpers";
import addresses from "./addresses.json";
import districts from "./districts.json";

export const ADDRESSES_GEOJSON = addresses as FeatureCollection<
  Point,
  { name: string; number: string; id: string }
>;

export const DISTRICTS_GEOJSON = districts as FeatureCollection<
  Polygon,
  { name: string; district: string }
>;

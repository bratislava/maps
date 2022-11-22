import { DISTRICTS_GEOJSON } from '@bratislava/geojson-data';
import booleanIntersects from '@turf/boolean-intersects';
import { featureCollection } from '@turf/helpers';
import {
  Feature,
  FeatureCollection,
  Geometry,
  GeoJsonProperties,
} from 'geojson';

export const DISTRICTS = [
  'Staré Mesto',
  'Ružinov',
  'Vrakuňa',
  'Podunajské Biskupice',
  'Nové Mesto',
  'Rača',
  'Vajnory',
  'Karlova Ves',
  'Dúbravka',
  'Lamač',
  'Devín',
  'Devínska Nová Ves',
  'Záhorská Bystrica',
  'Petržalka',
  'Jarovce',
  'Rusovce',
  'Čunovo',
] as const;

type District = typeof DISTRICTS[number];

export const addDistrictPropertyToLayer = <
  G extends Geometry,
  P extends GeoJsonProperties,
>(
  collection: FeatureCollection<G, P>,
) => {
  return featureCollection(
    collection.features.map((feature: Feature) => ({
      ...feature,
      properties: {
        ...feature.properties,
        district: getFeatureDistrict(feature),
      },
    })),
  ) as FeatureCollection<G, P & { district: District }>;
};

export const getFeatureDistrict = (feature: Feature): District | null => {
  const districtFeatures = DISTRICTS_GEOJSON.features;

  for (const districtFeature of districtFeatures) {
    if (booleanIntersects(districtFeature.geometry, feature)) {
      return districtFeature.properties.name as District;
    }
  }
  return null;
};

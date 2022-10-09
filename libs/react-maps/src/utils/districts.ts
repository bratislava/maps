import { DISTRICTS_GEOJSON } from '@bratislava/geojson-data';
import booleanIntersects from '@turf/boolean-intersects';
import { Feature, FeatureCollection } from 'geojson';

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

export const addDistrictPropertyToLayer = (
  featureCollection: FeatureCollection
) => ({
    ...featureCollection,
    features: featureCollection.features.map((feature: Feature) => ({
        ...feature,
        properties: {
          ...feature.properties,
          district: getFeatureDistrict(feature),
        },
      })),
  });

export const getFeatureDistrict = (feature: Feature): District | null => {
  const districtFeatures = DISTRICTS_GEOJSON.features;

  for (const districtFeature of districtFeatures) {

    if (booleanIntersects(districtFeature.geometry, feature)) {
      return districtFeature.properties.name as District;
    }
  }
  return null;
};

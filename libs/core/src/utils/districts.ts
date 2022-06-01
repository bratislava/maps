import DATA_DISTRICTS from '../assets/layers/districts.json';
import booleanIntersects from '@turf/boolean-intersects';

export const ALL_DISTRICTS_KEY = 'allDistricts';

const DISTRICTS = [
  'Staré Mesto',
  'Podunajské Biskupice',
  'Ružinov',
  'Vrakuňa',
  'Nové Mesto',
  'Rača',
  'Vajnory',
  'Devínska Nová Ves',
  'Dúbravka',
  'Devín',
  'Lamač',
  'Záhorská Bystrica',
  'Čunovo',
  'Jarovce',
  'Petržalka',
  'Rusovce',
];

export const getDistrictArray = () => {
  return DISTRICTS;
};

export const getDistrictOptions = () => {
  return [
    { key: ALL_DISTRICTS_KEY, label: 'Všetky' },
    ...DISTRICTS.map((district) => ({ key: district, label: district })),
  ];
};

export const addDistrictPropertyToLayer = (geojson: any) => {
  const districtFeatures = DATA_DISTRICTS.features;
  return {
    ...geojson,
    features: geojson.features.map((feature) => {
      for (let i = 0; i < districtFeatures.length; i++) {
        const districtFeature = districtFeatures[i];

        if (booleanIntersects(districtFeature.geometry, feature.geometry)) {
          return {
            ...feature,
            properties: {
              ...feature.properties,
              district: districtFeature.properties['name'],
            },
          };
        }
      }
      return feature;
    }),
  };
};

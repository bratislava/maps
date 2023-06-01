import { addDistrictPropertyToLayer } from "@bratislava/react-maps";
import { getUniqueValuesFromFeatures } from "@bratislava/utils";
import { Feature, FeatureCollection, Point } from "@bratislava/utils/src/types";

type CvickoId = "apollo" | "lanfranconi" | "most-snp" | "nabrezie" | "promenada" | "tyrsak";

interface IWorkoutAttributes {
  id: number;
  nazov: string;
  kategoriaSportoviska: string;
  sport: string;
  umiestnenie: string;
  webLink: string;
  navigovatLink: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
  fotka: any;
}
export interface IWorkout {
  attributes: IWorkoutAttributes;
}


export const getCvickoIdFromQuery = (query: string | null): CvickoId | null => {
  switch (query) {
    case "apollo":
    case "lanfranconi":
    case "most-snp":
    case "nabrezie":
    case "promenada":
    case "tyrsak":
      return query;
    default:
      return null;
  }
};

export const getIsHomepageFromQuery = (query: string | null): boolean => {
  if (query === "" || query) {
    return true;
  }
  return false;
};

export const generateRawWorkoutData = (workouts: Array<IWorkout>): FeatureCollection<Point> => {
  const workoutData: FeatureCollection<Point> = {
    type: "FeatureCollection",
    features: []
  }

  workoutData.features = workouts.map((w, i) => {
    const workout = w.attributes;
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [workout.longitude, workout.latitude],
      },
      properties: {
        id: i + 1,
        name: workout.nazov,
        category: workout.kategoriaSportoviska,
        tags: workout.sport.split(', '),
        location: workout.umiestnenie,
        website: workout.webLink,
        wantToWorkout: "https://cvicko.sk",
        photo: workout.fotka?.data?.attributes?.formats?.small.url,
        navigate: workout.navigovatLink,
      },
    }
  })

  return workoutData;
}

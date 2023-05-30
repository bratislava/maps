import { FeatureCollection } from "geojson";
import { IWorkout } from "../types";

export const generateRawWorkoutData = (workouts: Array<IWorkout>): FeatureCollection => {
  const poolData: FeatureCollection = {
    type: "FeatureCollection",
    features: []
  }
  poolData.features = workouts.map(w => {
    const workout = w.attributes;
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [workout.longitude, workout.latitude],
      },
      properties: {
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

  return poolData;
}

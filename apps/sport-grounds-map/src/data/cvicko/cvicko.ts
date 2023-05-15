import { FeatureCollection } from "geojson";
import workouts from "./cvicko.json"
import { IWorkout } from "../types";

const generateRawWorkoutData = (workouts: Array<IWorkout>): FeatureCollection => {
  const poolData: FeatureCollection = {
    type: "FeatureCollection",
    features: []
  }
  poolData.features = workouts.map(workout => {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [workout.Y, workout.X],
      },
      properties: {
        name: workout.Názov_SK,
        category: workout["Kategória športoviska_SK"],
        tags: workout.Sport_SK.split(', '),
        location: workout.Umiestnenie_SK,
        website: workout.Web,
        email: workout?.Email_SK,
        wantToWorkout: "https://cvicko.sk",
        photo: workout.Fotka,
        navigate: workout.Navigovať,
      },
    }
  })

  return poolData;
}

export const rawDataCvicko: FeatureCollection = generateRawWorkoutData(workouts);

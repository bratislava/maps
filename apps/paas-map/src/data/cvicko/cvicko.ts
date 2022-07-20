import { FeatureCollection } from "geojson";

export const rawDataCvicko: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [17.075586, 48.143773],
      },
      properties: {
        name: "Cvičko most Lanfranconi",
        category: "workoutové ihrisko",
        tags: ["workout"],
        location: "Pod mostom Lanfranconi",
        wantToWorkout: "https://cvicko.sk",
        navigate:
          "https://www.google.sk/maps/dir//48.143773,17.075586/@48.1437766,17.0733973,771m/data=!3m1!1e3!4m2!4m1!3e0?hl=sk&authuser=0",
        photo: "images/cvicko/Lanfranconi.png",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [17.07946, 48.143182],
      },
      properties: {
        name: "Cvičko Kráľovské údolie",
        category: "workoutové ihrisko",
        tags: ["workout"],
        location: "Dvořákovo nábrežie",
        wantToWorkout: "https://cvicko.sk",
        navigate:
          "https://www.google.sk/maps/dir//48.143182,17.07946/@48.1430776,17.0795001,226m/data=!3m1!1e3!4m2!4m1!3e0?hl=sk&authuser=0",
        photo: "images/cvicko/Kráľovské údolie.png",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [17.117367, 48.139899],
      },
      properties: {
        name: "Cvičko Promenáda",
        category: "workoutové ihrisko",
        tags: ["workout"],
        location: "Pod Starým mostom, medzi piliermi",
        wantToWorkout: "https://cvicko.sk",
        navigate:
          "https://www.google.sk/maps/dir//48.139899,17.117367/@48.1389666,17.1172395,207a,35y,2.25h,26.15t/data=!3m1!1e3!4m2!4m1!3e0?hl=sk&authuser=0",
        photo: "images/cvicko/Promenáda.png",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [17.117959, 48.135942],
      },
      properties: {
        name: "Cvičko Tyršák",
        category: "workoutové ihrisko",
        tags: ["workout"],
        location: "Vpravo vedľa mosta, pri rampe cyklotrasy",
        wantToWorkout: "https://cvicko.sk",
        navigate:
          "https://www.google.sk/maps/dir//48.135942,17.117959/@48.1361171,17.1161059,314m/data=!3m1!1e3!4m2!4m1!3e0?hl=sk&authuser=0",
        photo: "images/cvicko/Tyršák.png",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [17.12839, 48.134552],
      },
      properties: {
        name: "Cvičko Apollo",
        category: "workoutové ihrisko",
        tags: ["workout"],
        location: "Vpravo vedľa mosta, pri rampe cyklotrasy",
        wantToWorkout: "https://cvicko.sk",
        navigate:
          "https://www.google.sk/maps/dir//48.134552,17.12839/@48.1345529,17.1278428,193m/data=!3m1!1e3!4m2!4m1!3e0?hl=sk&authuser=0",
        photo: "images/cvicko/Apollo.png",
      },
    },
  ],
};

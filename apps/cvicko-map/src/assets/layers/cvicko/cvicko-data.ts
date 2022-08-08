import { FeatureCollection, Point } from "geojson";

export const cvickoData: FeatureCollection<Point> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "lafranconi",
        name: "Lafranconi",
        location: "Pod mostom Lanfranconi",
        navigationLink:
          "https://www.google.sk/maps/dir//48.143773,17.075586/@48.1437766,17.0733973,771m/data=!3m1!1e3!4m2!4m1!3e0?hl=sk&authuser=0",
        photo: "images/cvicko/lafranconi.jpg",
        tags: ["workout"],
        category: "workoutové ihrisko",
      },
      geometry: { type: "Point", coordinates: [17.075586, 48.143773] },
    },
    {
      type: "Feature",
      properties: {
        id: "nabezie",
        name: "Nábežie",
        location: "Dvořákovo nábrežie",
        navigationLink:
          "https://www.google.sk/maps/dir//48.143182,17.07946/@48.1430776,17.0795001,226m/data=!3m1!1e3!4m2!4m1!3e0?hl=sk&authuser=0",
        photo: "images/cvicko/nabezie.jpg",
        tags: ["workout"],
        category: "workoutové ihrisko",
      },
      geometry: { type: "Point", coordinates: [17.07946, 48.143182] },
    },
    {
      type: "Feature",
      properties: {
        id: "promenada",
        name: "Promenáda",
        location: "Pod Starým mostom, medzi piliermi",
        navigationLink:
          "https://www.google.sk/maps/dir//48.139899,17.117367/@48.1389666,17.1172395,207a,35y,2.25h,26.15t/data=!3m1!1e3!4m2!4m1!3e0?hl=sk&authuser=0",
        photo: "images/cvicko/promenada.jpg",
        tags: ["workout"],
        category: "workoutové ihrisko",
      },
      geometry: { type: "Point", coordinates: [17.117367, 48.139899] },
    },
    {
      type: "Feature",
      properties: {
        id: "tyrsak",
        name: "Tyršák",
        location: "Vpravo vedľa mosta, pri rampe cyklotrasy",
        navigationLink:
          "https://www.google.sk/maps/dir//48.135942,17.117959/@48.1361171,17.1161059,314m/data=!3m1!1e3!4m2!4m1!3e0?hl=sk&authuser=0",
        photo: "images/cvicko/tyrsak.jpg",
        tags: ["workout"],
        category: "workoutové ihrisko",
      },
      geometry: { type: "Point", coordinates: [17.117959, 48.135942] },
    },
    {
      type: "Feature",
      properties: {
        id: "apollo",
        name: "Apollo",
        location: "Vpravo vedľa mosta, pri rampe cyklotrasy",
        navigationLink:
          "https://www.google.sk/maps/dir//48.134552,17.12839/@48.1345529,17.1278428,193m/data=!3m1!1e3!4m2!4m1!3e0?hl=sk&authuser=0",
        photo: "images/cvicko/apollo.jpg",
        tags: ["workout"],
        category: "workoutové ihrisko",
      },
      geometry: { type: "Point", coordinates: [17.12839, 48.134552] },
    },
    {
      type: "Feature",
      properties: {
        id: "most-snp",
        name: "Most SNP",
        location: "Pod mostom, pri vjazde do Incheba",
        navigationLink:
          "https://www.google.cz/maps/place/48%C2%B008'10.6%22N+17%C2%B006'17.2%22E/@48.1362839,17.1042368,234m/data=!3m2!1e3!4b1!4m6!3m5!1s0x0:0x97573311c32324fe!7e2!8m2!3d48.1362833!4d17.1047844?hl=sk&authuser=0",
        photo: "images/cvicko/most-snp.png",
        tags: ["workout"],
        category: "workoutové ihrisko",
      },
      geometry: { type: "Point", coordinates: [17.104784, 48.136283] },
    },
  ],
};

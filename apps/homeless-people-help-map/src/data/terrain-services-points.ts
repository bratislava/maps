import { addDistrictPropertyToLayer } from "@bratislava/react-maps";

export const terrainServicesPointsData = addDistrictPropertyToLayer({
  type: "FeatureCollection",
  features: [
    {
      id: 1111,
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [17.183578940148625, 48.12972130850923],
      },
      properties: {
        name: "Slovnaftská ul. (parkovisko pre kamióny)",
      },
    },
    {
      id: 1112,
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [17.125817302706206, 48.15775574006375],
      },
      properties: {
        name: "Trnavské mýto (parkovisko pri Pezinský sud)",
      },
    },
    {
      id: 1113,
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [17.095166560715445, 48.10414682583881],
      },
      properties: {
        name: "Panónska cesta (pri AAA auto)",
      },
    },
    {
      id: 1114,
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [17.204486415989702, 48.13897831241846],
      },
      properties: {
        name: "Stavbárska - Pentagon (pred Centrom K2)",
      },
    },
    {
      id: 1115,
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [17.178745505402897, 48.12878428051311],
      },
      properties: {
        name: "Parkovisko Slovnaft",
      },
    },
    {
      id: 1116,
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [17.097001155649778, 48.115814827086716],
      },
      properties: {
        name: "Panónska (parkovisko pri Fiate oproti Citroenu)",
      },
    },
  ],
});

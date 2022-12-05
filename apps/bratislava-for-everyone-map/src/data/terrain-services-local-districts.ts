import { addDistrictPropertyToLayer } from "@bratislava/react-maps";

export const terrainServicesLocalDistrictsData = addDistrictPropertyToLayer({
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Mlynská dolina",
        id: "mlynska-dolina",
      },
      geometry: {
        coordinates: [
          [
            [17.065752, 48.150193],
            [17.055196, 48.163607],
            [17.05777, 48.165393],
            [17.060808, 48.165943],
            [17.06292, 48.163985],
            [17.064258, 48.163041],
            [17.068919, 48.161838],
            [17.071519, 48.16031],
            [17.0743, 48.159692],
            [17.075497, 48.154959],
            [17.075484, 48.152581],
            [17.075381, 48.148218],
            [17.075471, 48.145924],
            [17.075149, 48.143768],
            [17.073012, 48.144043],
            [17.071751, 48.144593],
            [17.069794, 48.144816],
            [17.069614, 48.145916],
            [17.068378, 48.146517],
            [17.067348, 48.146671],
            [17.065752, 48.150193],
          ],
        ],
        type: "Polygon",
      },
      id: 222,
    },
  ],
});

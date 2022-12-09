import { addDistrictPropertyToLayer } from "@bratislava/react-maps";
import { FeatureCollection, Point } from "geojson";
import { BuildingIcon } from "../components/BuildingMarker";

export const buildingsData: FeatureCollection<Point, { icon: BuildingIcon }> =
  addDistrictPropertyToLayer({
    type: "FeatureCollection",
    features: [
      {
        id: "b-1",
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [17.09958626590317, 48.153917650251046],
        },
        properties: {
          icon: "slavin",
        },
      },
      {
        id: "b-2",
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [17.10674700983034, 48.1451135276608],
        },
        properties: {
          icon: "michalska",
        },
      },
      {
        id: "b-3",
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [17.10012665507378, 48.142316144961505],
        },
        properties: {
          icon: "castle",
        },
      },
      {
        id: "b-4",
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [17.106000239384926, 48.15848365163735],
        },
        properties: {
          icon: "main-station",
        },
      },
      {
        id: "b-5",
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [17.126007057143237, 48.15742259250949],
        },
        properties: {
          icon: "new-marketplace",
        },
      },
      {
        id: "b-6",
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [17.1139979049425, 48.154063269336945],
        },
        properties: {
          icon: "broadcast",
        },
      },
    ],
  });

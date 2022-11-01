import { Marker as MapMarker } from "@bratislava/react-mapbox";
import { VictoryPie } from "victory";
import { point } from "@turf/helpers";
import { Feature } from "geojson";
import cx from "classnames";
import colors from "../utils/colors.json";
import { motion } from "framer-motion";

export interface IMarkerProps {
  features: Feature[];
  isSelected: boolean;
  lng: number;
  lat: number;
  onClick: () => void;
}

export const Marker = ({ features, lng, lat, onClick, isSelected }: IMarkerProps) => {
  return (
    <MapMarker feature={point([lng, lat], features[0].properties)} onClick={onClick}>
      <div
        className={cx("relative cursor-pointer", {
          "w-12 h-12": features.length > 1,
          "w-6 h-6": features.length === 1,
        })}
      >
        <div
          className={cx("absolute -z-10 w-full h-full rounded-full border-2 border-[transparent]", {
            "!border-primary": isSelected,
          })}
        >
          <VictoryPie
            labels={[]}
            colorScale={[colors.occupied, colors.free]}
            data={
              features.reduce(
                (prev, feature) => {
                  if (feature.properties?.occupancy === "occupied") {
                    return [{ x: "occupied", y: prev[0].y + 1 }, prev[1]];
                  } else {
                    return [prev[0], { x: "free", y: prev[1].y + 1 }];
                  }
                },
                [
                  { x: "occupied", y: 0 },
                  { x: "free", y: 0 },
                ],
              ) ?? []
            }
          />
        </div>
        {features.length > 1 && (
          <div className="text-white font-semibold text-[16px] w-full h-full flex items-center justify-center z-20">
            {features.length}
          </div>
        )}
      </div>
    </MapMarker>
  );
};

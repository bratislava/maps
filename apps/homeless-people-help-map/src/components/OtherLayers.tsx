import { IFilterResult } from "@bratislava/react-mapbox";
import { capitalizeFirstLetter } from "../../../planting-map/src/utils/utils";
import { colors } from "../utils/colors";
import { useTranslation } from "react-i18next";
import { FeatureCollection } from "geojson";
import { LayerButton } from "./LayerButton";

export interface ITerrainService {
  key: string;
  title: string;
  provider: string;
  phone: string;
  web: string;
  openingHours: string;
  price: string;
  geojson: FeatureCollection;
}

export type OtherLayersProps = {
  filter: IFilterResult<string>;
  layers: string[];
  isMobile: boolean;
};

export const OtherLayers = ({ filter, layers }: OtherLayersProps) => {
  const { t }: { t: (key: string) => string } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-semibold px-6 text-md">{t("otherLayersLabel")}</h2>

      <div>
        {layers.map((layer) => (
          <LayerButton
            key={layer}
            color={colors[layer]}
            isVisible={filter.isAnyKeyActive([layer])}
            title={capitalizeFirstLetter(t(`layers.${layer}`))}
            onClick={() =>
              filter.isAnyKeyActive([layer])
                ? filter.setActive(layer, false)
                : filter.setActive(layer, true)
            }
          />
        ))}
      </div>
    </div>
  );
};

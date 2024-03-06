import { IFilterResult } from "@bratislava/react-mapbox";
import { capitalizeFirstLetter } from "../../../planting-map/src/utils/utils";
import { colors } from "../utils/colors";
import { useTranslation } from "react-i18next";
import { FeatureCollection } from "geojson";
import { LayerButton } from "./LayerButton";

export type LayersProps = {
  filter: IFilterResult<string>;
  layers: string[];
  isMobile: boolean;
  title: string;
};

export const Layers = ({ filter, layers, title }: LayersProps) => {
  const { t }: { t: (key: string) => string } = useTranslation();

  const handleLayerButtonClick = (layer: string) => {
    // If all layers are active then set this layer the only one active
    if (filter.activeKeys.length === filter.keys.length) {
      filter.setActiveOnly(layer);
      return;
    }

    // If this layer is only active layer, then active all
    if (filter.activeKeys.length === 1 && filter.isAnyKeyActive([layer])) {
      filter.setActiveAll(true);
      return;
    }

    // Else just toggle layer
    filter.toggleActive(layer);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-semibold px-6 text-md">{title}</h2>

      <div>
        {layers.map((layer) => (
          <LayerButton
            key={layer}
            color={colors[layer]}
            isVisible={filter.isAnyKeyActive([layer])}
            title={capitalizeFirstLetter(t(`layers.${layer}`))}
            onClick={() => handleLayerButtonClick(layer)}
          />
        ))}
      </div>
    </div>
  );
};

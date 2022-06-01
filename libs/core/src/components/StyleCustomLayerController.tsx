import { useContext, useEffect } from 'react';
import { mapContext } from './Mapbox';

/*
  This component is used to control custom layers from mapbox studio styles.

  Name of the layer must be in following format:
  BRATISLAVA-{group-name}-...

  If there is multiple layers with same group-name, they will be controlled synchronously.
*/

export interface IStyleCustomLayerControllerProps {
  id: string;
  isVisible: boolean;
}

const StyleCustomLayerController = ({
  id,
  isVisible,
}: IStyleCustomLayerControllerProps) => {
  const { map, isLoading } = useContext(mapContext);

  useEffect(() => {
    if (!isLoading) {
      const customLayers = map
        .getStyle()
        .layers.filter((layer: mapboxgl.Layer) =>
          layer.id.startsWith(`BRATISLAVA-${id}`)
        );

      customLayers.forEach((customLayer) => {
        if (isVisible) {
          map.setLayoutProperty(customLayer.id, 'visibility', 'visible');
        } else {
          map.setLayoutProperty(customLayer.id, 'visibility', 'none');
        }
      });
    }
  }, [isLoading, map, isVisible, id]);

  return null;
};

export default StyleCustomLayerController;

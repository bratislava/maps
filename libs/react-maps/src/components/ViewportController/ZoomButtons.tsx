import { Minus, Plus } from '@bratislava/react-maps-icons';
import { IconButton, IconButtonGroup } from '@bratislava/react-maps-ui';
import { useCallback, useContext } from 'react';

import { mapContext } from '../Map/Map';

export function ZoomButtons() {
  const { mapState, methods: mapMethods } = useContext(mapContext);

  // ZOOM IN HANDLER
  const handleZoomInClick = useCallback(() => {
    mapMethods.changeViewport({ zoom: (mapState?.viewport.zoom ?? 0) + 0.5 });
  }, [mapMethods, mapState?.viewport.zoom]);

  // ZOOM OUT HANDLER
  const handleZoomOutClick = useCallback(() => {
    mapMethods.changeViewport({ zoom: (mapState?.viewport.zoom ?? 0) - 0.5 });
  }, [mapMethods, mapState?.viewport.zoom]);

  return (
    <IconButtonGroup>
      <IconButton noAnimation noStyle onClick={handleZoomInClick}>
        <Plus size="default" />
      </IconButton>
      <IconButton noAnimation noStyle onClick={handleZoomOutClick}>
        <Minus size="default" />
      </IconButton>
    </IconButtonGroup>
  );
}

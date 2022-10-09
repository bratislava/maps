import { Compass } from '@bratislava/react-maps-icons';
import { IconButton } from '@bratislava/react-maps-ui';
import { useCallback, useContext } from 'react';

import { mapContext } from '../Map/Map';

export function CompassButton() {
  const { mapState, methods: mapMethods } = useContext(mapContext);

  // RESET BEARING HANDLER
  const handleCompassClick = useCallback(() => {
    mapMethods.changeViewport({ bearing: 0 });
  }, [mapMethods]);

  return (
    <IconButton onClick={handleCompassClick}>
      <div
        style={{
          transform: `rotate(${-(mapState?.viewport?.bearing ?? 0)}deg)`,
        }}
      >
        <Compass size="lg" />
      </div>
    </IconButton>
  );
}

import { Mapbox, Marker } from '@bratislava/react-mapbox';
import { point } from '@turf/helpers';
import { INLogo } from '../components/INLogo';

export const DisplayMarker = () => {
  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Mapbox mapboxAccessToken={import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN}>
        <Marker feature={point([17.1076325, 48.1435824])}>
          <INLogo />
        </Marker>
      </Mapbox>
    </div>
  );
};

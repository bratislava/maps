import { Mapbox } from '@bratislava/react-mapbox';

export const CustomTheme = () => {
  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Mapbox
        mapboxAccessToken={import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN}
        mapStyles={{ light: import.meta.env.PUBLIC_MAPBOX_LIGHT_STYLE }}
      />
    </div>
  );
};

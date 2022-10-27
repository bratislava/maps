import { useMemo } from 'react';
import { Viewport } from '../../types';
import { JsonViewer } from '../JsonViewer/JsonViewer';

export interface IDevelopmentInfoProps {
  isDevelopment?: boolean;
  viewport: Viewport;
}

export const DevelopmentInfo = ({
  isDevelopment,
  viewport,
}: IDevelopmentInfoProps) => {
  const prettierViewport: Viewport = useMemo(() => {
    return {
      zoom: Math.round(viewport.zoom * 100) / 100,
      pitch: Math.round(viewport.pitch * 100) / 100,
      bearing: Math.round(viewport.bearing * 100) / 100,
      center: {
        lng: Math.round(viewport.center.lng * 100) / 100,
        lat: Math.round(viewport.center.lat * 100) / 100,
      },
      padding: {
        top: Math.round(viewport.padding.top * 100) / 100,
        right: Math.round(viewport.padding.right * 100) / 100,
        bottom: Math.round(viewport.padding.bottom * 100) / 100,
        left: Math.round(viewport.padding.left * 100) / 100,
      },
    };
  }, [viewport]);

  return isDevelopment ? (
    <div style={{ width: '256px' }} className="fixed top-4 right-4">
      <JsonViewer json={prettierViewport} />
    </div>
  ) : null;
};

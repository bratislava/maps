import { Dispatch, SetStateAction, useState } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { forwardGeocode, MapHandle, SearchBar } from '@bratislava/react-maps';
import mapboxgl from 'mapbox-gl';

export interface ISidebarProps {
  filteringOpenState: [boolean, Dispatch<SetStateAction<boolean>>];
  mapboxgl: typeof mapboxgl;
  mapRef: MapHandle;
  mainLayers?: any[];
  secondaryLayers?: any[];
  selectedMainLayer: any;
  onMainLayerSelect: (layer: any) => void;
}

const Sidebar = ({
  mapboxgl,
  mainLayers,
  secondaryLayers,
  selectedMainLayer,
  filteringOpenState: [isFilteringOpen],
  onMainLayerSelect,
}: ISidebarProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        {mainLayers.map((layer) => {
          const isSelected = selectedMainLayer.key === layer.key;
          return (
            <button
              key={layer.key}
              onClick={() => onMainLayerSelect(layer)}
              className={cx('px-8 py-4 text-left border-l-3', {
                'border-secondary bg-highlight': isSelected,
              })}
            >
              <div className="flex space-x-4">
                <div>
                  {isSelected ? (
                    <layer.activeIcon width={54} height={54} />
                  ) : (
                    <layer.icon width={54} height={54} />
                  )}
                </div>
                <div>
                  <div className="font-bold">{layer.title}</div>
                  <p className="mt-1 text-xs">{layer.description}</p>
                </div>
              </div>
            </button>
          );
        })}
        <p className="px-8 mt-4 mb-8 text-xs">{t('layersHint')}</p>
        {secondaryLayers.map((layer) => {
          const [isEnabled, setEnabled] = layer.enabledState;
          return (
            <button
              key={layer.key}
              onClick={() => setEnabled(!isEnabled)}
              className={cx('px-8 py-4 text-left border-l-3', {
                'border-secondary bg-highlight': isEnabled,
              })}
            >
              <div className="flex space-x-4 items-center">
                <div>
                  {isEnabled ? (
                    <layer.activeIcon width={54} height={54} />
                  ) : (
                    <layer.icon width={54} height={54} />
                  )}
                </div>
                <div className="font-bold">{layer.title}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;

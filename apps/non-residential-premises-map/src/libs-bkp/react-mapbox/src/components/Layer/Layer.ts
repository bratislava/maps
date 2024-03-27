import { usePrevious } from '../../../../../libs/utils/src';
import { FeatureCollection } from '../../../../../libs/utils/src/types';
import { Feature } from 'geojson';
import { MapMouseEvent, Popup } from 'mapbox-gl';
import {
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { log } from '../../utils/log';
import { mapboxContext } from '../Mapbox/Mapbox';

type Filter = string | null | boolean | Filter[];

export interface ILayerProps {
  geojson: FeatureCollection | Feature | null;
  styles: any;
  isVisible?: boolean;
  hidePopup?: boolean;
  filters?: Filter[];
  ignoreFilters?: boolean;
  ignoreClick?: boolean;
  hoverPopup?: FC<string> | ReactNode;
}

export const Layer = ({
  geojson,
  styles,
  isVisible = true,
  hidePopup = true,
  filters = [],
  ignoreFilters = false,
  ignoreClick = false,
  hoverPopup,
}: ILayerProps) => {
  const {
    map,
    getPrefixedLayer,
    isLoading,
    isStyleLoading,
    addClickableLayer,
    layerPrefix,
  } = useContext(mapboxContext);

  const layerIdStartsWith = 'label';

  const previousLoading = usePrevious(isLoading);
  const previousStyleLoading = usePrevious(isStyleLoading);
  const previousVisible = usePrevious(isVisible);
  const previousIgnoreFilters = usePrevious(ignoreFilters);
  const previousFilters = usePrevious(filters);

  const id = useId();

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [renderedPopupContent, setRenderedPopupContent] =
    useState<ReactNode>(null);

  const popupElement = useMemo(() => {
    return document.createElement('div');
  }, []);

  const popup: Popup = useMemo(() => {
    return new Popup({
      closeButton: false,
      closeOnClick: false,
    })
      .setLngLat([0, 0])
      .setDOMContent(popupElement);
  }, [popupElement]);

  useEffect(() => {
    if (!map) return;

    if (isPopupVisible) {
      popup.addTo(map);
      popupElement.setAttribute(
        'style',
        `${popupElement.style}; z-index: 100; pointer-events: none;`,
      );
    }

    return () => {
      if (isPopupVisible) {
        popup.remove();
      }
    };
  }, [map, popup, popupElement, isPopupVisible]);

  useEffect(() => {
    hidePopup && setPopupVisible(false);
  }, [hidePopup]);

  const renderPopupContent = useCallback(
    (
      e: MapMouseEvent & {
        features?: mapboxgl.MapboxGeoJSONFeature[];
      },
    ) => {
      setRenderedPopupContent(
        typeof hoverPopup === 'function'
          ? hoverPopup(e.features?.[0].properties?.name ?? '')
          : hoverPopup,
      );
    },
    [hoverPopup],
  );

  const onMouseEnter = useCallback(() => {
    setPopupVisible(true);
  }, []);

  const onMouseMove = useCallback(
    (e: MapMouseEvent) => {
      popup.setLngLat(e.lngLat);
      renderPopupContent(e);
    },
    [popup, renderPopupContent],
  );

  const onMouseLeave = useCallback(() => {
    setPopupVisible(false);
  }, []);

  useEffect(() => {
    if (hoverPopup && map) {
      styles.forEach((style: any) => {
        if (style.type !== 'line') {
          map.on('mouseenter', getPrefixedLayer(style.id), onMouseEnter);
          map.on('mousemove', getPrefixedLayer(style.id), onMouseMove);
          map.on('mouseleave', getPrefixedLayer(style.id), onMouseLeave);
        }
      });
    }

    return () => {
      if (hoverPopup && map) {
        styles.forEach((style: any) => {
          if (style.type !== 'line') {
            map.off('mouseenter', getPrefixedLayer(style.id), onMouseEnter);
            map.off('mousemove', getPrefixedLayer(style.id), onMouseMove);
            map.off('mouseleave', getPrefixedLayer(style.id), onMouseLeave);
          }
        });
      }
    };
  }, [
    hoverPopup,
    map,
    styles,
    onMouseEnter,
    onMouseMove,
    onMouseLeave,
    getPrefixedLayer,
  ]);

  useEffect(() => {
    if (map && !isLoading && !isStyleLoading) {
      styles.forEach((style: any) => {
        if (!map || !geojson) return;

        const existingSource = map.getSource(id);

        if (!!existingSource && existingSource.type === 'geojson') {
          existingSource.setData(geojson);
        } else {
          map.addSource(id, {
            type: 'geojson',
            data: geojson,
            tolerance: 0,
          });
        }

        if (!map.getLayer(getPrefixedLayer(style.id))) {
          const layerId = map
            .getStyle()
            .layers.find((layer) => layer.id.includes(layerIdStartsWith))?.id;

          const layers = map.getStyle().layers;
          const bottomLayer = layers.find((layer) =>
            layer.id.startsWith(layerPrefix),
          );
          map.addLayer(
            {
              source: id,
              ...style,
              id: getPrefixedLayer(style.id),
            },
            style.type === 'line' || style.type === 'circle'
              ? layerId
              : style.type === 'fill'
              ? bottomLayer?.id
              : undefined,
          );

          if (!ignoreClick) {
            addClickableLayer(getPrefixedLayer(style.id));
          }
        }

        if (
          previousVisible !== isVisible ||
          isLoading !== previousLoading ||
          isStyleLoading !== previousStyleLoading
        ) {
          if (isVisible) {
            log(`SETTING LAYER ${getPrefixedLayer(style.id)} VISIBLE`);

            map.setLayoutProperty(
              getPrefixedLayer(style.id),
              'visibility',
              'visible',
            );
          } else {
            log(`SETTING LAYER ${getPrefixedLayer(style.id)} HIDDEN`);

            map.setLayoutProperty(
              getPrefixedLayer(style.id),
              'visibility',
              'none',
            );
            setPopupVisible(false);
          }
        }

        const resultFilters: Filter[] = [];

        if (!ignoreFilters) {
          if (filters && filters.length) {
            resultFilters.push(...filters);
          }
        }

        if (resultFilters && resultFilters.length) {
          map.setFilter(
            getPrefixedLayer(style.id),
            resultFilters.filter((filter) => filter),
          );
        } else {
          map.setFilter(getPrefixedLayer(style.id), null);
        }
      });
    }
  }, [
    isLoading,
    geojson,
    id,
    map,
    previousVisible,
    isVisible,
    filters,
    getPrefixedLayer,
    isStyleLoading,
    ignoreFilters,
    styles,
    previousIgnoreFilters,
    previousFilters,
    ignoreClick,
    addClickableLayer,
    previousLoading,
    layerPrefix,
    previousStyleLoading,
  ]);

  return createPortal(renderedPopupContent, popupElement);
};

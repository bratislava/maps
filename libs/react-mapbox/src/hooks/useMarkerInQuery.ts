import { GeoJsonProperties } from '@bratislava/utils/src/types';
import { Feature, FeatureCollection, Point } from 'geojson';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export type UseMarkerInQueryOptions = {
  markersData: FeatureCollection | null;
  selectedMarker: Feature<Point> | null;
  setSelectedMarker: Dispatch<
    SetStateAction<Feature<Point, GeoJsonProperties> | null>
  >;
  // TODO some points are visible only at certain zoom levels (because of clustering) - passing in zoom to display them correctly
  // zoom: number | null;
  // (
  //   feature: Feature<Point, GeoJsonProperties> | null,
  //   zoom: number | null,
  // ) => void;
};

export const useMarkerInQuery = ({
  markersData,
  selectedMarker,
  setSelectedMarker,
}: // zoom,
UseMarkerInQueryOptions) => {
  const [isInitialMarkerSet, setIsInitialMarkerSet] = useState(false);

  // sets marker from query on initial markersData load
  useEffect(() => {
    if (isInitialMarkerSet || !markersData?.features?.length) return;
    setIsInitialMarkerSet(true);
    console.log('going to set marker');
    try {
      const urlParams = new URLSearchParams(window.location.hash.substring(1));
      const markerId = urlParams.get('marker');
      // const parsedZoom = Number.parseInt(urlParams.get('zoom') || '') || null;
      if (typeof markerId === 'string') {
        const marker = markersData.features.find(
          (marker) => marker.id === markerId,
        );
        if (
          marker &&
          (marker.geometry.type === 'Point' || marker.geometry.type) ===
            'MultiPoint'
        )
          console.log('gonna set');
        setSelectedMarker(marker as Feature<Point>);
      }
    } catch (error) {
      console.error(
        'Error when setting initial location on the map- please provide the log below to support email address provided on the page.',
      );
      console.error(error);
    }
  }, [isInitialMarkerSet, markersData?.features, setSelectedMarker]);

  // puts selected marker's id into url query
  useEffect(() => {
    if (!isInitialMarkerSet) return;
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    if (selectedMarker?.id) {
      urlParams.set('marker', selectedMarker.id.toString());
      // if (zoom) {
      //   urlParams.set('zoom', zoom.toString());
      // }
    } else {
      urlParams.delete('marker');
      // urlParams.delete('zoom');
    }
    window.location.hash = urlParams.toString();
  }, [isInitialMarkerSet, selectedMarker?.id]);
};

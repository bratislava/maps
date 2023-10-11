import { GeoJsonProperties, Geometry } from '@bratislava/utils/src/types';
import { Feature, FeatureCollection, Point } from 'geojson';
import { useEffect, useState } from 'react';

export type useMarkerOrFeaturesInQueryOptions = {
  markersData: FeatureCollection | null;
  selectedMarker?: Feature<Point> | null;
  selectedFeatures?: Feature[];
  zoomAtWhichMarkerWasSelected: number | null;
  setSelectedMarkerAndZoom?: (
    feature: Feature<Point, GeoJsonProperties> | null,
    zoom: number | null,
  ) => void;
  setSelectedFeaturesAndZoom?: (
    features: Feature<Geometry, GeoJsonProperties>[] | null,
    zoom: number | null,
  ) => void;
};

export const useMarkerOrFeaturesInQuery = ({
  markersData,
  selectedMarker,
  selectedFeatures,
  setSelectedMarkerAndZoom,
  setSelectedFeaturesAndZoom,
  zoomAtWhichMarkerWasSelected,
}: useMarkerOrFeaturesInQueryOptions) => {
  const [isInitialMarkerSet, setIsInitialMarkerSet] = useState(false);

  // sets marker from query on initial markersData load
  useEffect(() => {
    if (isInitialMarkerSet || !markersData?.features?.length) return;
    setIsInitialMarkerSet(true);
    try {
      const urlParams = new URLSearchParams(window.location.hash.substring(1));
      const markerId = urlParams.get('marker');
      const featuresIds = urlParams.getAll('featureId');
      const parsedZoom = Number.parseInt(urlParams.get('zoom') || '') || null;
      if (typeof markerId === 'string') {
        if (!setSelectedMarkerAndZoom)
          throw new Error(
            'Trying to set marker without setSelectedMarkerAndZoom function',
          );
        const marker = markersData.features.find(
          (marker) => marker.id === markerId,
        );
        if (
          marker &&
          (marker.geometry.type === 'Point' ||
            marker.geometry.type === 'MultiPoint')
        ) {
          setSelectedMarkerAndZoom(marker as Feature<Point>, parsedZoom);
        }
      } else if (featuresIds.length) {
        if (!setSelectedFeaturesAndZoom)
          throw new Error(
            'Trying to set features without setSelectedFeaturesAndZoom function',
          );
        const features = markersData.features.filter((feature) =>
          featuresIds.includes(`${feature.id}`),
        );
        setSelectedFeaturesAndZoom(features, parsedZoom);
      }
    } catch (error) {
      console.error(
        'Error when setting initial location on the map- please provide the log below to support email address provided on the page.',
      );
      console.error(error);
    }
  }, [
    isInitialMarkerSet,
    markersData?.features,
    setSelectedFeaturesAndZoom,
    setSelectedMarkerAndZoom,
  ]);

  // puts selected marker's id into url query
  useEffect(() => {
    if (!isInitialMarkerSet) return;
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    if (selectedMarker?.id) {
      urlParams.set('marker', selectedMarker.id.toString());
      if (zoomAtWhichMarkerWasSelected) {
        urlParams.set('zoom', zoomAtWhichMarkerWasSelected.toString());
      }
    } else if (selectedFeatures?.length) {
      selectedFeatures.forEach((feature) => {
        urlParams.append('featureId', `${feature.id}`);
        if (zoomAtWhichMarkerWasSelected) {
          urlParams.set('zoom', zoomAtWhichMarkerWasSelected.toString());
        }
      });
    } else {
      urlParams.delete('marker');
      urlParams.delete('featureId');
      urlParams.delete('zoom');
    }
    window.location.hash = urlParams.toString();
  }, [
    isInitialMarkerSet,
    selectedMarker?.id,
    zoomAtWhichMarkerWasSelected,
    selectedFeatures,
  ]);
};

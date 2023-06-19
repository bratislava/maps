import { Feature, Point } from 'geojson';
import { FC, useContext, useEffect, useMemo, useState } from 'react';
import groupBy from 'lodash.groupby';
import cloneDeep from 'lodash.clonedeep';
import Supercluster from 'supercluster';
import { filterContext } from '../Filter/Filter';
import { mapboxContext } from '../Mapbox/Mapbox';

export interface IClusterChildProps {
  key: number | string;
  features: Feature<Point>[];
  isCluster: boolean;
  clusterExpansionZoom: number | null;
  lat: number;
  lng: number;
}

export interface IClusterProps {
  features: Feature[];
  children: FC<IClusterChildProps>;
  radius?: number;
}

export const Cluster = ({
  children,
  features,
  radius = 100,
}: IClusterProps) => {
  const { isFeatureVisible } = useContext(filterContext);

  const pointFeatures = useMemo(
    () =>
      features.filter(
        (f) => f.geometry.type === 'Point',
      ) as Supercluster.PointFeature<Supercluster.AnyProps>[],
    [features],
  );

  const adjustCoordinates = (
    featuresToFilter: Supercluster.PointFeature<Supercluster.AnyProps>[],
  ) => {
    // group features with same coordinates
    const groupedFeatures = groupBy(featuresToFilter, (f) =>
      // pragmatic identity, should not be problematic on the 'numbers' used in point coordinates
      f.geometry.coordinates.join(','),
    );

    console.log('original: ', featuresToFilter);
    console.log('grouped: ', groupedFeatures);

    // split the features with same coordinates into a line side-by-side
    return Object.values(groupedFeatures).reduce((acc, curr) => {
      return [
        ...acc,
        ...curr.map((feature, index) => {
          const updatedFeature = cloneDeep(feature);
          updatedFeature.geometry.coordinates[0] =
            updatedFeature.geometry.coordinates[0] + index * 0.0001;
          return updatedFeature;
        }),
      ];
    }, []);
  };

  // This filter is workeround to prevent unselectable multiple features with exact coordinates
  const pointFeaturesUpdated = useMemo(
    () => adjustCoordinates(pointFeatures),
    [pointFeatures],
  );

  const { map } = useContext(mapboxContext);

  const [clusters, setClusters] = useState<Array<IClusterChildProps>>([]);

  useEffect(() => {
    const recalculate = (): void => {
      if (!map) return;

      const zoom: number = map.getZoom();

      // Dynamic bbox
      // const bounds: mapboxgl.LngLatBounds = map.getBounds();
      // const bbox: [number, number, number, number] = [
      //   bounds.getWest(),
      //   bounds.getSouth(),
      //   bounds.getEast(),
      //   bounds.getNorth(),
      // ];

      // Static bbox
      const bbox: [number, number, number, number] = [
        16.847534, 47.734705, 18.400726, 48.841221,
      ];

      const supercluster: Supercluster<
        Supercluster.AnyProps,
        Supercluster.AnyProps
      > = new Supercluster({ radius, maxZoom: 30 });
      supercluster.load(
        pointFeaturesUpdated.filter((f) =>
          isFeatureVisible === undefined ? true : isFeatureVisible(f),
        ),
      );

      const newClusters: Array<IClusterChildProps> = supercluster
        .getClusters(bbox, zoom ?? 0)
        .map((cluster, key) => {
          const isCluster: boolean =
            cluster.properties.cluster_id !== undefined;

          if (isCluster) {
            const features = supercluster.getLeaves(
              cluster.properties.cluster_id,
              Infinity,
            );
            return {
              key: features[0].id ?? key,
              features,
              lng: cluster.geometry.coordinates[0],
              lat: cluster.geometry.coordinates[1],
              isCluster,
              clusterExpansionZoom: supercluster.getClusterExpansionZoom(
                cluster.properties.cluster_id,
              ),
            };
          } else {
            return {
              key: cluster.id ?? key,
              features: [cluster],
              lng: cluster.geometry.coordinates[0],
              lat: cluster.geometry.coordinates[1],
              isCluster,
              clusterExpansionZoom: null,
            };
          }
        });

      setClusters(newClusters);
    };

    // Do not remove this recalculation block, it recalculates features by Map moving and filtering and scrolling
    recalculate();
    const timer = setTimeout(recalculate, 10);
    map?.on('move', recalculate);
    return () => {
      map?.off('move', recalculate);
      clearTimeout(timer);
    };
  }, [map, isFeatureVisible, radius, pointFeaturesUpdated]);

  return <>{clusters.map((cluster) => children(cluster))}</>;
};
